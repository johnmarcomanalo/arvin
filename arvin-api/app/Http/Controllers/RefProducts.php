<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Crypt;
use Illuminate\Support\Facades\DB;

class RefProducts extends Controller
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
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, $id)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        //
    }

    public function get_ref_products(Request $request)
    {
        $page = $request->query('pg', 1); // Default to page 1 if not provided
        $limit = $request->query('lmt', 10); // Default to 10 items per page if not provided
        $search = trim($request->query('srch', ''));
        $tc = $request->query('tc');
        $brnd = $request->query('brnd');
        $brnch = $request->query('brnch');
        $grps = $request->query('grps');
        $user_id = Crypt::decryptString($request->query('u')); 

        if (empty($user_id)) {
            $response = [
                'result' => false,
                'status' => 'warning',
                'title' => 'Oppss!',
                'message' => "Invalid request. Please login.",
            ];
            return response()->json($response, 200);
        }

        $query = DB::table('vw_ref_products');

        if (isset($search)) {
            $query->where('itemcode', 'like', '%' . $search . '%')
            ->orWhere('itemname', 'like', '%' . $search . '%');
        }   
        if (isset($tc)) {
            $query->where('taxcode', $tc);
        }   
        if (isset($brnd)) {
            $query->where('brand', $brnd);
        }
        if (isset($grps)) {
            $query->where('groups', $grps);
        }
        if (isset($brnch)) {
            $query->where('branch', $brnch);
        }   
        // Paginate the query
         $productsFromSAP = $query->paginate($limit, ['*'], 'page', $page);

        $result = [];
        foreach ($productsFromSAP as $productsSAP) {
            $result[] = [
                'code' => $productsSAP->itemcode,
                'description' => $productsSAP->itemname,
                'weight' => $productsSAP->sweight1,
                'tax_code' => $productsSAP->taxcode,
                'brand' => $productsSAP->brand,
                'branch' => $productsSAP->branch,
                'groups' => $productsSAP->groups,
            ];
        }
        $response = [
                'dataList' => $result,
                'total' => $productsFromSAP->total(),
                'count' => $productsFromSAP->count(),
                'per_page' => $productsFromSAP->perPage(),
                'current_page' => $productsFromSAP->currentPage(),
                'total_pages' => $productsFromSAP->lastPage(),
                'result' => true,
                'title' => 'Success',
                'status' => 'success',
                'message' => 'Fetched successfully.',
        ];
        return Crypt::encryptString(json_encode($response));
    }
}
