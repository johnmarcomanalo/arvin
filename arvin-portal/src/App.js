import { createTheme, ThemeProvider } from "@mui/material/styles";
import React, { lazy, Suspense } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import Cookies from "universal-cookie";
import "./App.css";
import configure from "./apps/configure/configure.json";
import PrivateRoute from "./security/PrivateRoute";
const Loader = lazy(() => import("./components/loading/Loading"));
const IndexHome = lazy(() => import("./apps/aim/home/pages/Home"));
const Navigation = lazy(() => import("./apps/navigation/pages/Navigation"));
const CostingItemList = lazy(() =>
  import("./apps/aim/costing/itemList/pages/indexItemList")
);
const IndexSalesQouta = lazy(() =>
  import("./apps/aim/sales/salesQuota/pages/IndexSalesQuota")
);
const SalesTracker = lazy(() =>
  import("./apps/aim/sales/salesTracker/pages/IndexSalesTracker")
);

const SalesLeaderboard = lazy(() =>
  import("./apps/aim/sales/leaderboard/pages/IndexSalesLeaderboard")
);

const IndexSalesRankingPoints = lazy(() =>
  import("./apps/aim/sales/rankingPoints/pages/IndexSalesRankingPoints")
);

const IndexLogin = lazy(() => import("./apps/auth/login/pages/IndexLogin"));
const NoMatch = lazy(() => import("./apps/aim/home/pages/NoMatch"));
const NoAccess = lazy(() => import("./apps/aim/home/pages/NoAccess"));
const IndexSalesSummary = lazy(() =>
  import("./apps/aim/sales/salesSummary/pages/IndexSalesSummary")
);
const IndexSelectedSalesSummary = lazy(() =>
  import("./apps/aim/sales/salesSummary/pages/IndexSelectedSalesSummary")
);
const IndexOrganizationRights = lazy(() =>
  import(
    "./apps/aim/settings/accessrights/organizationrights/pages/IndexOrganizationRights"
  )
);
const IndexPageRights = lazy(() =>
  import("./apps/aim/settings/accessrights/pagerights/pages/IndexPageRights")
);
const IndexRefModules = lazy(() =>
  import("./apps/aim/settings/reference/pages/IndexRefModules")
);
const IndexRefComponents = lazy(() =>
  import("./apps/aim/settings/reference/pages/IndexRefComponents")
);
const IndexRefSubcomponents = lazy(() =>
  import("./apps/aim/settings/reference/pages/IndexRefSubcomponents")
);
const IndexChangePassword = lazy(() =>
  import(
    "./apps/aim/settings/accountsettings/changepassword/pages/IndexChangePassword"
  )
);
const IndexCustomerRights = lazy(() =>
  import(
    "./apps/aim/settings/accessrights/customerrights/pages/IndexCustomerRights"
  )
);
const IndexMyQuotationList = lazy(() =>
  import("./apps/aim/quotation/myquotationList/pages/IndexMyQuotationList")
);
const IndexRequestQuotation = lazy(() =>
  import("./apps/aim/quotation/requestquotation/pages/IndexRequestQuotation")
);
const IndexRefRequestTypes = lazy(() =>
  import("./apps/aim/settings/reference/pages/IndexRefRequestTypes")
);
const IndexRefUnitOfMeasurements = lazy(() =>
  import("./apps/aim/settings/reference/pages/IndexRefUnitOfMeasurements")
);
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
  const hasAccess = (module, component, subComponent) => {
    const moduleAccess = access.user_access_module_rights.some(
      (item) => item.description === module
    );
    const componentAccess = access.user_access_component_rights.some(
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
    const { module, component, subComponent } = routeInfo;
    return hasAccess(module, component, subComponent);
  };
  return (
    <div className="App">
      <Loader />
      <ThemeProvider theme={theme}>
        <Suspense fallback={<div>Loading</div>}>
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
                    exact
                    path="/Modules/Sales/SalesTracker"
                    element={
                      <PrivateRoute
                        accessChecker={getAccessChecker({
                          module: "Sales",
                          component: "Sales Tracker",
                          subComponent: null,
                        })}
                      >
                        <SalesTracker />
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
                </Route>
              )}

            <Route element={<NoMatch />} path="*" />
            <Route element={<NoAccess />} path="/invalid-access" />
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
          </Routes>
        </Suspense>
      </ThemeProvider>
    </div>
  );
}

export default App;
