<?php

namespace App\Http\Controllers;

use App\Models\SalesDailyOutSettingsClientGroups;
use App\Models\SalesDailyOutSettingsClientSubGroups;
use App\Models\RefSubSections;
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
            'description' => 'required|string',
            'sub_group' => 'required|array|min:1',
            'type' => 'required',
            'subsection' => 'required',
            'bdo' => 'required',
            'added_by' => 'required',
            'modified_by' => 'required',
        ]);

        try {
            DB::beginTransaction(); // Start the transaction

            // Check if the group already exists

            $check_group = SalesDailyOutSettingsClientGroups::where('description', $fields['description'])
                ->where('type', $fields['type'])
                ->where('subsection', $fields['subsection'])
                ->where('bdo', $fields['bdo'])
                ->whereNull('deleted_at')
                ->count();

            if ($check_group > 0) {
                DB::rollBack(); // Rollback the transaction
                return response([
                    'message' => "A group with the same details already exists: {$fields['description']} - {$fields['type']} - {$fields['subsection']} - {$fields['bdo']}.",
                    'result' => false,
                    'status' => 'warning',
                    'title' => 'Oops!',
                ], 409);
            }

            // Check if customer codes already exist
            
            // $customerCodes = array_column($fields['sub_group'], 'customer_code');
            // $existingCount = SalesDailyOutSettingsClientSubGroups::whereIn('customer_code', $customerCodes)
            //     ->whereNull('deleted_at')
            //     ->count();

            // if ($existingCount > 0) {
            //     DB::rollBack(); // Rollback the transaction
            //     return response([
            //         'message' => 'Some customer codes already exist.',
            //         'result' => false,
            //         'status' => 'warning',
            //         'title' => 'Oops!',
            //     ], 409);
            // }

            // Generate and insert group
            $subsection = RefSubSections::where('description',$fields["subsection"])->first();

            $code_group = MainController::generate_code('App\Models\SalesDailyOutSettingsClientGroups', "code");
            // return $fields;
            SalesDailyOutSettingsClientGroups::create([
                'code' => $code_group,
                'description' => $fields["description"],
                'type' => $fields["type"],
                'subsection' => $subsection['type'],
                'bdo' => $fields["bdo"],
                'added_by' => $fields["added_by"],
                'modified_by' => $fields["modified_by"],
            ]);

            // Insert subgroup data
            
            foreach ($fields['sub_group'] as $value) {
                $code = MainController::generate_code('App\Models\SalesDailyOutSettingsClientSubGroups', "code");
                SalesDailyOutSettingsClientSubGroups::create([
                    'code' => $code,
                    'sales_daily_out_settings_client_groups_code' => $code_group,
                    'customer_code' => $value->customer_code,
                    'description' => $value->description,
                    'type' => $value->type,
                    'subsection' => $subsection['type'],
                    'added_by' => $fields["added_by"],
                    'modified_by' => $fields["modified_by"],
                ]);
            }

            DB::commit(); // Commit the transaction

            return response([
                'message' => 'Group client added successfully',
                'result' => true,
                'status' => 'success',
                'title' => 'Success',
            ], 200);

        } catch (\Exception $e) {
            DB::rollBack(); // Rollback transaction on error

            return response([
                'message' => 'An error occurred: ' . $e->getMessage(),
                'result' => false,
                'status' => 'error',
                'title' => 'Error',
            ], 500);
        }
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
            $data = SalesDailyOutSettingsClientGroups::whereNull('deleted_at')->get(['code','description','type as group_type', 'subtype']);
            $data->transform(function ($item) {
            $subgroupData = SalesDailyOutSettingsClientSubGroups::where('sales_daily_out_settings_client_groups_code', $item->code)
                ->whereNull('deleted_at')
                ->get(['code','sales_daily_out_settings_client_groups_code','customer_code','description','type',]);
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
        $ref = $request->query('ref');    
        //select query from the url parameter
        // Set parameter names based on type 
        $pageParam = $ref == 'true' ? 'ref_client_groups_page' : 'page';
        $limitParam = $ref == 'true' ? 'ref_client_groups_limit' : 'limit';
        $queryParam = $ref == 'true' ? 'ref_client_groups_search' : 'q';
        $filterParam = $ref == 'true' ? 'ref_client_groups_filter' : 'f';

        // Retrieve query parameters
        $page = $request->query($pageParam);
        $limit = $request->query($limitParam);
        $query = $request->query($queryParam);
        $filter = $request->query($filterParam);
        
         $queryBuilder = SalesDailyOutSettingsClientGroups::whereNull('deleted_at');
        if (!empty($query)) {
            $queryBuilder = $queryBuilder->where(function ($queryBuilder) use ($query) {
                    $queryBuilder->where('description', 'like', '%' . $query . '%');
            });
        } 
        if (!empty($filter)) {
            $queryBuilder = $queryBuilder->where(function ($queryBuilder) use ($filter) {
                    $queryBuilder->where('type', 'like', '%' . $filter . '%');
            });
        } 

         $data_list = $queryBuilder->paginate($limit, ['*'], 'page', $page);

        // Add `subgroup` data to each item in the `data` array
        $data_list->getCollection()->transform(function ($item) {
            $subgroupData = SalesDailyOutSettingsClientSubGroups::where('sales_daily_out_settings_client_groups_code', $item->code)
                ->whereNull('deleted_at')
                ->get(['sales_daily_out_settings_client_groups_code','customer_code','description','type','subsection']);
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

    public function get_ref_group_clients(Request $request)
    {
        //select query from the url parameter
        $page = $request->query('ref_client_groups_page');
        $limit = $request->query('ref_client_groups_limit');
        $query = $request->query('ref_client_groups_search');
        $filter = $request->query('ref_client_groups_filter');
        
        $queryBuilder = SalesDailyOutSettingsClientGroups::whereNull('deleted_at');
        if (!empty($query)) {
            $queryBuilder = $queryBuilder->where(function ($queryBuilder) use ($query) {
                    $queryBuilder->where('description', 'like', '%' . $query . '%');
            });
        } 
        if (!empty($filter)) {
            $queryBuilder = $queryBuilder->where(function ($queryBuilder) use ($filter) {
                    $queryBuilder->where('type', 'like', '%' . $filter . '%');
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
