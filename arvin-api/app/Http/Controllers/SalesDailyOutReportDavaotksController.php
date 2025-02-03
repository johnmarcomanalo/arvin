<?php

namespace App\Http\Controllers;
use Illuminate\Support\Facades\Crypt;
use Illuminate\Support\Facades\DB;
use Illuminate\Http\Request;
use Carbon\Carbon;
use Illuminate\Support\Facades\Validator;

class SalesDailyOutReportDavaotksController extends Controller
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

    public function getDavaoTKSSummaryReport(Request $request) {
        $validator = Validator::make($request->query(), [
        'ds' => 'required|date',
        'de' => 'required|date|after_or_equal:ds',
        'type' => 'required|string'
        ]);

        // Check if validation fails
        if ($validator->fails()) {
            return response()->json([
                'result' => false,
                'title' => 'Validation Error',
                'status' => 'error',
                'message' => $validator->errors()->first(),
            ], 400);
        }

        $filter_start = $request->query('ds');
        $filter_end = $request->query('de');
        $filter_type = $request->query('type');
        
        if($filter_type == 'Create Date'){
            $filter_type = 'create_date';
        }elseif($filter_type == 'Delivery Date'){
            $filter_type = 'delivery_date';
        }

        $query = DB::table('vw_davao_tks_summary_report')
            ->whereBetween($filter_type, [$filter_start,$filter_end])
            ->orderBy($filter_type)
            ->get()
            ->map(function ($item) {
                $item->create_date = Carbon::parse($item->create_date)->format('Y-m-d'); // Change format as needed
                $item->delivery_date = Carbon::parse($item->delivery_date)->format('Y-m-d'); // Change format as needed
                return $item;
            });

        $response = [
                "dataList"=>$query,
                "dataListCount"=>$query->count(),
                'result'=>True,
                'title'=>'Success',
                'status'=>'success',
                'message'=> '',
        ];
        return Crypt::encryptString(json_encode($response));
    }
}
