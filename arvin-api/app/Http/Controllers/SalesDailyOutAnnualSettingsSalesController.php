<?php

namespace App\Http\Controllers;

use App\Models\SalesDailyOutAnnualSettingsSales;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Crypt;
use Illuminate\Contracts\Encryption\DecryptException;
use Carbon\Carbon;
use App\Models\SalesDailyOuts;

class SalesDailyOutAnnualSettingsSalesController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        
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
            'subsection_code' => 'required',
            'subsection' => 'required',
            'year_sales_target' => 'required',
            'annual_sales_target' => 'required',
            'monthly_sales_target' => 'required',
            'daily_sales_target' => 'required',
            'added_by' => 'required',
            'modified_by' => 'required',
        ]);

        $qouta = SalesDailyOutAnnualSettingsSales::where('year_sales_target',$fields['year_sales_target'])
            ->where('company_code',$fields['company_code'])
            ->where('business_unit_code',$fields['business_unit_code'])
            ->where('team_code',$fields['team_code'])
            ->where('department_code',$fields['department_code'])
            ->where('section_code',$fields['section_code'])
            ->where('subsection_code',$request->subsection_code,)
            ->count();

        $subsection_code = "N/A";
        $subsection = "N/A";
        if($request->section !== null){
            $subsection_code = $request->subsection_code;
            $subsection = $request->subsection;
        }
        if($qouta > 0){
            $response = [
                    'message' => 'There is already a target sale for : 
                        '.$fields["section"].' - : '.$subsection.' Year : '.$fields['year_sales_target'],
                    'result' => false,
                    'status' => 'warning',
                    'title' => 'Oppss!',
                ];
            return response($response,200);
        }
        $code = $this->generate_code();

        $dates_to_get = $this->get_dates_in_selected_year_without_sundays($fields["year_sales_target"]);
            
        $data = SalesDailyOutAnnualSettingsSales::create([
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
                    'year_sales_target' => $fields["year_sales_target"],
                    'annual_sales_target' => $fields["annual_sales_target"],
                    'monthly_sales_target' => $fields["monthly_sales_target"],
                    'daily_sales_target' => $fields["daily_sales_target"],
                    'added_by' => $fields["added_by"],
                    'modified_by' => $fields["modified_by"],
            ]);


        foreach ($dates_to_get as $value) {
            $code = MainController::generate_code('App\Models\SalesDailyOuts',"code");
            $sales_daily_quota = $this->get_number_of_days_in_a_month_with_out_sunday($value,$fields["monthly_sales_target"]) ;
            SalesDailyOuts::create([
                    'code' => $code,
                    'subsection_code' =>$fields["subsection_code"],
                    'sales_daily_out_annual_settings_sales_code' => $data["code"],
                    'daily_sales_target_percentage' => -100,
                    'sales_date' => $value,
                    'sales_daily_out' => 0,
                    // 'sales_daily_qouta' =>  $fields["daily_sales_target"],
                    'sales_daily_qouta' =>  $sales_daily_quota,
                    'sales_daily_target' =>  '-'.$sales_daily_quota,
                    'year_sales_target' => $fields["year_sales_target"],
                    'added_by' => $fields["added_by"],
                    'modified_by' => $fields["modified_by"],
            ]);
        }

        return response([
            'message' => 'Target sales added successfully',
            'result' => true,
            'status' => 'success',
            'title' => 'Success',
        ], 200); 
    }

    /**
     * Display the specified resource.
     *
     * @param  \App\Models\SalesDailyOutAnnualSettingsSales  $salesDailyOutAnnualSettingsSales
     * @return \Illuminate\Http\Response
     */
    public function show(Request $request)
    {
       
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Models\SalesDailyOutAnnualSettingsSales  $salesDailyOutAnnualSettingsSales
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, SalesDailyOutAnnualSettingsSales $salesDailyOutAnnualSettingsSales)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Models\SalesDailyOutAnnualSettingsSales  $salesDailyOutAnnualSettingsSales
     * @return \Illuminate\Http\Response
     */
    public function destroy(SalesDailyOutAnnualSettingsSales $salesDailyOutAnnualSettingsSales)
    {
        //
    }

    public function annual_target_sales_computation($amount){
        $annual_sales_target = $amount;
        $months_to_divide = 12;
        $days_to_divide = 26;
        $monthly_sales_target = 0;
        $daily_sales_target = 0;
        if($amount > 0){
            $monthly_sales_target = MainController::divide([$annual_sales_target,$months_to_divide]);
        }
        if($monthly_sales_target > 0){
            $daily_sales_target = MainController::divide([$monthly_sales_target,$days_to_divide]);
        }
        $response = [
            "annual_sales_target"=>MainController::amountFormat($annual_sales_target),
            "monthly_sales_target"=>MainController::amountFormat($monthly_sales_target),
            "daily_sales_target"=>MainController::amountFormat($daily_sales_target)
        ];
        return Crypt::encryptString(json_encode($response));
    }

      public function generate_code(){
        $code = 1;
        $current_date = date('Y-m-d');
         $latest_code = SalesDailyOutAnnualSettingsSales::latest('code')->first('code')->code ?? NULL;
        if(!empty($latest_code)){
            $code = $latest_code + 1;
        }
        return $code;
    }

    public function get_annual_monthly_daily_target_sales_by_section_subsection($id,$year){
        
        $count = SalesDailyOutAnnualSettingsSales::where('subsection_code',$id)->where("year_sales_target",$year)->count();
        if($count == 0){

            $response = [
                    'message' => "No target sale found. Please try other date.",
                    'result' => false,
                    'status' => 'warning',
                    'title' => 'Oppss!',
                ];
        return Crypt::encryptString(json_encode($response));
        }
        $annual_monthly_daily_target_sales_data = SalesDailyOutAnnualSettingsSales::where('subsection_code',$id)->where("year_sales_target",$year)->first();
       
        $response = [
            "year_sales_target"=>$annual_monthly_daily_target_sales_data->year_sales_target,
            "annual_sales_target"=>$annual_monthly_daily_target_sales_data->annual_sales_target,
            "monthly_sales_target"=>$annual_monthly_daily_target_sales_data->monthly_sales_target,
            "daily_sales_target"=>$annual_monthly_daily_target_sales_data->daily_sales_target,
            "sales_daily_out_annual_settings_sales_code"=>$annual_monthly_daily_target_sales_data->code
        ];

        return Crypt::encryptString(json_encode($response));
    }

    public function get_dates_in_selected_year_without_sundays($year) {
            $datesWithoutSundays = [];
            // Loop through each month of the year
            for ($month = 1; $month <= 12; $month++) {
                // Create a Carbon instance for the first day of the month
                $date = Carbon::create($year, $month, 1);

                // Get the number of days in the month
                $daysInMonth = $date->daysInMonth;

                // Loop through each day of the month
                for ($day = 1; $day <= $daysInMonth; $day++) {
                    // Create a Carbon instance for the current day
                    $currentDate = $date->copy()->setDay($day);
                    
                    // Check if the current day is not a Sunday
                    if ($currentDate->dayOfWeek !== Carbon::SUNDAY) {
                        // Add the current date to the array
                        $datesWithoutSundays[] = $currentDate->format('Y-m-d');
                    }
                }
            }
        return $datesWithoutSundays;
    }

    public function get_sales_annual_settings(Request $request)
    {
            //select query from the url parameter
            $page = $request->query('page');
            $limit = $request->query('limit');
            $query = $request->query('q');
            $filter = $request->query('f');
            $user_id = $request->query('uid');

            if(empty($user_id)){
                $response = [
                    'result' => false,
                    'status' => 'warning',
                    'title' => 'Oppss!',
                    'message' => "Invalid request. Please login." ,
                ];
                return response($response,200);
            }
            $queryBuilder = SalesDailyOutAnnualSettingsSales::whereNull('deleted_at');
            if (!empty($filter)) {
                    $queryBuilder->where('year_sales_target', $filter);
            }
            if (!empty($query)) {
                $salesData = $queryBuilder->where(function ($queryBuilder) use ($query) {
                     $queryBuilder->where('section', 'like', '%' . $query . '%')
            ->orWhere('subsection', 'like', '%' . $query . '%');
                })->paginate($limit);
            } else {
                $salesData = $queryBuilder->paginate($limit);
            }

            $dataList = $salesData->toArray();
            $dataListCount = $salesData->count();

            $response = [
                'dataList' => $dataList,
                'result' => true,
                'title'=>'Success',
                'status'=>'success',
                'message'=> 'Authentication successful.',
            ];
        return Crypt::encryptString(json_encode($response));
    }

    public function get_number_of_days_in_a_month_with_out_sunday($sales_date, $quota) 
    {
        $carbonDate = Carbon::parse($sales_date);
        $month = $carbonDate->month;
        $year = $carbonDate->year;
        
        // Create a Carbon instance for the first day of the month
        $date = Carbon::create($year, $month, 1);

        // Get the number of days in the month
        $daysInMonth = $date->daysInMonth;

        // Initialize a counter for non-Sunday days
        $nonSundayDaysCount = 0;

        // Loop through each day of the month
        for ($day = 1; $day <= $daysInMonth; $day++) {
            // Check if the current day is not a Sunday
            if (!$date->copy()->setDay($day)->isSunday()) {
                $nonSundayDaysCount++;
            }
        }

        // Calculate and return the quota per non-Sunday day
        return $quota / $nonSundayDaysCount;
    }
}
