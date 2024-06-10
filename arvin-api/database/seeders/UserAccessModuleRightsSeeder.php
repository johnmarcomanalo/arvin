<?php

namespace Database\Seeders;
use App\Models\UserAccessModuleRights;

use Illuminate\Database\Seeder;

class UserAccessModuleRightsSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        UserAccessModuleRights::insert([
            // [
            // 'code'=> '1',
            // 'module_code'=> '300',
            // 'user_id'=> '1',
            // 'access_rights'=> '1', 
            // 'added_by' => env('DEFAULT_USER'),
            // 'modified_by' => env('DEFAULT_USER')],

            //    [
            // 'code'=> '2',
            // 'module_code'=> '300',
            // 'user_id'=> '2',
            // 'access_rights'=> '1', 
            // 'added_by' => env('DEFAULT_USER'),
            // 'modified_by' => env('DEFAULT_USER')],

            [
            'code'=> '3',
            'module_code'=> '300',
            'user_id'=> '3',
            'access_rights'=> '1', 
            'added_by' => env('DEFAULT_USER'),
            'modified_by' => env('DEFAULT_USER')],
        ]);
    }
}
