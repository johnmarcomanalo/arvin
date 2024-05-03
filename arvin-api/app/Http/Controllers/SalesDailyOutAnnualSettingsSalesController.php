<?php

namespace App\Http\Controllers;

use App\Models\SalesDailyOutAnnualSettingsSales;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Crypt;
use Illuminate\Contracts\Encryption\DecryptException;

class SalesDailyOutAnnualSettingsSalesController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        $salesData = SalesDailyOutAnnualSettingsSales::whereNull('deleted_at')->get();
        $dataList = $salesData->toArray();
        $dataListCount = $salesData->count();

        $response = [
            'dataList' => $dataList,
            'dataListCount' => $dataListCount,
            'result' => true,
            'icon' => 'success',
            'title' => '',
        ];
        return response(Crypt::encryptString(json_encode($response)), 200);
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
                    'icon' => 'error',
                    'title' => 'Oppss!',
                ];
            return response($response,400);
        }
        $code = $this->generate_code();

      
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
     * @param  \App\Models\SalesDailyOutAnnualSettingsSales  $salesDailyOutAnnualSettingsSales
     * @return \Illuminate\Http\Response
     */
    public function show(SalesDailyOutAnnualSettingsSales $salesDailyOutAnnualSettingsSales)
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

    public function get_annual_monthly_daily_target_sales_by_section_subsection($type,$id,$year){
        
        $count = SalesDailyOutAnnualSettingsSales::where((string)$type,$id)->where("year_sales_target",$year)->count();
        if($count == 0){
            $response = [
                    'message' => "There's no target sales applied to this section/subsection in this current year",
                    'result' => false,
                    'icon' => 'error',
                    'title' => 'Oppss!',
                    "annual_sales_target"=>0,
                    "monthly_sales_target"=>0,
                    "daily_sales_target"=>0
                ];
            return response($response,404);
        }
        $annual_monthly_daily_target_sales_data = SalesDailyOutAnnualSettingsSales::where((string)$type,$id)->where("year_sales_target",$year)->first();
       
        $response = [
            "year_sales_target"=>$annual_monthly_daily_target_sales_data->year_sales_target,
            "annual_sales_target"=>$annual_monthly_daily_target_sales_data->annual_sales_target,
            "monthly_sales_target"=>$annual_monthly_daily_target_sales_data->monthly_sales_target,
            "daily_sales_target"=>$annual_monthly_daily_target_sales_data->daily_sales_target,
            "sales_daily_out_annual_settings_sales_code"=>$annual_monthly_daily_target_sales_data->code
        ];

        return Crypt::encryptString(json_encode($response));
    }
}
