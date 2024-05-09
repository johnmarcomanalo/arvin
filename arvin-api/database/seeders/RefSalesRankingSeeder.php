<?php

namespace Database\Seeders;

use App\Models\RefSalesRanking;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class RefSalesRankingSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        DB::table('ref_sales_rankings')->delete();
        RefSalesRanking::insert([
            [
                'code'=> '1',
                'description'=> 'Year 2024',
                'value'=> '36',
                'type_code'=> 'year',
                'type'=> '1',
                'added_by' => env('DEFAULT_USER'),
                'modified_by' => env('DEFAULT_USER')
            ],
            [
                'code'=> '1',
                'description'=> 'Year 2025',
                'value'=> '36',
                'type_code'=> 'year',
                'type'=> '1',
                'added_by' => env('DEFAULT_USER'),
                'modified_by' => env('DEFAULT_USER')
            ]
        ]);
    }
}
