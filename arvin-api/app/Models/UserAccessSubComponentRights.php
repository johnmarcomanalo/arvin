<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class UserAccessSubComponentRights extends Model
{
    use HasFactory;
    protected $fillable = ['code',
    'module_code',   
    'component_code',   
    'sub_component_code',   
    'create',
    'update',
    'delete',
    'update',
    'generate',
    'export',
    'user_id',
    'access_rights',
    'added_by',
    'modified_by',];
}
