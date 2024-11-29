<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\DB;
use App\Models\RefSubSections;
use Carbon\Carbon;
use App\Models\SalesDailyOutTrackers;

class UpdateSalesTracker extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'update:sales-tracker';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Update sales tracker records for the latest five days';

    /**
     * Create a new command instance.
     *
     * @return void
     */
    public function __construct()
    {
        parent::__construct();
    }

    /**
     * Execute the console command.
     *
     * @return int
     */
    public function handle()
    {
         $this->getFiveDaysSalesTrackerbyCurrentDate();
        
        // Add a message to indicate success
        $this->info('Sales tracker records updated successfully.');
    }

    public function getFiveDaysSalesTrackerbyCurrentDate() {
        $records = [];
        DB::table('vw_sales_daily_out_delivery_return_cm_latest_five_days')
            ->select('warehouse', 'createdate','u_groupcategory', 'QtyInKg') // Select only necessary columns
            ->orderBy('createdate')
            ->chunk(1000, function ($chunk) use (&$records) {
                foreach ($chunk as $record) {
                    $records[] = $record;
                }
            });
        
        // Convert $records array to a Collection
        $recordsCollection = collect($records);

        $subSections = RefSubSections::whereIn('type', $recordsCollection->pluck('warehouse'))->get()->keyBy('type');
        $recordsByDateAndWarehouse = [];

        foreach ($recordsCollection as $record) {
            $date = Carbon::parse($record->createdate)->format('Y-m-d');
            $recordsByDateAndWarehouse[$date][$record->warehouse][$record->u_groupcategory] = $record;
        }

        foreach ($recordsByDateAndWarehouse as $date => $warehouseRecords) {
            $carbonDate = Carbon::parse($date);

            if ($carbonDate->isSunday()) {
                // Find the corresponding Monday
                $mondayDate = $carbonDate->addDay()->format('Y-m-d');

                foreach ($warehouseRecords as $warehouse => $groupRecords) {
                    foreach ($groupRecords as $u_groupcategory => $record) {
                        // Check if Monday's record for the same warehouse and u_groupcategory exists
                        if (!isset($recordsByDateAndWarehouse[$mondayDate][$warehouse][$u_groupcategory])) {
                            // Initialize Monday's record if it doesn't exist
                            $recordsByDateAndWarehouse[$mondayDate][$warehouse][$u_groupcategory] = (object)[
                                'warehouse' => $warehouse,
                                'createdate' => $mondayDate,
                                'u_groupcategory' => $u_groupcategory,
                                'QtyInKg' => 0
                            ];
                        }

                        // Add Sunday's QtyInKg to Monday's QtyInKg for the same warehouse and u_groupcategory
                        $sundayQty = (float) $record->QtyInKg;
                        $recordsByDateAndWarehouse[$mondayDate][$warehouse][$u_groupcategory]->QtyInKg += $sundayQty;
                    }
                }
            }
        }
        $results = [];

        foreach ($recordsByDateAndWarehouse as $date => $warehouseRecords) {
            $carbonDate = Carbon::parse($date);
            if (!$carbonDate->isSunday()) {
                foreach ($warehouseRecords as $warehouse => $groupRecords) {
                    foreach ($groupRecords as $u_groupcategory => $record) {
                        $results[] = [
                            'warehouse' => $record->warehouse,
                            'createdate' => $record->createdate,
                            'ref_product_groups_description' => $record->u_groupcategory,
                            'QtyInKg' => $record->QtyInKg
                        ];
                    }
                }
            }
        }

        DB::transaction(function() use ($results, $subSections) {
            $currentDate = Carbon::now()->format('Y-m-d');
            foreach ($results as $record) {
                $ref_product_groups_description = $record['ref_product_groups_description'];
                $warehouse = $record['warehouse'];
                $create_date = Carbon::parse($record['createdate'])->format('Y-m-d');
                $sales_daily_out = round($record['QtyInKg'], 4);
                $sub_section_code = $subSections[$warehouse]->code ?? null;

                if ($sub_section_code) {
                    $datalist = SalesDailyOutTrackers::where('subsection_code', $sub_section_code)
                                            ->where('ref_product_groups_description', $ref_product_groups_description)
                                            ->whereDate('sales_date', $create_date)
                                            ->first();
                    if ($datalist && ($datalist->sales_daily_out < $sales_daily_out || $currentDate == $create_date)) {
                        $computation = $this->get_status_daily_target_and_percentage_daily_target_by_daily_out($sales_daily_out, $datalist->sales_daily_qouta);

                        $datalist->update([
                            'sales_daily_out' => $sales_daily_out,
                            'sales_daily_target' => $computation["status_daily_target"],
                            'daily_sales_target_percentage' => $computation["percentage_daily_target"],
                            'modified_by' => 'SAP',
                        ]);
                    }
                }
            }
        });
    }

    private function get_status_daily_target_and_percentage_daily_target_by_daily_out($daily_out,$daily_quota){
        if (!is_numeric($daily_out)) {
            $daily_out = 0; // Set $daily_out to zero if it's not a number
        }
        $percentage_daily_target = 100;
        $status_daily_target = $daily_out - $daily_quota;
        $percentage_daily_target *=  $status_daily_target / $daily_quota;
        $response = [
                    "status_daily_target"=>round($status_daily_target,2),
                    "percentage_daily_target"=>round($percentage_daily_target,2),
                ];
        return $response;
    }
}
