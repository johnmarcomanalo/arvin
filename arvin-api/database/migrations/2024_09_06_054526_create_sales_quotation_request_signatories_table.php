<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateSalesQuotationRequestSignatoriesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('sales_quotation_request_signatories', function (Blueprint $table) {
            $table->id();
            $table->bigInteger('code')->unique();
            $table->string('sales_quotation_request_code');
            $table->string('type');
            $table->string('signatory_code');
            $table->string('signatory');
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
        Schema::dropIfExists('sales_quotation_request_signatories');
    }
}
