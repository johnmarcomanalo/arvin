<?php

namespace App\Http\Controllers;

use App\Models\SalesQuotationRequest;
use App\Models\SalesQuotationRequestNotes;
use App\Models\SalesQuotationRequestProducts;
use App\Models\SalesQuotationRequestForApprovals;
use App\Models\RefRequestHierarchies;
use App\Models\RefRequestTypes;
use App\Models\UserAccessRequestRights;
use Illuminate\Support\Facades\Crypt;
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
            'notes' => 'required',
            'product_list' => 'required',
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
    public function show(SalesQuotationRequest $salesQuotationRequest)
    {
        //
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
}
