<?php

namespace App\Http\Controllers;

use App\Models\UsersAccounts;
use Illuminate\Http\Request;

class UsersAccountsController extends Controller
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
        $fields = $request->validate([
            'username' => 'required',
            'user_code' => 'required',
            'company_code' => 'required',
            'business_unit_code' => 'required',
            'team_code' => 'required',
            'department_code' => 'required',
            'section_code' => 'required',
            'subsection_code' => 'required',
            'position' => 'nullable',
            'position_level' => 'nullable',
            'added_by' => 'required',
            'modified_by' => 'required',
        ]); 
        
        $existingRecord = UsersAccounts::where('username', $fields['username'])
            ->first();

        if ($existingRecord) {
                return response([
                    'result' => false,
                    'status' => 'error',
                    'title' => 'Error',
                    'message' => 'Username already exist.'
                ], 409);
        } else {
                $fields['code'] = MainController::generate_code('App\Models\UsersAccounts',"code");
                $fields['password'] = bcrypt("welcome123");
                UsersAccounts::create($fields);
                return response([
                        'result' => true,
                        'status' => 'success',
                        'title' => 'Success',
                        'message' => 'Employee added successfully.'
                ], 201);
        }
    }

    /**
     * Display the specified resource.
     *
     * @param  \App\Models\UsersAccounts  $usersAccounts
     * @return \Illuminate\Http\Response
     */
    public function show(UsersAccounts $usersAccounts)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Models\UsersAccounts  $usersAccounts
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, UsersAccounts $usersAccounts)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Models\UsersAccounts  $usersAccounts
     * @return \Illuminate\Http\Response
     */
    public function destroy(UsersAccounts $usersAccounts)
    {
        //
    }
}
