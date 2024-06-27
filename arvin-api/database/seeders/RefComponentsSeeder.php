<?php

namespace Database\Seeders;
use App\Models\RefComponents;

use Illuminate\Database\Seeder;

class RefComponentsSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        RefComponents::insert([
            [
            'code'=> '300001',
            'module_code'=> '300',
            'description' => 'Sales Tracker',
            'link'=> '/Modules/Sales/SalesTracker',
            'added_by' => env('DEFAULT_USER'),
            'modified_by' => env('DEFAULT_USER')],
            [
            'code'=> '300002',
            'module_code'=> '300',
            'description' => 'Sales Leaderboard',
            'link'=> '/Modules/Sales/SalesLeaderboard',
            'added_by' => env('DEFAULT_USER'),
            'modified_by' => env('DEFAULT_USER')],
            [
            'code'=> '300003',
            'module_code'=> '300',
            'description' => 'Configuration',
            'link'=> '/Modules/Sales/Configuration',
            'added_by' => env('DEFAULT_USER'),
            'modified_by' => env('DEFAULT_USER')],
            [
            'code'=> '300004',
            'module_code'=> '300',
            'description' => 'Reports',
            'link'=> '/Modules/Sales/Reports',
            'added_by' => env('DEFAULT_USER'),
            'modified_by' => env('DEFAULT_USER')],
            [
            'code'=> '600001',
            'module_code'=> '600',
            'description' => 'References',
            'link'=> '/Modules/SystemSettings/References',
            'added_by' => env('DEFAULT_USER'),
            'modified_by' => env('DEFAULT_USER')],
            [
            'code'=> '600002',
            'module_code'=> '600',
            'description' => 'Access Rights',
            'link'=> '/Modules/SystemSettings/AccessRights',
            'added_by' => env('DEFAULT_USER'),
            'modified_by' => env('DEFAULT_USER')],
        ]);
    }
}
