<?php
//reference
use App\Http\Controllers\AuthController;
use App\Http\Controllers\EPayCheckCheckDetailLogsController;
use App\Http\Controllers\EPayCheckCheckDetailsController;
use App\Http\Controllers\EPayCheckCheckSalesInvoiceDetailsController;
use App\Http\Controllers\EpayCheckForApprovalController;
use App\Http\Controllers\EPayCheckReport;
use App\Http\Controllers\RefBankAccountsController;
use App\Http\Controllers\RefCompaniesController;
use App\Http\Controllers\RefBusinessUnitsController;
use App\Http\Controllers\RefTeamsController;
use App\Http\Controllers\RefDepartmentsController;
use App\Http\Controllers\RefSectionsController;
use App\Http\Controllers\RefSubSectionsController;
use App\Http\Controllers\RefSalesRankingController;
use App\Http\Controllers\RefSalesRankingPlacementsController;
use App\Http\Controllers\RefModulesController;
use App\Http\Controllers\RefComponentsController;
use App\Http\Controllers\RefSubComponentsController;
use App\Http\Controllers\RefProducts;
use App\Http\Controllers\RefRequestTypesController;
use App\Http\Controllers\RefUnitOfMeasurementController;
use App\Http\Controllers\RefCurrenciesController;
use App\Http\Controllers\RefValueAddedTaxController;
use App\Http\Controllers\RefRequestHierarchiesController;
use App\Http\Controllers\RefSalutationsController;
use App\Http\Controllers\RefTruckTypesController;
use App\Http\Controllers\RefProductGroupsController;
use App\Http\Controllers\RefHolidaysController;
use App\Http\Controllers\RefClientsSalesOutLogsController;

use App\Http\Controllers\UsersController;
use App\Http\Controllers\UserAccessCustomerRightsController;
use App\Http\Controllers\UserAccessOrganizationRightsController;
use App\Http\Controllers\UserAccessPageRightsController;
use App\Http\Controllers\UserAccessRequestRightsController;
use App\Http\Controllers\UserAccessProductGroupRightsController;
use App\Http\Controllers\UsersAccountsController;

use App\Http\Controllers\SalesDailyOutAnnualSettingsSalesController;
use App\Http\Controllers\SalesDailyOutsController;
use App\Http\Controllers\SalesDailyOutAnnualSalesRankingController;
use App\Http\Controllers\SalesDailyOutAnnualSalesRankingDetailsController;
use App\Http\Controllers\SalesDailyOutReportSalesSummaryController;
use App\Http\Controllers\SalesDailyOutSettingsAnnualQuotaController;
use App\Http\Controllers\SalesDailyOutTrackersController;
use App\Http\Controllers\SalesDailyOutReportSalesTrackerSummaryController;
use App\Http\Controllers\SalesDailyOutHolidayExclusionsController;
use App\Http\Controllers\SalesDailyOutSettingsClientGroupsController;
use App\Http\Controllers\SalesDailyOutSettingsAnnualQuotaClientGroupsController;
use App\Http\Controllers\SalesDailyOutReportDavaotksController;
use App\Http\Controllers\SalesDailyOutClientSalesTrackersController;
use App\Http\Controllers\SalesDailyOutSettingsClientSubGroupsController;
use App\Http\Controllers\SalesDailyOutReportClientsSummaryController;

use App\Http\Controllers\SalesQuotationRequestController;
use App\Http\Controllers\SalesQuotationRequestForApprovalsController;
use App\Http\Controllers\SalesQuotationReportQuotedProducts;
use App\Http\Controllers\VesselAndControllerMonitoringController;
use App\Models\RefBankAccounts;
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
   
    
    //MODULE SALES DAILY OUT START

     Route::group(['middleware' => ['auth:sanctum']], function () {
        //REFERENCE
        // Route::apiResource('reference/companies',RefCompaniesController::class)->middleware(['light_decryption']);
         Route::post('/users/change-password',[AuthController::class, 'change_password'])->middleware(['light_decryption']);
         Route::post('/users/access-sync',[AuthController::class, 'sync_user_access_right_by_id'])->middleware(['light_decryption']);

        //AUTH END
        
        // REFERENCE START
        Route::apiResource('reference/companies',RefCompaniesController::class)->middleware(['light_decryption']);
        Route::apiResource('reference/business_units',RefBusinessUnitsController::class)->middleware(['light_decryption']);
        Route::apiResource('reference/teams',RefTeamsController::class)->middleware(['light_decryption']);
        Route::apiResource('reference/departments',RefDepartmentsController::class)->middleware(['light_decryption']);
        Route::apiResource('reference/sections',RefSectionsController::class)->middleware(['light_decryption']);
        Route::apiResource('reference/subsections',RefSubSectionsController::class)->middleware(['light_decryption']);
        Route::get('reference/ref_subsections',[RefSubSectionsController::class,'get_refence_subsections']);
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
        Route::get('reference/get_employee_customer_access_list',[UserAccessCustomerRightsController::class,'get_employee_customer_access_list']);
        Route::post('reference/get_employee_customer_access_list/get_employee_customer_access_details',[UserAccessCustomerRightsController::class,'get_employee_customer_access_details'])->middleware(['light_decryption']);
        Route::apiResource('reference/system_settings/access_rights/customer_rights',UserAccessCustomerRightsController::class)->middleware(['light_decryption']);
        Route::get('reference/get_ref_products',[RefProducts::class,'get_ref_products']);
        Route::apiResource('reference/ref_request_types',RefRequestTypesController::class)->middleware(['light_decryption']);
        Route::get('reference/get_ref_request_types',[RefRequestTypesController::class,'get_ref_request_types']);
        Route::apiResource('reference/ref_unit_of_measurement',RefUnitOfMeasurementController::class)->middleware(['light_decryption']);
        Route::get('reference/get_ref_unit_of_measurement',[RefUnitOfMeasurementController::class,'get_ref_unit_of_measurement']);
        Route::apiResource('reference/ref_currencies',RefCurrenciesController::class)->middleware(['light_decryption']);
        Route::get('reference/get_ref_currencies',[RefCurrenciesController::class,'get_ref_currencies']);
        Route::apiResource('reference/ref_value_added_tax',RefValueAddedTaxController::class)->middleware(['light_decryption']);
        Route::get('reference/get_ref_value_added_tax',[RefValueAddedTaxController::class,'get_ref_value_added_tax']);
        Route::apiResource('reference/ref_request_hierarchy',RefRequestHierarchiesController::class)->middleware(['light_decryption']);
        Route::get('reference/get_ref_request_hierarchy',[RefRequestHierarchiesController::class,'get_ref_request_hierarchy']);
        Route::get('reference/get_specific_ref_request_hierarchy/{id}',[RefRequestHierarchiesController::class,'get_specific_ref_request_hierarchy']);
        Route::get('reference/get_request_rights_access_list',[UserAccessRequestRightsController::class,'get_request_rights_access_list']);
        Route::apiResource('reference/system_settings/access_rights/request_rights_access_list',UserAccessRequestRightsController::class)->middleware(['light_decryption']);
        Route::apiResource('reference/ref_salutations',RefSalutationsController::class)->middleware(['light_decryption']);
        Route::get('reference/get_ref_salutations',[RefSalutationsController::class,'get_ref_salutations']);
        Route::apiResource('reference/ref_truck_types',RefTruckTypesController::class)->middleware(['light_decryption']);
        Route::get('reference/get_ref_truck_types',[RefTruckTypesController::class,'get_ref_truck_types']);
        Route::apiResource('reference/ref_product_groups',RefProductGroupsController::class)->middleware(['light_decryption']);
        Route::get('reference/get_ref_product_groups_sap',[RefProductGroupsController::class,'get_ref_product_groups_sap']);
        Route::get('reference/get_ref_product_groups',[RefProductGroupsController::class,'get_ref_product_groups']);
        Route::get('reference/system_settings/access_rights/product_group_rights/get_product_group_right_access_list/{id}',[UserAccessProductGroupRightsController::class,'get_product_group_right_access_list']);
        Route::apiResource('reference/system_settings/access_rights/product_group_rights',UserAccessProductGroupRightsController::class)->middleware(['light_decryption']);
        Route::apiResource('reference/ref_holidays',RefHolidaysController::class)->middleware(['light_decryption']);
        Route::get('reference/get_ref_holidays',[RefHolidaysController::class,'get_ref_holidays']);
        Route::apiResource('reference/ref_bank_accounts',RefBankAccountsController::class)->middleware(['light_decryption']);
        Route::get('reference/get_ref_bank_accounts',[RefBankAccountsController::class,'get_ref_bank_accounts']);
        Route::get('reference/postRefClientsSalesOutLogs',[RefClientsSalesOutLogsController::class,'postRefClientsSalesOutLogs'])->middleware(['light_decryption']);


        
        // REFERENCE END


        // SALES DAILY OUT START
        Route::get('salesdailyout/get_five_days_sales_daily_out_by_current_date',[SalesDailyOutsController::class,'getFiveDaysSalesDailyOutbyCurrentDate']);
        // Route::get('salesdailyout/insert_sap_sales_daily_out/{id}',[SalesDailyOutsController::class,'insertSAPSalesDailyOut']);
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
        Route::get('salesdailyout/sales_tracker/report/get_report_sales_summary',[SalesDailyOutReportSalesTrackerSummaryController::class,'getReportSalesSummary']);
        // Sales Daily Out Annual Report End

        // Sales Daily Out Settings Annual Quota START
        Route::get('salesdailyout/settings_annual_quota/get_sales_annual_settings',[SalesDailyOutSettingsAnnualQuotaController::class,'get_sales_annual_settings']);//for pagination
        Route::get('salesdailyout/settings_annual_quota/get_annual_monthly_daily_target_sales_by_section_subsection_product_group/{id}/{year}/{pg}',[SalesDailyOutSettingsAnnualQuotaController::class, 'get_annual_monthly_daily_target_sales_by_section_subsection_product_group'])->middleware(['light_decryption']);
        Route::apiResource('salesdailyout/settings_annual_quota',SalesDailyOutSettingsAnnualQuotaController::class)->middleware(['light_decryption']);
        Route::post('salesdailyout/settings_annual_quota/update_quota',[SalesDailyOutSettingsAnnualQuotaController::class, 'update_quota'])->middleware(['light_decryption']);
        // Sales Daily Out Settings Annual Quota END 

        // Sales Holiday Exclusions START
        Route::apiResource('salesdailyout/holiday_exclusions',SalesDailyOutHolidayExclusionsController::class)->middleware(['light_decryption']);
        Route::post('salesdailyout/holiday_exclusions/move_sales_per_day',[SalesDailyOutHolidayExclusionsController::class, 'move_sales_per_day'])->middleware(['light_decryption']);
        
        // Sales Holiday Exclusions END  

        // Sales Tracker START
        Route::get('salesdailyout/sales_tracker/get_sales_tracker_by_date_subsection_product',[SalesDailyOutTrackersController::class, 'get_sales_tracker_by_date_subsection_product']);
        Route::get('salesdailyout/sales_tracker/get_five_days_sales_daily_out_by_current_date',[SalesDailyOutTrackersController::class,'getFiveDaysSalesDailyOutbyCurrentDate']);
        Route::get('salesdailyout/sales_tracker/getFiveDaysSalesTrackerbyCurrentDate',[SalesDailyOutTrackersController::class, 'getFiveDaysSalesTrackerbyCurrentDate']);
        Route::get('salesdailyout/sales_tracker/getFiveDaysSalesTrackerbyCurrentDateManila',[SalesDailyOutTrackersController::class, 'getFiveDaysSalesTrackerbyCurrentDateManila']);
        Route::get('salesdailyout/sales_tracker/get_sales_tracker',[SalesDailyOutTrackersController::class, 'get_sales_tracker']);
        Route::get('salesdailyout/sales_tracker/insert_sap_sales_daily_out/{product_groups_description}/{year_sales_target}/{ref_sub_section_type}/{settings_annual_quota_code}',[SalesDailyOutTrackersController::class, 'insert_sap_sales_daily_out'])->middleware(['light_decryption']);
        Route::get('salesdailyout/sales_tracker/get_sales_daily_out_per_day/{sales_date}/{settings_sales_code}',[SalesDailyOutTrackersController::class, 'get_sales_daily_out_per_day'])->middleware(['light_decryption']);
        Route::get('salesdailyout/sales_tracker/get_status_daily_target_and_percentage_daily_target_by_daily_out/{daily_out}/{daily_quota}',[SalesDailyOutTrackersController::class, 'get_status_daily_target_and_percentage_daily_target_by_daily_out'])->middleware(['light_decryption']);
        Route::apiResource('salesdailyout/sales_tracker',SalesDailyOutTrackersController::class)->middleware(['light_decryption']);
        // Sales Tracker END 

        // // Sales Daily Out DAVAO TKS Report START
        Route::get('salesdailyout/report/getDavaoTKSSummaryReport',[SalesDailyOutReportDavaotksController::class,'getDavaoTKSSummaryReport']);
        // // Sales Daily Out DAVAO TKS Report END


        // Sales Client Group START
        Route::get('salesdailyout/client_groups/get_group_clients',[SalesDailyOutSettingsClientGroupsController::class,'get_group_clients']);
        Route::apiResource('salesdailyout/client_groups',SalesDailyOutSettingsClientGroupsController::class)->middleware(['light_decryption']);
        // Sales Client Group END

        // Sales Client Subgroup START
        Route::apiResource('salesdailyout/client_subgroups',SalesDailyOutSettingsClientSubGroupsController::class)->middleware(['light_decryption']);
        // Sales Client Subgroup END




        // Sales Daily Out Settings Annual Quota Client Groups START
        Route::post('salesdailyout/settings_quota_groups/refresh_annual_group_client_out',[SalesDailyOutSettingsAnnualQuotaClientGroupsController::class,'refresh_annual_group_client_out'])->middleware(['light_decryption']);//for pagination
        Route::get('salesdailyout/settings_quota_groups/annual_quota_client_groups',[SalesDailyOutSettingsAnnualQuotaClientGroupsController::class,'annual_quota_client_groups']);//for pagination
        Route::apiResource('salesdailyout/settings_quota_groups',SalesDailyOutSettingsAnnualQuotaClientGroupsController::class)->middleware(['light_decryption']);
        // Sales Daily Out Settings Annual Quota Client Groups END


        // Client Sales Tracker START
        Route::get('salesdailyout/sales_tracker/client/client_sales_tracker',[SalesDailyOutClientSalesTrackersController::class, 'client_sales_tracker']);
        Route::get('salesdailyout/sales_tracker/client/insert_sap_client_sales_tracker',[SalesDailyOutClientSalesTrackersController::class, 'insert_sap_client_sales_tracker']);
        Route::get('salesdailyout/sales_tracker/client/getFiveDaysClientSalesTrackerbyCurrentDate',[SalesDailyOutClientSalesTrackersController::class, 'getFiveDaysClientSalesTrackerbyCurrentDate']);
        // Client Sales Tracker END 

        // Client Sales Report Client Summary START
        Route::get('salesdailyout/sales_tracker/client/client_sales_summary',[SalesDailyOutClientSalesTrackersController::class, 'client_sales_summary']);
        Route::get('salesdailyout/sales_tracker/client/client_sales_summary_report_data',[SalesDailyOutClientSalesTrackersController::class, 'client_sales_summary_report_data']);
        // Client Sales Report Client Summary END
       

        // Sales Daily Out Report Client Summary START
        Route::get('salesdailyout/report/get_client_sales_tracker_summary',[SalesDailyOutReportClientsSummaryController::class,'get_client_sales_tracker_summary']);
        // Sales Daily Out Report Client Summary End

        //MODULE SALES DAILY OUT END 

        // QUOTATION START
        Route::get('quotation/request/get_request_quotation',[SalesQuotationRequestController::class,'get_request_quotation']);
        Route::apiResource('quotation/request',SalesQuotationRequestController::class)->middleware(['light_decryption']);
        Route::get('quotation/for_approval_quotation/get_request_for_approval',[SalesQuotationRequestForApprovalsController::class,'get_request_for_approval']);
        Route::apiResource('quotation/for_approval_quotation',SalesQuotationRequestForApprovalsController::class)->middleware(['light_decryption']);
        Route::get('quotation/report/quoted_products/get_report_quoted_products',[SalesQuotationReportQuotedProducts::class,'get_report_quoted_products']);
        // QUOTATION END


        // HUMAN RESOURCE START
        Route::get('humanresource/employee_list',[UsersController::class, 'employee_list']);
        Route::get('humanresource/account_list',[UsersController::class, 'account_list']);
        Route::get('humanresource/fast_create',[UsersController::class, 'fast_create']);
        Route::apiResource('humanresource/employee',UsersController::class)->middleware(['light_decryption']);

        // HUMAN RESOURCE ACCOUNTS START
        Route::apiResource('humanresource/accounts',UsersAccountsController::class)->middleware(['light_decryption']);
        // HUMAN RESOURCE ACCOUNTS END
        // HUMAN RESOURCE END

        // EPAYCHECK START
        //EPAYCHECK CHECK FOR APPROVAL
        Route::get('epaycheck/check_approval/get_details',[EpayCheckForApprovalController::class,'get_details']);
        Route::get('epaycheck/check_approval/get_for_approval_list',[EpayCheckForApprovalController::class,'get_for_approval_list']);
        Route::apiResource('epaycheck/check_approval',EpayCheckForApprovalController::class)->middleware(['light_decryption']); 
        Route::post('epaycheck/check_approval/update_request_status',[EpayCheckForApprovalController::class,'update_request_status'])->middleware(['light_decryption']); 
        
       

        Route::get('epaycheck/get_sales_invoice_list',[EPayCheckCheckSalesInvoiceDetailsController::class,'get_sales_invoice_list']);
        Route::get('epaycheck/get_check_details',[EPayCheckCheckDetailsController::class,'get_check_details']);
        Route::get('epaycheck/get_check_receive',[EPayCheckCheckDetailsController::class,'get_check_receive']);
        Route::get('epaycheck/get_check_received_by',[EPayCheckCheckDetailsController::class,'get_check_received_by']);
        Route::get('epaycheck/get_receipt_details',[EPayCheckCheckDetailsController::class,'get_receipt_details']);
        Route::get('epaycheck/get_check_customer',[EPayCheckCheckDetailsController::class,'get_check_customer']);
        Route::get('epaycheck/get_receipt_format',[EPayCheckCheckDetailsController::class,'get_receipt_format']);
        Route::apiResource('epaycheck/check_details',EPayCheckCheckDetailsController::class)->middleware(['light_decryption']);
        Route::post('epaycheck/check_details/update_check_status',[EPayCheckCheckDetailsController::class,'update_check_status'])->middleware(['light_decryption']);
        Route::post('epaycheck/check_details/update_check_receive',[EPayCheckCheckDetailsController::class,'update_check_receive'])->middleware(['light_decryption']);
        Route::post('epaycheck/check_details/update_reject_for_close',[EPayCheckCheckDetailsController::class,'update_reject_for_close'])->middleware(['light_decryption']);
        Route::post('epaycheck/check_details/update_received_check_by_ar_at',[EPayCheckCheckDetailsController::class,'update_received_check_by_ar_at'])->middleware(['light_decryption']);
        Route::post('epaycheck/check_details/update_applied_at',[EPayCheckCheckDetailsController::class,'update_applied_at'])->middleware(['light_decryption']);

        //REPORT
        Route::get('epaycheck/report/get_monitoring_check_counter',[EPayCheckReport::class,'get_monitoring_check_counter']);
        Route::get('epaycheck/report/get_received_check_counter',[EPayCheckReport::class,'get_received_check_counter']);
        Route::get('epaycheck/check_detail_logs/get_weekly_check_counter_data',[EPayCheckCheckDetailLogsController::class,'get_weekly_check_counter_data']);
        Route::apiResource('epaycheck/report',EPayCheckReport::class)->middleware(['light_decryption']);

       
        // EPAYCHECK END

        // LOGISTIC
        Route::get('logistic/monitoring/get_po_details',[VesselAndControllerMonitoringController::class,'get_po_details']);
        Route::get('logistic/monitoring/get_specific_invoice_details',[VesselAndControllerMonitoringController::class,'get_specific_invoice_details']);
        // LOGISTIC END


    });
    Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
        return $request->user();
    });