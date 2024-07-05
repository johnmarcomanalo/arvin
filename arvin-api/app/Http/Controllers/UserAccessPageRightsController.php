<?php

namespace App\Http\Controllers;

use App\Models\UserAccessPageRights;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Crypt;
use App\Models\UserAccessModuleRights;
use App\Models\UserAccessComponentRights;
use App\Models\UserAccessSubComponentRights;
use App\Models\RefModules;
use App\Models\RefComponents;
use App\Models\RefSubComponents;

class UserAccessPageRightsController extends Controller
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
            'module_code' => 'required',
            'module_description' => 'required',
            'module_link' => 'required',
            'component_code' => 'nullable|string',
            'component_description' => 'nullable|string',
            'component_link' => 'nullable|string',
            'sub_component_code' => 'nullable|string',
            'sub_component_description' => 'nullable|string',
            'sub_component_link' => 'nullable|string',
            'access_rights' => 'required',
            'create' => 'required',
            'update' => 'required',
            'delete' => 'required',
            'generate' => 'required',
            'export' => 'required',
            'type' => 'required',
            'user_id' => 'required',
            'added_by' => 'required',
            'modified_by' => 'required',
        ]);
        switch ($fields['type']) {
        case 'module':
            $check = UserAccessModuleRights::
                where('user_id',$fields['user_id'])->
                where('module_code',$fields['module_code'])->
                first();
            if ($check) {
                return $check->update($fields);
            } else {
                $code = $this->generate_code_module();
                $fields['code'] = $code;
                UserAccessModuleRights::create($fields);
            }
            $response = [
            'result' => true,
            'title' => 'Success',
            'status' => 'success',
            'message' => 'Access updated successfully.',
            ];
            return $response;
            break;
        
        case 'component':
            $check = UserAccessComponentRights::
                where('user_id',$fields['user_id'])->
                where('component_code',$fields['component_code'])->
                first();
            if ($check) {
                 $check->update($fields);
            } else {
                $fields['code'] = $this->generate_code($fields['component_code'],$fields['user_id']);
                UserAccessComponentRights::create($fields);
            }
            $response = [
            'result' => true,
            'title' => 'Success',
            'status' => 'success',
            'message' => 'Access updated successfully.',
            ];
            return $response;
            break;
        case 'sub_component':
            return $check = UserAccessSubComponentRights::
                where('user_id',$fields['user_id'])->
                where('sub_component_code',$fields['sub_component_code'])->
                first();
            if ($check) {
                 $check->update($fields);
            } else {
                $fields['code'] = $this->generate_code($fields['sub_component_code'],$fields['user_id']);
                UserAccessSubComponentRights::create($fields);
            }
            $response = [
            'result' => true,
            'title' => 'Success',
            'status' => 'success',
            'message' => 'Access updated successfully.',
            ];
            return $response;
            break;
        default:
            return response()->json(['error' => 'Invalid type specified'], 400);
    }

         
    }

    /**
     * Display the specified resource.
     *
     * @param  \App\Models\UserAccessPageRights  $userAccessPageRights
     * @return \Illuminate\Http\Response
     */
    public function show(UserAccessPageRights $userAccessPageRights)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Models\UserAccessPageRights  $userAccessPageRights
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, UserAccessPageRights $userAccessPageRights)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Models\UserAccessPageRights  $userAccessPageRights
     * @return \Illuminate\Http\Response
     */
    public function destroy(UserAccessPageRights $userAccessPageRights)
    {
        //
    }
    public function generate_code($code,$id){
        $code = $code.'-'.$id;
        return $code;
    }
    public function generate_code_module(){
        $code = 1;
        $current_date = date('Y-m-d');
         $latest_code = UserAccessModuleRights::latest('code')->first('code')->code ?? NULL;
        if(!empty($latest_code)){
            $code = $latest_code + 1;
        }
        return $code;
    }
    public function get_employee_page_access_list($id) {
        // Retrieve all data from reference tables
        $ref_modules = RefModules::get(['code as module_code', 'description as module_description', 'link as module_link']);
        $ref_components = RefComponents::get(['code as component_code', 'module_code','description as component_description', 'link as component_link']);
        $ref_subcomponents = RefSubComponents::get(['code as sub_component_code', 'component_code', 'module_code','description as sub_component_description', 'link as sub_component_link']);

        foreach ($ref_modules as $modules) {
            $user_modules = UserAccessModuleRights::where('user_id', $id)->where('module_code', $modules->module_code)->first(['access_rights']);
            $result[] = [
            'module_code' => $modules->module_code,
            'module_description' => $modules->module_description,
            'module_link' => $modules->module_link,
            'component_code' => '',
            'component_description' => '',
            'component_link' => '',
            'sub_component_code' => '',
            'sub_component_description' => '',
            'access_rights' => $user_modules['access_rights']?? 0,
            'create' => 0,
            'update' => 0,
            'delete' => 0,
            'generate' => 0,
            'export' => 0,
            'type' => 'module',
            ];
            foreach ($ref_components->where('module_code', $modules->module_code) as $components) {
                $user_components = UserAccessComponentRights::
                where('user_id', $id)->
                where('module_code', $modules->module_code)->
                where('component_code', $components->component_code)->
                first(['access_rights', 'create', 'update', 'delete', 'generate', 'export']);
                $result[] = [
                    'module_code' => $modules->module_code,
                    'module_description' => $modules->module_description,
                    'module_link' => $modules->module_link,
                    'component_code' => $components->component_code,
                    'component_description' =>$components->component_description,
                    'component_link' =>$components->component_link,
                    'sub_component_code' => '',
                    'sub_component_description' => '',
                    'sub_component_link' => '',
                    'access_rights' => $user_components['access_rights']?? 0,
                    'create' => $user_components['create']?? 0,
                    'update' => $user_components['update']?? 0,
                    'delete' => $user_components['delete']?? 0,
                    'generate' => $user_components['generate']?? 0,
                    'export' => $user_components['export']?? 0,
                    'type' => 'component',
                ];  
                foreach ($ref_subcomponents->where('component_code', $components->component_code) as $subsection) {
                    $user_subcomponents = UserAccessSubComponentRights::
                    where('user_id', $id)->
                    where('module_code', $modules->module_code)->
                    where('component_code', $components->component_code)->
                    where('sub_component_code',  $subsection->sub_component_code)->
                    first(['access_rights', 'create', 'update', 'delete', 'generate', 'export']);
                    $result[] = [
                        'module_code' => $modules->module_code,
                        'module_description' => $modules->module_description,
                        'module_link' => $modules->module_link,
                        'component_code' => $components->component_code,
                        'component_description' =>$components->component_description,
                        'component_link' =>$components->component_link,
                        'sub_component_code' => $subsection->sub_component_code,
                        'sub_component_description' => $subsection->sub_component_description,
                        'sub_component_link' => $subsection->sub_component_link,
                        'access_rights' => $user_subcomponents['access_rights']?? 0,
                        'create' => $user_subcomponents['create']?? 0,
                        'update' => $user_subcomponents['update']?? 0,
                        'delete' => $user_subcomponents['delete']?? 0,
                        'generate' => $user_subcomponents['generate']?? 0,
                        'export' => $user_subcomponents['export']?? 0,
                        'type' => 'sub_component',

                    ];
                }
            }
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
