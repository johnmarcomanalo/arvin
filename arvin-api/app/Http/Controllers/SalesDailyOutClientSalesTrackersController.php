<?php

namespace App\Http\Controllers;

use App\Models\SalesDailyOutClientSalesTrackers;
use Illuminate\Http\Request;
use Carbon\Carbon;
use Illuminate\Support\Facades\Crypt;
use Illuminate\Support\Facades\DB;
use App\Models\SalesDailyOutSettingsClientSubGroups;
use App\Models\SalesDailyOutSettingsAnnualQuotaClientGroups;
use App\Models\RefClientsSalesOutLogs;
use App\Models\RefProductGroups;
use App\Models\UsersAccounts;
use App\Models\User;
use Illuminate\Pagination\LengthAwarePaginator;
use SebastianBergmann\LinesOfCode\Counter;


class SalesDailyOutClientSalesTrackersController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        // 
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        //
    }

    /**
     * Display the specified resource.
     *
     * @param  \App\Models\SalesDailyOutClientSalesTrackers  $salesDailyOutClientSalesTrackers
     * @return \Illuminate\Http\Response
     */
    public function show(SalesDailyOutClientSalesTrackers $salesDailyOutClientSalesTrackers)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Models\SalesDailyOutClientSalesTrackers  $salesDailyOutClientSalesTrackers
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, SalesDailyOutClientSalesTrackers $salesDailyOutClientSalesTrackers)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Models\SalesDailyOutClientSalesTrackers  $salesDailyOutClientSalesTrackers
     * @return \Illuminate\Http\Response
     */
    public function destroy(SalesDailyOutClientSalesTrackers $salesDailyOutClientSalesTrackers)
    {
        //
    }


    public function get_client_sales_tracker(Request $request){
        $selected_year = $request->query('y');
        $selected_month = $request->query('m');
        $selected_product = $request->query('pr');
        $selected_group_code = $request->query('c');
        $bdo = $request->query('b'); 
        $type = $request->query('t'); 
        $warehouse = $request->query('w'); 
        $limit = $request->query('tl'); 
        $page = $request->query('tp'); 

        $dataListArray = DB::select("SET NOCOUNT ON  exec dbo.GetSalesDailyOutClientSalesTrackers ?,?,?,?,?,?,?",array($selected_year,$selected_month,$selected_product,$selected_group_code,$bdo,$type,$warehouse));
         $dataListCollection = collect($dataListArray);
        $currentPageItems = $dataListCollection->slice(($page - 1) * $limit, $limit)->values();
        $dataList = new LengthAwarePaginator($currentPageItems, $dataListCollection->count(), $limit, $page, [
            'path' => url()->current(),
            'query' => $request->query(),
        ]);
        $response = [
            "dataList" => $dataList,
            'result' => true,
            'title' => 'Success',
            'status' => 'success',
            'message' => 'Data retrieved successfully.',
        ];
        return Crypt::encryptString(json_encode($response));
    }

    
 

    public function get_mtd($selected_year, $selected_month,$bdo,$selected_product,$groupCode){
            $mtd_total_daily_qouta_amount = 0;
            $mtd_total_daily_out_amount = 0;
            $mtd_total_status_daily_target = 0;
            $mtd_final_percentage = 0;

            $firstDayOfMonth = Carbon::createFromDate($selected_year, $selected_month)->startOfMonth();
            $lastDayOfMonth = Carbon::createFromDate($selected_year, $selected_month)->endOfMonth();

            $currentDateTime =  MainController::formatSingleDigitMonthOnly(date('Y-m-d'));
            $LastMonthDate =  MainController::formatSingleDigitMonthOnly($lastDayOfMonth);
            $LastOrCurrentDateOfTheMonth = $currentDateTime == $LastMonthDate ? Carbon::now() : $lastDayOfMonth;
            
            $mtd_data_list = SalesDailyOutClientSalesTrackers::where('year_sales_target', $selected_year)
                ->when(!empty($selected_product), fn($qry) => $qry->where('ref_product_groups_description', $selected_product))
                ->when(!empty($bdo), fn($qry) => $qry->where('bdo', $bdo))
                ->when(!empty($groupCode), fn($qry) => $qry->where('sales_daily_out_settings_annual_quota_client_groups_code', $groupCode))
                ->whereBetween('sales_date', [$firstDayOfMonth, $LastOrCurrentDateOfTheMonth])
                ->whereNull('deleted_at')
                ->get();

            foreach ($mtd_data_list as $value) {
                $mtd_total_daily_qouta_amount += (float)($value["sales_daily_qouta"] ?? 0);
                $mtd_total_daily_out_amount += (float)($value["sales_daily_out"] ?? 0);
                $mtd_total_status_daily_target += (float)($value["sales_daily_target"] ?? 0);
            }

            if($mtd_total_daily_qouta_amount > 0){
                $mtd_final_percentage = (($mtd_total_daily_out_amount / $mtd_total_daily_qouta_amount) - 1) * 100; 
            }

            return [
               'mtd_total_daily_qouta_amount' => $mtd_total_daily_qouta_amount,
               'mtd_total_daily_out_amount' => $mtd_total_daily_out_amount,
               'mtd_total_status_daily_target' => $mtd_total_status_daily_target,
               'mtd_final_percentage' => $mtd_final_percentage,
            ];
    }

    public function get_ytd($selected_year, $selected_month,$bdo,$selected_product,$groupCode){
            $ytd_total_daily_qouta_amount = 0;
            $ytd_total_daily_out_amount = 0;
            $ytd_total_status_daily_target = 0;
            $ytd_final_percentage = 0;

            $januaryFirst = Carbon::create($selected_year, 1, 1)->startOfDay();
            $lastDayOfMonth = Carbon::createFromDate($selected_year, $selected_month)->endOfMonth();

            $currentDateTime =  MainController::formatSingleDigitMonthOnly(date('Y-m-d'));
            $LastMonthDate =  MainController::formatSingleDigitMonthOnly($lastDayOfMonth);
            $LastOrCurrentDateOfTheMonth = $currentDateTime == $LastMonthDate ? Carbon::now() : $lastDayOfMonth;

            $ytd_data_list = SalesDailyOutClientSalesTrackers::where('year_sales_target', $selected_year)
                ->when(!empty($selected_product), fn($qry) => $qry->where('ref_product_groups_description', $selected_product))
                ->when(!empty($bdo), fn($qry) => $qry->where('bdo', $bdo))
                ->when(!empty($groupCode), fn($qry) => $qry->where('sales_daily_out_settings_annual_quota_client_groups_code', $groupCode))
                ->whereBetween('sales_date', [$januaryFirst, $LastOrCurrentDateOfTheMonth])
                ->whereNull('deleted_at')
                ->get();


            foreach ($ytd_data_list as $value) {
                $ytd_total_daily_qouta_amount += (float)($value["sales_daily_qouta"] ?? 0);
                $ytd_total_daily_out_amount += (float)($value["sales_daily_out"] ?? 0);
                $ytd_total_status_daily_target += (float)($value["sales_daily_target"] ?? 0);
            }

            if($ytd_total_daily_qouta_amount > 0){
                $ytd_final_percentage = (($ytd_total_daily_out_amount / $ytd_total_daily_qouta_amount) - 1) * 100; 
            }

            return [
               'ytd_total_daily_qouta_amount' => $ytd_total_daily_qouta_amount,
               'ytd_total_daily_out_amount' => $ytd_total_daily_out_amount,
               'ytd_total_status_daily_target' => $ytd_total_status_daily_target,
               'ytd_final_percentage' => $ytd_final_percentage,
            ];
    }


    public function insert_sap_client_sales_tracker($selected_year,$code_annual_quota,$json_records,$type,$subsection){
        try {
            // DB::transaction(function () use ($selected_year, $selected_group_code, $json_records) {
                $salesDailyOutTrackersController = new SalesDailyOutTrackersController();
                $datalist = SalesDailyOutClientSalesTrackers::where('sales_daily_out_settings_annual_quota_client_groups_code', $code_annual_quota)
                            // ->whereNull('deleted_at')
                            ->get();

                $records = json_decode($json_records);
                $recordsByDate = [];
                $final_results = [];

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

                foreach ($datalist as $value) {
                    $sales_daily_qouta = $value['sales_daily_qouta'];
                    $sales_date = Carbon::parse($value['sales_date'])->format('Y-m-d');

                    foreach ($results as $result) {
                        $result_date = Carbon::parse($result['sales_date'])->format('Y-m-d');

                        if ($sales_date == $result_date) {
                            $computation = $salesDailyOutTrackersController
                                ->get_status_daily_target_and_percentage_daily_target_by_daily_out(
                                    $result['sales_daily_out'],
                                    $sales_daily_qouta
                                );

                            $final_results[] = [
                                'year_sales_target' => $selected_year,
                                'sales_daily_out_settings_annual_quota_client_groups_code' => $code_annual_quota,
                                'sales_daily_out' => $result['sales_daily_out'],
                                'ref_product_groups_description' => $result['ref_product_groups_description'],
                                'sales_date' => $result['sales_date'],
                                'sales_daily_target' => $computation['status_daily_target'],
                                'daily_sales_target_percentage' => $computation['percentage_daily_target'],
                                'type' => $type,
                                'subsection' => $subsection,
                                'modified_by' => 'SAP',
                            ];
                        }
                    }
                }  

                $batchSize = 50;
                $counter = 0;
                foreach ($final_results as $value) {
                    DB::table('sales_daily_out_client_sales_trackers')
                        ->where('sales_daily_out_settings_annual_quota_client_groups_code', $code_annual_quota)
                        // ->where('ref_product_groups_description',  $value['ref_product_groups_description'])
                        ->where('sales_date',  $value['sales_date'])
                        ->update([
                            'sales_daily_out' => $value['sales_daily_out'],
                            'sales_daily_target' => $value['sales_daily_target'],
                            'daily_sales_target_percentage' => $value['daily_sales_target_percentage'],
                            'modified_by' => $value['modified_by']
                        ]);

                    $counter++;
                    if ($counter % $batchSize == 0) {
                        sleep(2);
                    }
                }


            // });
        } catch (\Throwable $e) {
            DB::rollBack(); // Rollback transaction on error
               return response([
                'message' => 'An error occurred: ' . $e->getMessage(),
                'result' => false,
                'status' => 'error',
                'title' => 'Error',
            ], 500);
        }
    } 
    
    public function getFiveDaysClientSalesTrackerbyCurrentDate() {
        $salesDailyOutTrackersController = new SalesDailyOutTrackersController();
        $records = [];
        $currentYear = Carbon::now()->format('Y');


        // $data_quota = SalesDailyOutSettingsAnnualQuotaClientGroups::where('year_sales_target',$currentYear)->whereNull('deleted_at')->get();
        return $data_quota = SalesDailyOutSettingsAnnualQuotaClientGroups::join(
            'sales_daily_out_settings_client_groups', 
            'sales_daily_out_settings_annual_quota_client_groups.sales_daily_out_settings_client_group_code', 
            '=', 
            'sales_daily_out_settings_client_groups.code'
        )
        ->where('sales_daily_out_settings_annual_quota_client_groups.year_sales_target', $currentYear)
        ->where('sales_daily_out_settings_client_groups.description', 'LIKE', '%FIRST PGMC ENTERPRISES INC%')
        ->whereNull('sales_daily_out_settings_annual_quota_client_groups.deleted_at')
        ->get();


        $card_codes = [];
        $datalist = [];
        foreach ($data_quota as $value) {
            return $value->code;
             $subgroups = SalesDailyOutSettingsClientSubGroups::where('sales_daily_out_settings_client_groups_code',$value->sales_daily_out_settings_client_group_code)->get();
             $card_codes =  $subgroups->pluck('customer_code')->implode("','") ;
            $productGroup = RefProductGroups::where('code',$value->ref_product_groups_code)->first();
            
            return $datalist = (SalesDailyOutClientSalesTrackers::where('year_sales_target', $currentYear)
                    ->where('ref_product_groups_description', $productGroup->description)
                    ->where('sales_daily_out_settings_annual_quota_client_groups_code', $value->code)
                    ->whereBetween('sales_date', [Carbon::now()->subDays(6)->toDateString(), Carbon::now()->toDateString()])
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
                                $computation = $salesDailyOutTrackersController->get_status_daily_target_and_percentage_daily_target_by_daily_out($result['sales_daily_out'],$sales_daily_qouta);
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
                // return $final_results;
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
                            'modified_by' => $value['modified_by']
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
    public function client_sales_tracker(Request $request)
    {
        $selected_year = $request->query('y');
        $selected_month = $request->query('m');
        $selected_product = $request->query('pr');
        $selected_group_code = $request->query('c');
        $bdo = $request->query('b'); 
        $type = $request->query('t'); 
        $warehouse = $request->query('w'); 
        $limit = $request->query('tl'); 
        $page = $request->query('tp'); 
        $dataListCollection = [];
        $dataList = [];

        // Execute stored procedure
        $dataListArray = DB::select(
            "SET NOCOUNT ON; EXEC dbo.GetSalesDailyOutClientSalesTrackers ?,?,?,?,?,?,?",
            [$selected_year, $selected_month, $selected_product, $selected_group_code, $bdo, $type, $warehouse]
        );

        if(!empty($dataListArray)){
            $dataListCollection = collect($dataListArray)->map(function ($item) {
                $item = (array) $item; // Convert stdClass to array
        
                $item['1-7'] = number_format((float) $item['1-7'], 2);
                $item['8-14'] = number_format((float) $item['8-14'], 2);
                $item['15-21'] = number_format((float) $item['15-21'], 2);
                $item['22-30/31'] = number_format((float) $item['22-30/31'], 2);
                $item['mtd_percentage'] = number_format((float) $item['mtd_percentage'], 2);
                $item['week_one_percentage'] = number_format((float) $item['week_one_percentage'], 2);
                $item['week_two_percentage'] = number_format((float) $item['week_two_percentage'], 2);
                $item['week_three_percentage'] = number_format((float) $item['week_three_percentage'], 2);
                $item['week_three_percentage'] = number_format((float) $item['week_three_percentage'], 2);
                $item['week_four_percentage'] = number_format((float) $item['week_four_percentage'], 2);
                $item['month_sales_daily_out'] = number_format((float) $item['month_sales_daily_out'], 2);
                $item['month_sales_daily_qouta'] = number_format((float) $item['month_sales_daily_qouta'], 2);
                $item['mtd_final_percentage'] = number_format((float) $item['mtd_final_percentage'], 2);
                $item['mtd_total_daily_out_amount'] = number_format((float) $item['mtd_total_daily_out_amount'], 2);
                $item['mtd_total_daily_qouta_amount'] = number_format((float) $item['mtd_total_daily_qouta_amount'], 2);
                $item['mtd_total_status_daily_target'] = number_format((float) $item['mtd_total_status_daily_target'], 2);
                $item['ytd_total_daily_out_amount'] = number_format((float) $item['ytd_total_daily_out_amount'], 2);
                $item['ytd_total_daily_qouta_amount'] = number_format((float) $item['ytd_total_daily_qouta_amount'], 2);
                $item['ytd_total_status_daily_target'] = number_format((float) $item['ytd_total_status_daily_target'], 2);
                $item['ytd_final_percentage'] = number_format((float) $item['ytd_final_percentage'], 2);
        
                return $item;
            });
        }
        
        if (!empty($dataListCollection)) {
        // Check if pagination parameters exist
        if (!empty($limit) && !empty($page)) {
            // return $dataListCollection = collect($dataListArray);
            $currentPageItems = $dataListCollection->slice(($page - 1) * $limit, $limit)->values();

            $dataList = new LengthAwarePaginator($currentPageItems, $dataListCollection->count(), $limit, $page, [
                'path' => url()->current(),
                'query' => $request->query(),
            ]);
        } else {
            // No pagination, return all
            // $dataList = $dataListArray;
            $dataList = $dataListCollection->values();
        }
        }

         $response = [
            "dataList" => $dataList,
            'result' => true,
            'title' => 'Success',
            'status' => 'success',
            'message' => 'Data retrieved successfully.',
        ];

        return Crypt::encryptString(json_encode($response));
    }

    public function client_sales_summary(Request $request){
        $data = [];
        $dataWeekly  = $this->client_sales_tracker($request);
      
        $mappings = [
            'y'  => 'year',
            'pr' => 'product',
            'c'  => 'group_code',
            'b'  => 'bdo', 
        ]; 
        foreach ($mappings as $old => $new) {
            if ($request->has($old)) {
                $request->merge([
                    $new => $request->input($old),
                ]); 

                $request->request->remove($old);
            }
        }
        $dataMonthly = SalesDailyOutReportClientsSummaryController::get_client_sales_tracker_summary($request);
        $data = [
            'week'  => $dataWeekly,
            'month' =>$dataMonthly
        ];

        return $data;

    }

}
