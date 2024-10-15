<?php

namespace App\Http\Controllers;

use App\Models\UserAccessProductGroupRights;
use App\Models\RefProductGroups;
use Illuminate\Support\Facades\Crypt;
use Illuminate\Http\Request;

class UserAccessProductGroupRightsController extends Controller
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
            'ref_product_groups_code' => 'required',
            'access_rights' => 'required',
            'user_code' => 'required',
            'added_by' => 'required',
            'modified_by' => 'required',
        ]);
        $check = UserAccessProductGroupRights::
                where('user_id',$fields['user_code'])->
                where('ref_product_groups_code',$fields['ref_product_groups_code'])->
                first();
        if ($check) {
                $data = [
                    'ref_product_groups_code' => $fields['ref_product_groups_code'],
                    'access_rights' => $fields['access_rights'],
                    'user_id' => $fields['user_code'],
                    'modified_by' => $fields['modified_by'],

                ];
                $check->update($data);
            } else {
                $code = $this->generate_code();
                $data = [
                    'ref_product_groups_code' => $fields['ref_product_groups_code'],
                    'access_rights' => $fields['access_rights'],
                    'user_id' => $fields['user_code'],
                    'added_by' => $fields['added_by'],
                    'modified_by' => $fields['modified_by'],
                    'code' => $code
                ];
                UserAccessProductGroupRights::create($data);
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
     * @param  \App\Models\UserAccessProductGroupRights  $userAccessProductGroupRights
     * @return \Illuminate\Http\Response
     */
    public function show(UserAccessProductGroupRights $userAccessProductGroupRights)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Models\UserAccessProductGroupRights  $userAccessProductGroupRights
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, UserAccessProductGroupRights $userAccessProductGroupRights)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Models\UserAccessProductGroupRights  $userAccessProductGroupRights
     * @return \Illuminate\Http\Response
     */
    public function destroy(UserAccessProductGroupRights $userAccessProductGroupRights)
    {
        //
    }

    public function generate_code(){
        $code = 1;
        $current_date = date('Y-m-d');
         $latest_code = UserAccessProductGroupRights::latest('code')->first('code')->code ?? NULL;
        if(!empty($latest_code)){
            $code = $latest_code + 1;
        }
        return $code;
    }

    public function get_product_group_right_access_list($id)
    {
        $ref_product_groups = RefProductGroups::whereNull('ref_product_groups.deleted_at')->get();
        $result = [];
        
        foreach ($ref_product_groups as $pg) {
            $user_request_access = UserAccessProductGroupRights::join('ref_product_groups','user_access_product_group_rights.ref_product_groups_code','=','ref_product_groups.code')
                ->where('ref_product_groups_code', $pg->code)
                ->where('user_id', $id)
                ->first();


            $result[] = [
                'product_groups_code' => $pg->code,
                'product_groups_description' => $pg->description,
                'access_rights' => $user_request_access->access_rights ?? 0,
            ];
        }
        $response = [
                'dataList' => $result,
                'result' => true,
                'title' => 'Success',
                'status' => 'success',
                'message' => 'Fetched successfully.',
        ];
        return Crypt::encryptString(json_encode($response));
    }
}
