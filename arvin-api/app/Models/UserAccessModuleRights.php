<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class UserAccessModuleRights extends Model
{
    use HasFactory;
    protected $fillable = ['code',
    'module_code',   
    'user_id',
    'access_rights',
    'added_by',
    'modified_by',];
}
