<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\RefTeams;

class RefTeamsSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
          RefTeams::insert([
            [
            'code'=> '1',
            'company_code'=> '1',
            'business_unit_code'=> '1',
            'description' => 'Head Office',
            'added_by' => env('DEFAULT_USER'),
            'modified_by' => env('DEFAULT_USER')],
                 [
            'code'=> '2',
            'company_code'=> '1',
            'business_unit_code'=> '1',
            'description' => 'Warehouse',
            'added_by' => env('DEFAULT_USER'),
            'modified_by' => env('DEFAULT_USER')]
        ]);
    }
}
