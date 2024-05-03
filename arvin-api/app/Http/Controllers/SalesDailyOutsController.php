<?php

namespace App\Http\Controllers;

use App\Models\SalesDailyOuts;
use App\Models\User;
use App\Models\SalesDailyOutAnnualSettingsSales;
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
            'company_code' => 'required',
            'company' => 'required',
            'business_unit_code' => 'required',
            'business_unit' => 'required',
            'team_code' => 'required',
            'team' => 'required',
            'department_code' => 'required',
            'department' => 'required',
            'section_code' => 'required',
            'section' => 'required',
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
        $sales_date = MainController::formatDateOnly($fields['sales_date']);

        $check_sale = SalesDailyOuts::where('sales_daily_out_annual_settings_sales_code',$fields['sales_daily_out_annual_settings_sales_code'])
            ->where('company_code',$fields['company_code'])
            ->where('business_unit_code',$fields['business_unit_code'])
            ->where('team_code',$fields['team_code'])
            ->where('department_code',$fields['department_code'])
            ->where('section_code',$fields['section_code'])
            ->where('subsection_code',$request->subsection_code)
            ->where('year_sales_target',$fields['year_sales_target'])
            ->whereDate('sales_date',$currentDateTime)
            ->count();
        if($check_sale > 0){
              $response = [
                    'message' => "There is already a record for today's sale." ,
                    'result' => false,
                    'icon' => 'error',
                    'title' => 'Oppss!',
                ];
            return response($response,409);
        }
        $subsection_code = "N/A";
        $subsection = "N/A";
        if($request->section !== null){
            $subsection_code = $request->subsection_code;
            $subsection = $request->subsection;
        }
        $code = MainController::generate_code('App\Models\SalesDailyOuts',"code");

        $data = SalesDailyOuts::create([
                    'code' => $code,
                    'company_code' => $fields["company_code"],
                    'company' => $fields["company"],
                    'business_unit_code' => $fields["business_unit_code"],
                    'business_unit' => $fields["business_unit"],
                    'team_code' => $fields["team_code"],
                    'team' => $fields["team"],
                    'department_code' => $fields["department_code"],
                    'department' => $fields["department"],
                    'section_code' => $fields["section_code"],
                    'section' => $fields["section"],
                    'subsection_code' =>$subsection_code,
                    'subsection' =>$subsection,
                    'sales_daily_out_annual_settings_sales_code' => $fields["sales_daily_out_annual_settings_sales_code"],
                    'daily_sales_target_percentage' => $fields["daily_sales_target_percentage"],
                    'sales_daily_out' => $fields["sales_daily_out"],
                    'sales_daily_qouta' => $fields["sales_daily_qouta"],
                    'sales_daily_target' => $fields["sales_daily_target"],
                    'year_sales_target' => $fields["year_sales_target"],
                    'added_by' => $fields["added_by"],
                    'modified_by' => $fields["modified_by"],
            ]);

        return response([
            'message' => '',
            'result' => true,
            'icon' => 'success',
            'title' => 'Successfully Added!',
            'result' => true,
        ], 200);  
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
    public function update(Request $request, SalesDailyOuts $salesDailyOuts)
    {
        //
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
        $percentage_daily_target = 100;
        $status_daily_target = $daily_out - $daily_quota;
        $percentage_daily_target *=  $status_daily_target / $daily_quota;
        $response = [
                    "status_daily_target"=>round($status_daily_target,2),
                    "percentage_daily_target"=>round($percentage_daily_target,2),
                ];
        return Crypt::encryptString(json_encode($response));
    }


    public function get_sales_daily_out(Request $request){
            //select query from the url parameter
            $page = $request->query('p');
            $limit = $request->query('l');
            $query = $request->query('q');
            $filter = $request->query('f');
            $user_id = $request->query('uid');

            //check if the user is valid and currently login
            if(empty($user_id)){
                 $response = [
                        'message' => "Invalid request. Please login." ,
                        'result' => false,
                        'icon' => 'error',
                        'title' => 'Oppss!',
                    ];
                return response($response,401);
            }



            $date_month = MainController::formatSingleDigitMonthOnly($filter); //format date to single digit month without the zero (0)
            $date_year = MainController::formatYearOnly($filter); //format date to year

            $user_data = User::where('code',$user_id)->first(); // fetch data from users table

            //check if the is record for the selected date
            $data_count = SalesDailyOuts::where('section_code',$user_data["section_code"])
                ->where('subsection_code',$user_data["subsection_code"])
                ->where('year_sales_target',$date_year)
                ->whereYear('sales_date', $date_year)
                ->whereMonth('sales_date', $date_month)
                ->count();
            
            //validate data count
            if($data_count == 0){
                $response = [
                        'message' => "There is no record for the selected month sale." ,
                        'result' => false,
                        'icon' => 'error',
                        'title' => 'Oppss!',
                    ];
                return $response;
            }

            //get daily outs for pagination with limit
            $sales_daily_outs_data = SalesDailyOuts::select('sales_date','sales_daily_qouta','sales_daily_target','sales_daily_out','daily_sales_target_percentage')
                ->where('section_code',$user_data["section_code"])
                ->where('subsection_code',$user_data["subsection_code"])
                ->where('year_sales_target',$date_year)
                ->whereYear('sales_date', $date_year)
                ->whereMonth('sales_date', $date_month);
                // ->paginate($limit);

            
            $mtd = $this->get_mtd_in_selected_month_year_section_substion($date_month,$date_year,$user_data);
            $datalist = [];

            // Initialize the $datalist array
            $datalist = [];

            // Iterate over $mtbArray and add objects to $datalist
            foreach ($mtd as $mtbItem) {
                $datalist[$mtbItem['sales_date']] = $mtbItem;
            }

            // Iterate over $dataArray and add objects to $datalist
            foreach ($sales_daily_outs_data as $dataItem) {
                // Check if sales_date already exists in $datalist
                if (array_key_exists($dataItem['sales_date'],$datalist) ) {
                    // If not, add the object to $datalist
                    $datalist[$dataItem['sales_date']] = $dataItem;
                }
            }
            // Convert the associative array to indexed array
            $datalist = array_values($datalist);
            $datalistCollection = collect($datalist);

            $paginator = $datalistCollection->forPage($page, $limit);

            $paginatedData = $paginator;
            $response = [
                "dataList"=>$datalistCollection,
                "dataListCount"=>$data_count,
                'result'=>True,
                'title'=>'Success',
                'message'=> 'Authentication successful.',
                'status'=>'success',
            ];
            return $response;
        }



    public function get_mtd_in_selected_month_year_section_substion ($date_month,$date_year,$user_data){
            $section_code = 'N/A';
            $subsection_code = 'N/A';

            //check if user section is not null and replace value
            if($user_data["section_code"] !== null){
                $section_code = $user_data["section_code"];
            }
            //check if user subsection is not null and replace value
            if($user_data["subsection_code"] !== null){
                $subsection_code = $user_data["subsection_code"];
            }

            //get the dates list of the month
            $dates_of_selected_month_and_year = $this->get_dates_in_selected_month_and_year($date_month,$date_year);
            
            //get the set sales
            $sales_daily_out_annual_set_sales = SalesDailyOutAnnualSettingsSales::where('section_code',$section_code)
                ->where('subsection_code',$subsection_code)
                ->where('year_sales_target',$date_year)
                ->whereNull('deleted_at')
                ->first();

            $mtd = [];
            //validate if the variable is an array
            if (is_array($dates_of_selected_month_and_year)) {     
                foreach ($dates_of_selected_month_and_year as $value) {
                    $mtd[] = [
                        'sales_date' =>  $value,
                        'sales_daily_qouta' => $sales_daily_out_annual_set_sales->daily_sales_target,
                        'daily_sales_target' => $sales_daily_out_annual_set_sales->daily_sales_target,
                        'sales_daily_out' => 0,
                        'daily_sales_target_percentage' =>  -100

                    ];
                }
            }

            return $mtd;
        }


    public function get_dates_in_selected_month_and_year ($month,$year){
            $date = Carbon::create($year, $month, 1);

            $daysInMonth = $date->daysInMonth;

            $datesInMonth = [];

            for ($day = 1; $day <= $daysInMonth; $day++) {
                // Create a Carbon instance for the current day
                $currentDate = $date->copy()->setDay($day);
                
                // Check if the current day is not a Sunday
                if ($currentDate->dayOfWeek !== Carbon::SUNDAY) {
                    // Add the current date to the array
                    $datesInMonth[] = $currentDate->format('Y-m-d');
                }
            }

            return $datesInMonth;
        }
    }
