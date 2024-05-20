<?php

namespace App\Http\Controllers;

use App\Models\SalesDailyOutAnnualSalesRankingDetails;
use App\Models\SalesDailyOutAnnualSalesRanking;
use App\Models\RefSalesRankingPlacements;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Crypt;

class SalesDailyOutAnnualSalesRankingDetailsController extends Controller
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
        $fields = $request->validate([
            'sales_daily_out_annual_sales_rankings_code' => 'required',
            'ref_month_code' => 'required',
            'ref_sales_ranking_placement_code' => 'required',
            'placement' => 'required',
            'added_by' => 'required',
            'modified_by' => 'required',
        ]);

        try {
            $ref_month_code = (int)$fields['ref_month_code'];
        } catch (Exception $e) {
            // Handle the error, e.g., log it or set a default value
            $ref_month_code = 0; // Default value or appropriate fallback
        }

        $details_ranker_month = SalesDailyOutAnnualSalesRankingDetails::where('sales_daily_out_annual_sales_rankings_code',$fields['sales_daily_out_annual_sales_rankings_code'])
            ->where('ref_month_code', $ref_month_code)
            ->first();

        if($details_ranker_month->placement){
            $response = [
                    'message' => "There's already a ranking for this month. Please select other month.",
                    'result' => false,
                    'status' => 'warning',
                    'title' => 'Oppss!',
            ];
            return Crypt::encryptString(json_encode($response));
        }

        $details_ranker_month->update([
                'ref_sales_ranking_placement_code' => $fields["ref_sales_ranking_placement_code"],
                'placement' => $fields["placement"],
        ]);


        //this is the computation of current point in rank sales

        // $dataListSalesRankingDetails = SalesDailyOutAnnualSalesRankingDetails::where('sales_daily_out_annual_sales_rankings_code',$fields['sales_daily_out_annual_sales_rankings_code'])
        //     ->whereNotNull('placement')
        //     ->get();

        // $current_point = 0;        

        // foreach ($dataListSalesRankingDetails as  $value) {

        //     $ref_sales_ranking_placement_data = RefSalesRankingPlacements::where('ref_sales_rankings_code',$fields['sales_daily_out_annual_sales_rankings_code'])
        //         ->where('code', $value['ref_sales_ranking_placement_code'])
        //         ->first();

        //     $current_point+= $ref_sales_ranking_placement_data['value'];
        // }

        // $data = SalesDailyOutAnnualSalesRanking::where('code',$fields['sales_daily_out_annual_sales_rankings_code'])
        //     ->first();

        // $data->update([
        //         'current_point' =>  $current_point
        // ]);

        $response = [
            'result' => true,
            'status' => 'success',
            'title' => 'Success',
            'message' => "Ranking updated successfully",
        ];
        return Crypt::encryptString(json_encode($response));
    }

    /**
     * Display the specified resource.
     *
     * @param  \App\Models\SalesDailyOutAnnualSalesRankingDetails  $salesDailyOutAnnualSalesRankingDetails
     * @return \Illuminate\Http\Response
     */
    public function show(SalesDailyOutAnnualSalesRankingDetails $salesDailyOutAnnualSalesRankingDetails)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Models\SalesDailyOutAnnualSalesRankingDetails  $salesDailyOutAnnualSalesRankingDetails
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, SalesDailyOutAnnualSalesRankingDetails $salesDailyOutAnnualSalesRankingDetails)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Models\SalesDailyOutAnnualSalesRankingDetails  $salesDailyOutAnnualSalesRankingDetails
     * @return \Illuminate\Http\Response
     */
    public function destroy(SalesDailyOutAnnualSalesRankingDetails $salesDailyOutAnnualSalesRankingDetails)
    {
        //
    }
}
