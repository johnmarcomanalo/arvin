<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateSalesDailyOutSettingsAnnualQuotaClientGroupsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('sales_daily_out_settings_annual_quota_client_groups', function (Blueprint $table) {
            $table->id();
            $table->bigInteger('code')->unique();
            $table->string('sales_daily_out_settings_client_group_code')->nullable();
            $table->string('year_sales_target');
            $table->decimal('annual_sales_target',15,2); 
            $table->string('ref_product_groups_code');
            $table->decimal('january_sales_target',15,2);
            $table->decimal('february_sales_target',15,2);
            $table->decimal('march_sales_target',15,2);
            $table->decimal('april_sales_target',15,2);
            $table->decimal('may_sales_target',15,2);
            $table->decimal('june_sales_target',15,2);
            $table->decimal('july_sales_target',15,2);
            $table->decimal('august_sales_target',15,2);
            $table->decimal('september_sales_target',15,2);
            $table->decimal('october_sales_target',15,2);
            $table->decimal('november_sales_target',15,2);
            $table->decimal('december_sales_target',15,2);
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
        Schema::dropIfExists('sales_daily_out_settings_annual_quota_client_groups');
    }
}
