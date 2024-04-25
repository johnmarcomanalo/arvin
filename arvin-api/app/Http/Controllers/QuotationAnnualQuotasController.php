<?php

namespace App\Http\Controllers;

use App\Models\QuotationAnnualQuotas;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Crypt;
use Illuminate\Contracts\Encryption\DecryptException;
class QuotationAnnualQuotasController extends Controller
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
            dd($request);

            
        // $fields = $request->validate([
        //     'company_code' => 'required',
        //     'business_unit_code' => 'required',
        //     'team_code' => 'required',
        //     'department_code' => 'required',
        //     'section_code' => 'required',
        //     'target_year_quota' => 'required',
        //     'target_annual_quota' => 'required',
        //     'target_month_quota' => 'required',
        //     'target_day_quota' => 'required',
        //     'added_by' => 'required',
        //     'modified_by' => 'required',
        // ]);

        // $qouta = QuotationAnnualQuotas::where('target_year_quota',$fields['target_year_quota'])
        //     ->where('target_year_quota',$fields['target_year_quota'])
        //     ->where('company_code',$fields['company_code'])
        //     ->where('business_unit_code',$fields['business_unit_code'])
        //     ->where('team_code',$fields['team_code'])
        //     ->where('department_code',$fields['department_code'])
        //     ->where('section_code',$fields['section_code'])
        //     ->where('subsection_code',$fields['subsection_code'])
        //     ->count();
        // if($qouta > 0){
        //     $response = [
        //             'message' => 'There is already a qouta for : 
        //                 '.$request->section.' Year : '.$fields['target_year_quota'].'Amount'.$value->amount,
        //             'result' => false,
        //             'icon' => 'error',
        //             'title' => 'Oppss!',
        //         ];
        //     return response($response,400);
        // }

        //  $data = QuotationAnnualQuotas::create([
        //             'company_code' => $fields["company_code"],
        //             'business_unit_code' => $fields["business_unit_code"],
        //             'team_code' => $fields["team_code"],
        //             'section_code' => $fields["section_code"],
        //             'subsection_code' =>$request->subsection_code,
        //             'target_year_quota' => $fields["target_year_quota"],
        //             'target_annual_quota' => $fields["target_annual_quota"],
        //             'target_monthly_quota' => $fields["target_monthly_quota"],
        //             'target_daily_quota' => $fields["target_daily_quota"],
        //             'added_by' => $fields["added_by"],
        //             'modified_by' => $fields["modified_by"],
        //     ]);

        // return response([
        //     'message' => '',
        //     'result' => true,
        //     'icon' => 'success',
        //     'title' => 'Successfully Added!',
        //     'result' => true,
        // ], 200); 
    }

    /**
     * Display the specified resource.
     *
     * @param  \App\Models\QuotationAnnualQuotas  $quotationAnnualQuotas
     * @return \Illuminate\Http\Response
     */
    public function show(QuotationAnnualQuotas $quotationAnnualQuotas)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Models\QuotationAnnualQuotas  $quotationAnnualQuotas
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, QuotationAnnualQuotas $quotationAnnualQuotas)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Models\QuotationAnnualQuotas  $quotationAnnualQuotas
     * @return \Illuminate\Http\Response
     */
    public function destroy(QuotationAnnualQuotas $quotationAnnualQuotas)
    {
        //
    }

    public function annual_qouta_computation($amount){
        $annual_qouta = $amount;
        $months_to_divide = 12;
        $days_to_divide = 26;
        $monthly_qouta = 0;
        $daily_qouta = 0;
        if($amount > 0){
            $monthly_qouta = MainController::divide([$annual_qouta,$months_to_divide]);
        }
        if($monthly_qouta > 0){
            $daily_qouta = MainController::divide([$monthly_qouta,$days_to_divide]);
        }
        $response = [
            "annual_qouta"=>MainController::amountFormat($annual_qouta),
            "monthy_qouta"=>MainController::amountFormat($monthly_qouta),
            "daily_qouta"=>MainController::amountFormat($daily_qouta)
        ];
        return Crypt::encryptString(json_encode($response));
    }

    public function post_annual_qouta(Request $request)
    {
         $decrypted = Crypt::decryptString($request);
        echo($decrypted);
        // $fields = $request->validate([
        //     'company_code' => 'required',
        //     'business_unit_code' => 'required',
        //     'team_code' => 'required',
        //     'department_code' => 'required',
        //     'section_code' => 'required',
        //     'target_year_quota' => 'required',
        //     'target_annual_quota' => 'required',
        //     'target_month_quota' => 'required',
        //     'target_day_quota' => 'required',
        //     'added_by' => 'required',
        //     'modified_by' => 'required',
        // ]);

        // $qouta = QuotationAnnualQuotas::where('target_year_quota',$fields['target_year_quota'])
        //     ->where('target_year_quota',$fields['target_year_quota'])
        //     ->where('company_code',$fields['company_code'])
        //     ->where('business_unit_code',$fields['business_unit_code'])
        //     ->where('team_code',$fields['team_code'])
        //     ->where('department_code',$fields['department_code'])
        //     ->where('section_code',$fields['section_code'])
        //     ->where('subsection_code',$fields['subsection_code'])
        //     ->count();
        // if($qouta > 0){
        //     $response = [
        //             'message' => 'There is already a qouta for : 
        //                 '.$request->section.' Year : '.$fields['target_year_quota'].'Amount'.$value->amount,
        //             'result' => false,
        //             'icon' => 'error',
        //             'title' => 'Oppss!',
        //         ];
        //     return response($response,400);
        // }

        //  $data = QuotationAnnualQuotas::create([
        //             'company_code' => $fields["company_code"],
        //             'business_unit_code' => $fields["business_unit_code"],
        //             'team_code' => $fields["team_code"],
        //             'section_code' => $fields["section_code"],
        //             'subsection_code' =>$request->subsection_code,
        //             'target_year_quota' => $fields["target_year_quota"],
        //             'target_annual_quota' => $fields["target_annual_quota"],
        //             'target_monthly_quota' => $fields["target_monthly_quota"],
        //             'target_daily_quota' => $fields["target_daily_quota"],
        //             'added_by' => $fields["added_by"],
        //             'modified_by' => $fields["modified_by"],
        //     ]);

        // return response([
        //     'message' => '',
        //     'result' => true,
        //     'icon' => 'success',
        //     'title' => 'Successfully Added!',
        //     'result' => true,
        // ], 200); 
    }
}
