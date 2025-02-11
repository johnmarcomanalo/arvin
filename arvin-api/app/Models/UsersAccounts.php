<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Laravel\Sanctum\HasApiTokens;
use Illuminate\Foundation\Auth\User as Authenticatable;
class UsersAccounts extends Authenticatable
{
    use HasFactory;
    use HasApiTokens;
    protected $guarded = ['id'];
    // protected $fillable = ['username', 'password'];
    protected $fillable = [
        'code',
        'user_code',
        'username',
        'password',
        'company_code',
        'business_unit_code',
        'team_code',
        'department_code',
        'section_code',
        'subsection_code',
        'position',
        'position_level',
        'added_by',
        'modified_by',
    ];
}
