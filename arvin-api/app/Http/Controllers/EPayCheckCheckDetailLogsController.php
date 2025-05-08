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

    private function get_group_data($data, $type, $exclude = null, $group_by_date = false) {
        return $data->where('check_status', $type)
            ->reject(function ($item) use ($exclude) {
                return !empty($exclude) && in_array($item->code, (array) $exclude);
            })
            ->when($group_by_date, function ($filteredData)  use ($type) {
                return $filteredData->groupBy(function ($item) {
                    return \Carbon\Carbon::parse($item->check_status_date)->format('Y-m-d'); // Group by date
                })->map(function ($items) use ($type) {
                    if ($type == 'ON-HAND') {
                        // Set check_status_date to null for each item in the group
                        $items->each(function ($item) {
                            $item->check_status_date = null;
                        });
                    }
                    return $items->values(); // Reset array indexes
                }); 
            }, function ($filteredData) {
                return $filteredData->values(); // If no grouping, just return as a collection
            });
    }
    

    public function check_summary($data){ 
        $code_exclude     = $data->whereIn('check_status',["REJECTED","TRANSMITTED","DEPOSITED"])->pluck('code')->filter()->toArray(); 
        $data_onhand      = $this->get_group_data($data,"ON-HAND",$code_exclude);
        return  $data_onhand; 
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
        $result_body          = $this->execute_report($validated['df'], $validated['dt'], $validated['sc'], "date_range");
        $result_footer        = $this->execute_report($validated['df'], $validated['dt'], $validated['sc'], "open");
        $result_rejected      = $this->execute_report($validated['df'], $validated['dt'], $validated['sc'], "open_rejected");

        //HEADER summary data

        $warehouse = RefSubSections::where('code',$validated['sc'])->first();

        $header = [
            'date_from'        => Carbon::parse($validated['df'])->format('M d, Y'), // Feb 10, 2023
            'date_to'          => Carbon::parse($validated['dt'])->format('M d, Y'), // Feb 10, 2023 
            'sub_section'      => $warehouse->description,
        ];
        // HEADER END

        //BODY
        $transactions     = collect($result_body);
        $beginning_on_hand= collect($result_footer);
        $open_rejected    = collect($result_rejected);
        $code_exclude     = $transactions->whereIn('check_status',["REJECTED","TRANSMITTED","DEPOSITED"])->pluck('code')->filter()->toArray();
        
        //merging data open status and within range
        $data_beg         = $this->check_summary($beginning_on_hand);
        $datax            = $transactions->where('check_status', 'ON-HAND');
        $merge_data       = $datax->merge($data_beg)->map(function ($item) {
            $item->check_status_date = $item->created_at;
            return $item;
        })
        ->unique('code') // Replace 'your_unique_column' with the column that should be unique
        ->values(); // Reindex the collection

        // data body grouped by date
        $data_onhand           = $this->get_group_data($merge_data, "ON-HAND", $code_exclude, true);
        $data_transmitted      = $this->get_group_data($transactions,"TRANSMITTED",null,true);
        $data_deposited        = $this->get_group_data($transactions,"DEPOSITED",null,true);
        $data_rejected         = $this->get_group_data($transactions,"REJECTED",null,true);
        $data_open_rejected    = $this->get_group_data($open_rejected,"REJECTED",null,true);
  
 
        $body = [
            'deposited'     => $data_deposited,
            'onhand'        => $data_onhand,
            'transmitted'   => $data_transmitted,
            'rejected'      => $data_rejected,
            'open_rejected' => $data_open_rejected,
        ];

        $minus_status =  $transactions->where('check_status', 'DEPOSITED')->count()
        + $transactions->where('check_status', 'TRANSMITTED')->count()
        + $transactions->where('check_status', 'REJECTED')->count();
        
        // FOOTER Compute summary
        $summary = (object) [
            'beginning_on_hand'     => $data_beg->count(),
            'collected'             => $transactions->where('check_status', 'ON-HAND')->count(),
            'deposited'             => $transactions->where('check_status', 'DEPOSITED')->count(),
            'transmitted'           => $transactions->where('check_status', 'TRANSMITTED')->count(),
            'rejected'              => $transactions->where('check_status', 'REJECTED')->count(),
            'ending_on_hand'        => ($data_beg->count() + $transactions->where('check_status', 'ON-HAND')->count())-$minus_status,
            'open_rejected'         => $open_rejected->count(), 
        ];
        // //FOOTER END
    
        $response = [
            'header'           => $header,
            'body'             => $body,
            'footer'           => $summary
        ];
        
        return Crypt::encryptString(json_encode($response));

    }

}
