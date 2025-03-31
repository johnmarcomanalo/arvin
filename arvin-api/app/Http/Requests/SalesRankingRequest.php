<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Http\Exceptions\HttpResponseException;
use Illuminate\Contracts\Validation\Validator;

class SalesRankingRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     *
     * @return bool
     */
    // public function authorize()
    // {
    //     return false;
    // }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array
     */
    public function rules()
    {
        return [

            'description'      => 'required|unique:ref_sales_rankings,description',
            'value'            => 'required',
            'type'             => 'required',
            'ranking_placement'=> 'required',
            'added_by'         => 'required',
            'modified_by'      => 'required',

        ];

    }

    public function failedValidation(Validator $validator)

    {

        throw new HttpResponseException(response([
            "data" => $validator->errors()
        ]));

        // throw new HttpResponseException(response()->json([
          
        //     'message' => 'Pleas Check your inputs',

        //     'result'   => false,

        //     'status'  => 'failed',

        //     'title'   => 'Failed',

        //     'data'      => $validator->errors()

        // ]));

    }
}
