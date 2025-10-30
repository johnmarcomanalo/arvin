<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Crypt;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class VesselAndControllerMonitoringController extends Controller
{
    protected const MANILA   = 'manila';
    protected const PROVINCE = 'province';
    protected const PEANUT   = 'peanut';
    
    public function get_po_details(Request $request)
    {
        $search        = $request->query('q');
        $page          = (int) $request->query('p', 1);
        $sap           = $request->query('sap');
        $monitoring    = $request->query('m') ==="VESSEL"? "MIP" : "MV VESSEL";
        // $df            = $request->query('df');
        // $dt            = $request->query('dt');
        $limit         = (int) $request->query('lmt', 10);
        $sortColumn    = $request->query('sort_by', 'CardName');
        $sortDirection = strtolower($request->query('order', 'asc')) === 'desc' ? 'desc' : 'asc';

        // Execute stored procedure
        $queryResult = [];
        if (!is_null($monitoring) && !is_null($sap)) {
            $queryResult = DB::select(
                'EXEC dbo.sp_vessel_container_monitoring_details ?, ?',
                [$sap, $monitoring]
            );
        }

        // Convert to collection
        $collection = collect($queryResult);

        // Search filter
        if (!empty($search)) {
            $collection = $collection->filter(function ($item) use ($search) {
                return stripos($item->InvoiceNo ?? '', $search) !== false ||
                    stripos($item->PONumber ?? '', $search) !== false ||
                    stripos($item->CardName ?? '', $search) !== false ||
                    stripos($item->CardCode ?? '', $search) !== false ||
                    stripos($item->BLNo ?? '', $search) !== false ||
                    stripos($item->Vessel ?? '', $search) !== false ||
                    stripos($item->suppliername ?? '', $search) !== false;
            });
        }

        
        $collection = $collection->sortBy(
            fn($item) => $item->{$sortColumn} ?? null,
            SORT_NATURAL,
            $sortDirection === 'desc'
        );
    
        $total = $collection->count();
        $paginatedData = $collection->forPage($page, $limit)->values();

        $response = [
            'dataList'     => $paginatedData,
            'total'        => $total,
            'count'        => $paginatedData->count(),
            'per_page'     => $limit,
            'current_page' => $page,
            'total_pages'  => ceil($total / $limit),
            'result'       => true,
            'title'        => 'Success',
            'status'       => 'success',
            'message'      => 'Fetched successfully.',
        ];

        return Crypt::encryptString(json_encode($response));
    }
    
    public function get_specific_invoice_details(Request $request)
    {
        $invoice     = $request->query('invoice');
        $sap         = strtolower($request->query('sap')); 
        $monitoring  = $request->query('monitoring') === "VESSEL"? "MIP" : "V-WHSE";
        $queryResult = [];
        $chartGroupCustomerAndWarehouse = [];
        $chart = [];
 
        if (!is_null($invoice)) {
            $procedures = [
                self::MANILA   => 'dbo.sp_vcm_manila_direct_delivery_mip_with_invoice',
                self::PROVINCE => 'dbo.sp_vcm_province_direct_delivery_mip_with_invoice',
                self::PEANUT   => 'dbo.sp_vcm_peanut_direct_delivery_mip_with_invoice',
            ];
    
            if (isset($procedures[$sap])) {
                $queryResult = DB::select("EXEC {$procedures[$sap]} ?,?", [$invoice,$monitoring]);
            }

            if (!empty($queryResult)) {
                $customerData                   = $this->filterRows($queryResult, fn($row) => $row->GRPOWh === $monitoring);
                $warehouseData                  = $this->filterRows($queryResult, fn($row) => $row->GRPOWh !== $monitoring);
                $combineData                    = collect($warehouseData)->merge($customerData)->all();
                $chartGroupWarehouseAndMIP      = $this->groupAndSum($queryResult,'GRPOWh','GRQty',fn($row) => $row->GRPOWh !== $monitoring); 
                // $DirectToCustomer               = $this->sumByField($queryResult, 'GRQty', fn($row) => $row->GRPOWh === $monitoring);
                // $DirectToWarehouse              = $this->sumByField($queryResult, 'GRQty', fn($row) => $row->GRPOWh !== $monitoring);
                // $totalCMQty                     = $this->sumByField($queryResult, 'CMQty');
                // $totalPOQty                     = $this->sumByField($queryResult, 'POQty');
                // $totalGRQty                     = $this->sumByField($queryResult, 'GRQty');
                // $totalDRQty                     = $this->sumByField($queryResult, 'DRQty');
                // $totalQuantity                  = $this->sumByField($queryResult, 'Quantity');
                // $LackingDRQvsINV                = $totalDRQty-$totalQuantity;
                // $LackingGRvsDR                  = (($totalGRQty-$totalDRQty)-$DirectToWarehouse); 
                
                if (!empty($combineData[0]['DirectToWarehouse'])) {
                    $chartGroupCustomerAndWarehouse[] = [
                        'name'  => 'Warehouse Receiving',
                        'value' => (float)$combineData[0]['DirectToWarehouse']
                    ];
                }

                if (!empty($combineData[0]['DirectToCustomer'])) {
                    $chartGroupCustomerAndWarehouse[] = [
                        'name'  => 'Direct Delivery',
                        'value' => (float)$combineData[0]['DirectToCustomer']
                    ];
                }
            }

        }

      
        return Crypt::encryptString(json_encode([
            'customerData'                  => $customerData ?? [], 
            'warehouseData'                 => $warehouseData ?? [], 
            'combineData'                   => $combineData ?? [], 
             //graph and Pie Bar
            'chartGroupWarehouseAndMIP'     => $chartGroupWarehouseAndMIP ?? [],
            'chartGroupCustomerAndWarehouse'=> $chartGroupCustomerAndWarehouse ?? [],
        ]));
    }

    public function sumByField($q, $field, $filter = null)
    {
        $total =  collect($q)
            ->when($filter, fn($c) => $c->filter($filter))
            ->sum(fn($row) => (float) $row->{ucwords($field)});

        return $total;
    }
  
    public function groupAndSum(
        $rows,
        $groupField = 'GRPOWh',
        $sumField = 'GRQty',
        callable $filter = null,
        $nameKey = 'name',
        $valueKey = 'value',
    ) {
        return collect($rows)
            ->when($filter, fn($c) => $c->filter($filter)) // apply filter if provided
            ->groupBy($groupField)
            ->map(function ($group, $key) use ($sumField, $nameKey, $valueKey) {
                return [
                    $nameKey  => ucwords(strtolower($key)),
                    $valueKey => $group->sum(fn($row) => (float) $row->{$sumField}),
                ];
            })
            ->filter(fn($item) => $item[$valueKey] > 0) // ✅ remove zero values
            ->values();
    }
    

    public function filterRows($rows, callable $condition)
    {
        return collect($rows)
            ->filter($condition)
            ->map(function ($row) {
                return collect($row)->map(function ($value,$column) {
                     
                    // ✅ Then check if numeric
                    if (in_array($column, ['POQty','GRQty','DRQty','CMQty','Price','TotalPOQty'], true) && is_numeric($value)) {
                        return number_format((float) $value, 2, '.', ',');
                    }
    
                    return $value;
                })->toArray();
            })
            ->values() // reset numeric keys
            ->toArray();
    }
 

    // public function filterRows($rows, callable $condition)
    // {
    //     return collect($rows)
    //         ->filter($condition)
    //         ->map(function ($row) {
    //             return collect($row)->map(function ($value) {
    //                 // ✅ Check if value looks like a date first
    //                 if ($this->isDate($value)) {
    //                     return Carbon::parse($value)->format('Y-m-d');
    //                 }
    
    //                 // ✅ Then check if numeric
    //                 if (is_numeric($value)) {
    //                     return number_format((float) $value, 2, '.', '');
    //                 }
    
    //                 return $value;
    //             })->toArray();
    //         })
    //         ->values()
    //         ->toArray();
    // }
    
    // private function isDate($value)
    // {
    //     try {
    //         if ($value instanceof \DateTimeInterface) {
    //             return true;
    //         }
    
    //         // Strict check: only consider valid date strings (not pure numbers)
    //         if (is_string($value) && strtotime($value) !== false) {
    //             return true;
    //         }
    
    //         return false;
    //     } catch (\Exception $e) {
    //         return false;
    //     }
    // }
    


}
