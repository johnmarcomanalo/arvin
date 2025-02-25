<?php

namespace App\Http\Controllers;

use App\Models\EPayCheckCheckDetailLogs;
use App\Models\EPayCheckCheckDetails;
use App\Models\EPayCheckCheckSalesInvoiceDetails;
use App\Models\EPayCheckReceiptDetails;
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
                'advance_payment'  => 'required|string',
                'bank_address'     => 'required|string',
                'bank_branch'      => 'required|string',
                'bank_description' => 'required|string',
                'crpr'             => 'required|string',
                'check_amount'     => 'required|numeric|min:0',
                'check_date'       => 'required|date', #|after_or_equal:' . Carbon::yesterday()->toDateString(),
                'sap'              => 'required|string',
                'check_number'     => [
                    'required',
                    Rule::unique('e_pay_check_check_details', 'check_number')->where(function ($query) use ($request) {
                        return $query->where('card_code', $request->card_code);
                    })
                ],
                'card_code'        => 'required',
                'card_name'        => 'required',
                'subsection_code'  => 'required|string',
            ];
    
            // Conditionally add the invoice_list validation if advance_payment is 'NO'
            if ($request->advance_payment == self::NO) {
                $fields['invoice_list'] = 'array|required';
            }
    
            // Custom messages for validation
            $customMessages = [
                'invoice_list.required' => 'Kindly select list of invoices if this is not an advance payment.',
                'check_date.date' => 'The check date must be a valid date.',
                'check_date.after_or_equal' => 'The check date cannot be in the past.',
                'check_number.unique' => 'This check number has already been entered.',
            ];
    
            // Validate the request data
            $validator = Validator::make($request->all(), $fields, $customMessages);
    
            if ($validator->fails()) {
                return response()->json([
                    'result' => false,
                    'status' => 'error',
                    'title' => 'Error',
                    'message' => $validator->errors()->first()
                ], 422);
            }
    
            // Get validated data
            $validatedData = $validator->validated();
    
            // Set identity code and other fields
            $validatedData['code'] = MainController::generate_code('App\Models\EPayCheckCheckDetails', "code");
            $validatedData['check_status'] = self::ONHAND;
            $validatedData['check_status_date'] = Carbon::now();
    
            // Remove invoice_list from $validatedData
            unset($validatedData['invoice_list']);
    
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
            if ($request->advance_payment == self::NO) {
                // Validate invoice_list if advance_payment is 'NO'
                if (isset($request['invoice_list']) && count($request['invoice_list']) > 0) {
                    $resultInvoices = $this->storeSalesInvoiceDetails($request['invoice_list'], $resultData['code']);
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
    
            // Commit transaction
            DB::commit();
    
            // Prepare success response
            $response = [
                'result' => true,
                'status' => 'success',
                'title' => 'Success',
                'message' => 'Record created successfully.'
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
                'advance_payment'  => 'required',
                'bank_address'     => 'required',
                'bank_branch'      => 'required',
                'bank_description' => 'required',
                'crpr'             => 'required',
                'check_amount'     => 'required|numeric|min:0',
                'check_date'       => 'required',//|date|after_or_equal:' . Carbon::yesterday()->toDateString(),
                'check_number'     => 'required',
                'card_code'        => 'required',
                'card_name'        => 'required',
                'subsection_code'  => 'required',
                'modified_by'      => 'required',
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
    
            // Update the record
            $ePayCheckCheckDetails->updateOrFail($validatedData);
    
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

    
    private function storeSalesInvoiceDetails($invoice_list, $check_details_code)
    {
        $results = [];
        $success = true;
    
        foreach ($invoice_list as $key => $value) {
            $code = (new EPayCheckCheckSalesInvoiceDetailsController)->generate_code();
    
            $fields = [
                'code'               => $code,
                'check_details_code' => $check_details_code,
                'sales_invoice'      => $value->sino,     
                'dr_number'          => $value->drno,     
                'doc_number'         => $value->docno,    
                'doc_date'           => $value->docdate,  
                'doc_total'          => $value->doctotal, 
                'amount'             => 0, 
            ];
    
            $result    = EPayCheckCheckSalesInvoiceDetails::create($fields);
            $results[] = $result;
    
            // Check if saving was unsuccessful
            if (!$result) {
                $success = false;
                break; // Exit loop on failure
            }
        }
    
        return $success ? $results : false; // Return results if successful, otherwise false
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
                    ->orWhere('bank_address', 'like', "%{$query}%")
                    ->orWhereRaw("CAST(check_amount AS VARCHAR) LIKE ?", ["%{$query}%"])
                    ->orWhere('check_number', 'like', "%{$query}%");
            });
        }) 
        ->when(in_array($status, ['DEPOSITED', 'TRANSMITTED']), function ($q) use ($df, $dt) {
            $q->whereBetween(DB::raw("CAST(check_status_date AS DATE)"), [$df, $dt]);
        })
        ->where('check_status', $status)
        ->where('subsection_code', $sc)
        ->paginate(10, ['*'], 'page', $page);
    
        
        $requests = [];

        foreach ($check_details as $value) { 
            $requests[] = [
                'code'                 => $value->code,
                'advance_payment'      => $value->advance_payment,
                'bank_address'         => $value->bank_address,
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
                'subsection_code'      => $value->subsection_code,
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
                'status' => 'error',
                'title' => 'Error',
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
                $updateData = $validated['status'] === 'YES'
                    ? [
                        'received_by' => $validated['received_by'],
                        'received_date' => $validated['received_date']
                    ]
                    : [
                        'received_by' => null,
                        'received_date' => null
                    ];
    
                $updatedRows = EPayCheckCheckDetailLogs::where('check_details_code', $code)
                    ->where('check_status', self::TRANSMITTED)
                    ->whereNull('deleted_at')
                    ->update($updateData);
    
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
                'print_format'    => 'required',
                'code'            => 'required',
                'subsection_code' => 'required',
            ]);

            if ($validator->fails()) {
                throw new \Exception($validator->errors()->first());
            } 

           
            $validatedData = $validator->validated();
            $userData = UsersAccounts::select("ref_sections.description as section","ref_sub_sections.description as sub_section")
                            ->join('ref_sections','users_accounts.section_code','=','ref_sections.code')
                            ->join('ref_sub_sections','ref_sections.code','=','ref_sub_sections.section_code')
                            ->where('users_accounts.code',$validatedData['code'])->first();

            $sap          = $this->_sap($userData['section'],$userData['sub_section']);
            $res          = DB::select("exec sp_e_pay_check_details_receipt ?,?,?",[$sap,$validatedData['receipt_number'],$validatedData['subsection_code']]);
            $receiptDetils= EPayCheckReceiptDetails::where('code',$validatedData['print_format'])->first(); 
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
                    'format'        => json_decode($receiptDetils['format'])
                ],
                'result'  => false,
                'status'  => 'success',
            ];

            return Crypt::encryptString(json_encode($response));

        } catch (\Exception $e) {
            return Crypt::encryptString(json_encode([
                'result' => false,
                'status' => 'error',
                'title' => 'Error',
                'message' => $e->getMessage()
            ]));
        }
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


    public function get_check_customer(Request $request)
    {
        $page      = $request->query('p', 1); 
        $limit     = $request->query('lmt', 10);
        $search    = trim($request->query('q')); // Trim extra spaces
        $user_code = $request->query('u'); 
    
        $userData  = UsersAccounts::select("ref_sections.description as section", "ref_sub_sections.description as sub_section")
                    ->join('ref_sections', 'users_accounts.section_code', '=', 'ref_sections.code')
                    ->join('ref_sub_sections', 'ref_sections.code', '=', 'ref_sub_sections.section_code')
                    ->where('users_accounts.code', $user_code)
                    ->first();
    
        if (!$userData) {
            return response()->json(['result' => false, 'message' => 'User not found'], 404);
        }
    
        $sap = $this->_sap($userData['section'], $userData['sub_section']);
    
        $query = DB::table('vw_ref_customers')->select('cardname', 'cardcode', 'sap');
    
        if (!empty($search)) {
            $query->where(function ($q) use ($search) {
                $q->where('cardname', 'like', '%' . $search . '%')
                  ->orWhere('cardcode', 'like', '%' . $search . '%');
            });
        }
    
        if (!empty($sap)) {
            $query->where('sap', $sap);
        }
    
        $customersFromSAP = $query->paginate($limit, ['*'], 'page', $page);
    
        $response = [
            'dataList' => $customersFromSAP->items(),
            'total' => $customersFromSAP->total(),
            'count' => $customersFromSAP->count(),
            'per_page' => $customersFromSAP->perPage(),
            'current_page' => $customersFromSAP->currentPage(),
            'total_pages' => $customersFromSAP->lastPage(),
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
}
