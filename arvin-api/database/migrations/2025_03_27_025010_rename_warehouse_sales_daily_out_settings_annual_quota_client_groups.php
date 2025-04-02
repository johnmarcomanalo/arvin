<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class RenameWarehouseSalesDailyOutSettingsAnnualQuotaClientGroups extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('sales_daily_out_settings_annual_quota_client_groups', function (Blueprint $table) {
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
        Schema::table('sales_daily_out_settings_annual_quota_client_groups', function (Blueprint $table) {
            $table->renameColumn('subsection', 'warehouse');
        });
    }
}
