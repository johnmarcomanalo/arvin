<?php

namespace App\Console\Commands;

use App\Models\RefClientsSalesOutLogs;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;
use App\Http\Controllers\MainController;
use App\Http\Controllers\SalesDailyOutTrackersController;
use App\Models\SalesDailyOutSettingsAnnualQuotaClientGroups;
use App\Models\SalesDailyOutSettingsClientSubGroups;
use App\Models\SalesDailyOutClientSalesTrackers;

class UpdateRefClientsSalesOutLogs extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'command:update-client-sales-out-logs';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Command description';

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
        return 0;
    }

    public function postRefClientsSalesOutLogs()
    {
         try {
            DB::beginTransaction();
            $salesDailyOutTrackersController = new SalesDailyOutTrackersController();

            $currentYear = Carbon::now()->format('Y');
            $records = DB::select("exec dbo.sales_daily_out_delivery_return_cm_client_based_v2_5_days ?", [$currentYear]);

            if (empty($records)) {
                DB::rollBack();
                return response([
                    'message' => 'No records to process.',
                    'result' => true,
                    'status' => 'success',
                    'title' => 'Success',
                ], 200);
            }
            
            $insertedData = []; // <-- Initialize array to collect new inserts
            $updatedLogs = [];

            foreach ($records as $value) {
                $exists = RefClientsSalesOutLogs::where('customer_code', $value->CardCode)
                    ->where('customer_description', $value->CardName)
                    ->where('product', $value->u_groupcategory)
                    ->where('sales_daily_out', $value->QtyInKg)
                    ->where('type', $value->type)
                    ->where('warehouse', $value->warehouse)
                    ->whereDate('sales_date', Carbon::parse($value->createdate)->format('Y-m-d'))
                    ->where('docentry', $value->docentry)
                    ->where('docnum', $value->docnum)
                    ->where('trans_type', $value->trans_type)
                    ->exists();

                if (!$exists) {
                    $currentCode = MainController::generate_code('App\Models\RefClientsSalesOutLogs', 'code');

                    $newEntry = [
                        'code' => $currentCode,
                        'customer_code' => $value->CardCode,
                        'customer_description' => $value->CardName,
                        'product' => $value->u_groupcategory,
                        'sales_daily_out' => $value->QtyInKg,
                        'type' => $value->type,
                        'warehouse' => $value->warehouse,
                        'sales_date' => $value->createdate,
                        'docentry' => $value->docentry,
                        'docnum' => $value->docnum,
                        'trans_type' => $value->trans_type,
                        'status' => 0,
                        'added_by' => 'SAP',
                        'modified_by' => 'SAP',
                        // 'created_at' => now(),
                        // 'updated_at' => now(),
                    ];

                    RefClientsSalesOutLogs::insert($newEntry);
                    $insertedData[] = $newEntry; // <-- Collect the inserted entry
                }
            }

            // --- Processing quotas if there were new inserts ---
            if (!empty($insertedData)) {
                $customerCodes = collect($insertedData)->pluck('customer_code')->values();
                $groups = SalesDailyOutSettingsClientSubGroups::whereIn('customer_code', $customerCodes)->get();

                // Group inserted data by customer code for easy lookup
                $groupedInsertedData = collect($insertedData)->groupBy('customer_code');

                $quotas = [];

                foreach ($groups as $group) {
                    $customerCode = $group->customer_code;
                    $customerInsertedRecords = $groupedInsertedData[$customerCode] ?? [];

                    foreach ($customerInsertedRecords as $record) {
                        $quota = SalesDailyOutSettingsAnnualQuotaClientGroups::join(
                                'ref_product_groups',
                                'sales_daily_out_settings_annual_quota_client_groups.ref_product_groups_code',
                                '=',
                                'ref_product_groups.code'
                            )
                            ->where('sales_daily_out_settings_client_group_code', $group->sales_daily_out_settings_client_groups_code)
                            ->where('type', $record['type'])
                            ->where('subsection', $group->subsection)
                            ->where('ref_product_groups.description', $record['product'])
                            ->where('year_sales_target', $currentYear)
                            ->first([
                                'sales_daily_out_settings_annual_quota_client_groups.*',
                                'ref_product_groups.description as product_description'
                            ]);

                        if ($quota) {
                            // Save quota + sales_date + amount from insertedData for later update
                            $quotas[] = [
                                'quota_code' => $quota->code,
                                'sales_date' => $record['sales_date'],
                                'sales_daily_out' => $record['sales_daily_out'],
                                'docentry' => $record['docentry'],
                                'docnum' => $record['docnum'],
                                'trans_type' => $record['trans_type'],
                                'type' => $record['type'],
                                'warehouse' => $record['warehouse'],
                                'product' => $record['product'],
                                'customer_code' => $record['customer_code']
                            ];
                        }
                    }
                }
                // Now apply updates to SalesDailyOutClientSalesTrackers
                if (!empty($quotas)) {
                    foreach ($quotas as $q) {
                        $new_daily_out = 0;
                         $data = SalesDailyOutClientSalesTrackers::where('sales_daily_out_settings_annual_quota_client_groups_code', $q['quota_code'])
                            ->whereDate('sales_date', $q['sales_date'])
                            ->first();
                        if ($data) {
                            $new_daily_out = $data['sales_daily_out'] + $q['sales_daily_out'];
                            $computation = $salesDailyOutTrackersController->get_status_daily_target_and_percentage_daily_target_by_daily_out(
                                $new_daily_out,
                                $data['sales_daily_qouta']
                            );
                            $data->update([
                                'sales_daily_out' => $new_daily_out,
                                'sales_daily_target' => $computation['status_daily_target'],
                                'daily_sales_target_percentage' => $computation['percentage_daily_target']
                            ]);
                            $updatedLogs[] = $q;
                        }
                    }
                }

                if (!empty($updatedLogs)) {
                    foreach ($updatedLogs as $value) {
                        RefClientsSalesOutLogs::where('customer_code', $value['customer_code'])
                            ->where('product', $value['product'])
                            ->where('type', $value['type'])
                            ->where('sales_daily_out', $value['sales_daily_out'])
                            ->where('warehouse', $value['warehouse'])
                            ->where('sales_date', $value['sales_date'])
                            ->where('docentry', $value['docentry'])
                            ->where('docnum', $value['docnum'])
                            ->where('trans_type', $value['trans_type'])
                            ->where('status',0)
                            ->update(['status' => 1,'updated_at' => now()]);
                    }
                }
            }


            DB::commit();

            return response([
                'message' => 'Records processed successfully.',
                'result' => true,
                'status' => 'success',
                'title' => 'Success',
                // 'inserted_count' => count($toInsert),
            ], 200);

        } catch (\Throwable $e) {
            DB::rollBack();

            return response([
                'message' => 'An error occurred: ' . $e->getMessage(),
                'result' => false,
                'status' => 'error',
                'title' => 'Error',
            ], 500);
        }
    }
}
