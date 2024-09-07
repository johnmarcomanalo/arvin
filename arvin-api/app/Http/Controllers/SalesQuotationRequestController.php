<?php

namespace App\Http\Controllers;

use App\Models\SalesQuotationRequest;
use App\Models\SalesQuotationRequestNotes;
use App\Models\SalesQuotationRequestProducts;
use App\Models\SalesQuotationRequestForApprovals;
use App\Models\SalesQuotationRequestSignatories;
use App\Models\RefRequestHierarchies;
use App\Models\RefRequestTypes;
use App\Models\UserAccessRequestRights;
use Illuminate\Support\Facades\Crypt;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;
use Illuminate\Http\Request;

class SalesQuotationRequestController extends Controller
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
        // Validate input fields
        $fields = $request->validate([
            'currency_description' => 'required',
            'currency_type' => 'required',
            'customer_address' => 'required',
            'customer_code' => 'required',
            'customer_type' => 'required',
            'customer_description' => 'required',
            'customer_representative' => 'required',
            'representative_salutation' => 'required',
            'representative_nickname' => 'required',
            'notes' => 'required|array|min:1',
            'product_list' => 'required|array|min:1',
            // 'signatories' => 'required|array',
            'quotation_opening_letter' => 'required',
            'quotation_closing_letter' => 'required',
            'request_date' => 'required',
            'request_type' => 'required',
            'term' => 'required',
            'added_by' => 'required',
            'modified_by' => 'required',
        ]);

        // Generate necessary codes

        // Determine the initial request status
        $request_status = ($fields["term"] == 'Short Term') ? 'Approved' : 'Pending';

        // Retrieve request type and hierarchy information
        $request_type = RefRequestTypes::where('description', $fields["request_type"])->first();
        $request_hierarchy_access = UserAccessRequestRights::where('ref_request_type_code', $request_type->code)->where('user_code', $fields["added_by"])->first();
         
        // Proceed if user has the necessary access rights
        if ($request_hierarchy_access) {
            // Create sales quotation request
            $request_hierarchy = RefRequestHierarchies::where('code', $request_hierarchy_access->ref_request_hierarchies_code)->first();
            $hierarchy_structure = json_decode($request_hierarchy->hierarchy_structure);
            $sales_quotation_request_code = MainController::generate_code(SalesQuotationRequest::class, "code");
            $data = SalesQuotationRequest::create([
                'code' => $sales_quotation_request_code,
                'customer_code' => $fields["customer_code"],
                'customer_description' => $fields["customer_description"],
                'customer_representative' => $fields["customer_representative"],
                'representative_salutation' => $fields["representative_salutation"],
                'representative_nickname' => $fields["representative_nickname"],
                'customer_address' => $fields["customer_address"],
                'customer_type' => $fields["customer_type"],
                'request_date' => $fields["request_date"],
                'quotation_opening_letter' => $fields["quotation_opening_letter"],
                'quotation_closing_letter' => $fields["quotation_closing_letter"],
                'status' => $request_status,
                'currency_description' => $fields["currency_description"],
                'currency_type' => $fields["currency_type"],
                'term' => $fields["term"],
                'requested_by' => $fields["added_by"],
                'request_hierarchy_code' => $request_hierarchy->code,
                'request_hierarchy' => $request_hierarchy->hierarchy_structure,
                'request_hierarchy_level' => 1,
                'approval_date' => null,
                'added_by' => $fields["added_by"],
                'modified_by' => $fields["modified_by"],
            ]);

            // Add notes to the sales quotation request
            foreach ($fields["notes"] as $note) {
                $sales_quotation_request_notes_code = MainController::generate_code(SalesQuotationRequestNotes::class, "code");
                SalesQuotationRequestNotes::create([
                    'code' => $sales_quotation_request_notes_code,
                    'sales_quotation_request_code' => $sales_quotation_request_code,
                    'description' => $note->description,
                    'added_by' => $fields["added_by"],
                    'modified_by' => $fields["modified_by"],
                ]);
            }

            // Add products to the sales quotation request
            foreach ($fields["product_list"] as $product) {
                $sales_quotation_request_products_code = MainController::generate_code(SalesQuotationRequestProducts::class, "code");
                SalesQuotationRequestProducts::create([
                    'code' => $sales_quotation_request_products_code,
                    'sales_quotation_request_code' => $sales_quotation_request_code,
                    'product_description' => $product->product_description,
                    'product_weight' => $product->product_weight,
                    'product_tax_code' => $product->product_tax_code,
                    'product_brand' => $product->product_brand,
                    'product_branch' => $product->product_branch,
                    'product_group' => $product->product_group,
                    'projected_quantity' => $product->projected_quantity,
                    'projected_quantity_unit' => $product->projected_quantity_unit,
                    'destination' => $product->destination,
                    'minimum_order_quantity' => $product->minimum_order_quantity,
                    'minimum_order_quantity_unit' => $product->minimum_order_quantity_unit,
                    'pickup_price' => $product->pickup_price,
                    'pickup_price_unit' => $product->pickup_price_unit,
                    'price_per_unit' => $product->price_per_unit,
                    'price_unit' => $product->price_unit,
                    'tax_code' => $product->tax_code,
                    'added_by' => $fields["added_by"],
                    'modified_by' => $fields["modified_by"],
                ]);
            }

            if(isset($fields["signatories"])){
                foreach ($fields["signatories"] as $signatory) {
                    $sales_quotation_request_signatories_code = MainController::generate_code(SalesQuotationRequestSignatories::class, "code");
                    SalesQuotationRequestSignatories::create([
                        'code' => $sales_quotation_request_signatories_code,
                        'sales_quotation_request_code' => $sales_quotation_request_code,
                        'type' => $signatory->type,
                        'signatory_code' => $signatory->code,
                        'signatory' => $signatory->signatory,
                        'added_by' => $fields["added_by"],
                        'modified_by' => $fields["modified_by"],
                    ]);
                }
            }
            

            // Prepare and insert sales quotation request approvals
            foreach ($hierarchy_structure as $index => $level) {
                foreach ($level->approver as $approver) {
                    $sales_quotation_request_approvals[] = [
                        'sales_quotation_request_code' => $sales_quotation_request_code,
                        'approver_id' => $approver->code,
                        'request_approval_status' => 'Pending',
                        'request_hierarchy_level' => $index + 1,
                    ];
                }
            }

            // Insert sales quotation request approvals into the database
            foreach ($sales_quotation_request_approvals as $approval) {
                $sales_quotation_request_approval_code = MainController::generate_code(SalesQuotationRequestForApprovals::class, "code");
                SalesQuotationRequestForApprovals::create([
                    'code' => $sales_quotation_request_approval_code,
                    'sales_quotation_request_code' => $sales_quotation_request_code,
                    'ref_request_hierarchies_code' => $request_hierarchy->code,
                    'approver_code' => $approval['approver_id'],
                    'request_approval_status' => $approval['request_approval_status'],
                    'request_hierarchy_level' => $approval['request_hierarchy_level'],
                    'added_by' => $fields["added_by"],
                    'modified_by' => $fields["modified_by"],
                ]);
            }


            $response = [
            'result' => true,
            'status' => 'success',
            'title' => 'Success',
            'message' => 'Requested Quotation successfully.'
            ];
            return Crypt::encryptString(json_encode($response));
        } else {
        // Return a response indicating user access rights are required
            $response = [
                'result' => false,
                'status' => 'error',
                'title' => 'Access Denied',
                'message' => 'User access request right is required to perform this action. Please contact HR or IT for this issue'
                ];
            return Crypt::encryptString(json_encode($response));
        }
    }


    /**
     * Display the specified resource.
     *
     * @param  \App\Models\SalesQuotationRequest  $salesQuotationRequest
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        // Retrieve the SalesQuotationRequest by code
         $sales_quotation_request = SalesQuotationRequest::join('users', 'sales_quotation_requests.requested_by', '=', 'users.code')
        ->where('sales_quotation_requests.code', $id)
        ->first([
            DB::raw("users.first_name + ' ' + users.last_name as requestor_name",), // Using CONCAT for string concatenation
            'sales_quotation_requests.*',
            "users.position as requestor_position"
        ]);
        if ($sales_quotation_request) {
            $sales_quotation_request->date_requested = Carbon::parse($sales_quotation_request->created_at)->format('F j, Y');
            $sales_quotation_request->request_date = Carbon::parse($sales_quotation_request->request_date)->format('F j, Y');
        }


        // Check if the request exists
        if (!$sales_quotation_request) {
            $response = [
                'result' => false,
                'status' => 'error',
                'title' => 'Not Found',
                'message' => 'Sales Quotation Request not found.',
            ];
            return response()->json($response, 404); // Return a 404 status code for not found
        }

        // Retrieve related products and notes for the request
        $sale_request_products_for_approval = SalesQuotationRequestProducts::where('sales_quotation_request_code', $id)->get();
        $sale_request_notes_for_approval = SalesQuotationRequestNotes::where('sales_quotation_request_code', $id)->get();
        $sale_request_signatories_noted_by_for_approval = SalesQuotationRequestSignatories::join('users', 'sales_quotation_request_signatories.signatory_code', '=', 'users.code')
            ->where('type', 'Noted By:')
            ->where('sales_quotation_request_code', $id)
            ->get(['sales_quotation_request_signatories.*','users.position as signatory_position']);

        $sale_request_signatories_approved_by_for_approval = SalesQuotationRequestSignatories::join('users', 'sales_quotation_request_signatories.signatory_code', '=', 'users.code')
            ->where('type', 'Approved By:')
            ->where('sales_quotation_request_code', $id)
            ->get(['sales_quotation_request_signatories.*','users.position as signatory_position']);
        
        
        
        
        // Combine the request with its related products and notes
        $sales_quotation_request->products = $sale_request_products_for_approval;
        $sales_quotation_request->notes = $sale_request_notes_for_approval;
        $sales_quotation_request->noted_by = $sale_request_signatories_noted_by_for_approval;
        $sales_quotation_request->approved_by = $sale_request_signatories_approved_by_for_approval;
        
        // Prepare the response
        $response = [
            'dataList' => $sales_quotation_request,
            'result' => true,
            'status' => 'success',
            'title' => 'Success',
            'message' => 'Fetched successfully.',
        ];

        // Return the encrypted response
        return Crypt::encryptString(json_encode($response));
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Models\SalesQuotationRequest  $salesQuotationRequest
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, SalesQuotationRequest $salesQuotationRequest)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Models\SalesQuotationRequest  $salesQuotationRequest
     * @return \Illuminate\Http\Response
     */
    public function destroy(SalesQuotationRequest $salesQuotationRequest)
    {
        //
    }

    public function generate_code(){
        $code = 1;
        $current_date = date('Y-m-d');
        $latest_code = SalesQuotationRequest::latest('code')->first('code')->code ?? NULL;
        if(!empty($latest_code)){
            $code = $latest_code + 1;
        }
        return $code;
    }


    public function get_request_quotation(Request $request)
    {

        // Extract request parameters
        $query = $request->query('q');
        $status = $request->query('status');
        $filter_date_start = $request->query('fs');
        $filter_date_end = $request->query('fe');
        $type = $request->query('type');
        $user_id = $request->query('u');

        // Early return for invalid user ID or type
        if (empty($user_id) && empty($type)) {
            return response()->json([
                'result' => false,
                'status' => 'warning',
                'title' => 'Oops!',
                'message' => 'Invalid request. Please login.',
            ], 200);
        }

        // Initialize query for SalesQuotationRequest
        $sales_quotation_requests = SalesQuotationRequest::join('users', 'sales_quotation_requests.requested_by', '=', 'users.code');

        // Apply filters using Laravel's `when` method for cleaner, conditional logic
        $sales_quotation_requests->when($query, function ($q) use ($query) {
            $q->where(function ($subQuery) use ($query) {
                $subQuery->where('sales_quotation_requests.customer_description', 'like', '%' . $query . '%')
                    ->orWhere(DB::raw("users.first_name + ' ' + users.last_name"), 'like', '%' . $query . '%')
                    ->orWhere(DB::raw("users.last_name + ' ' + users.first_name"), 'like', '%' . $query . '%');
            });
        });

        $sales_quotation_requests->when($status, function ($q) use ($status) {
            $q->where('sales_quotation_requests.status', $status);
        });

        $sales_quotation_requests->when($type === 'm', function ($q) use ($user_id) {
            $q->where('sales_quotation_requests.requested_by', $user_id);
        });

        // Apply date filter if both start and end dates are provided
        $sales_quotation_requests->when($filter_date_start && $filter_date_end, function ($q) use ($filter_date_start, $filter_date_end) {
            // Optional: Use Carbon to handle date formatting and validation
            $startDate = Carbon::parse($filter_date_start)->startOfDay();
            $endDate = Carbon::parse($filter_date_end)->endOfDay();
            $q->whereBetween('sales_quotation_requests.request_date', [$startDate, $endDate]);
        });

        // Fetch sales quotation requests with formatted fields
         $sales_quotation_request_list = $sales_quotation_requests->get([
            DB::raw("users.first_name + ' ' + users.last_name as requestor_name"), // Using + operator for concatenation
            'sales_quotation_requests.*'
        ]);
        $requests = []; 

        foreach ($sales_quotation_request_list as $key => $value) {
            // $sale_request_products_for_approval = SalesQuotationRequestProducts::where('sales_quotation_request_code', $value->code)->get();
            // $sale_request_notes_for_approval = SalesQuotationRequestNotes::where('sales_quotation_request_code', $value->code)->get();
            // $sale_request_signatories_for_approval = SalesQuotationRequestSignatories::where('sales_quotation_request_code', $value->code)->get();
            // // Prepare the approval request entry
            $requests[] = [
                'code' => $value->code,
                'customer_description' => $value->customer_description,
                'request_date' => Carbon::parse($value->request_date)->format('F d, Y'),
                'status' => $value->status,
                'requestor_name' => $value->requestor_name,
                'request_hierarchy_level' => $value->request_hierarchy_level,
            ];
        }
        // Prepare response data
         $response = [
            'dataList' => $requests,
            'result' => true,
            'title' => 'Success',
            'status' => 'success',
            'message' => 'Fetched successfully.',
        ];

        // Return the encrypted response
        return Crypt::encryptString(json_encode($response));
    }
}
