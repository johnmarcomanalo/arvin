<?php

namespace Database\Seeders;
use App\Models\RefSubComponents;

use Illuminate\Database\Seeder;

class RefSubComponentsSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
      RefSubComponents::insert([
            // [
            // 'code'=> '300003001',
            // 'module_code'=> '300',
            // 'component_code'=> '300003',
            // 'description' => 'Sales Qouta',
            // 'link'=> '/Modules/Sales/Configuration/SalesQouta',
            // 'added_by' => env('DEFAULT_USER'),
            // 'modified_by' => env('DEFAULT_USER')],
            // [
            // 'code'=> '300003002',
            // 'module_code'=> '300',
            // 'component_code'=> '300003',
            // 'description' => 'Ranking Points',
            // 'link'=> '/Modules/Sales/Configuration/RankingPoints',
            // 'added_by' => env('DEFAULT_USER'),
            // 'modified_by' => env('DEFAULT_USER')],
            [
            'code'=> '300003003',
            'module_code'=> '300',
            'component_code'=> '300004',
            'description' => 'Sales Summary',
            'link'=> '/Modules/Sales/Reports/SalesSummary',
            'added_by' => env('DEFAULT_USER'),
            'modified_by' => env('DEFAULT_USER')],
        ]);
    }
}
