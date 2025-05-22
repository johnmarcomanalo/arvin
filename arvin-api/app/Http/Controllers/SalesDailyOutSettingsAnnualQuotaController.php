<?php

namespace App\Http\Controllers;

use App\Models\SalesDailyOutSettingsAnnualQuota;
use App\Models\SalesDailyOutTrackers;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;
use Illuminate\Support\Facades\Crypt;
use App\Models\RefProductGroups;
use App\Models\SalesDailyOutSettingsAnnualQuotaLogs;
use App\Models\RefHolidays;

class SalesDailyOutSettingsAnnualQuotaController extends Controller
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
        $salesDailyOutTrackersController = new SalesDailyOutTrackersController();

        $fields = $request->validate([
            'subsection_code' => 'required',
            'subsection' => 'required',
            'sub_section_type' => 'required',
            'year_sales_target' => 'required',
            'annual_sales_target' => 'required',
            'monthly_sales_target' => 'required',
            'ref_product_groups_code' => 'required',
            'ref_product_groups_description' => 'required',
            'date_effectiveness' => 'required',
            'added_by' => 'required',
            'modified_by' => 'required',
        ]);

        // check quota if existing
        $check_quota = SalesDailyOutSettingsAnnualQuota::where('year_sales_target',$fields['year_sales_target'])
            ->where('subsection_code',$fields['subsection_code'])
            ->where('annual_sales_target',$fields['annual_sales_target'])
            ->where('monthly_sales_target',$fields['monthly_sales_target'])
            ->where('ref_product_groups_code',$fields['ref_product_groups_code'])
            ->where('date_effectiveness',$fields['date_effectiveness'])
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
        $code_annual_quota = MainController::generate_code('App\Models\SalesDailyOutSettingsAnnualQuota',"code");

        $data = SalesDailyOutSettingsAnnualQuota::create([
            'code' => $code_annual_quota,
            'subsection_code' =>$fields["subsection_code"],
            'year_sales_target' => $fields["year_sales_target"],
            'annual_sales_target' => $fields["annual_sales_target"],
            'monthly_sales_target' => $fields["monthly_sales_target"],
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
            'date_effectiveness' => $fields["date_effectiveness"],
            'added_by' => $fields["added_by"],
            'modified_by' => $fields["modified_by"],
        ]);

        $dates_to_get = MainController::get_dates_in_selected_year($fields["year_sales_target"]);

        $holidays = RefHolidays::whereYear('holiday_date', $fields["year_sales_target"])
            ->where(function ($query) use ($fields) {
                $query->where('type', 'REGULAR')
                    ->orWhere(function ($q) use ($fields) {
                        $q->where('TYPE', 'SPECIAL')
                            ->where('subsection_code', $fields["subsection_code"]); // Filter by subsection
                    });
            })
            ->pluck('holiday_date')
            ->map(fn($date) => Carbon::parse($date)->toDateString())
            ->toArray();
        $activeDaysPerMonth = [];


        foreach ($dates_to_get as $date) {
            $carbonDate = Carbon::parse($date);
            $month = $carbonDate->month;
            $dayOfWeek = $carbonDate->dayOfWeek; // 0 (Sunday) to 6 (Saturday)
            
            if ($dayOfWeek !== 0 && !in_array($date, $holidays)) { // Not Sunday and not a holiday
                $activeDaysPerMonth[$month] = ($activeDaysPerMonth[$month] ?? 0) + 1;
            }
        }

        foreach ($dates_to_get as $value) {
            $code = MainController::generate_code('App\Models\SalesDailyOutTrackers', "code");

            $carbonDate = Carbon::parse($value);
            $month = $carbonDate->month;
            $dayOfWeek = $carbonDate->dayOfWeek; // 0 (Sunday) to 6 (Saturday)

            // Determine if the date should be marked as deleted
            $deleted_at = null;
            if ($dayOfWeek === 0 || in_array($value, $holidays)) { // If it's Sunday or a holiday
                $deleted_at = now();
            }

            // Compute daily quota dynamically
            $activeDays = $activeDaysPerMonth[$month] ?? 1; // Avoid division by zero
            $sales_daily_quota = $fields["monthly_sales_target"] / $activeDays;

            SalesDailyOutTrackers::create([
                'code' => $code,
                'sales_daily_out_annual_settings_sales_code' => $data["code"],
                'subsection_code' => $fields["subsection_code"],
                'ref_product_groups_description' => $fields["ref_product_groups_description"],
                'daily_sales_target_percentage' => -100,
                'sales_date' => $value,
                'sales_daily_out' => 0,
                'sales_daily_qouta' => $sales_daily_quota,
                'sales_daily_target' => '-' . $sales_daily_quota,
                'year_sales_target' => $fields["year_sales_target"],
                'deleted_at' => $deleted_at, // Apply deleted_at dynamically
                'added_by' => $fields["added_by"],
                'modified_by' => $fields["modified_by"],
            ]);
        }
        
        $records = DB::select("SET NOCOUNT ON exec dbo.sp_sales_daily_out_delivery_return_cm_v3 ?,?,?",array($fields["ref_product_groups_description"],$fields["year_sales_target"],$fields["sub_section_type"]));

        if(!empty($records)){
            $salesDailyOutTrackersController->insert_sap_sales_daily_out($fields["ref_product_groups_description"],$fields["year_sales_target"],$fields["sub_section_type"],$data->code,$records);
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
     * @param  \App\Models\SalesDailyOutSettingsAnnualQuota  $salesDailyOutSettingsAnnualQuota
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
     * @param  \App\Models\SalesDailyOutSettingsAnnualQuota  $salesDailyOutSettingsAnnualQuota
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, SalesDailyOutSettingsAnnualQuota $salesDailyOutSettingsAnnualQuota)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Models\SalesDailyOutSettingsAnnualQuota  $salesDailyOutSettingsAnnualQuota
     * @return \Illuminate\Http\Response
     */
    public function destroy(SalesDailyOutSettingsAnnualQuota $salesDailyOutSettingsAnnualQuota)
    {
        //
    }

    public function get_sales_annual_settings(Request $request)
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
        $queryBuilder = SalesDailyOutSettingsAnnualQuota::join('ref_sub_sections', 'sales_daily_out_settings_annual_quotas.subsection_code', '=', 'ref_sub_sections.code')
        -> join('ref_product_groups', 'sales_daily_out_settings_annual_quotas.ref_product_groups_code', '=', 'ref_product_groups.code')
        ->select([
            'ref_sub_sections.description as sub_section','sales_daily_out_settings_annual_quotas.*','ref_product_groups.description as ref_product_groups_description'
        ])
        ->whereNull('sales_daily_out_settings_annual_quotas.deleted_at');
        if (!empty($filter)) {
                $queryBuilder->where('year_sales_target', $filter);
        }
        // if (!empty($query)) {
        //     $queryBuilder = $queryBuilder->where(function ($queryBuilder) use ($query) {
        //             $queryBuilder->where('ref_sub_sections.description', 'like', '%' . $query . '%');
        //     });
        // } 

        if (!empty($query)) {
            $queryBuilder = $queryBuilder->where(function ($queryBuilder) use ($query) {
                    $queryBuilder->where('ref_product_groups.description', 'like', '%' . $query . '%');
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


    public function get_annual_monthly_daily_target_sales_by_section_subsection_product_group($id,$date,$pg){
        $annual_settings_sales_controller = new SalesDailyOutAnnualSettingsSalesController();
        $carbonDate = Carbon::parse($date);
        $month = strtolower($carbonDate->format('F')).'_sales_target';
        $year = $carbonDate->year;

        $product_group = RefProductGroups::join('ref_unit_of_measurements','ref_product_groups.ref_unit_of_measurements_code','=','ref_unit_of_measurements.code')
        ->where('ref_product_groups.description',$pg)
        ->first(["ref_product_groups.*","ref_unit_of_measurements.description as uom_description","ref_unit_of_measurements.type as uom_type"]);
        if(empty($product_group)){
            $response = [
                    'message' => "No product group found. Please select product first.",
                    'result' => false,
                    'status' => 'warning',
                    'title' => 'Oppss!',
            ];
            return Crypt::encryptString(json_encode($response));
        }
        $count = SalesDailyOutSettingsAnnualQuota::where('subsection_code',$id)->where("year_sales_target",$year)->where("ref_product_groups_code",$product_group['code'])->count();
        if($count == 0){
            $response = [
                    'message' => "No target sale found. Please try other date.",
                    'result' => false,
                    'status' => 'warning',
                    'title' => 'Oppss!',
            ];
            return Crypt::encryptString(json_encode($response));
        }
        $annual_monthly_daily_target_sales_data = SalesDailyOutSettingsAnnualQuota::where('subsection_code',$id)->where("year_sales_target",$year)->where("ref_product_groups_code",$product_group['code'])->first();
        $daily_sales_target = $annual_settings_sales_controller->get_number_of_days_in_a_month_with_out_sunday($date.'-01',$annual_monthly_daily_target_sales_data->monthly_sales_target) ;
        
        $response = [
            "year_sales_target"=>$annual_monthly_daily_target_sales_data->year_sales_target,
            "annual_sales_target"=>$annual_monthly_daily_target_sales_data->annual_sales_target,
            "monthly_sales_target"=>$annual_monthly_daily_target_sales_data->$month,
            "daily_sales_target"=>$daily_sales_target,
            "sales_daily_out_annual_settings_sales_code"=>$annual_monthly_daily_target_sales_data->code,
            "product_group_unit_of_measure"=>$product_group['uom_description'],
            "product_group_unit_of_measure_type"=>$product_group['uom_type']
        ];

        return Crypt::encryptString(json_encode($response));
    }

    public function do_show($id = null) {
        if (isset($id)) {
            $data = SalesDailyOutSettingsAnnualQuota::join('ref_sub_sections', 'sales_daily_out_settings_annual_quotas.subsection_code', '=', 'ref_sub_sections.code')
        -> join('ref_product_groups', 'sales_daily_out_settings_annual_quotas.ref_product_groups_code', '=', 'ref_product_groups.code')
        ->select([
            'ref_sub_sections.description as sub_section','sales_daily_out_settings_annual_quotas.*','ref_product_groups.description as ref_product_groups_description'
        ])
        ->where('sales_daily_out_settings_annual_quotas.code', $id)->first();
        } else {
            $data = SalesDailyOutSettingsAnnualQuota::all();
        }

        if (empty($data)) {
            $data = array();
        }

        return $data;
    }

    public function update_quota(Request $request) {
        $fields = $request->validate([
            'code' => 'required',
            'month' => 'required',
            'year_sales_target' => 'required',
            'month_description' => 'required',
            'previous_monthly_sales_target' => 'required',
            'monthly_sales_target' => 'required',
            'added_by' => 'required',
            'modified_by' => 'required',
        ]);
        
        $monthNumber = Carbon::createFromFormat('F', $fields["month_description"])->month;
        $month =  Carbon::create($fields["year_sales_target"], $monthNumber, 1);
        $log_code = MainController::generate_code('App\Models\SalesDailyOutSettingsAnnualQuotaLogs',"code");
        $salesDailyOutTrackersController = new SalesDailyOutTrackersController();
        $updateColumn = $fields['month'];

        SalesDailyOutSettingsAnnualQuotaLogs::create([
            'code' => $log_code,
            'sales_daily_out_annual_settings_sales_code'=> $fields["code"],
            'month' => $month,
            'previous_monthly_sales_target' => $fields["previous_monthly_sales_target"],
            'monthly_sales_target' => $fields["monthly_sales_target"],
            'added_by' => $fields["added_by"],
            'modified_by' => $fields["modified_by"],
        ]);

        SalesDailyOutSettingsAnnualQuota::where('code', $fields['code'])->update(
            [
               $updateColumn => $fields["monthly_sales_target"],
            ]
        );
        $annual_quota_data = SalesDailyOutSettingsAnnualQuota::where('code', $fields['code'])->first();

        if ($annual_quota_data) {
            $annual_sales_target = $annual_quota_data->january_sales_target +
                                $annual_quota_data->february_sales_target +
                                $annual_quota_data->march_sales_target +
                                $annual_quota_data->april_sales_target +
                                $annual_quota_data->may_sales_target +
                                $annual_quota_data->june_sales_target +
                                $annual_quota_data->july_sales_target +
                                $annual_quota_data->august_sales_target +
                                $annual_quota_data->september_sales_target +
                                $annual_quota_data->october_sales_target +
                                $annual_quota_data->november_sales_target +
                                $annual_quota_data->december_sales_target;

            $annual_quota_data->update([
                'annual_sales_target' => $annual_sales_target,
                'modified_by' => $fields['modified_by']
            ]);
        } 

        // Fetching data based on conditions
        $datalist = SalesDailyOutTrackers::where('sales_daily_out_annual_settings_sales_code', $fields['code'])
                    ->whereRaw('MONTH(sales_date) = ?', [$monthNumber])
                    ->whereNull('deleted_at')
                    ->get();

        // Ensure we have data to avoid division by zero
        $count_datalist = $datalist->count();

        $new_daily_quota = $fields["monthly_sales_target"] / $count_datalist;

       
        if($count_datalist > 0){
            foreach ($datalist as  $value) {
                $quota_computation = $salesDailyOutTrackersController->get_status_daily_target_and_percentage_daily_target_by_daily_out(
                    $value['sales_daily_out'],
                    $new_daily_quota

                );
                SalesDailyOutTrackers::where('code', $value['code'])->update(
                [
                    'sales_daily_qouta' => $new_daily_quota,
                    'sales_daily_target' => $quota_computation['status_daily_target'],
                    'daily_sales_target_percentage' => $quota_computation['percentage_daily_target'],
                    'modified_by' => $fields['modified_by'],
                ]
                );
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
}
