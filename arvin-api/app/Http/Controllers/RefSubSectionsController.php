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
    public function show($id)
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
            $data = RefSubSections::where('section_code', '=', $id)->get();
        } else {
            $data = RefSubSections::all();
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

}
