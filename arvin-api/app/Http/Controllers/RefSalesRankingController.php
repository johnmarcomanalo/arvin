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
        $request->validate([
            'description'      => 'required|unique:ref_sales_rankings,description',
            'value'            => 'required',
            'type'             => 'required',
            'added_by'         => 'required',
            'modified_by'      => 'required',
            'ranking_placement'=> 'required',
        ]);
        $requestReponse         = $request->except(['ranking_placement']);
        $requestReponse['code'] = MainController::generate_code('App\Models\RefSalesRanking',"code");
        $refSalesRanking        =  RefSalesRanking::create($requestReponse);

        if ($refSalesRanking) {
            foreach (json_decode($request->input('ranking_placement'),true) as $key => $value) {
                $codeRefSalesRankingPlacements = MainController::generate_code('App\Models\RefSalesRankingPlacements',"code");
                RefSalesRankingPlacements::create([
                    'code'                     => $codeRefSalesRankingPlacements,
                    'ref_sales_rankings_code'  => $requestReponse['code'],
                    'description'              => $value['desc'],
                    'value'                    => $value['val'],
                    'added_by'                 => $requestReponse['added_by'],
                    'modified_by'              => $requestReponse['modified_by'],
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

    public function get_ref_sales_ranking(Request $request){
    
        $page = $request->query('page');
        $limit = $request->query('limit');
        $query = $request->query('q');
        $filter = $request->query('f');
        $user_id = $request->query('uid');

        $queryBuilder = RefSalesRanking::whereNull('deleted_at');

        if ($limit) {
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
        }else{
            $data_list = $queryBuilder->get();
        }
        
       
         $response = [
            "dataList"=>$data_list,
            'result'=>True,
            'title'=>'Success',
            'status'=>'success',
            'message'=> 'Authentication successful.',
        ];

        return $response;
        return Crypt::encryptString(json_encode($response));
    } 

}
