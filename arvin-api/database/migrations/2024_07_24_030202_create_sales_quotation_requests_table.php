<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateSalesQuotationRequestsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('sales_quotation_requests', function (Blueprint $table) {
            $table->id();
            $table->bigInteger('code')->unique();
            $table->string('customer_code'); 
            $table->string('customer_description');
            $table->string('customer_representative');
            $table->string('customer_address');
            $table->string('customer_type');
            $table->dateTime('request_date');
            $table->string('quotation_opening_letter');
            $table->string('quotation_closing_letter');
            $table->string('status')->nullable();
            $table->string('requested_by');
            $table->string('request_hierarchy_code');
            $table->string('request_hierarchy');
            $table->dateTime('approval_date')->nullable();
            $table->timestamp('created_at')->useCurrent();
            $table->timestamp('updated_at')->useCurrent()->useCurrentOnUpdate();
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
        Schema::dropIfExists('sales_quotation_requests');
    }
}
