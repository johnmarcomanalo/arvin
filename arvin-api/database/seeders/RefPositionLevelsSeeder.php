<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\RefPositionLevels;

class RefPositionLevelsSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
     RefPositionLevels::insert([
            [
            'code'=> '1',
            'description' => 'C-level',
            'added_by' => env('DEFAULT_USER'),
            'modified_by' => env('DEFAULT_USER')],   
                [
            'code'=> '2',
            'description' => 'Director',
            'added_by' => env('DEFAULT_USER'),
            'modified_by' => env('DEFAULT_USER')],   
                [
            'code'=> '3',
            'description' => 'Manager',
            'added_by' => env('DEFAULT_USER'),
            'modified_by' => env('DEFAULT_USER')],
               [
            'code'=> '4',
            'description' => 'Supervisor',
            'added_by' => env('DEFAULT_USER'),
            'modified_by' => env('DEFAULT_USER')],
               [
            'code'=> '5',
            'description' => 'Team Leader',
            'added_by' => env('DEFAULT_USER'),
            'modified_by' => env('DEFAULT_USER')],
                [
            'code'=> '6',
            'description' => 'Rank and File',
            'added_by' => env('DEFAULT_USER'),
            'modified_by' => env('DEFAULT_USER')],
        ]);
    }
}
