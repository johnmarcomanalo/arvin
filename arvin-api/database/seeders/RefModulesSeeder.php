<?php

namespace Database\Seeders;
use App\Models\RefModules;
use Illuminate\Support\Facades\DB;

use Illuminate\Database\Seeder;

class RefModulesSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        DB::table('ref_modules')->delete();
        RefModules::insert([
            [
            'code'=> '100',
            'description' => 'E-Costing',
            'link'=> '/Modules/ECosting',
            'added_by' => env('DEFAULT_USER'),
            'modified_by' => env('DEFAULT_USER')],
            [
            'code'=> '200',
            'description' => 'Quotation',
            'link'=> '/Modules/Quotation',
            'added_by' => env('DEFAULT_USER'),
            'modified_by' => env('DEFAULT_USER')],
            [
            'code'=> '300',
            'description' => 'Sales',
            'link'=> '/Modules/Sales',
            'added_by' => env('DEFAULT_USER'),
            'modified_by' => env('DEFAULT_USER')],
            [
            'code'=> '400',
            'description' => 'Human Resource',
            'link'=> '/Modules/HumanResource',
            'added_by' => env('DEFAULT_USER'),
            'modified_by' => env('DEFAULT_USER')],
            [
            'code'=> '500',
            'description' => 'Purchasing Request',
            'link'=> '/Modules/PurchasingRequest',
            'added_by' => env('DEFAULT_USER'),
            'modified_by' => env('DEFAULT_USER')],
        ]);
    }
}
