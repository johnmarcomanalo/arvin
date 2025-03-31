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
            // 'type' => 'TRE',
            // 'added_by' => env('DEFAULT_USER'),
            // 'modified_by' => env('DEFAULT_USER')],
            // [
            // 'code'=> '2',
            // 'section_code'=> '2',
            // 'description' => 'Accounting Receivables',
            // 'type' => 'AR',
            // 'added_by' => env('DEFAULT_USER'),
            // 'modified_by' => env('DEFAULT_USER')],
            // [
            // 'code'=> '3',
            // 'section_code'=> '3',
            // 'description' => 'Billing',
            // 'type' => 'BIL',
            // 'added_by' => env('DEFAULT_USER'),
            // 'modified_by' => env('DEFAULT_USER')],
            // [
            // 'code'=> '4',
            // 'section_code'=> '4',
            // 'description' => 'Credit and Collection',
            // 'type' => 'CC',
            // 'added_by' => env('DEFAULT_USER'),
            // 'modified_by' => env('DEFAULT_USER')],
            // [
            // 'code'=> '5',
            // 'section_code'=> '5',
            // 'description' => 'Controller',
            // 'type' => 'CTR',
            // 'added_by' => env('DEFAULT_USER'),
            // 'modified_by' => env('DEFAULT_USER')],
            // [
            // 'code'=> '6',
            // 'section_code'=> '6',
            // 'description' => 'Bookeeping',
            // 'type' => 'BK',
            // 'added_by' => env('DEFAULT_USER'),
            // 'modified_by' => env('DEFAULT_USER')],
            // [
            // 'code'=> '7',
            // 'section_code'=> '7',
            // 'description' => 'Accounts Payable',
            // 'type' => 'AP',
            // 'added_by' => env('DEFAULT_USER'),
            // 'modified_by' => env('DEFAULT_USER')],
            // [
            // 'code'=> '8',
            // 'section_code'=> '8',
            // 'description' => 'General Accounting',
            // 'type' => 'GA',
            // 'added_by' => env('DEFAULT_USER'),
            // 'modified_by' => env('DEFAULT_USER')],
            // [
            // 'code'=> '9',
            // 'section_code'=> '9',
            // 'description' => 'Audit',
            // 'type' => 'AD',
            // 'added_by' => env('DEFAULT_USER'),
            // 'modified_by' => env('DEFAULT_USER')],
            // [
            // 'code'=> '10',
            // 'section_code'=> '10',
            // 'description' => 'Human Resources',
            // 'type' => 'HR',
            // 'added_by' => env('DEFAULT_USER'),
            // 'modified_by' => env('DEFAULT_USER')],
            // [
            // 'code'=> '11',
            // 'section_code'=> '11',
            // 'description' => 'Import',
            // 'type' => 'IP',
            // 'added_by' => env('DEFAULT_USER'),
            // 'modified_by' => env('DEFAULT_USER')],
            // [
            // 'code'=> '12',
            // 'section_code'=> '12',
            // 'description' => 'IT',
            // 'type' => 'IT',
            // 'added_by' => env('DEFAULT_USER'),
            // 'modified_by' => env('DEFAULT_USER')],
            // [
            // 'code'=> '13',
            // 'section_code'=> '13',
            // 'description' => 'Logistics',
            // 'type' => 'LGT',
            // 'added_by' => env('DEFAULT_USER'),
            // 'modified_by' => env('DEFAULT_USER')],
            // [
            // 'code'=> '14',
            // 'section_code'=> '14',
            // 'description' => 'Purchasing',
            // 'type' => 'PUR',
            // 'added_by' => env('DEFAULT_USER'),
            // 'modified_by' => env('DEFAULT_USER')],
            // [
            // 'code'=> '15',
            // 'section_code'=> '15',
            // 'description' => 'QMS',
            // 'type' => 'QMS',
            // 'added_by' => env('DEFAULT_USER'),
            // 'modified_by' => env('DEFAULT_USER')],
            // [
            // 'code'=> '16',
            // 'section_code'=> '16',
            // 'description' => 'Harbour',
            // 'type' => 'HAR',
            // 'added_by' => env('DEFAULT_USER'),
            // 'modified_by' => env('DEFAULT_USER')],
            // [
            // 'code'=> '17',
            // 'section_code'=> '17',
            // 'description' => 'Calaca',
            // 'type' => 'CAL',
            // 'added_by' => env('DEFAULT_USER'),
            // 'modified_by' => env('DEFAULT_USER')],
            // [
            // 'code'=> '18',
            // 'section_code'=> '18',
            // 'description' => 'PNOC',
            // 'type' => 'PNOC',
            // 'added_by' => env('DEFAULT_USER'),
            // 'modified_by' => env('DEFAULT_USER')],
            // [
            // 'code'=> '19',
            // 'section_code'=> '19',
            // 'description' => 'Bolo',
            // 'type' => 'BOL',
            // 'added_by' => env('DEFAULT_USER'),
            // 'modified_by' => env('DEFAULT_USER')],
            // [
            // 'code'=> '20',
            // 'section_code'=> '20',
            // 'description' => 'Malabanon',
            // 'type' => 'MAL',
            // 'added_by' => env('DEFAULT_USER'),
            // 'modified_by' => env('DEFAULT_USER')],
            // [
            // 'code'=> '21',
            // 'section_code'=> '21',
            // 'description' => 'Pampanga',
            // 'type' => 'PAM',
            // 'added_by' => env('DEFAULT_USER'),
            // 'modified_by' => env('DEFAULT_USER')],
            // [
            // 'code'=> '22',
            // 'section_code'=> '22',
            // 'description' => 'Bataan',
            // 'type' => 'BAT',
            // 'added_by' => env('DEFAULT_USER'),
            // 'modified_by' => env('DEFAULT_USER')],
            //  [
            // 'code'=> '23',
            // 'section_code'=> '23',
            // 'description' => 'Tabaco',
            // 'type' => 'TAB',
            // 'added_by' => env('DEFAULT_USER'),
            // 'modified_by' => env('DEFAULT_USER')],
            // [
            // 'code'=> '24',
            // 'section_code'=> '24',
            // 'description' => 'Iloilo',
            // 'type' => 'ILO',
            // 'added_by' => env('DEFAULT_USER'),
            // 'modified_by' => env('DEFAULT_USER')],
            // [
            // 'code'=> '25',
            // 'section_code'=> '24',
            // 'description' => 'Bacolod',
            // 'type' => 'BAC',
            // 'added_by' => env('DEFAULT_USER'),
            // 'modified_by' => env('DEFAULT_USER')],
            // [
            // 'code'=> '26',
            // 'section_code'=> '25',
            // 'description' => 'Zamboanga',
            // 'type' => 'ZAM',
            // 'added_by' => env('DEFAULT_USER'),
            // 'modified_by' => env('DEFAULT_USER')],
            // [
            // 'code'=> '27',
            // 'section_code'=> '23',
            // 'description' => 'Cagayan',
            // 'type' => 'CAG',
            // 'added_by' => env('DEFAULT_USER'),
            // 'modified_by' => env('DEFAULT_USER')],
            // [
            // 'code'=> '28',
            // 'section_code'=> '24',
            // 'description' => 'Cebu',
            // 'type' => 'CEB',
            // 'added_by' => env('DEFAULT_USER'),
            // 'modified_by' => env('DEFAULT_USER')],
            // [
            // 'code'=> '29',
            // 'section_code'=> '25',
            // 'description' => 'Davao',
            // 'type' => 'DAV',
            // 'added_by' => env('DEFAULT_USER'),
            // 'modified_by' => env('DEFAULT_USER')],
            // [
            // 'code'=> '30',
            // 'section_code'=> '25',
            // 'description' => 'General Santos',
            // 'type' => 'GEN',
            // 'added_by' => env('DEFAULT_USER'),
            // 'modified_by' => env('DEFAULT_USER')],
            // [
            // 'code'=> '31',
            // 'section_code'=> '26',
            // 'description' => 'Sales',
            // 'type' => 'SALE',
            // 'added_by' => env('DEFAULT_USER'),
            // 'modified_by' => env('DEFAULT_USER')],
            //  [
            // 'code'=> '32',
            // 'section_code'=> '27',
            // 'description' => 'Executive',
            // 'type' => 'EXEC',
            // 'added_by' => env('DEFAULT_USER'),
            // 'modified_by' => env('DEFAULT_USER')],

            // [
            // 'code'=> '33',
            // 'section_code'=> '24',
            // 'description' => 'Dumaguete',
            // 'type' => 'DUM',
            // 'added_by' => env('DEFAULT_USER'),
            // 'modified_by' => env('DEFAULT_USER')],

            // [
            // 'code'=> '34',
            // 'section_code'=> '25',
            // 'description' => 'Surigao',
            // 'type' => 'SUR',
            // 'added_by' => env('DEFAULT_USER'),
            // 'modified_by' => env('DEFAULT_USER')],
        ]);
    }
}
