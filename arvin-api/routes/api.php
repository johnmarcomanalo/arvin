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
use App\Http\Controllers\RefSalesRankingController;
use App\Http\Controllers\SalesDailyOutAnnualSettingsSalesController;
use App\Http\Controllers\SalesDailyOutsController;
use App\Http\Controllers\RefSalesRankingPlacementsController;
use App\Http\Controllers\SalesDailyOutAnnualSalesRankingController;
use App\Http\Controllers\SalesDailyOutAnnualSalesRankingDetailsController;
use App\Http\Controllers\SalesDailyOutReportSalesSummaryController;
use App\Http\Controllers\UsersController;
use App\Http\Controllers\UserAccessOrganizationRightsController;
use App\Http\Controllers\UserAccessPageRightsController;
use App\Http\Controllers\RefModulesController;
use App\Http\Controllers\RefComponentsController;
use App\Http\Controllers\RefSubComponentsController;
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
    Route::post('/users/change-password',[AuthController::class, 'change_password'])->middleware(['light_decryption']);

    //AUTH END
    
    // REFERENCE START
    Route::apiResource('reference/companies',RefCompaniesController::class)->middleware(['light_decryption']);
    Route::apiResource('reference/business_units',RefBusinessUnitsController::class)->middleware(['light_decryption']);
    Route::apiResource('reference/teams',RefTeamsController::class)->middleware(['light_decryption']);
    Route::apiResource('reference/departments',RefDepartmentsController::class)->middleware(['light_decryption']);
    Route::apiResource('reference/sections',RefSectionsController::class)->middleware(['light_decryption']);
    Route::apiResource('reference/subsections',RefSubSectionsController::class)->middleware(['light_decryption']);
    Route::get('reference/sales_ranking/get_ref_sales_ranking',[RefSalesRankingController::class,'get_ref_sales_ranking']);
    Route::get('reference/sales_ranking_list',[RefSalesRankingController::class,'get_ref_sales_ranking']);
    Route::apiResource('reference/sales_ranking',RefSalesRankingController::class)->middleware(['light_decryption']);
    Route::apiResource('reference/ref_sales_ranking_placements',RefSalesRankingPlacementsController::class)->middleware(['light_decryption']);
    Route::get('reference/subsections/get_subsection/{id}',[RefSubSectionsController::class,'get_subsection'])->middleware(['light_decryption']);
    Route::get('reference/system_settings/access_rights/organization_rights/get_employee_organization_access_list/{id}',[UserAccessOrganizationRightsController::class,'get_employee_organization_access_list']);
    Route::apiResource('reference/system_settings/access_rights/organization_rights',UserAccessOrganizationRightsController::class)->middleware(['light_decryption']);
    Route::get('reference/system_settings/access_rights/page_rights/get_employee_page_access_list/{id}',[UserAccessPageRightsController::class,'get_employee_page_access_list']);
    Route::apiResource('reference/system_settings/access_rights/page_rights',UserAccessPageRightsController::class)->middleware(['light_decryption']);
    Route::get('reference/ref_modules',[RefModulesController::class,'get_refence_modules']);
    Route::apiResource('reference/modules',RefModulesController::class)->middleware(['light_decryption']);
    Route::get('reference/ref_components',[RefComponentsController::class,'get_refence_components']);
    Route::apiResource('reference/components',RefComponentsController::class)->middleware(['light_decryption']);
    Route::get('reference/ref_subcomponents',[RefSubComponentsController::class,'get_refence_subcomponents']);
    Route::apiResource('reference/subcomponents',RefSubComponentsController::class)->middleware(['light_decryption']);
    // REFERENCE END
    
    //MODULE SALES DAILY OUT START

    // SALES DAILY OUT START
    Route::get('salesdailyout/get_five_days_sales_daily_out_by_current_date',[SalesDailyOutsController::class,'getFiveDaysSalesDailyOutbyCurrentDate']);
    Route::get('salesdailyout/insert_sap_sales_daily_out/{id}',[SalesDailyOutsController::class,'insertSAPSalesDailyOut']);
    Route::get('salesdailyout/daily_out/get_sales_daily_out',[SalesDailyOutsController::class,'get_sales_daily_out']);//for pagination
    Route::get('salesdailyout/daily_out/get_status_daily_target_and_percentage_daily_target_by_daily_out/{daily_out}/{daily_quota}',[SalesDailyOutsController::class, 'get_status_daily_target_and_percentage_daily_target_by_daily_out'])->middleware(['light_decryption']);
    Route::apiResource('salesdailyout/daily_out',SalesDailyOutsController::class)->middleware(['light_decryption']);
     // SALES DAILY OUT END 

    // Sales Daily Out Annual Settings Sales START
    Route::get('salesdailyout/annual_settings_sales/get_sales_annual_settings',[SalesDailyOutAnnualSettingsSalesController::class,'get_sales_annual_settings']);//for pagination
    Route::apiResource('salesdailyout/annual_settings_sales',SalesDailyOutAnnualSettingsSalesController::class)->middleware(['light_decryption']);
    Route::get('salesdailyout/annual_settings_sales/annual_target_sales_computation/{amount}',[SalesDailyOutAnnualSettingsSalesController::class, 'annual_target_sales_computation'])->middleware(['light_decryption']);
    Route::get('salesdailyout/annual_settings_sales/get_annual_monthly_daily_target_sales_by_section_subsection/{id}/{year}',[SalesDailyOutAnnualSettingsSalesController::class, 'get_annual_monthly_daily_target_sales_by_section_subsection'])->middleware(['light_decryption']);
    // Sales Daily Out Annual Settings Sales END 

    // Sales Daily Out Annual Sales Ranking START
    Route::get('salesdailyout/annual_sales_ranking/get_sales_ranking_by_id',[SalesDailyOutAnnualSalesRankingController::class,'get_sales_ranking_by_id']);
    Route::apiResource('salesdailyout/annual_sales_ranking',SalesDailyOutAnnualSalesRankingController::class)->middleware(['light_decryption']);
    Route::apiResource('salesdailyout/annual_sales_ranking_details',SalesDailyOutAnnualSalesRankingDetailsController::class)->middleware(['light_decryption']);
    // Sales Daily Out Annual Sales Ranking END
    
    // Sales Daily Out Annual Report START
    Route::get('salesdailyout/report/get_report_sales_summary',[SalesDailyOutReportSalesSummaryController::class,'getReportSalesSummary']);
    // Sales Daily Out Annual Report End

    //MODULE SALES DAILY OUT END 

    // QUOTATION START
    Route::apiResource('qoutation/annual_qouta',QuotationAnnualQuotasController::class)->middleware(['light_decryption']);
    Route::get('qoutation/annual_qouta/annual_qouta_computation/{amount}',[QuotationAnnualQuotasController::class, 'annual_qouta_computation'])->middleware(['light_decryption']);
    // QUOTATION END

    // HUMAN RESOURCE START
    Route::get('humanresource/employee_list',[UsersController::class, 'employee_list']);
    Route::get('humanresource/fast_create',[UsersController::class, 'fast_create']);
    // HUMAN RESOURCE END

    Route::group(['middleware' => ['auth:sanctum','cors','api']], function () {
        //REFERENCE
        // Route::apiResource('reference/companies',RefCompaniesController::class)->middleware(['light_decryption']);
    });
    Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
        return $request->user();



});
