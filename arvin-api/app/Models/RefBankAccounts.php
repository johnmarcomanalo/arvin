<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Auth;

class RefBankAccounts extends Model
{
    use HasFactory;

    protected $guarded = ['id'];
    
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
