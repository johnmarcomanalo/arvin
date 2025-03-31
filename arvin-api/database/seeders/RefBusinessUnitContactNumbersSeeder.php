<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\RefBusinessUnitContactNumbers;
use Illuminate\Support\Facades\DB;

class RefBusinessUnitContactNumbersSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
          RefBusinessUnitContactNumbers::insert([
            [
            'code'=> '1',
            'business_unit_code' => '1',
            'type' => 'Telephone Number',
            'description' => '(02) 843-3676',
            'added_by' => env('DEFAULT_USER'),
            'modified_by' => env('DEFAULT_USER')],
              [
            'code'=> '2',
            'business_unit_code' => '1',
            'type' => 'Telephone Number',
            'description' => '(02) 843-3677',
            'added_by' => env('DEFAULT_USER'),
            'modified_by' => env('DEFAULT_USER')],
              [
            'code'=> '3',
            'business_unit_code' => '1',
            'type' => 'Telephone Number',
            'description' => '(02) 843-3678',
            'added_by' => env('DEFAULT_USER'),
            'modified_by' => env('DEFAULT_USER')],
              [
            'code'=> '4',
            'business_unit_code' => '1',
            'type' => 'Telephone Number',
            'description' => '(02) 843-3679',
            'added_by' => env('DEFAULT_USER'),
            'modified_by' => env('DEFAULT_USER')],
              [
            'code'=> '5',
            'business_unit_code' => '1',
            'type' => 'Telephone Number',
            'description' => '(02) 843-3680',
            'added_by' => env('DEFAULT_USER'),
            'modified_by' => env('DEFAULT_USER')],
                [
            'code'=> '6',
            'business_unit_code' => '1',
            'type' => 'Telephone Number',
            'description' => '(02) 815-0469',
            'added_by' => env('DEFAULT_USER'),
            'modified_by' => env('DEFAULT_USER')],
                  [
            'code'=> '7',
            'business_unit_code' => '1',
            'type' => 'Telephone Number',
            'description' => '(02) 815-0470',
            'added_by' => env('DEFAULT_USER'),
            'modified_by' => env('DEFAULT_USER')],
                   [
            'code'=> '8',
            'business_unit_code' => '1',
            'type' => 'Telephone Number',
            'description' => '(02) 869-1655',
            'added_by' => env('DEFAULT_USER'),
            'modified_by' => env('DEFAULT_USER')],
                    [
            'code'=> '9',
            'business_unit_code' => '1',
            'type' => 'Telephone Number',
            'description' => '(02) 801-4284',
            'added_by' => env('DEFAULT_USER'),
            'modified_by' => env('DEFAULT_USER')],
                   [
            'code'=> '10',
            'business_unit_code' => '1',
            'type' => 'Email Address',
            'description' => 'info@arvinintl.com',
            'added_by' => env('DEFAULT_USER'),
            'modified_by' => env('DEFAULT_USER')],

                   [
            'code'=> '11',
            'business_unit_code' => '1',
            'type' => 'Email Address',
            'description' => 'import@arvinintl.com',
            'added_by' => env('DEFAULT_USER'),
            'modified_by' => env('DEFAULT_USER')],
        ]);
    }
}
