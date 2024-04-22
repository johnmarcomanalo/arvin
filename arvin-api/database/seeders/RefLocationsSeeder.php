<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\RefLocations;
class RefLocationsSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        RefLocations::insert([
        [
            'code'=> '1',
            'company_code'=> '1',
            'business_unit_code'=> '1',
            'description' => 'Pasay (HO)',
            'team_code'=> '1',
            'added_by' => env('DEFAULT_USER'),
            'modified_by' => env('DEFAULT_USER')],

        [
            'code'=> '2',
            'company_code'=> '1',
            'business_unit_code'=> '1',
            'team_code'=> '2',
            'description' => 'Harbor (WH)',
            'added_by' => env('DEFAULT_USER'),
            'modified_by' => env('DEFAULT_USER')],
        [
            'code'=> '3',
            'company_code'=> '1',
            'business_unit_code'=> '1',
            'team_code'=> '2',
            'description' => 'Malabon (WH)',
            'added_by' => env('DEFAULT_USER'),
            'modified_by' => env('DEFAULT_USER')],
        [
            'code'=> '4',
            'company_code'=> '1',
            'business_unit_code'=> '1',
            'team_code'=> '2',
            'description' => 'Pampanga (WH)',
            'added_by' => env('DEFAULT_USER'),
            'modified_by' => env('DEFAULT_USER')],
            
        [
            'code'=> '5',
            'company_code'=> '1',
            'business_unit_code'=> '1',
            'team_code'=> '2',
            'description' => 'Mabini, Batangas PNOC (WH)',
            'added_by' => env('DEFAULT_USER'),
            'modified_by' => env('DEFAULT_USER')],
        
            [
            'code'=> '6',
            'company_code'=> '1',
            'business_unit_code'=> '1',
            'team_code'=> '2',
            'description' => 'Calaca, Batangas (WH)',
            'added_by' => env('DEFAULT_USER'),
            'modified_by' => env('DEFAULT_USER')],
                [
            'code'=> '7',
            'company_code'=> '1',
            'business_unit_code'=> '1',
            'team_code'=> '2',
            'description' => 'Bataan (WH)',
            'added_by' => env('DEFAULT_USER'),
            'modified_by' => env('DEFAULT_USER')],
            [
            'code'=> '8',
            'company_code'=> '1',
            'business_unit_code'=> '1',
            'team_code'=> '2',
            'description' => 'Tabacco, Bicol (WH)',
            'added_by' => env('DEFAULT_USER'),
            'modified_by' => env('DEFAULT_USER')],

[
            'code'=> '9',
            'company_code'=> '1',
            'business_unit_code'=> '1',
            'team_code'=> '2',
            'description' => 'Cebu (WH)',
            'added_by' => env('DEFAULT_USER'),
            'modified_by' => env('DEFAULT_USER')],

[
            'code'=> '10',
            'company_code'=> '1',
            'business_unit_code'=> '1',
            'team_code'=> '2',
            'description' => 'Bacolod (WH)',
            'added_by' => env('DEFAULT_USER'),
            'modified_by' => env('DEFAULT_USER')],











        ]);
    }
}
