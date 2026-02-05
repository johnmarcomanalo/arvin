<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Crypt;
use Illuminate\Support\Facades\DB;

class SprPrintingController extends Controller
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
    // public function spr($date_start,$date_end,$warehouse){
        $fields = $request->validate([
            'date_start' => 'required',
            'date_end' => 'required',
            'warehouse' => 'required',
        ]);
        // $fields['date_start'] = $date_start;
        // $fields['date_end'] = $date_end;
        // $fields['warehouse'] = $warehouse;
         $results_industrial = DB::connection('sqlsrv2')->select(
            'SET NOCOUNT ON; EXEC sp_StockPositionReport_Province_industrial_salt_V3 ?, ?, ?',
            [$fields['date_start'], $fields['date_end'], $fields['warehouse']]
        );
        
        $collection_industrial_salt = collect($results_industrial)->where('itemcategory','INDUSTRIAL SALT')->values();
       
        $collection_industrial_by_warehouse = $collection_industrial_salt
        ->groupBy('WhsCode')
        ->sortKeys()
        ->map(function ($warehouseItems) { 
            $grouped_items = $warehouseItems
                ->groupBy('ItemCode')
                ->sortKeys() 
                ->map(function ($items) { 
                    $sumIn  = $items->sum(fn($row) => (float) $row->InQty);
                    $sumOut = $items->sum(fn($row) => (float) $row->OutQty);
    
                    return [
                        'ItemCode' => $items->first()->ItemCode,
                        'ItemName' => $items->first()->Dscription, 
                        'InQty'    => $sumIn > 0 ? number_format($sumIn, 2) : '-',
                        'OutQty'   => $sumOut > 0 ? number_format($sumOut, 2) : '-', 
                        '_InQtyRaw'  => $sumIn,
                        '_OutQtyRaw' => $sumOut,
                    ];
                })
                ->sortBy('ItemName')
                ->values();
        
            $total_in = $grouped_items->sum(fn($i) => isset($i['_InQtyRaw']) ? $i['_InQtyRaw'] : 0);
            $total_out = $grouped_items->sum(fn($i) => isset($i['_OutQtyRaw']) ? $i['_OutQtyRaw'] : 0);
    
            $beg_balance = (float) ($warehouseItems->first()->BegInvBalance ?? 0);
            $ending_balance = $beg_balance + $total_in - $total_out;
    
            return [
                'Warehouse'        => $warehouseItems->first()->WhsCode,
                'Product'          => 'INDUSTRIAL SALT',
                'Items'            => $grouped_items,
                'TotalIn'          => $total_in > 0 ? number_format($total_in, 2) : '-',
                'TotalOut'         => $total_out > 0 ? number_format($total_out, 2) : '-',
                'BeginningBalance' => number_format($beg_balance, 2),
                'EndingBalance'    => number_format($ending_balance, 2),
            ];
        })->sortBy('WhsCode')
        ->values();

        // $collection_industrial_by_warehouse = $collection_industrial_salt
        //     ->groupBy('WhsCode')
        //     ->map(function ($warehouseItems) {
        //             return $warehouseItems
        //                 ->groupBy('ItemCode')
        //                  ->sortKeys() 
        //                 ->map(function ($items) { 
        //             $sumIn  = $items->sum(fn($row) => (float) $row->InQty);
        //             $sumOut = $items->sum(fn($row) => (float) $row->OutQty);
    
        //             return [
        //                 'ItemCode' => $items->first()->ItemCode,
        //                 'ItemName' => $items->first()->Dscription, 
        //                 'InQty'    => $sumIn > 0 ? number_format($sumIn, 2) : '-',
        //                 'OutQty'   => $sumOut > 0 ? number_format($sumOut, 2) : '-', 
        //                 '_InQtyRaw'  => $sumIn,
        //                 '_OutQtyRaw' => $sumOut,
        //             ];
        //         })
        //         ->sortBy('ItemName')
        //         ->values();

        //         // ---- ITEMS GROUPING ---- //
            
        //     })
        // ->sortBy('Warehouse')
        // ->values();

        // =======================
        
        $results_rice_others = DB::connection('sqlsrv2')->select(
            'SET NOCOUNT ON; EXEC sp_StockPositionReport_Province_v3 ?, ?, ?',
            [$fields['date_start'],$fields['date_end'],$fields['warehouse']]
        );

        $collection_rice_others = collect($results_rice_others)->whereNotIn('itemcategory', ['ITEM - DUMMY', 'INDUSTRIAL SALT',''])->values();  

        $collection_rice_others_by_warehouse = $collection_rice_others
        ->groupBy('WhsCode')
        ->map(function ($itemsByWarehouse) {
            return $itemsByWarehouse
                ->groupBy('itemcategory')
                // ->sortKeysDesc() 
                ->map(function ($itemsByCategory) {
                    return $itemsByCategory
                        ->groupBy('ItemCode')
                        ->map(function ($items) {

                            $BegInvBalance = (float) $items->first()->BegInvBalance;
                            $InQty  = (float) $items->sum(fn($row) => (float) $row->InQty);
                            $OutQty = (float) $items->sum(fn($row) => (float) $row->OutQty);
                            $EndBalance = $BegInvBalance + ($InQty - $OutQty);

                            return [
                                'ItemCode'      => $items->first()->ItemCode,
                                'ItemName'      => $items->first()->Dscription,
                                'BegInvBalance' => number_format($BegInvBalance, 2),
                                'InQty'         => number_format($InQty, 2),
                                'OutQty'        => number_format($OutQty, 2),
                                'EndBalance'    => number_format($EndBalance, 2),
                            ];
                            // return [
                            //     'ItemCode'  => $items->first()->ItemCode,
                            //     'ItemName'  => $items->first()->Dscription,
                            //     'BegInvBalance'  => $items->first()->BegInvBalance,
                            //     'InQty'     => $items->sum(fn($row) => (float) $row->InQty),
                            //     'OutQty'    => $items->sum(fn($row) => (float) $row->OutQty),
                            //     'EndBalance' => $items->first()->BegInvBalance
                            //         + ($items->sum(fn($row) => (float) $row->InQty)
                            //         - $items->sum(fn($row) => (float) $row->OutQty)),
                            // ];
                        })
                        ->filter(function ($item) {
                            return !(
                                $item['BegInvBalance'] == 0 &&
                                $item['InQty'] == 0 &&
                                $item['OutQty'] == 0 &&
                                $item['EndBalance'] == 0
                            );
                        })
                        ->values();
                });
        });
    
        
        $data = [
            'warehouse'         =>   $fields['warehouse'],
            'date_start'        =>   $fields['date_start'],
            'date_end'          =>   $fields['date_end'],
            'industrial'        =>   $collection_industrial_by_warehouse,
            'rice_and_others'   =>   $collection_rice_others_by_warehouse,
        ];
        
        return Crypt::encryptString(json_encode($data));

       
    }
}
