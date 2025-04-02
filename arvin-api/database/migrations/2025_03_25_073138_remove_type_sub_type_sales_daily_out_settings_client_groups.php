<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class RemoveTypeSubTypeSalesDailyOutSettingsClientGroups extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('sales_daily_out_settings_client_groups', function (Blueprint $table) {
          $table->dropColumn(['type', 'subtype']); // Remove these columns
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
            $table->string('type')->nullable();    // Restore 'type' as a nullable string
            $table->string('subtype')->nullable(); // Restore 'subtype' as a nullable string
        });
    }
}
