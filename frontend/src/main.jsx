import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import instance from "../env.js";

if(instance().APPLICATION_MODE == 'development') {
  ReactDOM.createRoot(document.getElementById("root")).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
}
else {
  ReactDOM.createRoot(document.getElementById("root")).render(
    // <React.StrictMode>
      <App />
    // </React.StrictMode>
  );
}
