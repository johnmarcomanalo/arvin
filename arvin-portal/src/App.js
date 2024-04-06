import logo from './logo.svg';
import { Suspense, useEffect, useState,Fragment } from "react";
import './App.css';
import { Route, Routes } from "react-router-dom";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import Loader from "./components/loading/Loading"
import NavigationAppWork from './apps/navigation/pages/NavigationAppWork';


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
            
            <Route path="/" element={<NavigationAppWork />}/>
         
          </Routes>
        </Suspense>
      </ThemeProvider>
    </div>
  );
}

export default App;
