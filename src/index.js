import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom"; 
import {persistor, store } from "./_store";
import { persistStore } from 'redux-persist';
import { PersistGate } from 'redux-persist/integration/react'; 
import fakeBackend from "./_helpers/fake-backend";
fakeBackend(); 

const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  
  <Provider store={store}>
    <PersistGate loading={null} persistor={persistor}>
    <BrowserRouter>
      <App />
    </BrowserRouter>
    </PersistGate> 
  </Provider>
);
