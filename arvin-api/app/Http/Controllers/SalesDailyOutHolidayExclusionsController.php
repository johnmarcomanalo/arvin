<?php

namespace App\Http\Controllers;

use App\Models\SalesDailyOutHolidayExclusions;
use App\Models\SalesDailyOutSettingsAnnualQuota;
use App\Models\SalesDailyOutTrackers;
use App\Models\SalesDailyOutHolidayExclusionLogs;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;
use Illuminate\Support\Facades\Crypt;

class SalesDailyOutHolidayExclusionsController extends Controller
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
    public function store(Request $request){
        $fields = $request->validate([
            'description' => 'required',
            'selected_date' => 'required',
            'year_selected_date' => 'required',
            'subsection_code' => 'required',
            'added_by' => 'required',
            'modified_by' => 'required',
        ]);
        $all_sales_daily_out = [];
        $selected_date = Carbon::parse($fields['selected_date']);
        $month = Carbon::parse($fields['selected_date'])->month;
        $salesDailyOutTrackersController = new SalesDailyOutTrackersController();

        $annual_quotas = SalesDailyOutSettingsAnnualQuota::where('year_sales_target',$fields['year_selected_date'])
        ->join('ref_product_groups', 'sales_daily_out_settings_annual_quotas.ref_product_groups_code', '=', 'ref_product_groups.code')
            ->where('subsection_code',$fields['subsection_code'])
            ->whereNull('sales_daily_out_settings_annual_quotas.deleted_at')
            ->select([
           'sales_daily_out_settings_annual_quotas.*','ref_product_groups.description as ref_product_groups_description'
        ])->get();
        
        foreach ($annual_quotas as $value) {
            $sales_daily_out = SalesDailyOutTrackers::freshFromSalesDailyOutTrackers($fields,$value,$month)->get();
            $deleted = null;
            foreach ($sales_daily_out as $tracker) {
                if (Carbon::parse($tracker->sales_date)->format('Y-m-d') == Carbon::parse($selected_date)->format('Y-m-d')) {
                    // Update the deleted_at column for the matching date
                    $deleted = SalesDailyOutTrackers::where('id', $tracker->id)
                        ->first();
                    SalesDailyOutTrackers::where('id', $tracker->id)
                        ->update([
                            'deleted_at' => now(),
                            'modified_by' => $fields['modified_by'],
                        ]);
                }
            }
            
            $sales_daily_out_new = SalesDailyOutTrackers::freshFromSalesDailyOutTrackers($fields,$value,$month)->get();

            $all_sales_daily_out[] = [
                'sales_daily_out'=>$sales_daily_out,
                'deleted'=>$deleted,
                // 'sales_daily_out_new'=>$sales_daily_out_new,
                'month'=>$month,
                'sales_daily_qouta'=>$value['monthly_sales_target'] / count($sales_daily_out_new),
                'count'=>count($sales_daily_out_new),
                'sales_daily_out_settings_annual_quotas_code'=>$value['code'],
                'product_description'=>$value['ref_product_groups_description']
            ];
        }


        foreach ($all_sales_daily_out as $value) { // Use reference to modify the outer array
            $toUpdateDate = null;

            foreach ($value['sales_daily_out'] as $index => $sales_daily_out_value) { // Use reference here as well
                // Check if the sales date matches the deleted date
                if ($sales_daily_out_value['sales_date'] === $deleted['sales_date']) {
                    // Determine the index to update based on December 31 condition
                    $toUpdateDate = ($selected_date->month === 12 && $selected_date->day === 31) ? $index - 1 : $index + 1;
                }

                // Update the corresponding sales data if the index matches and is valid
                if ($toUpdateDate !== null && isset($value['sales_daily_out'][$toUpdateDate])) {
                    return  $value['sales_daily_out'][$toUpdateDate]['sales_daily_out'].'-'.$deleted['sales_daily_out']."=".$value['sales_daily_out'][$toUpdateDate]['sales_daily_out'] += $deleted['sales_daily_out'];
                    $value['sales_daily_out'][$toUpdateDate]['sales_daily_out'] += $deleted['sales_daily_out'];
                }
            }

            foreach ($value['sales_daily_out'] as $sales_daily_out_value) { // Use reference here as well
                $computation = $salesDailyOutTrackersController->get_status_daily_target_and_percentage_daily_target_by_daily_out(
                    $sales_daily_out_value['sales_daily_out'],
                    $value['sales_daily_qouta']
                );
                $sales_daily_out_value['sales_daily_qouta'] = $value['sales_daily_qouta'];
                $sales_daily_out_value['sales_daily_target'] = $computation["status_daily_target"];
                $sales_daily_out_value['daily_sales_target_percentage'] = $computation["percentage_daily_target"];
                $sales_daily_out_value['modified_by'] = $fields['modified_by'];
            }
        }

        
        return  $all_sales_daily_out; 
    

        // return $all_sales_daily_out_plucked;
        // foreach ($all_sales_daily_out_plucked as $value) {
           
        // }

        
        // return response([
        //     'message' => 'Target sales added successfully',
        //     'result' => true,
        //     'status' => 'success',
        //     'title' => 'Success',
        //      'all_sales_daily_out' => $all_sales_daily_out, // Return the updated array
        // ], 200); 
    }

    /**
     * Display the specified resource.
     *
     * @param  \App\Models\SalesDailyOutHolidayExclusions  $salesDailyOutHolidayExclusions
     * @return \Illuminate\Http\Response
     */
    public function show(SalesDailyOutHolidayExclusions $salesDailyOutHolidayExclusions)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Models\SalesDailyOutHolidayExclusions  $salesDailyOutHolidayExclusions
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, SalesDailyOutHolidayExclusions $salesDailyOutHolidayExclusions)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Models\SalesDailyOutHolidayExclusions  $salesDailyOutHolidayExclusions
     * @return \Illuminate\Http\Response
     */
    public function destroy(SalesDailyOutHolidayExclusions $salesDailyOutHolidayExclusions)
    {
        //
    }
    public function move_sales_per_day(Request $request){
        $fields = $request->validate([
            'sales_daily_out_annual_settings_sales_code' => 'required',
            'subsection_code' => 'required',
            'ref_product_groups_description' => 'required',
            'year_sales_target' => 'required',

            'move_from_sales_daily_qouta' => 'required',
            'move_from_sales_date' => 'required',
            'move_from_sales_daily_out' => 'required',
            'move_from_sales_daily_target' => 'required',
            'move_from_daily_sales_target_percentage' => 'required',

            'move_to_sales_daily_qouta' => 'required',
            'move_to_sales_date' => 'required',
            'move_to_sales_daily_out' => 'required',
            'move_to_sales_daily_target' => 'required',
            'move_to_daily_sales_target_percentage' => 'required',

            'updated_sales_daily_out' => 'required',
            'updated_sales_daily_target' => 'required',
            'updated_daily_sales_target_percentage' => 'required',

            'added_by' => 'required',
            'modified_by' => 'required',
        ]);
        $salesDailyOutTrackersController = new SalesDailyOutTrackersController();

        // if($fields['updated_sales_daily_out'] <= $fields['move_to_sales_daily_out']){
        //     $response = [
        //             'message' => 'There is inputed out is less than or equals the current is deleted - '.$fields['move_to_sales_date'] ,
        //             'result' => false,
        //             'status' => 'warning',
        //             'title' => 'Oppss!',
        //     ];
        //     return response($response,409);
        // }
        
        $check_record_count = SalesDailyOutTrackers::where('sales_daily_out_annual_settings_sales_code', $fields['sales_daily_out_annual_settings_sales_code'])
                            ->where('subsection_code', $fields['subsection_code'])
                            ->where('ref_product_groups_description', $fields['ref_product_groups_description'])   
                            ->where('year_sales_target', $fields['year_sales_target'])
                            ->where('sales_date', $fields['move_to_sales_date'])
                            ->whereNull('deleted_at')
                            ->count();

        if ($check_record_count = 0) {
            $response = [
                    'message' => 'There is date is deleted - '.$fields['move_to_sales_date'] ,
                    'result' => false,
                    'status' => 'warning',
                    'title' => 'Oppss!',
            ];
            return response($response,409);
        }

        $log_code = MainController::generate_code('App\Models\SalesDailyOutHolidayExclusionLogs',"code");
    
        SalesDailyOutHolidayExclusionLogs::create([
            'code' => $log_code,
            'sales_daily_out_annual_settings_sales_code' =>$fields["sales_daily_out_annual_settings_sales_code"],
            'subsection_code' =>$fields["subsection_code"],
            'ref_product_groups_description' =>$fields["ref_product_groups_description"],
            'year_sales_target' =>$fields["year_sales_target"],
            
            'move_from_sales_daily_qouta' =>$fields["move_from_sales_daily_qouta"],
            'move_from_sales_date' =>$fields["move_from_sales_date"],
            'move_from_sales_daily_out' =>$fields["move_from_sales_daily_out"],
            'move_from_sales_daily_target' =>$fields["move_from_sales_daily_target"],
            'move_from_daily_sales_target_percentage' =>$fields["move_from_daily_sales_target_percentage"],

            'move_to_sales_daily_qouta' =>$fields["move_to_sales_daily_qouta"],
            'move_to_sales_date' =>$fields["move_to_sales_date"],
            'move_to_sales_daily_out' =>$fields["move_to_sales_daily_out"],
            'move_to_sales_daily_target' =>$fields["move_to_sales_daily_target"],
            'move_to_daily_sales_target_percentage' =>$fields["move_to_daily_sales_target_percentage"],

            'updated_sales_daily_out' =>$fields["updated_sales_daily_out"],
            'updated_sales_daily_target' =>$fields["updated_sales_daily_target"],
            'updated_daily_sales_target_percentage' =>$fields["updated_daily_sales_target_percentage"],

            'added_by' => $fields["added_by"],
            'modified_by' => $fields["modified_by"],
        ]);

        $move_from_date_details = SalesDailyOutTrackers::where('sales_daily_out_annual_settings_sales_code', $fields['sales_daily_out_annual_settings_sales_code'])
                            ->where('subsection_code', $fields['subsection_code'])
                            ->where('ref_product_groups_description', $fields['ref_product_groups_description'])   
                            ->where('year_sales_target', $fields['year_sales_target'])
                            ->where('sales_date', $fields['move_from_sales_date'])
                            ->whereNull('deleted_at')
                            ->first();
        
        $move_to_date_details = SalesDailyOutTrackers::where('sales_daily_out_annual_settings_sales_code', $fields['sales_daily_out_annual_settings_sales_code'])
                            ->where('subsection_code', $fields['subsection_code'])
                            ->where('ref_product_groups_description', $fields['ref_product_groups_description'])   
                            ->where('year_sales_target', $fields['year_sales_target'])
                            ->where('sales_date', $fields['move_to_sales_date'])
                            ->whereNull('deleted_at')
                            ->first();

        $move_to_and_updated_out_diffence = $fields['updated_sales_daily_out'] - $fields['move_to_sales_daily_out'];
        $move_from_sales_daily_qouta = $fields['move_from_sales_daily_qouta'];
        $balance_move_from_sales_daily_out = $fields['move_from_sales_daily_out'];
        $balance_move_from_sales_daily_target = $fields['move_from_sales_daily_target'];
        $balance_move_from_daily_sales_target_percentage = $fields['move_from_daily_sales_target_percentage'];
        $move_from_data_to_delete = false;

        if ($move_to_and_updated_out_diffence >= $balance_move_from_sales_daily_out  ) {
            $balance_move_from_sales_daily_out = 0.0000;
            $balance_move_from_sales_daily_target = '-'.$fields['move_from_sales_daily_qouta'];
            $balance_move_from_daily_sales_target_percentage = -100;
            $move_from_data_to_delete = true;

        }

        if($move_to_and_updated_out_diffence < $balance_move_from_sales_daily_out){
            $balance_move_from_sales_daily_out = $balance_move_from_sales_daily_out - $move_to_and_updated_out_diffence;
            $move_from_quota_computation = $salesDailyOutTrackersController->get_status_daily_target_and_percentage_daily_target_by_daily_out(
                    $balance_move_from_sales_daily_out,
                    $move_from_sales_daily_qouta
            );
            $balance_move_from_sales_daily_target = $move_from_quota_computation["status_daily_target"];
            $balance_move_from_daily_sales_target_percentage = $move_from_quota_computation["percentage_daily_target"];
        }
        
        $move_from_date_update_details = [
            'sales_daily_out' => $balance_move_from_sales_daily_out,
            'sales_daily_target' => $balance_move_from_sales_daily_target,
            'daily_sales_target_percentage' => $balance_move_from_daily_sales_target_percentage,
            'modified_by' => $fields['modified_by'],
        ];

        // if($fields["move_from_sales_date"] !== $fields["move_to_sales_date"]){
        //     if ($move_from_data_to_delete) {
        //         $move_from_date_update_details['deleted_at'] = now();
        //     }   
        // }
        

        $move_from_date_details->update($move_from_date_update_details);

        $move_to_date_details->update([
            'sales_daily_out' => $fields['updated_sales_daily_out'],
            'sales_daily_target' => $fields['updated_sales_daily_target'],
            'daily_sales_target_percentage' => $fields['updated_daily_sales_target_percentage'],
            'modified_by' => $fields['modified_by'],
        ]);

        $response = [
            'message' => '',
            'result' => true,
            'icon' => 'success',
            'title' => 'Successfully Updated!',
        ];
        return response($response, 200);


    }
 
}
