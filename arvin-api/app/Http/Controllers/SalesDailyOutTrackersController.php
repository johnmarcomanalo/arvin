<?php

namespace App\Http\Controllers;

use App\Models\SalesDailyOutTrackers;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Crypt;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;
use Illuminate\Pagination\Paginator;
use App\Models\RefSubSections;
use App\Models\SalesDailyOutSettingsAnnualQuota;
use App\Models\SalesDailyOutHolidayExclusionLogs;


class SalesDailyOutTrackersController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index(){
        //
    }
    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request){
        //
    }
    /**
     * Display the specified resource.
     *
     * @param  \App\Models\SalesDailyOutTrackers  $salesDailyOutTrackers
     * @return \Illuminate\Http\Response
     */
    public function show($id){
        if (isset($id)) {
            $data = SalesDailyOutTrackers::join('ref_sub_sections', 'sales_daily_out_trackers.subsection_code', '=', 'ref_sub_sections.code')
                ->where('sales_daily_out_trackers.code',$id)
                ->whereNull('sales_daily_out_trackers.deleted_at')
                ->first(['sales_daily_out_trackers.*','ref_sub_sections.description as ref_sub_sections_description']);
        } 

        if (empty($data)) {
            $data = [];
        }

        return Crypt::encryptString($data);
    }
    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Models\SalesDailyOutTrackers  $salesDailyOutTrackers
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, SalesDailyOutTrackers $salesDailyOutTrackers){
        //
    }
    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Models\SalesDailyOutTrackers  $salesDailyOutTrackers
     * @return \Illuminate\Http\Response
     */
    public function destroy(SalesDailyOutTrackers $salesDailyOutTrackers){
        //
    }
    public function insert_sap_sales_daily_out($product_groups_description,$year_sales_target,$ref_sub_section_type,$settings_annual_quota_code) { 
        $salesDailyOutsController = new SalesDailyOutsController();
        $sub_section = RefSubSections::where('type', $ref_sub_section_type)->first();
        $sub_section_annual_settings_sales = SalesDailyOutSettingsAnnualQuota::where('code', $settings_annual_quota_code)->first();
        
        $datalist = SalesDailyOutTrackers::where('subsection_code', $sub_section['code'])
            ->where('year_sales_target', $year_sales_target)
            ->where('ref_product_groups_description',$product_groups_description)
            ->where('sales_daily_out_annual_settings_sales_code',$settings_annual_quota_code)
            ->whereNull('deleted_at')
            ->get();

        return $records = collect(DB::select("SET NOCOUNT ON exec dbo.sp_sales_daily_out_delivery_return_cm_v3 ?,?,?",array($product_groups_description,$year_sales_target,$ref_sub_section_type)));
        // Step 2: Process records to add Sunday's QtyInKg to Monday's QtyInKg
       
        $recordsByDate = [];
        $results = [];
        $final_results = [];

        foreach ($records as $record) {
            $date = Carbon::parse($record->createdate)->format('Y-m-d');
            $recordsByDate[$date] = $record;
        }
        // foreach ($recordsByDate as $date => $record) {
        //     $carbonDate = Carbon::parse($date);
            
        //     if ($carbonDate->isSunday()) {
        //         // Find the corresponding Monday

        //         $mondayDate = $carbonDate->addDay()->format('Y-m-d');

        //         if (isset($recordsByDate[$mondayDate])) {
        //             // Add Sunday's QtyInKg to Monday's QtyInKg
        //              $sundayQty = (float) $record->QtyInKg;
        //             $recordsByDate[$mondayDate]->QtyInKg = (float) $recordsByDate[$mondayDate]->QtyInKg + $sundayQty;
        //         }
        //     }
        // }
        // Step 3: Prepare final results for viewing
        foreach ($recordsByDate as $date => $record) {
            $carbonDate = Carbon::parse($date);
            $dayOfWeek = $carbonDate->format('l');
            // if (!$carbonDate->isSunday()) {
                $results[] = [
                    'subsection_code' => $sub_section['code'],
                    'sales_date' => $record->createdate,
                    'day_of_week' => $dayOfWeek,
                    'sales_daily_out' => $record->QtyInKg,
                    'ref_product_groups_description'=> $record->u_groupcategory
                ];
            // }
        }
        foreach ($datalist as $value) {
            $sales_daily_qouta = $value['sales_daily_qouta'];
            $sales_daily_out = $value['sales_daily_out'];
            $sales_date = $value['sales_date'];
                foreach ($results as $result) {
                    $result_date = Carbon::parse($result['sales_date'])->format('Y-m-d');
                    if($sales_date == $result_date){
                        $computation = $this->get_status_daily_target_and_percentage_daily_target_by_daily_out($result['sales_daily_out'],$sales_daily_qouta);
                        $final_results[] = [
                            // 'sales_daily_out_annual_settings_sales_code' =>  $sub_section_annual_settings_sales['code'],
                            'year_sales_target' => $year_sales_target,
                            'subsection_code' => $sub_section['code'],
                            'sales_daily_out' => $result['sales_daily_out'],
                            'sales_date' => $result['sales_date'],
                            'sales_daily_target' => $computation['status_daily_target'],
                            'daily_sales_target_percentage' => $computation['percentage_daily_target'],
                            'modified_by' => '1',
                        ]; 
                    }
                }
        }
        $batchSize = 50; // Update 50 records at a time
        $counter = 0;
        foreach ($final_results as $value) {
            DB::table('sales_daily_out_trackers')
                ->where('sales_daily_out_annual_settings_sales_code', $sub_section_annual_settings_sales['code'])
                ->where('ref_product_groups_description', $product_groups_description)
                ->where('subsection_code', $value['subsection_code'])
                ->where('year_sales_target', $year_sales_target)
                ->whereDate('sales_date', $value['sales_date'])
                ->update([
                    'sales_daily_out' => $value['sales_daily_out'],
                    'sales_daily_target' => $value['sales_daily_target'],
                    'daily_sales_target_percentage' => $value['daily_sales_target_percentage'],
                    'modified_by' => $value['modified_by']
                ]);

            $counter++;

            // Add a delay after every 50 updates
            if ($counter % $batchSize == 0) {
                sleep(2); // Add a 2-second delay to avoid overloading the database
            }
        }

    }
    public function get_status_daily_target_and_percentage_daily_target_by_daily_out($daily_out,$daily_quota){
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
        // return Crypt::encryptString(json_encode($response));
        return $response;
    }
    public function get_sales_tracker(Request $request){
        $page = $request->query('page');
        $limit = $request->query('limit');
        $query = $request->query('q');
        $filter = $request->query('f');
        $user_id = $request->query('uid');
        $sc = $request->query('sc');
        $product_group = $request->query('pg');

        // $page = 1;
        // $limit = 500;
        // $query = "";
        // $filter = "2024-01";
        // $user_id = 1;
        // $sc = 29;
        // $product_group = 'CORNSTARCH';



        $totalTargetDailyQuotaAmount = 0;
        $totalDailyOutAmount = 0;
        $totalStatusDailyTargetAmount = 0;
        $totalPercentageDailyTarget = 0;
        
        $salesDailyOutsController = new SalesDailyOutsController();

        $date_month = MainController::formatSingleDigitMonthOnly($filter); //format date to single digit month without the zero (0)
        $date_year = MainController::formatYearOnly($filter); //format date to year

        $startOfMonth = Carbon::create($date_year, $date_month, 1)->startOfMonth()->toDateString();
        $current_month =  MainController::formatSingleDigitMonthOnly(date('Y-m-d'));
        $current_date = Carbon::now()->toDateString();

        if(empty($user_id)){
                $response = [
                    'result' => false,
                    'status' => 'warning',
                    'title' => 'Oppss!',
                    'message' => "Invalid request. Please login." ,
                ];
                return response($response,200);
            }

        $user_data = User::where('code',$user_id)->first(); // fetch data from users table
        //check if the is record for the selected date
        $user_data["subsection_code"] = $sc;
        // $data_count = SalesDailyOutTrackers::where('subsection_code',$user_data["subsection_code"])
        //     ->where('year_sales_target',$date_year)
        //     ->where('ref_product_groups_description',$product_group)
        //     ->whereYear('sales_date', $date_year)
        //     ->whereMonth('sales_date', $date_month)
        //     ->count();

        $data_count = SalesDailyOutTrackers::where('subsection_code',$user_data["subsection_code"])
            ->where('year_sales_target',$date_year)
            ->where('ref_product_groups_description',$product_group)
            ->whereYear('sales_date', $date_year)
            ->whereMonth('sales_date', $date_month)
            ->whereNull('deleted_at')
            ->count();

        if($data_count == 0){
            $response = [
                "dataList"=>[],
                "dataListCount"=>0,
                'result' => false,
                'status' => 'warning',
                'title' => 'Oppss!',
                'message' => "There is no record for the selected month sale." ,
            ];
            return Crypt::encryptString(json_encode($response));
        }

        //get daily outs for pagination with limit
        $data_list = SalesDailyOutTrackers::where('subsection_code',$user_data["subsection_code"])
                ->where('year_sales_target',$date_year)
                ->where('ref_product_groups_description',$product_group)
                ->whereYear('sales_date', $date_year)
                ->whereMonth('sales_date', $date_month)
                ->whereNull('deleted_at')
                ->paginate($limit);

        $data_list->getCollection()->transform(function ($item) {
                // Format numeric values in the item
                $item->sales_daily_qouta = number_format($item->sales_daily_qouta, 2);
                $item->sales_daily_out = number_format($item->sales_daily_out, 2);
                $item->sales_daily_target = number_format($item->sales_daily_target, 2) ;
                $item->daily_sales_target_percentage = number_format($item->daily_sales_target_percentage, 2);
                return $item;
            });

        
        //get all data for dashboard cards for display
        $query = SalesDailyOutTrackers::where('subsection_code',$user_data["subsection_code"])
            ->where('ref_product_groups_description',$product_group)
            ->where('year_sales_target',$date_year)
            ->whereYear('sales_date', $date_year)
            ->whereNull('deleted_at');

            // Add condition based on current month
        if ($current_month == $date_month) {
            $query->whereBetween('sales_date', [$startOfMonth, $current_date]);
        } else {
            $query->whereMonth('sales_date', $date_month);
        }

        // Get the result
        $dashboard_data_list = $query->get();
       
        $today_data = SalesDailyOutTrackers::where('subsection_code',$user_data["subsection_code"])
                ->where('year_sales_target',$date_year)
                ->where('ref_product_groups_description',$product_group)
                ->where('sales_date', $current_date)
                ->whereNull('deleted_at')
                ->first();
       

       foreach ($dashboard_data_list as  $value) {
                $salesDailyQuota = (float)$value["sales_daily_qouta"];
                $salesDailyOut = (float)$value["sales_daily_out"];
                $salesDailyTarget = (float)$value["sales_daily_target"];
                $dailySalesTargetPercentage = (float)$value["daily_sales_target_percentage"];

                // Check for NaN values and handle them
                if (!is_nan($salesDailyQuota)) {
                $totalTargetDailyQuotaAmount += $salesDailyQuota;
                }
                if (!is_nan($salesDailyOut)) {
                $totalDailyOutAmount += $salesDailyOut;
                }
                if (!is_nan($salesDailyTarget)) {
                $totalStatusDailyTargetAmount += $salesDailyTarget;
                }
                if (!is_nan($dailySalesTargetPercentage)) {
                $totalPercentageDailyTarget += $dailySalesTargetPercentage;
                }
            }
            $averagePercentageDailyTarget = $totalPercentageDailyTarget /  $data_count;

          
            //format data into 000,000.00
            $totalTargetDailyQuotaAmount = $totalTargetDailyQuotaAmount;
            $totalDailyOutAmount = $totalDailyOutAmount;
            $totalStatusDailyTargetAmount = $totalStatusDailyTargetAmount;
            $averagePercentageDailyTarget = $averagePercentageDailyTarget;
          
            $mtd_date_selected_month = $this->get_mtd($date_year,$date_month,$user_data,$date_month,$product_group);
          
            $mtd_date_previous_month = $this->get_previous_mtd($date_year,$date_month,$user_data,$product_group);
            

            $ytd_final_mtd = $this->get_final_ytd($date_year,$date_month,$user_data,$date_month,$product_group);


            $report_data = [
                "total_target_daily_quota_amount"=>$totalTargetDailyQuotaAmount,
                "total_daily_out_amount"=>$totalDailyOutAmount,
                "total_status_daily_target_amount"=>$totalStatusDailyTargetAmount,
                "total_percentage_daily_target"=>$averagePercentageDailyTarget,
            ];

            $response = [
                "dataList"=>$data_list,
                "report_data"=>$report_data,
                "present_mtd_data"=>$mtd_date_selected_month,
                "previous_mtd_data"=>$mtd_date_previous_month,
                "final_ytd_data"=>$ytd_final_mtd['ytdFinal'],
                "ytdTotalDailyOutAmount"=>$ytd_final_mtd['ytdTotalDailyOutAmount'],
                "ytdTotalDailyQoutaAmount"=>$ytd_final_mtd['ytdTotalDailyQoutaAmount'], 
                "today_data"=> $today_data,
                'result'=>True,
                'title'=>'Success',
                'status'=>'success',
                'message'=> 'Authentication successful.',
            ];

        return Crypt::encryptString(json_encode($response));
    }
    public function get_mtd($date_year, $date_month,$user_data,$sales_date_start,$product_group){
            $mtdTotalDailyQoutaAmount = 0;
            $mtdTotalDailyOutAmount = 0;
            $mtdTotalStatusDailyTarget = 0;
            $mtdFinal = 0;

            $firstDayOfMonth = Carbon::createFromDate($date_year, $sales_date_start)->startOfMonth();
            $lastDayOfMonth = Carbon::createFromDate($date_year, $date_month)->endOfMonth();

            $currentDateTime =  MainController::formatSingleDigitMonthOnly(date('Y-m-d'));
            $LastMonthDate =  MainController::formatSingleDigitMonthOnly($lastDayOfMonth);
            $LastOrCurrentDateOfTheMonth = $lastDayOfMonth;
            if($currentDateTime == $LastMonthDate){
                $LastOrCurrentDateOfTheMonth = Carbon::now();
            }
            $mtd_data_list = SalesDailyOutTrackers::where('subsection_code',$user_data["subsection_code"])
                ->where('year_sales_target',$date_year)
                ->where('ref_product_groups_description',$product_group)
                ->whereDate('sales_date','>=', $firstDayOfMonth)
                ->whereDate('sales_date','<=',$LastOrCurrentDateOfTheMonth)
                ->whereNull('deleted_at')
                ->get();
            foreach ($mtd_data_list as $value) {
                $salesDailyQuota = (float)$value["sales_daily_qouta"];
                $salesDailyOut = (float)$value["sales_daily_out"];
                $salesDailyTarget = (float)$value["sales_daily_target"];

                if (!is_nan($salesDailyQuota)) {
                $mtdTotalDailyQoutaAmount += $salesDailyQuota;
                }
                
                if (!is_nan($salesDailyOut)) {
                $mtdTotalDailyOutAmount += $salesDailyOut;
                }

                 if (!is_nan($salesDailyOut)) {
                $mtdTotalStatusDailyTarget += $salesDailyTarget;
                }
            }
            if($mtdTotalDailyQoutaAmount > 0){
                $mtdFinal = (($mtdTotalDailyOutAmount / $mtdTotalDailyQoutaAmount) - 1) * 100; 
            }
            return $reponse = [
               'mtdTotalDailyQoutaAmount' => $mtdTotalDailyQoutaAmount,
               'mtdTotalDailyOutAmount' => $mtdTotalDailyOutAmount,
               'mtdTotalStatusDailyTarget' => $mtdTotalStatusDailyTarget,
               'mtdFinal' => $mtdFinal,
            //    'mtd_data_list' => $mtd_data_list
            ];
    }
    public function get_previous_mtd($date_year, $date_month,$user_data,$product_group){
        $mtdTotalDailyQoutaAmount = 0;
        $mtdTotalDailyOutAmount = 0;
        $mtdTotalStatusDailyTarget = 0;
        $mtd_previous_final = 0;
        $previous_date_month = 1;

        if($date_month >= 2){
            $previous_date_month = $date_month - 1;
        }
        $first_day_of_previous_month = Carbon::createFromDate($date_year, $previous_date_month)->startOfMonth();
        $last_day_Of_previous_month = Carbon::createFromDate($date_year, $previous_date_month)->endOfMonth();


        $mtd_data_previous_list = SalesDailyOutTrackers::where('subsection_code',$user_data["subsection_code"])
            ->where('year_sales_target',$date_year)
            ->where('ref_product_groups_description',$product_group)
            ->whereDate('sales_date','>=', $first_day_of_previous_month)
            ->whereDate('sales_date','<=',$last_day_Of_previous_month)
            ->whereNull('deleted_at')
            ->get();
        if($date_month != 1){
            foreach ($mtd_data_previous_list as $value) {
                $salesDailyQuota = (float)$value["sales_daily_qouta"];
                $salesDailyOut = (float)$value["sales_daily_out"];
                $salesDailyTarget = (float)$value["sales_daily_target"];

                if (!is_nan($salesDailyQuota)) {
                $mtdTotalDailyQoutaAmount += $salesDailyQuota;
                }
                
                if (!is_nan($salesDailyOut)) {
                $mtdTotalDailyOutAmount += $salesDailyOut;
                }

                if (!is_nan($salesDailyOut)) {
                $mtdTotalStatusDailyTarget += $salesDailyTarget;
                }
                $mtd_previous_final = (($mtdTotalDailyOutAmount / $mtdTotalDailyQoutaAmount) - 1) * 100; 
            } 
        }    
        
        
        return $reponse = [
            'mtdTotalDailyQoutaAmount' => $mtdTotalDailyQoutaAmount,
            'mtdTotalDailyOutAmount' => $mtdTotalDailyOutAmount,
            'mtdTotalStatusDailyTarget' => $mtdTotalStatusDailyTarget,
            'mtdFinal' => $mtd_previous_final,
        //    'mtd_data_list' => $mtd_data_previous_list
        ];
    }
    public function get_final_ytd($date_year, $date_month,$user_data,$sales_date_start,$product_group){
        $ytdTotalDailyQoutaAmount = 0;
        $ytdTotalDailyOutAmount = 0;
        $mtdTotalStatusDailyTarget = 0;
        $ytdFinal = 0;

        $januaryFirst = Carbon::create($date_year, 1, 1)->startOfDay();
        $firstDayOfMonth = Carbon::createFromDate($date_year, $sales_date_start)->startOfMonth();
        $lastDayOfMonth = Carbon::createFromDate($date_year, $date_month)->endOfMonth();
        $currentDateTime =  MainController::formatSingleDigitMonthOnly(date('Y-m-d'));
        $LastMonthDate =  MainController::formatSingleDigitMonthOnly($lastDayOfMonth);
        $LastOrCurrentDateOfTheMonth = $lastDayOfMonth;
        if($currentDateTime == $LastMonthDate){
            $LastOrCurrentDateOfTheMonth = Carbon::now();
        }
        $mtd_data_list = SalesDailyOutTrackers::where('subsection_code',$user_data["subsection_code"])
            ->where('year_sales_target',$date_year)
            ->where('ref_product_groups_description',$product_group)
            ->whereDate('sales_date','>=', $januaryFirst)
            ->whereDate('sales_date','<=',$LastOrCurrentDateOfTheMonth)
            ->whereNull('deleted_at')
            ->get();

        foreach ($mtd_data_list as $value) {
            $salesDailyQuota = (float)$value["sales_daily_qouta"];
            $salesDailyOut = (float)$value["sales_daily_out"];
            $salesDailyTarget = (float)$value["sales_daily_target"];

            if (!is_nan($salesDailyQuota)) {
            $ytdTotalDailyQoutaAmount += $salesDailyQuota;
            }
            
            if (!is_nan($salesDailyOut)) {
            $ytdTotalDailyOutAmount += $salesDailyOut;
            }

                if (!is_nan($salesDailyOut)) {
            $mtdTotalStatusDailyTarget += $salesDailyTarget;
            }
        }
        if($ytdTotalDailyQoutaAmount > 0){
            $ytdFinal = ((round((float)$ytdTotalDailyOutAmount, 2)) / (round((float)$ytdTotalDailyQoutaAmount, 2)) - 1) * 100; 
        }
        $response = [
            'ytdFinal'=> $ytdFinal,
            'ytdTotalDailyOutAmount'=> round((float)$ytdTotalDailyOutAmount, 2),
            'ytdTotalDailyQoutaAmount'=> round((float)$ytdTotalDailyQoutaAmount, 2),
        ];
        return $response;
    }
    public function getFiveDaysSalesTrackerbyCurrentDate() {
        $records = [];
        $records = DB::select('SET NOCOUNT ON exec dbo.sp_sales_daily_out_delivery_return_cm_v3_5_days');
        $recordsCollection = collect($records);


        $subSections = RefSubSections::whereIn('type', $recordsCollection->pluck('warehouse'))->get()->keyBy('type');
        $recordsByDateAndWarehouse = [];

        foreach ($recordsCollection as $record) {
            $date = Carbon::parse($record->createdate)->format('Y-m-d');
            $recordsByDateAndWarehouse[$date][$record->warehouse][$record->u_groupcategory] = $record;
        }
        
        // foreach ($recordsByDateAndWarehouse as $date => $warehouseRecords) {
        //     $carbonDate = Carbon::parse($date);

        //     if ($carbonDate->isSunday()) {
        //         // Find the corresponding Monday
        //         $mondayDate = $carbonDate->addDay()->format('Y-m-d');

        //         foreach ($warehouseRecords as $warehouse => $groupRecords) {
        //             foreach ($groupRecords as $u_groupcategory => $record) {
        //                 // Check if Monday's record for the same warehouse and u_groupcategory exists
        //                 if (!isset($recordsByDateAndWarehouse[$mondayDate][$warehouse][$u_groupcategory])) {
        //                     // Initialize Monday's record if it doesn't exist
        //                     $recordsByDateAndWarehouse[$mondayDate][$warehouse][$u_groupcategory] = (object)[
        //                         'warehouse' => $warehouse,
        //                         'createdate' => $mondayDate,
        //                         'u_groupcategory' => $u_groupcategory,
        //                         'QtyInKg' => 0
        //                     ];
        //                 }

        //                 // Add Sunday's QtyInKg to Monday's QtyInKg for the same warehouse and u_groupcategory
        //                 $sundayQty = (float) $record->QtyInKg;
        //                 $recordsByDateAndWarehouse[$mondayDate][$warehouse][$u_groupcategory]->QtyInKg += $sundayQty;
        //             }
        //         }
        //     }
        // }

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
                                            ->whereNull('deleted_at')
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
    public function get_sales_tracker_by_date_subsection_product(Request $request){
        $selected_date = $request->query('fd');
        $subsection_code = $request->query('fs');

        // Validate the date input
        if (!$selected_date || !strtotime($selected_date)) {
            return response()->json([
                'result' => false,
                'title' => 'Error',
                'status' => 'error',
                'message' => 'Invalid date format provided.',
            ], 400); // Bad Request
        }

        // Parse the date safely
        try {
            $date = Carbon::parse($selected_date)->format('Y-m-d');
        } catch (\Exception $e) {
            return response()->json([
                'result' => false,
                'title' => 'Error',
                'status' => 'error',
                'message' => 'Failed to parse the provided date.',
            ], 400);
        }

        // Validate subsection code
        if (!$subsection_code || !is_numeric($subsection_code)) {
            return response()->json([
                'result' => false,
                'title' => 'Error',
                'status' => 'error',
                'message' => 'Invalid subsection code provided.',
            ], 400);
        }

        
        $data_list = SalesDailyOutTrackers::join('ref_sub_sections', 'sales_daily_out_trackers.subsection_code', '=', 'ref_sub_sections.code')
            ->where('sales_daily_out_trackers.subsection_code', $subsection_code)
            ->where('sales_date', $date)
            ->whereNull('sales_daily_out_trackers.deleted_at')
            ->get(['sales_daily_out_trackers.*','ref_sub_sections.description as ref_sub_sections_description']);
        
            $response = [
                "dataList"=>$data_list,
                'result'=>True,
                'title'=>'Success',
                'status'=>'success',
                'message'=> '',
        ];
        return Crypt::encryptString(json_encode($response));
    }
    public function get_sales_daily_out_per_day($sales_date,$sales_daily_out_annual_settings_sales_code){
        if (isset($sales_date) || isset($sales_daily_out_annual_settings_sales_code)) {
            $data = SalesDailyOutTrackers::join('ref_sub_sections', 'sales_daily_out_trackers.subsection_code', '=', 'ref_sub_sections.code')
                ->where('sales_daily_out_trackers.sales_daily_out_annual_settings_sales_code',$sales_daily_out_annual_settings_sales_code)
                ->where('sales_daily_out_trackers.sales_date',$sales_date)
                ->whereNull('sales_daily_out_trackers.deleted_at')
                ->first(['sales_daily_out_trackers.*','ref_sub_sections.description as ref_sub_sections_description']);
        } 

        if (empty($data)) {
            $data = [];
        }

        return Crypt::encryptString($data);
    }
    public function getFiveDaysSalesTrackerbyCurrentDateManila() {
        $records = [];
         DB::table('vw_DailySales_Manila_Latest_Five_Days')
            ->select('warehouse', 'createdate','u_groupcategory', 'QtyInKg') // Select only necessary columns
            // ->whereMonth('createdate', 6) // June
            // ->whereYear('createdate', 2024)
            ->orderBy('createdate')
            ->chunk(1000, function ($chunk) use (&$records) {
                foreach ($chunk as $record) {
                    $records[] = $record;
                }
            });
        
        // Convert $records array to a Collection
        // $product_groups_description = "INDUSTRIAL SALT";
        // $year_sales_target = 2025;
        // $ref_sub_section_type = "GEN";

        // $records = collect(DB::select("exec dbo.sp_sales_daily_out_delivery_return_cm_v2 ?,?,?",array($product_groups_description,$year_sales_target,$ref_sub_section_type)));

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
        // return $results;
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
                                            ->whereNull('deleted_at')
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

}
