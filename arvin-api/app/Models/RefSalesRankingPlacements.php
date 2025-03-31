<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class RefSalesRankingPlacements extends Model
{
    use HasFactory;

    protected $guarded = [];

    public function scopeGetActive($q){
        return $q->whereNull('deleted_at')->get();
    }
    public function scopeRemoveAt($q,$id){
        return $q->update([
            'deleted_at'               => now(),
            'modified_by'              => $id,
           ]);
    }

}
