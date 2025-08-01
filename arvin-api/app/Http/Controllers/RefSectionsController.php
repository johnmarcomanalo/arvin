<?php

namespace App\Http\Controllers;

use App\Models\RefSections;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Crypt;

class RefSectionsController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index($id = null)
    {
        return Crypt::encryptString($this->do_show($id));
        // return Crypt::encryptString(RefSections::whereNull('deleted_at')->get());
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
     * @param  \App\Models\RefSections  $refSections
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
     * @param  \App\Models\RefSections  $refSections
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, RefSections $refSections)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Models\RefSections  $refSections
     * @return \Illuminate\Http\Response
     */
    public function destroy(RefSections $refSections)
    {
        //
    }
    public function do_show($id) {
        if (isset($id)) {
            $data = RefSections::where('department_code', '=', $id)->orderBy('description', 'asc')->get();
        } else {
            $data = RefSections::orderBy('description', 'asc')->get();
        }

        if ($data->isEmpty()) {
            $data = array();
        }

        return $data;
    }
}
