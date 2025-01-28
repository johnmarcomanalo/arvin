<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Laravel\Sanctum\HasApiTokens;

class UsersAccounts extends Model
{
    use HasFactory;
    use HasApiTokens;
    protected $fillable = ['username', 'password'];
}
