<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\RefSubSections;
use Illuminate\Support\Facades\DB;

class RefSubSectionsSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        DB::table('ref_sub_sections')->delete();
        RefSubSections::insert([
        [
            'code'=> '1',
            'section_code'=> '23',
            'description' => 'Tabacco',
            'added_by' => env('DEFAULT_USER'),
            'modified_by' => env('DEFAULT_USER')],
            [
            'code'=> '2',
            'section_code'=> '24',
            'description' => 'Cebu',
            'added_by' => env('DEFAULT_USER'),
            'modified_by' => env('DEFAULT_USER')],
            [
            'code'=> '3',
            'section_code'=> '24',
            'description' => 'Iloilo',
            'added_by' => env('DEFAULT_USER'),
            'modified_by' => env('DEFAULT_USER')],
            [
            'code'=> '4',
            'section_code'=> '24',
            'description' => 'Bacolod',
            'added_by' => env('DEFAULT_USER'),
            'modified_by' => env('DEFAULT_USER')],
            [
            'code'=> '5',
            'section_code'=> '24',
            'description' => 'Zamboanga',
            'added_by' => env('DEFAULT_USER'),
            'modified_by' => env('DEFAULT_USER')],
        ]);
    }
}
