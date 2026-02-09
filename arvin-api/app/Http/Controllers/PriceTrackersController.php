<?php

namespace App\Http\Controllers;

use App\Models\PriceTrackers;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Crypt;
use Illuminate\Support\Facades\DB;

class PriceTrackersController extends Controller
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
     * @param  \App\Models\PriceTrackers  $priceTrackers
     * @return \Illuminate\Http\Response
     */
    public function show(Request $request)
    {
      
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Models\PriceTrackers  $priceTrackers
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, PriceTrackers $priceTrackers)
    {


    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Models\PriceTrackers  $priceTrackers
     * @return \Illuminate\Http\Response
     */
    public function destroy(PriceTrackers $priceTrackers)
    {
        //
    }

    public function display_prices(Request $request)
    {
        $page = $request->query('page', 1);
        $limit = $request->query('limit', 10);
        $query = $request->query('q');
        $filter = $request->query('f', 'manila');
        $warehouse = $request->query('w');

        $view = ($filter === 'province')
            ? 'eSalesCostingProv.dbo.vw_tblPIndex_prov'
            : 'eSalesCosting.dbo.vw_tblPIndex';

        // $dataListQuery = DB::connection('sqlsrv2')->table($view);
        $view_history = ($filter === 'province')
            ? 'eSalesCostingProv.dbo.vw_tblPIndex_prov_history'
            : 'eSalesCosting.dbo.vw_tblPIndex_history';
        

         $latestHistory = DB::connection('sqlsrv2')
        ->table($view_history . ' as h1')
        ->select(
            'h1.ItemCode',
            'h1.Warehouse',
            'h1.Brand',
            'h1.OldPrice',
            'H1.TaxCode'
        )
        ->whereRaw('h1.Time_Stamp = (
            SELECT MAX(h2.Time_Stamp)
            FROM ' . $view_history . ' h2
            WHERE h2.ItemCode = h1.ItemCode
              AND h2.Warehouse = h1.Warehouse
              
        )');

        /** 🔹 Main query */
        $dataListQuery = DB::connection('sqlsrv2')
            ->table($view . ' as p')
            ->leftJoinSub($latestHistory, 'h', function ($join) {
                $join->on('p.ItemCode', '=', 'h.ItemCode')
                    ->on('p.Warehouse', '=', 'h.Warehouse')
                    ->on('p.TaxCode', '=', 'h.TaxCode')
                    ->on('p.Brand', '=', 'h.Brand');
            })
            ->select(
                'p.*',
                 DB::raw('ISNULL(h.OldPrice, 0.00) as PreviousPrice')
            );

        if (!empty($query)) {
            $dataListQuery->where('p.ItemName', 'like', "%{$query}%")
            ->orWhere('p.ItemCode', 'like', "%{$query}%")
            ->orWhere('p.TaxCode', 'like', "%{$query}%")
            ->orWhere('p.PickupPrice', 'like', "%{$query}%")
            ->orWhereRaw('ISNULL(h.OldPrice, 0.00) LIKE ?', ["%{$query}%"])
            ->orWhere('p.Brand', 'like', "%{$query}%");
        }

        if (!empty($warehouse)) {
            $dataListQuery->where('p.Warehouse', $warehouse);
        }

        $data_list = $dataListQuery
            ->paginate($limit, ['*'], 'page', $page);

        return Crypt::encryptString(json_encode([
            "dataList" => $data_list,
            'result' => true,
            'title' => 'Success',
            'status' => 'success',
            'message' => '',
        ]));
    }

    public function price_history(Request $request){
        $fields = $request->validate([
            'id' => 'required',
            'type' => 'required',
        ]);

        $view = ($fields['type'] === 'province')
        ? 'eSalesCostingProv.dbo.vw_tblPIndex_prov'
        : 'eSalesCosting.dbo.vw_tblPIndex';

        $view_history = ($fields['type'] === 'province')
        ? 'eSalesCostingProv.dbo.vw_tblPIndex_prov_history'
        : 'eSalesCosting.dbo.vw_tblPIndex_history';

        $details = DB::connection('sqlsrv2')->table($view)->where('ID',$fields['id'])->first();

        $details_history = DB::connection('sqlsrv2')->table($view_history)
            ->where('ItemCode',$details->ItemCode)
            ->where('Warehouse',$details->Warehouse)
            ->where('TaxCode',$details->TaxCode)
            ->where('Brand',$details->Brand)
            ->orderBy('Time_Stamp','desc')
            ->get();

        $response = [
            "dataList" => $details_history,
            "dataListCount" => count($details_history),
            'result' => true,
            'title' => 'Success',
            'status' => 'success',
            'message' => '',
        ];

        return Crypt::encryptString(json_encode($response));
    }
}
