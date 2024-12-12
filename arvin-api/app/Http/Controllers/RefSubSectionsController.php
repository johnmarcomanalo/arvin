<?php

namespace App\Http\Controllers;

use App\Models\RefSubSections;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Crypt;

class RefSubSectionsController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index($id = null)
    {
        return Crypt::encryptString($this->do_show($id));
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
            'section_code' => 'required',
            'description' => 'required',
            'type' => 'required',
            'added_by' => 'required',
            'modified_by' => 'required',
        ]);
        $existingRecord = RefSubSections::where('section_code', $fields['section_code'])
            ->where('description', $fields['description'])
            ->where('type', $fields['type'])
            ->first();

        if ($existingRecord) {
            return response([
                'result' => true,
                'status' => 'error',
                'title' => 'Error',
                'message' => 'Subsection  already exists.'
            ], 409);
        } else {
            $fields['code'] = $this->generate_code();
            RefSubSections::create($fields);
            return response([
                    'result' => true,
                    'status' => 'success',
                    'title' => 'Success',
                    'message' => 'Subsection  added successfully.'
            ], 201);
        }
    }

    /**
     * Display the specified resource.
     *
     * @param  \App\Models\RefSubSections  $refSubSections
     * @return \Illuminate\Http\Response
     */
    public function show($id = null)
    {
        return Crypt::encryptString($this->do_show($id));
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Models\RefSubSections  $refSubSections
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, RefSubSections $refSubSections)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Models\RefSubSections  $refSubSections
     * @return \Illuminate\Http\Response
     */
    public function destroy(RefSubSections $refSubSections)
    {
        //
    }
    public function do_show($id){
        if (isset($id)) {
            $data = RefSubSections::where('section_code', '=', $id)->orderBy('description', 'asc')->get();
        } else {
            $data = RefSubSections::orderBy('description', 'asc')->get();
        }

        if ($data->isEmpty()) {
            $data = array();
        }
        return $data;
    }


    public function get_subsection($id){
        $data = RefSubSections::where('code',$id)->first();
        if(empty($data)){
         $data = array();
        }
        return Crypt::encryptString($data);
    }

    public function generate_code(){
        $code = 1;
        $current_date = date('Y-m-d');
        $latest_code = RefSubSections::latest('code')->first('code')->code ?? NULL;
        if(!empty($latest_code)){
            $code = $latest_code + 1;
        }
        return $code;
    }



    public function get_refence_subsections(Request $request)
    {
        $page = $request->query('page', 1); // Default to page 1 if not provided
        $limit = $request->query('limit', 10); // Default to 10 items per page if not provided
        $query = $request->query('q');
        $filter = $request->query('f');              

        // Ensure the join is correct and the table names and column names are valid
        $dataListQuery = RefSubSections::whereNull('deleted_at');

        if (isset($query)) {
            $dataListQuery->where(function($q) use ($query) {
                $q->where('description', 'like', '%' . $query . '%');
            });
        }

        $data_list = $dataListQuery->paginate($limit, [ '*' ], 'page', $page);

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
