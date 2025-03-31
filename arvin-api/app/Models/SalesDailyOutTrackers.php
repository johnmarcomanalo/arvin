<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class SalesDailyOutTrackers extends Model
{
    use HasFactory;
    protected $guarded = ['id'];

    protected $hidden = ['id','created_at','updated_at','deleted_at','added_by','modified_by'];

    protected function casts(): array
    {
        return [
            'sales_date' => 'date:Y-m-d',
        ];
    }

    public function getSalesDateAttribute($value){
        return $this->attributes['name'] = date('Y-m-d',strtotime($value));
    }

    public function scopeFreshFromSalesDailyOutTrackers($q,$fields,$value,$month){
        return $q->where('subsection_code',$fields['subsection_code'])
                ->where('sales_daily_out_annual_settings_sales_code',$value['code'])
                ->where('year_sales_target',$fields['year_selected_date'])
                ->where('ref_product_groups_description',$value['ref_product_groups_description'])
                ->whereMonth('sales_date', $month)
                ->whereNull('deleted_at');
    }
}
