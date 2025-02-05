<?php

namespace App\Http\Controllers;

use App\Models\SalesDailyOutClientSalesTrackers;
use Illuminate\Http\Request;
use Carbon\Carbon;
use Illuminate\Support\Facades\Crypt;
use Illuminate\Support\Facades\DB;
use App\Models\SalesDailyOutSettingsClientSubGroups;
use SebastianBergmann\LinesOfCode\Counter;

class SalesDailyOutClientSalesTrackersController extends Controller
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
     * @param  \App\Models\SalesDailyOutClientSalesTrackers  $salesDailyOutClientSalesTrackers
     * @return \Illuminate\Http\Response
     */
    public function show(SalesDailyOutClientSalesTrackers $salesDailyOutClientSalesTrackers)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Models\SalesDailyOutClientSalesTrackers  $salesDailyOutClientSalesTrackers
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, SalesDailyOutClientSalesTrackers $salesDailyOutClientSalesTrackers)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Models\SalesDailyOutClientSalesTrackers  $salesDailyOutClientSalesTrackers
     * @return \Illuminate\Http\Response
     */
    public function destroy(SalesDailyOutClientSalesTrackers $salesDailyOutClientSalesTrackers)
    {
        //
    }


    public function get_client_sales_tracker(){
        $selected_year = 2025;
        $selected_month = 1;
        $selected_product = 'INDUSTRIAL SALT';
        $selected_group_code = null;
        $bdo = null;

        $data = SalesDailyOutClientSalesTrackers::where('year_sales_target', $selected_year)
        ->whereMonth('sales_date', $selected_month)
        ->when(isset($selected_product), function ($qry) use ($selected_product) {
                return $qry->where('ref_product_groups_description', $selected_product);
        })
        ->when(isset($bdo), function ($qry) use ($bdo) {
                return $qry->where('bdo', $bdo);
        })
        ->when(isset($selected_group_code), function ($qry) use ($selected_group_code) {
                return $qry->where('sales_daily_out_settings_annual_quota_client_groups_code', $selected_group_code);
        })
        ->whereNull('deleted_at')
        ->get();

        $weekGroups = [];
        foreach ($data as $sale) {
            $groupCode = $sale->sales_daily_out_settings_annual_quota_client_groups_code;
            // Initialize the group if not already set
            if (!isset($weekGroups[$groupCode])) {
                $weekGroups[$groupCode] = [
                    'month_sales_daily_out' => 0,
                    'month_sales_daily_qouta' => 0,
                    'sales_daily_out_settings_annual_quota_client_groups_code' => $groupCode,
                    'sales_daily_out_settings_client_groups_description' => $sale->sales_daily_out_settings_client_groups_description,
                    '1-7' => 0,
                    '8-14' => 0,
                    '15-21' => 0,
                    '22-30/31' => 0,
                ];
            }
            $mtd_date_selected_month = $this->get_mtd($selected_year, $selected_month,$bdo,$selected_product,$groupCode);
            $ytd_date_selected_month = $this->get_ytd($selected_year, $selected_month,$bdo,$selected_product,$groupCode);

            // Increment totals
            $weekGroups[$groupCode]['month_sales_daily_out'] += $sale->sales_daily_out;
            $weekGroups[$groupCode]['month_sales_daily_qouta'] += $sale->sales_daily_qouta;
            $weekGroups[$groupCode]['sales_daily_qouta'] = $sale->sales_daily_qouta;
            $weekGroups[$groupCode]['mtd'] = $mtd_date_selected_month;
            $weekGroups[$groupCode]['ytd'] = $ytd_date_selected_month;
            // Determine the week range
            $day = (int) date('j', strtotime($sale->sales_date));

            if ($day >= 1 && $day <= 7) {
                $weekGroups[$groupCode]['1-7'] += $sale->sales_daily_out;
            } elseif ($day >= 8 && $day <= 14) {
                $weekGroups[$groupCode]['8-14'] += $sale->sales_daily_out;
            } elseif ($day >= 15 && $day <= 21) {
                $weekGroups[$groupCode]['15-21'] += $sale->sales_daily_out;
            } else {
                $weekGroups[$groupCode]['22-30/31'] += $sale->sales_daily_out;
            }

            
        }

        return response()->json(array_values($weekGroups));
    }


    public function get_mtd($selected_year, $selected_month,$bdo,$selected_product,$groupCode){
            $mtd_total_daily_qouta_amount = 0;
            $mtd_total_daily_out_amount = 0;
            $mtd_total_status_daily_target = 0;
            $mtd_final_percentage = 0;

            $firstDayOfMonth = Carbon::createFromDate($selected_year, $selected_month)->startOfMonth();
            $lastDayOfMonth = Carbon::createFromDate($selected_year, $selected_month)->endOfMonth();

            $currentDateTime =  MainController::formatSingleDigitMonthOnly(date('Y-m-d'));
            $LastMonthDate =  MainController::formatSingleDigitMonthOnly($lastDayOfMonth);
            $LastOrCurrentDateOfTheMonth = $lastDayOfMonth;
            if($currentDateTime == $LastMonthDate){
                $LastOrCurrentDateOfTheMonth = Carbon::now();
            }
            $mtd_data_list = SalesDailyOutClientSalesTrackers::where('year_sales_target',$selected_year)
                ->when(isset($selected_product), function ($qry) use ($selected_product) {
                    return $qry->where('ref_product_groups_description', $selected_product);
                })
                ->when(isset($bdo), function ($qry) use ($bdo) {
                    return $qry->where('bdo', $bdo);
                })
                ->when(isset($groupCode), function ($qry) use ($groupCode) {
                    return $qry->where('sales_daily_out_settings_annual_quota_client_groups_code', $groupCode);
                })
                ->where('ref_product_groups_description',$selected_product)
                ->whereDate('sales_date','>=', $firstDayOfMonth)
                ->whereDate('sales_date','<=',$LastOrCurrentDateOfTheMonth)
                ->whereNull('deleted_at')
                ->get();
            foreach ($mtd_data_list as $value) {
                $salesDailyQuota = (float)$value["sales_daily_qouta"];
                $salesDailyOut = (float)$value["sales_daily_out"];
                $salesDailyTarget = (float)$value["sales_daily_target"];

                if (!is_nan($salesDailyQuota)) {
                $mtd_total_daily_qouta_amount += $salesDailyQuota;
                }
                
                if (!is_nan($salesDailyOut)) {
                $mtd_total_daily_out_amount += $salesDailyOut;
                }

                 if (!is_nan($salesDailyOut)) {
                $mtd_total_status_daily_target += $salesDailyTarget;
                }
            }
            if($mtd_total_daily_qouta_amount > 0){
                $mtd_final_percentage = (($mtd_total_daily_out_amount / $mtd_total_daily_qouta_amount) - 1) * 100; 
            }

            return $reponse = [
               'mtd_total_daily_qouta_amount' => $mtd_total_daily_qouta_amount,
               'mtd_total_daily_out_amount' => $mtd_total_daily_out_amount,
               'mtd_total_status_daily_target' => $mtd_total_status_daily_target,
               'mtd_final_percentage' => $mtd_final_percentage,
            ];
    }

    public function get_ytd($selected_year, $selected_month,$bdo,$selected_product,$groupCode){
            $ytd_total_daily_qouta_amount = 0;
            $ytd_total_daily_out_amount = 0;
            $ytd_total_status_daily_target = 0;
            $ytd_final_percentage = 0;

            $januaryFirst = Carbon::create($selected_year, 1, 1)->startOfDay();
            $lastDayOfMonth = Carbon::createFromDate($selected_year, $selected_month)->endOfMonth();

            $currentDateTime =  MainController::formatSingleDigitMonthOnly(date('Y-m-d'));
            $LastMonthDate =  MainController::formatSingleDigitMonthOnly($lastDayOfMonth);
            $LastOrCurrentDateOfTheMonth = $lastDayOfMonth;
            if($currentDateTime == $LastMonthDate){
                $LastOrCurrentDateOfTheMonth = Carbon::now();
            }
            $ytd_data_list = SalesDailyOutClientSalesTrackers::where('year_sales_target',$selected_year)
                ->when(isset($selected_product), function ($qry) use ($selected_product) {
                    return $qry->where('ref_product_groups_description', $selected_product);
                })
                ->when(isset($bdo), function ($qry) use ($bdo) {
                    return $qry->where('bdo', $bdo);
                })
                ->when(isset($groupCode), function ($qry) use ($groupCode) {
                    return $qry->where('sales_daily_out_settings_annual_quota_client_groups_code', $groupCode);
                })
                ->where('ref_product_groups_description',$selected_product)
                ->whereDate('sales_date','>=', $januaryFirst)
                ->whereDate('sales_date','<=',$LastOrCurrentDateOfTheMonth)
                ->whereNull('deleted_at')
                ->get();
            foreach ($ytd_data_list as $value) {
                $salesDailyQuota = (float)$value["sales_daily_qouta"];
                $salesDailyOut = (float)$value["sales_daily_out"];
                $salesDailyTarget = (float)$value["sales_daily_target"];

                if (!is_nan($salesDailyQuota)) {
                $ytd_total_daily_qouta_amount += $salesDailyQuota;
                }
                
                if (!is_nan($salesDailyOut)) {
                $ytd_total_daily_out_amount += $salesDailyOut;
                }

                 if (!is_nan($salesDailyOut)) {
                $ytd_total_status_daily_target += $salesDailyTarget;
                }
            }
            if($ytd_total_daily_qouta_amount > 0){
                $ytd_final_percentage = (($ytd_total_daily_out_amount / $ytd_total_daily_qouta_amount) - 1) * 100; 
            }

            return $reponse = [
               'ytd_total_daily_qouta_amount' => $ytd_total_daily_qouta_amount,
               'ytd_total_daily_out_amount' => $ytd_total_daily_out_amount,
               'ytd_total_status_daily_target' => $ytd_total_status_daily_target,
               'ytd_final_percentage' => $ytd_final_percentage,
            ];
    }


    public function insert_sap_client_sales_tracker($selected_year,$selected_product,$bdo,$selected_group_code){

        $salesDailyOutTrackersController = new SalesDailyOutTrackersController();
        $datalist = SalesDailyOutClientSalesTrackers::where('year_sales_target', $selected_year)
            ->when(isset($selected_product), function ($qry) use ($selected_product) {
                    return $qry->where('ref_product_groups_description', $selected_product);
            })
            ->when(isset($bdo), function ($qry) use ($bdo) {
                    return $qry->where('bdo', $bdo);
            })
            ->when(isset($selected_group_code), function ($qry) use ($selected_group_code) {
                    return $qry->where('sales_daily_out_settings_annual_quota_client_groups_code', $selected_group_code);
            })
            ->whereNull('deleted_at')
            ->get();

        $subgroups = SalesDailyOutSettingsClientSubGroups::where('sales_daily_out_settings_client_groups_code',$selected_group_code)->get();
        $card_codes =  $subgroups->pluck('customer_code')->implode("','") ;

        $records = DB::select("exec dbo.sales_daily_out_delivery_return_cm_client_based_v2 ?,?,?",array($selected_year,"'".$card_codes."'",$selected_product));
        $recordsByDate = [];
        $final_results = [];
        
        foreach ($records as $record) {
            $date = Carbon::parse($record->createdate)->format('Y-m-d');
            $recordsByDate[$date] = $record;
        }

        foreach ($recordsByDate as $date => $record) {
            $results[] = [
                'sales_date' => $record->createdate,
                'sales_daily_out' => $record->QtyInKg,
                'ref_product_groups_description'=> $record->u_groupcategory
            ];
        }

        foreach ($datalist as $value) {
            $sales_daily_qouta = $value['sales_daily_qouta'];
             $sales_date = Carbon::parse($value['sales_date'])->format('Y-m-d');
                foreach ($results as $result) {
                     $result_date = Carbon::parse($result['sales_date'])->format('Y-m-d');
                    if($sales_date == $result_date){
                        $computation = $salesDailyOutTrackersController->get_status_daily_target_and_percentage_daily_target_by_daily_out($result['sales_daily_out'],$sales_daily_qouta);
                        $final_results[] = [
                            'year_sales_target' => $selected_year,
                            'sales_daily_out_settings_annual_quota_client_groups_code' => $selected_group_code,
                            'sales_daily_out' => $result['sales_daily_out'],
                            'ref_product_groups_description' => $result['ref_product_groups_description'],
                            'sales_date' => $result['sales_date'],
                            'sales_daily_target' => $computation['status_daily_target'],
                            'daily_sales_target_percentage' => $computation['percentage_daily_target'],
                            'modified_by' => '1',
                        ]; 
                    }
                }
        }


        $batchSize = 50; // Update 50 records at a time
        $counter = 0;
        foreach ($final_results as $value) {
            DB::table('sales_daily_out_client_sales_trackers')
                ->where('sales_daily_out_settings_annual_quota_client_groups_code', $value['sales_daily_out_settings_annual_quota_client_groups_code'])
                ->where('ref_product_groups_description',  $value['ref_product_groups_description'])
                ->where('sales_date',  $value['sales_date'])
                ->update([
                    'sales_daily_out' => $value['sales_daily_out'],
                    'sales_daily_target' => $value['sales_daily_target'],
                    'daily_sales_target_percentage' => $value['daily_sales_target_percentage'],
                    'modified_by' => $value['modified_by']
                ]);
            $counter++;

            // Add a delay after every 50 updates
            if ($counter % $batchSize == 0) {
                sleep(2); // Add a 2-second delay to avoid overloading the database
            }
        }
    }   
}
