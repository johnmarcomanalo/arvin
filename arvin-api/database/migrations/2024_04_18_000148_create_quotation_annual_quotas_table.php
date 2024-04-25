<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateQuotationAnnualQuotasTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('quotation_annual_quotas', function (Blueprint $table) {
            $table->id();
            $table->string('code')->unique();
            $table->string('company_code')->nullable();
            $table->string('business_unit_code')->nullable();
            $table->string('team_code')->nullable();
            $table->string('department_code')->nullable();
            $table->string('section_code')->nullable();
            $table->string('subsection_code')->nullable();
            $table->string('target_year_quota');
            $table->decimal('target_annual_quota',15,2); 
            $table->decimal('target_monthly_quota',15,2); 
            $table->decimal('target_daily_quota',15,2); 
            $table->integer('status')->default(0);
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
        Schema::dropIfExists('quotation_annual_quotas');
    }
}
