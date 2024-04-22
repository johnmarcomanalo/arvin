<?php

namespace Database\Seeders;
use Illuminate\Database\Seeder;
use App\Models\RefCompanies;
class RefCompaniesSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        //
         RefCompanies::insert([
            [
            'code'=> '1',
            'description' => 'Arvin Internation Marketing Inc.',
            'address' => '18F, Y Tower, Macapagal Avenue corner Coral Way St., Pasay City, Metro Manila',
            'added_by' => env('DEFAULT_USER'),
            'modified_by' => env('DEFAULT_USER')],
        ]);
    }
}
