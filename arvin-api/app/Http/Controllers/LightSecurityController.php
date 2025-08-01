<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Crypt;
use Illuminate\Contracts\Encryption\DecryptException;
class LightSecurityController extends Controller
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

    
    public static function DecryptionAES(Request $request){
      
        $decrypted = Crypt::decryptString(json_encode($request->all()));
        
        $decrypted = json_decode($decrypted);
    
        foreach($decrypted as $key => $value){
            $request->merge([$key => $value]);
        }

        return $request;
    }

    public static function DecryptionAESbyData(Request $request){
        $decrypted = Crypt::decryptString(json_encode($request->data));
        $decrypted = json_decode($decrypted);

        foreach($decrypted as $key => $value){
            $request->merge([$key => $value]);
        }
        return $request;
    }
}
