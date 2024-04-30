<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class MainController extends Controller
{
    public static function sum($params){
        $sum = 0;
        for($i = 0; $i < count($params); $i++){
            $sum = $sum + $params[$i];
        }
        return $sum;
    }

    public static function subtract($params){
        $subtract = $params[0];
        
        for($i = 1; $i < count($params); $i++){
            $subtract -= $params[$i];
        }
        return $subtract;
    }

    public static function multiply($params){
        $multiply = $params[0];
        
        for($i = 1; $i < count($params); $i++){
            $multiply *= $params[$i];
        }
        return $multiply;
    }

    public static function divide($params){
        $divide = $params[0];
        
        for($i = 1; $i < count($params); $i++){
            $divide /= $params[$i];
        }
        return $divide;
    }

    public static function amountFormat($data){
        return number_format($data, 2, '.', '');
    }

    public static function amountFormatFourDigit($data){
        return number_format($data, 4, '.', '');
    }

    public static function formatDateOnly($data){
        return date('Y-m-d',strtotime($data)) ;
    }

    public static function formatTimeOnly($data){
        return date('H:i:s',strtotime($data)) ;
    }
    
    public static function formatDateTimeOnly($data){
        return date('Y-m-d H:i:s',strtotime($data)) ;
    }

    public static function generate_code($modelClassName,$column){
        $code = 1;
        $current_date = date('Y-m-d');
        $model = new $modelClassName;
        $latest_code = $model::latest($column)->first($column)->code ?? NULL;
        if(!empty($latest_code)){
            $code = $latest_code + 1;
        }
        return $code;
    }
}
