<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateUsersTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('users', function (Blueprint $table) {
            $table->id();
            $table->string('code')->unique();
            $table->string('username')->unique();
            $table->string('first_name');
            $table->string('middle_name')->nullable();
            $table->string('last_name');
            $table->string('suffix')->nullable();
            $table->string('nickname')->nullable();
            $table->string('gender')->nullable();
            $table->string('tin')->nullable();
            $table->string('sss')->nullable();
            $table->string('phic')->nullable();
            $table->string('hdmf')->nullable();
            $table->string('company')->nullable();
            $table->string('business_unit')->nullable();
            $table->string('team')->nullable();
            $table->string('division')->nullable();
            $table->string('department')->nullable();
            $table->string('section')->nullable();
            $table->string('subsection_1')->nullable();
            $table->string('subsection_2')->nullable();
            $table->string('location')->nullable();
            $table->string('position')->nullable();
            $table->string('position_level')->nullable();
            $table->string('employment_type')->nullable();
            $table->timestamp('date_hired')->nullable();
            $table->timestamp('date_regularized')->nullable();
            //$table->decimal('tenured')->nullable(); to verify
            $table->timestamp('contract_start')->nullable();
            $table->timestamp('contract_end')->nullable();
            //$table->timestamp('contract_duration'); to follow up
            $table->timestamp('date_separated')->nullable();
            $table->longText('reason_for_separation')->nullable();
            $table->string('clearance_status')->nullable();
            $table->timestamp('clearance_date_cleared')->nullable();
            $table->string('clearance_issued_by')->nullable();
            $table->date('date_of_birth')->nullable();
            $table->longText('place_of_birth')->nullable();
            $table->unsignedBigInteger('age')->nullable();
            $table->string('citizenship')->nullable();
            $table->string('marital_status')->nullable();
            $table->string('salutation')->nullable();
            $table->string('nationality')->nullable();
            $table->decimal('height', 9, 2)->nullable(); 
            $table->decimal('weight', 9, 2)->nullable();
            $table->longText('educational_background')->nullable();
            $table->longText('government_certifications')->nullable();
            $table->string('father_name')->nullable();
            $table->string('mother_maiden_name')->nullable();
            $table->string('spouse_name')->nullable();
            $table->longText('children')->nullable();
            $table->longText('contact_information')->nullable();
            $table->longText('floor_building_house_no_street')->nullable();
            $table->string('barangay')->nullable();
            $table->string('city_municipality')->nullable();
            $table->string('province')->nullable();
            $table->string('region')->nullable();
            $table->string('postal_code')->nullable();
            $table->longText('access_code')->nullable();
            $table->longText('device_password')->nullable();
            $table->longText('password');
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
        Schema::dropIfExists('users');
    }
}
