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
        //
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

    public function get_employee_page_access_list(){
        $id = 1;

        // Retrieve all data from reference tables
        $ref_modules = RefModules::get(['code as module_code', 'description as module_description', 'link as module_link'])->keyBy('module_code');
        $ref_components = RefComponents::get(['code as component_code', 'module_code', 'link as component_description'])->groupBy('module_code');
        $ref_subcomponents = RefSubComponents::get(['code as sub_component_code', 'component_code', 'module_code', 'link as sub_component_description'])->groupBy('component_code');

        // Retrieve user access rights
        $user_modules = UserAccessModuleRights::where('user_id', $id)->get(['user_id', 'module_code', 'access_rights'])->keyBy('module_code');
        $user_components = UserAccessComponentRights::where('user_id', $id)->get(['user_id', 'module_code', 'component_code', 'access_rights', 'create', 'update', 'delete', 'generate', 'export'])->groupBy('component_code');
        $user_subcomponents = UserAccessSubComponentRights::where('user_id', $id)->get(['user_id', 'component_code', 'module_code', 'sub_component_code', 'access_rights', 'create', 'update', 'delete', 'generate', 'export'])->groupBy('sub_component_code');

        $result = [];

        
foreach ($ref_modules as $module_code => $module) {
    $module_data = [
        'module_code' => $module_code,
        'module_description' => $module->module_description,
        'module_link' => $module->module_link,
        'access_rights' => $user_modules[$module_code]->access_rights ?? '',
        'components' => []
    ];

    if (isset($ref_components[$module_code])) {
        foreach ($ref_components[$module_code] as $component) {
            $component_access = $user_components[$component->component_code]->first() ?? new stdClass();
            $component_data = [
                'component_code' => $component->component_code,
                'component_description' => $component->component_description,
                'access_rights' => $component_access->access_rights ?? '',
                'create' => $component_access->create ?? '',
                'update' => $component_access->update ?? '',
                'delete' => $component_access->delete ?? '',
                'generate' => $component_access->generate ?? '',
                'export' => $component_access->export ?? '',
                'sub_components' => []
            ];

            if (isset($ref_subcomponents[$component->component_code])) {
                foreach ($ref_subcomponents[$component->component_code] as $sub_component) {
                    $sub_component_access = $user_subcomponents[$sub_component->sub_component_code]->first() ?? new stdClass();
                    $sub_component_data = [
                        'sub_component_code' => $sub_component->sub_component_code,
                        'sub_component_description' => $sub_component->sub_component_description,
                        'access_rights' => $sub_component_access->access_rights ?? '',
                        'create' => $sub_component_access->create ?? '',
                        'update' => $sub_component_access->update ?? '',
                        'delete' => $sub_component_access->delete ?? '',
                        'generate' => $sub_component_access->generate ?? '',
                        'export' => $sub_component_access->export ?? ''
                    ];

                    $component_data['sub_components'][] = $sub_component_data;
                }
            }

            $module_data['components'][] = $component_data;
        }
    }

    $result[] = $module_data;
}
        return $result;

    }
}
