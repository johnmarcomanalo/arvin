<?php

namespace App\Http\Controllers;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Crypt;

use Illuminate\Http\Request;

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

        $records = DB::select("exec dbo.ClientSalesTrackerSummary ?,?,?,?",array($p_year,$p_product,$p_group_code,$p_bdo));
        $response = [
                "dataList"=>$records,
                'result'=>True,
                'title'=>'Success',
                'status'=>'success',
                'message'=> '',
        ];
        return Crypt::encryptString(json_encode($response));
    }

}
