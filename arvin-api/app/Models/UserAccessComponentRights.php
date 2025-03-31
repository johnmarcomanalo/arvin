<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class UserAccessComponentRights extends Model
{
    use HasFactory;
    protected $fillable = ['code',
    'module_code',   
    'component_code',
    'user_id',
    'create',
    'update',
    'delete',
    'update',
    'generate',
    'export',
    'access_rights',
    'added_by',
    'modified_by',];
}
