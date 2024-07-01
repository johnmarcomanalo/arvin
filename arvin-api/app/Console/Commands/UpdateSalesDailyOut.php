<?php

namespace App\Console\Commands;
use Illuminate\Support\Facades\DB;
use App\Models\RefSubSections;
use Illuminate\Console\Command;
use Carbon\Carbon;
use App\Models\SalesDailyOuts;

class UpdateSalesDailyOut extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'update:sales-daily-out';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Update sales daily out records for the latest five days';

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
        // Call the function to update sales daily out
        $this->getFiveDaysSalesDailyOutbyCurrentDate();
        
        // Add a message to indicate success
        $this->info('Sales daily out records updated successfully.');
    }

    private function getFiveDaysSalesDailyOutbyCurrentDate(){
        $records = DB::table('vw_daily_sales_latest_five_days')->get();
        $subSections = RefSubSections::whereIn('type', $records->pluck('warehouse'))->get()->keyBy('type');
        $recordsByDateAndWarehouse = [];

        foreach ($records as $record) {
            $date = Carbon::parse($record->createdate)->format('Y-m-d');
            $recordsByDateAndWarehouse[$date][$record->warehouse] = $record;
        }

        foreach ($recordsByDateAndWarehouse as $date => $warehouseRecords) {
            $carbonDate = Carbon::parse($date);

            if ($carbonDate->isSunday()) {
                // Find the corresponding Monday
                $mondayDate = $carbonDate->addDay()->format('Y-m-d');

                foreach ($warehouseRecords as $warehouse => $record) {
                    if (!isset($recordsByDateAndWarehouse[$mondayDate][$warehouse])) {
                        // Initialize Monday's record if it doesn't exist
                        $recordsByDateAndWarehouse[$mondayDate][$warehouse] = (object)[
                            'warehouse' => $warehouse,
                            'createdate' => $mondayDate,
                            'QtyInKg' => 0
                        ];
                    }
                    // Add Sunday's QtyInKg to Monday's QtyInKg for the same warehouse
                    $sundayQty = (float) $record->QtyInKg;
                    $recordsByDateAndWarehouse[$mondayDate][$warehouse]->QtyInKg += $sundayQty;
                }
            }
        }

        $results = [];

        foreach ($recordsByDateAndWarehouse as $date => $warehouseRecords) {
            $carbonDate = Carbon::parse($date);
            if (!$carbonDate->isSunday()) {
                foreach ($warehouseRecords as $warehouse => $record) {
                    $results[] = [
                        'warehouse' => $record->warehouse,
                        'createdate' => $record->createdate,
                        'QtyInKg' => $record->QtyInKg
                    ];
                }
            }
        }

        DB::transaction(function() use ($results, $subSections) {
            $currentDate = Carbon::now()->format('Y-m-d');
            foreach ($results as $record) {
                $warehouse = $record['warehouse'];
                $create_date = Carbon::parse($record['createdate'])->format('Y-m-d');
                $sales_daily_out = round($record['QtyInKg'], 2);
                $sub_section_code = $subSections[$warehouse]->code ?? null;

                if ($sub_section_code) {
                    $datalist = SalesDailyOuts::where('subsection_code', $sub_section_code)
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
