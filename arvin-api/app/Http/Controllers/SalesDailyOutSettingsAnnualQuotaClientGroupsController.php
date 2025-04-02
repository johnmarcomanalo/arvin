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
                
            $card_codes =  $subgroups->pluck('customer_code')->implode("','");
                
            $records = DB::select("exec dbo.sales_daily_out_delivery_return_cm_client_based_v2 ?,?,?",array($fields["year_sales_target"],"'".$card_codes."'",$fields["ref_product_groups_description"]));
                
            if(!empty($records)){
            // if (count($records) > 0) {
                $salesDailyOutClientSalesTrackersController->insert_sap_client_sales_tracker(
                    $fields["year_sales_target"],
                    $code_annual_quota,
                    json_encode($records),
                    $fields["type"],
                    $fields["subsection"]
                );
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
        $fields = $request->validate([
            'sales_daily_out_settings_client_group_code' => 'required',
            'year_sales_target' => 'required',
            'annual_sales_target' => 'required',
            'ref_product_groups_code' => 'required',
            'january_sales_target' => 'required',
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
            'bdo' => 'required',
            'added' => 'required',
            'modified_by' => 'required',
        ]);
        $salesDailyOutClientSalesTrackersController = new SalesDailyOutClientSalesTrackersController();
        
        // $updateFields = Arr::except($fields, ['added_by']);

        // SalesDailyOutSettingsAnnualQuotaClientGroups::where('code', $id)
        //     ->firstOrFail()
        //     ->update($updateFields);
        $update_quota = SalesDailyOutSettingsAnnualQuotaClientGroups::where('code',$id)
            ->first();
        if(empty($update_quota)){
            $response = [
                'result' => false,
                'icon' => 'error',
                'message' => 'Quota does not exists!',
            ];
            return response($response, 404);
        }

        $annual_sales_target = $fields["january_sales_target"] +
                               $fields["february_sales_target"] +
                               $fields["march_sales_target"] +
                               $fields["april_sales_target"] +
                               $fields["may_sales_target"] +
                               $fields["june_sales_target"] +
                               $fields["july_sales_target"] +
                               $fields["august_sales_target"] +
                               $fields["september_sales_target"] +
                               $fields["october_sales_target"] +
                               $fields["november_sales_target"] +
                               $fields["december_sales_target"];

                               
        $check_data_same_value = SalesDailyOutSettingsAnnualQuotaClientGroups::where('sales_daily_out_settings_client_group_code',$fields["sales_daily_out_settings_client_group_code"])
            ->where('year_sales_target',$fields["year_sales_target"])
            ->where('annual_sales_target', $annual_sales_target)
            ->where('ref_product_groups_code',$fields["ref_product_groups_code"])
            ->where('january_sales_target',$fields["january_sales_target"])
            ->where('february_sales_target',$fields["february_sales_target"])
            ->where('march_sales_target',$fields["march_sales_target"])
            ->where('april_sales_target',$fields["april_sales_target"])
            ->where('may_sales_target',$fields["may_sales_target"])
            ->where('june_sales_target',$fields["june_sales_target"])
            ->where('july_sales_target',$fields["july_sales_target"])
            ->where('august_sales_target',$fields["august_sales_target"])
            ->where('september_sales_target',$fields["september_sales_target"])
            ->where('october_sales_target',$fields["october_sales_target"])
            ->where('november_sales_target',$fields["november_sales_target"])
            ->where('december_sales_target',$fields["december_sales_target"])
            // ->where('bdo',$fields["bdo"])
            ->first();


        if(!empty($check_data_same_value)){
            $response = [
                'result' => false,
                'icon' => 'error',
                'message' => 'Details already exists!',
            ];
            return response($response, 404);
        }
        


        $update_quota->update([
            'year_sales_target' => $fields['year_sales_target'],
            'annual_sales_target' => $annual_sales_target,
            'ref_product_groups_code' =>$fields['ref_product_groups_code'],
            'january_sales_target' => $fields["january_sales_target"],
            'february_sales_target' => $fields["february_sales_target"],
            'march_sales_target' => $fields["march_sales_target"],
            'april_sales_target' => $fields["april_sales_target"],
            'may_sales_target' => $fields["may_sales_target"],
            'june_sales_target' => $fields["june_sales_target"],
            'july_sales_target' => $fields["july_sales_target"],
            'august_sales_target' => $fields["august_sales_target"],
            'september_sales_target' => $fields["september_sales_target"],
            'october_sales_target' => $fields["october_sales_target"],
            'november_sales_target' => $fields["november_sales_target"],
            'december_sales_target' => $fields["december_sales_target"],   
            'bdo' => $fields["bdo"],   
            'modified_by' => $fields["modified_by"],   
        ]);


        $datalist = SalesDailyOutClientSalesTrackers::where('sales_daily_out_settings_annual_quota_client_groups_code', $id)
                    ->whereNull('deleted_at')
                    ->get();

        $count_datalist = $datalist->count();

        if ($count_datalist > 0) {
            $year = $fields['year_sales_target']; // Extract the year from request

            // Dynamically get the number of days in each month
            $daysInMonth = [
                'january' => Carbon::create($year, 1)->daysInMonth,
                'february' => Carbon::create($year, 2)->daysInMonth,
                'march' => Carbon::create($year, 3)->daysInMonth,
                'april' => Carbon::create($year, 4)->daysInMonth,
                'may' => Carbon::create($year, 5)->daysInMonth,
                'june' => Carbon::create($year, 6)->daysInMonth,
                'july' => Carbon::create($year, 7)->daysInMonth,
                'august' => Carbon::create($year, 8)->daysInMonth,
                'september' => Carbon::create($year, 9)->daysInMonth,
                'october' => Carbon::create($year, 10)->daysInMonth,
                'november' => Carbon::create($year, 11)->daysInMonth,
                'december' => Carbon::create($year, 12)->daysInMonth,
            ];

            foreach ($daysInMonth as $month => $days) {
                $monthlyTargetField = $month . '_sales_target'; // Field name in request

                if (!isset($fields[$monthlyTargetField])) {
                    continue; // Skip if the month target is not set
                }

                // Compute daily quota for the month
                $new_daily_quota = ($count_datalist > 0) ? $fields[$monthlyTargetField] / $days : 0;

                foreach ($datalist as $value) {
                    $quota_computation = $salesDailyOutClientSalesTrackersController->get_status_daily_target_and_percentage_daily_target_by_daily_out(
                        $value['sales_daily_out'],
                        $new_daily_quota
                    );

                    SalesDailyOutClientSalesTrackers::where('code', $value['code'])->update([
                        'sales_daily_qouta' => $new_daily_quota,
                        'sales_daily_target' => $quota_computation['status_daily_target'],
                        'daily_sales_target_percentage' => $quota_computation['percentage_daily_target'],
                        'modified_by' => $fields['modified_by'],
                    ]);
                }
            }
        }



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
}
