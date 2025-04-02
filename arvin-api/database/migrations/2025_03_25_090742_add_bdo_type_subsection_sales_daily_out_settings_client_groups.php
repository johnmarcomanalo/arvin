<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AddBdoTypeSubsectionSalesDailyOutSettingsClientGroups extends Migration
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
            $table->string('subsection', 50)->nullable();
            $table->string('bdo', 9)->nullable();
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
            $table->dropColumn(['type', 'subsection', 'bdo']); // Rollback both columns
        });
    }
}
