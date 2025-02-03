<?php

namespace App\Http\Controllers;

use App\Models\EPayCheckCheckDetailLogs;
use App\Models\EPayCheckCheckDetails;
use App\Models\EPayCheckCheckSalesInvoiceDetails;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Crypt;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class EPayCheckCheckDetailsController extends Controller
{
    //CHECK STATUS
    private const ONHAND = 'ON-HAND';
    private const DEPOSITED = 'DEPOSITED';
    private const TRANSMITTED = 'TRANSMITTED';

    private const ACTIVE = 'ACTIVE';
    private const INACTIVE = 'INACTIVE';
    private const YES = 'YES';
    private const NO = 'NO';
    private const PENDING = 'PENDING';
    private const APPROVED = 'APPROVED';
    private const REJECTED = 'REJECTED';

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
    
            // Validate data
            $fields = $request->validate([
                'advance_payment'  => 'required|string',
                'bank_address'     => 'required|string',
                'bank_branch'      => 'required|string',
                'bank_description' => 'required|string',
                'crpr'             => 'required|string',
                'check_amount'     => 'required|numeric|min:0',
                'check_date'       => 'required|date',
                'check_number'     => 'required',
                'card_code'        => 'required',
                'card_name'        => 'required',
                'subsection_code'  => 'required|string',
            ]); 
            // Set identity code
            $fields['code']        = MainController::generate_code('App\Models\EPayCheckCheckDetails',"code");
            $fields['check_status']= self::ONHAND;
            $fields['check_status_date']= Carbon::now();
            // Create record for check details
            $resultData = EPayCheckCheckDetails::create($fields);
            if ($resultData) {
                $codeLogs = MainController::generate_code('App\Models\EPayCheckCheckDetailLogs',"code");
                $logFields = [
                    'code'               => $codeLogs,
                    'check_details_code' => $resultData['code'],
                    'check_status'       => $fields['check_status'],
                ];
                EPayCheckCheckDetailLogs::create($logFields);
            }
    
            // Handle advance payment logic
            if ($fields['advance_payment'] == self::NO) {
                $request->validate([
                    'invoice_list' => 'array',
                ]);
    
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
    
            DB::commit();

            $response = [
                'result' => true,
                'status' => 'success',
                'title' => 'Success',
                'message' => 'Record created successfully.'
            ];

            return Crypt::encryptString(json_encode($response));

        } catch (\Throwable $th) {
            
            DB::rollBack();
            Log::error('Error in store method: ' . $th->getMessage());
            $response = [
                'result' => false,
                'status' => 'warning',
                'title' => 'Warning',
                'message' => 'An warning occurred while saving the data.'
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
    public function update(Request $request, EPayCheckCheckDetails $ePayCheckCheckDetails)
    {  
        // Validate data
        $fields = $request->validate([
            'advance_payment'  => 'required|string',
            'bank_address'     => 'required|string',
            'bank_branch'      => 'required|string',
            'bank_description' => 'required|string',
            'crpr'             => 'required|string',
            'check_amount'     => 'required|min:0',
            'check_date'       => 'required|date',
            'check_number'     => 'required|string',
            'card_code'        => 'required|string',
            'card_name'        => 'required|string',
            'subsection_code'  => 'required|string',
            'check_status'     => 'required|string',
        ]);
    
        $checkDetail = EPayCheckCheckDetails::where('code', $request['code'])->first();
        if (!$checkDetail) { 
            $response = [
                'result' => false,
                'status' => 'warning',
                'title' => 'Warning',
                'message' => 'Record not found.'
            ];  
        } 
    
        // Prevent invalid status transitions
        if (($checkDetail['check_status'] == self::DEPOSITED && $request['status'] == self::TRANSMITTED) ||
            ($checkDetail['check_status'] == self::TRANSMITTED && $request['status'] == self::DEPOSITED)) {
            $response = [
                'result' => false,
                'status' => 'warning',
                'title' => 'Warning',
                'message' => 'Not allowed to change status to ' . $request['status'] . '.'
            ];
 
        }else{
             // Update record for check details
            $fields['check_status_date'] = Carbon::now();
            
            // Revert status logs if necessary
            $this->revertStatusLogs($checkDetail, $fields['check_status'], $fields);
        
            // Update the check details
            $checkDetail->update($fields);
        
            // Success response
            $response = [
                'result' => true,
                'status' => 'success',
                'title' => 'Success',
                'message' => 'Check details updated successfully.'
            ];
        }
     
        return Crypt::encryptString(json_encode($response));
    }
    
    private function revertStatusLogs($checkDetail, $check_status, $fields) {
        $statusesToHandle = [self::DEPOSITED, self::TRANSMITTED];
    
        if (in_array($checkDetail['check_status'], $statusesToHandle) && $check_status == self::ONHAND) {
            // Soft-delete the logs for DEPOSITED or TRANSMITTED status
            EPayCheckCheckDetailLogs::where('check_details_code', $checkDetail['code'])
                ->where('check_status', $checkDetail['check_status'])
                ->update(['deleted_at' => Carbon::now()]);
        } else {
            // Generate a new code for the logs
            $codeLogs = (new EPayCheckCheckDetailLogsController)->generate_code();
            
            $logFields = [
                'code' => $codeLogs,
                'check_details_code' => $checkDetail->code,
                'check_status' => $fields['check_status'], // Make sure 'check_status' exists in $fields
            ];
            
            EPayCheckCheckDetailLogs::create($logFields);
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
        $status = $validated['s']  ?? 'ON-HAND';
        $page   = $validated['p']  ?? 1;
        $df     = $validated['df'] ?? now()->format('Y-m-d');
        $dt     = $validated['dt'] ?? now()->format('Y-m-d');
        $sc     = $validated['sc'];
 
         
        $check_details = EPayCheckCheckDetails::select([
                    'e_pay_check_check_details.code',
                    'advance_payment','bank_address',
                    'bank_branch','bank_description',
                    'crpr','check_amount',
                    'check_date','check_number',
                    'check_status','card_code',
                    'card_name','subsection_code',
                    'created_at'
                ]) 
                ->when($query, function ($q) use ($query) {
                    $q->where(function ($subQuery) use ($query) {
                        $subQuery
                            ->where('card_name', 'like', '%' . $query . '%')
                            ->orWhere('bank_description', 'like', '%' . $query . '%')
                            ->orWhere('bank_branch', 'like', '%' . $query . '%')
                            ->orWhere('bank_address', 'like', '%' . $query . '%')
                            ->orWhere('check_amount', 'like', '%' . $query . '%');
                    });
                })
                ->when($status !== 'ON-HAND', function ($q) use ($df, $dt) {
                    $q->whereBetween('check_status_date', [$df, $dt]);
                })
                ->where('check_status', $status)
                ->where('subsection_code', $sc)
                ->whereNull('deleted_at')
               
                ->paginate(10, ['*'], 'page', $page);
    
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
    
    public function get_weekly_check_counter_data(Request $request){
       
    }
}
