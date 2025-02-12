<?php

namespace App\Http\Controllers;

use App\Models\EPayCheckCheckDetailLogs;
use App\Models\RefSections;
use App\Models\RefSubSections;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\Crypt;
use Illuminate\Support\Facades\DB;

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

    private function executeReport($df, $dt, $sc, $type) {
        return DB::select("exec dbo.sp_e_pay_check_weekly_check_counter_report ?,?,?,?", [$df, $dt, $sc, $type]);
    }

    public function get_weekly_check_counter_data(Request $request){

        $validated = $request->validate([
            'df' => 'required|date',
            'dt' => 'required|date',
            'sc' => 'required|string',
        ]);

        
        
        $result = $this->executeReport($validated['df'], $validated['dt'], $validated['sc'], "filter");
        $beginning_on_hand = $this->executeReport($validated['df'], $validated['dt'], $validated['sc'], "beginning");
        


        // Convert result to a collection for easier processing
        $transactions = collect($result);
    
        // Group transactions by date
        $groupedTransactions = $transactions->groupBy('created_at'); 

        $deposited = $transactions->where('check_status', 'DEPOSITED')->groupBy('created_at')->map(function ($items) {
            return $items->map(function ($item) {
                return $item;
            })->values();
        });

        $onHand = $transactions->where('check_status', 'ON-HAND')->groupBy('created_at')->map(function ($items) {
            return $items->map(function ($item) {
                return $item;
            })->values();
        });

        $transmitted = $transactions->where('check_status', 'TRANSMITTED')->groupBy('created_at')->map(function ($items) {
            return $items->map(function ($item) {
                return $item;
            })->values();
        });
    

        $rejected = $transactions->where('check_status', 'REJECTED')->groupBy('created_at')->map(function ($items) {
            return $items->map(function ($item) {
                return $item;
            })->values();
        });

        // Compute summary
        $summary = (object) [
            'beginning_on_hand' => count($beginning_on_hand),
            // 'collected'         => $transactions->where('check_status', 'collected')->sum('total'),
            'deposited'         => $transactions->where('check_status', 'DEPOSITED')->count(),
            'onhand'            => $transactions->where('check_status', 'ON-HAND')->count(),
            'transmitted'       => $transactions->where('check_status', 'TRANSMITTED')->count(),
            'rejected'          => $transactions->where('check_status', 'REJECTED')->count(),
            'ending_on_hand'    => 0.0, // You can calculate this based on logic
        ];

        $warehouse = RefSubSections::where('code',$validated['sc'])->first();

        $header = [
            'date_from'   => Carbon::parse($validated['df'])->format('M d, Y'), // Feb 10, 2023
            'date_to'     => Carbon::parse($validated['dt'])->format('M d, Y'), // Feb 10, 2023 
            'sub_section' => $warehouse->description,
        ];
    
        $response = [
            // 'transactions'   => $groupedTransactions, 
            'header'            => $header,
            'deposited'         => $deposited,
            'onhand'            => $onHand,
            'transmitted'       => $transmitted,
            'rejected'          => $rejected,
            'summary'           => $summary
        ];
        return Crypt::encryptString(json_encode($response));

    }

}
