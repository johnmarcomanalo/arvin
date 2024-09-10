<?php

namespace App\Http\Controllers;

use App\Models\SalesQuotationRequestForApprovals;
use App\Models\SalesQuotationRequestNotes;
use App\Models\SalesQuotationRequestProducts;
use App\Models\SalesQuotationRequestSignatories;
use App\Models\SalesQuotationRequest;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Crypt;
use Illuminate\Http\Request;
use Carbon\Carbon;


class SalesQuotationRequestForApprovalsController extends Controller
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
        $fields = $request->validate([
        'selected_requests' => 'required|array|min:1', // Ensure it's a non-empty array
        'status' => 'required|string',
        'approved_by' => 'required|string',
        ]);

        $selected_requests = $fields['selected_requests'];
        $approver_code = $fields["approved_by"];
        $status = $fields["status"];

         // Iterate over each selected request
        foreach ($selected_requests as $value) {

            // Retrieve the SalesQuotationRequestForApprovals record
             $sales_quotation_request_for_approval = SalesQuotationRequestForApprovals::where('sales_quotation_request_code',$value->code)
            ->where('request_hierarchy_level',$value->request_hierarchy_level)
            ->where('approver_code',$approver_code)
            ->first();

            if ($sales_quotation_request_for_approval) {
                $sales_quotation_request_for_approval->update([
                    'modified_by' => $approver_code,
                    'request_approval_status' => $fields["status"],
                ]);
            } else {
                $response = [
                    'result' => true,
                    'status' => 'error',
                    'title' => 'Error',
                    'message' => "Request code-".$value->code." unavailable for updating of status",
                ];
                return Crypt::encryptString(json_encode($response));
            }

             // Retrieve the SalesQuotationRequest record
            $sales_quotation_request = SalesQuotationRequest::where('code',$value->code)
            ->where('status','Pending')
            ->first();
            
            $sales_quotation_request_hierarchy = json_decode($sales_quotation_request->request_hierarchy);
            $sales_quotation_request_hierarchy_count = count($sales_quotation_request_hierarchy);

            foreach ($sales_quotation_request_hierarchy as  $sales_quotation_request_hierarchy_value) {
                if ($sales_quotation_request_hierarchy_value->index == $sales_quotation_request->request_hierarchy_level )
                {
                    $approverExists = collect($sales_quotation_request_hierarchy_value->approver)->contains(function ($approver) use ($approver_code) {
                        return $approver->code === $approver_code;
                    });
                    // Update the status
                    if ($approverExists) {
                        $sales_quotation_request_hierarchy_value->status = $fields["status"];
                        // break; // Exit the loop once the item is found and updated
                    }
                }
            }

            // Determine the next steps based on status
            $updated_sales_quotation_request_hierarchy = json_encode($sales_quotation_request_hierarchy);

            $updateData = [
            'request_hierarchy' => $updated_sales_quotation_request_hierarchy,
            ];

            if ($status === 'Approved' && $sales_quotation_request_hierarchy_count > $sales_quotation_request->request_hierarchy_level) {
                $updateData['request_hierarchy_level'] = $sales_quotation_request->request_hierarchy_level + 1;
            } else {
            $updateData['status'] = $status;
            }
            $sales_quotation_request->update($updateData);
                // Return a success response
        
        }
        $response = [
            'result' => true,
            'icon' => 'success',
            'title' => 'Requests Processed',
            'message' => 'The selected request/s have been successfully processed.',
        ];

        return response($response, 200);
    }

    /**
     * Display the specified resource.
     *
     * @param  \App\Models\SalesQuotationRequestForApprovals  $salesQuotationRequestForApprovals
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        // Retrieve the SalesQuotationRequest by code
        $sales_quotation_request = SalesQuotationRequest::join('users', 'sales_quotation_requests.requested_by', '=', 'users.code')
        ->where('sales_quotation_requests.code', $id)
        ->first([
            DB::raw("users.first_name + ' ' + users.last_name as requestor_name"), // Using CONCAT for string concatenation
            'sales_quotation_requests.*'
        ]);
        if ($sales_quotation_request) {
            $sales_quotation_request->date_requested = Carbon::parse($sales_quotation_request->created_at)->format('F d, Y');
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
        // $sale_request_signatories_for_appr   oval = SalesQuotationRequestSignatories::where('sales_quotation_request_code', $id)->get();
        $sale_request_signatories_noted_by_for_approval = SalesQuotationRequestSignatories::join('users', 'sales_quotation_request_signatories.signatory_code', '=', 'users.code')
            ->where('type', 'Noted By:')
            ->where('sales_quotation_request_code', $value->code)
            ->get(['sales_quotation_request_signatories.*','users.position as signatory_position']);

        $sale_request_signatories_approved_by_for_approval = SalesQuotationRequestSignatories::join('users', 'sales_quotation_request_signatories.signatory_code', '=', 'users.code')
            ->where('type', 'Approved By:')
            ->where('sales_quotation_request_code', $value->code)
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
     * @param  \App\Models\SalesQuotationRequestForApprovals  $salesQuotationRequestForApprovals
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, SalesQuotationRequestForApprovals $salesQuotationRequestForApprovals)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Models\SalesQuotationRequestForApprovals  $salesQuotationRequestForApprovals
     * @return \Illuminate\Http\Response
     */
    public function destroy(SalesQuotationRequestForApprovals $salesQuotationRequestForApprovals)
    {
        //
    }


    public function get_request_for_approval(Request $request)
    {

        // Extract request parameters
        $query = $request->query('q');
        $filter_date_start = $request->query('fs');
        $filter_date_end = $request->query('fe');

        // Decrypt the user ID
         $user_id = $request->query('u');

         
        // Return an error response if user_id is invalid
        if (empty($user_id)) {
            return response()->json([
                'result' => false,
                'status' => 'warning',
                'title' => 'Oops!',
                'message' => 'Invalid request. Please login.',
            ], 200);
        }

  

        // Initialize query for SalesQuotationRequest
        $sales_quotation_requests = SalesQuotationRequest::join('users', 'sales_quotation_requests.requested_by', '=', 'users.code')
            ->where('status', 'Pending')
            ->whereNull('approval_date');

        // Apply date filter if set

        if (isset($query)) {
             $sales_quotation_requests->where(function($q) use ($query) {
                $q->where('sales_quotation_requests.customer_description', 'like', '%' . $query . '%')
                ->orWhere(DB::raw("users.first_name + ' ' + users.last_name"), 'like', '%' . $query . '%')
                ->orWhere(DB::raw("users.last_name + ' ' + users.first_name"), 'like', '%' . $query . '%'); 
            });
        }


        if ($filter_date_start && $filter_date_end) {
            $sales_quotation_requests->whereBetween('request_date', [$filter_date_start, $filter_date_end]);
        }

        // Fetch sales quotation requests
         $sales_quotation_request_list = $sales_quotation_requests->get([
            DB::raw("users.first_name + ' ' + users.last_name as requestor_name"), // Using + operator for concatenation
            'sales_quotation_requests.*'
        ]);
        $for_approval_requests = []; 
    
       

        foreach ($sales_quotation_request_list as $key => $value) {
            
            // Fetch approval details for the current request
              $sale_request_for_approval = SalesQuotationRequestForApprovals::where('approver_code',$user_id)
            ->where('sales_quotation_request_code', $value->code)
            ->where('request_hierarchy_level', $value->request_hierarchy_level)
            ->first();
            // Fetch products and notes for the current request
            $sale_request_products_for_approval = SalesQuotationRequestProducts::where('sales_quotation_request_code', $value->code)->get();
            $sale_request_notes_for_approval = SalesQuotationRequestNotes::where('sales_quotation_request_code', $value->code)->get();
            $sale_request_signatories_for_approval = SalesQuotationRequestSignatories::where('sales_quotation_request_code', $value->code)->get();

            // Prepare the approval request entry
            if($sale_request_for_approval){
                $for_approval_requests[] = [
                'code' => $value->code,
                'customer_description' => $value->customer_description,
                'request_date' => Carbon::parse($value->request_date)->format('F d, Y'),
                'status' => $value->status,
                'requestor_name' => $value->requestor_name,
                'request_hierarchy_level' => $value->request_hierarchy_level,
            ];
            }
        }
        // Prepare response data
         $response = [
            'dataList' => $for_approval_requests,
            'result' => true,
            'title' => 'Success',
            'status' => 'success',
            'message' => 'Fetched successfully.',
        ];

        // Return the encrypted response
        return Crypt::encryptString(json_encode($response));
    }


}
