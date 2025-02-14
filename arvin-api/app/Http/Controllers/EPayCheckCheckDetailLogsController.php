<?php

namespace App\Http\Controllers;

use App\Models\EPayCheckCheckDetailLogs;
use App\Models\RefSections;
use App\Models\RefSubSections;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\Crypt;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;

class EPayCheckCheckDetailLogsController extends Controller
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
     * @param  \App\Models\EPayCheckCheckDetailLogs  $ePayCheckCheckDetailLogs
     * @return \Illuminate\Http\Response
     */
    public function show(EPayCheckCheckDetailLogs $ePayCheckCheckDetailLogs)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Models\EPayCheckCheckDetailLogs  $ePayCheckCheckDetailLogs
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, EPayCheckCheckDetailLogs $ePayCheckCheckDetailLogs)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Models\EPayCheckCheckDetailLogs  $ePayCheckCheckDetailLogs
     * @return \Illuminate\Http\Response
     */
    public function destroy(EPayCheckCheckDetailLogs $ePayCheckCheckDetailLogs)
    {
        //
    }

    private function execute_report($df, $dt, $sc, $type) {
        return DB::select("exec dbo.sp_e_pay_check_weekly_check_counter_report ?,?,?,?", [$df, $dt, $sc, $type]);
    }

    private function get_group_data_per_date($data, $type) {
        return $data->where('check_status', $type)->groupBy('created_at')->map(function ($items) {
            return $items->map(function ($item) {
                return $item;
            })->values();
        });
    }

    public function get_weekly_check_counter_data(Request $request){

        $customMessages = [
        'df.required'         => 'The start date is required.',
        'df.date'             => 'The start date must be a valid date.',
        'df.date_format'      => 'The start date must be in MM/DD/YYYY format.', 
        'dt.required'         => 'The End date is required.',
        'dt.date'             => 'The End date must be a valid date.',
        'dt.after_or_equal'   => 'The selected end date must be the same as or later than the start date.',
        'dt.date_format'      => 'The end date must be in MM/DD/YYYY format.',
        ];
        
        $validator = Validator::make($request->all(), [
            'df'              => ['required', 'date', 'date_format:Y-m-d'],
            'dt'              => ['required', 'date', 'date_format:Y-m-d', 'after_or_equal:df'], 
            'sc'              => ['required', 'string'],
        ], $customMessages); // Pass custom messages here
        
        if ($validator->fails()) {
            return response()->json([
                'result'      => false,
                'status'      => 'warning',
                'title'       => 'Error',
                'message'     => $validator->errors()->first(),
            ], 422);
        }
    
        $validated            = $validator->validated();
        $result_body          = $this->execute_report($validated['df'], $validated['dt'], $validated['sc'], "within_range");
        $result_footer        = $this->execute_report($validated['df'], $validated['dt'], $validated['sc'], "open   ");

        //HEADER summary data

        $warehouse = RefSubSections::where('code',$validated['sc'])->first();

        $header = [
            'date_from'        => Carbon::parse($validated['df'])->format('M d, Y'), // Feb 10, 2023
            'date_to'          => Carbon::parse($validated['dt'])->format('M d, Y'), // Feb 10, 2023 
            'sub_section'      => $warehouse->description,
        ];
        // HEADER END


         // BODY summary data
        // Convert result to a collection for easier processing
        $transactions          = collect($result_body);
        $beginning_on_hand     = collect($result_footer);
        $merge_data            = $transactions->merge($beginning_on_hand)->unique('code')->sortBy('created_at')->values();

        $deposited_data        = $this->get_group_data_per_date($transactions, "DEPOSITED");
        $onHand_data           = $this->get_group_data_per_date($merge_data, "ON-HAND");
        $transmitted_data      = $this->get_group_data_per_date($transactions, "TRANSMITTED");
        $rejected_data         = $this->get_group_data_per_date($transactions, "REJECTED");
        // BODY END

        // FOOTER Compute summary
        $summary = (object) [
            'beginning_on_hand'=> $beginning_on_hand->count(),
            'collected'        => $transactions->where('check_status', 'ON-HAND')->count()
                                + $transactions->where('check_status', 'DEPOSITED')->count()
                                + $transactions->where('check_status', 'TRANSMITTED')->count()
                                + $transactions->where('check_status', 'REJECTED')->count(),
            'deposited'        => $transactions->where('check_status', 'DEPOSITED')->count(),
            'transmitted'      => $transactions->where('check_status', 'TRANSMITTED')->count(),
            'rejected'         => $transactions->where('check_status', 'REJECTED')->count(),
            'ending_on_hand'   => ($beginning_on_hand->count() + $transactions->where('check_status', 'ON-HAND')->count())
        ];
        //FOOTER END
    
        $response = [
            // 'transactions'  => $groupedTransactions, 
            'header'           => $header,
            'deposited'        => $deposited_data,
            'onhand'           => $onHand_data,
            'transmitted'      => $transmitted_data,
            'rejected'         => $rejected_data,
            'summary'          => $summary
        ];
        return Crypt::encryptString(json_encode($response));

    }

}
