<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class SalesDailyOutTrackersLogs extends Model
{
    use HasFactory;
    protected $guarded = ['id'];
    protected $fillable = [
        'code',
        'sales_daily_out_tracker_code',
        'sales_daily_out_annual_settings_sales_code',
        'subsection_code',
        'ref_product_groups_description',
        'year_sales_target',
        'sales_date',
        'sales_daily_qouta',
        'sales_daily_out',
        'sales_daily_target',
        'daily_sales_target_percentage',
        'monthly_sales_target',
        'transfer_type',
        'transfer',
        'new_daily_sales_target_percentage',
        'new_sales_daily_out',
        'new_sales_daily_target',
        'remarks',
        'selected_subsection_code',
        'added_by',
        'modified_by',
    ];
}
