<?php

namespace App\Http\Controllers;

use App\Models\RefBankAccounts;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Crypt;

class RefBankAccountsController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        $data = array();
        $data = RefBankAccounts::whereNull('deleted_at')->get();
        if(!empty($data)){
          return Crypt::encryptString(json_encode($data));
        }
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
            'description' => 'required',
            'bank_account_number' => 'required',
            'type' => 'required',
            'added_by' => 'required',
            'modified_by' => 'required',
        ]);
        $existingRecord = RefBankAccounts::where('description', $fields['description'])
            ->where('type', $fields['type'])                    
            ->first();

        if ($existingRecord) {
            return response([
                'result' => true,
                'status' => 'error',
                'title' => 'Error',
                'message' => 'Bank account already exists.'
            ], 409);
        } else {
                $fields['code'] = $this->generate_code();
                RefBankAccounts::create($fields);
                return response([
                        'result' => true,
                        'status' => 'success',
                        'title' => 'Success',
                        'message' => 'Bank account added successfully.'
                ], 201);
        }
    }

    /**
     * Display the specified resource.
     *
     * @param  \App\Models\RefBankAccounts  $RefBankAccounts
     * @return \Illuminate\Http\Response
     */
    public function show(RefBankAccounts $RefBankAccounts)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Models\RefBankAccounts  $RefBankAccounts
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, $id)
    {
         $fields = $request->validate([
            'modified_by' => 'required',
            'code'        => 'required',
            'description' => 'required',
            'bank_account_number' => 'required',
            'type'        => 'required',
        ]);
        $data = RefBankAccounts::where('code','=',$id)->first();
        if(empty($data)){
            $response = [
                'result'  => false,
                'icon'    => 'error',
                'message' => 'No data found!',
            ];
            return response($response, 404);
        }

        $data->update([
            'modified_by' => $fields['modified_by'],
            'description' => $fields['description'],
            'bank_account_number' => $fields['bank_account_number'],
            'type'        => $fields['type'],
        ]);
        $response = [
            'message' => '',
            'result' => true,
            'icon' => 'success',
            'title' => 'Successfully Updated!',
        ];

        return response($response, 200);
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Models\RefBankAccounts  $RefBankAccounts
     * @return \Illuminate\Http\Response
     */
    public function destroy(RefBankAccounts $RefBankAccounts)
    {
        //
    }

    public function generate_code(){
        $code = 1;
        $current_date = date('Y-m-d');
        $latest_code = RefBankAccounts::latest('code')->first('code')->code ?? NULL;
        if(!empty($latest_code)){
            $code = $latest_code + 1;
        }
        return $code;
    }

    public function get_ref_bank_accounts(Request $request)
    {
        $page = $request->query('page');
        $limit = $request->query('limit');
        $query = $request->query('q');
        $filter = $request->query('f');

        $dataListQuery = RefBankAccounts::whereNull('deleted_at');

        if (isset($query)) {
            $dataListQuery->where(function($q) use ($query) {
                $q->where('description', 'like', '%' . $query . '%')
                ->where('bank_account_number', 'like', '%' . $query . '%')
                ->orWhere('type', 'like', '%' . $query . '%');
            });
        }

        $data_list = $dataListQuery->paginate($limit, ['*'], 'page', $page);
        $response = [
                "dataList"=>$data_list,
                'result'=>True,
                'title'=>'Success',
                'status'=>'success',
                'message'=> '',
        ];
        return Crypt::encryptString(json_encode($response));
    }
}
