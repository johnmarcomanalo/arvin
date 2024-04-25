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
}
