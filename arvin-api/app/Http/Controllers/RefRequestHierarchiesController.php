<?php

namespace App\Http\Controllers;

use App\Models\RefRequestHierarchies;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Crypt;

class RefRequestHierarchiesController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        $data = array();
        $data = RefRequestHierarchies::whereNull('deleted_at')->get();
        if(!empty($data)){
          return Crypt::encryptString(json_encode($data));
        }
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
            'description' => 'required',
            'request_type_code' => 'required',
            'hierarchy_structure' => 'required',
            'added_by' => 'required',
            'modified_by' => 'required',
        ]);
        $existingRecord = RefRequestHierarchies::where('description', $fields['description'])
            ->where('request_type_code', $fields['request_type_code'])                    
            // ->where('hierarchy', $fields['hierarchy'])                    
            ->first();

        if ($existingRecord) {
            return response([
                'result' => true,
                'status' => 'error',
                'title' => 'Error',
                'message' => 'Hierarchy already exists.'
            ], 409);
        } else {
                $fields['code'] = $this->generate_code();
                $fields['hierarchy_structure'] = json_encode($fields['hierarchy_structure']);
                RefRequestHierarchies::create($fields);
                return response([
                        'result' => true,
                        'status' => 'success',
                        'title' => 'Success',
                        'message' => 'Request Hierarchy added successfully.'
                ], 201);
        }
    }

    /**
     * Display the specified resource.
     *
     * @param  \App\Models\RefRequestHierarchies  $refRequestHierarchies
     * @return \Illuminate\Http\Response
     */
    public function show(RefRequestHierarchies $refRequestHierarchies)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Models\RefRequestHierarchies  $refRequestHierarchies
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, RefRequestHierarchies $refRequestHierarchies)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Models\RefRequestHierarchies  $refRequestHierarchies
     * @return \Illuminate\Http\Response
     */
    public function destroy(RefRequestHierarchies $refRequestHierarchies)
    {
        //
    }

    public function generate_code(){
        $code = 1;
        $current_date = date('Y-m-d');
        $latest_code = RefRequestHierarchies::latest('code')->first('code')->code ?? NULL;
        if(!empty($latest_code)){
            $code = $latest_code + 1;
        }
        return $code;
    }

    public function get_ref_request_hierarchy (Request $request)
    {
        $page = $request->query('page');
        $limit = $request->query('limit');
        $query = $request->query('q');
        $filter = $request->query('f');

        $dataListQuery = RefRequestHierarchies::whereNull('deleted_at');

        if (isset($query)) {
            $dataListQuery->where(function($q) use ($query) {
                $q->where('description', 'like', '%' . $query . '%')
                ->orWhere('type', 'like', '%' . $query . '%');
            });
        }

        $data_list = $dataListQuery->paginate($limit, ['*'], 'page', $page);
        $response = [
                "dataList"=>$data_list,
                'result'=>True,
                'title'=>'Success',
                'status'=>'success',
                'message'=> '',
        ];
        return Crypt::encryptString(json_encode($response));
    }
}
