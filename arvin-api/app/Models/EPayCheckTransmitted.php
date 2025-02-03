<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class EPayCheckTransmitted extends Model
{
    use HasFactory;

    protected $guarded= [];

    public static function generate_code(){
        $code = 1;
        $current_date = date('Y-m-d');
         $latest_code = Static::latest('code')->first('code')->code ?? NULL;
        if(!empty($latest_code)){
            $code = $latest_code + 1;
        }
        return $code;
    }
}
