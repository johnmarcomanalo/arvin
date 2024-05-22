import React, { lazy, Suspense } from "react";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";
import Loader from "./components/loading/Loading";
import Cookies from "universal-cookie";
import configure from "./apps/configure/configure.json";
const IndexHome = lazy(() => import("./apps/aim/home/pages/IndexHome"));
const Navigation = lazy(() => import("./apps/navigation/pages/Navigation"));
const CostingItemList = lazy(() =>
  import("./apps/aim/costing/itemList/pages/indexItemList")
);
const IndexAnnualQuotation = lazy(() =>
  import(
    "./apps/aim/salesdailyout/annualSettingSale/pages/IndexAnnualSettingSale"
  )
);
const IndexSalesDailyOut = lazy(() =>
  import("./apps/aim/salesdailyout/salesDailyOut/pages/IndexSalesDailyOut")
);

const IndexAnnualSalesRanking = lazy(() =>
  import(
    "./apps/aim/salesdailyout/annualSalesRanking/pages/IndexAnnualSalesRanking"
  )
);

const IndexAnnualSettingSalesRanking = lazy(() =>
  import(
    "./apps/aim/salesdailyout/annualSettingSalesRanking/pages/IndexAnnualSettingSalesRanking"
  )
);

const IndexLogin = lazy(() => import("./apps/auth/login/pages/IndexLogin"));
const NoMatch = lazy(() => import("./apps/aim/home/pages/NoMatch"));
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
const token = cookies.get("jwt_authorization");
function App() {
  return (
    <div className="App">
      <Loader />
      <ThemeProvider theme={theme}>
        <Suspense fallback={<div>Loading</div>}>
          <Routes>
            <Route path="/login" element={<IndexLogin />} />
            <Route path="/" element={<Navigation />}>
              <Route path="/" element={<IndexHome />} />
              <Route
                path="/Modules/Costing/itemlist"
                element={<CostingItemList />}
              />
              <Route
                path="/Modules/SalesDailyOut/AnnualSettingSale"
                element={<IndexAnnualQuotation />}
              />
              <Route
                path="/Modules/SalesDailyOut/DailySales"
                element={<IndexSalesDailyOut />}
              />
              <Route
                path="/Modules/SalesDailyOut/AnnualSalesRanking"
                element={<IndexAnnualSalesRanking />}
              />
              <Route
                path="/Modules/SalesDailyOut/AnnualSettingSalesRanking"
                element={<IndexAnnualSettingSalesRanking />}
              />
            </Route>
            <Route element={<NoMatch />} path="*" />
          </Routes>
        </Suspense>
      </ThemeProvider>
    </div>
  );
}

export default App;
