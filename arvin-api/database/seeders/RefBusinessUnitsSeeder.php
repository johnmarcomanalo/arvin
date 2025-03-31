<?php

namespace Database\Seeders;
use Illuminate\Database\Seeder;
use App\Models\RefBusinessUnits;
use Illuminate\Support\Facades\DB;

class RefBusinessUnitsSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */ 
    public function run()
    {
        RefBusinessUnits::insert([
            [
            'code'=> '1',
            'company_code'=> '1',
            'description' => 'Arvin Internation Marketing Inc. - Main',
            'address' => '18F, Y Tower, Macapagal Avenue corner Coral Way St., Pasay City, Metro Manila',
            'added_by' => env('DEFAULT_USER'),
            'modified_by' => env('DEFAULT_USER')],
        ]);
    }
}
