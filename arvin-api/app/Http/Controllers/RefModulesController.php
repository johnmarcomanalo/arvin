<?php

namespace App\Http\Controllers;

use App\Models\RefModules;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Crypt;

class RefModulesController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        $data = array();
        $data = RefModules::whereNull('deleted_at')->get();
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
            'link' => 'required',
            'added_by' => 'required',
            'modified_by' => 'required',
        ]);
        $existingRecord = RefModules::where('description', $fields['description'])
                            ->orWhere('link', $fields['link'])
                            ->first();

        if ($existingRecord) {
            if ($existingRecord->description == $fields['description'] && $existingRecord->link == $fields['link']) {
                return response([
                    'result' => true,
                    'status' => 'error',
                    'title' => 'Error',
                    'message' => 'Both description and link already exist.'
                ], 409);
            } elseif ($existingRecord->description == $fields['description']) {
                return response([
                    'result' => true,
                    'status' => 'error',
                    'title' => 'Error',
                    'message' => 'Description already exists.'
                ], 409);
            } elseif ($existingRecord->link == $fields['link']) {
                return response([
                    'result' => true,
                    'status' => 'error',
                    'title' => 'Error',
                    'message' => 'Link already exists.'
                ], 409);
            }
        } else {
                $fields['code'] = $this->generate_code();
                RefModules::create($fields);
                return response([
                        'result' => true,
                        'status' => 'success',
                        'title' => 'Success',
                        'message' => 'Record created successfully.'
                ], 201);
        }
    }

    /**
     * Display the specified resource.
     *
     * @param  \App\Models\RefModules  $refModules
     * @return \Illuminate\Http\Response
     */
    public function show(RefModules $refModules)
    {
       
    }   

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Models\RefModules  $refModules
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, RefModules $refModules)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Models\RefModules  $refModules
     * @return \Illuminate\Http\Response
     */
    public function destroy(RefModules $refModules)
    {
        //
    }
    public function generate_code(){
        $code = 1;
        $current_date = date('Y-m-d');
         $latest_code = RefModules::latest('code')->first('code')->code ?? NULL;
        if(!empty($latest_code)){
            $code = $latest_code + 100;
        }
        return $code;
    }
    public function get_refence_modules (Request $request)
    {
        $page = $request->query('page');
        $limit = $request->query('limit');
        $query = $request->query('q');
        $filter = $request->query('f');

        $dataListQuery = RefModules::whereNull('deleted_at');

        if (isset($query)) {
            $dataListQuery->where(function($q) use ($query) {
                $q->where('description', 'like', '%' . $query . '%')
                ->orWhere('link', 'like', '%' . $query . '%');
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
