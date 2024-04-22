import React, { lazy, Suspense } from "react";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";
import Loader from "./components/loading/Loading";

const IndexHome = lazy(() => import("./apps/aim/home/pages/IndexHome"));
const Navigation = lazy(() => import("./apps/navigation/pages/Navigation"));
const CostingItemList = lazy(() =>
  import("./apps/aim/costing/itemList/pages/indexItemList")
);
const IndexAnnualQuotation = lazy(() =>
  import("./apps/aim/quotation/annualQuotation/pages/IndexAnnualQuota")
);
const IndexDailyQuota = lazy(() =>
  import("./apps/aim/quotation/dailyQuota/pages/IndexDailyQuota")
);
const theme = createTheme({
  typography: {
    fontFamily: "Lexend Deca, Helvetica, Arial, sans-serif",
  },
});

function App() {
  return (
    <div className="App">
      <Loader />
      <ThemeProvider theme={theme}>
        <Suspense fallback={<div>Loading</div>}>
          <Routes>
            <Route path="/" element={<Navigation />}>
              <Route path="/" element={<IndexHome />} />
              <Route
                path="/Modules/Costing/itemlist"
                element={<CostingItemList />}
              />
              <Route
                path="/Modules/Quotation/AnnualQuotation"
                element={<IndexAnnualQuotation />}
              />
              <Route
                path="/Modules/Quotation/DailyQuota"
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
