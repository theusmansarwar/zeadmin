import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import { AlertProvider } from "./Components/Alert/AlertContext";


const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  <BrowserRouter basename="/admin">
    <AlertProvider>
      <App />
    </AlertProvider>
  </BrowserRouter>
);
