<?php

namespace Database\Seeders;
use App\Models\UserAccessSubComponentRights;

use Illuminate\Database\Seeder;

class UserAccessSubComponentRightsSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
         UserAccessSubComponentRights::insert([
            // [
            // 'code'=> '300003001-1',
            // 'module_code'=> '300',
            // 'component_code'=> '300003',
            // 'sub_component_code'=> '300003001',
            // 'user_id'=> '1',
            // 'create'=> '1',
            // 'update'=> '1',
            // 'delete'=> '1',
            // 'generate'=> '1',
            // 'export'=> '1',
            // 'access_rights'=> '1', 
            // 'added_by' => env('DEFAULT_USER'),
            // 'modified_by' => env('DEFAULT_USER')],
            // [
            // 'code'=> '300003002-1',
            // 'module_code'=> '300',
            // 'component_code'=> '300003',
            // 'sub_component_code'=> '300003002',
            // 'user_id'=> '1',
            // 'create'=> '1',
            // 'update'=> '1',
            // 'delete'=> '1',
            // 'generate'=> '1',
            // 'export'=> '1',
            // 'access_rights'=> '1', 
            // 'added_by' => env('DEFAULT_USER'),
            // 'modified_by' => env('DEFAULT_USER')],
            // [
            // 'code'=> '300003003-1',
            // 'module_code'=> '300',
            // 'component_code'=> '300004',
            // 'sub_component_code'=> '300003003',
            // 'user_id'=> '1',
            // 'create'=> '1',
            // 'update'=> '1',
            // 'delete'=> '1',
            // 'generate'=> '1',
            // 'export'=> '1',
            // 'access_rights'=> '1', 
            // 'added_by' => env('DEFAULT_USER'),
            // 'modified_by' => env('DEFAULT_USER')],


            //   [
            // 'code'=> '300003001-2',
            // 'module_code'=> '300',
            // 'component_code'=> '300003',
            // 'sub_component_code'=> '300003001',
            // 'user_id'=> '2',
            // 'create'=> '1',
            // 'update'=> '1',
            // 'delete'=> '1',
            // 'generate'=> '1',
            // 'export'=> '1',
            // 'access_rights'=> '1', 
            // 'added_by' => env('DEFAULT_USER'),
            // 'modified_by' => env('DEFAULT_USER')],
            // [
            // 'code'=> '300003002-2',
            // 'module_code'=> '300',
            // 'component_code'=> '300003',
            // 'sub_component_code'=> '300003002',
            // 'user_id'=> '2',
            // 'create'=> '1',
            // 'update'=> '1',
            // 'delete'=> '1',
            // 'generate'=> '1',
            // 'export'=> '1',
            // 'access_rights'=> '1', 
            // 'added_by' => env('DEFAULT_USER'),
            // 'modified_by' => env('DEFAULT_USER')],
            // [
            // 'code'=> '300003003-2',
            // 'module_code'=> '300',
            // 'component_code'=> '300004',
            // 'sub_component_code'=> '300003003',
            // 'user_id'=> '2',
            // 'create'=> '1',
            // 'update'=> '1',
            // 'delete'=> '1',
            // 'generate'=> '1',
            // 'export'=> '1',
            // 'access_rights'=> '1', 
            // 'added_by' => env('DEFAULT_USER'),
            // 'modified_by' => env('DEFAULT_USER')],

                
            // [
            // 'code'=> '300003002-3',
            // 'module_code'=> '300',
            // 'component_code'=> '300003',
            // 'sub_component_code'=> '300003002',
            // 'user_id'=> '3',
            // 'create'=> '1',
            // 'update'=> '1',
            // 'delete'=> '1',
            // 'generate'=> '1',
            // 'export'=> '1',
            // 'access_rights'=> '1', 
            // 'added_by' => env('DEFAULT_USER'),
            // 'modified_by' => env('DEFAULT_USER')],

            [
            'code'=> '300003003-3',
            'module_code'=> '300',
            'component_code'=> '300004',
            'sub_component_code'=> '300003003',
            'user_id'=> '3',
            'create'=> '1',
            'update'=> '1',
            'delete'=> '1',
            'generate'=> '1',
            'export'=> '1',
            'access_rights'=> '1', 
            'added_by' => env('DEFAULT_USER'),
            'modified_by' => env('DEFAULT_USER')],
        ]);
    }
}
