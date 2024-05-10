<?php

namespace App\Http\Controllers;

use App\Models\RefSalesRankingPlacements;
use Illuminate\Http\Request;

class RefSalesRankingPlacementsController extends Controller
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
     * @param  \App\Models\RefSalesRankingPlacements  $refSalesRankingPlacements
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        return RefSalesRankingPlacements::whereRefSalesRankingsCode($id)->get();
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Models\RefSalesRankingPlacements  $refSalesRankingPlacements
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, RefSalesRankingPlacements $refSalesRankingPlacements)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Models\RefSalesRankingPlacements  $refSalesRankingPlacements
     * @return \Illuminate\Http\Response
     */
    public function destroy(RefSalesRankingPlacements $refSalesRankingPlacements)
    {
        //
    }
}
