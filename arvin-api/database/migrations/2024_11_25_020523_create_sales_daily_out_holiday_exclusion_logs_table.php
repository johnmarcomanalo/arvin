<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateSalesDailyOutHolidayExclusionLogsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('sales_daily_out_holiday_exclusion_logs', function (Blueprint $table) {
            $table->id();
            $table->bigInteger('code')->unique();
            $table->integer('sales_daily_out_annual_settings_sales_code');
            $table->string('subsection_code')->nullable();
            $table->string('ref_product_groups_description')->nullable();
            $table->string('year_sales_target');

            $table->timestamp('move_from_sales_date');
            $table->decimal('move_from_sales_daily_qouta',15,4); 
            $table->decimal('move_from_sales_daily_out',15,4); 
            $table->decimal('move_from_sales_daily_target',15,4); 
            $table->decimal('move_from_daily_sales_target_percentage',15,2); 

            $table->timestamp('move_to_sales_date');
            $table->decimal('move_to_sales_daily_qouta',15,4); 
            $table->decimal('move_to_sales_daily_out',15,4); 
            $table->decimal('move_to_sales_daily_target',15,4); 
            $table->decimal('move_to_daily_sales_target_percentage',15,2); 

            $table->decimal('updated_sales_daily_out',15,4); 
            $table->decimal('updated_sales_daily_target',15,4); 
            $table->decimal('updated_daily_sales_target_percentage',15,2); 

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
        Schema::dropIfExists('sales_daily_out_holiday_exclusion_logs');
    }
}
