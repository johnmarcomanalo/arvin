<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\RefMonths;

class RefMonthsSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
      RefMonths::insert([
            [
            'code'=> '1',
            'description' => 'JANUARY',
            'value' => '01',
            'added_by' => env('DEFAULT_USER'),
            'modified_by' => env('DEFAULT_USER')],   

            [
            'code'=> '2',
            'description' => 'FEBRUARY',
            'value' => '02',
            'added_by' => env('DEFAULT_USER'),
            'modified_by' => env('DEFAULT_USER')],   

            [
            'code'=> '3',
            'description' => 'MARCH',
            'value' => '03',
            'added_by' => env('DEFAULT_USER'),
            'modified_by' => env('DEFAULT_USER')],   

            [
            'code'=> '4',
            'description' => 'APRIL',
            'value' => '04',
            'added_by' => env('DEFAULT_USER'),
            'modified_by' => env('DEFAULT_USER')],   

            [
            'code'=> '5',
            'description' => 'MAY',
            'value' => '05',
            'added_by' => env('DEFAULT_USER'),
            'modified_by' => env('DEFAULT_USER')],   

            [
            'code'=> '6',
            'description' => 'JUNE',
            'value' => '06',
            'added_by' => env('DEFAULT_USER'),
            'modified_by' => env('DEFAULT_USER')], 

            [
            'code'=> '7',
            'description' => 'JULY',
            'value' => '07',
            'added_by' => env('DEFAULT_USER'),
            'modified_by' => env('DEFAULT_USER')], 

            [
            'code'=> '8',
            'description' => 'AUGUST',
            'value' => '08',
            'added_by' => env('DEFAULT_USER'),
            'modified_by' => env('DEFAULT_USER')], 

            [
            'code'=> '9',
            'description' => 'SEPTEMBER',
            'value' => '09',
            'added_by' => env('DEFAULT_USER'),
            'modified_by' => env('DEFAULT_USER')], 

            [
            'code'=> '10',
            'description' => 'OCTOBER',
            'value' => '10',
            'added_by' => env('DEFAULT_USER'),
            'modified_by' => env('DEFAULT_USER')], 

            [
            'code'=> '11',
            'description' => 'NOVEMBER',
            'value' => '11',
            'added_by' => env('DEFAULT_USER'),
            'modified_by' => env('DEFAULT_USER')], 

            [
            'code'=> '12',
            'description' => 'DECEMBER',
            'value' => '12',
            'added_by' => env('DEFAULT_USER'),
            'modified_by' => env('DEFAULT_USER')], 
        ]);
    }
}
