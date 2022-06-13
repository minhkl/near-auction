import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import { initContract } from "./utils";
import { BrowserRouter } from "react-router-dom";
import { ThemeProvider, CssBaseline } from "@mui/material";

window.nearInitPromise = initContract()
  .then(() => {
    ReactDOM.render(
      <BrowserRouter>
        <CssBaseline />
        <App />
      </BrowserRouter>,
      document.querySelector("#root")
    );
  })
  .catch(console.error);
