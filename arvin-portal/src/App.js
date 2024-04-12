import { ThemeProvider, createTheme } from "@mui/material/styles";
import { Suspense } from "react";
import { Route, Routes } from "react-router-dom";
import "./App.css";
import IndexHome from "./apps/aim/home/pages/IndexHome";
import Navigation from "./apps/navigation/pages/Navigation";
import Loader from "./components/loading/Loading";
import CostingItemList from "./apps/aim/costing/itemList/pages/indexItemList";
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
              <Route path="/costing/itemlist" element={<CostingItemList />} />
            </Route>
          </Routes>
        </Suspense>
      </ThemeProvider>
    </div>
  );
}

export default App;
