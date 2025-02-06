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
            $table->string('check_details_code');
            $table->string('check_status');
            $table->string('bank_description')->nullable(); // For deposited status
            $table->dateTime('deposit_date')->nullable(); // For deposited status
            $table->timestamp('received_at')->nullable(); // For transmitted status
            $table->string('received_by_transmitted')->nullable(); // For transmitted status
            $table->string('transmitted_by')->nullable(); // For transmitted status
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
