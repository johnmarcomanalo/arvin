<?php

namespace App\Http\Controllers;

use App\Models\UserAccessCustomerRights;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Crypt;
use Illuminate\Support\Facades\DB;

class UserAccessCustomerRightsController extends Controller
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
     * @param  \App\Models\UserAccessCustomerRights  $userAccessCustomerRights
     * @return \Illuminate\Http\Response
     */
    public function show(UserAccessCustomerRights $userAccessCustomerRights)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Models\UserAccessCustomerRights  $userAccessCustomerRights
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, UserAccessCustomerRights $userAccessCustomerRights)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Models\UserAccessCustomerRights  $userAccessCustomerRights
     * @return \Illuminate\Http\Response
     */
    
    public function destroy(UserAccessCustomerRights $userAccessCustomerRights)
    {
        //
    }

    public function get_employee_customer_access_list(Request $request)
    {
        $page = $request->query('pg', 1); // Default to page 1 if not provided
        $limit = $request->query('lmt', 10); // Default to 10 items per page if not provided
        $search = $request->query('srch');
        $filter = $request->query('fltr');
        $user_id = Crypt::decryptString($request->query('uid')); 

        if (empty($user_id)) {
            $response = [
                'result' => false,
                'status' => 'warning',
                'title' => 'Oppss!',
                'message' => "Invalid request. Please login.",
            ];
            return response()->json($response, 200);
        }

        $query = DB::table('vw_ref_customers')->select('cardname as description', 'customer_type as type', 'validfor as status','cardcode as customer_code');

        if (isset($search)) {
            $query->where(function ($q) use ($search) {
                $q->where('cardname', 'like', '%' . $search . '%')
                ->orWhere('cardcode', 'like', '%' . $search . '%');
            });
        }
        
        if (isset($filter)) {
            $query->where('customer_type', $filter);
        }

        // Paginate the query
        $customersFromSAP = $query->paginate($limit, ['*'], 'page', $page);

        $result = [];
        foreach ($customersFromSAP as $customerSAP) {
            $user_customers = UserAccessCustomerRights::where('user_id', $user_id)
                ->where('description', $customerSAP->description)
                ->where('customer_code', $customerSAP->customer_code)
                ->first();
            $result[] = [
                'description' => $customerSAP->description,
                'type' => $customerSAP->type,
                'status' => $customerSAP->status == 'Y' ? 'Active' : 'Inactive',
                'customer_code' => $customerSAP->customer_code,
                'access_rights' => $user_customers->access_rights ?? 0,
            ];
        }

        $response = [
                'pagination' => [
                'dataList' => $result,
                'total' => $customersFromSAP->total(),
                'count' => $customersFromSAP->count(),
                'per_page' => $customersFromSAP->perPage(),
                'current_page' => $customersFromSAP->currentPage(),
                'total_pages' => $customersFromSAP->lastPage(),
                ],
                'result' => true,
                'title' => 'Success',
                'status' => 'success',
                'message' => 'Fetched successfully.',
        ];
        return Crypt::encryptString(json_encode($response));
    }

}
