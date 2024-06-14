<?php

namespace App\Http\Controllers;

use App\Models\SalesDailyOutReportSalesSummary;
use App\Models\SalesDailyOutAnnualSettingsSales;
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
        $year = (string) $year;
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
        $year = (string) $year;
        $selectedYear = Carbon::parse($year);
        $selected_Year = $selectedYear->copy()->format('Y');

        //get selected year start and end
        $selectedYearStart = $selectedYear->copy()->startOfYear()->format('Y-m-d');
        $selectedYearEnd = $selectedYear->copy()->endOfYear()->format('Y-m-d');

        $query_current_year = SalesDailyOuts::join('ref_sub_sections', 'sales_daily_outs.subsection_code', '=', 'ref_sub_sections.code')
        ->select(
            'ref_sub_sections.description',
              'ref_sub_sections.type',
            'ref_sub_sections.code as subsection_code',
            DB::raw('MONTH(sales_date) as month'),
            DB::raw('SUM(sales_daily_out) as sales')
        )
          ->groupBy('ref_sub_sections.description', 'ref_sub_sections.type', 'ref_sub_sections.code', DB::raw('MONTH(sales_date)'))
        ->get();
        $results = $query_current_year->groupBy('description')->map(function ($group) {
            $total = 0;
            $description = $group->first()->description;
            $type = $group->first()->type;
            $subsection_code = $group->first()->subsection_code;
            $monthlySales = [
                'description' => $description,
                'type' => $type,
                'subsection_code' => $subsection_code,
                'january' => 0,
                'february' => 0,
                'march' => 0,
                'april' => 0,
                'may' => 0,
                'june' => 0,
                'july' => 0,
                'august' => 0,
                'september' => 0,
                'october' => 0,
                'november' => 0,
                'december' => 0,
                'total' => 0,
            ];

            foreach ($group as $item) {
                $monthName = strtolower(Carbon::create()->month($item->month)->format('F'));
                $monthlySales[$monthName] = $item->sales;
                $monthlySales['total'] += ($item->sales);
            }

            return $monthlySales;
        })->values()->all();
        // Function to format the query result
        
        return $results;
    }

    public function getReportSalesSummary($year = 2024) {
        $totalDailyOutAmount = 0;
        $queryRawData = SalesDailyOuts::where('year_sales_target', $year)
            ->orderBy('sales_date')
            ->get();
        
        $annual_sales_out_summary = $this->getMonthlySalesofWarehouses($year);
        $yearly_sales_line_chart_summary = $this->getYearlySalesByDateRange($year);
        $current_sales_mtd_ytd_subsections = $this->currentSalesMtdYtdSubSections();
        $annual_sales_mtd_ytd_subsections = $this->annualSalesMtdYtdSubSections($year);

        foreach ($queryRawData as $value) {
            $salesDailyOut = (float)$value["sales_daily_out"];
            if (!is_nan($salesDailyOut)) {
                $totalDailyOutAmount += $salesDailyOut;
            }
        }

        return $report_data = [
            // "total_daily_out_amount"=>$totalDailyOutAmount,
            // "yearly_sales_line_chart_summary"=>$yearly_sales_line_chart_summary,
            // "annual_sales_out_summary"=>$annual_sales_out_summary,
            // "current_sales_mtd_ytd_subsections"=>$current_sales_mtd_ytd_subsections,
            "annual_sales_mtd_ytd_subsections"=>$annual_sales_mtd_ytd_subsections,
        ];

    }
    public function currentSalesMtdYtdSubSections() {
        $salesDailyOutsController = new SalesDailyOutsController();
        $currentDate = Carbon::now();
        $dateMonth = MainController::formatSingleDigitMonthOnly($currentDate); //format date to single digit month without the zero (0)
        $dateYear = MainController::formatYearOnly($currentDate); //format date to year
        $subSectionsWithAnnualSalesQuota = SalesDailyOutAnnualSettingsSales::where('year_sales_target', $dateYear)->get();

        $currentSalesMtdYtdSummary = [];
        foreach ($subSectionsWithAnnualSalesQuota as $subSection) {
            $currentMtdSummary = $salesDailyOutsController->get_mtd($dateYear, $dateMonth, $subSection, $dateMonth);
            $ytdSummary = $salesDailyOutsController->get_final_mtd($dateYear, $dateMonth, $subSection, $dateMonth);

            $currentMtdSummary['subsection'] = $subSection['subsection'];
            $currentMtdSummary['subsection_code'] = $subSection['subsection_code'];
            $currentMtdSummary['current_mtd'] = $currentMtdSummary['mtdFinal'];
            $currentMtdSummary['current_ytd'] = $ytdSummary;

            if (isset($currentMtdSummary['mtd_data_list'])) {
                unset($currentMtdSummary['mtd_data_list']);
                unset($currentMtdSummary['mtdFinal']);
                unset($currentMtdSummary['mtdTotalDailyQoutaAmount']);
                unset($currentMtdSummary['mtdTotalDailyOutAmount']);
                unset($currentMtdSummary['mtdTotalStatusDailyTarget']);
            }

            $currentSalesMtdYtdSummary[] = $currentMtdSummary;    

        }
        return $currentSalesMtdYtdSummary;
    }

    public function annualSalesMtdYtdSubSections($year) {
        $salesDailyOutsController = new SalesDailyOutsController();
        $months = range(1, 12);
        $dateYear = MainController::formatYearOnly($year); //format date to year
        $subSectionsWithAnnualSalesQuota = SalesDailyOutAnnualSettingsSales::where('year_sales_target', $dateYear)->get();
        $annualtSalesMtdYtdSummary = [];
        $result = [];
        
        foreach ($subSectionsWithAnnualSalesQuota as $subSection) {
        foreach ($months as  $dateMonth) {
            $currentMtdSummary = $salesDailyOutsController->get_mtd($dateYear, $dateMonth, $subSection, $dateMonth);
            $ytdSummary = $salesDailyOutsController->get_final_mtd($dateYear, $dateMonth, $subSection, $dateMonth);

            $currentMtdSummary['subsection'] = $subSection['subsection'];
            $currentMtdSummary['subsection_code'] = $subSection['subsection_code'];
            $currentMtdSummary['current_mtd'] = $currentMtdSummary['mtdFinal'];
            $currentMtdSummary['current_ytd'] = $ytdSummary;
            $currentMtdSummary['month'] = $monthName = Carbon::create()->month($dateMonth)->format('F');

            if (isset($currentMtdSummary['mtd_data_list'])) {
                unset($currentMtdSummary['mtd_data_list']);
                unset($currentMtdSummary['mtdFinal']);
                unset($currentMtdSummary['mtdTotalDailyQoutaAmount']);
                unset($currentMtdSummary['mtdTotalDailyOutAmount']);
                unset($currentMtdSummary['mtdTotalStatusDailyTarget']);
            }

            $annualtSalesMtdYtdSummary[] = $currentMtdSummary;    
            }
        }
        
        return $annualtSalesMtdYtdSummary;
    }
}
