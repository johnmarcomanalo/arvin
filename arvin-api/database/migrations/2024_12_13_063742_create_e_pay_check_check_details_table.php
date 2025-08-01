<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateEPayCheckCheckDetailsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('e_pay_check_check_details', function (Blueprint $table) {
            $table->id();
            $table->bigInteger('code')->unique();
            $table->string('subsection_code',50);
            $table->string('check_number',50);
            $table->decimal('check_amount',15,4); 
            $table->dateTime('check_date');
            $table->string('check_status',100)->nullable();
            $table->timestamp('check_status_date')->nullable();
            $table->longText('bank_description');
            $table->string('bank_branch',150);
            $table->string('bank_address',150);
            $table->string('account_number',50);
            $table->string('payment_type',100)->nullable();
            $table->string('card_code',50);
            $table->longText('card_name');
            $table->string('crpr',15);
            $table->string('prefix_crpr',15);
            $table->boolean('stale_check');
            $table->boolean('advance_payment');
            $table->string('sap',10);
            $table->longText('remarks');
            $table->string('document_type',10);
            $table->string('request_status',15); 
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
        Schema::dropIfExists('e_pay_check_check_details');
    }
}
