<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateEPayCheckCheckSalesInvoiceDetailsArchivedTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('e_pay_check_check_sales_invoice_details_archived', function (Blueprint $table) {
           $table->id();
            $table->bigInteger('code')->unique();
            $table->unsignedBigInteger('check_details_code');
            $table->string('sales_invoice');
            $table->string('dr_number')->nullable();
            $table->string('doc_number')->nullable(); 
            $table->dateTime('doc_date')->nullable(); 
            $table->string('doc_total',100)->nullable(); 
            $table->string('amount',100)->nullable();
            $table->string('bp_payment_term',50)->nullable();
            $table->integer('internal_approved_term')->nullable();
            $table->string('form',10)->nullable();
            $table->boolean('tag')->nullable();
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
        Schema::dropIfExists('e_pay_check_check_sales_invoice_details_archived');
    }
}
