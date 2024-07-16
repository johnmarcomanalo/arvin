<?php

namespace App\Http\Controllers;

use App\Models\RefComponents;
use Illuminate\Http\Request;
use App\Models\RefModules;
use Illuminate\Support\Facades\Crypt;

class RefComponentsController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        $data = array();
        $data = RefComponents::whereNull('ref_components.deleted_at')->get( );
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
            'module_code' => 'required',
            'description' => 'required',
            'link' => 'required',
            'added_by' => 'required',
            'modified_by' => 'required',
        ]);
         $existingRecord = RefComponents::where('description', $fields['description'])
                            ->where('module_code', $fields['module_code'])
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
                $fields['code'] = $this->generate_code($fields['module_code'] );
                RefComponents::create($fields);
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
     * @param  \App\Models\RefComponents  $refComponents
     * @return \Illuminate\Http\Response
     */
    public function show(RefComponents $refComponents)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Models\RefComponents  $refComponents
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, RefComponents $refComponents)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Models\RefComponents  $refComponents
     * @return \Illuminate\Http\Response
     */
    public function destroy(RefComponents $refComponents)
    {
        //
    }
    public function generate_code($module_code){
        $code = $module_code + 000;
        $current_date = date('Y-m-d');
        $latest_code = RefComponents::where('module_code',$module_code)->latest('code')->first('code')->code ?? NULL;
        if(!empty($latest_code)){
            $code = $latest_code + 1;
        }
        return $code;
    }
    public function get_refence_components (Request $request)
    {
        $page = $request->query('page');
        $limit = $request->query('limit');
        $query = $request->query('q');
        $filter = $request->query('f');              

        $dataListQuery = RefComponents::join('ref_modules','ref_components.module_code','=','ref_modules.code')
        ->whereNull('ref_components.deleted_at');

        if (isset($query)) {
            $dataListQuery->where(function($q) use ($query) {
                $q->where('ref_components.description', 'like', '%' . $query . '%')
                ->orWhere('ref_components.link', 'like', '%' . $query . '%');
            });
        }

        $data_list = $dataListQuery->paginate($limit, ['ref_components.*','ref_modules.description as module_description'], 'page', $page);
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
