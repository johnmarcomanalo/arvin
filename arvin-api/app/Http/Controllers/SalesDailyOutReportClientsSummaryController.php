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


    public function  get_client_sales_tracker_summary(Request $request)
    {
        $p_year = $request->query('year');
        $p_product = $request->query('product');
        $p_group_code = $request->query('group_code');
        $p_bdo = $request->query('bdo');
        $p_type = $request->query('t');
        $p_subsection = $request->query('w');
        $limit = $request->query('tl');
        $page = $request->query('tp');

        $dataListArray = DB::select("SET NOCOUNT ON exec dbo.ClientSalesTrackerSummary ?,?,?,?,?,?",array($p_year,$p_product,$p_group_code,$p_bdo,$p_type,$p_subsection));
        $dataListCollection = collect($dataListArray);
        $currentPageItems = $dataListCollection->slice(($page - 1) * $limit, $limit)->values();
        $dataList = new LengthAwarePaginator($currentPageItems, $dataListCollection->count(), $limit, $page, [
            'path' => url()->current(),
            'query' => $request->query(),
        ]);
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
