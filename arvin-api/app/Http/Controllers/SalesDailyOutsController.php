<?php

namespace App\Http\Controllers;

use App\Models\SalesDailyOuts;
use App\Models\User;
use App\Models\SalesDailyOutAnnualSettingsSales;
use App\Models\RefSubSections;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Crypt;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;
use Illuminate\Pagination\Paginator;

class SalesDailyOutsController extends Controller
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
        $fields = $request->validate([
            'subsection_code' => 'required',
            'sales_daily_out_annual_settings_sales_code' => 'required',
            'daily_sales_target_percentage' => 'required',
            'sales_daily_out' => 'required',
            'sales_daily_qouta' => 'required',
            'sales_daily_target' => 'required',
            'year_sales_target' => 'required',
            'sales_date' => 'required',
            'added_by' => 'required',
            'modified_by' => 'required',
        ]);

        
        $currentDateTime = date('Y-m-d');
        $currentYear = date('Y');
        $checker = 0;
        $check_sale = SalesDailyOuts::where('sales_daily_out_annual_settings_sales_code', $fields['sales_daily_out_annual_settings_sales_code'])
            ->where('subsection_code', $fields["subsection_code"])
            ->where('year_sales_target', $fields["year_sales_target"])
            ->where('sales_daily_out', '<=', 0)
            // ->whereDate('sales_date', $currentDateTime) //uncomment after testing
            ->whereDate('sales_date', $fields["sales_date"])
            ->first();

            // return $check_sale;
        if (!empty($check_sale)) {
            // Update the existing record
            $check_sale->update([
                'sales_daily_out' => $fields["sales_daily_out"],
                'sales_daily_target' => $fields["sales_daily_target"],
                'daily_sales_target_percentage' => $fields["daily_sales_target_percentage"],
                'modified_by' => $fields["modified_by"],
            ]);
            
            return response([
                'result' => true,
                'status' => 'success',
                'title' => 'Success',
                'message' => "Today's sales updated successfully",
            ], 200);
        } else {
            // Record does not exist, return a response indicating that no record was found
            $response = [
                'result' => false,
                'status' => 'warning',
                'title' => 'Oppss!',
                'message' => "There is already a record for today's sale.",
            ];
            return response($response, 200);
        }
    }

    /**
     * Display the specified resource.
     *
     * @param  \App\Models\SalesDailyOuts  $salesDailyOuts
     * @return \Illuminate\Http\Response
     */
    public function show(SalesDailyOuts $salesDailyOuts)
    {   
       
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Models\SalesDailyOuts  $salesDailyOuts
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, $id)
    {
       
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Models\SalesDailyOuts  $salesDailyOuts
     * @return \Illuminate\Http\Response
     */
    public function destroy(SalesDailyOuts $salesDailyOuts)
    {
        //
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


    public function get_sales_daily_out(Request $request){
            //select query from the url parameter
            $page = $request->query('page');
            $limit = $request->query('limit');
            $query = $request->query('q');
            $filter = $request->query('f');
            $user_id = $request->query('uid');


            $totalTargetDailyQuotaAmount = 0;
            $totalDailyOutAmount = 0;
            $totalStatusDailyTargetAmount = 0;
            $totalPercentageDailyTarget = 0;
            
            

            $date_month = MainController::formatSingleDigitMonthOnly($filter); //format date to single digit month without the zero (0)
            $date_year = MainController::formatYearOnly($filter); //format date to year
           
            //check if the user is valid and currently login
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
            $data_count = SalesDailyOuts::where('subsection_code',$user_data["subsection_code"])
                ->where('year_sales_target',$date_year)
                ->whereYear('sales_date', $date_year)
                ->whereMonth('sales_date', $date_month)
                ->count();


            //validate data count
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
            $data_list = SalesDailyOuts::where('subsection_code',$user_data["subsection_code"])
                ->where('year_sales_target',$date_year)
                ->whereYear('sales_date', $date_year)
                ->whereMonth('sales_date', $date_month)
                ->paginate($limit);


            // Loop through each item in the collection
            $data_list->getCollection()->transform(function ($item) {
                // Format numeric values in the item
                $item->sales_daily_qouta = number_format($item->sales_daily_qouta, 2);
                $item->sales_daily_out = number_format($item->sales_daily_out, 2);
                $item->sales_daily_target = number_format($item->sales_daily_target, 2) ;
                $item->daily_sales_target_percentage = number_format($item->daily_sales_target_percentage, 2);
                return $item;
            });

            $startOfMonth = Carbon::create($date_year, $date_month, 1)->startOfMonth()->toDateString();
            $current_month =  MainController::formatSingleDigitMonthOnly(date('Y-m-d'));
            $current_date = Carbon::now()->toDateString();
            //get all data for dashboard cards for display
            $query = SalesDailyOuts::where('subsection_code',$user_data["subsection_code"])
                ->where('year_sales_target',$date_year)
                ->whereYear('sales_date', $date_year);

                // Add condition based on current month
            if ($current_month == $date_month) {
                $query->whereBetween('sales_date', [$startOfMonth, $current_date]);
            } else {
                $query->whereMonth('sales_date', $date_month);
            }

            // Get the result
            $dashboard_data_list = $query->get();
             
            //computation for the dashboard
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
          
            $mtd_date_selected_month = $this->get_mtd($date_year,$date_month,$user_data,$date_month);
          
            $mtd_date_previous_month = $this->get_previous_mtd($date_year,$date_month,$user_data);
            

            $mtd_final_mtd = $this->get_final_mtd($date_year,$date_month,$user_data,$date_month);


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
                "final_mtd_data"=>$mtd_final_mtd,
                'result'=>True,
                'title'=>'Success',
                'status'=>'success',
                'message'=> 'Authentication successful.',
            ];
        return Crypt::encryptString(json_encode($response));
        }


        public function get_mtd($date_year, $date_month,$user_data,$sales_date_start){
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
            $mtd_data_list = SalesDailyOuts::where('subsection_code',$user_data["subsection_code"])
                ->where('year_sales_target',$date_year)
                ->whereDate('sales_date','>=', $firstDayOfMonth)
                ->whereDate('sales_date','<=',$LastOrCurrentDateOfTheMonth)
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
               'mtd_data_list' => $mtd_data_list
            ];
        }
        public function get_previous_mtd($date_year, $date_month,$user_data){
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


            $mtd_data_previous_list = SalesDailyOuts::where('subsection_code',$user_data["subsection_code"])
                ->where('year_sales_target',$date_year)
                ->whereDate('sales_date','>=', $first_day_of_previous_month)
                ->whereDate('sales_date','<=',$last_day_Of_previous_month)
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
               'mtd_data_list' => $mtd_data_previous_list
            ];
        }

        public function get_final_mtd($date_year, $date_month,$user_data,$sales_date_start){
            $mtdTotalDailyQoutaAmount = 0;
            $mtdTotalDailyOutAmount = 0;
            $mtdTotalStatusDailyTarget = 0;
            $mtdFinal = 0;

            $januaryFirst = Carbon::create($date_year, 1, 1)->startOfDay();
            $firstDayOfMonth = Carbon::createFromDate($date_year, $sales_date_start)->startOfMonth();
            $lastDayOfMonth = Carbon::createFromDate($date_year, $date_month)->endOfMonth();
            $currentDateTime =  MainController::formatSingleDigitMonthOnly(date('Y-m-d'));
            $LastMonthDate =  MainController::formatSingleDigitMonthOnly($lastDayOfMonth);
            $LastOrCurrentDateOfTheMonth = $lastDayOfMonth;
            if($currentDateTime == $LastMonthDate){
                $LastOrCurrentDateOfTheMonth = Carbon::now();
            }
            $mtd_data_list = SalesDailyOuts::where('subsection_code',$user_data["subsection_code"])
                ->where('year_sales_target',$date_year)
                ->whereDate('sales_date','>=', $januaryFirst)
                ->whereDate('sales_date','<=',$LastOrCurrentDateOfTheMonth)
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
                $mtdFinal = ((round((float)$mtdTotalDailyOutAmount, 2)) / (round((float)$mtdTotalDailyQoutaAmount, 2)) - 1) * 100; 
            }
            
            return $mtdFinal;
        }

    public function insertSAPSalesDailyOut($id) { 
        // Step 1: Retrieve all records
        $currentDate = Carbon::now()->format('Y-m-d');
        $sub_section = RefSubSections::where('code', $id)->first();
        $datalist = SalesDailyOuts::where('subsection_code', $sub_section['code'])->whereDate('sales_date', $currentDate)->get();


         $records = DB::table('vw_DailySales')
            ->where('warehouse', $sub_section['type'])
            // ->whereDate('createdate', $currentDate)
            ->orderBy('createdate')
            ->get();

        // Step 2: Process records to add Sunday's QtyInKg to Monday's QtyInKg
        $recordsByDate = [];
        $results = [];
        $final_results = [];

        foreach ($records as $record) {
            $date = Carbon::parse($record->createdate)->format('Y-m-d');
            $recordsByDate[$date] = $record;
        }
        foreach ($recordsByDate as $date => $record) {
            $carbonDate = Carbon::parse($date);

            if ($carbonDate->isSunday()) {
                // Find the corresponding Monday
                $mondayDate = $carbonDate->addDay()->format('Y-m-d');

                if (isset($recordsByDate[$mondayDate])) {
                    // Add Sunday's QtyInKg to Monday's QtyInKg
                    $sundayQty = (float) $record->QtyInKg;
                    $recordsByDate[$mondayDate]->QtyInKg = (float) $recordsByDate[$mondayDate]->QtyInKg + $sundayQty;
                }
            }
        }

        // Step 3: Prepare final results for viewing
        foreach ($recordsByDate as $date => $record) {
            $carbonDate = Carbon::parse($date);
            if (!$carbonDate->isSunday()) {
                $results[] = [
                    'subsection_code' => $id,
                    'sales_date' => $record->createdate,
                    'sales_daily_out' => $record->QtyInKg
                ];
            }
        }
        foreach ($datalist as $value) {
            $sales_daily_qouta = $value['sales_daily_qouta'];
            $sales_daily_out = $value['sales_daily_out'];
            $sales_date = $value['sales_date'];
                foreach ($results as $result) {
                    if($sales_date = $result['sales_date']){
                        $computation = $this->get_status_daily_target_and_percentage_daily_target_by_daily_out($result['sales_daily_out'],$sales_daily_qouta);
                        $final_results[] = [
                            'sales_daily_out_annual_settings_sales_code' => '1',
                            'year_sales_target' => '2024',
                            'subsection_code' => $id,
                            'sales_daily_out' => $result['sales_daily_out'],
                            'sales_date' => $result['sales_date'],
                            'sales_daily_target' => $computation['status_daily_target'],
                            'daily_sales_target_percentage' => $computation['percentage_daily_target'],
                            'modified_by' => '1',
                        ]; 
                    }
                }
        }
        foreach ($final_results as $value) {
            $check_sale = SalesDailyOuts::where('sales_daily_out_annual_settings_sales_code', '2')
                ->where('subsection_code', $value["subsection_code"])
                ->where('year_sales_target', $value["year_sales_target"])
                ->whereDate('sales_date', $value["sales_date"])
                ->first();

            $check_sale->update([
                    'sales_daily_out' => $value["sales_daily_out"],
                    'sales_daily_target' => $value["sales_daily_target"],
                    'daily_sales_target_percentage' => $value["daily_sales_target_percentage"],
                    'modified_by' => $value["modified_by"],
            ]);
        }
        // Return both original records and final results
        // return [
        //     'final_results' => $final_results,
        // ];
    }

    public function getFiveDaysSalesDailyOutbyCurrentDate() {
         $records = DB::table('vw_daily_sales_latest_five_days')->get();
        $subSections = RefSubSections::whereIn('type', $records->pluck('warehouse'))->get()->keyBy('type');
        $recordsByDate = [];
        
        foreach ($records as $record) {
            $date = Carbon::parse($record->createdate)->format('Y-m-d');
            $recordsByDate[$date] = $record;
        }
        foreach ($recordsByDate as $date => $record) {
            $carbonDate = Carbon::parse($date);

            if ($carbonDate->isSunday()) {
                // Find the corresponding Monday
                $mondayDate = $carbonDate->addDay()->format('Y-m-d');

                if (isset($recordsByDate[$mondayDate])) {
                    // Add Sunday's QtyInKg to Monday's QtyInKg
                    $sundayQty = (float) $record->QtyInKg;
                    $recordsByDate[$mondayDate]->QtyInKg = (float) $recordsByDate[$mondayDate]->QtyInKg + $sundayQty;

                }
            }
        }

        foreach ($recordsByDate as $date => $record) {
            $carbonDate = Carbon::parse($date);
            if (!$carbonDate->isSunday()) {
                $results[] = [
                    'warehouse' => $record->warehouse,
                    'createdate' => $record->createdate,
                    'QtyInKg' => $record->QtyInKg
                ];
            }
        }

       DB::transaction(function() use ($records, $subSections) {
            $currentDate = Carbon::now()->format('Y-m-d');
            foreach ($records as $records_value) {
                $warehouse = $records_value->warehouse;
                $create_date = Carbon::parse($records_value->createdate)->format('Y-m-d');
                $sales_daily_out = round($records_value->QtyInKg, 2);
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
}
