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
            [
            'code'=> '1',
            'username'=> 'johnmarcomanalo09',
            'first_name' => 'John Marco',
            'last_name' => 'Manalo',
            'device_password' => '',
            'company_code' => '1',
            'business_unit_code' => '1',
            'team_code' => '1',
            'department_code' => '4',
            'section_code' => '12',
            'subsection_code' => '12',
            'password' => bcrypt("welcome123"),
            'added_by' => env('DEFAULT_USER'),
            'modified_by' => env('DEFAULT_USER')],
            // [
            // 'code'=> '2',
            // 'username'=> 'test_bacolod',
            // 'first_name' => 'John Marco',
            // 'last_name' => 'Manalo',
            // 'device_password' => '',
            // 'password' => bcrypt("welcome123"),
            // 'added_by' => env('DEFAULT_USER'),
            // 'modified_by' => env('DEFAULT_USER')]

            // [
            // 'code'=> '3',
            // 'username'=> 'test_cagayan',
            // 'first_name' => 'John',
            // 'last_name' => 'Cagayan',
            // 'device_password' => '',
            // 'subsection_code' => '30',
            // 'password' => bcrypt("welcome123"),
            // 'added_by' => env('DEFAULT_USER'),
            // 'modified_by' => env('DEFAULT_USER')],

            // [
            // 'code'=> '4',
            // 'username'=> 'test_cebu',
            // 'first_name' => 'John',
            // 'last_name' => 'Cebu',
            // 'device_password' => '',
            // 'subsection_code' => '31',
            // 'password' => bcrypt("welcome123"),
            // 'added_by' => env('DEFAULT_USER'),
            // 'modified_by' => env('DEFAULT_USER')],

            // [
            // 'code'=> '5',
            // 'username'=> 'test_davao',
            // 'first_name' => 'John',
            // 'last_name' => 'Davao',
            // 'device_password' => '',
            // 'subsection_code' => '32',
            // 'password' => bcrypt("welcome123"),
            // 'added_by' => env('DEFAULT_USER'),
            // 'modified_by' => env('DEFAULT_USER')]


            // [
            // 'code'=> '6',
            // 'username'=> 'test_bataan',
            // 'first_name' => 'John',
            // 'last_name' => 'Bataan',
            // 'device_password' => '',
            // 'subsection_code' => '23',
            // 'password' => bcrypt("welcome123"),
            // 'added_by' => env('DEFAULT_USER'),
            // 'modified_by' => env('DEFAULT_USER')]
        ]);
    }
}
