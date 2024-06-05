<?php

namespace App\Http\Controllers;

use App\Models\SalesDailyOutReportSalesSummary;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;
use Illuminate\Support\Collection;



class SalesDailyOutReportSalesSummaryController extends Controller
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
     * @param  \App\Models\SalesDailyOutReportSalesSummary  $salesDailyOutReportSalesSummary
     * @return \Illuminate\Http\Response
     */
    public function show(SalesDailyOutReportSalesSummary $salesDailyOutReportSalesSummary)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Models\SalesDailyOutReportSalesSummary  $salesDailyOutReportSalesSummary
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, SalesDailyOutReportSalesSummary $salesDailyOutReportSalesSummary)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Models\SalesDailyOutReportSalesSummary  $salesDailyOutReportSalesSummary
     * @return \Illuminate\Http\Response
     */
    public function destroy(SalesDailyOutReportSalesSummary $salesDailyOutReportSalesSummary)
    {
        //
    }
    public function getReportSalesSummary($name = null, $date_from = null, $date_to = null) {
        // Fetch the data from the database
        $query = DB::table('vw_DailySales')
                ->orderBy('createdate');
        
        // Conditionally add the where clause for date if provided
        if (isset($date_from) && isset($date_to)) {
            $query->whereBetween('createdate', [$date_from, $date_to]);
        }
        // Get the first three characters of the $name
        $short_name = substr($name, 0, 3);

        // Conditionally add the where clause for warehouse if provided
        if (isset($short_name)) {
            $query->where('warehouse', $short_name);
        }

        // Execute the query
        $results = $query->get();
        // Convert results to a collection for easier manipulation
        $collection = collect($results);

        // Group the data by month and calculate the total quantity in kg for each month
        $monthlySummary = $collection->groupBy(function($item) {
            // Parse the createdate and format it to get the month
            return Carbon::parse($item->createdate)->format('F'); // Full month name
        })->map(function($items, $month) {
            // Calculate the total quantity in kg for each month
            return [
                'month' => $month, // Full month name
                'sales' => $items->sum('QtyInKg')
            ];
        })->values()->all(); // Convert the collection back to an array
        return $results;
    }
}
