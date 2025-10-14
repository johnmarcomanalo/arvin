<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Crypt;
use Illuminate\Support\Facades\DB;

class SprPrinting extends Controller
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

    public function spr(Request $request){
        $fields = $request->validate([
            'date_start' => 'required',
            'date_end' => 'required',
            'warehouse' => 'required',
        ]);
        $results_industrial = DB::connection('sqlsrv2')->select(
            'SET NOCOUNT ON; EXEC sp_StockPositionReport_Province_industrial_salt_V3 ?, ?, ?',
            [$fields['date_start'],$fields['date_end'],$fields['warehouse']]
        );

        $collection = collect($results_industrial)->whereNotIn('ItemCode', [''])->values();

        // Calculate beginning balance (first row's BegInvBalance)
        $beginning_balance = $collection->first()->BegInvBalance ?? 0;

        // Group by ItemCode (to group rows per product)
        $grouped = $collection
            ->groupBy('ItemCode')
            ->map(function ($items) {
                return [
                    'ItemCode'   => $items->first()->ItemCode,
                    'ItemName'   => $items->first()->Dscription,
                    'InQty'      => $items->sum(fn($row) => (float) $row->InQty) ?? '-',
                    'OutQty'     => $items->sum(fn($row) => (float) $row->OutQty) ?? '-',
                ];
            })
            ->sortBy('ItemName') // ✅ Correct way for collections
            ->values();          // ✅ Reindex keys (so result is a clean array)

        $total_in = $grouped->sum('InQty');
        $total_out = $grouped->sum('OutQty');

        // Calculate ending balance
        $ending_balance = $beginning_balance + $total_in - $total_out;

    
        // =======================
        
        $results_rice_others = DB::connection('sqlsrv2')->select(
            'SET NOCOUNT ON; EXEC sp_StockPositionReport_Province_v3 ?, ?, ?',
            [$fields['date_start'],$fields['date_end'],$fields['warehouse']]
        );

        $collection_rice_others = collect($results_rice_others)->whereNotIn('itemcategory', ['ITEM - DUMMY', 'INDUSTRIAL SALT',''])->values();          // ✅ Reindex keys (so result is a clean array)

        $collection_rice_others_by_warehouse = $collection_rice_others
            ->groupBy('WhsCode')
            ->map(function ($itemsByWarehouse) {
                return $itemsByWarehouse
                    ->groupBy('itemcategory')
                    ->map(function ($itemsByCategory) {
                        return $itemsByCategory
                            ->groupBy('ItemCode')
                            ->map(function ($items) {
                                return [
                                    'ItemCode'  => $items->first()->ItemCode,
                                    'ItemName'  => $items->first()->Dscription,
                                    'BegInvBalance'  => $items->first()->BegInvBalance,
                                    'InQty'     => $items->sum(fn($row) => (float) $row->InQty),
                                    'OutQty'    => $items->sum(fn($row) => (float) $row->OutQty),
                                    'EndBalance' => $items->first()->BegInvBalance
                                        + ($items->sum(fn($row) => (float) $row->InQty)
                                        - $items->sum(fn($row) => (float) $row->OutQty)),
                                ];
                            })
                            ->values(); // ✅ reset keys, remove ItemCode index
                    });
            });
        $collection_industrial_by_warehouse = [
            'product_group'     => 'INDUSTRIAL SALT',
            'beginning_balance' => round($beginning_balance, 2),
            'items'             => $grouped->values(),
            'total_in'          => round($total_in, 2),
            'total_out'         => round($total_out, 2),
            'ending_balance'    => round($ending_balance, 2),
        ];

        $data = [
            'warehouse' =>   $fields['warehouse'],
            'date_start' =>    $fields['date_start'],
            'date_end' =>   $fields['date_end'],
            'industrial' =>    $collection_industrial_by_warehouse,
            'rice_and_others' =>    $collection_rice_others_by_warehouse,
        ];
        return Crypt::encryptString(json_encode($data));

       
    }
}
