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
            // 'username'=> 'admin',
            // 'first_name' => 'John Marco',
            // 'last_name' => 'Manalo',
            // 'device_password' => '',
            // 'password' => bcrypt("welcome123"),
            // 'added_by' => env('DEFAULT_USER'),
            // 'modified_by' => env('DEFAULT_USER')],
            [
            'code'=> '2',
            'username'=> 'test_bacolod',
            'first_name' => 'John Marco',
            'last_name' => 'Manalo',
            'device_password' => '',
            'password' => bcrypt("welcome123"),
            'added_by' => env('DEFAULT_USER'),
            'modified_by' => env('DEFAULT_USER')]
        ]);
    }
}
