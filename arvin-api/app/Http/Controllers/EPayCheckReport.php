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
use Illuminate\Support\Facades\DB;
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
            $df     = $validated['df'];
            $dt     = $validated['dt'];
            
            if ($validated['sc']=='ALL') {      
                $get_user_login = Auth::user()->code;
                $allSection     = UserAccessOrganizationRights::where('subsection_code',$get_user_login)->pluck('subsection_code');
           }
  
           $query =  DB::table('vw_epay_check_get_check_details')
                    ->select(
                        'account_number','card_name','check_number','check_date','check_amount','check_status_date','prefix_crpr','bank_description',
                        'subsection_code','deposited_date','deposited_bank','rejected_date','received_date','created_at','check_status'
                    );

            if ($validated['sc'] === 'ALL') {
                $query->whereIn('subsection_code', $allSection);
            }else{
                $query->where('subsection_code',$validated['sc']); 
            }

            $query->when(in_array($validated['st'], ['DEPOSITED', 'TRANSMITTED','REJECTED']), function ($q) use ($df, $dt) {
                $q->whereBetween(DB::raw("CAST(check_status_date AS DATE)"), [$df, $dt]);
            })
            ->where('check_status', $validated['st']);

            $results = $query->get();
            $data = [];
            foreach ($results as $key => $value) {
                $data[] = [
                    'account_number'     => $value->account_number,
                    'card_name'          => $value->card_name,
                    'check_number'       => $value->check_number,
                    'check_date'         => !empty($value->check_date) ? Carbon::parse($value->check_date)->format("Y-m-d") : "",
                    'check_amount'       => $value->check_amount,
                    'check_status_date'  => !empty($value->check_status_date) ? Carbon::parse($value->check_status_date)->format("Y-m-d") : "",
                    'prefix_crpr'        => $value->prefix_crpr,
                    'bank_description'   => $value->bank_description,
                    'subsection_code'    => $value->subsection_code,
                    'deposited_date'     => !empty($value->deposited_date) ? Carbon::parse($value->deposited_date)->format("Y-m-d") : "",
                    'deposited_bank'     => explode(" ",$value->deposited_bank)[0] ?? '',
                    'check_status'     => $value->check_status,
                    'rejected_date'      => !empty($value->rejected_date) ? Carbon::parse($value->rejected_date)->format("Y-m-d") : "",
                    'received_date'      => !empty($value->received_date) ? Carbon::parse($value->received_date)->format("Y-m-d") : "",
                    'created_at'      => !empty($value->created_at) ? Carbon::parse($value->created_at)->format("Y-m-d") : "",
                ];
            }
            
            $warehouse = RefSubSections::where('code',$validated['sc'])->first();

            $header = [
                'title'       =>'MONITORING CHECK COUNTER',
                'date_from'   => Carbon::parse($validated['df'])->format('M d, Y'), // Feb 10, 2023
                'date_to'     => Carbon::parse($validated['dt'])->format('M d, Y'), // Feb 10, 2023 
                'status'      => $validated['st'],
                'sub_section' => $warehouse->description,
            ];
        

            $response = [
                'header'           => $header,
                'body'             => $data,
                'footer'           => []
            ];
            
            return Crypt::encryptString(json_encode($response));
    }

    public function get_received_check_counter(Request $request){
        $customMessages = [
            'df.required'         => 'The start date is required.',
            'df.date'             => 'The start date must be a valid date.',
            'df.date_format'      => 'The start date must be in MM/DD/YYYY format.', 
        ];

        $validator = Validator::make($request->all(), [
            'df'   => ['required', 'date', 'date_format:Y-m-d'],
            'dt'   => ['required', 'date', 'date_format:Y-m-d', 'after_or_equal:df'], 
            'sc'   => ['required', 'string'],
        ], $customMessages); // Pass custom messages here

        if ($validator->fails()) {
            return response()->json([
                'result'      => false,
                'status'      => 'warning',
                'title'       => 'Error',
                'message'     => $validator->errors()->first(),
            ], 422);
        }

        $validated = $validator->validated();
        $df = $validated['df'];
        $dt = $validated['dt'];

        $query = DB::table('vw_epay_check_get_check_details')
        ->select(
            'account_number','card_name','check_number','check_date','check_amount','check_status_date','prefix_crpr','bank_description',
            'subsection_code','deposited_date','deposited_bank','rejected_date','received_date','created_at','check_status'
        );

        if ($validated['sc'] === 'ALL') {
            $get_user_login = Auth::user()->code;
            $allSection     = UserAccessOrganizationRights::where('subsection_code',$get_user_login)->pluck('subsection_code');
            $query->whereIn('subsection_code', $allSection);
        }else{
            $query->where('subsection_code',$validated['sc']); 
        }

        $query->whereBetween('received_date', [$df, $dt]);
        $query->where('check_status', 'TRANSMITTED');
        $results = $query->get();
        $data = [];
        foreach ($results as $key => $value) {
            $data[] = [
                'account_number'     => $value->account_number,
                'card_name'          => $value->card_name,
                'check_number'       => $value->check_number,
                'check_date'         => !empty($value->check_date) ? Carbon::parse($value->check_date)->format("Y-m-d") : "",
                'check_amount'       => $value->check_amount,
                'check_status_date'  => !empty($value->check_status_date) ? Carbon::parse($value->check_status_date)->format("Y-m-d") : "",
                'prefix_crpr'        => $value->prefix_crpr,
                'bank_description'   => $value->bank_description,
                'subsection_code'    => $value->subsection_code,
                'deposited_date'     => !empty($value->deposited_date) ? Carbon::parse($value->deposited_date)->format("Y-m-d") : "",
                'deposited_bank'     => explode(" ",$value->deposited_bank)[0] ?? '',
                'rejected_date'      => !empty($value->rejected_date) ? Carbon::parse($value->rejected_date)->format("Y-m-d") : "",
                'received_date'      => !empty($value->received_date) ? Carbon::parse($value->received_date)->format("Y-m-d") : "",
                'created_at'      => !empty($value->created_at) ? Carbon::parse($value->created_at)->format("Y-m-d") : "",
            ];
        }
            
        $warehouse = RefSubSections::where('code',$validated['sc'])->first();

        $header = [
            'title'       =>'RECEIVED CHECK COUNTER',
            'date_from'   => Carbon::parse($validated['df'])->format('M d, Y'), // Feb 10, 2023
            'date_to'     => Carbon::parse($validated['dt'])->format('M d, Y'), // Feb 10, 2023  
            'sub_section' => $warehouse->description,
        ];

        $response = [
            'header'           => $header,
            'body'             => $data,
            'footer'           => []
        ];

        return Crypt::encryptString(json_encode($response));
    }
    
    
}