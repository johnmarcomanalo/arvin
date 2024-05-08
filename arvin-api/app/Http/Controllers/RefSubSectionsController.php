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

        $data = RefSubSections::where('section_code','=',$id)->get();
        if(empty($data)){
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

}
