<?php

namespace App\Http\Controllers;
use Carbon\Carbon;

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

   public static function formatMonthOnly($data){
        return date('m',strtotime($data)) ;
    }
    public static function formatSingleDigitMonthOnly($data){
        return date('n',strtotime($data)) ;
    }

    public static function formatYearMonthOnly($data){
        return date('Y-m',strtotime($data)) ;
    }

    public static function formatYearOnly($data){
        return date('Y',strtotime($data)) ;
    }

    public static function formatTimeOnly($data){
        return date('H:i:s',strtotime($data)) ;
    }
    
    public static function formatDateTimeOnly($data){
        return date('Y-m-d H:i:s',strtotime($data)) ;
    }

    public static function generate_code($modelClassName,$column){
        $code = 1;
        $model = new $modelClassName;
        $latest_code = $model::latest($column)->first($column)->code ?? NULL;
        if(!empty($latest_code)){
            $code = $latest_code + 1;
        }
        return $code;
    }


    public static function get_dates_in_selected_year($year) {
            $dates = [];

            // Loop through each month of the year
            for ($month = 1; $month <= 12; $month++) {
                // Create a Carbon instance for the first day of the month
                $date = Carbon::create($year, $month, 1);

                // Get the number of days in the month
                $daysInMonth = $date->daysInMonth;

                // Loop through each day of the month
                for ($day = 1; $day <= $daysInMonth; $day++) {
                    // Create a Carbon instance for the current day
                    $currentDate = $date->copy()->setDay($day);

                    // Add the current date to the array (including Sundays)
                    $dates[] = $currentDate->format('Y-m-d');
                }
            }

            return $dates;
    }
}
