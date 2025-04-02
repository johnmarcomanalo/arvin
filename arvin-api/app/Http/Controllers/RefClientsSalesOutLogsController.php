<?php

namespace App\Http\Controllers;

use App\Models\RefClientsSalesOutLogs;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;
use Illuminate\Support\Facades\Crypt;

class RefClientsSalesOutLogsController extends Controller
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
        try {
            //code...
        } catch (\Throwable $e) {
            DB::rollBack(); // Rollback transaction on error

            return response([
                'message' => 'An error occurred: ' . $e->getMessage(),
                'result' => false,
                'status' => 'error',
                'title' => 'Error',
            ], 500);
        }
    }

    /**
     * Display the specified resource.
     *
     * @param  \App\Models\RefClientsSalesOutLogs  $refClientsSalesOutLogs
     * @return \Illuminate\Http\Response
     */
    public function show(RefClientsSalesOutLogs $refClientsSalesOutLogs)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Models\RefClientsSalesOutLogs  $refClientsSalesOutLogs
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, RefClientsSalesOutLogs $refClientsSalesOutLogs)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Models\RefClientsSalesOutLogs  $refClientsSalesOutLogs
     * @return \Illuminate\Http\Response
     */
    public function destroy(RefClientsSalesOutLogs $refClientsSalesOutLogs)
    {
        //
    }


    public function postRefClientsSalesOutLogs()
    {
        try {
            DB::beginTransaction();

            $currentYear = Carbon::now()->format('Y');
            $records = DB::select("exec dbo.sales_daily_out_delivery_return_cm_client_based_v2_5_days ?", [$currentYear]);

            if (empty($records)) {
                DB::rollBack();
                return response([
                    'message' => 'No records to process.',
                    'result' => true,
                    'status' => 'success',
                    'title' => 'Success',
                ], 200);
            }

            // Helper function to chunk parameters and query in batches
            $existingRecords = collect([]);
            $chunkSize = 200; // Avoid exceeding 2100 parameters
            foreach (array_chunk($records, $chunkSize) as $chunk) {
                $query = RefClientsSalesOutLogs::query();
                foreach ($chunk as $value) {
                    $query->orWhere(function ($q) use ($value) {
                        $q->where('customer_code', $value->CardCode)
                            ->where('customer_description', $value->CardName)
                            ->where('product', $value->u_groupcategory)
                            ->where('sales_daily_out', $value->QtyInKg)
                            ->where('type', $value->type)
                            ->where('warehouse', $value->warehouse)
                            ->where('sales_date', $value->createdate)
                            ->where('docentry', $value->docentry)
                            ->where('docnum', $value->docnum)
                            ->where('trans_type', $value->trans_type);
                    });
                }
                $existingRecords = $existingRecords->merge($query->get([
                    'customer_code',
                    'customer_description',
                    'product',
                    'sales_daily_out',
                    'type',
                    'warehouse',
                    'sales_date',
                    'docentry',
                    'docnum',
                    'trans_type',
                ]));
            }

            // Create lookup map for existing records
            $existingMap = [];
            foreach ($existingRecords as $record) {
                $key = implode('|', [
                    $record->customer_code,
                    $record->customer_description,
                    $record->product,
                    $record->sales_daily_out,
                    $record->type,
                    $record->warehouse,
                    $record->sales_date,
                    $record->docentry,
                    $record->docnum,
                    $record->trans_type,
                ]);
                $existingMap[$key] = true;
            }

            $toInsert = [];
            $currentCode = MainController::generate_code('App\Models\RefClientsSalesOutLogs', 'code');

            foreach ($records as $value) {
                $key = implode('|', [
                    $value->CardCode,
                    $value->CardName,
                    $value->u_groupcategory,
                    $value->QtyInKg,
                    $value->type,
                    $value->warehouse,
                    $value->createdate,
                    $value->docentry,
                    $value->docnum,
                    $value->trans_type,
                ]);

                // Check if record already exists
                if (!isset($existingMap[$key])) {
                    $toInsert[] = [
                        'code' => $currentCode++,
                        'customer_code' => $value->CardCode,
                        'customer_description' => $value->CardName,
                        'product' => $value->u_groupcategory,
                        'sales_daily_out' => $value->QtyInKg,
                        'type' => $value->type,
                        'warehouse' => $value->warehouse,
                        'sales_date' => $value->createdate,
                        'docentry' => $value->docentry,
                        'docnum' => $value->docnum,
                        'trans_type' => $value->trans_type,
                        'status' => 0,
                        'added_by' => 'SAP',
                        'modified_by' => 'SAP',
                        'created_at' => now(),
                        'updated_at' => now(),
                    ];
                }
            }

            // Insert new records in chunks
            if (!empty($toInsert)) {
                foreach (array_chunk($toInsert, 500) as $chunk) {
                    RefClientsSalesOutLogs::insert($chunk);
                }
            }

            DB::commit();

            return response([
                'message' => 'Records processed successfully.',
                'result' => true,
                'status' => 'success',
                'title' => 'Success',
                'inserted_count' => count($toInsert),
            ], 200);

        } catch (\Throwable $e) {
            DB::rollBack();

            return response([
                'message' => 'An error occurred: ' . $e->getMessage(),
                'result' => false,
                'status' => 'error',
                'title' => 'Error',
            ], 500);
        }
    }


}
