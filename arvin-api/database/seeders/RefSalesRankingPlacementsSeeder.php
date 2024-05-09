<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\RefSalesRankingPlacements;
use Illuminate\Support\Facades\DB;

class RefSalesRankingPlacementsSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        DB::table('ref_sales_ranking_placements')->delete();
        RefSalesRankingPlacements::insert([
            [
                'code'=> '1',
                'ref_sales_rankings_code'=> '1',
                'description'=> 'First Place',
                'value'=> '3',
                'added_by' => env('DEFAULT_USER'),
                'modified_by' => env('DEFAULT_USER')
            ],
            [
                'code'=> '2',
                'ref_sales_rankings_code'=> '1',
                'description'=> 'Second Place',
                'value'=> '2',
                'added_by' => env('DEFAULT_USER'),
                'modified_by' => env('DEFAULT_USER')
            ],
            [
                'code'=> '3',
                'ref_sales_rankings_code'=> '1',
                'description'=> 'Third Place',
                'value'=> '1',
                'added_by' => env('DEFAULT_USER'),
                'modified_by' => env('DEFAULT_USER')
            ],
            [
                'code'=> '4',
                'ref_sales_rankings_code'=> '1',
                'description'=> 'Underperformer',
                'value'=> '0',
                'added_by' => env('DEFAULT_USER'),
                'modified_by' => env('DEFAULT_USER')
            ],
        ]);
    }
}
