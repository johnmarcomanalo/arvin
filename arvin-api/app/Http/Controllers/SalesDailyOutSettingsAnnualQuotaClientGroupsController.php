<?php

namespace App\Http\Controllers;

use App\Models\SalesDailyOutSettingsAnnualQuotaClientGroups;
use App\Models\SalesDailyOutSettingsClientGroups;
use App\Models\SalesDailyOutSettingsClientSubGroups;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Crypt;
use Carbon\Carbon;
use Illuminate\Validation\Rule;
use Illuminate\Support\Arr;

class SalesDailyOutSettingsAnnualQuotaClientGroupsController extends Controller
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
        $salesDailyOutAnnualSettingsSalesController = new SalesDailyOutAnnualSettingsSalesController();
        // $salesDailyOutTrackersController = new SalesDailyOutTrackersController();

        $fields = $request->validate([
            'type' => 'required',
            'sales_daily_out_settings_client_group_code' => 'required_if:type,GROUP',
            'description' => 'required_if:type,SINGLE',
            'customer_code' => 'required_if:type,SINGLE',
            'subgroups' => 'required_if:type,SINGLE',
            'year_sales_target' => 'required',
            'annual_sales_target' => 'required',
            'monthly_sales_target' => 'required',
            'ref_product_groups_code' => 'required',
            'ref_product_groups_description' => 'required',
            'added_by' => 'required',
            'modified_by' => 'required',
        ]);

        $code_annual_quota = MainController::generate_code('App\Models\SalesDailyOutSettingsAnnualQuotaClientGroups',"code");

        if($fields['type'] == 'GROUP'){
            // check quota if existing
            $check_quota = SalesDailyOutSettingsAnnualQuotaClientGroups::where('year_sales_target',$fields['year_sales_target'])
                ->where('sales_daily_out_settings_client_group_code',$fields['sales_daily_out_settings_client_group_code'])
                ->where('ref_product_groups_code',$fields['ref_product_groups_code'])
                ->whereNull('deleted_at')
                ->count();

            if($check_quota > 0){
                $response = [
                        'message' => 'There is already a existing quota for - : '.$fields["subsection"].' Year : '.$fields['year_sales_target'].'with date effectiveness of'.$fields['date_effectiveness'] ,
                        'result' => false,
                        'status' => 'warning',
                        'title' => 'Oppss!',
                ];
                return response($response,409);
            }

            SalesDailyOutSettingsAnnualQuotaClientGroups::create([
                'code' => $code_annual_quota,
                'sales_daily_out_settings_client_group_code' =>$fields["sales_daily_out_settings_client_group_code"],
                'year_sales_target' => $fields["year_sales_target"],
                'annual_sales_target' => $fields["annual_sales_target"],
                'january_sales_target' => $fields["monthly_sales_target"],
                'february_sales_target' => $fields["monthly_sales_target"],
                'march_sales_target' => $fields["monthly_sales_target"],
                'april_sales_target' => $fields["monthly_sales_target"],
                'may_sales_target' => $fields["monthly_sales_target"],
                'june_sales_target' => $fields["monthly_sales_target"],
                'july_sales_target' => $fields["monthly_sales_target"],
                'august_sales_target' => $fields["monthly_sales_target"],
                'september_sales_target' => $fields["monthly_sales_target"],
                'october_sales_target' => $fields["monthly_sales_target"],
                'november_sales_target' => $fields["monthly_sales_target"],
                'december_sales_target' => $fields["monthly_sales_target"],     
                'ref_product_groups_code' => $fields["ref_product_groups_code"],
                'added_by' => $fields["added_by"],
                'modified_by' => $fields["modified_by"],
            ]);
        } else {
                $check_in_group = SalesDailyOutSettingsClientGroups::where('description',$fields['description'])
                    ->whereNull('deleted_at')
                    ->count();

                if($check_in_group > 0){
                    $response = [
                            'message' => 'There is already a existing name of group for - : '.$fields["description"] ,
                            'result' => false,
                            'status' => 'warning',
                            'title' => 'Oppss!',
                    ];
                    return response($response,409);
                }

                $check_in_subgroup = SalesDailyOutSettingsClientSubGroups::where('customer_code',$fields['customer_code'])
                    ->where('description',$fields['description'])    
                    ->whereNull('deleted_at')
                    ->count();

                if($check_in_subgroup > 0){
                    $response = [
                            'message' => 'There is already a existing group for - : '.$fields["description"] ,
                            'result' => false,
                            'status' => 'warning',
                            'title' => 'Oppss!',
                    ];
                    return response($response,409);
                }

                $code_group = MainController::generate_code('App\Models\SalesDailyOutSettingsClientGroups',"code");

                SalesDailyOutSettingsClientGroups::create([
                    'code' => $code_group,
                    'description' => $fields["description"],
                    'added_by' => $fields["added_by"],
                    'modified_by' => $fields["modified_by"],
                ]);

                foreach ($fields['subgroups'] as $value) {
                    $code = MainController::generate_code('App\Models\SalesDailyOutSettingsClientSubGroups',"code");
                    SalesDailyOutSettingsClientSubGroups::create([
                        'code' => $code,
                        'sales_daily_out_settings_client_groups_code' => $code_group,
                        'customer_code' => $value->customer_code,
                        'description' => $value->description,
                        'type' => $value->type,
                        'added_by' => $fields["added_by"],
                        'modified_by' => $fields["modified_by"],
                    ]);
                }

                SalesDailyOutSettingsAnnualQuotaClientGroups::create([
                    'code' => $code_annual_quota,
                    'sales_daily_out_settings_client_group_code' =>$code_group,
                    'year_sales_target' => $fields["year_sales_target"],
                    'annual_sales_target' => $fields["annual_sales_target"],
                    'january_sales_target' => $fields["monthly_sales_target"],
                    'february_sales_target' => $fields["monthly_sales_target"],
                    'march_sales_target' => $fields["monthly_sales_target"],
                    'april_sales_target' => $fields["monthly_sales_target"],
                    'may_sales_target' => $fields["monthly_sales_target"],
                    'june_sales_target' => $fields["monthly_sales_target"],
                    'july_sales_target' => $fields["monthly_sales_target"],
                    'august_sales_target' => $fields["monthly_sales_target"],
                    'september_sales_target' => $fields["monthly_sales_target"],
                    'october_sales_target' => $fields["monthly_sales_target"],
                    'november_sales_target' => $fields["monthly_sales_target"],
                    'december_sales_target' => $fields["monthly_sales_target"],     
                    'ref_product_groups_code' => $fields["ref_product_groups_code"],
                    'added_by' => $fields["added_by"],
                    'modified_by' => $fields["modified_by"],
                ]);
            }

            
            return response([
                'message' => 'Target sales added successfully',
                'result' => true,
                'status' => 'success',
                'title' => 'Success',
            ], 200); 

    }

    /**
     * Display the specified resource.
     *
     * @param  \App\Models\SalesDailyOutSettingsAnnualQuotaClientGroups  $salesDailyOutSettingsAnnualQuotaClientGroups
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
                return Crypt::encryptString($this->do_show($id));

    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Models\SalesDailyOutSettingsAnnualQuotaClientGroups  $salesDailyOutSettingsAnnualQuotaClientGroups
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, $id)
    {
        $fields = $request->validate([
            'year_sales_target' => 'required',
            'ref_product_groups_code' => [
                'required',
                Rule::unique('sales_daily_out_settings_annual_quota_client_groups')->ignore($id, 'code'),
            ],
            'annual_sales_target' => 'required',
            'january_sales_target' => 'required',
            'february_sales_target' => 'required',
            'february_sales_target' => 'required',
            'march_sales_target' => 'required',
            'april_sales_target' => 'required',
            'may_sales_target' => 'required',
            'june_sales_target' => 'required',
            'july_sales_target' => 'required',
            'august_sales_target' => 'required',
            'september_sales_target' => 'required',
            'october_sales_target' => 'required',
            'november_sales_target' => 'required',
            'december_sales_target' => 'required',
            'added_by' => 'required',
            'modified_by' => 'required',
        ]);
        
        $updateFields = Arr::except($fields, ['added_by']);

        SalesDailyOutSettingsAnnualQuotaClientGroups::where('code', $id)
            ->firstOrFail()
            ->update($updateFields);

        $response = [
            'message' => '',
            'result' => true,
            'icon' => 'success',
            'title' => 'Successfully Updated!',
        ];
        return response($response, 200);
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Models\SalesDailyOutSettingsAnnualQuotaClientGroups  $salesDailyOutSettingsAnnualQuotaClientGroups
     * @return \Illuminate\Http\Response
     */
    public function destroy(SalesDailyOutSettingsAnnualQuotaClientGroups $salesDailyOutSettingsAnnualQuotaClientGroups)
    {
        //
    }

    public function annual_quota_client_groups(Request $request)
    {
            //select query from the url parameter
        $page = $request->query('page');
        $limit = $request->query('limit');
        $query = $request->query('q');
        $filter = $request->query('f');
        $user_id = $request->query('uid');
        
        if(empty($user_id)){
            $response = [
                'result' => false,
                'status' => 'warning',
                'title' => 'Oppss!',
                'message' => "Invalid request. Please login." ,
            ];
            return response($response,200);
        }
        $queryBuilder = SalesDailyOutSettingsAnnualQuotaClientGroups::join('sales_daily_out_settings_client_groups', 'sales_daily_out_settings_annual_quota_client_groups.sales_daily_out_settings_client_group_code', '=', 'sales_daily_out_settings_client_groups.code')
        -> join('ref_product_groups', 'sales_daily_out_settings_annual_quota_client_groups.ref_product_groups_code', '=', 'ref_product_groups.code')
        ->select([
            'sales_daily_out_settings_client_groups.description as group_description','sales_daily_out_settings_annual_quota_client_groups.*','ref_product_groups.description as ref_product_groups_description'
        ])
        ->whereNull('sales_daily_out_settings_annual_quota_client_groups.deleted_at');
        if (!empty($filter)) {
                $queryBuilder->where('year_sales_target', $filter);
        }
        if (!empty($query)) {
            $queryBuilder = $queryBuilder->where(function ($queryBuilder) use ($query) {
                    $queryBuilder->where('sales_daily_out_settings_client_groups.description', 'like', '%' . $query . '%');
            });
        } 
 
        $data_list = $queryBuilder->paginate($limit, ['*'], 'page', $page);

        $response = [   
            'dataList' => $data_list,
            'result' => true,
            'title'=>'Success',
            'status'=>'success',
            'message'=> 'Authentication successful.',
        ];
        return Crypt::encryptString(json_encode($response));
    }

    public function do_show($id = null) {
        if (isset($id)) {
            $data = SalesDailyOutSettingsAnnualQuotaClientGroups::where('code', '=', $id)->get();
        } else {
            $data = SalesDailyOutSettingsAnnualQuotaClientGroups::all();
        }
        if ($data->isEmpty()) {
            $data = array();
        }
        return $data;
    }
}
