<?php

namespace Database\Seeders;
use App\Models\UserAccessModuleRights;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class UserAccessModuleRightsSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {

        DB::table('user_access_module_rights')->delete();
        DB::table('user_access_component_rights')->delete();
        DB::table('user_access_sub_component_rights')->delete();
        UserAccessModuleRights::insert([
            [
            'code'=> '1',
            'module_code'=> '300',
            'user_id'=> '1',
            'access_rights'=> '1', 
            'added_by' => env('DEFAULT_USER'),
            'modified_by' => env('DEFAULT_USER')],
            [
            'code'=> '2',
            'module_code'=> '300',
            'user_id'=> '2',
            'access_rights'=> '1', 
            'added_by' => env('DEFAULT_USER'),
            'modified_by' => env('DEFAULT_USER')],
            [
            'code'=> '3',
            'module_code'=> '300',
            'user_id'=> '3',
            'access_rights'=> '1', 
            'added_by' => env('DEFAULT_USER'),
            'modified_by' => env('DEFAULT_USER')],
            [
            'code'=> '4',
            'module_code'=> '600',
            'user_id'=> '1',
            'access_rights'=> '1', 
            'added_by' => env('DEFAULT_USER'),
            'modified_by' => env('DEFAULT_USER')],
            [
            'code'=> '5',
            'module_code'=> '300',
            'user_id'=> '4',
            'access_rights'=> '1', 
            'added_by' => env('DEFAULT_USER'),
            'modified_by' => env('DEFAULT_USER')],
            [
            'code'=> '6',
            'module_code'=> '300',
            'user_id'=> '5',
            'access_rights'=> '1', 
            'added_by' => env('DEFAULT_USER'),
            'modified_by' => env('DEFAULT_USER')],
        ]);
    }
}
