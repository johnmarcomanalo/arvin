<?php

namespace App\Http\Controllers;

use App\Models\SalesDailyOutSettingsClientGroups;
use App\Models\SalesDailyOutSettingsClientSubGroups;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;
use Illuminate\Support\Facades\Crypt;

class SalesDailyOutSettingsClientGroupsController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index($id = null)
    {
        //
        return Crypt::encryptString($this->do_show($id));

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
            'sub_group' => 'required',
            'added_by' => 'required',
            'modified_by' => 'required',
        ]);

        $check_group = SalesDailyOutSettingsClientGroups::where('description',$fields['description'])
            ->whereNull('deleted_at')
            ->count();

        if($check_group > 0){
            $response = [
                    'message' => 'There is already a existing group for - : '.$fields["description"] ,
                    'result' => false,
                    'status' => 'warning',
                    'title' => 'Oppss!',
            ];
            return response($response,409);
        }

        $customerCodes = array_column($fields['sub_group'], 'customer_code');

        $existingCount = SalesDailyOutSettingsClientSubGroups::whereIn('customer_code', $customerCodes)
            ->whereNull('deleted_at')
            ->count();

        if ($existingCount > 0) {
            $response = [
                    'message' => 'Some customer codes already exist.' ,
                    'result' => false,
                    'status' => 'warning',
                    'title' => 'Oppss!',
            ];
            return response($response,409);
        }
        $code_group = MainController::generate_code('App\Models\SalesDailyOutSettingsClientGroups',"code");

        SalesDailyOutSettingsClientGroups::create([
            'code' => $code_group,
            'description' => $fields["description"],
            'added_by' => $fields["added_by"],
            'modified_by' => $fields["modified_by"],
        ]);

        foreach ($fields['sub_group'] as $value) {
            $code = MainController::generate_code('App\Models\SalesDailyOutSettingsClientSubGroups',"code");
            SalesDailyOutSettingsClientSubGroups::create([
                'code' => $code,
                'sales_daily_out_settings_client_groups_code' => $code_group,
                'customer_code' => $value->customer_code,
                'description' => $value->description,
                'type' => $value->type,
                'added_by' => $fields["added_by"],
                'modified_by' => $fields["modified_by"],
            ]);
        }

        return response([
            'message' => 'Group client added successfully',
            'result' => true,
            'status' => 'success',
            'title' => 'Success',
        ], 200); 
        
    }

    /**
     * Display the specified resource.
     *
     * @param  \App\Models\SalesDailyOutSettingsClientGroups  $salesDailyOutSettingsClientGroups
     * @return \Illuminate\Http\Response
     */
    public function show($id = null)
    {
        return Crypt::encryptString($this->do_show($id));
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Models\SalesDailyOutSettingsClientGroups  $salesDailyOutSettingsClientGroups
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, SalesDailyOutSettingsClientGroups $salesDailyOutSettingsClientGroups)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Models\SalesDailyOutSettingsClientGroups  $salesDailyOutSettingsClientGroups
     * @return \Illuminate\Http\Response
     */
    public function destroy(SalesDailyOutSettingsClientGroups $salesDailyOutSettingsClientGroups)
    {
        //
    }

    public function do_show($id = null) {
        if (isset($id)) {
            $data = SalesDailyOutSettingsClientGroups::whereNull('deleted_at')->first();
        } else {
            $data = SalesDailyOutSettingsClientGroups::whereNull('deleted_at')->get(['code','description']);
            $data->transform(function ($item) {
            $subgroupData = SalesDailyOutSettingsClientSubGroups::where('sales_daily_out_settings_client_groups_code', $item->code)
                ->whereNull('deleted_at')
                ->get(['code','sales_daily_out_settings_client_groups_code','customer_code','description','type']);
            $item->subgroup = $subgroupData; // Add the subgroup to the object
            return $item;
        });

        }
        if (empty($data)) {
            $data = array();
        }

        return $data;
    }

    public function get_group_clients(Request $request)
    {
        //select query from the url parameter
        $page = $request->query('page');
        $limit = $request->query('limit');
        $query = $request->query('q');
        $filter = $request->query('f');
        
        $queryBuilder = SalesDailyOutSettingsClientGroups::whereNull('deleted_at');
        if (!empty($query)) {
            $queryBuilder = $queryBuilder->where(function ($queryBuilder) use ($query) {
                    $queryBuilder->where('description', 'like', '%' . $query . '%');
            });
        } 

        $data_list = $queryBuilder->paginate($limit, ['*'], 'page', $page);

        // Add `subgroup` data to each item in the `data` array
        $data_list->getCollection()->transform(function ($item) {
            $subgroupData = SalesDailyOutSettingsClientSubGroups::where('sales_daily_out_settings_client_groups_code', $item->code)
                ->whereNull('deleted_at')
                ->get(['sales_daily_out_settings_client_groups_code','customer_code','description','type']);
            $item->subgroup = $subgroupData; // Add the subgroup to the object
            return $item;
        });

        $response = [  
            'dataList' => $data_list,
            'result' => true,
            'title'=>'Success',
            'status'=>'success',
            'message'=> 'Authentication successful.',
        ];
        return Crypt::encryptString(json_encode($response));
    }
}
