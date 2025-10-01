<?php

namespace App\Http\Controllers;

use App\Models\SalesDailyOutClientSalesTrackers;
use Illuminate\Http\Request;
use Carbon\Carbon;
use Illuminate\Support\Facades\Crypt;
use Illuminate\Support\Facades\DB;
use App\Models\SalesDailyOutSettingsClientGroups;
use App\Models\SalesDailyOutSettingsClientSubGroups;
use App\Models\SalesDailyOutSettingsAnnualQuotaClientGroups;
use App\Models\RefClientsSalesOutLogs;
use App\Models\RefProductGroups;
use App\Models\UsersAccounts;
use App\Models\User;
use Illuminate\Pagination\LengthAwarePaginator;
use PhpParser\Node\Stmt\Foreach_;
use PhpParser\Node\Stmt\TryCatch;
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

    public function test_qouta()
    {
        set_time_limit(0);
        try {
            DB::beginTransaction();

            $client_groups = SalesDailyOutSettingsClientGroups::whereNotIn('code', function ($query) {
                $query->select('sales_daily_out_settings_client_group_code')
                    ->from('sales_daily_out_settings_annual_quota_client_groups');
            })->get();

            $annual_sales_target = 0;
            $monthly_sales_target = $annual_sales_target / 12;

            // Precompute dates once
            // $dates_to_get = MainController::get_dates_in_selected_year(2025);

            $quotaBatch = [];
            // $dailyBatch = [];

            $lastCode = SalesDailyOutSettingsAnnualQuotaClientGroups::max('code');
            $lastCode = $lastCode ? intval($lastCode) : 0;
            foreach ($client_groups as $value) {
                // quota
                $lastCode++; 
                // $quotaBatch[] = [
                //     'code' => $lastCode,
                //     'sales_daily_out_settings_client_group_code' => $value['code'],
                //     'year_sales_target' => 2025,
                //     'ref_product_groups_code' => 'INDUSTRIAL SALT',
                //     'bdo' => $value['bdo'] ?? 'N/A',
                //     'type' => $value['type'] ?? 'N/A',
                //     'subsection' => $value['subsection'] ?? 'N/A',
                //     'annual_sales_target' => $annual_sales_target,
                //     'january_sales_target' => $monthly_sales_target,
                //     'february_sales_target' => $monthly_sales_target,
                //     'march_sales_target' => $monthly_sales_target,
                //     'april_sales_target' => $monthly_sales_target,
                //     'may_sales_target' => $monthly_sales_target,
                //     'june_sales_target' => $monthly_sales_target,
                //     'july_sales_target' => $monthly_sales_target,
                //     'august_sales_target' => $monthly_sales_target,
                //     'september_sales_target' => $monthly_sales_target,
                //     'october_sales_target' => $monthly_sales_target,
                //     'november_sales_target' => $monthly_sales_target,
                //     'december_sales_target' => $monthly_sales_target,
                //     'added_by' => 'SAP',
                //     'modified_by' => 'SAP',
                // ];
                SalesDailyOutSettingsAnnualQuotaClientGroups::create([
                    'code' => $lastCode,
                    'sales_daily_out_settings_client_group_code' => $value['code'],
                    'year_sales_target' => 2025,
                    'ref_product_groups_code' => 2,
                    'bdo' => $value['bdo'] ?? 'N/A',
                    'subsection' => $value['subsection'] ?? 'N/A',
                    'type' => $value['type'] ?? 'N/A',
                    'annual_sales_target' => $annual_sales_target,
                    'january_sales_target' => $monthly_sales_target,
                    'february_sales_target' => $monthly_sales_target,
                    'march_sales_target' => $monthly_sales_target,
                    'april_sales_target' => $monthly_sales_target,
                    'may_sales_target' => $monthly_sales_target,
                    'june_sales_target' => $monthly_sales_target,
                    'july_sales_target' => $monthly_sales_target,
                    'august_sales_target' => $monthly_sales_target,
                    'september_sales_target' => $monthly_sales_target,
                    'october_sales_target' => $monthly_sales_target,
                    'november_sales_target' => $monthly_sales_target,
                    'december_sales_target' => $monthly_sales_target,
                    'added_by' => 'SAP',
                    'modified_by' => 'SAP',
                ]);


                // daily
                // foreach ($dates_to_get as $date_value) {
                //     $sales_daily_quota = $this->get_quota_day($date_value, $monthly_sales_target);
                //     $dailyBatch[] = [
                //         'sales_daily_out_settings_annual_quota_client_groups_code' => $code_annual_quota,
                //         'sales_daily_out_settings_client_groups_description' => $value["description"],
                //         'ref_product_groups_description' => 'INDUSTRIAL SALT',
                //         'daily_sales_target_percentage' => -100,
                //         'sales_date' => $date_value,
                //         'sales_daily_out' => 0,
                //         'sales_daily_qouta' => $sales_daily_quota,
                //         'sales_daily_target' => -$sales_daily_quota,
                //         'year_sales_target' => 2025,
                //         'bdo' => $value['bdo'],
                //         'type' => $value["type"],
                //         'subsection' => $value["subsection"],
                //         'added_by' => 'SAP',
                //         'modified_by' => 'SAP',
                //     ];

                //     // // insert in chunks of 5k
                //     // if (count($dailyBatch) >= 500) {
                //     //     DB::table('sales_daily_out_client_sales_trackers')->insert($dailyBatch);
                //     //     $dailyBatch = [];
                //     // }
                // }
            }
            // return $quotaBatch;
        // final batch insert
        // return $quotaBatch;
        // if (!empty($quotaBatch)) {
        //     DB::table('sales_daily_out_settings_annual_quota_client_groups')->insert($quotaBatch);
        // }
        // if (!empty($dailyBatch)) {
        //     DB::table('sales_daily_out_client_sales_trackers')->insert($dailyBatch);
        // }

        DB::commit();

        return "Done";
        } catch (\Throwable $th) {
            throw $th;
        }
        
    }

    public function test_365()
    {
        set_time_limit(0);
        try {
            DB::beginTransaction();
            $client_new_qouta = SalesDailyOutSettingsAnnualQuotaClientGroups::join('sales_daily_out_settings_client_groups', 'sales_daily_out_settings_annual_quota_client_groups.sales_daily_out_settings_client_group_code', '=', 'sales_daily_out_settings_client_groups.code')
                ->where('sales_daily_out_settings_annual_quota_client_groups.annual_sales_target','!=',0)
                ->where('sales_daily_out_settings_annual_quota_client_groups.subsection','!=','')
                ->where('sales_daily_out_settings_annual_quota_client_groups.bdo','!=','')
                ->where('sales_daily_out_settings_annual_quota_client_groups.code','>=','1105')
                ->get(['sales_daily_out_settings_annual_quota_client_groups.*','sales_daily_out_settings_client_groups.description']);

            // Precompute dates once
            $dates_to_get = MainController::get_dates_in_selected_year(2025);

            $dailyBatch = [];

            foreach ($client_new_qouta as $value) {
                // quota
                // daily
                foreach ($dates_to_get as $date_value) {
                    $code = MainController::generate_code('App\Models\SalesDailyOutClientSalesTrackers',"code");
                    $sales_daily_quota = $this->get_quota_day($date_value, $value['january_sales_target']);
                    // $dailyBatch[] = [
                    //     'code' => $lastCode,
                    //     'sales_daily_out_settings_annual_quota_client_groups_code' => $value['code'],
                    //     'sales_daily_out_settings_client_groups_description' => $value["description"],
                    //     'ref_product_groups_description' => 'INDUSTRIAL SALT',
                    //     'daily_sales_target_percentage' => -100,
                    //     'sales_date' => $date_value,
                    //     'sales_daily_out' => 0,
                    //     'sales_daily_qouta' => $sales_daily_quota,
                    //     'sales_daily_target' => -$sales_daily_quota,
                    //     'year_sales_target' => 2025,
                    //     'bdo' => $value['bdo'],
                    //     'type' => $value["type"],
                    //     'subsection' => $value["subsection"],
                    //     'added_by' => 'SAP',
                    //     'modified_by' => 'SAP',
                    // ];
                    SalesDailyOutClientSalesTrackers::create([
                            'code' => $code,
                            'sales_daily_out_settings_annual_quota_client_groups_code' => $value['code'],
                            'sales_daily_out_settings_client_groups_description' => $value["description"],
                            'ref_product_groups_description' => 'INDUSTRIAL SALT',
                            'daily_sales_target_percentage' => -100,
                            'sales_date' => $date_value,
                            'sales_daily_out' => 0,
                            'sales_daily_qouta' => $sales_daily_quota,
                            'sales_daily_target' => -$sales_daily_quota,
                            'year_sales_target' => 2025,
                            'bdo' => $value['bdo'],
                            'type' => $value["type"],
                            'subsection' => $value["subsection"],
                            'added_by' => 'SAP',
                            'modified_by' => 'SAP',
                    ]);

                }
            }
        // final batch insert
        // return $quotaBatch;
        // if (!empty($quotaBatch)) {
        //     DB::table('sales_daily_out_settings_annual_quota_client_groups')->insert($quotaBatch);
        // }
        // if (!empty($dailyBatch)) {
        //     DB::table('sales_daily_out_client_sales_trackers')->insert($dailyBatch);
        // }

        DB::commit();

        return "Done";
        } catch (\Throwable $th) {
            throw $th;
        }
        
    }

    // public function test3()
    // {
    //     set_time_limit(0);
    //     try {
    //         DB::beginTransaction();
    //         $salesDailyOutTrackersController = new SalesDailyOutTrackersController();
        
    //         $temp_table = DB::table('temptable_raw')->where('u_groupcategory','Industrial Salt')->get();
    //         $customerCodes = collect($temp_table)->pluck('cardcode')->values();
    //         $groups = collect();

    //         $customerCodes->chunk(2000)->each(function ($chunk) use (&$groups) {
    //             $rows = SalesDailyOutSettingsClientSubGroups::whereIn('customer_code', $chunk)->orderBy('code','asc')->get();
    //             $groups = $groups->merge($rows);
    //         });


    //         $quotas = [];

    //         // Group inserted data by customer code for easy lookup
    //         $groupedInsertedData = collect($temp_table)->groupBy('cardcode');

    //         return $groupedInsertedData = collect($temp_table)
    //             ->groupBy(function ($item) {
    //                  return $item->cardcode . '|' . Carbon::parse($item->createdate)->toDateString();
    //             })
    //             ->map(function ($rows) {
    //                 // Take the first row as a base
    //                 $first = $rows->first();

    //                 // Sum qtyinkg
    //                 $totalQty = $rows->sum('qtyinkg');

    //                 // Return a merged object/array
    //                 return (object)[
    //                     'cardcode'     => $first->cardcode,
    //                     'cardname'     => $first->cardname,
    //                     'createdate'   => Carbon::parse($first->createdate)->toDateString(),
    //                     'u_groupcategory' => $first->u_groupcategory,
    //                     'type' => $first->type,
    //                     'total_qtyinkg'   => $totalQty,
    //                 ];
    //             })
    //             ->values(); // reindex
    //         foreach ($groups as $group) {
    //                 $customerCode = $group->customer_code;
    //                 $customerInsertedRecords = $groupedInsertedData[$customerCode] ?? [];

    //                 foreach ($customerInsertedRecords as $record) {
    //                     $quota = SalesDailyOutSettingsAnnualQuotaClientGroups::join(
    //                             'ref_product_groups',
    //                             'sales_daily_out_settings_annual_quota_client_groups.ref_product_groups_code',
    //                             '=',
    //                             'ref_product_groups.code'
    //                         )
    //                         ->where('sales_daily_out_settings_client_group_code', $group->sales_daily_out_settings_client_groups_code)
    //                         ->where('type', $record->type)
    //                         ->where('subsection', $group->subsection)
    //                         ->where('ref_product_groups.description', 'Industrial Salt')
    //                         ->where('year_sales_target', '2025')
    //                         ->where('sales_daily_out_settings_annual_quota_client_groups.annual_sales_target','!=',0)
    //                         ->where('sales_daily_out_settings_annual_quota_client_groups.subsection','!=','')
    //                         ->where('sales_daily_out_settings_annual_quota_client_groups.bdo','!=','')
    //                         ->where('sales_daily_out_settings_client_group_code','>=','202')
    //                         ->first([ 
    //                             'sales_daily_out_settings_annual_quota_client_groups.*',
    //                             'ref_product_groups.description as product_description'
    //                         ]);

    //                     if ($quota) {
    //                         // Save quota + sales_date + amount from insertedData for later update
    //                         $quotas[] = [
    //                             'quota_code' => $quota->code,
    //                             'sales_date' => $record->createdate,
    //                             'sales_daily_out' => $record->qtyinkg,
    //                             'docentry' => $record->docentry,
    //                             'docnum' => $record->docnum,
    //                             'trans_type' => $record->trans_type,
    //                             'type' => $record->type,
    //                             'warehouse' => $record->warehouse,
    //                             'product' => $record->u_groupcategory,
    //                             'customer_code' => $record->cardcode,
    //                         ];
    //                     }
    //                 }

                
    //         }
    //         return $quotas;
    //         $checkupdate = [];
    //         if (!empty($quotas)) {
    //             foreach ($quotas as $q) {
    //                 $new_daily_out = 0;
    //                     $data = SalesDailyOutClientSalesTrackers::where('sales_daily_out_settings_annual_quota_client_groups_code', $q['quota_code'])
    //                     ->whereDate('sales_date', $q['sales_date'])
    //                     ->first();
    //                 if ($data) {
    //                     $new_daily_out = $data['sales_daily_out'] + $q['sales_daily_out'];
    //                     $computation = $salesDailyOutTrackersController->get_status_daily_target_and_percentage_daily_target_by_daily_out(
    //                         $new_daily_out,
    //                         $data['sales_daily_qouta']
    //                     );
    //                     // $data->update([
    //                     //     'sales_daily_out' => $new_daily_out,
    //                     //     'sales_daily_target' => $computation['status_daily_target'],
    //                     //     'daily_sales_target_percentage' => $computation['percentage_daily_target']
    //                     // ]);
    //                     $data->sales_daily_out = $new_daily_out;
    //                     $data->sales_daily_target = $computation['status_daily_target'];
    //                     $data->daily_sales_target_percentage = $computation['percentage_daily_target'];

    //                     $checkupdate[$data->id] = $data;
    //                     // $updatedLogs[] = $q;
    //                 }
    //             }
    //         }
            
    //         return $checkupdate = array_values($checkupdate);

    //         // if (!empty($updatedLogs)) {
    //         //     foreach ($updatedLogs as $value) {
    //         //         RefClientsSalesOutLogs::where('customer_code', $value['customer_code'])
    //         //             ->where('product', $value['product'])
    //         //             ->where('type', $value['type'])
    //         //             ->where('sales_daily_out', $value['sales_daily_out'])
    //         //             ->where('warehouse', $value['warehouse'])
    //         //             ->where('sales_date', $value['sales_date'])
    //         //             ->where('docentry', $value['docentry'])
    //         //             ->where('docnum', $value['docnum'])
    //         //             ->where('trans_type', $value['trans_type'])
    //         //             ->where('status',0)
    //         //             ->update(['status' => 1,'updated_at' => now()]);
    //         //     }
    //         // }
    //         // DB::commit();
    //     return "Done";
    //     } catch (\Throwable $th) {
    //         throw $th;
    //     }
        
    // }

    public function test()
    {
        set_time_limit(0);
        try {
            $salesDailyOutTrackersController = new SalesDailyOutTrackersController();
        
            $currentYear = Carbon::now()->format('Y');
            $final_results = [];

            $data_quota = SalesDailyOutSettingsAnnualQuotaClientGroups::where('year_sales_target',$currentYear)
                ->where('annual_sales_target','!=',0)
                ->where('subsection','!=','')
                ->where('bdo','!=','')
                ->whereNull('deleted_at')
                ->where('code','>=','1231')
                ->where('code','<=','1260')
                ->get();

            // $data_quota = SalesDailyOutSettingsAnnualQuotaClientGroups::where('year_sales_target', $currentYear)
            //     ->whereNull('deleted_at')
            //     ->whereIn('code', ['21', '19', '18', '15', '12', '10', '8', '3'])
            //     ->get();

            $recordsByDate = [];

            foreach ($data_quota as $value) {
                $productGroup = RefProductGroups::where('code',$value->ref_product_groups_code)->first();
                $subgroups = SalesDailyOutSettingsClientSubGroups::where('sales_daily_out_settings_client_groups_code',$value->sales_daily_out_settings_client_group_code)->get();
                $card_codes = $subgroups->pluck('customer_code')->toArray();

                $datalist = (SalesDailyOutClientSalesTrackers::where('year_sales_target', $currentYear)
                    ->where('ref_product_groups_description', $productGroup->description)
                    ->where('sales_daily_out_settings_annual_quota_client_groups_code', $value->code)
                    ->whereNull('deleted_at')
                    ->orderBy('code')
                    ->get());

                $records = DB::table('temptable_raw')->where('u_groupcategory','Industrial Salt')->whereIn('cardcode',$card_codes)->get();
                
                
                foreach ($records as $record) {
                    $date = Carbon::parse($record->createdate)->format('Y-m-d');

                    if (!isset($recordsByDate[$date])) {
                        $recordsByDate[$date] = [
                            'sales_date' => $record->createdate,
                            'sales_daily_out' => $record->qtyinkg,
                            'ref_product_groups_description' => $record->u_groupcategory
                        ];
                    } else {
                        $recordsByDate[$date]['sales_daily_out'] += $record->qtyinkg;
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
                                    'sales_daily_out_settings_annual_quota_client_groups_code' => $datalist_value->sales_daily_out_settings_annual_quota_client_groups_code,
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
                            'modified_by' => 'SAP',
                        ]);
                    $counter++;

                    // Add a delay after every 50 updates
                    if ($counter % $batchSize == 0) {
                        sleep(2); // Add a 2-second delay to avoid overloading the database
                    }
                }
            }
            return 'Done';
        } catch (\Throwable $th) {
            throw $th;
        }
        
    }
    public function get_quota_day($sales_date, $quota) 
    {
        $carbonDate = Carbon::parse($sales_date);
        $month = $carbonDate->month;
        $year = $carbonDate->year;

        // Create a Carbon instance for the first day of the month
        $date = Carbon::create($year, $month, 1);

        // Get the number of days in the month
        $daysInMonth = $date->daysInMonth;

        // Calculate and return the quota per total days in the month (including Sundays)
        return $quota / $daysInMonth;
    }
}
