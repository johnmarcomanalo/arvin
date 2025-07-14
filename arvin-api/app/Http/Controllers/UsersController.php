<?php

namespace App\Http\Controllers;
use Illuminate\Support\Facades\DB;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Crypt;
use App\Models\UserAccessModuleRights;
use App\Models\UserAccessComponentRights;
use App\Models\UserAccessSubComponentRights;
use App\Models\UsersAccounts;

class UsersController extends Controller
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
            'first_name' => 'required',
            'middle_name' => 'string',
            'last_name' => 'required',
            'company_code' => 'required',
            'business_unit_code' => 'required',
            'team_code' => 'required',
            'department_code' => 'required',
            'section_code' => 'required',
            'subsection_code' => 'required',
            'position' => 'string',
            'position_level' => 'string',
            'added_by' => 'required',
            'modified_by' => 'required',
        ]); 

        $existingUserRecord = User::where('first_name', $fields['first_name'])
            ->where('middle_name', $fields['middle_name'])
            ->where('last_name', $fields['last_name'])
            ->first();


        $existingAccountRecord = User::where('username', $fields['username'])
            ->where('company_code', $fields['company_code'])
            ->where('business_unit_code', $fields['business_unit_code'])
            ->where('team_code', $fields['team_code'])
            ->where('department_code', $fields['department_code'])
            ->where('section_code', $fields['section_code'])
            ->where('subsection_code', $fields['subsection_code'])
            ->first();

        if ($existingUserRecord) {
                return response([
                    'result' => false,
                    'status' => 'error',
                    'title' => 'Error',
                    'message' => 'Employee Details already exist.'
                ], 409);
        }
        if ($existingAccountRecord) {
                return response([
                    'result' => false,
                    'status' => 'error',
                    'title' => 'Error',
                    'message' => 'Employee Account already exist.'
                ], 409);
        }

        
        $fields['code'] = MainController::generate_code('App\Models\User',"code");
        $fields['account_code'] = MainController::generate_code('App\Models\UsersAccounts',"code");
        $fields['password'] = bcrypt("welcome123");

        $fields['modified_by'] = $fields['modified_by'] ?? $fields['added_by'];
        // User::create($fields);
        User::create([
            'code' => $fields['code'],
            'first_name' => $fields['first_name'],
            'middle_name' => $fields['middle_name'],
            'last_name' => $fields['last_name'],
            'added_by' => $fields['added_by'],
            'modified_by' => $fields['modified_by'],
        ]);

        UsersAccounts::create([
            'code' => $fields['account_code'],
            'user_code' => $fields['code'],
            'username' => $fields['username'],
            'password' => $fields['password'],
            'company_code' => $fields['company_code'],
            'business_unit_code' => $fields['business_unit_code'],
            'team_code' => $fields['team_code'],
            'department_code' => $fields['department_code'],
            'section_code' => $fields['section_code'],
            'subsection_code' => $fields['subsection_code'],
            'position' => $fields['position'],
            'position_level' => $fields['position_level'],
            'added_by' => $fields['added_by'],
            'modified_by' => $fields['added_by'],
        ]);

        return response([
                'result' => true,
                'status' => 'success',
                'title' => 'Success',
                'message' => 'Employee added successfully.'
        ], 201);
        
    }

    /**
     * Display the specified resource.
     *
     * @param  \App\Models\Users  $users
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        return Crypt::encryptString($this->do_show($id));
        // return User::find($id);
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Models\Users  $users
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, User $users)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Models\Users  $users
     * @return \Illuminate\Http\Response
     */
    public function destroy(User $users)
    {
        //
    }
    public function employee_list(Request $request){
        $page = $request->query('page');
        $limit = $request->query('limit');
        $search = $request->query('q');
        $filter = $request->query('f');
        $user_id = $request->query('uid'); 

        // Check if the user is valid and currently logged in
        if(empty($user_id)){
            $response = [
                'result' => false,
                'status' => 'warning',
                'title' => 'Oppss!',
                'message' => "Invalid request. Please login.",
            ];
            return response($response, 200);
        }

        // Query the users and join with the users_accounts table to get all accounts
        $query = User::whereNull('deleted_at');

        if (isset($search)) {
            $query->where(DB::raw("UPPER(users.first_name + ' ' + users.last_name)"), 'like', '%' . strtoupper($search) . '%');
        }

        // $query->orderBy('users.first_name', 'asc');

        // Select the necessary fields and get all accounts for the user
        $dataList = $query->select([
            'code',
            DB::raw("UPPER(users.first_name + ' ' + users.last_name) AS full_name"),
        ])
        ->paginate($limit); // Use pagination to handle the results

        // Convert to array to manipulate the response
        $dataList = $dataList->toArray();

        $response = [
            'dataList' => $dataList,
            'result' => true,
            'title' => 'Success',
            'status' => 'success',
            'message' => 'Authentication successful.',
        ];

        // Return encrypted response
        return Crypt::encryptString(json_encode($response));
    }
    public function account_list(Request $request){
        $page = $request->query('page');
        $limit = $request->query('limit');
        $search = $request->query('q');
        $filter = $request->query('f');
        $user_id = $request->query('uid'); 

        // Check if the user is valid and currently logged in
        if(empty($user_id)){
            $response = [
                'result' => false,
                'status' => 'warning',
                'title' => 'Oppss!',
                'message' => "Invalid request. Please login.",
            ];
            return response($response, 200);
        }

        // Query the users and join with the users_accounts table to get all accounts
        $query = User::join('users_accounts', 'users.code', '=', 'users_accounts.user_code')
            ->whereNull('users_accounts.deleted_at');

        if (isset($search)) {
            $query->where(DB::raw("UPPER(users.first_name + ' ' + users.last_name)"), 'like', '%' . strtoupper($search) . '%');
        }
        $query->join('ref_sub_sections', 'users_accounts.subsection_code', '=', 'ref_sub_sections.code');
        // $query->orderBy('users.first_name', 'asc');

        // Select the necessary fields and get all accounts for the user
        $dataList = $query->select([
            'users_accounts.code as code',
            DB::raw("UPPER(users.first_name + ' ' + users.last_name) AS full_name"),
            'users_accounts.position',
            'users_accounts.username',
            'ref_sub_sections.description as subsection',
        ])
        ->paginate($limit); // Use pagination to handle the results

        // Convert to array to manipulate the response
        $dataList = $dataList->toArray();

        $response = [
            'dataList' => $dataList,
            'result' => true,
            'title' => 'Success',
            'status' => 'success',
            'message' => 'Authentication successful.',
        ];

        // Return encrypted response
        return Crypt::encryptString(json_encode($response));
    }
    public function fast_create(){
        // $user_code = MainController::generate_code('App\Models\User',"code");
        // $user_access_module_code = MainController::generate_code('App\Models\UserAccessModuleRights',"code");
        //  $employee= User::create([
        //     'code'=>$user_code,
        //     'username'=>'g.garcia',
        //     'first_name'=>'Ghenievy',
        //     'last_name'=>'Garcia',
        //     'company_code'=>'1',
        //     'business_unit_code'=>'1',
        //     'team_code'=>'1',
        //     'department_code'=>'8',
        //     'section_code'=>'26',
        //     'subsection_code'=>'31',
        //     'password'=> bcrypt("welcome123"),
        //     'added_by'=>'1',
        //     'modified_by'=> '1',
        // ]); 
        // return $employee;

            $account_code = MainController::generate_code('App\Models\UsersAccounts',"code");
            $password = bcrypt("welcome123");
            UsersAccounts::create([
            'code' => $account_code,
            'user_code' => '75',
            'username' => 'a.bonaagua_peanut',
            'password' => $password,
            // 'company_code' => '1',
            // 'business_unit_code' => '1',
            // 'team_code' => '1',
            // 'department_code' => '4',
            // 'section_code' =>'12',
            // 'subsection_code' => '12',
            // 'position' => 'SENIOR PROGRAMMER',
            // 'position_level' =>' ',
            'added_by' => '1',
            'modified_by' => '1',
        ]);


    }
    public function do_show($id) {
        if (isset($id)) {
            $data = User::where('code', '=', $id)->first();
        }
        if ($data->isEmpty()) {
            $data = array();
        }

        return $data;
    }
}
