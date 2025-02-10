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
            $table->string('deposited_bank')->nullable(); // For deposited status
            $table->dateTime('deposited_date')->nullable(); // For deposited status 
            $table->dateTime('rejected_date')->nullable(); // For transmitted status
            $table->longText('rejected_remarks')->nullable(); // For transmitted status
            $table->dateTime('received_date')->nullable(); // For transmitted status
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
