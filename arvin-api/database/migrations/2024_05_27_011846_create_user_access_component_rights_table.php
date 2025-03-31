<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateUserAccessComponentRightsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('user_access_component_rights', function (Blueprint $table) {
            $table->id();
            $table->string('code')->unique();
            $table->string('module_code');
            $table->string('component_code');
            $table->unsignedBigInteger('user_id');
            $table->integer('create')->default(0);
            $table->integer('update')->default(0);
            $table->integer('delete')->default(0);
            $table->integer('generate')->default(0);
            $table->integer('export')->default(0);
            $table->integer('access_rights')->default(0);
            $table->timestamp('created_at')->useCurrent();
            $table->timestamp('updated_at')->useCurrent()->useCurrentOnUpdate();
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
        Schema::dropIfExists('user_access_component_rights');
    }
}
