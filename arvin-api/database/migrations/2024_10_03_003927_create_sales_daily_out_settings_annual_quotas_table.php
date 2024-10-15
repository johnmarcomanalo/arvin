<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateSalesDailyOutSettingsAnnualQuotasTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('sales_daily_out_settings_annual_quotas', function (Blueprint $table) {
            $table->id();
            $table->string('code')->unique();
            $table->string('subsection_code')->nullable();
            $table->string('year_sales_target');
            $table->decimal('annual_sales_target',15,2); 
            $table->decimal('monthly_sales_target',15,2);
            $table->string('ref_product_groups_code');
            $table->dateTime('date_effectiveness');   
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
        Schema::dropIfExists('sales_daily_out_settings_annual_quotas');
    }
}
