<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateUserAccessOrganizationRightsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('user_access_organization_rights', function (Blueprint $table) {
            $table->id();
            $table->string('code')->unique( );
            $table->string('company_code');
            $table->string('company_description');
            $table->string('business_unit_code')->nullable();
            $table->string('business_unit_description');
            $table->string('team_code')->nullable();
            $table->string('team_description')->nullable();
            $table->string('department_code')->nullable();
            $table->string('department_description')->nullable();
            $table->string('section_code')->nullable();
            $table->string('section_description')->nullable();
            $table->string('subsection_code')->nullable();
            $table->string('subsection_description')->nullable();
            $table->unsignedBigInteger('user_id');
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
        Schema::dropIfExists('user_access_organization_rights');
    }
}
