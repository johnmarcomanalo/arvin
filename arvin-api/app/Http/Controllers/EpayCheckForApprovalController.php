<?php

namespace App\Http\Controllers;

use App\Models\EPayCheckApprovalRequest;
use App\Models\EPayCheckCheckDetails;
use App\Models\EPayCheckCheckSalesInvoiceDetails;
use Carbon\Carbon;
use Illuminate\Validation\Rule;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Crypt;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Validator;

class EpayCheckForApprovalController extends Controller
{

    private const DATEDCHECK = 'DATED CHECK';
    private const ONHAND = 'ON-HAND';
    private const APPROVED = 'APPROVED';
    private const PENDING = 'PENDING';
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
        //
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show(Request $request)
    { 
        $code   =  $request->check_approval;
        $result =  EPayCheckCheckSalesInvoiceDetails::where('check_details_code',$code)->get();
        foreach ($result as $key => $value) {
            $dataList[] = [
                'bp_payment_term'=>$value->bp_payment_term,
                'internal_approved_term'=>$value->internal_approved_term,
                'doctotal'=>$value->doctotal,
                'code'=>$value->code,
                'doc_number'=>$value->doc_number,
                'doc_total'=>$value->doc_total,
                'doc_date'=> Carbon::parse($value->doc_date)->format('Y-m-d'),
                'dr_number'=>$value->dr_number,
                'sales_invoice'=>$value->sales_invoice,
            ];
        }
       
        return Crypt::encryptString(json_encode([ 
            'dataList'      => $dataList, 
            'title'         => 'Success',
            'status'        => 'success',
            'message'       => 'Fetched successfully.', 
        ]));
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, $id)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        //
    } 

    public function get_for_approval_list(Request $request) {
      
        $validator = Validator::make($request->all(), [
            'q'  => ['nullable','string'],
            's'  => ['nullable','string'],
            'p'  => ['nullable','integer','min:1'],
            'sc' => ['required', 'string'], 
        ]); // Pass custom messages here
        
        if ($validator->fails()) {
            return response()->json([
                'result'  => false,
                'status'  => 'warning',
                'title'   => 'Error',
                'message' => $validator->errors()->first(),
            ], 422);
        }
        
        $validated = $validator->validated();
    
        $query  = $validated['q']  ?? '';
        $status = $validated['s'];
        $page   = $validated['p']  ?? 1;
        $sc     = $validated['sc']; 
        
       $check_details =  DB::table('vw_epay_check_get_check_details')
        ->when($query, function ($q) use ($query) {
            $q->where(function ($subQuery) use ($query) {
                $subQuery
                    ->where('card_name', 'like', "%{$query}%")
                    ->orWhere('card_code', 'like', "%{$query}%")
                    ->orWhere('bank_description', 'like', "%{$query}%")
                    ->orWhere('bank_branch', 'like', "%{$query}%")
                    ->orWhereRaw("CAST(check_amount AS VARCHAR) LIKE ?", ["%{$query}%"])
                    ->orWhere('check_number', 'like', "%{$query}%");
            });
        })
        ->when($sc !== 'All', function ($q) use ($sc) {
            return $q->where('subsection_code', $sc);
        })
         
        ->where('check_status', self::ONHAND)
        // ->where('request_status',$status)
        
        ->paginate(10, ['*'], 'page', $page);
    
        
        $dataList = [];

        foreach ($check_details as $value) { 
            $dataList[] = [
                'code'                  => $value->code,
                'advance_payment'       => $value->advance_payment, 
                'bank_branch'           => $value->bank_branch,
                'bank_description'      => $value->bank_description,
                'crpr'                  => $value->crpr,
                'check_amount'          => $value->check_amount,
                'check_amount_display'  => number_format($value->check_amount, 4),
                'check_date'            => Carbon::parse($value->check_date)->format('Y-m-d'),
                'check_number'          => $value->check_number,
                'check_status'          => $value->check_status,
                'check_status_date'     => Carbon::parse($value->check_status_date)->format('Y-m-d'),
                'card_code'             => $value->card_code,
                'card_name'             => $value->card_name,
                'remarks'               => $value->remarks,
                'account_number'        => $value->account_number,
                'subsection_code'       => $value->subsection_code,
                'message'               => $value->message,
                'request_status'        => $value->request_status,
                'created_at'            => Carbon::parse($value->created_at)->format('Y-m-d'),
                'received_date'         => $value->received_date ? Carbon::parse($value->received_date)->format('Y-m-d') : null, 
            ];
        }
        
        
           $response = [
                'dataList'      => $dataList,
                'dataListCount' => $check_details->total(),
                'currentPage'   => $check_details->currentPage(),
                'perPage'       => $check_details->perPage(),
                'result'        => true,
                'title'         => 'Success',
                'status'        => 'success',
                'message'       => 'Fetched successfully.',
            ];
        
            return Crypt::encryptString(json_encode($response));
    }
    

    public static function check_for_validity($check_amount, $check_date, $sales_invoice_ist) {
   
        $check_date       = Carbon::parse($check_date); // Convert to Carbon instance
        $sales_data       = (array) $sales_invoice_ist;
        $bp_payment_term  = array_column($sales_data, 'bp_payment_term');
        $total            = array_sum(array_column($sales_data, 'doctotal'));
        $is_same          = count(array_unique($bp_payment_term)) === 1;
    
        // Check if all invoices have the same payment mode
        if (!$is_same) {
            $unique_terms = implode(', ', array_unique($bp_payment_term)); // Get all unique payment modes
            return [
                'message_type' => 'PAYMENT MODE',
                'message'      => "Invoices have different payment modes: ({$unique_terms})",
                'status'       => true
            ];
        }
    
        // Check if total invoice amount is greater than check amount
        // if ($total > $check_amount) {
        //     $difference = $total - $check_amount;
        //     return [
        //         'message_type'      => 'AMOUNT',
        //         'message'           => "Total amount of invoices ({$total}) exceeds the check amount ({$check_amount}). The difference is ({$difference}).",
        //         'amount_difference' => $difference,
        //         'status'            => true
        //     ];
        // }

        // If payment mode is 'DATED CHECK', validate check date against terms
        if ($bp_payment_term[0] === self::DATEDCHECK) {
            // Ensure at least one invoice exists before accessing properties
            if (!empty($sales_invoice_ist) && isset($sales_invoice_ist[0])) {
                $first_invoice = $sales_invoice_ist[0];
                $terms_date    = Carbon::today(); // Compute terms date
                if ($check_date>=$terms_date) {
                    return [
                        'message_type' => 'CHECK DATE',
                        'message'      => "The payment term of this client is DATED CHECK, and the check date ({$check_date->toDateString()}) is equal to the allowed terms date.",
                        'status'       => true
                    ];
                }  
            }
        }

        if ($bp_payment_term[0] !== self::DATEDCHECK) {
            $first_invoice = $sales_invoice_ist[0];
            $extra_days    = $first_invoice->internal_approved_term ?? 1; 
            $terms_date    = Carbon::parse($first_invoice->docdate)->addDays($extra_days); // Compute terms date
        
            if ($check_date->greaterThan($terms_date)) {
                return [
                    'message_type' => 'PAYMENT TERM',
                    'message'      => "The check date ({$check_date->toDateString()}) exceeds the allowed terms date ({$terms_date->toDateString()}). The customer's payment term is {$extra_days} DAYS.",
                    'status'       => true
                ];
            }
        } 
    
        return [];
    }
    
    public function update_request_status(Request $request){
        try {
            // Validate input data
            $fields = [
                'code' => 'required|array',
                'request_status' => 'required|string|in:APPROVED,UNDO,DISAPPROVED', // Allow only these values
            ];
    
            $validator = Validator::make($request->all(), $fields);
            
            if ($validator->fails()) {
                return response()->json([
                    'result'  => false,
                    'status'  => 'error',
                    'title'   => 'Error',
                    'message' => $validator->errors()->first()
                ], 422);
            }
    
            $validatedData = $validator->validated();
            $userCode    = Auth::user()->code; // Cache user code
            $currentTime = Carbon::now();
    
            // Start a database transaction
            DB::beginTransaction();
    
            try {
                // Define the update data based on request_status
                $updateData = match ($validatedData['request_status']) {
                    'APPROVED' => [
                        'approved_by'    => $userCode,
                        'approved_at'    => $currentTime,
                        'request_status' => 'APPROVED'
                    ],
                    'DISAPPROVED' => [
                        'approved_by'    => $userCode, // Store who disapproved
                        'approved_at'    => $currentTime, // Store timestamp
                        'request_status' => 'DISAPPROVED'
                    ],
                    default => [ // UNDO case
                        'approved_by'    => null,
                        'approved_at'    => null,
                        'request_status' => 'PENDING'
                    ]
                };
    
                // Update the `EPayCheckApprovalRequest` table in batch
                $updated = EPayCheckApprovalRequest::whereIn('check_details_code', $validatedData['code'])
                    ->update($updateData);
    
                if ($updated) {
                    // Update the related `EPayCheckCheckDetails` table in batch
                    EPayCheckCheckDetails::whereIn('code', $validatedData['code'])
                        ->update(['request_status' => $validatedData['request_status']]);
                }
    
                // Commit transaction if everything is successful
                DB::commit();
    
                return response()->json([
                    'result'  => true,
                    'status'  => 'success',
                    'title'   => 'Success',
                    'message' => "Request status updated to {$validatedData['request_status']}."
                ]);
    
            } catch (\Exception $e) {
                // Rollback transaction in case of failure
                DB::rollBack();
                throw $e;
            }
    
        } catch (\Exception $e) {
            return response()->json([
                'result'  => false,
                'status'  => 'error',
                'title'   => 'Error',
                'message' => $e->getMessage()
            ], 500);
        }
    }
    
    

}
