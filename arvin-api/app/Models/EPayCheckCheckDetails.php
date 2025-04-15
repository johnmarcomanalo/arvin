<?php

namespace App\Models;

use Attribute;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class EPayCheckCheckDetails extends Model
{
    use HasFactory;

    protected $guarded=[];
    protected $table = 'e_pay_check_check_details';

    public function setBankDescriptionAttribute($value)
    {
        $this->attributes['bank_description'] = strtoupper($value);
    }
    
    public function setBankBranchAttribute($value)
    {
        $this->attributes['bank_branch'] = strtoupper($value);
    }

    public function setBankAddressAttribute($value)
    {
        $this->attributes['bank_address'] = strtoupper($value);
    }

    public function setCrprAttribute($value)
    {
        $this->attributes['crpr'] = strtoupper($value);
    }

    public static function getCheckDetails($code)
    {
        return DB::table('e_pay_check_check_details as a')
            ->join('e_pay_check_check_detail_logs as b', function ($join) {
                $join->on('a.code', '=', 'b.check_details_code')
                     ->on('a.check_status', '=', 'b.check_status');
            })
            ->whereNull('b.deleted_at')
            ->whereIn('a.code', $code)
            ->select([
                'a.code',
                'a.subsection_code',
                'a.check_number',
                'a.check_amount',
                'a.check_date',
                'a.check_status',
                'b.check_status as check_status_logs',
                'b.check_status_date',
                'a.bank_description',
                'a.bank_branch',
                'a.bank_address',
                'a.payment_type',
                'a.card_code',
                'a.card_name',
                'a.crpr',
                'a.advance_payment',
                'a.deleted_at as deleted_at',
                'b.deleted_at as deleted_at_logs',
                'b.rejected_date',
                'b.rejected_remarks',
                'b.deposited_bank',
                'b.deposited_date',
                'b.received_date'
            ]);
    }

    protected static function boot()
    {
        parent::boot();

        // Set added_by and modified_by during creation
        static::creating(function ($model) {
            $model->added_by = Auth::user()->code;
            $model->modified_by = Auth::user()->code;
        });

        // Set modified_by during update
        static::updating(function ($model) {
            $model->modified_by = Auth::user()->code;
        });
    }

 
}
