<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AddTypeColumnToSalesDailyOutSettingsClientGroups extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('sales_daily_out_settings_client_groups', function (Blueprint $table) {
              $table->string('type', 50)->nullable();
             $table->string('subtype', 50)->nullable();
        });
    }

    /** 
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('sales_daily_out_settings_client_groups', function (Blueprint $table) {
            $table->dropColumn(['type', 'subtype']); // Rollback both columns
        });
    }
}
