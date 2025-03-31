<?php

namespace App\Http\Controllers;

use App\Models\UserAccessRequestRights;
use App\Models\RefRequestHierarchies;
use App\Models\RefRequestTypes;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Crypt;

class UserAccessRequestRightsController extends Controller
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
            'user_code' => 'required',
            'ref_request_type_code' => 'required',
            'ref_request_hierarchies_code' => 'required',
            'access_rights' => 'required',
            'user_code' => 'required',
            'added_by' => 'required',
            'modified_by' => 'required',
        ]);
        $check = UserAccessRequestRights::
                where('user_code',$fields['user_code'])->
                where('ref_request_type_code',$fields['ref_request_type_code'])->
                // where('ref_request_hierarchies_code',$fields['ref_request_hierarchies_code'])->
                first();
        if ($check) {
                $data = [
                    'ref_request_type_code' => $fields['ref_request_type_code'],
                    'ref_request_hierarchies_code' => $fields['ref_request_hierarchies_code'],
                    'user_code' => $fields['user_code'],
                    'modified_by' => $fields['modified_by'],
                ];
                $check->update($data);
            } else {
                $code = $this->generate_code();
                $data = [
                    'ref_request_type_code' => $fields['ref_request_type_code'],
                    'ref_request_hierarchies_code' => $fields['ref_request_hierarchies_code'],
                    'access_rights' => $fields['access_rights'],
                    'user_code' => $fields['user_code'],
                    'added_by' => $fields['added_by'],
                    'modified_by' => $fields['modified_by'],
                    'code' => $code
                ];
                UserAccessRequestRights::create($data);
            }
            $response = [
            'result' => true,
            'title' => 'Success',
            'status' => 'success',
            'message' => 'Access updated successfully.',
            ];
            return $response;
        
    }

    /**
     * Display the specified resource.
     *
     * @param  \App\Models\UserAccessRequestRights  $userAccessRequestRights
     * @return \Illuminate\Http\Response
     */
    public function show(UserAccessRequestRights $userAccessRequestRights)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Models\UserAccessRequestRights  $userAccessRequestRights
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, UserAccessRequestRights $userAccessRequestRights)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Models\UserAccessRequestRights  $userAccessRequestRights
     * @return \Illuminate\Http\Response
     */
    public function destroy(UserAccessRequestRights $userAccessRequestRights)
    {
        //
    }




    public function get_request_rights_access_list(Request $request)
    {
        $page = $request->query('pg', 1); // Default to page 1 if not provided
        $limit = $request->query('lmt', 10); // Default to 10 items per page if not provided
        $search = $request->query('srch');
        $filter = $request->query('fltr');
        $user_id = $request->query('uid');
        // $user_id = Crypt::decryptString($request->query('uid')); 

        if (empty($user_id)) {
            $response = [
                'result' => false,
                'status' => 'warning',
                'title' => 'Oppss!',
                'message' => "Invalid request. Please login.",
            ];
            return response()->json($response, 200);
        }

        $query = RefRequestTypes::select(
            'code as ref_request_type_code',
            'description as ref_request_type_description',
        )->whereNull('deleted_at');
        
        if (isset($search)) {
            $query->where(function ($q) use ($search) {
                $q->where('description', 'like', '%' . $search . '%')
                ->orWhere('code', 'like', '%' . $search . '%');
            });
        }
        
        if (isset($filter)) {
            $query->where('customer_type', $filter);
        }

        // Paginate the query
         $ref_request_types = $query->paginate($limit, ['*'], 'page', $page);

        $result = [];
        foreach ($ref_request_types as $request_types) {
            $user_request_access = UserAccessRequestRights::join('ref_request_types','user_access_request_rights.ref_request_type_code','=','ref_request_types.code')
            ->join('ref_request_hierarchies','user_access_request_rights.ref_request_hierarchies_code','=','ref_request_hierarchies.code')
            ->where('ref_request_type_code', $request_types->ref_request_type_code)
            ->where('user_code', $user_id)
                ->first('ref_request_hierarchies.description as ref_request_hierarchies_description');


            $result[] = [
                'request_type_code' => $request_types->ref_request_type_code,
                'request_type_description' => $request_types->ref_request_type_description,
                'request_hierarchy_description' => $user_request_access->ref_request_hierarchies_description  ?? 'No Assigned Hierarchy',
                'access_rights' => $user_request_access->access_rights ?? 0,
            ];
        }
        $response = [
                'pagination' => [
                'dataList' => $result,
                'total' => $ref_request_types->total(),
                'count' => $ref_request_types->count(),
                'per_page' => $ref_request_types->perPage(),
                'current_page' => $ref_request_types->currentPage(),
                'total_pages' => $ref_request_types->lastPage(),
                ],
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
         $latest_code = UserAccessRequestRights::latest('code')->first('code')->code ?? NULL;
        if(!empty($latest_code)){
            $code = $latest_code + 1;
        }
        return $code;
    }
}
