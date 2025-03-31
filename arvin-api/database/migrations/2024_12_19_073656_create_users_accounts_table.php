<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateUsersAccountsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('users_accounts', function (Blueprint $table) {
            $table->id();
            $table->bigInteger('code')->unique();
            $table->bigInteger('user_code');
            $table->string('username')->unique();
            $table->longText('password');
            $table->string('company_code')->nullable();
            $table->string('business_unit_code')->nullable();
            $table->string('team_code')->nullable();
            $table->string('department_code')->nullable();
            $table->string('section_code')->nullable();
            $table->string('subsection_code')->nullable();
            $table->string('position')->nullable();
            $table->string('position_level')->nullable();
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
        Schema::dropIfExists('users_accounts');
    }
}
