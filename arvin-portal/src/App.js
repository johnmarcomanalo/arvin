import { createTheme, ThemeProvider } from "@mui/material/styles";
import React, { lazy, Suspense } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import Cookies from "universal-cookie";
import "./App.css";
import configure from "./apps/configure/configure.json";
import PrivateRoute from "./security/PrivateRoute";
import Loader from "./components/loading/Loading";
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
    "./apps/aim/accessrights/organizationrights/pages/IndexOrganizationRights"
  )
);
const IndexPageRights = lazy(() =>
  import("./apps/aim/accessrights/pagerights/pages/IndexPageRights")
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
      (item) => item.module_code === module
    );
    const componentAccess = access.user_access_component_rights.some(
      (item) => item.component_code === component
    );
    const subComponentAccess = access.user_access_sub_component_rights.some(
      (item) => item.sub_component_code === subComponent
    );

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
                    element={<IndexSalesQouta />}
                  />
                  <Route
                    exact
                    path="/Modules/Sales/SalesTracker"
                    element={<SalesTracker />}
                  />
                  <Route
                    path="/Modules/Sales/SalesLeaderboard"
                    element={<SalesLeaderboard />}
                  />
                  <Route
                    path="/Modules/Sales/Configuration/RankingPoints"
                    element={<IndexSalesRankingPoints />}
                  />
                  <Route
                    path="/Modules/Sales/Reports/SalesSummary"
                    // element={<IndexSalesSummary />}
                    element={
                      <PrivateRoute
                        accessChecker={getAccessChecker({
                          module: "Sales",
                          component: "Reports",
                          subComponent: "SalesSummary",
                        })}
                      >
                        <IndexSalesSummary />
                      </PrivateRoute>
                    }
                  />
                  <Route
                    path="/Modules/Sales/Reports/SalesSummary/:id/:month/:year"
                    element={<IndexSelectedSalesSummary />}
                  />
                  <Route
                    path="/Modules/SystemSettings/AccessRights/OrganizationRights"
                    element={<IndexOrganizationRights />}
                  />
                  <Route
                    path="/Modules/SystemSettings/AccessRights/PageRights"
                    element={<IndexPageRights />}
                  />
                </Route>
              )}

            <Route element={<NoMatch />} path="*" />
            <Route element={<NoAccess />} path="/invalid-access" />
          </Routes>
        </Suspense>
      </ThemeProvider>
    </div>
  );
}

export default App;
