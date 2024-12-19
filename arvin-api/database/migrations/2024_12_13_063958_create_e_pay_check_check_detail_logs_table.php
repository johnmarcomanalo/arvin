<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateEPayCheckCheckDetailLogsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('e_pay_check_check_detail_logs', function (Blueprint $table) {
            $table->id();
            $table->bigInteger('code')->unique();
            $table->bigInteger('check_details_code');
            $table->bigInteger('check_number');
            $table->decimal('check_amount',15,4); 
            $table->dateTime('check_date');
            $table->string('check_status');
            $table->string('check_payee')->nullable();
            $table->string('check_maker')->nullable();
            $table->string('bank_description');
            $table->string('bank_branch');
            $table->string('bank_address');
            $table->string('payment_type')->nullable();
            $table->decimal('doc_total_before_tax',15,4)->nullable(); 
            $table->decimal('doc_vat',15,4)->nullable(); 
            $table->decimal('doc_total',15,4)->nullable(); 
            $table->string('card_code');
            $table->string('card_name');
            $table->string('crpr');
            $table->string('subsection_code');
            $table->string('collector_id');
            $table->longText('remarks');
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
        Schema::dropIfExists('e_pay_check_check_detail_logs');
    }
}
