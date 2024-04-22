<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\RefDepartments;

class RefDepartmentsSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        RefDepartments::insert([
            [
            'code'=> '1',
            'company_code'=> '1',
            'business_unit_code'=> '1',
            'team_code'=> '1',
            'description' => 'Accounting',
            'added_by' => env('DEFAULT_USER'),
            'modified_by' => env('DEFAULT_USER')],
            [
            'code'=> '2',
            'company_code'=> '1',
            'business_unit_code'=> '1',
            'team_code'=> '1',
            'description' => 'Human Resources',
            'added_by' => env('DEFAULT_USER'),
            'modified_by' => env('DEFAULT_USER')],
            [
            'code'=> '3',
            'company_code'=> '1',
            'business_unit_code'=> '1',
            'team_code'=> '1',
            'description' => 'Import',
            'added_by' => env('DEFAULT_USER'),
            'modified_by' => env('DEFAULT_USER')],
            [
            'code'=> '4',
            'company_code'=> '1',
            'business_unit_code'=> '1',
            'team_code'=> '1',
            'description' => 'IT',
            'added_by' => env('DEFAULT_USER'),
            'modified_by' => env('DEFAULT_USER')],
            [
            'code'=> '5',
            'company_code'=> '1',
            'business_unit_code'=> '1',
            'team_code'=> '1',
            'description' => 'Logistics',
            'added_by' => env('DEFAULT_USER'),
            'modified_by' => env('DEFAULT_USER')],
            [
            'code'=> '6',
            'company_code'=> '1',
            'business_unit_code'=> '1',
            'team_code'=> '1',
            'description' => 'Purchasing',
            'added_by' => env('DEFAULT_USER'),
            'modified_by' => env('DEFAULT_USER')],
            [
            'code'=> '7',
            'company_code'=> '1',
            'business_unit_code'=> '1',
            'team_code'=> '1',
            'description' => 'QMS',
            'added_by' => env('DEFAULT_USER'),
            'modified_by' => env('DEFAULT_USER')],
            [
            'code'=> '8',
            'company_code'=> '1',
            'business_unit_code'=> '1',
            'team_code'=> '1',
            'description' => 'Sales',
            'added_by' => env('DEFAULT_USER'),
            'modified_by' => env('DEFAULT_USER')],

             [
            'code'=> '9',
            'company_code'=> '1',
            'business_unit_code'=> '1',
            'team_code'=> '2',
            'description' => 'Manila Branch',
            'added_by' => env('DEFAULT_USER'),
            'modified_by' => env('DEFAULT_USER')],
            [
            'code'=> '10',
            'company_code'=> '1',
            'business_unit_code'=> '1',
            'team_code'=> '2',
            'description' => 'Provincial',
            'added_by' => env('DEFAULT_USER'),
            'modified_by' => env('DEFAULT_USER')],
        ]);
    }
}
