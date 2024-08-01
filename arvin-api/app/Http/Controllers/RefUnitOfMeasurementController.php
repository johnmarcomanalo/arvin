<?php

namespace App\Http\Controllers;

use App\Models\RefUnitOfMeasurement;
use Illuminate\Http\Request;

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
        $data = RefUnitofMeasurement::whereNull('deleted_at')->get();
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
        //
    }

    /**
     * Display the specified resource.
     *
     * @param  \App\Models\RefUnitofMeasurement  $refUnitofMeasurement
     * @return \Illuminate\Http\Response
     */
    public function show(RefUnitofMeasurement $refUnitofMeasurement)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Models\RefUnitofMeasurement  $refUnitofMeasurement
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, RefUnitofMeasurement $refUnitofMeasurement)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Models\RefUnitofMeasurement  $refUnitofMeasurement
     * @return \Illuminate\Http\Response
     */
    public function destroy(RefUnitofMeasurement $refUnitofMeasurement)
    {
        //
    }
}
