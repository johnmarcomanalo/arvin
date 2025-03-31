<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AddColumnsSalesDailyOutSettingsAnnualQuotas extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('sales_daily_out_settings_annual_quotas', function (Blueprint $table) {
            $table->decimal('january_sales_target',15,2)->nullable()->after('monthly_sales_target');
            $table->decimal('february_sales_target',15,2)->nullable()->after('january_sales_target');
            $table->decimal('march_sales_target',15,2)->nullable()->after('february_sales_target');
            $table->decimal('april_sales_target',15,2)->nullable()->after('march_sales_target');
            $table->decimal('may_sales_target',15,2)->nullable()->after('april_sales_target');
            $table->decimal('june_sales_target',15,2)->nullable()->after('may_sales_target');
            $table->decimal('july_sales_target',15,2)->nullable()->after('june_sales_target');
            $table->decimal('august_sales_target',15,2)->nullable()->after('july_sales_target');
            $table->decimal('september_sales_target',15,2)->nullable()->after('august_sales_target');
            $table->decimal('october_sales_target',15,2)->nullable()->after('september_sales_target');
            $table->decimal('november_sales_target',15,2)->nullable()->after('october_sales_target');
            $table->decimal('december_sales_target',15,2)->nullable()->after('november_sales_target');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
       Schema::table('sales_daily_out_settings_annual_quotas', function (Blueprint $table) {
            $table->dropColumn([
                'january_sales_target',
                'february_sales_target',
                'march_sales_target',
                'april_sales_target',
                'may_sales_target',
                'june_sales_target',
                'july_sales_target',
                'august_sales_target',
                'september_sales_target',
                'october_sales_target',
                'november_sales_target',
                'december_sales_target',
            ]);
        });
    }
}
