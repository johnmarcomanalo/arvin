<?php

namespace App\Http\Controllers;

use App\Models\EPayCheckCheckDetailLogs;
use App\Models\EPayCheckCheckDetails;
use App\Models\EPayCheckCheckSalesInvoiceDetails;
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
                'check_date'       => 'required|date|after_or_equal:' . Carbon::yesterday()->toDateString(),
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
                'check_date'       => 'required|date|after_or_equal:' . Carbon::yesterday()->toDateString(),
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
        $validated = $request->validate([
            'q'  => 'nullable|string',
            's'  => 'nullable|string',
            'p'  => 'nullable|integer|min:1',
            'df' => 'required|date|date_format:Y-m-d',
            'dt' => 'required|date|date_format:Y-m-d',
            'sc' => 'required',
        ]);
    
        $query  = $validated['q']  ?? '';
        $status = $validated['s'];
        $page   = $validated['p']  ?? 1;
        $df     = $validated['df'];
        $dt     = $validated['dt'];
        $sc     = $validated['sc']; 
        
        $check_details = EPayCheckCheckDetails::select([
                    'e_pay_check_check_details.code',
                    'advance_payment','bank_address',
                    'bank_branch','bank_description',
                    'crpr','check_amount',
                    'check_date','check_number',
                    'check_status','card_code',
                    'card_name','subsection_code',
                    'created_at','check_status_date'
                ])
                ->when($query, function ($q) use ($query) {
                    $q->where(function ($subQuery) use ($query) {
                        $subQuery
                            ->where('card_name', 'like', '%' . $query . '%')
                            ->orwhere('card_code', 'like', '%' . $query . '%')
                            ->orWhere('bank_description', 'like', '%' . $query . '%')
                            ->orWhere('bank_branch', 'like', '%' . $query . '%')
                            ->orWhere('bank_address', 'like', '%' . $query . '%')
                            ->orWhere('check_amount', 'like', '%' . $query . '%')
                            ->orWhere('check_number', 'like', '%' . $query . '%');
                    });
                })
                ->when(in_array($status, ['DEPOSITED', 'TRANSMITTED']), function ($q) use ($df, $dt) {
                    $q->whereRaw('CONVERT(date, check_status_date) BETWEEN ? AND ?', [$df, $dt]);
                })
                ->where('check_status', $status)
                ->where('subsection_code', $sc)
                ->whereNull('deleted_at')
                ->paginate(15, ['*'], 'page', $page);
    
            $requests = $check_details->map(function ($value) {
                return [
                    'code'                 => $value['code'],
                    'advance_payment'      => $value['advance_payment'],
                    'bank_address'         => $value['bank_address'],
                    'bank_branch'          => $value['bank_branch'],
                    'bank_description'     => $value['bank_description'],
                    'crpr'                 => $value['crpr'],
                    'check_amount'         => $value['check_amount'],
                    'check_amount_display' => number_format($value['check_amount'], 4),
                    'check_date'           => Carbon::parse($value['check_date'])->format('Y-m-d'),
                    'check_number'         => $value['check_number'],
                    'check_status'         => $value['check_status'],
                    'check_status_date'    => Carbon::parse($value['check_status_date'])->format('Y-m-d'),
                    'card_code'            => $value['card_code'],
                    'card_name'            => $value['card_name'],
                    'subsection_code'      => $value['subsection_code'],
                    'created_at'           => Carbon::parse($value['created_at'])->format('Y-m-d'),
                ];
            });
        
            $response = [
                'dataList'      => $requests->toArray(),
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
        // try {
        //     // Validate input data
        //     $request->validate([
        //         'code' => 'required|array',
        //         'status' => 'required|string',
        //         'bank_deposit' => 'nullable|string',
        //         'deposited_date' => 'nullable|date',
        //     ]);  
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
                
                // Update status and create logs
                EPayCheckCheckDetails::whereIn('code', $codes)
                    ->update(['check_status' => $check_status, 'check_status_date' => now()]);
                 
                foreach ($codes as $key => $code) {
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
                    EPayCheckCheckDetailLogs::create($logs);
                }
 
            }
    
            return Crypt::encryptString(json_encode([
                'result' => true,
                'status' => 'success',
                'title' => 'Success',
                'message' => 'Check details updated successfully.'
            ]));
        // } catch (\Exception $e) {
        //     return Crypt::encryptString(json_encode([
        //         'result' => false,
        //         'status' => 'error',
        //         'title' => 'Error',
        //         'message' => 'An error occurred while updating check details.'
        //     ]));
        // }
    }


    
    
    public function get_weekly_check_counter_data(Request $request){
        
    }
}
