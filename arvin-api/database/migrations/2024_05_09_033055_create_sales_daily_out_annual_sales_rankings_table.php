<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateSalesDailyOutAnnualSalesRankingsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('sales_daily_out_annual_sales_rankings', function (Blueprint $table) {
            $table->id();
            $table->integer('code')->unique();
            $table->text('type')->nullable();
            $table->integer('ranker_code')->nullable();
            $table->integer('rank_code')->nullable();
            // $table->text('point_details')->nullable();
            $table->integer('current_point')->nullable();
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
        Schema::dropIfExists('sales_daily_out_annual_sales_rankings');
    }
}
