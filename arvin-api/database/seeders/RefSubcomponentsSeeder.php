<?php

namespace Database\Seeders;
use App\Models\RefSubComponents;
use Illuminate\Support\Facades\DB;

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
        DB::table('ref_sub_components')->delete();
      RefSubComponents::insert([
            [
            'code'=> '300003001',
            'module_code'=> '300',
            'component_code'=> '300003',
            'description' => 'Sales Qouta',
            'link'=> '/Modules/Sales/Configuration/SalesQouta',
            'added_by' => env('DEFAULT_USER'),
            'modified_by' => env('DEFAULT_USER')],
            [
            'code'=> '300003002',
            'module_code'=> '300',
            'component_code'=> '300003',
            'description' => 'Ranking Points',
            'link'=> '/Modules/Sales/Configuration/RankingPoints',
            'added_by' => env('DEFAULT_USER'),
            'modified_by' => env('DEFAULT_USER')],
            [
            'code'=> '300004001',
            'module_code'=> '300',
            'component_code'=> '300004',
            'description' => 'Sales Summary',
            'link'=> '/Modules/Sales/Reports/SalesSummary',
            'added_by' => env('DEFAULT_USER'),
            'modified_by' => env('DEFAULT_USER')],
            [
            'code'=> '600001001',
            'module_code'=> '600',
            'component_code'=> '600001',
            'description' => 'Companies',
            'link'=> '/Modules/SystemSettings/References/Companies',
            'added_by' => env('DEFAULT_USER'),
            'modified_by' => env('DEFAULT_USER')],
            [
            'code'=> '600001002',
            'module_code'=> '600',
            'component_code'=> '600001',
            'description' => 'Business Units',
            'link'=> '/Modules/SystemSettings/References/BusinessUnits',
            'added_by' => env('DEFAULT_USER'),
            'modified_by' => env('DEFAULT_USER')],
            [
            'code'=> '600001003',
            'module_code'=> '600',
            'component_code'=> '600001',
            'description' => 'Teams',
            'link'=> '/Modules/SystemSettings/References/Teams',
            'added_by' => env('DEFAULT_USER'),
            'modified_by' => env('DEFAULT_USER')],
            [
            'code'=> '600001004',
            'module_code'=> '600',
            'component_code'=> '600001',
            'description' => 'Departments',
            'link'=> '/Modules/SystemSettings/References/Departments',
            'added_by' => env('DEFAULT_USER'),
            'modified_by' => env('DEFAULT_USER')],
            [
            'code'=> '600001005',
            'module_code'=> '600',
            'component_code'=> '600001',
            'description' => 'Sections',
            'link'=> '/Modules/SystemSettings/References/Sections',
            'added_by' => env('DEFAULT_USER'),
            'modified_by' => env('DEFAULT_USER')],
            [
            'code'=> '600001006',
            'module_code'=> '600',
            'component_code'=> '600001',
            'description' => 'Subsections',
            'link'=> '/Modules/SystemSettings/References/Subsections',
            'added_by' => env('DEFAULT_USER'),
            'modified_by' => env('DEFAULT_USER')],
            [
            'code'=> '600001007',
            'module_code'=> '600',
            'component_code'=> '600001',
            'description' => 'Companies Contact Numbers',
            'link'=> '/Modules/SystemSettings/References/CompaniesContactNumbers',
            'added_by' => env('DEFAULT_USER'),
            'modified_by' => env('DEFAULT_USER')],
            [
            'code'=> '600001008',
            'module_code'=> '600',
            'component_code'=> '600001',
            'description' => 'Business Units Contact Numbers',
            'link'=> '/Modules/SystemSettings/References/BusinessUnitsContactNumbers',
            'added_by' => env('DEFAULT_USER'),
            'modified_by' => env('DEFAULT_USER')],
            [
            'code'=> '600001009',
            'module_code'=> '600',
            'component_code'=> '600001',
            'description' => 'Genders',
            'link'=> '/Modules/SystemSettings/References/Genders',
            'added_by' => env('DEFAULT_USER'),
            'modified_by' => env('DEFAULT_USER')],
            [
            'code'=> '600001010',
            'module_code'=> '600',
            'component_code'=> '600001',
            'description' => 'Months',
            'link'=> '/Modules/SystemSettings/References/Months',
            'added_by' => env('DEFAULT_USER'),
            'modified_by' => env('DEFAULT_USER')],
            [
            'code'=> '600001011',
            'module_code'=> '600',
            'component_code'=> '600001',
            'description' => 'Positions',
            'link'=> '/Modules/SystemSettings/References/Positions',
            'added_by' => env('DEFAULT_USER'),
            'modified_by' => env('DEFAULT_USER')],
            [
            'code'=> '600001012',
            'module_code'=> '600',
            'component_code'=> '600001',
            'description' => 'Position Levels',
            'link'=> '/Modules/SystemSettings/References/PositionLevels',
            'added_by' => env('DEFAULT_USER'),
            'modified_by' => env('DEFAULT_USER')],
            [
            'code'=> '600001013',
            'module_code'=> '600',
            'component_code'=> '600001',
            'description' => 'Salutations',
            'link'=> '/Modules/SystemSettings/References/Salutations',
            'added_by' => env('DEFAULT_USER'),
            'modified_by' => env('DEFAULT_USER')],
            [
            'code'=> '600001014',
            'module_code'=> '600',
            'component_code'=> '600001',
            'description' => 'Modules',
            'link'=> '/Modules/SystemSettings/References/Modules',
            'added_by' => env('DEFAULT_USER'),
            'modified_by' => env('DEFAULT_USER')],
            [
            'code'=> '600001015',
            'module_code'=> '600',
            'component_code'=> '600001',
            'description' => 'Components',
            'link'=> '/Modules/SystemSettings/References/Components',
            'added_by' => env('DEFAULT_USER'), 
            'modified_by' => env('DEFAULT_USER')],
            [
            'code'=> '600001016',
            'module_code'=> '600',
            'component_code'=> '600001',
            'description' => 'Subcomponents',
            'link'=> '/Modules/SystemSettings/References/Subcomponents',
            'added_by' => env('DEFAULT_USER'),
            'modified_by' => env('DEFAULT_USER')],
            [
            'code'=> '600002001',
            'module_code'=> '600',
            'component_code'=> '600002',
            'description' => 'Organization Rights',
            'link'=> '/Modules/SystemSettings/AccessRights/OrganizationRights',
            'added_by' => env('DEFAULT_USER'),
            'modified_by' => env('DEFAULT_USER')],
            [
            'code'=> '600002002',
            'module_code'=> '600',
            'component_code'=> '600002',
            'description' => 'Page Rights',
            'link'=> '/Modules/SystemSettings/AccessRights/PageRights',
            'added_by' => env('DEFAULT_USER'),
            'modified_by' => env('DEFAULT_USER')],
        ]);
    }
}
