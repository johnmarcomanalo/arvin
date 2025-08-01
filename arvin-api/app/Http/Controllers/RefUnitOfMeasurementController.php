<?php

namespace App\Http\Controllers;

use App\Models\RefUnitOfMeasurement;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Crypt;   

class RefUnitOfMeasurementController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        $data = array();
        $data = RefUnitOfMeasurement::whereNull('deleted_at')->get();
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
            'type' => 'required',
            'added_by' => 'required',
            'modified_by' => 'required',
        ]);
        $existingRecord = RefUnitOfMeasurement::where('description', $fields['description'])
            ->where('type', $fields['type'])                    
            ->first();

        if ($existingRecord) {
            return response([
                'result' => true,
                'status' => 'error',
                'title' => 'Error',
                'message' => 'Unit of measurement already exists.'
            ], 409);
        } else {
                $fields['code'] = $this->generate_code();
                RefUnitOfMeasurement::create($fields);
                return response([
                        'result' => true,
                        'status' => 'success',
                        'title' => 'Success',
                        'message' => 'Unit of measurement added successfully.'
                ], 201);
        }
    }

    /**
     * Display the specified resource.
     *
     * @param  \App\Models\RefUnitOfMeasurement  $RefUnitOfMeasurement
     * @return \Illuminate\Http\Response
     */
    public function show(RefUnitOfMeasurement $RefUnitOfMeasurement)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Models\RefUnitOfMeasurement  $RefUnitOfMeasurement
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, $id)
    {
        $fields = $request->validate([
            'modified_by' => 'required',
            'code' => 'required',
            'description' => 'required',
            'type' => 'required',
        ]);
        $data = RefUnitOfMeasurement::where('code','=',$id)->first();
        if(empty($data)){
            $response = [
                'result' => false,
                'icon' => 'error',
                'message' => 'No data found!',
            ];
            return response($response, 404);
        }

        $data->update([
            'modified_by' => $fields['modified_by'],
            'description' => $fields['description'],
            'type' => $fields['type'],
        ]);
        $response = [
            'message' => '',
            'result' => true,
            'icon' => 'success',
            'title' => 'Successfully Updated!',
        ];

        return response($response, 200);
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Models\RefUnitOfMeasurement  $RefUnitOfMeasurement
     * @return \Illuminate\Http\Response
     */
    public function destroy(RefUnitOfMeasurement $RefUnitOfMeasurement)
    {
        //
    }

    public function generate_code(){
        $code = 1;
        $current_date = date('Y-m-d');
        $latest_code = RefUnitOfMeasurement::latest('code')->first('code')->code ?? NULL;
        if(!empty($latest_code)){
            $code = $latest_code + 1;
        }
        return $code;
    }

    public function get_ref_unit_of_measurement (Request $request)
    {
        $page = $request->query('page');
        $limit = $request->query('limit');
        $query = $request->query('q');
        $filter = $request->query('f');

        $dataListQuery = RefUnitOfMeasurement::whereNull('deleted_at');

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
