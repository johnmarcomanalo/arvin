<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateSalesQuotationRequestForApprovalsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('sales_quotation_request_for_approvals', function (Blueprint $table) {
            $table->id();
            $table->bigInteger('code')->unique();
            $table->string('sales_quotation_request_code');
            $table->string('ref_request_hierarchies_code');
            $table->string('approver_code');
            $table->string('request_approval_status');
            $table->string('request_hierarchy_level');
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
        Schema::dropIfExists('sales_quotation_request_for_approvals');
    }
}
