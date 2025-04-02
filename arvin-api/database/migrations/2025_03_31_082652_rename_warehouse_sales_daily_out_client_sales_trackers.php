<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class RenameWarehouseSalesDailyOutClientSalesTrackers extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('sales_daily_out_client_sales_trackers', function (Blueprint $table) {
            $table->renameColumn('warehouse', 'subsection');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('sales_daily_out_client_sales_trackers', function (Blueprint $table) {
            $table->renameColumn('subsection', 'warehouse');
        });
    }
}
