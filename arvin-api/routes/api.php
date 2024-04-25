<?php
//reference
use App\Http\Controllers\RefCompaniesController;
use App\Http\Controllers\RefBusinessUnitsController;
use App\Http\Controllers\RefTeamsController;
use App\Http\Controllers\RefDepartmentsController;
use App\Http\Controllers\RefSectionsController;
use App\Http\Controllers\RefSubSectionsController;
use App\Http\Controllers\QuotationAnnualQuotasController;




use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;











/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/
    //AUTH START
    Route::post('/login',[AuthController::class, 'login'])->middleware(['light_decryption']);
    //AUTH END
    
    // REFERENCE START
    Route::apiResource('reference/companies',RefCompaniesController::class)->middleware(['light.decryption']);
    Route::apiResource('reference/business_units',RefBusinessUnitsController::class)->middleware(['light.decryption']);
    Route::apiResource('reference/teams',RefTeamsController::class)->middleware(['light.decryption']);
    Route::apiResource('reference/departments',RefDepartmentsController::class)->middleware(['light.decryption']);
    Route::apiResource('reference/sections',RefSectionsController::class)->middleware(['light.decryption']);
    Route::apiResource('reference/subsections',RefSubSectionsController::class)->middleware(['light.decryption']);
    // REFERENCE END
   
    // QUOTATION START
    Route::apiResource('qoutation/annual_qouta',QuotationAnnualQuotasController::class)->middleware(['light.decryption']);
    Route::get('qoutation/annual_qouta/annual_qouta_computation/{amount}',[QuotationAnnualQuotasController::class, 'annual_qouta_computation'])->middleware(['light.decryption']);
    // Route::apiResource('qoutation/annual_qouta', ExampleConQuotationAnnualQuotasControllerroller::class)->middleware('cors');
    // QUOTATION END

    Route::group(['middleware' => ['auth:sanctum','cors','api']], function () {
        //REFERENCE
        // Route::apiResource('reference/companies',RefCompaniesController::class)->middleware(['light.decryption']);
    });
    Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
        return $request->user();



});
