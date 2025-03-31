<?php

namespace Database\Seeders;

use App\Models\SalesDailyOutAnnualSalesRanking;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class SalesDailyOutAnnualSalesRankingSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        DB::table('sales_daily_out_annual_sales_rankings')->delete();
        SalesDailyOutAnnualSalesRanking::insert([
            [
                'code'         => '1',
                'table'        => 'ref_sub_sections',
                'type'         => 'section_code',
                'type_code'    => '1',
                'rank_code'    => '1',
                'point_details'=> '[]',
                'current_point'=>  0,
                'added_by'     => env('DEFAULT_USER'),
                'modified_by'   => env('DEFAULT_USER'),
            ]
        ]);
    }
}
