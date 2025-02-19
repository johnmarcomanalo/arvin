<?php

namespace App\Console\Commands;
use Illuminate\Support\Facades\DB;
use App\Models\SalesDailyOutSettingsAnnualQuotaClientGroups;
use App\Models\SalesDailyOutSettingsClientSubGroups;
use App\Models\SalesDailyOutClientSalesTrackers;
use App\Models\RefProductGroups;
use Illuminate\Console\Command;
use Carbon\Carbon;

class UpdateSalesTrackerClient extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'command:sales-tracker-client';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Update sales tracker client records for the latest five days';

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

    public function getFiveDaysClientSalesTrackerbyCurrentDate() {
        $records = [];
        $currentYear = Carbon::now()->format('Y');


        $data_quota = SalesDailyOutSettingsAnnualQuotaClientGroups::where('year_sales_target',$currentYear)->whereNull('deleted_at')->get();
        $card_codes = [];
        $datalist = [];
        foreach ($data_quota as $value) {
            $subgroups = SalesDailyOutSettingsClientSubGroups::where('sales_daily_out_settings_client_groups_code',$value->sales_daily_out_settings_client_group_code)->get();
            $card_codes =  $subgroups->pluck('customer_code')->implode("','") ;
            $productGroup = RefProductGroups::where('code',$value->ref_product_groups_code)->first();
            
            $datalist = (SalesDailyOutClientSalesTrackers::where('year_sales_target', $currentYear)
                    ->where('ref_product_groups_description', $productGroup->description)
                    ->where('sales_daily_out_settings_annual_quota_client_groups_code', $value->sales_daily_out_settings_client_group_code)
                    ->whereNull('deleted_at')
                    ->get());

            
            $records = DB::select("exec dbo.sales_daily_out_delivery_return_cm_client_based_v2_5_days ?,?,?",array($currentYear,"'".$card_codes."'",$productGroup->description));
        
            if(!empty($records)){
                foreach ($records as $record) {
                    $date = Carbon::parse($record->createdate)->format('Y-m-d');

                    if (!isset($recordsByDate[$date])) {
                        $recordsByDate[$date] = [
                            'sales_date' => $record->createdate,
                            'sales_daily_out' => $record->QtyInKg,
                            'ref_product_groups_description' => $record->u_groupcategory
                        ];
                    } else {
                        $recordsByDate[$date]['sales_daily_out'] += $record->QtyInKg;
                    }
                }
                
                $results = array_values($recordsByDate);

                foreach ($datalist as $datalist_value) {
                    $sales_daily_qouta = $datalist_value['sales_daily_qouta'];
                    $sales_date = Carbon::parse($datalist_value['sales_date'])->format('Y-m-d');
                        foreach ($results as $result) {
                            $result_date = Carbon::parse($result['sales_date'])->format('Y-m-d');
                            if($sales_date == $result_date){
                                $computation = $this->get_status_daily_target_and_percentage_daily_target_by_daily_out($result['sales_daily_out'],$sales_daily_qouta);
                                $final_results[] = [
                                    'year_sales_target' => $currentYear,
                                    'sales_daily_out_settings_annual_quota_client_groups_code' => $value->sales_daily_out_settings_client_group_code,
                                    'sales_daily_out' => $result['sales_daily_out'],
                                    'ref_product_groups_description' => $result['ref_product_groups_description'],
                                    'sales_date' => $result['sales_date'],
                                    'sales_daily_target' => $computation['status_daily_target'],
                                    'daily_sales_target_percentage' => $computation['percentage_daily_target'],
                                    'modified_by' => 'SAP',
                                ]; 
                            }
                        }
                }
                $batchSize = 50; // Update 50 records at a time
                $counter = 0;

                foreach ($final_results as $value) {
                    DB::table('sales_daily_out_client_sales_trackers')
                        ->where('sales_daily_out_settings_annual_quota_client_groups_code', $value['sales_daily_out_settings_annual_quota_client_groups_code'])
                        ->where('ref_product_groups_description',  $value['ref_product_groups_description'])
                        ->where('sales_date',  $value['sales_date'])
                        ->update([
                            'sales_daily_out' => $value['sales_daily_out'],
                            'sales_daily_target' => $value['sales_daily_target'],
                            'daily_sales_target_percentage' => $value['daily_sales_target_percentage'],
                            'updated_at' => now(),
                            'modified_by' => $value['modified_by'],
                        ]);
                    $counter++;

                    // Add a delay after every 50 updates
                    if ($counter % $batchSize == 0) {
                        sleep(2); // Add a 2-second delay to avoid overloading the database
                    }
                }
            }
        }
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
