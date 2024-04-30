<?php
//reference
use App\Http\Controllers\RefCompaniesController;
use App\Http\Controllers\RefBusinessUnitsController;
use App\Http\Controllers\RefTeamsController;
use App\Http\Controllers\RefDepartmentsController;
use App\Http\Controllers\RefSectionsController;
use App\Http\Controllers\RefSubSectionsController;
use App\Http\Controllers\QuotationAnnualQuotasController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\SalesDailyOutAnnualSettingsSalesController;
use App\Http\Controllers\SalesDailyOutsController;




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
    Route::apiResource('reference/companies',RefCompaniesController::class)->middleware(['light_decryption']);
    Route::apiResource('reference/business_units',RefBusinessUnitsController::class)->middleware(['light_decryption']);
    Route::apiResource('reference/teams',RefTeamsController::class)->middleware(['light_decryption']);
    Route::apiResource('reference/departments',RefDepartmentsController::class)->middleware(['light_decryption']);
    Route::apiResource('reference/sections',RefSectionsController::class)->middleware(['light_decryption']);
    Route::apiResource('reference/subsections',RefSubSectionsController::class)->middleware(['light_decryption']);
    // REFERENCE END
   
    // SALES DAILY OUT START
    Route::apiResource('salesdailyout/annual_settings_sales',SalesDailyOutAnnualSettingsSalesController::class)->middleware(['light_decryption']);
    Route::get('salesdailyout/annual_settings_sales/annual_target_sales_computation/{amount}',[SalesDailyOutAnnualSettingsSalesController::class, 'annual_target_sales_computation'])->middleware(['light_decryption']);
    Route::get('salesdailyout/annual_settings_sales/get_annual_monthly_daily_target_sales_by_section_subsection/{type}/{id}/{year}',[SalesDailyOutAnnualSettingsSalesController::class, 'get_annual_monthly_daily_target_sales_by_section_subsection'])->middleware(['light_decryption']);
    Route::get('salesdailyout/daily_out/get_status_daily_target_and_percentage_daily_target_by_daily_out/{daily_out}/{daily_quota}',[SalesDailyOutsController::class, 'get_status_daily_target_and_percentage_daily_target_by_daily_out'])->middleware(['light_decryption']);
    Route::apiResource('salesdailyout/daily_out',SalesDailyOutsController::class)->middleware(['light_decryption']);
    Route::get('salesdailyout/daily_out/get_sales_daily_out/{date}/{section}/{subsection}',[SalesDailyOutsController::class,'get_sales_daily_out'])->middleware(['light_decryption']);
    // SALES DAILY OUT END 
       
    // QUOTATION START
    Route::apiResource('qoutation/annual_qouta',QuotationAnnualQuotasController::class)->middleware(['light_decryption']);
    Route::get('qoutation/annual_qouta/annual_qouta_computation/{amount}',[QuotationAnnualQuotasController::class, 'annual_qouta_computation'])->middleware(['light_decryption']);
    // QUOTATION END


    Route::group(['middleware' => ['auth:sanctum','cors','api']], function () {
        //REFERENCE
        // Route::apiResource('reference/companies',RefCompaniesController::class)->middleware(['light_decryption']);
    });
    Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
        return $request->user();



});
