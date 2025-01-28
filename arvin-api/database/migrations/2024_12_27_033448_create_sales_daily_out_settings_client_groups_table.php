<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateSalesDailyOutSettingsClientGroupsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('sales_daily_out_settings_client_groups', function (Blueprint $table) {
            $table->id();
            $table->bigInteger('code')->unique();
            $table->string('description');
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
        Schema::dropIfExists('sales_daily_out_settings_client_groups');
    }
}
