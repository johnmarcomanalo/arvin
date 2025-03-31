<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\RefSections;
use Illuminate\Support\Facades\DB;

class RefSectionsSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        // DB::table('ref_sections')->delete();
        RefSections::insert([
        //     [
        //     'code'=> '1',
        //     'company_code'=> '1',
        //     'business_unit_code'=> '1',
        //     'team_code'=> '1',
        //     'department_code'=> '1',
        //     'description' => 'Treasury',
        //     'added_by' => env('DEFAULT_USER'),
        //     'modified_by' => env('DEFAULT_USER')],
        //     [
        //      'code'=> '2',
        //     'company_code'=> '1',
        //     'business_unit_code'=> '1',
        //     'team_code'=> '1',
        //     'department_code'=> '1',
        //     'description' => 'Accounting Receivables',
        //     'added_by' => env('DEFAULT_USER'),
        //     'modified_by' => env('DEFAULT_USER')],
        //     [
        //      'code'=> '3',
        //     'company_code'=> '1',
        //     'business_unit_code'=> '1',
        //     'team_code'=> '1',
        //     'department_code'=> '1',
        //     'description' => 'Billing',
        //     'added_by' => env('DEFAULT_USER'),
        //     'modified_by' => env('DEFAULT_USER')],
        //     [
        //      'code'=> '4',
        //     'company_code'=> '1',
        //     'business_unit_code'=> '1',
        //     'team_code'=> '1',
        //     'department_code'=> '1',
        //     'description' => 'Credit and Collection',
        //     'added_by' => env('DEFAULT_USER'),
        //     'modified_by' => env('DEFAULT_USER')],
        //        [
        //      'code'=> '5',
        //     'company_code'=> '1',
        //     'business_unit_code'=> '1',
        //     'team_code'=> '1',
        //     'department_code'=> '1',
        //     'description' => 'Controller',
        //     'added_by' => env('DEFAULT_USER'),
        //     'modified_by' => env('DEFAULT_USER')],
        //      [
        //      'code'=> '6',
        //     'company_code'=> '1',
        //     'business_unit_code'=> '1',
        //     'team_code'=> '1',
        //     'department_code'=> '1',
        //     'description' => 'Bookeeping',
        //     'added_by' => env('DEFAULT_USER'),
        //     'modified_by' => env('DEFAULT_USER')],
        //             [
        //      'code'=> '7',
        //     'company_code'=> '1',
        //     'business_unit_code'=> '1',
        //     'team_code'=> '1',
        //     'department_code'=> '1',
        //     'description' => 'Accounts Payable',
        //     'added_by' => env('DEFAULT_USER'),
        //     'modified_by' => env('DEFAULT_USER')],

        //           [
        //      'code'=> '8',
        //     'company_code'=> '1',
        //     'business_unit_code'=> '1',
        //     'team_code'=> '1',
        //     'department_code'=> '1',
        //     'description' => 'General Accounting',
        //     'added_by' => env('DEFAULT_USER'),
        //     'modified_by' => env('DEFAULT_USER')],

        //           [
        //      'code'=> '9',
        //     'company_code'=> '1',
        //     'business_unit_code'=> '1',
        //     'team_code'=> '1',
        //     'department_code'=> '1',
        //     'description' => 'Audit',
        //     'added_by' => env('DEFAULT_USER'),
        //     'modified_by' => env('DEFAULT_USER')],
        //    [
        //      'code'=> '10',
        //     'company_code'=> '1',
        //     'business_unit_code'=> '1',
        //     'team_code'=> '1',
        //     'department_code'=> '2',
        //     'description' => 'Human Resources',
        //     'added_by' => env('DEFAULT_USER'),
        //     'modified_by' => env('DEFAULT_USER')],
        //     [
        //      'code'=> '11',
        //     'company_code'=> '1',
        //     'business_unit_code'=> '1',
        //     'team_code'=> '1',
        //     'department_code'=> '3',
        //     'description' => 'Import',
        //     'added_by' => env('DEFAULT_USER'),
        //     'modified_by' => env('DEFAULT_USER')],

        //                     [
        //      'code'=> '12',
        //     'company_code'=> '1',
        //     'business_unit_code'=> '1',
        //     'team_code'=> '1',
        //     'department_code'=> '4',
        //     'description' => 'IT',
        //     'added_by' => env('DEFAULT_USER'),
        //     'modified_by' => env('DEFAULT_USER')],

        //                     [
        //      'code'=> '13',
        //     'company_code'=> '1',
        //     'business_unit_code'=> '1',
        //     'team_code'=> '1',
        //     'department_code'=> '5',
        //     'description' => 'Logistics',
        //     'added_by' => env('DEFAULT_USER'),
        //     'modified_by' => env('DEFAULT_USER')],

        //                         [
        //      'code'=> '14',
        //     'company_code'=> '1',
        //     'business_unit_code'=> '1',
        //     'team_code'=> '1',
        //     'department_code'=> '6',
        //     'description' => 'Purchasing',
        //     'added_by' => env('DEFAULT_USER'),
        //     'modified_by' => env('DEFAULT_USER')],
            
        //                         [
        //      'code'=> '15',
        //     'company_code'=> '1',
        //     'business_unit_code'=> '1',
        //     'team_code'=> '1',
        //     'department_code'=> '7',
        //     'description' => 'QMS',
        //     'added_by' => env('DEFAULT_USER'),
        //     'modified_by' => env('DEFAULT_USER')],

        

        //     [
        //     'code'=> '16',
        //     'company_code'=> '1',
        //     'business_unit_code'=> '1',
        //     'team_code'=> '2',
        //     'department_code'=> '8',
        //     'description' => 'Harbour',
        //     'added_by' => env('DEFAULT_USER'),
        //     'modified_by' => env('DEFAULT_USER')],

        //     [
        //     'code'=> '17',
        //     'company_code'=> '1',
        //     'business_unit_code'=> '1',
        //     'team_code'=> '2',
        //     'department_code'=> '9',
        //     'description' => 'Calaca',
        //     'added_by' => env('DEFAULT_USER'),
        //     'modified_by' => env('DEFAULT_USER')],

        //     [
        //     'code'=> '18',
        //     'company_code'=> '1',
        //     'business_unit_code'=> '1',
        //     'team_code'=> '2',
        //     'department_code'=> '9',
        //     'description' => 'PNOC',
        //     'added_by' => env('DEFAULT_USER'),
        //     'modified_by' => env('DEFAULT_USER')],

        //      [
        //      'code'=> '19',
        //     'company_code'=> '1',
        //     'business_unit_code'=> '1',
        //     'team_code'=> '2',
        //     'department_code'=> '9',
        //     'description' => 'Bolo',
        //     'added_by' => env('DEFAULT_USER'),
        //     'modified_by' => env('DEFAULT_USER')],
        //     [
        //      'code'=> '20',
        //     'company_code'=> '1',
        //     'business_unit_code'=> '1',
        //     'team_code'=> '2',
        //     'department_code'=> '9',
        //     'description' => 'Malabanon',
        //     'added_by' => env('DEFAULT_USER'),
        //     'modified_by' => env('DEFAULT_USER')],

        //     [
        //      'code'=> '21',
        //     'company_code'=> '1',
        //     'business_unit_code'=> '1',
        //     'team_code'=> '2',
        //     'department_code'=> '9',
        //     'description' => 'Pampanga',
        //     'added_by' => env('DEFAULT_USER'),
        //     'modified_by' => env('DEFAULT_USER')],

        //     [
        //      'code'=> '22',
        //     'company_code'=> '1',
        //     'business_unit_code'=> '1',
        //     'team_code'=> '2',
        //     'department_code'=> '9',
        //     'description' => 'Bataan',
        //     'added_by' => env('DEFAULT_USER'),
        //     'modified_by' => env('DEFAULT_USER')],
        //     [
        //     'code'=> '23',
        //     'company_code'=> '1',
        //     'business_unit_code'=> '1',
        //     'team_code'=> '2',
        //     'department_code'=> '10',
        //     'description' => 'Luzon',
        //     'added_by' => env('DEFAULT_USER'),
        //     'modified_by' => env('DEFAULT_USER')],

        //      [
        //      'code'=> '24',
        //     'company_code'=> '1',
        //     'business_unit_code'=> '1',
        //     'team_code'=> '2',
        //     'department_code'=> '10',
        //     'description' => 'Visayas',
        //     'added_by' => env('DEFAULT_USER'),
        //     'modified_by' => env('DEFAULT_USER')],

        //     [
        //      'code'=> '25',
        //     'company_code'=> '1',
        //     'business_unit_code'=> '1',
        //     'team_code'=> '2',
        //     'department_code'=> '10',
        //     'description' => 'Mindanao',
        //     'added_by' => env('DEFAULT_USER'),
        //     'modified_by' => env('DEFAULT_USER')],

            // [
            // 'code'=> '26',
            // 'company_code'=> '1',
            // 'business_unit_code'=> '1',
            // 'team_code'=> '1',
            // 'department_code'=> '8',
            // 'description' => 'Sales',
            // 'added_by' => env('DEFAULT_USER'),
            // 'modified_by' => env('DEFAULT_USER')],

                 [
            'code'=> '27',
            'company_code'=> '1',
            'business_unit_code'=> '1',
            'team_code'=> '1',
            'department_code'=> '11',
            'description' => 'Executive',
            'added_by' => env('DEFAULT_USER'),
            'modified_by' => env('DEFAULT_USER')],
        ]);
    }
}
