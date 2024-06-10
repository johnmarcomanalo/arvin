<?php

namespace App\Http\Controllers;

use App\Models\SalesDailyOutReportSalesSummary;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;
use Illuminate\Support\Collection;
use App\Models\SalesDailyOuts;



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
    public function formatQueryResult($query) {
            $formatted = [];
            foreach ($query as $row) {
                $month = date('F', mktime(0, 0, 0, $row->month, 10)); // get month name
                $sales = floatval($row->sales);
                $formatted[$month] = $sales; //get total sales per month
            }
            return $formatted;
        }
        
    public function getYearlySalesByDateRange($year) {
        $result = [];
        $selectedYear = Carbon::parse($year);

        //get selected year start and end
        $selectedYearStart = $selectedYear->copy()->startOfYear()->format('Y-m-d');
        $selectedYearEnd = $selectedYear->copy()->endOfYear()->format('Y-m-d');

        //get previous selected year start and end
        $selectedPreviousYearStart = $selectedYear->copy()->subYear()->startOfYear()->format('Y-m-d');
        $selectedPreviousYearEnd = $selectedYear->copy()->subYear()->endOfYear()->format('Y-m-d');

        
        $selected_Year = $selectedYear->copy()->format('Y');
        $previous_Year = $selectedYear->copy()->subYear()->format('Y');

        // Get sales data for last year
         $query_last_year = SalesDailyOuts::selectRaw('MONTH(sales_date) as month, SUM(sales_daily_out) as sales')
            ->whereBetween('sales_date', [$selectedPreviousYearStart, $selectedPreviousYearEnd])
            ->groupByRaw('MONTH(sales_date)')
            ->orderByRaw('MONTH(sales_date)')
            ->get();

        // Get sales data for the current year
        $query_current_year = SalesDailyOuts::selectRaw('MONTH(sales_date) as month, SUM(sales_daily_out) as sales')
            ->whereBetween('sales_date', [$selectedYearStart, $selectedYearEnd])
            ->groupByRaw('MONTH(sales_date)')
            ->orderByRaw('MONTH(sales_date)')
            ->get();

        // Format the last year and current year data
        if ($query_last_year->isNotEmpty()) {
            $result[strval($previous_Year)] = $this->formatQueryResult($query_last_year);
        }
        if ($query_current_year->isNotEmpty()) {
            $result[strval($selected_Year)] = $this->formatQueryResult($query_current_year);
        }

        return $result;
    }

    public function getMonthlySalesofWarehouses($year) {
        $result = [];
        $selectedYear = Carbon::parse($year);
        $selected_Year = $selectedYear->copy()->format('Y');

        //get selected year start and end
        $selectedYearStart = $selectedYear->copy()->startOfYear()->format('Y-m-d');
        $selectedYearEnd = $selectedYear->copy()->endOfYear()->format('Y-m-d');

        // Get sales data for the current year
        $query_current_year = SalesDailyOuts::selectRaw('MONTH(sales_date) as month, SUM(sales_daily_out) as sales')
            ->whereBetween('sales_date', [$selectedYearStart, $selectedYearEnd])
            ->groupByRaw('MONTH(sales_date)')
            ->orderByRaw('MONTH(sales_date)')
            ->get();

        // Function to format the query result
        
        if ($query_current_year->isNotEmpty()) {
            $result[strval($selected_Year)] = $this->formatQueryResults($query_current_year);
        }

        return $result;
    }


    public function getReportSalesSummary($year = '2024') {
        $totalDailyOutAmount = 0;
        $queryRawData = SalesDailyOuts::where('year_sales_target', $year)
            ->orderBy('sales_date')
            ->get();
        
        $monthlySalesData = $this->getMonthlySalesofWarehouses($year);
        $yearlySalesData = $this->getYearlySalesByDateRange($year);
        foreach ($queryRawData as $value) {
            $salesDailyOut = (float)$value["sales_daily_out"];
            if (!is_nan($salesDailyOut)) {
                $totalDailyOutAmount += $salesDailyOut;
            }
        }


        return $report_data = [
            "total_daily_out_amount"=>$totalDailyOutAmount,
            "yearly_sales_data"=>$yearlySalesData,
            "monthly_sales_data"=>$monthlySalesData,
        ];



    }
}
