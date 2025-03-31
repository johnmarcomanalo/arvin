<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateSalesDailyOutAnnualSalesRankingDetailsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('sales_daily_out_annual_sales_ranking_details', function (Blueprint $table) {
            $table->id();
            $table->integer('code')->unique();
            $table->text('sales_daily_out_annual_sales_rankings_code')->nullable();
            $table->text('description')->nullable();
            $table->text('ref_month_code')->nullable();
            $table->text('placement')->nullable();
            $table->integer('ref_sales_ranking_placement_code')->nullable();
            $table->timestamp('created_at')->useCurrent();
            $table->timestamp('updated_at')->useCurrent()->useCurrentOnUpdate();
            $table->timestamp('deleted_at')->nullable();
            $table->string('added_by');
            $table->string('modified_by');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('sales_daily_out_annual_sales_ranking_details');
    }
}
