<?php

namespace App\Http\Controllers;

use App\Models\RefDepartments;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Crypt;

class RefDepartmentsController extends Controller
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
        //
    }

    /**
     * Display the specified resource.
     *
     * @param  \App\Models\RefDepartments  $refDepartments
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
     * @param  \App\Models\RefDepartments  $refDepartments
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, RefDepartments $refDepartments)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Models\RefDepartments  $refDepartments
     * @return \Illuminate\Http\Response
     */
    public function destroy(RefDepartments $refDepartments)
    {
        //
    }

    public function do_show($id){
        $data = RefDepartments::where('team_code','=',$id)->get();
        if(empty($data)){
         $data = array();
        }
        return $data;
    }
}
