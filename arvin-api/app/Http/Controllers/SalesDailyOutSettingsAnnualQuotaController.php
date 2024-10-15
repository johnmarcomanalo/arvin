<?php

namespace App\Http\Controllers;

use App\Models\SalesDailyOutSettingsAnnualQuota;
use App\Models\SalesDailyOutTrackers;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;
use Illuminate\Support\Facades\Crypt;
use App\Models\RefProductGroups;

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

        $dates_to_get = $salesDailyOutAnnualSettingsSalesController->get_dates_in_selected_year_without_sundays($fields["year_sales_target"]);


        $data = SalesDailyOutSettingsAnnualQuota::create([
            'code' => $code_annual_quota,
            'subsection_code' =>$fields["subsection_code"],
            'year_sales_target' => $fields["year_sales_target"],
            'annual_sales_target' => $fields["annual_sales_target"],
            'monthly_sales_target' => $fields["monthly_sales_target"],
            'ref_product_groups_code' => $fields["ref_product_groups_code"],
            'date_effectiveness' => $fields["date_effectiveness"],
            'added_by' => $fields["added_by"],
            'modified_by' => $fields["modified_by"],
        ]);

        foreach ($dates_to_get as $value) {
            $code = MainController::generate_code('App\Models\SalesDailyOutTrackers',"code");
            $sales_daily_quota = $salesDailyOutAnnualSettingsSalesController->get_number_of_days_in_a_month_with_out_sunday($value,$fields["monthly_sales_target"]) ;
            SalesDailyOutTrackers::create([
                    'code' => $code,
                    'sales_daily_out_annual_settings_sales_code' => $data["code"],
                    'subsection_code' =>$fields["subsection_code"],
                    'ref_product_groups_description' =>$fields["ref_product_groups_description"],
                    'daily_sales_target_percentage' => -100,
                    'sales_date' => $value,
                    'sales_daily_out' => 0,
                    'sales_daily_qouta' =>  $sales_daily_quota,
                    'sales_daily_target' =>  '-'.$sales_daily_quota,
                    'year_sales_target' => $fields["year_sales_target"],
                    'added_by' => $fields["added_by"],
                    'modified_by' => $fields["modified_by"],
            ]);
        }

        $records = count(DB::select("exec dbo.sp_sales_daily_out_delivery_return_cm ?,?,?",array($fields["ref_product_groups_description"],$fields["year_sales_target"],$fields["sub_section_type"],$data->code)));

        if(!empty($records)){
            $salesDailyOutTrackersController->insert_sap_sales_daily_out($fields["ref_product_groups_description"],$fields["year_sales_target"],$fields["sub_section_type"],$data->code);
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
    public function show(SalesDailyOutSettingsAnnualQuota $salesDailyOutSettingsAnnualQuota)
    {
        //
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
        if (!empty($query)) {
            $salesData = $queryBuilder->where(function ($queryBuilder) use ($query) {
                    $queryBuilder->where('section', 'like', '%' . $query . '%')
                    ->orWhere('subsection', 'like', '%' . $query . '%');
            })->paginate($limit);
        } else {
            $salesData = $queryBuilder->paginate($limit);
        }

        $dataList = $salesData->toArray();
        $dataListCount = $salesData->count();

        $response = [   
            'dataList' => $dataList,
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
        $month = $carbonDate->month;
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
            "monthly_sales_target"=>$annual_monthly_daily_target_sales_data->monthly_sales_target,
            "daily_sales_target"=>$daily_sales_target,
            "sales_daily_out_annual_settings_sales_code"=>$annual_monthly_daily_target_sales_data->code,
            "product_group_unit_of_measure"=>$product_group['uom_description'],
            "product_group_unit_of_measure_type"=>$product_group['uom_type']
        ];

        return Crypt::encryptString(json_encode($response));
    }
}
