<?php

namespace App\Http\Controllers;

use App\Models\EPayCheckApprovalRequest;
use App\Models\EPayCheckCheckDetailLogs;
use App\Models\EPayCheckCheckDetails;
use App\Models\EPayCheckCheckSalesInvoiceDetails;
use App\Models\EPayCheckReceiptDetails;
use App\Models\EPayCheckReject;
use App\Models\RefDepartments;
use App\Models\RefSubSections;
use App\Models\RefTeams;
use App\Models\UsersAccounts;
use Carbon\Carbon;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Validation\Rule;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Crypt;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Validator;

class EPayCheckCheckDetailsController extends Controller
{
    //CHECK STATUS
    private const UNDO = 'UNDO';
    private const ONHAND = 'ON-HAND';
    private const DEPOSITED = 'DEPOSITED';
    private const TRANSMITTED = 'TRANSMITTED';
    private const REJECTED = 'REJECTED';
    private const NO = 'NO';
    private const COLLECTION_RECEIPT = 'CR';
    private const PROVISIONAL_RECEIPT = 'PR';
    

    public function __construct()
    {
        $this->middleware('auth');
    }


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
        try {
            DB::beginTransaction();
    
            // Base validation rules
            $fields = [
                'account_number'   => 'string',
                'advance_payment'  => 'boolean', 
                'bank_branch'      => 'required|string',
                'bank_description' => 'required|string',
                'crpr'             => 'required|string|min:0',
                'check_amount'     => 'required|numeric|min:0',
                'check_date'       => 'required|date|after_or_equal:' . Carbon::now()->subYears(1)->toDateString() . '|before_or_equal:' . Carbon::now()->addYears(2)->toDateString(),
                'check_number'     => [
                    'required',
                    Rule::unique('e_pay_check_check_details', 'check_number')->where(function ($query) use ($request) {
                        return $query->where('card_code', $request->card_code);
                    })
                ],
                'card_name'        => 'required',
                'card_code'        => 'required',
                'sap'              => 'required|string',
                'subsection_code'  => 'required|string',
                'remarks'          => 'nullable',
            ];
             
            // Conditionally add the invoice_list validation if advance_payment is 'NO'
            if ($request->advance_payment) {
                $fields['document_type'] = 'required|string';
                $fields['prefix']    = 'required|regex:/^[A-Za-z]$/';
            }else{
                $fields['invoice_list'] = 'array|required';
            }
    
            // Custom messages for validation
            $customMessages = [
                'invoice_list.required' => 'Kindly select list of invoices if this is not an advance payment.',
                'check_date.date' => 'The check date must be a valid date.',
                'card_name.required' => 'Customer name is required.',
                'card_code.required' => 'Customer code is required.',
                'check_date.after_or_equal' => 'Please enter a valid check date',
                'check_number.unique' => 'This check number has already been entered.',
            ];
    
            // Validate the request data
            $validator = Validator::make($request->all(), $fields, $customMessages);
     
            if ($validator->fails()) {
                return response()->json([
                    'result' => false,
                    'status' => 'warning',
                    'title' => 'Warning',
                    'message' => $validator->errors()->first()
                ], 422);
            }
    
            // Get validated data
            $validatedData = $validator->validated();
    
            // Set identity code and other fields
            $validatedData['code'] = MainController::generate_code('App\Models\EPayCheckCheckDetails', "code");
            $validatedData['check_status'] = self::ONHAND;
            $validatedData['check_status_date'] = Carbon::now();
            $validatedData['advance_payment'] = $request->advance_payment ?? 0; 
            $validatedData['stale_check'] = $this->isStaleCheck($validatedData['check_date']);
 
       
 
            if($validatedData['advance_payment']){
                $validatedData['prefix_crpr'] = $this->getPrefixCrpr(
                    $validatedData['crpr'],
                    [
                        'document_type' => $validatedData['document_type'],
                        'prefix'        => $validatedData['prefix']
                    ],
                    true
                );
                unset($validatedData['document_type']);
                unset($validatedData['prefix']);
            }else{
                $validatedData['prefix_crpr'] = $this->getPrefixCrpr(
                    $validatedData['crpr'],
                    $validatedData['invoice_list'],
                    false
                );
                unset($validatedData['invoice_list']);
            }
 
            // Create record for check details
            $resultData = EPayCheckCheckDetails::create($validatedData); 
    
            if ($resultData) {
                $codeLogs = MainController::generate_code('App\Models\EPayCheckCheckDetailLogs', "code");
                $logFields = [
                    'code' => $codeLogs,
                    'check_details_code' => $resultData['code'],
                    'check_status' => $validatedData['check_status'],
                ];

                EPayCheckCheckDetailLogs::create($logFields);

            }
    
            // Handle advance payment logic
            if (!$request->advance_payment) {
                // Validate invoice_list if advance_payment is 'NO'
                if (isset($request['invoice_list']) && count($request['invoice_list']) > 0) {
                    $resultInvoices = EPayCheckCheckSalesInvoiceDetailsController::store_sales_invoice_details($request['invoice_list'], $resultData['code']);
                    if (!$resultInvoices) {
                        DB::rollBack();
                        $response = [
                            'result' => false,
                            'status' => 'failed',
                            'title' => 'Failed',
                            'message' => 'Failed to save invoice list.'
                        ];
                        return Crypt::encryptString(json_encode($response));
                    }
                }
            }
     
            $printData = [
                'receipt_number'      => $resultData['prefix_crpr'],
                'receipt_code'        => "",
                'receipt_description' => "",
            ];
            
            if (!$resultData->advance_payment) {
                $invoices       = EPayCheckCheckSalesInvoiceDetails::where('check_details_code', $resultData['code'])->first();
                $receiptDetails = EPayCheckReceiptDetails::where([
                    'active'  => true,
                    'prefix'  => substr($invoices['sales_invoice'], 0, 1),
                    'form'    => $invoices['form']
                ])->first();
            
               if ($receiptDetails) {
                    $printData['receipt_code']        = $receiptDetails['code'];
                    $printData['receipt_description'] = $receiptDetails['description'];
               }else{
                    $response = [
                        'result'  => true,
                        'status'  => 'success',
                        'title'   => 'Success',
                        'message' => 'Record created successfully.',
                        'print'   => $printData
                    ];
               }
            }else{
                $receiptDetails = EPayCheckReceiptDetails::where([
                    'active'  => true,
                    'prefix'  => $request->prefix,
                    'form'    => $request->document_type
                ])->first();
                $printData['receipt_code']        = $receiptDetails['code'];
                $printData['receipt_description'] = $receiptDetails['description'];
            }
            // Commit transaction
             DB::commit();
                        
            // Prepare success response
            $response = [
                'result'  => true,
                'status'  => 'success',
                'title'   => 'Success',
                'message' => 'Record created successfully.',
                'print'   => $printData
            ];
    
            return Crypt::encryptString(json_encode($response));
    
        } catch (\Throwable $th) {
            // Rollback transaction in case of error
            DB::rollBack();
            Log::error('Error in store method: ' . $th);  // Logs the full error with stack trace
    
            // Return error response
            $response = [
                'result' => false,
                'status' => 'warning',
                'title' => 'Warning',
                'message' => 'An error occurred while saving the data.'
            ];
    
            return Crypt::encryptString(json_encode($response));
        }
    }


    /**
     * Display the specified resource.
     *
     * @param  \App\Models\EPayCheckCheckDetails  $ePayCheckCheckDetails
     * @return \Illuminate\Http\Response
     */
    public function show(EPayCheckCheckDetails $ePayCheckCheckDetails)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Models\EPayCheckCheckDetails  $ePayCheckCheckDetails
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, $id)
    {    
        try {
            DB::beginTransaction();
    
            // Find the record
            $ePayCheckCheckDetails = EPayCheckCheckDetails::find($id);

            if (!$ePayCheckCheckDetails) {
                return response()->json([
                    'result'  => false,
                    'status'  => 'error',
                    'title'   => 'Error',
                    'message' => 'Record not found.'
                ], 404);
            }
    
            // Validation Rules
            $fields = [
                'account_number'   => 'required',
                'bank_branch'      => 'required',
                'bank_description' => 'required',
                'crpr'             => 'required|numeric|min:1',
                'check_amount'     => 'required|numeric|min:1',
                'check_date'       => 'required',//|date|after_or_equal:' . Carbon::yesterday()->toDateString(),
                'check_number'     => 'required',
                'card_code'        => 'required',
                'card_name'        => 'required',
                'subsection_code'  => 'required',
                'modified_by'      => 'required',
                'request_status'   => 'required',
            ];
    
            // Custom messages for validation
            $customMessages = [
                'check_date.date' => 'The check date must be a valid date.',
                'check_date.after_or_equal' => 'The check date cannot be in the past.',
            ];
    
            $validator = Validator::make($request->all(), $fields, $customMessages);
    
            if ($validator->fails()) {
                return response()->json([
                    'result'  => false,
                    'status'  => 'error',
                    'title'   => 'Error',
                    'message' => $validator->errors()->first()
                ], 422);
            }

            
            // Get validated data
            $validatedData = $validator->validated();
            
            if($request->request_status === 'DISAPPROVED'){
                $validatedData['request_status'] = 'PENDING';
            }

            // Update the record
            $ePayCheckCheckDetails->updateOrFail($validatedData);

            if($request->request_status === 'DISAPPROVED'){
                EPayCheckApprovalRequest::where('check_details_code', $ePayCheckCheckDetails->code)
                ->update([
                    'request_status' => 'PENDING',
                    'approved_by'    => null,
                    'approved_at'    => null,
                ]);
            }
    
            // Response
            $response = [
                'result'  => true,
                'status'  => 'success',
                'title'   => 'Success',
                'message' => 'Record updated successfully.'
            ];
    
            DB::commit();
        
            return Crypt::encryptString(json_encode($response));
        } catch (ModelNotFoundException $e) {
            DB::rollBack();
            Log::error('Record not found: ' . $e->getMessage());
    
            return response()->json([
                'result'  => false,
                'status'  => 'error',
                'title'   => 'Error',
                'message' => 'Record not found.'
            ], 404);
        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Error in update method: ' . $e->getMessage());
    
            return response()->json([
                'result'  => false,
                'status'  => 'warning',
                'title'   => 'Warning',
                'message' => 'An error occurred while updating the data.'
            ], 500);
        }
    }
    
    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Models\EPayCheckCheckDetails  $ePayCheckCheckDetails
     * @return \Illuminate\Http\Response
     */
    public function destroy(EPayCheckCheckDetails $ePayCheckCheckDetails)
    {
        //
    }
     
    public function get_check_details(Request $request)
    { 
 
        $customMessages = [
            'dt.after_or_equal' => 'The selected end date must be the same as or later than the start date.',
            'df.date_format'    => 'The start date must be in YYYY-MM-DD format.',
            'dt.date_format'    => 'The end date must be in YYYY-MM-DD format.',
        ];
        $validator = Validator::make($request->all(), [
            'q'  => ['nullable','string'],
            's'  => ['nullable','string'],
            'p'  => ['nullable','integer','min:1'],
            'df' => ['required', 'date', 'date_format:Y-m-d'],
            'dt' => ['required', 'date', 'date_format:Y-m-d', 'after_or_equal:df'], 
            'sc' => ['required', 'string'],
        ], $customMessages); // Pass custom messages here
        
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
        $df     = $validated['df'];
        $dt     = $validated['dt'];
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
        ->when(in_array($status, ['DEPOSITED', 'TRANSMITTED','REJECTED']), function ($q) use ($df, $dt) {
            $q->whereBetween(DB::raw("CAST(check_status_date AS DATE)"), [$df, $dt]);
        })
        ->where('check_status', $status)
        // ->whereIn('request_status',['APPROVED','NONE'])
        ->where('subsection_code', $sc)
        ->paginate(10, ['*'], 'page', $page);
    
        
        $requests = [];

        foreach ($check_details as $value) { 
            $requests[] = [
                'code'                 => $value->code,
                'advance_payment'      => $value->advance_payment, 
                'bank_branch'          => $value->bank_branch,
                'bank_description'     => $value->bank_description,
                'crpr'                 => $value->crpr,
                'check_amount'         => $value->check_amount,
                'check_amount_display' => number_format($value->check_amount, 4),
                'check_date'           => Carbon::parse($value->check_date)->format('Y-m-d'),
                'check_number'         => $value->check_number,
                'check_status'         => $value->check_status,
                'check_status_date'    => Carbon::parse($value->check_status_date)->format('Y-m-d'),
                'card_code'            => $value->card_code,
                'card_name'            => $value->card_name,
                'prefix_crpr'          => $value->prefix_crpr,
                'remarks'              => $value->remarks,
                'subsection_code'      => $value->subsection_code,
                'account_number'       => $value->account_number,
                'created_at'           => Carbon::parse($value->created_at)->format('Y-m-d'),
                'received_date'        => $value->received_date ? Carbon::parse($value->received_date)->format('Y-m-d') : null, 
                'status'               => $value->check_status === 'REJECTED' ? (($value->rejected_status)?'CLOSED': 'OPEN' ): $value->check_status,
                'stale_check_view'     => $value->stale_check? 'YES' : 'NO',
                'stale_check'          => $value->stale_check,
                'sales_invoice'        => $value->sales_invoice,
                'dr_number'            => $value->dr_number,
            ];
        }
        
        
           $response = [
                'dataList'      => $requests,
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

    public function update_check_status(Request $request)
    {
        try {
            // Validate input data
            $request->validate([
                'code' => 'required|array',
                'status' => 'required|string',
                'bank_deposit' => 'nullable|string',
                'deposited_date' => 'nullable|date',
            ]);  
            $codes            = $request['code'];
            $check_status     = $request['status'];
            $deposited_bank   = $request['deposited_bank'];
            $deposited_date   = $request['deposited_date'];
            $rejected_date    = $request['rejected_date'];
            $rejected_remarks = $request['rejected_remarks'];
    
            if ($check_status === self::UNDO) {
                // Check if there are any logs where 'received_date' is null for the given codes
                 $checkIfAlreadyReceived = EPayCheckCheckDetailLogs::whereNull('received_date')
                    ->where('check_status','!=', self::ONHAND)
                    ->whereNull('deleted_at')
                    ->whereIn('check_details_code', $codes) // Removed unnecessary check_status condition
                    ->get();
            
                if ($checkIfAlreadyReceived->isNotEmpty()) { 
                    // Update the status of the check details to ONHAND
                    foreach ($checkIfAlreadyReceived as $value) {
                        EPayCheckCheckDetails::where('code', $value['check_details_code']) // Corrected field name
                        ->update([
                            'check_status' => self::ONHAND,
                            'check_status_date' => now()
                        ]);
            
                         // Soft delete ONLY logs where 'received_date' is null
                        EPayCheckCheckDetailLogs::where('check_details_code', $value['check_details_code'])
                            ->whereNull('received_date') // Ensures only logs without received_date are affected
                            ->where('check_status','!=', self::ONHAND)
                            ->update(['deleted_at' => now()]);
                    }
            
                    // Return success response
                    return Crypt::encryptString(json_encode([
                        'result' => true,
                        'status' => 'success',
                        'title' => 'Success',
                        'message' => 'Records updated successfully.'
                    ]));
                } else {
                    // Return warning response if no records were found
                    return Crypt::encryptString(json_encode([
                        'result' => true,
                        'status' => 'warning',
                        'title' => 'Warning',
                        'message' => 'Record has already been received.'
                    ]));
                }
            } else {
                
             // Iterate over the codes
            foreach ($codes as $key => $code) {
                $ePayCheckDetail = EPayCheckCheckDetails::where('code', $code)->first();

                // Check if the status is DEPOSITED and check date is overdue
                if ($check_status === self::DEPOSITED && $ePayCheckDetail && now()->lessThan($ePayCheckDetail->check_date)) {
                    // Prompt message or handle the error before updating
                    $dates = Carbon::parse($ePayCheckDetail->check_date)->format('Y-m-d');
                    throw new \Exception("Check date for check number {$ePayCheckDetail->check_number} cannot be deposited before {$dates}.");
                }

                // Proceed with updating the status if validation passes
                EPayCheckCheckDetails::whereIn('code', $codes)
                    ->update(['check_status' => $check_status, 'check_status_date' => now()]);

                // Generate logs
                $codeLogs = MainController::generate_code('App\Models\EPayCheckCheckDetailLogs', "code");
                $logs = [
                    'code'               => $codeLogs,
                    'check_details_code' => $code,
                    'check_status'       => $check_status,
                    'deposited_bank'     => $deposited_bank,
                    'deposited_date'     => $deposited_date,
                    'rejected_date'      => $rejected_date,
                    'rejected_remarks'   => $rejected_remarks
                ];

                // Create log entry
                EPayCheckCheckDetailLogs::create($logs);
            }

 
            }
    
            return Crypt::encryptString(json_encode([
                'result' => true,
                'status' => 'success',
                'title' => 'Success',
                'message' => 'Check details updated successfully.'
            ]));
        } catch (\Exception $e) {
            return Crypt::encryptString(json_encode([
                'result' => false,
                'status' => 'warning',
                'title' => 'Warning',
                'message' => $e->getMessage()
            ]));
        }
    }


    public function update_check_receive(Request $request)
    {
        $validated = $request->validate([
            'code' => 'required|array',
            'code.*' => 'required|string', // Ensures all items in the array are strings
            'received_by' => 'required|string',
            'received_date' => 'required|date',
            'status' => 'required|in:YES,NO' // Ensures status is either "YES" or "NO"
        ]);
    
        DB::beginTransaction();
    
        try {
            $success = false;
    
            foreach ($validated['code'] as $code) {
                if ($validated['status'] === 'YES') {
                    // Only update if received_date is not already set
                    $updateData = [
                        'received_by' => $validated['received_by'],
                        'received_date' => $validated['received_date']
                    ];
    
                    $updatedRows = EPayCheckCheckDetailLogs::where('check_details_code', $code)
                        ->where('check_status', self::TRANSMITTED)
                        ->whereNull('deleted_at')
                        ->whereNull('received_date') // Only update if not already received
                        ->update($updateData);
                } else {
                    // For status NO, unset the received info regardless
                    $updateData = [
                        'received_by' => null,
                        'received_date' => null
                    ];
    
                    $updatedRows = EPayCheckCheckDetailLogs::where('check_details_code', $code)
                        ->where('check_status', self::TRANSMITTED)
                        ->whereNull('deleted_at')
                        ->whereNotNull('received_date') // Only undo if already received
                        ->update($updateData);
                }
    
                if ($updatedRows > 0) {
                    $success = true;
                }
            }
    
            if (!$success) {
                throw new \Exception("No check details were updated.");
            }
    
            DB::commit();
    
            return Crypt::encryptString(json_encode([
                'result' => true,
                'status' => 'success',
                'title' => 'Success',
                'message' => $validated['status'] === 'YES' 
                    ? 'Check details received successfully.' 
                    : 'Check details receiving undone successfully.'
            ]));
        } catch (\Exception $e) {
            DB::rollBack();
    
            return Crypt::encryptString(json_encode([
                'result' => false,
                'status' => 'error',
                'title' => 'Error',
                'message' => 'An error occurred: ' . $e->getMessage()
            ]));
        }
    }
    
    public function get_receipt_details(Request $request){
        try {
            $validator = Validator::make($request->all(), [
                'receipt_number'  => 'required',
                'receipt_code'    => 'required',
                'subsection_code' => 'required',
            ]);
    
            if ($validator->fails()) {
                throw new \Exception($validator->errors()->first());
            } 
    
            $validatedData = $validator->validated();
    
            // Fetch check details
            $checkDetails = EPayCheckCheckDetails::where([
                                'prefix_crpr'    => $validatedData['receipt_number'],
                                'subsection_code'=> $validatedData['subsection_code'],
                            ])
                            ->orderBy('created_at')
                            ->first();
    
            // If no check details found, return an error message
            if (!$checkDetails) {
                throw new \Exception("No check details found for the given receipt number and subsection code.");
            }
    
            // Execute stored procedure
             $res = DB::select("exec sp_e_pay_check_details_receipt ?,?,?,?",[
                $checkDetails['sap'],
                $checkDetails['prefix_crpr'],
                $checkDetails['subsection_code'],
                $checkDetails['added_by'],
            ]);

             // If no check details found, return an error message
             if (empty($res)) {
                throw new \Exception("No check details found for the given receipt number and subsection code.");
            }
    
            // Fetch receipt details
            $receiptDetails = EPayCheckReceiptDetails::where('code', $validatedData['receipt_code'])->first(); 
    
            // Construct response
            $response = [
                'message' => "Successfully retrieved data",
                'data'    => [
                    'card_name'     => $res[0]->card_name ?? null,
                    'card_code'     => $res[0]->card_code ?? null,
                    'address'       => $res[0]->address ?? null,
                    'check_amount'  => array_sum(array_column($res ?? [], 'check_amount')) ?? null,
                    'crpr'          => $res[0]->crpr ?? null,
                    'date_pay'      => isset($res[0]->date_pay) ? Carbon::parse($res[0]->date_pay)->format('m/d/Y') : null,
                    'docdate'       => isset($res[0]->docdate) ? Carbon::parse($res[0]->docdate)->format('m/d/Y') : null,
                    'lictradnum'    => $res[0]->lictradnum ?? null,
                    'sales_invoice' => $res[0]->sales_invoice ?? null,
                    'username'      => $res[0]->username ?? null,
                    'format'        => json_decode($receiptDetails['format'] ?? null),
                ],
                'result'  => true,
                'status'  => 'success',
            ]; 
    
            return Crypt::encryptString(json_encode($response));
    
        } catch (\Exception $e) {
            return Crypt::encryptString(json_encode([
                'result'  => false,
                'status'  => 'warning',
                'title'   => 'Warning',
                'message' => $e->getMessage(),
            ]));
        }
    }

    public function get_check_customer(Request $request)
    {
        $page      = $request->query('page', 1); 
        $limit     = $request->query('limit', 10);
        $search    = trim($request->query('query')); // Trim extra spaces
        $user_code = $request->query('uc'); 
    
        $userData  =  UsersAccounts::select([
                        "ref_sections.description as section",
                        "ref_sub_sections.description as sub_section",
                        "ref_sub_sections.type as type"
                    ])
                    ->join('ref_sections', 'users_accounts.section_code', '=', 'ref_sections.code') 
                    ->join('ref_sub_sections', 'users_accounts.subsection_code', '=', 'ref_sub_sections.code')  
                    ->where('users_accounts.code', $user_code)
                    ->first();
        if (!$userData) {
            return response()->json(['result' => false, 'message' => 'User not found'], 404);
        }
    
        $sap = $this->_sap($userData['section'], $userData['sub_section']);
        
        // Get all results from stored procedure
        $allResults = DB::select('EXEC dbo.sp_e_pay_check_get_client ?, ?', [$sap, $userData['type']]);
        
        // Filter results if search term exists
        if (!empty($search)) {
            $allResults = array_filter($allResults, function($item) use ($search) {
                return stripos($item->cardname, $search) !== false || 
                       stripos($item->cardcode, $search) !== false;
            });
            // Re-index array after filtering
            $allResults = array_values($allResults);
        }
        
        // Calculate pagination
        $total = count($allResults);
        $offset = ($page - 1) * $limit;
        $items = array_slice($allResults, $offset, $limit);
        
        $response = [
            'dataList' => $items,
            'total' => $total,
            'count' => count($items),
            'per_page' => $limit,
            'current_page' => $page,
            'total_pages' => ceil($total / $limit),
            'result' => true,
            'title' => 'Success',
            'status' => 'success',
            'message' => 'Fetched successfully.',
        ];
        
        return Crypt::encryptString(json_encode($response)); 
    }
    
    public function get_receipt_format(Request $request){
        $receiptDetails = EPayCheckReceiptDetails::where("active", true)->orderBy('description')->get();
        $response = [
            'dataList' => $receiptDetails,
            'total'    => $receiptDetails->count(),
            'result'   => true,
            'title'    => 'Success',
            'status'   => 'success',
            'message'  => 'Fetched successfully.',
        ]; 
        return Crypt::encryptString(json_encode($response));

    }

    private function _sap($section, $sub_section) { 
        if (in_array($section, ['Luzon', 'Visayas', 'Mindanao'])) {
            return 'PROVINCE';
        }
        if (strtoupper($sub_section) === "PEANUT") {
            return "PEANUT";
        } 
        return "MANILA"; 
    }

    public function identify_receipt($invoices, $document_number)
    {
        if (!is_array($invoices) || !isset($invoices['sales_invoice'][0])) {
            return $document_number; // Return just the document number if invoices are invalid
        }
        
        $prefix = $invoices['sales_invoice'][0][0];
        return $prefix . $document_number;
    }

    public function get_check_receive(Request $request)
    { 
 
        $customMessages = [
            'dt.after_or_equal' => 'The selected end date must be the same as or later than the start date.',
            'df.date_format'    => 'The start date must be in YYYY-MM-DD format.',
            'dt.date_format'    => 'The end date must be in YYYY-MM-DD format.',
        ];
        $validator = Validator::make($request->all(), [
            'q'  => ['nullable','string'],
            's'  => ['nullable','string'],
            'p'  => ['nullable','integer','min:1'],
            'df' => ['required', 'date', 'date_format:Y-m-d'],
            'dt' => ['required', 'date', 'date_format:Y-m-d', 'after_or_equal:df'], 
            'sc' => ['required', 'string'],
        ], $customMessages); // Pass custom messages here
        
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
        $df     = $validated['df'];
        $dt     = $validated['dt'];
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
        ->when($status==='RECEIVED', function ($q) use ($df, $dt) {
            $q->whereBetween(DB::raw("CAST(check_status_date AS DATE)"), [$df, $dt])
            ->whereNotNull('received_date'); 
        })
        ->when($status==='TRANSMITTED', function ($q) use ($df, $dt) {
            $q->whereBetween(DB::raw("CAST(check_status_date AS DATE)"), [$df, $dt]) 
            ->whereNull('received_date'); 
        }) 
        ->where('check_status', 'TRANSMITTED')
        ->where('subsection_code', $sc)
        ->paginate(10, ['*'], 'page', $page);
    
        
        $requests = [];

        foreach ($check_details as $value) { 
            $requests[] = [
                'code'                 => $value->code,
                'advance_payment'      => $value->advance_payment, 
                'bank_branch'          => $value->bank_branch,
                'bank_description'     => $value->bank_description,
                'crpr'                 => $value->crpr,
                'check_amount'         => $value->check_amount,
                'check_amount_display' => number_format($value->check_amount, 4),
                'check_date'           => Carbon::parse($value->check_date)->format('Y-m-d'),
                'check_number'         => $value->check_number,
                'check_status'         => $value->check_status,
                'check_status_date'    => Carbon::parse($value->check_status_date)->format('Y-m-d'),
                'card_code'            => $value->card_code,
                'card_name'            => $value->card_name,
                'remarks'              => $value->remarks,
                'subsection_code'      => $value->subsection_code,
                'account_number'       => $value->account_number, 
                'created_at'           => Carbon::parse($value->created_at)->format('Y-m-d'),
                'received_date'        => $value->received_date ? Carbon::parse($value->received_date)->format('Y-m-d') : null, 
            ];
        }
        
        
           $response = [
                'dataList'      => $requests,
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
    
    /**
     * Check if a check is stale (older than 180 days)
     * 
     * @param string $checkDate The date of the check
     * @return bool Returns true if the check is stale, false otherwise
     */
    private function isStaleCheck($checkDate)
    {
        $checkDate = Carbon::parse($checkDate);
        $today = Carbon::now();
        $daysDifference = $checkDate->diffInDays($today);
        
        return $daysDifference > 180;
    }

    private function getPrefixCrpr($crpr, $invoice_list,$advance_payment=true)
    {
        if($advance_payment){

            $prefix   = isset($invoice_list[0]['prefix']) ? substr($invoice_list[0]['prefix'], 0, 1) : '';

            $doctype  = isset($invoice_list[0]['document_type']) && $invoice_list[0]['document_type'] === 'INV' ? 'CR' : 'PR';

            $document = $prefix.$doctype.$crpr;

            return $document;

        }else{
            // Convert stdClass object to an array if necessary
            if (is_object($invoice_list)) {
                $invoice_list = (array) $invoice_list; 
            }
            
            // Ensure $invoice_list is an array and not empty
            if (!is_array($invoice_list) || empty($invoice_list)) {
                return $crpr; // Return original CRPR if invoice list is invalid
            }
        
            // Convert objects inside the array to associative arrays
            $invoice_list = array_map(function ($invoice) {
                return (array) $invoice;
            }, $invoice_list);
        
            // Extract values safely
            $doctype  = isset($invoice_list[0]['form']) && $invoice_list[0]['form'] === 'INV' ? 'CR' : 'PR';
            $prefix   = isset($invoice_list[0]['sino']) ? substr($invoice_list[0]['sino'], 0, 1) : '';
            $document = $prefix.$doctype.$crpr;
            return $document;
        }
    }

    public function update_reject_for_close(Request $request){

        try {
            $validator = Validator::make($request->all(), [
                'code' => ['required'],
                // 'remarks' => ['required', 'string'],
            ]);
    
            if ($validator->fails()) {
                return Crypt::encryptString(json_encode([
                    'result'  => false,
                    'status'  => 'warning',
                    'title'   => 'Warning',
                    'message' => $validator->errors()->first(),
                ]));
            }
    
            $validated = $validator->validated();
    
            foreach($validated['code'] as $value){
                EPayCheckCheckDetailLogs::where('check_details_code', $value)
                ->where('check_status','=', self::REJECTED)
                ->whereNull('deleted_at')
                ->update(['rejected_status' => true]);
            }

            return Crypt::encryptString(json_encode([
                'result'  => true,
                'status'  => 'success',
                'title'   => 'Success',
                'message' => 'Check details closed successfully.'
            ]));
            
        } catch (\Exception $e) {
            DB::rollBack();
    
            return Crypt::encryptString(json_encode([
                'result' => false,
                'status' => 'error',
                'title' => 'Error',
                'message' => 'An error occurred: ' . $e->getMessage()
            ]));
        } 

    }
    
    
}