<?php

namespace App\Http\Controllers;

use App\Models\SalesDailyOutSettingsAnnualQuotaClientGroups;
use App\Models\SalesDailyOutSettingsClientGroups;
use App\Models\SalesDailyOutSettingsClientSubGroups;
use App\Models\SalesDailyOutClientSalesTrackers;
use App\Models\RefProductGroups;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Crypt;
use Carbon\Carbon;
use Illuminate\Validation\Rule;
use Illuminate\Support\Arr;
use Illuminate\Support\Facades\Log;

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
        $salesDailyOutClientSalesTrackersController = new SalesDailyOutClientSalesTrackersController();
        $refClientsSalesOutLogsController = new RefClientsSalesOutLogsController();
        $fields = $request->validate([
            'sales_daily_out_settings_client_group_code' => 'required',
            'description' => 'required',
            'subgroup' => 'required',
            'year_sales_target' => 'required',
            'annual_sales_target' => 'required',
            'monthly_sales_target' => 'required',
            'ref_product_groups_code' => 'required',
            'ref_product_groups_description' => 'required',
            'bdo' => 'required',
            'type' => 'required',
            'subsection' => 'required',
            'added_by' => 'required',
            'modified_by' => 'required',
        ]);
        try {
            set_time_limit(300);
            DB::beginTransaction(); // Start the transaction
            $code_annual_quota = MainController::generate_code('App\Models\SalesDailyOutSettingsAnnualQuotaClientGroups',"code");

            // check quota if existing
            $check_quota = SalesDailyOutSettingsAnnualQuotaClientGroups::where('year_sales_target',$fields['year_sales_target'])
                ->where('sales_daily_out_settings_client_group_code',$fields['sales_daily_out_settings_client_group_code'])
                ->where('ref_product_groups_code',$fields['ref_product_groups_code'])
                ->where('type',$fields['type'])
                ->where('subsection',$fields['subsection'])
                ->whereNull('deleted_at')
                ->count();

            if($check_quota > 0){
                DB::rollBack(); // Rollback the transaction
                return response([
                    'message' => 'There is already a existing quota for - : '.$check_quota["description"].' Year : '.$fields['year_sales_target'] ,
                    'result' => false,
                    'status' => 'warning',
                    'title' => 'Oops!',
                ], 409);
            }

            SalesDailyOutSettingsAnnualQuotaClientGroups::create([
                'code' => $code_annual_quota,
                'sales_daily_out_settings_client_group_code' =>$fields["sales_daily_out_settings_client_group_code"],
                'year_sales_target' => $fields["year_sales_target"],
                'ref_product_groups_code' => $fields["ref_product_groups_code"],
                'bdo' => $fields["bdo"],
                'type' => $fields["type"],
                'subsection' => $fields["subsection"],
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
                'added_by' => $fields["added_by"],
                'modified_by' => $fields["modified_by"],
            ]);

            $dates_to_get = MainController::get_dates_in_selected_year($fields["year_sales_target"]);
            foreach ($dates_to_get as $value) {
                    $code = MainController::generate_code('App\Models\SalesDailyOutClientSalesTrackers',"code");
                    $sales_daily_quota = $this->get_quota_day($value,$fields["monthly_sales_target"]) ;
                    SalesDailyOutClientSalesTrackers::create([
                            'code' => $code,
                            'sales_daily_out_settings_annual_quota_client_groups_code' => $code_annual_quota,
                            'sales_daily_out_settings_client_groups_description' => $fields["description"],
                            'ref_product_groups_description' =>$fields["ref_product_groups_description"],
                            'daily_sales_target_percentage' => -100,
                            'sales_date' => $value,
                            'sales_daily_out' => 0,
                            'sales_daily_qouta' =>  $sales_daily_quota,
                            'sales_daily_target' =>  '-'.$sales_daily_quota,
                            'year_sales_target' => $fields["year_sales_target"],
                            'bdo' => $fields["bdo"],
                            'type' => $fields["type"],
                            'subsection' => $fields["subsection"],
                            'added_by' => $fields["added_by"],
                            'modified_by' => $fields["modified_by"],
                    ]);
            }

            $subgroups = SalesDailyOutSettingsClientSubGroups::where('sales_daily_out_settings_client_groups_code',$fields['sales_daily_out_settings_client_group_code'])->get();
                
            $card_codes =  $subgroups->pluck('customer_code')->implode(",");
                
            // $records = DB::select("exec dbo.sales_daily_out_delivery_return_cm_client_based_v2 ?,?,?,?",array($fields["year_sales_target"],"'".$card_codes."'",$fields["ref_product_groups_description"],$fields["subsection"]));
            $records = DB::select("exec dbo.sales_daily_out_delivery_return_cm_client_based_v2 ?,?,?,?",array($fields["year_sales_target"],"".$card_codes."",$fields["ref_product_groups_description"],$fields["subsection"]));
                
            if(!empty($records)){
                $salesDailyOutClientSalesTrackersController->insert_sap_client_sales_tracker(
                    $fields["year_sales_target"],
                    $code_annual_quota,
                    json_encode($records),
                    $fields["type"],
                    $fields["subsection"]
                );

                $refClientsSalesOutLogsController->updateRefClientsSalesOutLogs(json_encode($records));//update logs

            }

            DB::commit();

            return response([
                'message' => 'Target sales added successfully',
                'result' => true,
                'status' => 'success',
                'title' => 'Success',
            ], 200); 
         } catch (\Exception $e) {
            DB::rollBack(); // Rollback transaction on error
            return response([
                'message' => 'An error occurred: ' . $e->getMessage(),
                'result' => false,
                'status' => 'error',
                'title' => 'Error',
            ], 500);
        }
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
        try {
            $months = [
                'january', 'february', 'march', 'april', 'may', 'june',
                'july', 'august', 'september', 'october', 'november', 'december'
            ];
    
            // Build validation rules dynamically
            $rules = [
                'sales_daily_out_settings_client_group_code' => 'required',
                'year_sales_target' => 'required|numeric|min:1',
                'annual_sales_target' => 'required|numeric|min:1',
                'ref_product_groups_code' => 'required',
                'bdo' => 'required',
                'modified_by' => 'required',
            ];
    
            foreach ($months as $month) {
                $rules["{$month}_sales_target"] = 'required|numeric|min:1';
            }
    
            $fields = $request->validate($rules);
            set_time_limit(300);
            DB::beginTransaction();
    
            $salesDailyOutTrackersController = new SalesDailyOutTrackersController();
    
            // Build monthly targets and update fields for DB
            $month_targets = [];
            $monthly_targets_for_update = [];
    
            foreach ($months as $index => $month) {
                $month_targets[$month] = [
                    'position' => $index + 1,
                    'quota' => $fields["{$month}_sales_target"],
                ];
                $monthly_targets_for_update["{$month}_sales_target"] = $fields["{$month}_sales_target"];
            }
    
            // Update the annual quota group
            // SalesDailyOutSettingsAnnualQuotaClientGroups::where('code', $id)->update(array_merge([
            //     'year_sales_target' => $fields['year_sales_target'],
            //     'annual_sales_target' => $fields['annual_sales_target'],
                  //     'modified_by' => $fields['modified_by'],
            // ], $monthly_targets_for_update));
    
            // Compile quota computations (no DB update) //     'ref_product_groups_code' => $fields['ref_product_groups_code'],
            //     'bdo' => $fields['bdo'],
     
            $compiled_data = [];
    
            foreach ($month_targets as $month => $target) {
                $sales_data = SalesDailyOutClientSalesTrackers::where('sales_daily_out_settings_annual_quota_client_groups_code', $id)
                    ->whereRaw('MONTH(sales_date) = ?', [$target['position']])
                    ->get();
    
                $count_sales_data = $sales_data->count();
                if ($count_sales_data === 0) continue;
    
                $new_daily_quota = $target['quota'] / $count_sales_data;
    
                foreach ($sales_data as $entry) {
                    $quota_computation = $salesDailyOutTrackersController
                        ->get_status_daily_target_and_percentage_daily_target_by_daily_out(
                            $entry->sales_daily_out,
                            $new_daily_quota
                        );
    
                     
                }
            }
            return $compiled_data;
            DB::commit();
    
            // Return compiled data if needed
            return response([
                'message' => 'Update simulated successfully.',
                'data' => $compiled_data,
                'result' => true,
                'status' => 'success',
                'title' => 'Updated',
            ], 200);
    
        } catch (\Exception $e) {
            DB::rollBack();
            return response([
                'message' => 'An error occurred: ' . $e->getMessage(),
                'result' => false,
                'status' => 'error',
                'title' => 'Error',
            ], 500);
        }
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
            $data = SalesDailyOutSettingsAnnualQuotaClientGroups::join('ref_product_groups', 'sales_daily_out_settings_annual_quota_client_groups.ref_product_groups_code', '=', 'ref_product_groups.code')
            ->join('sales_daily_out_settings_client_groups','sales_daily_out_settings_annual_quota_client_groups.sales_daily_out_settings_client_group_code','=','sales_daily_out_settings_client_groups.code')
            ->where('sales_daily_out_settings_annual_quota_client_groups.code', '=', $id)
            ->get(['sales_daily_out_settings_annual_quota_client_groups.*','sales_daily_out_settings_client_groups.description','ref_product_groups.description as product_group']);

             $data->transform(function ($item) {
                $subgroupData = SalesDailyOutSettingsClientSubGroups::where('sales_daily_out_settings_client_groups_code', $item->sales_daily_out_settings_client_group_code)
                    ->whereNull('deleted_at')
                    ->get(['code','sales_daily_out_settings_client_groups_code','customer_code','description','type','subsection']);
                $item->subgroup = $subgroupData; // Add the subgroup to the object
                return $item;
            });

        } else {
            $data = SalesDailyOutSettingsAnnualQuotaClientGroups::join('ref_product_groups', 'sales_daily_out_settings_annual_quota_client_groups.ref_product_groups_code', '=', 'ref_product_groups.code')
            ->all();
        }
        if ($data->isEmpty()) {
            $data = array();
        }
        return $data;
    }

    public function get_quota_day($sales_date, $quota) 
    {
        $carbonDate = Carbon::parse($sales_date);
        $month = $carbonDate->month;
        $year = $carbonDate->year;

        // Create a Carbon instance for the first day of the month
        $date = Carbon::create($year, $month, 1);

        // Get the number of days in the month
        $daysInMonth = $date->daysInMonth;

        // Calculate and return the quota per total days in the month (including Sundays)
        return $quota / $daysInMonth;
    }

    public function refresh_annual_group_client_out(Request $request){
        $fields = $request->validate([
            'code' => 'required',
        ]);
        try {
            DB::beginTransaction();

            $salesDailyOutClientSalesTrackersController = new SalesDailyOutClientSalesTrackersController();
            $refClientsSalesOutLogsController = new RefClientsSalesOutLogsController();

            $quota_data = SalesDailyOutSettingsAnnualQuotaClientGroups::
                join('ref_product_groups', 'sales_daily_out_settings_annual_quota_client_groups.ref_product_groups_code', '=', 'ref_product_groups.code')
                ->where('sales_daily_out_settings_annual_quota_client_groups.code',$fields['code'])
                ->first([
                    'sales_daily_out_settings_annual_quota_client_groups.code',
                    'sales_daily_out_settings_annual_quota_client_groups.sales_daily_out_settings_client_group_code',
                    'sales_daily_out_settings_annual_quota_client_groups.year_sales_target',
                    'sales_daily_out_settings_annual_quota_client_groups.type',
                    'sales_daily_out_settings_annual_quota_client_groups.subsection',
                    'ref_product_groups.description as ref_product_groups_description',
                ]);

            if(!empty($quota_data)){
                $subgroups = SalesDailyOutSettingsClientSubGroups::where('sales_daily_out_settings_client_groups_code', $quota_data->sales_daily_out_settings_client_group_code)->get();
                $card_codes =  $subgroups->pluck('customer_code')->implode(",");
                $records = DB::select("exec dbo.sales_daily_out_delivery_return_cm_client_based_v2 ?,?,?,?", [
                    $quota_data->year_sales_target,
                    $card_codes,
                    $quota_data->ref_product_groups_description,
                    $quota_data->subsection
                ]);
            }

            if(!empty($records)){
                DB::statement("EXEC dbo.ResetSalesDailyOutClientSalesTrackers ?", [$fields['code']]);

                $salesDailyOutClientSalesTrackersController->insert_sap_client_sales_tracker(
                    $quota_data->year_sales_target,
                    $fields['code'],
                    json_encode($records),
                    $quota_data->type,
                    $quota_data->subsection,
                );

                $refClientsSalesOutLogsController->updateRefClientsSalesOutLogs(json_encode($records));//update logs
            }

            DB::commit();

            return response([
                'message' => 'Sales updated successfully',
                'result' => true,
                'status' => 'success',
                'title' => 'Success',
            ], 200); 
        } catch (\Exception $e) {
            DB::rollBack(); // Rollback transaction on error
            return response([
                'message' => 'An error occurred: ' . $e->getMessage(),
                'result' => false,
                'status' => 'error',
                'title' => 'Error',
            ], 500);
        }
    }

    public function update_annual_quota_client_group(Request $request){
        $fields = $request->validate([
            'code' => 'required',
            'annual_sales_target' => 'required|numeric|min:1',
            'january_sales_target' => 'required|numeric|min:1',
            'february_sales_target' => 'required|numeric|min:1',
            'march_sales_target' => 'required|numeric|min:1',
            'april_sales_target' => 'required|numeric|min:1',
            'may_sales_target' => 'required|numeric|min:1',
            'june_sales_target' => 'required|numeric|min:1',
            'july_sales_target' => 'required|numeric|min:1',
            'august_sales_target' => 'required|numeric|min:1',
            'september_sales_target' => 'required|numeric|min:1',
            'october_sales_target' => 'required|numeric|min:1',
            'november_sales_target' => 'required|numeric|min:1',
            'december_sales_target' => 'required|numeric|min:1',
        ]);
        try {
            DB::beginTransaction();

            $quota_data = SalesDailyOutSettingsAnnualQuotaClientGroups::where('code',$fields['code'])->first();

            $months = [
                'january', 'february', 'march', 'april', 'may', 'june',
                'july', 'august', 'september', 'october', 'november', 'december'
            ];

            $monthlyTargets = [];
            $annualTotal = 0;

            foreach ($months as $month) {
                $key = "{$month}_sales_target";
                $value = $fields[$key] ?? 0;
                $monthlyTargets[$key] = $value;
                $annualTotal += $value;
            }
            
            $quota_data->update([
                    'annual_sales_target' =>  $annualTotal,
                    'january_sales_target' => $fields['january_sales_target'],
                    'february_sales_target' => $fields['february_sales_target'],
                    'march_sales_target' => $fields['march_sales_target'],
                    'april_sales_target' => $fields['april_sales_target'],
                    'may_sales_target' => $fields['may_sales_target'],
                    'june_sales_target' => $fields['june_sales_target'],
                    'july_sales_target' => $fields['july_sales_target'],
                    'august_sales_target' => $fields['august_sales_target'],
                    'september_sales_target' => $fields['september_sales_target'],
                    'october_sales_target' => $fields['october_sales_target'],
                    'november_sales_target' => $fields['november_sales_target'],
                    'december_sales_target' => $fields['december_sales_target'],
                    'updated_at' => now(),
            ]);



            DB::commit();

            return response([
                'message' => 'Sales updated successfully',
                'result' => true,
                'status' => 'success',
                'title' => 'Success',
            ], 200); 
        } catch (\Exception $e) {
            DB::rollBack(); // Rollback transaction on error
            return response([
                'message' => 'An error occurred: ' . $e->getMessage(),
                'result' => false,
                'status' => 'error',
                'title' => 'Error',
            ], 500);
        }
    }
}
