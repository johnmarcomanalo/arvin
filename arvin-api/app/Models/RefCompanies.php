<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class RefCompanies extends Model
{
    use HasFactory;

     protected $fillable = [
        'code',
        'description',
        'address',
        'modified_by',
    ];

    protected $hidden = [
        'created_at',
        'updated_at',
        'deleted_at',
    ];
}
