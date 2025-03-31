<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;

class UsersSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        User::insert([
            // [
            // 'code'=> '1',
            // 'username'=> 'johnmarcomanalo09',
            // 'first_name' => 'John Marco',
            // 'last_name' => 'Manalo',
            // 'device_password' => '',
            // 'company_code' => '1',
            // 'business_unit_code' => '1',
            // 'team_code' => '1',
            // 'department_code' => '4',
            // 'section_code' => '12',
            // 'subsection_code' => '12',
            // 'password' => bcrypt("welcome123"),
            // 'added_by' => env('DEFAULT_USER'),
            // 'modified_by' => env('DEFAULT_USER')],
            //  [
            // 'code'=> '2',
            // 'username'=> 'test_cagayan',
            // 'first_name' => 'John Marco',
            // 'last_name' => 'Manalo',
            // 'device_password' => '',
            // 'company_code' => '1',
            // 'business_unit_code' => '1',
            // 'team_code' => '2',
            // 'department_code' => '10',
            // 'section_code' => '23',
            // 'subsection_code' => '27',
            // 'password' => bcrypt("welcome123"),
            // 'added_by' => env('DEFAULT_USER'),
            // 'modified_by' => env('DEFAULT_USER')],
            // [
            // 'code'=> '3',
            // 'username'=> 'j.arellano',
            // 'first_name' => 'Jaya',
            // 'last_name' => 'Arellano',
            // 'device_password' => '',
            // 'company_code' => '1',
            // 'business_unit_code' => '1',
            // 'team_code' => '1',
            // 'department_code' => '1',
            // 'section_code' => '8',
            // 'subsection_code' => '8',
            // 'password' => bcrypt("welcome123"),
            // 'added_by' => env('DEFAULT_USER'),
            // 'modified_by' => env('DEFAULT_USER')],
            [
                'code'=> '4',
                'username'=> 'test_davao',
                'first_name' => 'Davao',
                'last_name' => 'Warehouse',
                'device_password' => '',
                'company_code' => '1',
                'business_unit_code' => '1',
                'team_code' => '2',
                'department_code' => '10',
                'section_code' => '25',
                'subsection_code' => '29',
                'password' => bcrypt("welcome123"),
                'added_by' => env('DEFAULT_USER'),
                'modified_by' => env('DEFAULT_USER')],
            [
                'code'=> '5',
                'username'=> 'test_gensan',
                'first_name' => 'Davao',
                'last_name' => 'Warehouse',
                'device_password' => '',
                'company_code' => '1',
                'business_unit_code' => '1',
                'team_code' => '2',
                'department_code' => '10',
                'section_code' => '25',
                'subsection_code' => '30',
                'password' => bcrypt("welcome123"),
                'added_by' => env('DEFAULT_USER'),
                'modified_by' => env('DEFAULT_USER')],
        ]);
    }
}
