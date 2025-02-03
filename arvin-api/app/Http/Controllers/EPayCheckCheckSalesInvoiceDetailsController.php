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

        $page   = $request->query('p', 1); // Default to page 1 if not provided 
        $code   = $request->query('c');
        $search = $request->query('q');
        $limit  = $request->query('lmt', 10); // Default to 10 items per page if not provided
 
        $query = DB::table('vw_epay_check_invoice_list')->select(
            'docno','sino','drno','docdate','totalbeforetax','vatsum','doctotal'
        )->where('cardcode', $code);

        if (isset($search)) {
            $query->where(function ($q) use ($search) {
                $q->where('drno', 'like', '%' . $search . '%')
                  ->orWhere('docno', 'like', '%' . $search . '%')
                  ->orWhere('sino', 'like', '%' . $search . '%');
            });
        }
         
        // Paginate the query
        $res = $query->paginate($limit, ['*'], 'page', $page);

        $response = [
               'dataList'     => $res->items(),
                'total'        => $res->total(),
                'count'        => $res->count(),
                'per_page'     => $res->perPage(),
                'current_page' => $res->currentPage(),
                'total_pages'  => $res->lastPage(),
                'result' => true,
                'title' => 'Success',
                'status' => 'success',
                'message' => 'Fetched successfully.',
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
