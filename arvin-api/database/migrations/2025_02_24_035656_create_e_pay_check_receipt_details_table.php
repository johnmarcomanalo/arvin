<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateEPayCheckReceiptDetailsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('e_pay_check_receipt_details', function (Blueprint $table) {
            $table->id();
            $table->bigInteger('code')->unique();
            $table->string('description',50);
            $table->string('type',50);
            $table->string('prefix',10);
            $table->boolean('active');
            $table->longText('format');
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
        Schema::dropIfExists('e_pay_check_receipt_details');
    }
}
