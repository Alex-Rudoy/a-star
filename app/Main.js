//libs
import React, { useState, useReducer, useEffect, Suspense } from "react";
import ReactDOM from "react-dom";
import { BrowserRouter, Switch, Route } from "react-router-dom";
import { useImmerReducer } from "use-immer";

//context
import StateContext from "./context/StateContext";
import DispatchContext from "./context/DispatchContext";

//components

function Main() {
  // JSX

  return (
    <StateContext.Provider value={state}>
      <DispatchContext.Provider value={dispatch}>
        <BrowserRouter></BrowserRouter>
      </DispatchContext.Provider>
    </StateContext.Provider>
  );
}

//render
ReactDOM.render(<Main />, document.querySelector("#app"));

//webpack
if (module.hot) {
  module.hot.accept();
}
