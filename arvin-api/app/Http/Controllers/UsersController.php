<?php

namespace App\Http\Controllers;
use Illuminate\Support\Facades\DB;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Crypt;
use App\Models\UserAccessModuleRights;
use App\Models\UserAccessComponentRights;
use App\Models\UserAccessSubComponentRights;

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
        //
    }

    /**
     * Display the specified resource.
     *
     * @param  \App\Models\Users  $users
     * @return \Illuminate\Http\Response
     */
    public function show(Users $users)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Models\Users  $users
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, Users $users)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Models\Users  $users
     * @return \Illuminate\Http\Response
     */
    public function destroy(Users $users)
    {
        //
    }
    public function employee_list(Request $request){
        $page = $request->query('page');
        $limit = $request->query('limit');
        $search = $request->query('q');
        $filter = $request->query('f');
        $user_id = $request->query('uid'); 

        //check if the user is valid and currently login
        if(empty($user_id)){
            $response = [
                'result' => false,
                'status' => 'warning',
                'title' => 'Oppss!',
                'message' => "Invalid request. Please login." ,
            ];
            return response($response,200);
        }
       $query = User::whereNull('deleted_at');

        if (isset($search)) {
            $query->where(DB::raw("first_name + ' ' + last_name"), 'like', '%' . $search . '%');
        }

        $dataList = $query->select([
                'code', 
                'username', 
                DB::raw("first_name + ' ' + last_name AS full_name")
            ])
            ->paginate($limit);

        $dataList = $dataList->toArray();
        $response = [
                'dataList' => $dataList,
                'result' => true,
                'title'=>'Success',
                'status'=>'success',
                'message'=> 'Authentication successful.',
            ];
        return Crypt::encryptString(json_encode($response));
    }

    public function fast_create(){
         $user_code = MainController::generate_code('App\Models\User',"code");
         $user_access_module_code = MainController::generate_code('App\Models\UserAccessModuleRights',"code");
         $employee= User::create([
            'code'=>$user_code,
            'username'=>'g.garcia',
            'first_name'=>'Ghenievy',
            'last_name'=>'Garcia',
            'company_code'=>'1',
            'business_unit_code'=>'1',
            'team_code'=>'1',
            'department_code'=>'8',
            'section_code'=>'26',
            'subsection_code'=>'31',
            'password'=> bcrypt("welcome123"),
            'added_by'=>'1',
            'modified_by'=> '1',
        ]); 
        return $employee;

    }
}
