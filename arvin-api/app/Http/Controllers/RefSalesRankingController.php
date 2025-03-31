<?php

namespace App\Http\Controllers;

use App\Http\Requests\SalesRankingRequest;
use Illuminate\Http\Request;
use App\Models\RefSalesRanking;
use App\Models\RefSalesRankingPlacements;
use Illuminate\Support\Facades\Crypt;

class RefSalesRankingController extends Controller
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
        $field = $request->validate([
            'description'      => 'required|unique:ref_sales_rankings,description',
            'value'            => 'required',
            'type'             => 'required',
            'added_by'         => 'required',
            'modified_by'      => 'required',
            'ranking_placement'=> 'required',
        ]);
        $field['code'] = MainController::generate_code('App\Models\RefSalesRanking',"code");
        $refSalesRanking        =  RefSalesRanking::create([
            'code'              =>  $field['code'] ,
            'description'       =>  $field['description'],
            'value'             =>  $field['value'],
            'type'              =>  $field['type'],  
            'added_by'          =>  $field['added_by'],
            'modified_by'       =>  $field['modified_by'],
        ]);
        if ($refSalesRanking) {
            foreach ($field["ranking_placement"] as $value) {
                $codeRefSalesRankingPlacements = MainController::generate_code('App\Models\RefSalesRankingPlacements',"code");
                RefSalesRankingPlacements::create([
                    'code'                     => $codeRefSalesRankingPlacements,
                    'ref_sales_rankings_code'  => $field['code'],
                    'description'              => $value->desc,
                    'value'                    => $value->val,
                    'added_by'                 => $field['added_by'],
                    'modified_by'              => $field['modified_by'],
                ]);
            }
        }else{
           return response([
                'message' => 'Something went wrong',
                'result'  => false,
                'status'  => 'failed',
                'title'   => 'Failed',
            ]);
        }

        return response([
            'message' => 'Sales ranking added successfully',
            'result'  => true,
            'status'  => 'success',
            'title'   => 'Success',
        ],200);

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
        $field = $request->validate([
            'code'      => 'required',
            'description'      => 'required', 
            'value'            => 'required',
            'type'             => 'required',
            'added_by'         => 'required',
            'modified_by'      => 'required',
            'ranking_placement'=> 'required',
        ]);
        $ranking_placement = $field['ranking_placement'];
        $ref_sale_ranking_data = RefSalesRanking::where('code',$id)
            ->first();
        $ref_sale_ranking_data->update([
                'description' => $field["description"],
                'value' => $field["value"],
        ]); 
         $get_ref_sales_ranking_placements =  RefSalesRankingPlacements::where('ref_sales_rankings_code',$field['code'])->get()->toArray();
        // Extract unique identifiers (e.g., 'id') from array2
        
        #array_column($get_ref_sales_ranking_placements, 'code');
        $id_ranking_placement = array_column($ranking_placement, 'code');

        $objectsToRemove = array_filter($get_ref_sales_ranking_placements, function($item) use ($id_ranking_placement) {
            return !in_array($item['code'], $id_ranking_placement);
        });

        if ($objectsToRemove) {
           RefSalesRankingPlacements::whereIn('code',array_column($objectsToRemove, 'code'))->removeat($field['modified_by']);
        }

        foreach ($ranking_placement as $ranking_placement_value) {
            if(isset($ranking_placement_value->code)){
                $value =  RefSalesRankingPlacements::where('code',$ranking_placement_value->code)->first();
                if ($value) {
                    $value->update([
                        'description' => $ranking_placement_value->description,
                        'value' => $ranking_placement_value->value,
                        'modified_by' => $field['modified_by']
                    ]);
                }
            }else{
                $codeRefSalesRankingPlacements = MainController::generate_code('App\Models\RefSalesRankingPlacements',"code");
                RefSalesRankingPlacements::create([
                    'code'                     => $codeRefSalesRankingPlacements,
                    'ref_sales_rankings_code'  => $field['code'],
                    'description'              => $ranking_placement_value->description,
                    'value'                    => $ranking_placement_value->value,
                    'added_by'                 => $field['added_by'],
                    'modified_by'              => $field['modified_by'],
                ]); 
            }
        }
        return response([
            'message' => 'Ranking settings updated successfully',
            'result'  => true,
            'status'  => 'success',
            'title'   => 'Success',
        ],200);
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

    public function get_ref_sales_ranking(Request $request){
        
        $page = $request->query('page');
        $limit = $request->query('limit');
        $query = $request->query('q');
        $filter = $request->query('f');
        $user_id = $request->query('uid');

        $queryBuilder = RefSalesRanking::whereNull('deleted_at');

        if (!empty($limit)) {
            if (!empty($query)) {
                $data_list = $queryBuilder->where(function ($queryBuilder) use ($query) {
                                $queryBuilder
                                    ->where('description', 'like', '%' . $query . '%')
                                    ->orWhere('value', 'like', '%' . $query . '%')
                                    ->orWhere('type', 'like', '%' . $query . '%');
                            })->paginate($limit);
            } else {
                $data_list = $queryBuilder->paginate($limit);
            }
        $response = [
            "dataList"=>$data_list,
            'result'=>True,
            'title'=>'Success',
            'status'=>'success',
            'message'=> 'Authentication successful.',
        ];
        return Crypt::encryptString(json_encode($response));

        }else{
            $data_list = $queryBuilder->get();
            return Crypt::encryptString(json_encode($data_list));
        }
        
       
        
    } 

}
