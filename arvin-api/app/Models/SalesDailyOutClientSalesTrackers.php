<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class SalesDailyOutClientSalesTrackers extends Model
{
    use HasFactory;
    protected $guarded = ['id'];

    public function annualQuotaClientGroup()
    {
        return $this->belongsTo(SalesDailyOutSettingsAnnualQuotaClientGroups::class, 'sales_daily_out_settings_annual_quota_client_groups_code', 'code');
    }
    
}

