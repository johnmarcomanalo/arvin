<?php

namespace App\Http\Controllers;

use App\Models\RefHolidays;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Crypt;
use Carbon\Carbon;

class RefHolidaysController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        $data = array();
        $data = RefHolidays::whereNull('ref_holidays.deleted_at')->get( );
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
            'type' => 'required',
            'holiday_date' => 'required',
            'added_by' => 'required',
            'modified_by' => 'required',
        ]);
        $existingRecord = RefHolidays::where('type', $fields['type'])
            ->where('description', $fields['description'])
            ->where('holiday_date', $fields['holiday_date'])
            ->first();

        if($existingRecord) {
            return response([
                'result' => true,
                'status' => 'error',
                'title' => 'Error',
                'message' => 'Holiday already exists.'
            ], 409);
        } else {
            $fields['code'] = MainController::generate_code('App\Models\RefHolidays',"code");
            RefHolidays::create($fields);
            return response([
                    'result' => true,
                    'status' => 'success',
                    'title' => 'Success',
                    'message' => 'Holiday  added successfully.'
            ], 201);
        }
    }

    /**
     * Display the specified resource.
     *
     * @param  \App\Models\RefHolidays  $refHolidays
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {

    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Models\RefHolidays  $refHolidays
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, $id)
    {
        $fields = $request->validate([
            'modified_by' => 'required',
            'code' => 'required',
            'description' => 'required',
            'type' => 'required',
            'holiday_date' => 'required',
        ]);
        $data = RefHolidays::where('code','=',$id)->first();
        if(empty($data)){
            $response = [
                'result' => false,
                'icon' => 'error',
                'message' => 'No data found!',
            ];
            return response($response, 404);
        }
        $data->update([
            'modified_by' => $fields['modified_by'],
            'description' => $fields['description'],
            'type' => $fields['type'],
            'holiday_date' => $fields['holiday_date'],
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
     * @param  \App\Models\RefHolidays  $refHolidays
     * @return \Illuminate\Http\Response
     */
    public function destroy(RefHolidays $refHolidays)
    {
        //
    }


    public function get_ref_holidays (Request $request)
    {
        $page = $request->query('page', 1); // Default to page 1 if not provided
        $limit = $request->query('limit', 10); // Default to 10 items per page if not provided
        $query = $request->query('q');
        $filter = $request->query('f');              

        // Ensure the join is correct and the table names and column names are valid
        $dataListQuery = RefHolidays::whereNull('deleted_at');

        if (isset($query)) {
            $dataListQuery->where(function($q) use ($query) {
                $q->where('description', 'like', '%' . $query . '%')
                    ->orWhere('type', 'like', '%' . $query . '%');
            });
        }

        $data_list = $dataListQuery->paginate($limit, [
            'ref_holidays.*',
        ], 'page', $page);
        $data_list->getCollection()->transform(function($holiday) {
            $holiday->holiday_date = Carbon::parse($holiday->holiday_date)->format('F j, Y'); // Adjust format as needed
            return $holiday;
        });
        $response = [
            "dataList" => $data_list,
            'result' => true,
            'title' => 'Success',
            'status' => 'success',
            'message' => '',
        ];

        return Crypt::encryptString(json_encode($response));
    }
}
