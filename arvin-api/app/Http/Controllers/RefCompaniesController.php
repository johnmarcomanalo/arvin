<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\RefCompanies;
use Illuminate\Support\Facades\Crypt;

class RefCompaniesController extends Controller
{
 /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        $data = array();
        $data = RefCompanies::all();
        return Crypt::encryptString(json_encode($data));
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
     * @param  \App\Models\RefCompanies  $refCompanies
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        $data = array();
        $data = RefCompanies::all();
        return Crypt::encryptString(json_encode($data));
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Models\RefCompanies  $refCompanies
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, RefCompanies $refCompanies)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Models\RefCompanies  $refCompanies
     * @return \Illuminate\Http\Response
     */
    public function destroy(RefCompanies $refCompanies)
    {
        //
    }
}
