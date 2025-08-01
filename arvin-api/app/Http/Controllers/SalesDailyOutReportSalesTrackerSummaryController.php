<?php

namespace App\Http\Controllers;

use App\Models\SalesDailyOutReportSalesTrackerSummary;
use App\Models\SalesDailyOutSettingsAnnualQuota;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;
use Illuminate\Support\Collection;
use App\Models\SalesDailyOutTrackers;
use App\Models\RefProductGroups;
use Illuminate\Support\Facades\Crypt;
use App\Models\UserAccessOrganizationRights;

class SalesDailyOutReportSalesTrackerSummaryController extends Controller
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
     * @param  \App\Models\SalesDailyOutReportSalesTrackerSummary  $salesDailyOutReportSalesTrackerSummary
     * @return \Illuminate\Http\Response
     */
    public function show(SalesDailyOutReportSalesTrackerSummary $salesDailyOutReportSalesTrackerSummary)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Models\SalesDailyOutReportSalesTrackerSummary  $salesDailyOutReportSalesTrackerSummary
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, SalesDailyOutReportSalesTrackerSummary $salesDailyOutReportSalesTrackerSummary)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Models\SalesDailyOutReportSalesTrackerSummary  $salesDailyOutReportSalesTrackerSummary
     * @return \Illuminate\Http\Response
     */
    public function destroy(SalesDailyOutReportSalesTrackerSummary $salesDailyOutReportSalesTrackerSummary)
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

    public function getYearlySalesByDateRange($year = null, $subsection_code = null,$access_subsection_codes,$product_group) {
        $result = [];
        $year = (string) $year;
        $selectedYear =  Carbon::createFromDate($year, 1, 1);

        //get selected year start and end
         $selectedYearStart = $selectedYear->copy()->startOfYear()->format('Y-m-d');
        $selectedYearEnd = $selectedYear->copy()->endOfYear()->format('Y-m-d');

        //get previous selected year start and end
        $selectedPreviousYearStart = $selectedYear->copy()->subYear()->startOfYear()->format('Y-m-d');
        $selectedPreviousYearEnd = $selectedYear->copy()->subYear()->endOfYear()->format('Y-m-d');

        
        $selected_Year = $selectedYear->copy()->format('Y');
        $previous_Year = $selectedYear->copy()->subYear()->format('Y');

        // Get sales data for last year
        $query_last_year = SalesDailyOutTrackers::selectRaw('MONTH(sales_date) as month, SUM(sales_daily_out) as sales')
            ->whereBetween('sales_date', [$selectedPreviousYearStart, $selectedPreviousYearEnd])
            ->where('ref_product_groups_description', $product_group)
            ->whereNull('deleted_at')
            ->when(isset($subsection_code), function ($query) use ($subsection_code) {
                return $query->where('subsection_code', $subsection_code);
            })
            ->groupByRaw('MONTH(sales_date)')
            ->orderByRaw('MONTH(sales_date)')
            ->get();

        // Get sales data for the current year
         $query_current_year = SalesDailyOutTrackers::selectRaw('MONTH(sales_date) as month, SUM(sales_daily_out) as sales')
            ->where('ref_product_groups_description', $product_group)
            ->whereNull('deleted_at')
            ->when(isset($subsection_code), function ($query) use ($subsection_code) {
                return $query->where('subsection_code', $subsection_code);
            }, function ($qry) use ($access_subsection_codes) {
                return $qry->whereIn('subsection_code', $access_subsection_codes);
            })
            ->whereBetween('sales_date', [$selectedYearStart, $selectedYearEnd])
            ->groupByRaw('MONTH(sales_date)')
            ->orderByRaw('MONTH(sales_date)')
            ->get();
         
        // Format the last year and current year data
        if ($query_last_year->isNotEmpty()) {
            $result[strval($previous_Year)] = $this->formatQueryResult($query_last_year);
        }else{
             $result[strval($previous_Year)] = [];
        }
        if ($query_current_year->isNotEmpty()) {
            $result[strval($selected_Year)] = $this->formatQueryResult($query_current_year);
        }else{
             $result[strval($selected_Year)] = [];
        }
        return $result;
    }

    public function getMonthlySalesofWarehouses($year=null,$code = null,$access_subsection_codes,$product_group) {
        $result = [];
        $year = (string) $year;
         $selectedYear = Carbon::parse($year);
        $selected_Year = $selectedYear->copy()->format('Y');
        //get selected year start and end
        $selectedYearStart = $selectedYear->copy()->startOfYear()->format('Y-m-d');
        $selectedYearEnd = $selectedYear->copy()->endOfYear()->format('Y-m-d');
        $query_current_year = SalesDailyOutTrackers::join('ref_sub_sections', 'sales_daily_out_trackers.subsection_code', '=', 'ref_sub_sections.code')
        ->where('ref_product_groups_description', $product_group)
        ->where('year_sales_target', $year)
        ->whereNull('sales_daily_out_trackers.deleted_at')
        ->select(
            'ref_sub_sections.description',
              'ref_sub_sections.type',
            'ref_sub_sections.code as subsection_code',
            DB::raw('MONTH(sales_date) as month'),
            DB::raw('SUM(sales_daily_out) as sales')
        )
         ->when(isset($code), function ($query) use ($code) {
            return $query->where('subsection_code', $code);
        }, function ($qry) use ($access_subsection_codes) {
                return $qry->whereIn('subsection_code', $access_subsection_codes);
            })
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
                // 'product_group' => $product_group,
                'january' => "--",
                'february' => "--",
                'march' => "--",
                'april' => "--",
                'may' => "--",
                'june' => "--",
                'july' => "--",
                'august' => "--",
                'september' => "--",
                'october' => "--",
                'november' => "--",
                'december' => "--",
                'total' => 0,
            ];

            foreach ($group as $item) {
                $monthName = strtolower(Carbon::create()->month($item->month)->format('F'));
                $monthlySales[$monthName] = $item->sales > 0 ? number_format($item->sales, 2) : "--";
                $monthlySales['total'] += $item->sales;
            }
            return $monthlySales;
        })->values()->all();
        // Function to format the query result
            
        return $results;
    }

      public function getReportSalesSummary(Request $request) {
        $page = $request->query('page');
        $limit = $request->query('limit');
        $query = $request->query('q');
        $filter = $request->query('f');
        $product_group = $request->query('pg');
        $code = $request->query('id');
        $user_code = $request->query('user_code');
         
        $totalDailyOutAmount = 0;

        $annual_set_subsections = UserAccessOrganizationRights::
        join('ref_sub_sections', 'user_access_organization_rights.subsection_code', '=', 'ref_sub_sections.code')
        ->where('user_id',$user_code)
        ->where('access_rights',1)
        ->when(isset($query), function ($qry) use ($query) {
            return $qry->where('ref_sub_sections.type', $query);
        },
        )
        ->get(['ref_sub_sections.type','ref_sub_sections.code','ref_sub_sections.description']);


        // Extract the subsection codes
        $access_subsection_codes = $annual_set_subsections->pluck('code')->toArray();

        if (!in_array($code, $access_subsection_codes)) {
            $code = null;
        }
        if($product_group === null){
              $response = [
                "total_daily_out_amount"=>0,
                "yearly_sales_line_chart_summary"=>[],
                "annual_sales_out_summary"=>[],
                "current_sales_mtd_ytd_subsections"=>[],
                "annual_sales_mtd_ytd_subsections"=>[],
                "annual_set_total_count_subsections"=>[],
                "annual_set_subsections"=>[],
            ];
            return Crypt::encryptString(json_encode($response));
        }

        $queryRawData = SalesDailyOutTrackers::where('year_sales_target', $filter)
            ->when(isset($code), function ($qry) use ($code) {
                return $qry->where('subsection_code', $code);
            }, function ($qry) use ($access_subsection_codes) {
                return $qry->whereIn('subsection_code', $access_subsection_codes);
            })
            ->where('ref_product_groups_description', $product_group)
            ->whereNull('deleted_at')
            ->orderBy('sales_date')
            ->get();
        $product = RefProductGroups::where('description',$product_group)->first();
        
        $annual_set_total_count_subsections = SalesDailyOutSettingsAnnualQuota::where('year_sales_target', $filter)
        ->where('ref_product_groups_code', $product['code'])->count();

        $yearly_sales_line_chart_summary = $this->getYearlySalesByDateRange($filter,$code,$access_subsection_codes,$product_group);
        $annual_sales_out_summary = $this->getMonthlySalesofWarehouses($filter,$code,$access_subsection_codes,$product_group);
        $annual_sales_mtd_ytd_subsections = $this->annualSalesMtdYtdSubSections($filter,$code,$access_subsection_codes,$product_group);
        $current_sales_mtd_ytd_subsections = $this->currentSalesMtdYtdSubSections($code,$access_subsection_codes,$product_group);
        $get_today_sales = $this->get_today_sales($code,$access_subsection_codes,$product_group);

        foreach ($queryRawData as $value) {
            $salesDailyOut = (float)$value["sales_daily_out"];
            if (!is_nan($salesDailyOut)) {
                $totalDailyOutAmount += $salesDailyOut;
            }
        }

        $response = [
            "total_daily_out_amount"=>$totalDailyOutAmount,
            "yearly_sales_line_chart_summary"=>$yearly_sales_line_chart_summary,
            "annual_sales_out_summary"=>$annual_sales_out_summary,
            "current_sales_mtd_ytd_subsections"=>$current_sales_mtd_ytd_subsections,
            "annual_sales_mtd_ytd_subsections"=>$annual_sales_mtd_ytd_subsections,
            "annual_set_total_count_subsections"=>$annual_set_total_count_subsections,
            "annual_set_subsections"=>$annual_set_subsections,
            "get_today_sales"=>$get_today_sales,
        ];
        return Crypt::encryptString(json_encode($response));
        // return $response;

    }


    public function currentSalesMtdYtdSubSections($code = null,$access_subsection_codes,$product_group) {
        $salesDailyOutTrackersController = new SalesDailyOutTrackersController();
        $currentDate = Carbon::now();
        $dateMonth = MainController::formatSingleDigitMonthOnly($currentDate); //format date to single digit month without the zero (0)
        $dateYear = MainController::formatYearOnly($currentDate); //format date to year
        $dateYear = MainController::formatYearOnly($currentDate); //format date to year
        $product = RefProductGroups::where('description',$product_group)->first();
        $subSectionsWithAnnualSalesQuota = SalesDailyOutSettingsAnnualQuota::join('ref_sub_sections', 'sales_daily_out_settings_annual_quotas.subsection_code', '=', 'ref_sub_sections.code')
            ->where('year_sales_target', $dateYear)
            ->where('ref_product_groups_code', $product['code'])
            ->whereNull('sales_daily_out_settings_annual_quotas.deleted_at')
            ->when(isset($code), function ($query) use ($code) {
             return $query->where('subsection_code', $code);
        }, function ($qry) use ($access_subsection_codes) {
                return $qry->whereIn('subsection_code', $access_subsection_codes);
            })
        ->get();

        $currentSalesMtdYtdSummary = [];
        foreach ($subSectionsWithAnnualSalesQuota as $subSection) {
            $currentMtdSummary = $salesDailyOutTrackersController->get_mtd($dateYear, $dateMonth, $subSection, $dateMonth,$product_group);
            $ytdSummary = $salesDailyOutTrackersController->get_final_ytd($dateYear, $dateMonth, $subSection, $dateMonth,$product_group);

            $currentMtdSummary['subsection'] = $subSection['description'];
            $currentMtdSummary['subsection_code'] = $subSection['subsection_code'];
            // $currentMtdSummary['product_group'] = $product_group;
            $currentMtdSummary['current_mtd'] = number_format($currentMtdSummary['mtdFinal'],2);
            $currentMtdSummary['current_ytd'] = number_format($ytdSummary['ytdFinal'],2);

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

    public function transformData($data) {
        $result = [];
        foreach ($data as $item) {
            $subsection = $item['subsection'];
            $month = $item['month'];
            $current_mtd = number_format($item['current_mtd'],2);
            $current_ytd = number_format($item['current_ytd']['ytdFinal'],2);
            if($current_mtd == '-100.00'){
                $current_mtd = '--';
                $current_ytd = '--';
            }
            if (!isset($result[$subsection])) {
                $result[$subsection] = [
                    'subsection' => $subsection
                ];
            }

            $result[$subsection]["{$month}_current_mtd"] = $current_mtd;
            $result[$subsection]["{$month}_current_ytd"] = $current_ytd;


        }
        return array_values($result);
    }



    public function annualSalesMtdYtdSubSections($year=null,$code =null,$access_subsection_codes,$product_group) {
        
        $salesDailyOutTrackersController = new SalesDailyOutTrackersController();
        $months = range(1, 12);
        //  $dateYear = MainController::formatYearOnly($year); //format date to year
        $product = RefProductGroups::where('description',$product_group)->first();
        $subSectionsWithAnnualSalesQuota = SalesDailyOutSettingsAnnualQuota::join('ref_sub_sections', 'sales_daily_out_settings_annual_quotas.subsection_code', '=', 'ref_sub_sections.code')
            ->where('year_sales_target', $year)
            ->where('ref_product_groups_code', $product['code'])
            ->when(isset($code), function ($query) use ($code) {
                return $query->where('subsection_code', $code);
            }, function ($qry) use ($access_subsection_codes) {
                    return $qry->whereIn('subsection_code', $access_subsection_codes);
                })
            ->get();
        $annualtSalesMtdYtdSummary = [];
        $result = [];
        
        foreach ($subSectionsWithAnnualSalesQuota as $subSection) {
            foreach ($months as  $dateMonth) {
                $currentMtdSummary = $salesDailyOutTrackersController->get_mtd($year, $dateMonth, $subSection, $dateMonth,$product_group);
                $ytdSummary = $salesDailyOutTrackersController->get_final_ytd($year, $dateMonth, $subSection, $dateMonth,$product_group);
                $monthName = strtolower(Carbon::create()->month($dateMonth)->format('F'));
                $currentMtdSummary['subsection'] = $subSection['description'];
                $currentMtdSummary['subsection_code'] = $subSection['subsection_code'];
                $currentMtdSummary['current_mtd'] = $currentMtdSummary['mtdFinal'];
                $currentMtdSummary['current_ytd'] = $ytdSummary;
                $currentMtdSummary['month'] = $monthName;

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
        $transformedData = $this->transformData($annualtSalesMtdYtdSummary);
        return $transformedData;
    }

    public function currentDaySalesSubSections($code = null,$access_subsection_codes,$product_group) {
        $salesDailyOutTrackersController = new SalesDailyOutTrackersController();
        $currentDate = Carbon::now();
        $dateMonth = MainController::formatSingleDigitMonthOnly($currentDate); //format date to single digit month without the zero (0)
        $dateYear = MainController::formatYearOnly($currentDate); //format date to year
        $dateYear = MainController::formatYearOnly($currentDate); //format date to year
        $product = RefProductGroups::where('description',$product_group)->first();
        $subSectionsWithAnnualSalesQuota = SalesDailyOutSettingsAnnualQuota::join('ref_sub_sections', 'sales_daily_out_settings_annual_quotas.subsection_code', '=', 'ref_sub_sections.code')
            ->where('year_sales_target', $dateYear)
            ->where('ref_product_groups_code', $product['code'])
            ->when(isset($code), function ($query) use ($code) {
             return $query->where('subsection_code', $code);
        }, function ($qry) use ($access_subsection_codes) {
                return $qry->whereIn('subsection_code', $access_subsection_codes);
            })
        ->get();

        $currentSalesMtdYtdSummary = [];
        foreach ($subSectionsWithAnnualSalesQuota as $subSection) {
            $currentMtdSummary = $salesDailyOutTrackersController->get_mtd($dateYear, $dateMonth, $subSection, $dateMonth,$product_group);
            $ytdSummary = $salesDailyOutTrackersController->get_final_ytd($dateYear, $dateMonth, $subSection, $dateMonth,$product_group);

            $currentMtdSummary['subsection'] = $subSection['description'];
            $currentMtdSummary['subsection_code'] = $subSection['subsection_code'];
            // $currentMtdSummary['product_group'] = $product_group;
            $currentMtdSummary['current_mtd'] = number_format($currentMtdSummary['mtdFinal'],2);
            $currentMtdSummary['current_ytd'] = number_format($ytdSummary['ytdFinal'],2);

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




    public function get_today_sales($code = null,$access_subsection_codes,$product_group) {
        $currentDate = Carbon::now()->format('Y-m-d');
        $today_sales = SalesDailyOutTrackers::join('ref_sub_sections', 'sales_daily_out_trackers.subsection_code', '=', 'ref_sub_sections.code')
            ->where('sales_daily_out_trackers.ref_product_groups_description',$product_group)
            ->where('sales_daily_out_trackers.sales_date',$currentDate)
            ->whereNull('sales_daily_out_trackers.deleted_at')
            ->when(isset($code), function ($query) use ($code) {
             return $query->where('subsection_code', $code);
        }, function ($qry) use ($access_subsection_codes) {
                return $qry->whereIn('subsection_code', $access_subsection_codes);
            })
        ->get();

        return $today_sales;

    }
}
