<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateRefLocationsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        // Schema::create('ref_locations', function (Blueprint $table) {
        //     $table->id();
        //     $table->string('code')->unique();
        //     $table->string('company_code');
        //     $table->string('business_unit_code');
        //     $table->string('team_code')->nullable();
        //     $table->string('division_code')->nullable();
        //     $table->string('department_code')->nullable();
        //     $table->string('section_code')->nullable();
        //     $table->string('description');
        //     $table->timestamp('created_at')->useCurrent();
        //     $table->timestamp('updated_at')->useCurrent()->useCurrentOnUpdate();
        //     $table->timestamp('deleted_at')->nullable();
        //     $table->string('added_by');
        //     $table->string('modified_by');
        // });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('ref_locations');
    }
}
