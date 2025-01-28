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
use Illuminate\Support\Facades\Log;
use App\Models\User;
use App\Models\UserAccessModuleRights;
use App\Models\UserAccessComponentRights;
use App\Models\UserAccessSubComponentRights;
use App\Models\UserAccessCustomerRights;
use App\Models\UserAccessOrganizationRights;
use App\Models\UserAccessProductGroupRights;
use App\Models\UsersAccounts;

use Illuminate\Support\Facades\Crypt;


class AuthController extends Controller
{
     public function login(Request $request){
        $fields = $request->validate([
            'username' => 'required|string',
            'password' => 'required|string',
        ]);
        
        //check fields
        $user = UsersAccounts::where('username',$fields['username'])->first();
        
        if(empty($user)){
            $response = [
                'user' => Crypt::encryptString(json_encode([])),
                'token' => '',
                'result' => false,
                'status' => 'warning',
                'title' => 'Oppss!',
                'message' => 'Username not found!',
            ];
            return Crypt::encryptString(json_encode($response));

        }
        //check password
        // if(!$user || !Hash::check($fields['password'], $user->password)){
        
        
        if(!Hash::check($fields['password'], $user->password)){    
             $response = [
                'user' => Crypt::encryptString(json_encode([])),
                'token' => '',
                'result' => false,
                'status' => 'warning',
                'title' => 'Oppss!',
                'message' => 'Invalid Password!',
            ];
            return Crypt::encryptString(json_encode($response));
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
        $account_details = User::join('users_accounts', 'users.code', '=', 'users_accounts.user_code')
            ->where('users_accounts.username', $fields['username'])
            ->first([
                'users.*',
                'users_accounts.username as username',
                'users.code as user_code',
                'users_accounts.code as code'
            ]);
        $access = $this->get_user_access_right_by_id($account_details['code']);
       
        $response = [
            'user' => Crypt::encryptString(json_encode($account_details)),
            'access' => $access,
            'token' => $token,
            'result' => true,
            'title'=>'Success',
            'status'=>'success',
            'message' => 'Successfully Logged In!',
        ];
        // AuditTrailController::do_audit_trail("Login",null,null,"Succesfully Logged In",$fields['username']);
        return Crypt::encryptString(json_encode($response));
        // return response($response, 201);
    }


     public function get_user_access_right_by_id($user_id){

        $user_access_module_rights = UserAccessModuleRights::join('ref_modules','user_access_module_rights.module_code','=','ref_modules.code')
        ->where('user_id',$user_id)
        ->where('access_rights',1)
        ->orderBy('ref_modules.description')
        ->get(['user_access_module_rights.*','ref_modules.description','ref_modules.link']);
        
        $user_access_component_rights = UserAccessComponentRights::join('ref_components','user_access_component_rights.component_code','=','ref_components.code')
        ->where('user_id',$user_id)
        ->where('access_rights',1)
        ->orderBy('ref_components.description')
        ->get(['user_access_component_rights.*','ref_components.description','ref_components.link']);
        
        
        $user_access_sub_component_rights = UserAccessSubComponentRights::join('ref_sub_components','user_access_sub_component_rights.sub_component_code','=','ref_sub_components.code')
        ->where('user_id',$user_id)
        ->where('access_rights',1)
        ->orderBy('ref_sub_components.description')
        ->get(['user_access_sub_component_rights.*','ref_sub_components.description','ref_sub_components.link']);
        
        $user_access_customer_rights = UserAccessCustomerRights::where('user_id',$user_id)
        ->where('access_rights',1)
        ->orderBy('customer_code')
        ->get();

        $user_access_organization_rights = UserAccessOrganizationRights::
        join('ref_sub_sections', 'user_access_organization_rights.subsection_code', '=', 'ref_sub_sections.code')
        ->where('user_id',$user_id)
        ->where('access_rights',1)
        ->get(['ref_sub_sections.type','ref_sub_sections.code','ref_sub_sections.description','ref_sub_sections.section_code']);

         $user_access_product_group_rights = UserAccessProductGroupRights::
        join('ref_product_groups', 'user_access_product_group_rights.ref_product_groups_code', '=', 'ref_product_groups.code')
        ->where('user_id',$user_id)
        ->where('access_rights',1)
        ->get(['ref_product_groups.code','ref_product_groups.description','ref_product_groups.unit_conversion']);


        $response = [
             'user_access_module_rights' => $user_access_module_rights,
             'user_access_component_rights' => $user_access_component_rights,
             'user_access_sub_component_rights' => $user_access_sub_component_rights,
             'user_access_customer_rights' => $user_access_customer_rights,
             'user_access_organization_rights' => $user_access_organization_rights,
             'user_access_product_group_rights' => $user_access_product_group_rights,
        ];
        return Crypt::encryptString(json_encode($response));
    }

     public function change_password(Request $request){
        $fields = $request->validate([
            'current_password' => 'required|string',
            'password' => 'required|confirmed', 
            'account_id' => 'required', 
        ]);

         $user = User::where('code',$fields['account_id'])->first();

        if(empty($user)){
            return response([
                 'message' => 'No user details available!',
                 'result' => false
             ], 200); 
        }
        
        if(!Hash::check($fields['current_password'], $user->password)){
            return response([
                'result' => false,
                'status' => 'warning',
                'title' => 'Warning',
                'message' => 'Invalid Old Password!',
             ], 200); 
        }

        //change password

        $user->update([
            'password' => bcrypt($fields['password']),
        ]);

        return response([

            'result' => true,
            'status' => 'success',
            'title' => 'Success',
            'message' => "Today's sales updated successfully",
        ], 200); 

    }

    public function sync_user_access_right_by_id(Request $request){
        $fields = $request->validate([
            'code' => 'required',
        ]);
        $user = User::where('code',$fields['code'])->first();
        $access = $this->get_user_access_right_by_id($fields['code']);
        $response = [
            'user' => Crypt::encryptString(json_encode($user)),
            'access' => $access,
            'result' => true,
            'title'=>'Success',
            'status'=>'success',
            'message' => 'Successfully synced!',
        ];
        return Crypt::encryptString(json_encode($response));
    }
}
