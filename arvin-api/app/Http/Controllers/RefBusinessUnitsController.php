<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\RefBusinessUnits;
use Illuminate\Support\Facades\Crypt;


class RefBusinessUnitsController extends Controller
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
     * @param  \App\Models\RefBusinessUnitsController  $RefBusinessUnitsController
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
     * @param  \App\Models\RefBusinessUnitsController  $RefBusinessUnitsController
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, RefBusinessUnitsController $RefBusinessUnitsController)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Models\RefBusinessUnitsController  $RefBusinessUnitsController
     * @return \Illuminate\Http\Response
     */
    public function destroy(RefBusinessUnitsController $RefBusinessUnitsController)
    {
        //
    }


    public function do_show($id){
        $data = RefBusinessUnits::where('company_code','=',$id)->get();
        if(!empty($data)){
            return $data;
        }
    }
}
