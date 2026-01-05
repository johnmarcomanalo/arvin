<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateSalesDailyOutTrackersLogs extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('sales_daily_out_trackers_logs', function (Blueprint $table) {
            $table->id();
            $table->integer('code')->unique();
            $table->integer('sales_daily_out_tracker_code');
            $table->integer('sales_daily_out_annual_settings_sales_code');
            $table->string('subsection_code')->nullable();
            $table->string('ref_product_groups_description')->nullable();
            $table->string('year_sales_target');
            $table->date('sales_date');
            $table->decimal('sales_daily_qouta',15,4); 
            $table->decimal('sales_daily_out',15,4); 
            $table->decimal('sales_daily_target',15,4); 
            $table->decimal('daily_sales_target_percentage',15,2);

            $table->decimal('monthly_sales_target',15,2)->nullable();
            $table->string('transfer_type');
            $table->decimal('transfer',15,2)->nullable();
            $table->decimal('new_daily_sales_target_percentage',15,2)->nullable();
            $table->decimal('new_sales_daily_out',15,2)->nullable();
            $table->decimal('new_sales_daily_target',15,2)->nullable();
            $table->string('remarks');
            $table->string('selected_subsection_code')->nullable();

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
        Schema::dropIfExists('sales_daily_out_trackers_logs');
    }
}
