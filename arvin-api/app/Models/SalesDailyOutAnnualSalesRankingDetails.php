<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class SalesDailyOutAnnualSalesRankingDetails extends Model
{
    use HasFactory;
    protected $guarded = ['id'];
    protected $hidden = ['created_at','updated_at','deleted_at','added_by','modified_by'];
}
