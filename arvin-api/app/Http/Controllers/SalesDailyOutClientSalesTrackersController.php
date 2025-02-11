<?php

namespace App\Http\Controllers;

use App\Models\SalesDailyOutClientSalesTrackers;
use Illuminate\Http\Request;
use Carbon\Carbon;
use Illuminate\Support\Facades\Crypt;
use Illuminate\Support\Facades\DB;
use App\Models\SalesDailyOutSettingsClientSubGroups;
use App\Models\SalesDailyOutSettingsAnnualQuotaClientGroups;
use App\Models\RefProductGroups;
use App\Models\UsersAccounts;
use App\Models\User;
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


    public function get_client_sales_tracker(Request $request){
        $selected_year = $request->query('y');
        $selected_month = $request->query('m');
        $selected_product = $request->query('p');
        $selected_group_code = $request->query('c');
        $bdo = $request->query('b');

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
            // return $sale;
            $annual_group_code = $sale->sales_daily_out_settings_annual_quota_client_groups_code;
            $groupCode = $sale->sales_daily_out_settings_annual_quota_client_groups_code;
            if (!isset($weekGroups[$annual_group_code])) {
                $weekGroups[$annual_group_code] = [
                    'month_sales_daily_out' => 0,
                    'month_sales_daily_qouta' => 0,
                    'sales_daily_out_settings_annual_quota_client_groups_code' => $annual_group_code,
                    'sales_daily_out_settings_client_groups_description' => $sale->sales_daily_out_settings_client_groups_description,
                    '1-7' => 0,
                    '8-14' => 0,
                    '15-21' => 0,
                    '22-30/31' => 0,
                ];
            }
            // $mtd_date_selected_month = $this->get_mtd($selected_year, $selected_month,$bdo,$selected_product,$groupCode);
            // $ytd_date_selected_month = $this->get_ytd($selected_year, $selected_month,$bdo,$selected_product,$groupCode);
             $data_quota = SalesDailyOutSettingsAnnualQuotaClientGroups::where('code',$annual_group_code)->first();

            if ($data_quota) {
                 $bdo_user_account = UsersAccounts::where('username', $data_quota->bdo)
                    ->select('user_code')
                    ->first();

                if ($bdo_user_account) {
                    $bdo_user = User::where('code', $bdo_user_account->user_code)
                        ->first(DB::raw("UPPER(users.first_name + ' ' + users.last_name) AS full_name"));

                     $weekGroups[$groupCode]['bdo'] = $bdo_user->full_name ?? 'N/A';
                }
            }
            $mtd_date_selected_month = $this->get_mtd($selected_year, $selected_month,$bdo,$selected_product,$annual_group_code);
            $ytd_date_selected_month = $this->get_ytd($selected_year, $selected_month,$bdo,$selected_product,$annual_group_code);

            // Increment totals
            // $weekGroups[$groupCode]['month_sales_daily_out'] += $sale->sales_daily_out;
            // $weekGroups[$groupCode]['month_sales_daily_qouta'] += $sale->sales_daily_qouta;
            // $weekGroups[$groupCode]['sales_daily_qouta'] = $sale->sales_daily_qouta;
            // $weekGroups[$groupCode]['mtd_total_daily_qouta_amount'] = $mtd_date_selected_month['mtd_total_daily_qouta_amount'];
            // $weekGroups[$groupCode]['mtd_total_daily_out_amount'] = $mtd_date_selected_month['mtd_total_daily_out_amount'];
            // $weekGroups[$groupCode]['mtd_total_status_daily_target'] = $mtd_date_selected_month['mtd_total_status_daily_target'];
            // $weekGroups[$groupCode]['mtd_final_percentage'] = $mtd_date_selected_month['mtd_final_percentage'];
            // $weekGroups[$groupCode]['ytd_total_daily_qouta_amount'] = $ytd_date_selected_month['ytd_total_daily_qouta_amount'];
            // $weekGroups[$groupCode]['ytd_total_daily_out_amount'] = $ytd_date_selected_month['ytd_total_daily_out_amount'];
            // $weekGroups[$groupCode]['ytd_total_status_daily_target'] = $ytd_date_selected_month['ytd_total_status_daily_target'];
            // $weekGroups[$groupCode]['ytd_final_percentage'] = $ytd_date_selected_month['ytd_final_percentage'];



            $weekGroups[$annual_group_code]['month_sales_daily_out'] = round($weekGroups[$annual_group_code]['month_sales_daily_out'] + $sale->sales_daily_out, 4);
            $weekGroups[$annual_group_code]['month_sales_daily_qouta'] = round($weekGroups[$annual_group_code]['month_sales_daily_qouta'] + $sale->sales_daily_qouta, 4);
            $weekGroups[$annual_group_code]['sales_daily_qouta'] = round($sale->sales_daily_qouta, 4);
            $weekGroups[$annual_group_code]['mtd_total_daily_qouta_amount'] = round($mtd_date_selected_month['mtd_total_daily_qouta_amount'], 4);
            $weekGroups[$annual_group_code]['mtd_total_daily_out_amount'] = round($mtd_date_selected_month['mtd_total_daily_out_amount'], 4);
            $weekGroups[$annual_group_code]['mtd_total_status_daily_target'] = round($mtd_date_selected_month['mtd_total_status_daily_target'], 4);
            $weekGroups[$annual_group_code]['mtd_final_percentage'] = round($mtd_date_selected_month['mtd_final_percentage'], 4);
            $weekGroups[$annual_group_code]['ytd_total_daily_qouta_amount'] = round($ytd_date_selected_month['ytd_total_daily_qouta_amount'], 4);
            $weekGroups[$annual_group_code]['ytd_total_daily_out_amount'] = round($ytd_date_selected_month['ytd_total_daily_out_amount'], 4);
            $weekGroups[$annual_group_code]['ytd_total_status_daily_target'] = round($ytd_date_selected_month['ytd_total_status_daily_target'], 4);
            $weekGroups[$annual_group_code]['ytd_final_percentage'] = round($ytd_date_selected_month['ytd_final_percentage'], 4);

            $day = (int) date('j', strtotime($sale->sales_date));
            if ($day >= 1 && $day <= 7) {
                $weekGroups[$annual_group_code]['1-7'] = round($weekGroups[$annual_group_code]['1-7'] + $sale->sales_daily_out, 4);
            } elseif ($day >= 8 && $day <= 14) {
                $weekGroups[$annual_group_code]['8-14'] = round($weekGroups[$annual_group_code]['8-14'] + $sale->sales_daily_out, 4);
            } elseif ($day >= 15 && $day <= 21) {
                $weekGroups[$annual_group_code]['15-21'] = round($weekGroups[$annual_group_code]['15-21'] + $sale->sales_daily_out, 4);
            } else {
                $weekGroups[$annual_group_code]['22-30/31'] = round($weekGroups[$annual_group_code]['22-30/31'] + $sale->sales_daily_out, 4);
            }

        }
        $dataList = response()->json(array_values($weekGroups));

        $response = [
                "dataList"=>$dataList,
                'result'=>True,
                'title'=>'Success',
                'status'=>'success',
                'message'=> 'Authentication successful.',
            ];
        return Crypt::encryptString(json_encode($response));

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
                ->when(isset($selected_product), function ($qry) use ($selected_product) {
                    return $qry->where('ref_product_groups_description',$selected_product);
                })
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
                ->when(isset($selected_product), function ($qry) use ($selected_product) {
                    return $qry->where('ref_product_groups_description',$selected_product);
                })
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
        
        // foreach ($records as $record) {
        //     $date = Carbon::parse($record->createdate)->format('Y-m-d');
        //     $recordsByDate[$date] = $record;
        // }

        // foreach ($recordsByDate as $date => $record) {
        //     $results[] = [
        //         'sales_date' => $record->createdate,
        //         'sales_daily_out' => $record->QtyInKg,
        //         'ref_product_groups_description'=> $record->u_groupcategory
        //     ];
        // }
        // Group records by date and sum QtyInKg
        foreach ($records as $record) {
            $date = Carbon::parse($record->createdate)->format('Y-m-d');

            if (!isset($recordsByDate[$date])) {
                $recordsByDate[$date] = [
                    'sales_date' => $record->createdate,
                    'sales_daily_out' => $record->QtyInKg,
                    'ref_product_groups_description' => $record->u_groupcategory
                ];
            } else {
                $recordsByDate[$date]['sales_daily_out'] += $record->QtyInKg;
            }
        }
        
        $results = array_values($recordsByDate);

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
    
    public function getFiveDaysClientSalesTrackerbyCurrentDate() {
        $salesDailyOutTrackersController = new SalesDailyOutTrackersController();
        $records = [];
        $currentYear = Carbon::now()->format('Y');


        $data_quota = SalesDailyOutSettingsAnnualQuotaClientGroups::where('year_sales_target',$currentYear)->whereNull('deleted_at')->get();
        $card_codes = [];
        $datalist = [];
        foreach ($data_quota as $value) {
            $subgroups = SalesDailyOutSettingsClientSubGroups::where('sales_daily_out_settings_client_groups_code',$value->sales_daily_out_settings_client_group_code)->get();
            $card_codes =  $subgroups->pluck('customer_code')->implode("','") ;
            $productGroup = RefProductGroups::where('code',$value->ref_product_groups_code)->first();
            
            $datalist = (SalesDailyOutClientSalesTrackers::where('year_sales_target', $currentYear)
                    ->where('ref_product_groups_description', $productGroup->description)
                    ->where('sales_daily_out_settings_annual_quota_client_groups_code', $value->sales_daily_out_settings_client_group_code)
                    ->whereNull('deleted_at')
                    ->get());

            
            $records = DB::select("exec dbo.sales_daily_out_delivery_return_cm_client_based_v2_5_days ?,?,?",array($currentYear,"'".$card_codes."'",$productGroup->description));
        
            if(!empty($records)){
                foreach ($records as $record) {
                    $date = Carbon::parse($record->createdate)->format('Y-m-d');

                    if (!isset($recordsByDate[$date])) {
                        $recordsByDate[$date] = [
                            'sales_date' => $record->createdate,
                            'sales_daily_out' => $record->QtyInKg,
                            'ref_product_groups_description' => $record->u_groupcategory
                        ];
                    } else {
                        $recordsByDate[$date]['sales_daily_out'] += $record->QtyInKg;
                    }
                }
                
                $results = array_values($recordsByDate);

                foreach ($datalist as $datalist_value) {
                    $sales_daily_qouta = $datalist_value['sales_daily_qouta'];
                    $sales_date = Carbon::parse($datalist_value['sales_date'])->format('Y-m-d');
                        foreach ($results as $result) {
                            $result_date = Carbon::parse($result['sales_date'])->format('Y-m-d');
                            if($sales_date == $result_date){
                                $computation = $salesDailyOutTrackersController->get_status_daily_target_and_percentage_daily_target_by_daily_out($result['sales_daily_out'],$sales_daily_qouta);
                                $final_results[] = [
                                    'year_sales_target' => $currentYear,
                                    'sales_daily_out_settings_annual_quota_client_groups_code' => $value->sales_daily_out_settings_client_group_code,
                                    'sales_daily_out' => $result['sales_daily_out'],
                                    'ref_product_groups_description' => $result['ref_product_groups_description'],
                                    'sales_date' => $result['sales_date'],
                                    'sales_daily_target' => $computation['status_daily_target'],
                                    'daily_sales_target_percentage' => $computation['percentage_daily_target'],
                                    'modified_by' => 'SAP',
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
    }
}
