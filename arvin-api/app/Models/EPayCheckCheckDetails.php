<?php

namespace App\Models;

use Attribute;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Auth;

class EPayCheckCheckDetails extends Model
{
    use HasFactory;

    protected $guarded=[];

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

    protected static function boot()
    {
        parent::boot();

        // Set added_by and modified_by during creation
        static::creating(function ($model) {
            $model->added_by = Auth::id();
            $model->modified_by = Auth::id();
        });

        // Set modified_by during update
        static::updating(function ($model) {
            $model->modified_by = Auth::id();
        });
    }

 
}
