<?php

namespace App\Http\Controllers;

use App\Models\UserAccessOrganizationRights;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Crypt;
use App\Models\RefCompanies;
use App\Models\RefBusinessUnits;
use App\Models\RefTeams;
use App\Models\RefDepartments;
use App\Models\RefSections;
use App\Models\RefSubSections;

class UserAccessOrganizationRightsController extends Controller
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
            'access_rights' => 'required',
            'user_id' => 'required',
            'added_by' => 'required',
            'modified_by' => 'required',
        ]);
        $details = $request->all();
        unset($details[0]);

        $values = $details;
        $excludeKeys = ['access_rights', 'added_by', 'modified_by'];
        $queryValues = array_filter($values, function ($key) use ($excludeKeys) {
            return !in_array($key, $excludeKeys);
        }, ARRAY_FILTER_USE_KEY);

        $check = UserAccessOrganizationRights::where($queryValues)->first();
        if ($check) {
            return $check->update($values);
        } else {
            $code = $this->generate_code();

            $values['code'] = $code;
            UserAccessOrganizationRights::create($values);
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
     * @param  \App\Models\UserAccessOrganizationRights  $userAccessOrganizationRights
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {

    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Models\UserAccessOrganizationRights  $userAccessOrganizationRights
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, UserAccessOrganizationRights $userAccessOrganizationRights)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Models\UserAccessOrganizationRights  $userAccessOrganizationRights
     * @return \Illuminate\Http\Response
     */
    public function destroy(UserAccessOrganizationRights $userAccessOrganizationRights)
    {
        //
    }
    public function generate_code(){
        $code = 1;
        $current_date = date('Y-m-d');
         $latest_code = UserAccessOrganizationRights::latest('code')->first('code')->code ?? NULL;
        if(!empty($latest_code)){
            $code = $latest_code + 1;
        }
        return $code;
    }
    public function get_employee_organization_access_list($id){
        $ref_companies = RefCompanies::whereNull('deleted_at')->get(['code as company_code','description as company_description']);
        $ref_business_units = RefBusinessUnits::whereNull('deleted_at')->get(['code as business_unit_code','company_code','description as business_unit_description']);
        $ref_teams = RefTeams::whereNull('deleted_at')->get(['code as team_code','company_code','business_unit_code','description as team_description']);
        $ref_departments = RefDepartments::whereNull('deleted_at')->get(['code as department_code','company_code','business_unit_code','team_code','description as department_description']);
        $ref_sections = RefSections::whereNull('deleted_at')->get(['code as section_code','company_code','business_unit_code','team_code','department_code','description as section_description']);
        $ref_subsections = RefSubSections::whereNull('deleted_at')->get(['code as subsection_code','section_code','description as subsection_description']);
        $result = [];

        foreach ($ref_companies as $company) {
        $result[] = [
            'company_code' => $company->company_code,
            'company_description' => $company->company_description,
            'business_unit_code' => '',
            'business_unit_description' => '',
            'team_code' => '',
            'team_description' => '',
            'department_code' => '',
            'department_description' => '',
            'section_code' => '',
            'section_description' => '',
            'subsection_code' => '',
            'subsection_description' => '',
        ];
        foreach ($ref_business_units->where('company_code', $company->company_code) as $business_unit) {
            $result[] = [
                'company_code' => $company->company_code,
                'company_description' => $company->company_description,
                'business_unit_code' => $business_unit->business_unit_code,
                'business_unit_description' => $business_unit->business_unit_description,
                'team_code' => '',
                'team_description' => '',
                'department_code' => '',
                'department_description' => '',
                'section_code' => '',
                'section_description' => '',
                'subsection_code' => '',
                'subsection_description' => '',
            ];

            foreach ($ref_teams->where('company_code', $company->company_code)->where('business_unit_code', $business_unit->business_unit_code) as $team) {
                $result[] = [
                    'company_code' => $company->company_code,
                    'company_description' => $company->company_description,
                    'business_unit_code' => $business_unit->business_unit_code,
                    'business_unit_description' => $business_unit->business_unit_description,
                    'team_code' => $team->team_code,
                    'team_description' => $team->team_description,
                    'department_code' => '',
                    'department_description' => '',
                    'section_code' => '',
                    'section_description' => '',
                    'subsection_code' => '',
                    'subsection_description' => '',
                ];

                foreach ($ref_departments->where('company_code', $company->company_code)->where('business_unit_code', $business_unit->business_unit_code)->where('team_code', $team->team_code) as $department) {
                    $result[] = [
                        'company_code' => $company->company_code,
                        'company_description' => $company->company_description,
                        'business_unit_code' => $business_unit->business_unit_code,
                        'business_unit_description' => $business_unit->business_unit_description,
                        'team_code' => $team->team_code,
                        'team_description' => $team->team_description,
                        'department_code' => $department->department_code,
                        'department_description' => $department->department_description,
                        'section_code' => '',
                        'section_description' => '',
                        'subsection_code' => '',
                        'subsection_description' => '',
                    ];

                    foreach ($ref_sections->where('company_code', $company->company_code)->where('business_unit_code', $business_unit->business_unit_code)->where('team_code', $team->team_code)->where('department_code', $department->department_code) as $section) {
                        $result[] = [
                            'company_code' => $company->company_code,
                            'company_description' => $company->company_description,
                            'business_unit_code' => $business_unit->business_unit_code,
                            'business_unit_description' => $business_unit->business_unit_description,
                            'team_code' => $team->team_code,
                            'team_description' => $team->team_description,
                            'department_code' => $department->department_code,
                            'department_description' => $department->department_description,
                            'section_code' => $section->section_code,
                            'section_description' => $section->section_description,
                            'subsection_code' => '',
                            'subsection_description' => '',
                        ];

                        foreach ($ref_subsections->where('section_code', $section->section_code) as $subsection) {
                            $result[] = [
                                'company_code' => $company->company_code,
                                'company_description' => $company->company_description,
                                'business_unit_code' => $business_unit->business_unit_code,
                                'business_unit_description' => $business_unit->business_unit_description,
                                'team_code' => $team->team_code,
                                'team_description' => $team->team_description,
                                'department_code' => $department->department_code,
                                'department_description' => $department->department_description,
                                'section_code' => $section->section_code,
                                'section_description' => $section->section_description,
                                'subsection_code' => $subsection->subsection_code,
                                'subsection_description' => $subsection->subsection_description,
                            ];
                            }
                        }
                    }
                }
            }
        }

        $accessed_list = UserAccessOrganizationRights::where('user_id', $id)->get();
        foreach ($result as &$item) {
            foreach ($accessed_list as $access) {
                if ($access['company_code'] == $item['company_code'] &&
                    $access['business_unit_code'] == $item['business_unit_code'] &&
                    $access['team_code'] == $item['team_code'] &&
                    $access['department_code'] == $item['department_code'] &&
                    $access['section_code'] == $item['section_code'] &&
                    $access['subsection_code'] == $item['subsection_code']) {
                    $item['access_rights'] = $access['access_rights'];
                    break;
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
