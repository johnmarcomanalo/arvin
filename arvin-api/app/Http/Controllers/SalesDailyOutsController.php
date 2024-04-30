<?php

namespace App\Http\Controllers;

use App\Models\SalesDailyOuts;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Crypt;

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

    public function get_sales_daily_out($date,$section,$subsection){
        $response = [
                    "date"=>$date,
                    "section"=>$section,
                    "subsection"=>$subsection,
        ];
        return ;
    }


}
