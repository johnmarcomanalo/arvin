<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateSalesQuotationRequestProductsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('sales_quotation_request_products', function (Blueprint $table) {
            $table->id();
            $table->bigInteger('code')->unique();
            $table->string('sales_quotation_request_code');
            $table->string('product_description');
            $table->string('product_weight');
            $table->string('product_tax_code');
            $table->string('product_brand');
            $table->string('product_branch');
            $table->string('product_group');
            $table->string('projected_quantity');
            $table->string('projected_quantity_unit');
            $table->string('destination');
            $table->string('minimum_order_quantity');
            $table->string('minimum_order_quantity_unit');
            $table->string('pickup_price');
            $table->string('pickup_price_unit');
            $table->string('price_per_unit');
            $table->string('price_unit');
            $table->string('tax_code');
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
        Schema::dropIfExists('sales_quotation_request_products');
    }
}
