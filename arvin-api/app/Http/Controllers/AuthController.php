<?php

namespace App\Http\Controllers;

use Validator;
use Session;
use Illuminate\Support\Facades\Auth;
use Illuminate\Auth\Events\Login;
use Illuminate\Auth\Events\Logout;

use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

use App\Models\User;

use Illuminate\Support\Facades\Crypt;


class AuthController extends Controller
{
     public function login(Request $request){
        $fields = $request->validate([
            'username' => 'required|string',
            'password' => 'required|string',
        ]);
        
        //check fields
        $user = User::where('username',$fields['username'])->first();
        
        if(empty($user)){
            // AuditTrailController::do_audit_trail("Login",null,null,"Not Verified",$fields['username']);
            return response([
                'message' => 'Invalid Username/Password!',
                'result' => false
            ], 401); 
        }
        //check password
        // if(!$user || !Hash::check($fields['password'], $user->password)){

        if(!Auth::attempt($fields)){    
            
            // AuditTrailController::do_audit_trail("Login",null,null,"Invalid Username/Password",$fields['username']);
            
            return response([
                 'message' => 'Invalid Username/Password!',
                 'result' => false
             ], 401); 
        }

        // if($user->is_verified == 0){
        //     AuditTrailController::do_audit_trail("Login",null,null,"Not Verified",$fields['username']);
        //     return response([
        //         'message' => 'This account is still not verify.',
        //         'result' => false
        //     ], 401); 
        // }


        //auth logs
        event(new Login("api",$user,1));
       
        $token = $user->createToken('myapptoken')->plainTextToken;
        // $request->session()->regenerate();
        

        $response = [
            // 'user' => Crypt::encryptString($user),
            'user' =>$user,
            'token' => $token,
            'result' => true,
            'message' => 'Successfully Logged In!',
        ];

        // AuditTrailController::do_audit_trail("Login",null,null,"Succesfully Logged In",$fields['username']);
        
        return response($response, 201);
    }
}
