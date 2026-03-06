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
            $table->string('bank_address',150)->nullable();
            $table->string('payment_type',100)->nullable();
            $table->string('card_code',50);
            $table->longText('card_name');
            $table->string('crpr',15);
            $table->string('prefix_crpr',15)->nullable();
            $table->string('account_number',50)->nullable();
            $table->boolean('advance_payment');
            $table->string('sap',10)->nullable();
            $table->longText('remarks')->nullable();
            $table->boolean('stale_check');
            $table->string('document_type',10)->nullable();
            $table->string('request_status',15)->nullable(); 
            $table->timestamp('received_check_by_ar_at',15)->nullable(); 
            $table->string('received_check_by',100)->nullable(); 
            $table->timestamp('applied_at')->nullable();
            $table->string('applied_by',100)->nullable();
            $table->timestamp('created_at')->useCurrent();
            $table->timestamp('updated_at')->useCurrent()->useCurrentOnUpdate();
            $table->timestamp('deleted_at')->nullable();
            $table->string('added_by',100);
            $table->string('modified_by',100);
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
