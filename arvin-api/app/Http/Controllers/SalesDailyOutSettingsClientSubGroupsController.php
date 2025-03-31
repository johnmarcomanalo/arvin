<?php

namespace App\Http\Controllers;

use Illuminate\Support\Facades\Crypt;
use App\Models\SalesDailyOutSettingsClientSubGroups;
use Illuminate\Http\Request;

class SalesDailyOutSettingsClientSubGroupsController extends Controller
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
     * @param  \App\Models\SalesDailyOutSettingsClientSubGroups  $salesDailyOutSettingsClientSubGroups
     * @return \Illuminate\Http\Response
     */
    public function show($id = null)
    {
        return Crypt::encryptString($this->do_show($id));
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Models\SalesDailyOutSettingsClientSubGroups  $salesDailyOutSettingsClientSubGroups
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, SalesDailyOutSettingsClientSubGroups $salesDailyOutSettingsClientSubGroups)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Models\SalesDailyOutSettingsClientSubGroups  $salesDailyOutSettingsClientSubGroups
     * @return \Illuminate\Http\Response
     */
    public function destroy(SalesDailyOutSettingsClientSubGroups $salesDailyOutSettingsClientSubGroups)
    {
        //
    }


    public function do_show($id = null) {
        if (isset($id)) {
            $data = SalesDailyOutSettingsClientSubGroups::where('sales_daily_out_settings_client_groups_code', '=', $id)->get();
        } else {
            $data = SalesDailyOutSettingsClientSubGroups::all();
        }
        if ($data->isEmpty()) {
            $data = array();
        }
        return $data;
    }
}
