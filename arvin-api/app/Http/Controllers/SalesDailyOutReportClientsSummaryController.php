<?php

namespace App\Http\Controllers;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Crypt;

use Illuminate\Http\Request;
use Illuminate\Pagination\LengthAwarePaginator;

class SalesDailyOutReportClientsSummaryController extends Controller
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
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, $id)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        //
    }


    public static function  get_client_sales_tracker_summary(Request $request)
    {
        $p_year = $request->query('year');
        $p_product = $request->query('product');
        $p_group_code = $request->query('group_code');
        $p_bdo = $request->query('bdo');
        $p_type = $request->query('t');
        $p_subsection = $request->query('w');
        $limit = $request->query('tl');
        $page = $request->query('tp');
        $dataListCollection = [];
        $dataList = [];

         $dataListArray = DB::select("SET NOCOUNT ON exec dbo.ClientSalesTrackerSummary ?,?,?,?,?,?",array($p_year,$p_product,$p_group_code,$p_bdo,$p_type,$p_subsection));
        
        if(!empty($dataListArray)){
            $dataListCollection = collect($dataListArray)->map(function ($item) {
                $item = (array) $item; // Convert stdClass to array
        
                $item['january_total_out'] = number_format((float) $item['january_total_out'], 2);
                $item['february_total_out'] = number_format((float) $item['february_total_out'], 2);
                $item['march_total_out'] = number_format((float) $item['march_total_out'], 2);
                $item['april_total_out'] = number_format((float) $item['april_total_out'], 2);
                $item['may_total_out'] = number_format((float) $item['may_total_out'], 2);
                $item['june_total_out'] = number_format((float) $item['june_total_out'], 2);
                $item['july_total_out'] = number_format((float) $item['july_total_out'], 2);
                $item['august_total_out'] = number_format((float) $item['august_total_out'], 2);
                $item['september_total_out'] = number_format((float) $item['september_total_out'], 2);
                $item['october_total_out'] = number_format((float) $item['october_total_out'], 2);
                $item['november_total_out'] = number_format((float) $item['november_total_out'], 2);
                $item['december_total_out'] = number_format((float) $item['december_total_out'], 2);
                $item['year_sales_daily_out'] = number_format((float) $item['year_sales_daily_out'], 2);
                $item['annual_quota_percentage'] = number_format((float) $item['annual_quota_percentage'], 2);
                $item['annual_quota'] = number_format((float) $item['annual_quota'], 2);
                $item['mtd_april_final_percentage'] = number_format((float) $item['mtd_april_final_percentage'], 2);
                $item['mtd_april_total_daily_out_amount'] = number_format((float) $item['mtd_april_total_daily_out_amount'], 2);
                $item['mtd_april_total_daily_quota_amount'] = number_format((float) $item['mtd_april_total_daily_quota_amount'], 2);
                $item['mtd_april_total_status_daily_target'] = number_format((float) $item['mtd_april_total_status_daily_target'], 2);
                $item['mtd_august_final_percentage'] = number_format((float) $item['mtd_august_final_percentage'], 2);
                $item['mtd_august_total_daily_out_amount'] = number_format((float) $item['mtd_august_total_daily_out_amount'], 2);
                $item['mtd_august_total_daily_quota_amount'] = number_format((float) $item['mtd_august_total_daily_quota_amount'], 2);
                $item['mtd_august_total_status_daily_target'] = number_format((float) $item['mtd_august_total_status_daily_target'], 2);
                $item['mtd_december_final_percentage'] = number_format((float) $item['mtd_december_final_percentage'], 2);
                $item['mtd_december_total_daily_out_amount'] = number_format((float) $item['mtd_december_total_daily_out_amount'], 2);
                $item['mtd_december_total_daily_quota_amount'] = number_format((float) $item['mtd_december_total_daily_quota_amount'], 2);
                $item['mtd_december_total_status_daily_target'] = number_format((float) $item['mtd_december_total_status_daily_target'], 2);
                $item['mtd_february_final_percentage'] = number_format((float) $item['mtd_february_final_percentage'], 2);
                $item['mtd_february_total_daily_out_amount'] = number_format((float) $item['mtd_february_total_daily_out_amount'], 2);
                $item['mtd_february_total_daily_quota_amount'] = number_format((float) $item['april_total_out'], 2);
                $item['mtd_february_total_status_daily_target'] = number_format((float) $item['mtd_february_total_status_daily_target'], 2);
                $item['mtd_january_final_percentage'] = number_format((float) $item['mtd_january_final_percentage'], 2);
                $item['mtd_january_total_daily_out_amount'] = number_format((float) $item['mtd_january_total_daily_out_amount'], 2);
                $item['mtd_january_total_daily_quota_amount'] = number_format((float) $item['mtd_january_total_daily_quota_amount'], 2);
                $item['mtd_january_total_status_daily_target'] = number_format((float) $item['mtd_january_total_status_daily_target'], 2);
                $item['mtd_july_final_percentage'] = number_format((float) $item['mtd_july_final_percentage'], 2);
                $item['mtd_july_total_daily_out_amount'] = number_format((float) $item['mtd_july_total_daily_out_amount'], 2);
                $item['mtd_july_total_daily_quota_amount'] = number_format((float) $item['mtd_july_total_daily_quota_amount'], 2);
                $item['mtd_july_total_status_daily_target'] = number_format((float) $item['mtd_july_total_status_daily_target'], 2);
                $item['mtd_june_final_percentage'] = number_format((float) $item['mtd_june_final_percentage'], 2);
                $item['mtd_june_total_daily_out_amount'] = number_format((float) $item['mtd_june_total_daily_out_amount'], 2);
                $item['mtd_june_total_daily_quota_amount'] = number_format((float) $item['mtd_june_total_daily_quota_amount'], 2);
                $item['mtd_june_total_status_daily_target'] = number_format((float) $item['mtd_june_total_status_daily_target'], 2);
                $item['mtd_march_final_percentage'] = number_format((float) $item['mtd_march_final_percentage'], 2);
                $item['mtd_march_total_daily_out_amount'] = number_format((float) $item['mtd_march_total_daily_out_amount'], 2);
                $item['mtd_march_total_daily_quota_amount'] = number_format((float) $item['mtd_march_total_daily_quota_amount'], 2);
                $item['mtd_march_total_status_daily_target'] = number_format((float) $item['mtd_march_total_status_daily_target'], 2);
                $item['mtd_may_final_percentage'] = number_format((float) $item['mtd_may_final_percentage'], 2);
                $item['mtd_may_total_daily_out_amount'] = number_format((float) $item['mtd_may_total_daily_out_amount'], 2);
                $item['mtd_may_total_status_daily_target'] = number_format((float) $item['mtd_may_total_status_daily_target'], 2);
                $item['mtd_november_final_percentage'] = number_format((float) $item['mtd_november_final_percentage'], 2);
                $item['mtd_november_total_daily_out_amount'] = number_format((float) $item['mtd_november_total_daily_out_amount'], 2);
                $item['mtd_november_total_daily_quota_amount'] = number_format((float) $item['mtd_november_total_daily_quota_amount'], 2);
                $item['mtd_november_total_status_daily_target'] = number_format((float) $item['mtd_november_total_status_daily_target'], 2);
                $item['mtd_october_final_percentage'] = number_format((float) $item['mtd_october_final_percentage'], 2);
                $item['mtd_october_total_daily_out_amount'] = number_format((float) $item['mtd_october_total_daily_out_amount'], 2);
                $item['mtd_october_total_daily_quota_amount'] = number_format((float) $item['mtd_october_total_daily_quota_amount'], 2);
                $item['mtd_october_total_status_daily_target'] = number_format((float) $item['mtd_october_total_status_daily_target'], 2);
                $item['mtd_september_final_percentage'] = number_format((float) $item['mtd_september_final_percentage'], 2);
                $item['mtd_september_total_daily_out_amount'] = number_format((float) $item['mtd_september_total_daily_out_amount'], 2);
                $item['mtd_september_total_daily_quota_amount'] = number_format((float) $item['mtd_september_total_daily_quota_amount'], 2);
                $item['mtd_september_total_status_daily_target'] = number_format((float) $item['mtd_september_total_status_daily_target'], 2);
             
                $item['ytd_april_final_percentage'] = number_format((float) $item['ytd_april_final_percentage'], 2);
                $item['ytd_april_total_daily_out_amount'] = number_format((float) $item['ytd_april_total_daily_out_amount'], 2);
                $item['ytd_april_total_daily_quota_amount'] = number_format((float) $item['ytd_april_total_daily_quota_amount'], 2);
                $item['ytd_april_total_status_daily_target'] = number_format((float) $item['ytd_april_total_status_daily_target'], 2);
                $item['ytd_august_final_percentage'] = number_format((float) $item['ytd_august_final_percentage'], 2);
                $item['ytd_august_total_daily_out_amount'] = number_format((float) $item['ytd_august_total_daily_out_amount'], 2);
                $item['ytd_august_total_daily_quota_amount'] = number_format((float) $item['ytd_august_total_daily_quota_amount'], 2);
                $item['ytd_august_total_status_daily_target'] = number_format((float) $item['ytd_august_total_status_daily_target'], 2);
                $item['ytd_december_final_percentage'] = number_format((float) $item['ytd_december_final_percentage'], 2);
                $item['ytd_december_total_daily_out_amount'] = number_format((float) $item['ytd_december_total_daily_out_amount'], 2);
                $item['ytd_december_total_daily_quota_amount'] = number_format((float) $item['ytd_december_total_daily_quota_amount'], 2);
                $item['ytd_december_total_status_daily_target'] = number_format((float) $item['ytd_december_total_status_daily_target'], 2);
                $item['ytd_february_final_percentage'] = number_format((float) $item['ytd_february_final_percentage'], 2);
                $item['ytd_february_total_daily_out_amount'] = number_format((float) $item['ytd_february_total_daily_out_amount'], 2);
                $item['ytd_february_total_daily_quota_amount'] = number_format((float) $item['april_total_out'], 2);
                $item['ytd_february_total_status_daily_target'] = number_format((float) $item['ytd_february_total_status_daily_target'], 2);
                $item['ytd_january_final_percentage'] = number_format((float) $item['ytd_january_final_percentage'], 2);
                $item['ytd_january_total_daily_out_amount'] = number_format((float) $item['ytd_january_total_daily_out_amount'], 2);
                $item['ytd_january_total_daily_quota_amount'] = number_format((float) $item['ytd_january_total_daily_quota_amount'], 2);
                $item['ytd_january_total_status_daily_target'] = number_format((float) $item['ytd_january_total_status_daily_target'], 2);
                $item['ytd_july_final_percentage'] = number_format((float) $item['ytd_july_final_percentage'], 2);
                $item['ytd_july_total_daily_out_amount'] = number_format((float) $item['ytd_july_total_daily_out_amount'], 2);
                $item['ytd_july_total_daily_quota_amount'] = number_format((float) $item['ytd_july_total_daily_quota_amount'], 2);
                $item['ytd_july_total_status_daily_target'] = number_format((float) $item['ytd_july_total_status_daily_target'], 2);
                $item['ytd_june_final_percentage'] = number_format((float) $item['ytd_june_final_percentage'], 2);
                $item['ytd_june_total_daily_out_amount'] = number_format((float) $item['ytd_june_total_daily_out_amount'], 2);
                $item['ytd_june_total_daily_quota_amount'] = number_format((float) $item['ytd_june_total_daily_quota_amount'], 2);
                $item['ytd_june_total_status_daily_target'] = number_format((float) $item['ytd_june_total_status_daily_target'], 2);
                $item['ytd_march_final_percentage'] = number_format((float) $item['ytd_march_final_percentage'], 2);
                $item['ytd_march_total_daily_out_amount'] = number_format((float) $item['ytd_march_total_daily_out_amount'], 2);
                $item['ytd_march_total_daily_quota_amount'] = number_format((float) $item['ytd_march_total_daily_quota_amount'], 2);
                $item['ytd_march_total_status_daily_target'] = number_format((float) $item['ytd_march_total_status_daily_target'], 2);
                $item['ytd_may_final_percentage'] = number_format((float) $item['ytd_may_final_percentage'], 2);
                $item['ytd_may_total_daily_out_amount'] = number_format((float) $item['ytd_may_total_daily_out_amount'], 2);
                $item['ytd_may_total_status_daily_target'] = number_format((float) $item['ytd_may_total_status_daily_target'], 2);
                $item['ytd_november_final_percentage'] = number_format((float) $item['ytd_november_final_percentage'], 2);
                $item['ytd_november_total_daily_out_amount'] = number_format((float) $item['ytd_november_total_daily_out_amount'], 2);
                $item['ytd_november_total_daily_quota_amount'] = number_format((float) $item['ytd_november_total_daily_quota_amount'], 2);
                $item['ytd_november_total_status_daily_target'] = number_format((float) $item['ytd_november_total_status_daily_target'], 2);
                $item['ytd_october_final_percentage'] = number_format((float) $item['ytd_october_final_percentage'], 2);
                $item['ytd_october_total_daily_out_amount'] = number_format((float) $item['ytd_october_total_daily_out_amount'], 2);
                $item['ytd_october_total_daily_quota_amount'] = number_format((float) $item['ytd_october_total_daily_quota_amount'], 2);
                $item['ytd_october_total_status_daily_target'] = number_format((float) $item['ytd_october_total_status_daily_target'], 2);
                $item['ytd_september_final_percentage'] = number_format((float) $item['ytd_september_final_percentage'], 2);
                $item['ytd_september_total_daily_out_amount'] = number_format((float) $item['ytd_september_total_daily_out_amount'], 2);
                $item['ytd_september_total_daily_quota_amount'] = number_format((float) $item['ytd_september_total_daily_quota_amount'], 2);
                $item['ytd_september_total_status_daily_target'] = number_format((float) $item['ytd_september_total_status_daily_target'], 2);
                return $item;
            });
        }

        if (!empty($dataListCollection)) {
            if (!empty($limit) && !empty($page)) {
                // $dataListCollection = collect($dataListArray);
                $currentPageItems = $dataListCollection->slice(($page - 1) * $limit, $limit)->values();
                $dataList = new LengthAwarePaginator($currentPageItems, $dataListCollection->count(), $limit, $page, [
                    'path' => url()->current(),
                    'query' => $request->query(),
                ]);
            } else {
                // No pagination, return all
                // $dataList = $dataListArray;
                $dataList = $dataListCollection->values();
            }
        }
        
        $response = [
            "dataList" => $dataList,
            'result' => true,
            'title' => 'Success',
            'status' => 'success',
            'message' => 'Data retrieved successfully.',
        ];
        return Crypt::encryptString(json_encode($response));
    }

}
