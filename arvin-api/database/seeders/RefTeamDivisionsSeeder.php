<?php

namespace Database\Seeders;
use App\Models\RefTeamDivisions;
use Illuminate\Database\Seeder;

class RefTeamDivisionsSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        RefTeamDivisions::insert([
        [
            'code'=> '1',
            'team_code'=> '1',
            'division_code'=> '1',
            'added_by' => env('DEFAULT_USER'),
            'modified_by' => env('DEFAULT_USER')],

        [
            'code'=> '2',
            'team_code'=> '1',
            'division_code'=> '2',
            'added_by' => env('DEFAULT_USER'),
            'modified_by' => env('DEFAULT_USER')],
        [
            'code'=> '3',
            'team_code'=> '1',
            'division_code'=> '3',
            'added_by' => env('DEFAULT_USER'),
            'modified_by' => env('DEFAULT_USER')],

        [
            'code'=> '4',
            'team_code'=> '2',
            'division_code'=> '3',
            'added_by' => env('DEFAULT_USER'),
            'modified_by' => env('DEFAULT_USER')],
            
        ]);
    }
}
