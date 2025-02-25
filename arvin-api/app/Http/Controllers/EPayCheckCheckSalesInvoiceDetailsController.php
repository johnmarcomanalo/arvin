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
        $page   = $request->query('p', 1); // Default to page 1
        $sap    = $request->query('s');
        $code   = $request->query('c');
        $search = $request->query('q');
        $limit  = $request->query('lmt', 10); // Default to 10 items per page
    
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
    

    public function generate_code(){
        $code = 1;
        $current_date = date('Y-m-d');
         $latest_code = EPayCheckCheckSalesInvoiceDetails::latest('code')->first('code')->code ?? NULL;
        if(!empty($latest_code)){
            $code = $latest_code + 1;
        }
        return $code;
    }

}
