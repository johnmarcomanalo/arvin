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
            $table->string('gender');
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
            $table->string('location');
            $table->string('position');
            $table->string('position_level');
            $table->string('employment_type');
            $table->timestamp('date_hired');
            $table->timestamp('date_regularized');
            //$table->decimal('tenured'); to verify
            $table->timestamp('contract_start');
            $table->timestamp('contract_end');
            //$table->timestamp('contract_duration'); to follow up
            $table->timestamp('date_separated')->nullable();
            $table->longText('reason_for_separation')->nullable();
            $table->string('clearance_status')->nullable();
            $table->timestamp('clearance_date_cleared')->nullable();
            $table->string('clearance_issued_by')->nullable();
            $table->date('date_of_birth');
            $table->longText('place_of_birth')->nullable();
            $table->unsignedBigInteger('age');
            $table->string('citizenship');
            $table->string('marital_status');
            $table->string('salutation');
            $table->string('nationality');
            $table->decimal('height', 9, 2); 
            $table->decimal('weight', 9, 2);
            $table->longText('educational_background');
            $table->longText('government_certifications');
            $table->string('father_name');
            $table->string('mother_maiden_name');
            $table->string('spouse_name');
            $table->longText('children');
            $table->longText('contact_information');
            $table->longText('floor_building_house_no_street');
            $table->string('barangay');
            $table->string('city_municipality');
            $table->string('province');
            $table->string('region');
            $table->string('postal_code');
            $table->longText('access_code');
            $table->longText('device_password');
            $table->string('password')->nullable(false);
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
