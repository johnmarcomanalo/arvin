<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Crypt;
use App\Models\SalesQuotationRequestProducts;
use App\Models\SalesQuotationRequest;
use Carbon\Carbon;

class SalesQuotationReportQuotedProducts extends Controller
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
        //
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        //
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



    // public function get_report_quoted_products(Request $request)
    // {

    //     // Extract request parameters
    //     $page = $request->query('p');
    //     $limit = $request->query('l');
    //     $query = $request->query('q');
    //     $user_id = $request->query('u');

    //     // Early return for invalid user ID or type
    //     if (empty($user_id)) {
    //         return response()->json([
    //             'result' => false,
    //             'status' => 'warning',
    //             'title' => 'Oops!',
    //             'message' => 'Invalid request. Please login.',
    //         ], 200);
    //     }

    //     // Initialize query for SalesQuotationRequest
    //     $awarded_quotation = [];
    //     $vw_sales_quotation_request_awarded = DB::table('vw_sales_quotation_request_awarded');

    //     if (isset($query)) {
    //         $vw_sales_quotation_request_awarded->where(function($q) use ($query) {
    //             $q->where('product_description', 'like', '%' . $query . '%')
    //                 ->orWhere(DB::raw("customer_description"), 'like', '%' . $query . '%')
    //                 ->orWhere(DB::raw("representative_nickname"), 'like', '%' . $query . '%')
    //                 ->orWhere(DB::raw("product_code"), 'like', '%' . $query . '%')
    //                 ->orWhere(DB::raw("product_code"), 'like', '%' . $query . '%')
    //                 ->orWhere(DB::raw("customer_representative"), 'like', '%' . $query . '%');
    //         });
    //     }
    //     foreach ($vw_sales_quotation_request_awarded as $value) {
    //         $awarded_quantity = $value->awarded_qty;
    //         $projected_quantity = $value->projected_quantity;
    //         if($awarded_quantity == null){
    //             $awarded_quantity = 0;
    //             $unawarded_quantity =  $value->projected_quantity;
    //         }
    //         if ($projected_quantity == null || $projected_quantity == 0) { // Check for null or zero
    //             $awarded_percentage = 0; // Set percentage to 0 to avoid division by zero
    //             $unawarded_percentage = 100; // Set percentage to 0 to avoid division by zero
    //         } else {
    //             $awarded_percentage = ($awarded_quantity / $projected_quantity) * 100;
    //             $unawarded_percentage = (($projected_quantity - $awarded_quantity)/$projected_quantity) * 100;
    //             $unawarded_quantity =$projected_quantity - $awarded_quantity;
    //         }
    //         $awarded_quotation[]= [
    //             'product_code' => $value->product_code,
    //             'product_description' => $value->product_description,
    //             'projected_quantity' => $projected_quantity.' '.$value->projected_quantity_unit,
    //             'awarded_percentage' => $awarded_percentage.' %',
    //             'unawarded_percentage' => $unawarded_percentage.' %',
    //             'awarded_quantity' => $awarded_quantity.' '.$value->awarded_qty_unit,
    //             'unawarded_quantity' => $unawarded_quantity,
    //         ];                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  
    //     }  
        
    //     $data_list = $awarded_quotation->paginate($limit, ['*'], 'page', $page);
    //     // Prepare response data
    //      $response = [
    //         'dataList' => $data_list,
    //         'result' => true,
    //         'title' => 'Success',
    //         'status' => 'success',
    //         'message' => 'Fetched successfully.',
    //     ];

    //     // Return the encrypted response
    //     return Crypt::encryptString(json_encode($response));
    // }
    public function get_report_quoted_products(Request $request)
{
    // Extract request parameters
    $page = $request->query('p', 1); // Default to page 1 if not set
    $limit = $request->query('l', 10); // Default limit of 10 if not set
    $query = $request->query('q');
    $user_id = $request->query('u');

    // Early return for invalid user ID or type
    if (empty($user_id)) {
        return response()->json([
            'result' => false,
            'status' => 'warning',
            'title' => 'Oops!',
            'message' => 'Invalid request. Please login.',
        ], 200);
    }

    // Initialize query for SalesQuotationRequest
    $vw_sales_quotation_request_awarded = DB::table('vw_sales_quotation_request_awarded');

    // Apply search query if provided
    if (!empty($query)) {
        $vw_sales_quotation_request_awarded->where(function($q) use ($query) {
            $q->where('product_description', 'like', '%' . $query . '%')
              ->orWhere('customer_description', 'like', '%' . $query . '%')
              ->orWhere('representative_nickname', 'like', '%' . $query . '%')
              ->orWhere('product_code', 'like', '%' . $query . '%')
              ->orWhere('customer_representative', 'like', '%' . $query . '%');
        });
    }

    // Paginate query results before fetching them
    $results = $vw_sales_quotation_request_awarded->paginate($limit, ['*'], 'page', $page);

    $awarded_quotation = [];

    // Process each result
    foreach ($results as $value) {
        $awarded_quantity = $value->awarded_qty ?? 0;
        $projected_quantity = $value->projected_quantity ?? 0;
        $os_number =  $value->os_number ?? '--';
        // Calculate percentages and unawarded quantity
        if ($projected_quantity == 0) {
            $awarded_percentage = 0;
            $unawarded_percentage = 100;
            $unawarded_quantity = $projected_quantity;
        } else {
            $awarded_percentage = ($awarded_quantity / $projected_quantity) * 100;
            $unawarded_quantity = $projected_quantity - $awarded_quantity;
            $unawarded_percentage = ($unawarded_quantity / $projected_quantity) * 100;
        }

        // Prepare the awarded quotation array
        $awarded_quotation[] = [
            'product_code' => $value->product_code,
            'product_description' => $value->product_description,
            'projected_quantity' => $projected_quantity . ' ' . $value->projected_quantity_unit,
            'awarded_percentage' => $awarded_percentage . ' %',
            'unawarded_percentage' => $unawarded_percentage . ' %',
            'awarded_quantity' => $awarded_quantity . ' ' . $value->awarded_qty_unit,
            'unawarded_quantity' => $unawarded_quantity,
            'os_number' => $os_number,
            'request_quotation_code' => $value->code,
            'customer_description' => $value->customer_description,
            'product_request_code' => $value->product_request_code,
            'status'=>$value->status,
            'request_date'=>Carbon::parse($value->request_date)->format('F j, Y'),
        ];
    }

    $response = [
        'dataList' => $awarded_quotation,
        'dataListCount' => $results->total(),
        'result' => true,
        'title' => 'Success',
        'status' => 'success',
        'message' => 'Fetched successfully.',
    ];
    return Crypt::encryptString(json_encode($response));
}
}
