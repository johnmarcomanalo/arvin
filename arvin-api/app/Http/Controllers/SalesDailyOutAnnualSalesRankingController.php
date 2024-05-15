<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\SalesDailyOutAnnualSalesRanking;
use App\Models\RefMonths;
use App\Models\RefSalesRanking;
use App\Models\SalesDailyOutAnnualSalesRankingDetails;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\Crypt;

class SalesDailyOutAnnualSalesRankingController extends Controller
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
            'type' => 'required',
            'ranker_code' => 'required',
            'rank_code' => 'required',
            'added_by' => 'required',
            'modified_by' => 'required',
        ]);
        $count = SalesDailyOutAnnualSalesRanking::where('type',$fields['type'])
            ->where('ranker_code',$fields['ranker_code'])
            ->where('rank_code',$fields['rank_code'])
            ->count();
        if($count > 0){
            $response = [
                    'message' => "Ranker already exist in this ranking.",
                    'result' => false,
                    'status' => 'warning',
                    'title' => 'Oppss!',
                ];
             return Crypt::encryptString(json_encode($response));
        }
        $code = MainController::generate_code('App\Models\SalesDailyOutAnnualSalesRanking',"code");
        $months = RefMonths::get();
        $collection_of_months = collect($months);
        $point_details = $collection_of_months->map(function ($item) {
            return [
                'description' => ucfirst(strtolower($item['description'])),
                'ref_month_code' => $item['value'],
                'value' => 0 // Static value of 0
            ];
        });
        SalesDailyOutAnnualSalesRanking::create([
            'code' => $code,
            'type' => "subsection",
            'ranker_code' => $fields["ranker_code"],
            'rank_code' => $fields["rank_code"],
            'current_point' => 0,
            'added_by' => $fields["added_by"],
            'modified_by' => $fields["modified_by"],
        ]);

        foreach ($point_details as $value) {
            $annual_sales_ranking_details_code = MainController::generate_code('App\Models\SalesDailyOutAnnualSalesRankingDetails',"code");
            SalesDailyOutAnnualSalesRankingDetails::create([
                'code' => $annual_sales_ranking_details_code,
                'sales_daily_out_annual_sales_rankings_code' => $code,
                'description' => $value["description"],
                'ref_month_code' => $value["ref_month_code"],
                'value' => $value["value"],
                'added_by' => $fields["added_by"],
                'modified_by' => $fields["modified_by"],
            ]);
        }

        $response = [
            'message' => 'Target sales added successfully',
            'result' => true,
            'status' => 'success',
            'title' => 'Success',
        ]; 
        return Crypt::encryptString(json_encode($response));
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        $dataList =  SalesDailyOutAnnualSalesRanking::whereRankCode($id)->get();
        $reference_sales_ranking_data =  RefSalesRanking::whereCode($id)->first();
        if(count($dataList) > 0){
            foreach ($dataList as $data_value) {
                $data =  SalesDailyOutAnnualSalesRankingDetails::whereSalesDailyOutAnnualSalesRankingsCode($data_value['code'])->get();
                $data_value['details'] = $data;
            }   
            $response = [
                'rank_code' => $reference_sales_ranking_data['code'],
                'target_point' => $reference_sales_ranking_data['value'],
                'dataList' => $dataList,
                'dataListCount' => count($dataList),
                'result'=>True,
                'title'=>'Success',
                'status'=>'success',
                'message'=> 'Generated succesfully',
            ];
        return Crypt::encryptString(json_encode($response));
        }else{
            $response = [
                'rank_code' => $reference_sales_ranking_data['code'],
                'target_point' => $reference_sales_ranking_data['value'],
                'dataList' => [],
                'dataListCount' => 0,
                'result'=>True,
                'title'=>'Info',
                'status'=>'info',
                'message'=> 'No rankers found, please add ranker.',
            ];
        return Crypt::encryptString(json_encode($response));
        }
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
}
