<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

class CreateSalesDailyOutAnnualSettingsSalesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('sales_daily_out_annual_settings_sales', function (Blueprint $table) {
            $table->increments('id');
            $table->integer('code')->unique();
            $table->string('company_code')->nullable();
            $table->string('company')->nullable();
            $table->string('business_unit_code')->nullable();
            $table->string('business_unit')->nullable();
            $table->string('team_code')->nullable();
            $table->string('team')->nullable();
            $table->string('department_code')->nullable();
            $table->string('department')->nullable();
            $table->string('section_code')->nullable();
            $table->string('section')->nullable();
            $table->string('subsection_code')->nullable();
            $table->string('subsection')->nullable();
            $table->string('year_sales_target');
            $table->decimal('annual_sales_target',15,2); 
            $table->decimal('monthly_sales_target',15,2); 
            $table->decimal('daily_sales_target',15,2); 
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
        Schema::dropIfExists('sales_daily_out_annual_settings_sales');
    }
}
