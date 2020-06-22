//libs
import React, { useState, useReducer, useEffect, Suspense } from "react";
import ReactDOM from "react-dom";
import { BrowserRouter, Switch, Route } from "react-router-dom";
import { useImmerReducer } from "use-immer";

//context
import StateContext from "./context/StateContext";
import DispatchContext from "./context/DispatchContext";

//components
import Header from "./components/Header";
import Map from "./components/Map";
import Footer from "./components/Footer";
import Settings from "./components/Settings";

function Main() {
  // reducer setup
  const initialState = {
    nodes: [],
    currentNode: {},
    endNode: {},
  };

  function Reducer(draft, action) {
    switch (action.type) {
      case "buildField":
        for (let i = 0; i < 50; i++) {
          draft.nodes.push([]);
          for (let j = 0; j < 50; j++) {
            draft.nodes[i].push({
              x: j,
              y: i,
              isStart: false,
              isEnd: false,
              isOpen: false,
              isClosed: false,
              parent: { x: -1, y: -1 },
              fromStart: 0,
              toEnd: 0,
              index: Infinity,
            });
          }
        }
        return;
      case "example":
        draft.nodes[10][10].isStart = "start";
        draft.nodes[45][37].isEnd = "end";
        draft.currentNode = draft.nodes[10][10];
        draft.endNode = draft.nodes[45][37];
        return;
    }
  }

  const [state, dispatch] = useImmerReducer(Reducer, initialState);

  useEffect(() => {
    dispatch({ type: "buildField" });
    dispatch({ type: "example" });
  }, []);

  // JSX
  return (
    <StateContext.Provider value={state}>
      <DispatchContext.Provider value={dispatch}>
        <BrowserRouter>
          <div className="container">
            <Header />
            <div className="container">
              <Map />
              <Settings />
            </div>
            <Footer />
          </div>
        </BrowserRouter>
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
