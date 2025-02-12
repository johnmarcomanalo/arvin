<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateEPayCheckTransmittedTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('e_pay_check_transmitted', function (Blueprint $table) {
            $table->id();
            $table->bigInteger('code')->unique();
            $table->string('check_details_code',50);
            $table->string('received_by')->nullable(); // For transmitted status
            $table->timestamp('received_date')->nullable(); // For transmitted status
            $table->string('received_by')->nullable(); // For transmitted status
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
        Schema::dropIfExists('e_pay_check_transmitted');
    }
}
