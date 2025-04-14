<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class EPayCheckReport extends Controller
{
    private function report_by_bank(Request $request){
        $customMessages = [
            'df.required'         => 'The start date is required.',
            'df.date'             => 'The start date must be a valid date.',
            'df.date_format'      => 'The start date must be in MM/DD/YYYY format.', 
            'dt.required'         => 'The End date is required.',
            'dt.date'             => 'The End date must be a valid date.',
            'dt.after_or_equal'   => 'The selected end date must be the same as or later than the start date.',
            'dt.date_format'      => 'The end date must be in MM/DD/YYYY format.',
            'bnk.required'        => 'The Bank is required.',
            ];
            
            $validator = Validator::make($request->all(), [
                'df'              => ['required', 'date', 'date_format:Y-m-d'],
                'dt'              => ['required', 'date', 'date_format:Y-m-d', 'after_or_equal:df'], 
                'sc'              => ['required', 'string'],
                'bnk'             => ['required', 'string'],
            ], $customMessages); // Pass custom messages here
            
            if ($validator->fails()) {
                return response()->json([
                    'result'      => false,
                    'status'      => 'warning',
                    'title'       => 'Error',
                    'message'     => $validator->errors()->first(),
                ], 422);
            }
    }
}