import { createTheme, ThemeProvider } from "@mui/material/styles";
import React, { lazy, Suspense } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import Cookies from "universal-cookie";
import "./App.css";
import configure from "./apps/configure/configure.json";
import PrivateRoute from "./security/PrivateRoute";
import { Start } from "@mui/icons-material";
import IndexRefBankAccounts from "./apps/aim/settings/reference/pages/IndexRefBankAccounts";

const Loader = lazy(() => import("components/loading/Loading"));
const Navigation = lazy(() => import("./apps/navigation/pages/Navigation"));
const IndexLogin = lazy(() => import("./apps/auth/login/pages/IndexLogin"));
const NoMatch = lazy(() => import("./apps/aim/home/pages/NoMatch"));
const NoAccess = lazy(() => import("./apps/aim/home/pages/NoAccess"));

// LANDING PAGE START
const IndexHome = lazy(() => import("./apps/aim/home/pages/Home"));
// LANDING PAGE END

// SALES START
const SalesLeaderboard = lazy(() =>
  import("./apps/aim/sales/leaderboard/pages/IndexSalesLeaderboard")
);
const IndexSalesRankingPoints = lazy(() =>
  import("./apps/aim/sales/rankingPoints/pages/IndexSalesRankingPoints")
);
const IndexSalesSummary = lazy(() =>
  import("./apps/aim/sales/report/salesTrackerSummary/pages/IndexSalesSummary")
);
const IndexSelectedSalesSummary = lazy(() =>
  import("./apps/aim/sales/salesSummary/pages/IndexSelectedSalesSummary")
);
const IndexSalesQouta = lazy(() =>
  import("./apps/aim/sales/salesQuota/pages/IndexSalesQuota")
);
const IndexAnnualSalesQuota = lazy(() =>
  import("./apps/aim/sales/annualSalesQuota/pages/IndexAnnualSalesQuota")
);
const IndexHolidayExclusion = lazy(() =>
  import("./apps/aim/sales/holidayExclusion/pages/IndexHolidayExclusion")
);
const IndexClientGroups = lazy(() =>
  import("./apps/aim/sales/clientGroups/pages/IndexClientGroups")
);
const IndexAnnualSalesQoutaClientGroups = lazy(() =>
  import(
    "./apps/aim/sales/annualSalesQuotaClientGroups/pages/IndexAnnualSalesQoutaClientGroups"
  )
);
const IndexDavaoTKS = lazy(() =>
  import("./apps/aim/sales/report/davaoTSK/pages/IndexDavaoTKS")
);
const IndexClientSales = lazy(() =>
  import("./apps/aim/sales/salesTracker/clientSales/pages/IndexClientSales")
);
const IndexWarehouseSales = lazy(() =>
  import(
    "./apps/aim/sales/salesTracker/warehouseSales/pages/IndexWarehouseSales"
  )
);
const IndexClientSummary = lazy(() =>
  import("./apps/aim/sales/report/clientSummary/pages/IndexClientSummary")
);
const IndexClientSalesSummary = lazy(() =>
  import(
    "./apps/aim/sales/report/clientSalesSummary/pages/IndexClientSalesSummary"
  )
);
const IndexSPR = lazy(() =>
  import("./apps/aim/sales/report/spr/pages/IndexSPR")
);
// SALES END

// QUOTATION START
const IndexQuotationList = lazy(() =>
  import("./apps/aim/quotation/quotationlist/pages/IndexQuotationList")
);
const IndexRequestQuotation = lazy(() =>
  import("./apps/aim/quotation/requestquotation/pages/IndexRequestQuotation")
);
const IndexForApprovalQuotation = lazy(() =>
  import(
    "./apps/aim/quotation/forapprovalquotation/pages/IndexForApprovalQuotation"
  )
);
const IndexMyQuotationList = lazy(() =>
  import("./apps/aim/quotation/myquotationList/pages/IndexMyQuotationList")
);
const IndexQuotedProducts = lazy(() =>
  import("./apps/aim/quotation/report/quotedproducts/pages/IndexQuotedProducts")
);
// QUOTATION END

// HUMAN RESOURCE START
const IndexEmployeeMasterList = lazy(() =>
  import("./apps/aim/humanresource/employeeList/pages/IndexEmployeeMasterList")
);
const IndexEmployeeDetails = lazy(() =>
  import("./apps/aim/humanresource/employeeDetails/pages/IndexEmployeeDetails")
);
// HUMAN RESOURCE END

//ACCESS RIGHTS START
const IndexOrganizationRights = lazy(() =>
  import(
    "./apps/aim/settings/accessrights/organizationrights/pages/IndexOrganizationRights"
  )
);
const IndexPageRights = lazy(() =>
  import("./apps/aim/settings/accessrights/pagerights/pages/IndexPageRights")
);
const IndexCustomerRights = lazy(() =>
  import(
    "./apps/aim/settings/accessrights/customerrights/pages/IndexCustomerRights"
  )
);
const IndexRequestRights = lazy(() =>
  import(
    "./apps/aim/settings/accessrights/requestrights/pages/IndexRequestRights"
  )
);
const IndexProductGroupRights = lazy(() =>
  import(
    "./apps/aim/settings/accessrights/productgrouprights/pages/IndexProductGroupRights"
  )
);
//ACCESS RIGHTS END

// ACCOUNT SETTINGS START
const IndexChangePassword = lazy(() =>
  import(
    "./apps/aim/settings/accountsettings/changepassword/pages/IndexChangePassword"
  )
);
// ACCOUNT SETTINGS END

// REFERENCE START
const IndexRefModules = lazy(() =>
  import("./apps/aim/settings/reference/pages/IndexRefModules")
);
const IndexRefComponents = lazy(() =>
  import("./apps/aim/settings/reference/pages/IndexRefComponents")
);
const IndexRefSubcomponents = lazy(() =>
  import("./apps/aim/settings/reference/pages/IndexRefSubcomponents")
);
const IndexRefRequestTypes = lazy(() =>
  import("./apps/aim/settings/reference/pages/IndexRefRequestTypes")
);
const IndexRefUnitOfMeasurements = lazy(() =>
  import("./apps/aim/settings/reference/pages/IndexRefUnitOfMeasurements")
);
const IndexRefCurrencies = lazy(() =>
  import("./apps/aim/settings/reference/pages/IndexRefCurrencies")
);
const IndexRefValueAddedTax = lazy(() =>
  import("./apps/aim/settings/reference/pages/IndexRefValueAddedTax")
);
const IndexRefRequestHierarchy = lazy(() =>
  import("./apps/aim/settings/reference/pages/IndexRefRequestHierarchy")
);
const IndexRefSalutations = lazy(() =>
  import("./apps/aim/settings/reference/pages/IndexRefSalutations")
);
const IndexRefTruckTypes = lazy(() =>
  import("./apps/aim/settings/reference/pages/IndexRefTruckTypes")
);
const IndexRefProductGroups = lazy(() =>
  import("./apps/aim/settings/reference/pages/IndexRefProductGroups")
);
const IndexRefHolidays = lazy(() =>
  import("./apps/aim/settings/reference/pages/IndexRefHolidays")
);
const IndexRefSubSections = lazy(() =>
  import("./apps/aim/settings/reference/pages/IndexRefSubSections")
);
// REFERENCE END

//EPAYCHECK START
const IndexCheckCollection = lazy(() =>
  import(
    "./apps/aim/epaycheck/checkReceipt/checkCollection/pages/IndexCheckCollection"
  )
);
const IndexCheckMonitoring = lazy(() =>
  import(
    "./apps/aim/epaycheck/checkReceipt/checkMonitoring/pages/IndexCheckMonitoring"
  )
);
const IndexCheckReceive = lazy(() =>
  import(
    "./apps/aim/epaycheck/checkReceipt/checkReceive/pages/IndexCheckReceive"
  )
);
const IndexWeeklyCheckCounter = lazy(() =>
  import(
    "./apps/aim/epaycheck/report/weeklyCheckCounter/pages/IndexWeeklyCheckCounter"
  )
);
const IndexCheckForApproval = lazy(() =>
  import(
    "./apps/aim/epaycheck/checkReceipt/checkForApproval/pages/IndexCheckForApproval"
  )
);
const IndexBankCheckCounter = lazy(() =>
  import(
    "./apps/aim/epaycheck/report/bankCheckCounter/pages/IndexBankCheckCounter"
  )
);
const IndexMonitoringCheckCounter = lazy(() =>
  import(
    "./apps/aim/epaycheck/report/monitoringCheckCounter/pages/IndexMonitoringCheckCounter"
  )
);
const IndexReceivedCheckCounter = lazy(() =>
  import(
    "./apps/aim/epaycheck/report/ReceivedCheckCounter/pages/IndexReceivedCheckCounter"
  )
);
const IndexCheckARReceive = lazy(() =>
  import(
    "./apps/aim/epaycheck/checkReceipt/checkARReceive/pages/IndexCheckARReceive"
  )
);
//EPAYCHECK END

const theme = createTheme({
  typography: {
    fontFamily: "Poppins, sans-serif",
  },
  palette: {
    primary: {
      main: configure.primary_color, // Your desired primary color
    },
    secondary: {
      main: configure.secondary_color, // Your desired secondary color
    },
  },
});
const cookies = new Cookies();
const token = localStorage.getItem("token");
const account_details = localStorage.getItem("account_details");
const RequireAuth = ({ children }) => {
  if (!token || !account_details) {
    return <Navigate to="/login" />;
  }
  return children;
};

function App() {
  const access = useSelector((state) => state.AuthenticationReducer.access);
  const hasAccess = (module, component, subComponent, subOnly) => {
    const moduleAccess = access.user_access_module_rights.some(
      (item) => item.description === module
    );
    const componentAccess = subOnly
      ? true
      : access.user_access_component_rights.some(
          (item) => item.description === component
        );
    let subComponentAccess = true; // Default to true if no subcomponent is provided
    if (subComponent) {
      subComponentAccess = access.user_access_sub_component_rights.some(
        (item) => item.description === subComponent
      );
    }
    return moduleAccess && componentAccess && subComponentAccess;
  };

  const getAccessChecker = (routeInfo) => () => {
    const { module, component, subComponent, subOnly = false } = routeInfo;
    return hasAccess(module, component, subComponent, subOnly);
  };
  return (
    <div className="App">
      <Loader />
      <ThemeProvider theme={theme}>
        <Suspense fallback={<Loader />}>
          <Routes>
            <Route path="/login" element={<IndexLogin />} />
            {typeof token !== "undefined" &&
              typeof account_details !== "undefined" && (
                <Route
                  path="/"
                  element={
                    <RequireAuth>
                      <Navigation />
                    </RequireAuth>
                  }
                >
                  <Route path="/" element={<IndexHome />} />
                  {/* SALES START */}
                  <Route
                    path="/Modules/Sales/Configuration/SalesQouta"
                    element={
                      <PrivateRoute
                        accessChecker={getAccessChecker({
                          module: "Sales",
                          component: "Configuration",
                          subComponent: "Sales Qouta",
                        })}
                      >
                        <IndexSalesQouta />
                      </PrivateRoute>
                    }
                  />
                  <Route
                    path="/Modules/Sales/SalesLeaderboard"
                    element={
                      <PrivateRoute
                        accessChecker={getAccessChecker({
                          module: "Sales",
                          component: "Sales Leaderboard",
                          subComponent: null,
                        })}
                      >
                        <SalesLeaderboard />
                      </PrivateRoute>
                    }
                  />
                  <Route
                    path="/Modules/Sales/Configuration/RankingPoints"
                    element={
                      <PrivateRoute
                        accessChecker={getAccessChecker({
                          module: "Sales",
                          component: "Configuration",
                          subComponent: "Ranking Points",
                        })}
                      >
                        <IndexSalesRankingPoints />
                      </PrivateRoute>
                    }
                  />
                  <Route
                    path="/Modules/Sales/Reports/SalesSummary"
                    element={
                      <PrivateRoute
                        accessChecker={getAccessChecker({
                          module: "Sales",
                          component: "Reports",
                          subComponent: "Sales Summary",
                        })}
                      >
                        <IndexSalesSummary />
                      </PrivateRoute>
                    }
                  />
                  <Route
                    path="/Modules/Sales/Reports/SalesSummary/:id/:month/:year"
                    element={
                      <PrivateRoute
                        accessChecker={getAccessChecker({
                          module: "Sales",
                          component: "Reports",
                          subComponent: "Sales Summary",
                        })}
                      >
                        <IndexSelectedSalesSummary />
                      </PrivateRoute>
                    }
                  />
                  <Route
                    path="/Modules/Sales/Configuration/AnnualSalesQuota"
                    element={
                      <PrivateRoute
                        accessChecker={getAccessChecker({
                          module: "Sales",
                          component: "Configuration",
                          subComponent: "Annual Sales Quota",
                        })}
                      >
                        <IndexAnnualSalesQuota />
                      </PrivateRoute>
                    }
                  />
                  <Route
                    path="/Modules/Sales/Configuration/HolidayExclusions"
                    element={
                      <PrivateRoute
                        accessChecker={getAccessChecker({
                          module: "Sales",
                          component: "Configuration",
                          subComponent: "Holiday Exclusions",
                        })}
                      >
                        <IndexHolidayExclusion />
                      </PrivateRoute>
                    }
                  />
                  <Route
                    path="/Modules/Sales/Configuration/ClientGroups"
                    element={
                      <PrivateRoute
                        accessChecker={getAccessChecker({
                          module: "Sales",
                          component: "Configuration",
                          subComponent: "Client Groups",
                        })}
                      >
                        <IndexClientGroups />
                      </PrivateRoute>
                    }
                  />
                  <Route
                    path="/Modules/Sales/Configuration/AnnualSalesQuotaClientGroups"
                    element={
                      <PrivateRoute
                        accessChecker={getAccessChecker({
                          module: "Sales",
                          component: "Configuration",
                          subComponent: "Annual Sales Quota Client Groups",
                        })}
                      >
                        <IndexAnnualSalesQoutaClientGroups />
                      </PrivateRoute>
                    }
                  />
                  <Route
                    path="/Modules/Sales/Reports/DavaoTKS"
                    element={
                      <PrivateRoute
                        accessChecker={getAccessChecker({
                          module: "Sales",
                          component: "Reports",
                          subComponent: "Davao TKS",
                        })}
                      >
                        <IndexDavaoTKS />
                      </PrivateRoute>
                    }
                  />
                  <Route
                    path="/Modules/Sales/SalesTracker/ClientSales"
                    element={
                      <PrivateRoute
                        accessChecker={getAccessChecker({
                          module: "Sales",
                          component: "Sales Tracker",
                          subComponent: "Client Sales",
                        })}
                      >
                        <IndexClientSales />
                      </PrivateRoute>
                    }
                  />
                  <Route
                    path="/Modules/Sales/SalesTracker/WarehouseSales"
                    element={
                      <PrivateRoute
                        accessChecker={getAccessChecker({
                          module: "Sales",
                          component: "Sales Tracker",
                          subComponent: "Warehouse Sales",
                        })}
                      >
                        <IndexWarehouseSales />
                      </PrivateRoute>
                    }
                  />
                  <Route
                    path="/Modules/Sales/Reports/ClientsSummary"
                    element={
                      <PrivateRoute
                        accessChecker={getAccessChecker({
                          module: "Sales",
                          component: "Reports",
                          subComponent: "Clients Summary",
                        })}
                      >
                        <IndexClientSummary />
                      </PrivateRoute>
                    }
                  />
                  <Route
                    path="/Modules/Sales/Reports/ClientSalesSummary"
                    element={
                      <PrivateRoute
                        accessChecker={getAccessChecker({
                          module: "Sales",
                          component: "Reports",
                          subComponent: "Weekly & Monthly Sales Summary",
                        })}
                      >
                        <IndexClientSalesSummary />
                      </PrivateRoute>
                    }
                  />
                  <Route
                    path="/Modules/Sales/Reports/SPR"
                    element={
                      <PrivateRoute
                        accessChecker={getAccessChecker({
                          module: "Sales",
                          component: "Reports",
                          subComponent: "SPR",
                        })}
                      >
                        <IndexSPR />
                      </PrivateRoute>
                    }
                  />

                  {/* SALES END */}
                  {/* QUOTATION START */}
                  <Route
                    path="/Modules/Quotation/QuotationList"
                    element={
                      <PrivateRoute
                        accessChecker={getAccessChecker({
                          module: "Quotation",
                          component: "Quotation List",
                          subComponent: null,
                        })}
                      >
                        <IndexQuotationList />
                      </PrivateRoute>
                    }
                  />
                  <Route
                    path="/Modules/Quotation/Request/RequestQuotation"
                    element={
                      <PrivateRoute
                        accessChecker={getAccessChecker({
                          module: "Quotation",
                          component: "Request",
                          subComponent: "Request Quotation",
                        })}
                      >
                        <IndexRequestQuotation />
                      </PrivateRoute>
                    }
                  />
                  <Route
                    path="/Modules/Quotation/Request/ForApprovalQuotation"
                    element={
                      <PrivateRoute
                        accessChecker={getAccessChecker({
                          module: "Quotation",
                          component: "Request",
                          subComponent: "For Approval Quotation",
                        })}
                      >
                        <IndexForApprovalQuotation />
                      </PrivateRoute>
                    }
                  />
                  <Route
                    path="/Modules/Quotation/MyQuotationList"
                    element={
                      <PrivateRoute
                        accessChecker={getAccessChecker({
                          module: "Quotation",
                          component: "My Quotation List",
                          subComponent: null,
                        })}
                      >
                        <IndexMyQuotationList />
                      </PrivateRoute>
                    }
                  />
                  <Route
                    path="/Modules/Quotation/Reports/QuotedProducts"
                    element={
                      <PrivateRoute
                        accessChecker={getAccessChecker({
                          module: "Quotation",
                          component: "Reports",
                          subComponent: "Quoted Products",
                        })}
                      >
                        <IndexQuotedProducts />
                      </PrivateRoute>
                    }
                  />
                  {/* QUOTATION END */}
                  {/* HUMAN RESOURCE START */}
                  <Route
                    path="/Modules/HumanResource/EmployeeMasterList"
                    element={
                      <PrivateRoute
                        accessChecker={getAccessChecker({
                          module: "Human Resource",
                          component: "Employee Master List",
                          subComponent: null,
                        })}
                      >
                        <IndexEmployeeMasterList />
                      </PrivateRoute>
                    }
                  />
                  <Route
                    path="/Modules/HumanResource/Employee/EmployeeDetails/:id"
                    element={
                      <PrivateRoute
                        accessChecker={getAccessChecker({
                          module: "Human Resource",
                          component: "Employee",
                          subComponent: "Employee Details",
                          subOnly: true,
                        })}
                      >
                        <IndexEmployeeDetails />
                      </PrivateRoute>
                    }
                  />
                  {/* HUMAN RESOURCE END */}
                  {/* SYSTEM SETTINGS START */}
                  {/* ACCESS RIGHTS START */}
                  <Route
                    path="/Modules/SystemSettings/AccessRights/OrganizationRights"
                    element={
                      <PrivateRoute
                        accessChecker={getAccessChecker({
                          module: "Settings",
                          component: "Access Rights",
                          subComponent: "Organization Rights",
                        })}
                      >
                        <IndexOrganizationRights />
                      </PrivateRoute>
                    }
                  />
                  <Route
                    path="/Modules/SystemSettings/AccessRights/PageRights"
                    element={
                      <PrivateRoute
                        accessChecker={getAccessChecker({
                          module: "Settings",
                          component: "Access Rights",
                          subComponent: "Page Rights",
                        })}
                      >
                        <IndexPageRights />
                      </PrivateRoute>
                    }
                  />
                  <Route
                    path="/Modules/SystemSettings/AccessRights/CustomerRights"
                    element={
                      <PrivateRoute
                        accessChecker={getAccessChecker({
                          module: "Settings",
                          component: "Access Rights",
                          subComponent: "Customer Rights",
                        })}
                      >
                        <IndexCustomerRights />
                      </PrivateRoute>
                    }
                  />
                  <Route
                    path="/Modules/SystemSettings/AccessRights/RequestRights"
                    element={
                      <PrivateRoute
                        accessChecker={getAccessChecker({
                          module: "Settings",
                          component: "Access Rights",
                          subComponent: "Request Rights",
                        })}
                      >
                        <IndexRequestRights />
                      </PrivateRoute>
                    }
                  />
                  <Route
                    path="/Modules/SystemSettings/AccessRights/ProductGroupRights"
                    element={
                      <PrivateRoute
                        accessChecker={getAccessChecker({
                          module: "Settings",
                          component: "Access Rights",
                          subComponent: "Product Group Rights",
                        })}
                      >
                        <IndexProductGroupRights />
                      </PrivateRoute>
                    }
                  />
                  {/* ACCESS RIGHTS END */}
                  {/* REFENRECE START */}
                  <Route
                    path="/Modules/SystemSettings/References/Modules"
                    element={
                      <PrivateRoute
                        accessChecker={getAccessChecker({
                          module: "Settings",
                          component: "References",
                          subComponent: "Modules",
                        })}
                      >
                        <IndexRefModules />
                      </PrivateRoute>
                    }
                  />
                  <Route
                    path="/Modules/SystemSettings/References/Components"
                    element={
                      <PrivateRoute
                        accessChecker={getAccessChecker({
                          module: "Settings",
                          component: "References",
                          subComponent: "Components",
                        })}
                      >
                        <IndexRefComponents />
                      </PrivateRoute>
                    }
                  />
                  <Route
                    path="/Modules/SystemSettings/References/Subcomponents"
                    element={
                      <PrivateRoute
                        accessChecker={getAccessChecker({
                          module: "Settings",
                          component: "References",
                          subComponent: "Subcomponents",
                        })}
                      >
                        <IndexRefSubcomponents />
                      </PrivateRoute>
                    }
                  />
                  <Route
                    path="/Modules/SystemSettings/References/RequestTypes"
                    element={
                      <PrivateRoute
                        accessChecker={getAccessChecker({
                          module: "Settings",
                          component: "References",
                          subComponent: "Request Types",
                        })}
                      >
                        <IndexRefRequestTypes />
                      </PrivateRoute>
                    }
                  />
                  <Route
                    path="/Modules/SystemSettings/References/UnitofMeasurements"
                    element={
                      <PrivateRoute
                        accessChecker={getAccessChecker({
                          module: "Settings",
                          component: "References",
                          subComponent: "Unit of Measurements",
                        })}
                      >
                        <IndexRefUnitOfMeasurements />
                      </PrivateRoute>
                    }
                  />
                  <Route
                    path="/Modules/SystemSettings/References/Currencies"
                    element={
                      <PrivateRoute
                        accessChecker={getAccessChecker({
                          module: "Settings",
                          component: "References",
                          subComponent: "Currencies",
                        })}
                      >
                        <IndexRefCurrencies />
                      </PrivateRoute>
                    }
                  />
                  <Route
                    path="/Modules/SystemSettings/References/ValueAddedTax"
                    element={
                      <PrivateRoute
                        accessChecker={getAccessChecker({
                          module: "Settings",
                          component: "References",
                          subComponent: "Value Added Tax",
                        })}
                      >
                        <IndexRefValueAddedTax />
                      </PrivateRoute>
                    }
                  />
                  <Route
                    path="/Modules/SystemSettings/References/RequestHierarchy"
                    element={
                      <PrivateRoute
                        accessChecker={getAccessChecker({
                          module: "Settings",
                          component: "References",
                          subComponent: "Request Hierarchy",
                        })}
                      >
                        <IndexRefRequestHierarchy />
                      </PrivateRoute>
                    }
                  />
                  <Route
                    path="/Modules/SystemSettings/References/Salutations"
                    element={
                      <PrivateRoute
                        accessChecker={getAccessChecker({
                          module: "Settings",
                          component: "References",
                          subComponent: "Salutations",
                        })}
                      >
                        <IndexRefSalutations />
                      </PrivateRoute>
                    }
                  />
                  <Route
                    path="/Modules/SystemSettings/References/TruckTypes"
                    element={
                      <PrivateRoute
                        accessChecker={getAccessChecker({
                          module: "Settings",
                          component: "References",
                          subComponent: "Truck Types",
                        })}
                      >
                        <IndexRefTruckTypes />
                      </PrivateRoute>
                    }
                  />
                  <Route
                    path="/Modules/SystemSettings/References/ProductGroups"
                    element={
                      <PrivateRoute
                        accessChecker={getAccessChecker({
                          module: "Settings",
                          component: "References",
                          subComponent: "Product Groups",
                        })}
                      >
                        <IndexRefProductGroups />
                      </PrivateRoute>
                    }
                  />
                  <Route
                    path="/Modules/SystemSettings/References/Holidays"
                    element={
                      <PrivateRoute
                        accessChecker={getAccessChecker({
                          module: "Settings",
                          component: "References",
                          subComponent: "Holidays",
                        })}
                      >
                        <IndexRefHolidays />
                      </PrivateRoute>
                    }
                  />
                  <Route
                    path="/Modules/SystemSettings/References/Subsections"
                    element={
                      <PrivateRoute
                        accessChecker={getAccessChecker({
                          module: "Settings",
                          component: "References",
                          subComponent: "Subsections",
                        })}
                      >
                        <IndexRefSubSections />
                      </PrivateRoute>
                    }
                  />
                  <Route
                    path="/Modules/SystemSettings/References/BankAccounts"
                    element={
                      <PrivateRoute
                        accessChecker={getAccessChecker({
                          module: "Settings",
                          component: "References",
                          subComponent: "Bank Accounts",
                        })}
                      >
                        <IndexRefBankAccounts />
                      </PrivateRoute>
                    }
                  />
                  {/* REFENRECE END */}
                  {/* EPAYCHECK START */}
                  <Route
                    path="/Modules/E-PayCheck/CheckReceipt/Collection"
                    element={
                      <PrivateRoute
                        accessChecker={getAccessChecker({
                          module: "E-Pay Check",
                          component: "Check Receipt",
                          subComponent: "Collection",
                        })}
                      >
                        <IndexCheckCollection />
                      </PrivateRoute>
                    }
                  />
                  <Route
                    path="/Modules/E-PayCheck/CheckReceipt/Monitoring"
                    element={
                      <PrivateRoute
                        accessChecker={getAccessChecker({
                          module: "E-Pay Check",
                          component: "Check Receipt",
                          subComponent: "Monitoring",
                        })}
                      >
                        <IndexCheckMonitoring />
                      </PrivateRoute>
                    }
                  />
                  <Route
                    path="/Modules/E-PayCheck/CheckReceipt/Receive"
                    element={
                      <PrivateRoute
                        accessChecker={getAccessChecker({
                          module: "E-Pay Check",
                          component: "Check Receipt",
                          subComponent: "Receive",
                        })}
                      >
                        <IndexCheckReceive />
                      </PrivateRoute>
                    }
                  />
                  <Route
                    path="/Modules/E-PayCheck/CheckReceipt/ARReceive"
                    element={
                      <PrivateRoute
                        accessChecker={getAccessChecker({
                          module: "E-Pay Check",
                          component: "Check Receipt",
                          subComponent: "AR Receive",
                        })}
                      >
                        <IndexCheckARReceive />
                      </PrivateRoute>
                    }
                  />
                  <Route
                    path="/Modules/E-PayCheck/Reports/WeeklyCheckCounter"
                    element={
                      <PrivateRoute
                        accessChecker={getAccessChecker({
                          module: "E-Pay Check",
                          component: "Reports",
                          subComponent: "Weekly Check Counter",
                        })}
                      >
                        <IndexWeeklyCheckCounter />
                      </PrivateRoute>
                    }
                  />
                  <Route
                    path="/Modules/E-PayCheck/Reports/BankCheckCounter"
                    element={
                      <PrivateRoute
                        accessChecker={getAccessChecker({
                          module: "E-Pay Check",
                          component: "Reports",
                          subComponent: "Bank Check Counter",
                        })}
                      >
                        <IndexBankCheckCounter />
                      </PrivateRoute>
                    }
                  />
                  <Route
                    path="/Modules/E-PayCheck/Reports/MonitoringCheckCounter"
                    element={
                      <PrivateRoute
                        accessChecker={getAccessChecker({
                          module: "E-Pay Check",
                          component: "Reports",
                          subComponent: "Monitoring Check Counter",
                        })}
                      >
                        <IndexMonitoringCheckCounter />
                      </PrivateRoute>
                    }
                  />
                  <Route
                    path="/Modules/E-PayCheck/Reports/ReceivedCheck"
                    element={
                      <PrivateRoute
                        accessChecker={getAccessChecker({
                          module: "E-Pay Check",
                          component: "Reports",
                          subComponent: "Received Check",
                        })}
                      >
                        <IndexReceivedCheckCounter />
                      </PrivateRoute>
                    }
                  />
                  {/* EPAYCHECK END */}
                  {/* SYSTEM SETTINGS END */}
                </Route>
              )}

            {/* SYSTEM SETTINGS START */}

            {/* ACCOUTN SETTINGS START */}
            <Route
              path="/Modules/SystemSettings/AccountSettings/ResetPassword"
              element={
                <PrivateRoute
                  accessChecker={getAccessChecker({
                    module: "Settings",
                    component: "Account Settings",
                    subComponent: "Reset Password",
                  })}
                >
                  <IndexChangePassword />
                </PrivateRoute>
              }
            />
            {/* ACCOUTN SETTINGS END */}

            {/* SYSTEM SETTINGS END */}

            <Route element={<NoMatch />} path="*" />
            <Route element={<NoAccess />} path="/invalid-access" />
          </Routes>
        </Suspense>
      </ThemeProvider>
    </div>
  );
}

export default App;
