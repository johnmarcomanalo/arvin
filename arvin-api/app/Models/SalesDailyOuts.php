<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class SalesDailyOuts extends Model
{
    use HasFactory;
    protected $guarded = ['id'];
    protected function casts(): array
    {
        return [
            'sales_date' => 'date:Y-m-d',
        ];
    }

    public function getSalesDateAttribute($value){
        return $this->attributes['name'] = date('Y-m-d',strtotime($value));
    }
}
