<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\RefGenders;

class RefGendersSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
           RefGenders::insert([
            [
            'code'=> 'Male',
            'description' => 'Male',
            'added_by' => env('DEFAULT_USER'),
            'modified_by' => env('DEFAULT_USER')],
            [
            'code'=> 'Female',
            'description' => 'Female',
            'added_by' => env('DEFAULT_USER'),
            'modified_by' => env('DEFAULT_USER')]
        ]);
    }
}
