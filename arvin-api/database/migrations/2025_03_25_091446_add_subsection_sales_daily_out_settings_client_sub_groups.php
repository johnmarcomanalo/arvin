<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AddSubsectionSalesDailyOutSettingsClientSubGroups extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('sales_daily_out_settings_client_sub_groups', function (Blueprint $table) {
            $table->string('subsection', 50)->nullable();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('sales_daily_out_settings_client_sub_groups', function (Blueprint $table) {
            $table->dropColumn(['subsection']); // Rollback both columns
        });
    }
}
