<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateRefClientsSalesOutLogsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('ref_clients_sales_out_logs', function (Blueprint $table) {
            $table->id();
            $table->bigInteger('code')->unique();
            $table->string('customer_code', 50);
            $table->string('customer_description', 255);
            $table->string('product', 100);
            $table->string('sales_daily_out', 50);
            $table->string('type', 50);
            $table->string('warehouse', 50);
            $table->dateTime('sales_date');
            $table->integer('docentry')->unsigned();
            $table->integer('docnum')->unsigned();
            $table->string('trans_type', 50);
            $table->tinyInteger('status')->unsigned();
            $table->timestamp('created_at')->useCurrent();
            $table->timestamp('updated_at')->useCurrent()->useCurrentOnUpdate();
            $table->timestamp('deleted_at')->nullable();
            $table->string('added_by', 50);
            $table->string('modified_by', 50);
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('ref_clients_sales_out_logs');
    }
}
