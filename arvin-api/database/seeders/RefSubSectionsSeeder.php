<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\RefSubSections;
use Illuminate\Support\Facades\DB;

class RefSubSectionsSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        // DB::table('ref_sub_sections')->delete();
        RefSubSections::insert([
            // [
            // 'code'=> '1',
            // 'section_code'=> '1',
            // 'description' => 'Treasury',
            // 'added_by' => env('DEFAULT_USER'),
            // 'modified_by' => env('DEFAULT_USER')],
            // [
            // 'code'=> '2',
            // 'section_code'=> '2',
            // 'description' => 'Accounting Receivables',
            // 'added_by' => env('DEFAULT_USER'),
            // 'modified_by' => env('DEFAULT_USER')],
            // [
            // 'code'=> '3',
            // 'section_code'=> '3',
            // 'description' => 'Billing',
            // 'added_by' => env('DEFAULT_USER'),
            // 'modified_by' => env('DEFAULT_USER')],
            // [
            // 'code'=> '4',
            // 'section_code'=> '4',
            // 'description' => 'Credit and Collection',
            // 'added_by' => env('DEFAULT_USER'),
            // 'modified_by' => env('DEFAULT_USER')],
            // [
            // 'code'=> '5',
            // 'section_code'=> '5',
            // 'description' => 'Controller',
            // 'added_by' => env('DEFAULT_USER'),
            // 'modified_by' => env('DEFAULT_USER')],
            // [
            // 'code'=> '6',
            // 'section_code'=> '6',
            // 'description' => 'Bookeeping',
            // 'added_by' => env('DEFAULT_USER'),
            // 'modified_by' => env('DEFAULT_USER')],
            // [
            // 'code'=> '7',
            // 'section_code'=> '7',
            // 'description' => 'Accounts Payable',
            // 'added_by' => env('DEFAULT_USER'),
            // 'modified_by' => env('DEFAULT_USER')],
            // [
            // 'code'=> '8',
            // 'section_code'=> '8',
            // 'description' => 'General Accounting',
            // 'added_by' => env('DEFAULT_USER'),
            // 'modified_by' => env('DEFAULT_USER')],
            // [
            // 'code'=> '9',
            // 'section_code'=> '9',
            // 'description' => 'Audit',
            // 'added_by' => env('DEFAULT_USER'),
            // 'modified_by' => env('DEFAULT_USER')],
            // [
            // 'code'=> '10',
            // 'section_code'=> '10',
            // 'description' => 'Human Resources',
            // 'added_by' => env('DEFAULT_USER'),
            // 'modified_by' => env('DEFAULT_USER')],
            // [
            // 'code'=> '11',
            // 'section_code'=> '11',
            // 'description' => 'Import',
            // 'added_by' => env('DEFAULT_USER'),
            // 'modified_by' => env('DEFAULT_USER')],
            // [
            // 'code'=> '12',
            // 'section_code'=> '12',
            // 'description' => 'IT',
            // 'added_by' => env('DEFAULT_USER'),
            // 'modified_by' => env('DEFAULT_USER')],
            // [
            // 'code'=> '13',
            // 'section_code'=> '13',
            // 'description' => 'Logistics',
            // 'added_by' => env('DEFAULT_USER'),
            // 'modified_by' => env('DEFAULT_USER')],
            // [
            // 'code'=> '14',
            // 'section_code'=> '14',
            // 'description' => 'Logistics',
            // 'added_by' => env('DEFAULT_USER'),
            // 'modified_by' => env('DEFAULT_USER')],
            // [
            // 'code'=> '15',
            // 'section_code'=> '15',
            // 'description' => 'QMS',
            // 'added_by' => env('DEFAULT_USER'),
            // 'modified_by' => env('DEFAULT_USER')],
            // [
            // 'code'=> '16',
            // 'section_code'=> '16',
            // 'description' => 'QMS',
            // 'added_by' => env('DEFAULT_USER'),
            // 'modified_by' => env('DEFAULT_USER')],
            // [
            // 'code'=> '17',
            // 'section_code'=> '17',
            // 'description' => 'WH Harbour',
            // 'added_by' => env('DEFAULT_USER'),
            // 'modified_by' => env('DEFAULT_USER')],
            // [
            // 'code'=> '18',
            // 'section_code'=> '18',
            // 'description' => 'WH Calaca',
            // 'added_by' => env('DEFAULT_USER'),
            // 'modified_by' => env('DEFAULT_USER')],
            // [
            // 'code'=> '19',
            // 'section_code'=> '19',
            // 'description' => 'WH PNOC',
            // 'added_by' => env('DEFAULT_USER'),
            // 'modified_by' => env('DEFAULT_USER')],
            // [
            // 'code'=> '20',
            // 'section_code'=> '20',
            // 'description' => 'WH Bolo',
            // 'added_by' => env('DEFAULT_USER'),
            // 'modified_by' => env('DEFAULT_USER')],
            // [
            // 'code'=> '21',
            // 'section_code'=> '21',
            // 'description' => 'WH Malabanon',
            // 'added_by' => env('DEFAULT_USER'),
            // 'modified_by' => env('DEFAULT_USER')],
            // [
            // 'code'=> '22',
            // 'section_code'=> '22',
            // 'description' => 'WH Pampanga',
            // 'added_by' => env('DEFAULT_USER'),
            // 'modified_by' => env('DEFAULT_USER')],
            // [
            // 'code'=> '23',
            // 'section_code'=> '23',
            // 'description' => 'WH Bataan',
            // 'added_by' => env('DEFAULT_USER'),
            // 'modified_by' => env('DEFAULT_USER')],
            // [
            // 'code'=> '24',
            // 'section_code'=> '24',
            // 'description' => 'WH Bataan',
            // 'added_by' => env('DEFAULT_USER'),
            // 'modified_by' => env('DEFAULT_USER')],
            // [
            // 'code'=> '25',
            // 'section_code'=> '25',
            // 'description' => 'Tabacco',
            // 'added_by' => env('DEFAULT_USER'),
            // 'modified_by' => env('DEFAULT_USER')],
            // [
            // 'code'=> '26',
            // 'section_code'=> '26',
            // 'description' => 'Cebu',
            // 'added_by' => env('DEFAULT_USER'),
            // 'modified_by' => env('DEFAULT_USER')],
            // [
            // 'code'=> '27',
            // 'section_code'=> '27',
            // 'description' => 'Iloilo',
            // 'added_by' => env('DEFAULT_USER'),
            // 'modified_by' => env('DEFAULT_USER')],
            // [
            // 'code'=> '28',
            // 'section_code'=> '24',
            // 'description' => 'Bacolod',
            // 'added_by' => env('DEFAULT_USER'),
            // 'modified_by' => env('DEFAULT_USER')],
            // [
            // 'code'=> '29',
            // 'section_code'=> '29',
            // 'description' => 'Zamboanga',
            // 'added_by' => env('DEFAULT_USER'),
            // 'modified_by' => env('DEFAULT_USER')],
            [
            'code'=> '30',
            'section_code'=> '25',
            'description' => 'Cagayan',
            'added_by' => env('DEFAULT_USER'),
            'modified_by' => env('DEFAULT_USER')],

            [
            'code'=> '31',
            'section_code'=> '24',
            'description' => 'Cebu',
            'added_by' => env('DEFAULT_USER'),
            'modified_by' => env('DEFAULT_USER')],

            [
            'code'=> '32',
            'section_code'=> '25',
            'description' => 'Davao',
            'added_by' => env('DEFAULT_USER'),
            'modified_by' => env('DEFAULT_USER')],
        ]);
    }
}
