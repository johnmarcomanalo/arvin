import React, { lazy, Suspense } from "react";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";
import Loader from "./components/loading/Loading";
import Cookies from "universal-cookie";

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
const IndexDailyQuota = lazy(() =>
  import("./apps/aim/quotation/dailyQuota/pages/IndexDailyQuota")
);
const IndexLogin = lazy(() => import("./apps/auth/login/pages/IndexLogin"));
const theme = createTheme({
  typography: {
    fontFamily: "Lexend Deca, Helvetica, Arial, sans-serif",
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
            <Route path="/" element={<Navigation />}>
              <Route path="/" element={<IndexHome />} />
              <Route path="/login" element={<IndexLogin />} />
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
                element={<IndexDailyQuota />}
              />
            </Route>
          </Routes>
        </Suspense>
      </ThemeProvider>
    </div>
  );
}

export default App;
