<?php

namespace App\Http\Controllers;

use App\Models\RefSubComponents;
use Illuminate\Http\Request;
use App\Models\RefComponents;
use App\Models\RefModules;
use Illuminate\Support\Facades\Crypt;

class RefSubComponentsController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        $data = array();
        $data = RefSubComponents::whereNull('ref_components.deleted_at')->get( );
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
            'component_code' => 'required',
            'description' => 'required',
            'link' => 'required',
            'added_by' => 'required',
            'modified_by' => 'required',
        ]);
        $existingRecord = RefSubComponents::where('description', $fields['description'])
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
                $fields['code'] = $this->generate_code($fields['component_code'] );
                RefSubComponents::create($fields);
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
     * @param  \App\Models\RefSubComponents  $refSubComponents
     * @return \Illuminate\Http\Response
     */
    public function show(RefSubComponents $refSubComponents)
    {

    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Models\RefSubComponents  $refSubComponents
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, RefSubComponents $refSubComponents)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Models\RefSubComponents  $refSubComponents
     * @return \Illuminate\Http\Response
     */
    public function destroy(RefSubComponents $refSubComponents)
    {
        //
    }

    public function generate_code($component_code){
        $code = $component_code + 000;
        $current_date = date('Y-m-d');
        $latest_code = RefSubComponents::where('component_code',$component_code)->latest('code')->first('code')->code ?? NULL;
        if(!empty($latest_code)){
            $code = $latest_code + 001;
        }
        return $code;
    }

    public function get_refence_subcomponents (Request $request)
    {
        $page = $request->query('page', 1); // Default to page 1 if not provided
        $limit = $request->query('limit', 10); // Default to 10 items per page if not provided
        $query = $request->query('q');
        $filter = $request->query('f');              

        // Ensure the join is correct and the table names and column names are valid
        $dataListQuery = RefSubComponents::join('ref_components', 'ref_sub_components.component_code', '=', 'ref_components.code')
            ->join('ref_modules', 'ref_sub_components.module_code', '=', 'ref_modules.code')
            ->whereNull('ref_components.deleted_at');

        if (isset($query)) {
            $dataListQuery->where(function($q) use ($query) {
                $q->where('ref_sub_components.description', 'like', '%' . $query . '%')
                    ->orWhere('ref_sub_components.link', 'like', '%' . $query . '%');
            });
        }

        $data_list = $dataListQuery->paginate($limit, [
            'ref_sub_components.*',
            'ref_modules.description as module_description',
            'ref_components.description as component_description'
        ], 'page', $page);

        $response = [
            "dataList" => $data_list,
            'result' => true,
            'title' => 'Success',
            'status' => 'success',
            'message' => '',
        ];

        return Crypt::encryptString(json_encode($response));
    }
}
