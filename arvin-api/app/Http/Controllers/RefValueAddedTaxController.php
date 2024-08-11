<?php

namespace App\Http\Controllers;

use App\Models\RefValueAddedTax;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Crypt;

class RefValueAddedTaxController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        $data = array();
        $data = RefValueAddedTax::whereNull('deleted_at')->get();
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
            'added_by' => 'required',
            'modified_by' => 'required',
        ]);
        $existingRecord = RefValueAddedTax::where('description', $fields['description'])
            ->first();

        if ($existingRecord) {
            return response([
                'result' => true,
                'status' => 'error',
                'title' => 'Error',
                'message' => 'VAT already exists.'
            ], 409);
        } else {
            $fields['code'] = $this->generate_code();
            RefValueAddedTax::create($fields);
            return response([
                    'result' => true,
                    'status' => 'success',
                    'title' => 'Success',
                    'message' => 'VAT added successfully.'
            ], 201);
        }
    }

    /**
     * Display the specified resource.
     *
     * @param  \App\Models\RefValueAddedTax  $refValueAddedTax
     * @return \Illuminate\Http\Response
     */
    public function show(RefValueAddedTax $refValueAddedTax)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Models\RefValueAddedTax  $refValueAddedTax
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, RefValueAddedTax $refValueAddedTax)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Models\RefValueAddedTax  $refValueAddedTax
     * @return \Illuminate\Http\Response
     */
    public function destroy(RefValueAddedTax $refValueAddedTax)
    {
        //
    }

    public function generate_code(){
        $code = 1;
        $current_date = date('Y-m-d');
        $latest_code = RefValueAddedTax::latest('code')->first('code')->code ?? NULL;
        if(!empty($latest_code)){
            $code = $latest_code + 1;
        }
        return $code;
    }

    public function get_ref_value_added_tax (Request $request)
    {
        $page = $request->query('page');
        $limit = $request->query('limit');
        $query = $request->query('q');
        $filter = $request->query('f');

        $dataListQuery = RefValueAddedTax::whereNull('deleted_at');

        if (isset($query)) {
            $dataListQuery->where(function($q) use ($query) {
                $q->where('description', 'like', '%' . $query . '%');
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
