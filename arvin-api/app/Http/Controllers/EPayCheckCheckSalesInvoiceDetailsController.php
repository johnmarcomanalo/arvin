<?php

namespace App\Http\Controllers;

use App\Models\EPayCheckCheckSalesInvoiceDetails;
use App\Models\EPayCheckCheckDetails;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Crypt;
use Illuminate\Support\Facades\DB;

class EPayCheckCheckSalesInvoiceDetailsController extends Controller
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
       
    }
 
    /**
     * Display the specified resource.
     *
     * @param  \App\Models\EPayCheckCheckSalesInvoiceDetails  $ePayCheckCheckSalesInvoiceDetails
     * @return \Illuminate\Http\Response
     */
    public function show(EPayCheckCheckSalesInvoiceDetails $ePayCheckCheckSalesInvoiceDetails)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Models\EPayCheckCheckSalesInvoiceDetails  $ePayCheckCheckSalesInvoiceDetails
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, EPayCheckCheckSalesInvoiceDetails $ePayCheckCheckSalesInvoiceDetails)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Models\EPayCheckCheckSalesInvoiceDetails  $ePayCheckCheckSalesInvoiceDetails
     * @return \Illuminate\Http\Response
     */
    public function destroy(EPayCheckCheckSalesInvoiceDetails $ePayCheckCheckSalesInvoiceDetails)
    {
        //
    }

    public function get_sales_invoice_list(Request $request){
        // Retrieve query parameters
        $search = $request->query('q');
        // Reset page to 1 if search is provided
        $page = !empty($search) ? 1 : $request->query('p', 1);
        $sap    = $request->query('s');
        $code   = $request->query('c');
        $limit  = $request->query('lmt', 10);
        // Get sorting column and direction
        $sortColumn = $request->query('sort_by', 'drno'); // Default column to sort by
        $sortDirection = strtolower($request->query('order', 'asc')) === 'desc' ? 'desc' : 'asc';
    
        // Execute stored procedure
        if (!is_null($code) && !is_null($sap)) {
            $queryResult = DB::select('EXEC dbo.sp_e_pay_check_invoice_list ?, ?', [$code, $sap]);
        }
    
        // Convert result to collection for filtering
        $collection = collect($queryResult ?? []);
    
        // Apply search filter if provided
        if (!empty($search)) {
            $collection = $collection->filter(function ($item) use ($search) {
                return stripos($item->drno, $search) !== false ||
                       stripos($item->docno, $search) !== false ||
                       stripos($item->sino, $search) !== false;
            });
        }

        // Apply sorting
        if ($sortDirection === 'desc') {
            $collection = $collection->sortByDesc($sortColumn);
        } else {
            $collection = $collection->sortBy($sortColumn);
        }
    
        // Get total count after filtering
        $total = $collection->count();
    
        // Apply manual pagination
        $paginatedData = $collection->slice(($page - 1) * $limit, $limit)->values();
    
        // Format response
        $response = [
            'dataList'     => $paginatedData,
            'total'        => $total,
            'count'        => count($paginatedData),
            'per_page'     => $limit,
            'current_page' => $page,
            'total_pages'  => ceil($total / $limit),
            'result'       => true,
            'title'        => 'Success',
            'status'       => 'success',
            'message'      => 'Fetched successfully.',
        ];  
    
        return Crypt::encryptString(json_encode($response));
    }

    public static function store_sales_invoice_details($invoice_list, $check_details_code)
    {
        $results = [];
        $success = true;
    
        foreach ($invoice_list as $key => $value) {
            $code =  MainController::generate_code('App\Models\EPayCheckCheckSalesInvoiceDetails', "code"); 
            $fields = [
                'code'                     => $code,
                'check_details_code'       => $check_details_code,
                'sales_invoice'            => $value->sino,     
                'dr_number'                => $value->drno,     
                'doc_number'               => $value->docno,    
                'doc_date'                 => $value->docdate,  
                'doc_total'                => $value->doctotal, 
                'amount'                   => 0, 
                'form'                     => $value->form,
                'bp_payment_term'          => $value->bp_payment_term,
                'internal_approved_term'   => $value->internal_approved_term,
                'tag'                      => $value->tag,
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

}
