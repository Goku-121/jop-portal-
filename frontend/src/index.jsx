import React from "react";
import ReactDOM from "react-dom/client";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import "bootstrap-icons/font/bootstrap-icons.css";
import "./index.css";

import App from "./App";

import { Provider } from "react-redux";
import { store } from "./store/store";
import "./css/JobList.css";
import "./css/Navbar.css"
import "./css/Home.css"; 
import "./css/Home.css";
 
const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  <Provider store={store}>
    <App />
  </Provider>
);
