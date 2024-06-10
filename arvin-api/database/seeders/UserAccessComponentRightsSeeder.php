<?php

namespace Database\Seeders;
use App\Models\UserAccessComponentRights;

use Illuminate\Database\Seeder;

class UserAccessComponentRightsSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        UserAccessComponentRights::insert([
            // [
            // 'code'=> '300001-1',
            // 'module_code'=> '300',
            // 'component_code'=> '300001',
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
            // 'code'=> '300002-1',
            // 'module_code'=> '300',
            // 'component_code'=> '300002',
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
            // 'code'=> '300003-1',
            // 'module_code'=> '300',
            // 'component_code'=> '300003',
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
            // 'code'=> '300004-1',
            // 'module_code'=> '300',
            // 'component_code'=> '300004',
            // 'user_id'=> '1',
            // 'create'=> '1',
            // 'update'=> '1',
            // 'delete'=> '1',
            // 'generate'=> '1',
            // 'export'=> '1',
            // 'access_rights'=> '1', 
            // 'added_by' => env('DEFAULT_USER'),
            // 'modified_by' => env('DEFAULT_USER')],


            //    [
            // 'code'=> '300001-2',
            // 'module_code'=> '300',
            // 'component_code'=> '300001',
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
            // 'code'=> '300002-2',
            // 'module_code'=> '300',
            // 'component_code'=> '300002',
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
            // 'code'=> '300003-2',
            // 'module_code'=> '300',
            // 'component_code'=> '300003',
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
            // 'code'=> '300004-2',
            // 'module_code'=> '300',
            // 'component_code'=> '300004',
            // 'user_id'=> '2',
            // 'create'=> '1',
            // 'update'=> '1',
            // 'delete'=> '1',
            // 'generate'=> '1',
            // 'export'=> '1',
            // 'access_rights'=> '1', 
            // 'added_by' => env('DEFAULT_USER'),
            // 'modified_by' => env('DEFAULT_USER')],


            [
            'code'=> '300002-3',
            'module_code'=> '300',
            'component_code'=> '300002',
            'user_id'=> '3',
            'create'=> '1',
            'update'=> '1',
            'delete'=> '1',
            'generate'=> '1',
            'export'=> '1',
            'access_rights'=> '1', 
            'added_by' => env('DEFAULT_USER'),
            'modified_by' => env('DEFAULT_USER')],
            [
            'code'=> '300003-3',
            'module_code'=> '300',
            'component_code'=> '300003',
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
