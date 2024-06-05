<?php

namespace App\Http\Controllers;

use App\Models\RefTeams;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Crypt;
class RefTeamsController extends Controller
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
     * @param  \App\Models\RefTeams  $refTeams
     * @return \Illuminate\Http\Response
     */
    public function show( $id)
    {
        return Crypt::encryptString($this->do_show($id));
    }
    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Models\RefTeams  $refTeams
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, RefTeams $refTeams)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Models\RefTeams  $refTeams
     * @return \Illuminate\Http\Response
     */
    public function destroy(RefTeams $refTeams)
    {
        //
    }
    public function do_show($id = null) {
        if (isset($id)) {
            $data = RefTeams::where('business_unit_code', '=', $id)->get();
        } else {
            $data = RefTeams::all();
        }
        if ($data->isEmpty()) {
            $data = array();
        }
        return $data;
    }
}
