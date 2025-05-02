<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\EPayCheckCheckDetails;
use App\Models\RefSubSections;
use App\Models\UserAccessOrganizationRights;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Crypt;
use Illuminate\Support\Facades\Validator;

class EPayCheckReport extends Controller
{
    private function report_by_bank(Request $request){
        $customMessages = [
            'df.required'         => 'The start date is required.',
            'df.date'             => 'The start date must be a valid date.',
            'df.date_format'      => 'The start date must be in MM/DD/YYYY format.', 
            'dt.required'         => 'The End date is required.',
            'dt.date'             => 'The End date must be a valid date.',
            'dt.after_or_equal'   => 'The selected end date must be the same as or later than the start date.',
            'dt.date_format'      => 'The end date must be in MM/DD/YYYY format.',
            'bnk.required'        => 'The Bank is required.',
            ];
            
            $validator = Validator::make($request->all(), [
                'df'              => ['required', 'date', 'date_format:Y-m-d'],
                'dt'              => ['required', 'date', 'date_format:Y-m-d', 'after_or_equal:df'], 
                'sc'              => ['required', 'string'],
                'bnk'             => ['required', 'string'],
            ], $customMessages); // Pass custom messages here
            
            if ($validator->fails()) {
                return response()->json([
                    'result'      => false,
                    'status'      => 'warning',
                    'title'       => 'Error',
                    'message'     => $validator->errors()->first(),
                ], 422);
            }

            $validated            = $validator->validated();
            
            $query = EPayCheckCheckDetails::from('e_pay_check_check_details as d')
            ->select(
                'd.code',
                'd.account_number',
                'd.cardname',
                'd.check_number',
                'd.check_date',
                'd.check_amount'
            )
            ->join('e_pay_check_check_detail_logs as l', 'd.code', '=', 'l.check_details_code')
            ->where('l.subsection_code', $validated['sc'])
            ->where('l.check_status', 'DEPOSITED')
            ->where('l.deposited_bank', $validated['bnk'])
            ->whereBetween('l.created_at', [$validated['df'], $validated['dt']]);
        

            $response = [
                'header'           => [],
                'body'             => $query,
                'footer'           => []
            ];
            
            return Crypt::encryptString(json_encode($response));
    }

    public function get_monitoring_check_counter(Request $request){
        return $request;
        
            $customMessages = [
                'df.required'         => 'The start date is required.',
                'df.date'             => 'The start date must be a valid date.',
                'df.date_format'      => 'The start date must be in MM/DD/YYYY format.', 
                'dt.required'         => 'The End date is required.',
                'dt.date'             => 'The End date must be a valid date.',
                'dt.after_or_equal'   => 'The selected end date must be the same as or later than the start date.',
                'dt.date_format'      => 'The end date must be in MM/DD/YYYY format.',
                'st.required'         => 'The Status is required.',
            ];
            
            $validator = Validator::make($request->all(), [
                'df'   => ['required', 'date', 'date_format:Y-m-d'],
                'dt'   => ['required', 'date', 'date_format:Y-m-d', 'after_or_equal:df'], 
                'sc'   => ['required', 'string'],
                'st'   => ['required', 'string'],
            ], $customMessages); // Pass custom messages here
            
            if ($validator->fails()) {
                return response()->json([
                    'result'      => false,
                    'status'      => 'warning',
                    'title'       => 'Error',
                    'message'     => $validator->errors()->first(),
                ], 422);
            }

            $validated            = $validator->validated();

            
            if ($validated['sc']=='ALL') {      
                $get_user_login = Auth::user()->code;
                $allSection     = UserAccessOrganizationRights::where('subsection_code',$get_user_login)->pluck('subsection_code');
           }
  
           $query = EPayCheckCheckDetails::from('e_pay_check_check_details as d')
                ->select(
                    'd.code',
                    'd.account_number',
                    'd.cardname',
                    'd.check_number',
                    'd.check_date',
                    'd.check_amount',
                    'd.check_status_date',
                    'd.prefix_crpr',
                    'd.bank_description',
                    'l.deposited_date',
                    'l.deposited_bank',
                    'l.rejected_date',
                    'l.received_date',
                )
                ->join('e_pay_check_check_detail_logs as l', 'd.code', '=', 'l.check_details_code');

            if ($validated['sc'] === 'ALL') {
                $query->whereIn('l.subsection_code', $allSection);
            }else{
                $query->where('l.subsection_code',$validated['sc']); 
            }

            $query->where('l.check_status', $validated['st'])
                  ->whereBetween('l.created_at', [$validated['df'], $validated['dt']]);

            $results = $query->get();
            $warehouse = RefSubSections::where('code',$validated['sc'])->first();

            $header = [
                'title'       =>'Deposited Check Counter',
                'date_from'   => Carbon::parse($validated['df'])->format('M d, Y'), // Feb 10, 2023
                'date_to'     => Carbon::parse($validated['dt'])->format('M d, Y'), // Feb 10, 2023 
                'status'      => $validated['st'],
                'sub_section' => $warehouse->description,
            ];
        

            $response = [
                'header'           => $header,
                'body'             => $results,
                'footer'           => []
            ];
            
            return Crypt::encryptString(json_encode($response));
    }
    
}