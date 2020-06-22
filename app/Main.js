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
    runCount: 0,
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
              toEnd: 1,
              index: Infinity,
            });
          }
        }
        draft.isLoaded = true;
        return;
      case "example":
        draft.nodes[2][2].isStart = "start";
        draft.nodes[6][3].isEnd = "end";
        draft.currentNode = draft.nodes[2][2];
        draft.endNode = draft.nodes[6][3];
        return;
      case "run":
        draft.runCount++;
        return;
      case "toEndCalculation":
        draft.nodes[action.y][action.x].toEnd = action.value;
        return;
    }
  }

  const [state, dispatch] = useImmerReducer(Reducer, initialState);

  useEffect(() => {
    dispatch({ type: "buildField" });
    dispatch({ type: "example" });
  }, []);

  useEffect(() => {
    if (state.isLoaded) {
      aStar();
    }
  }, [state.runCount]);

  // A* function
  function toEndCalculation() {
    for (let i = 0; i < 50; i++) {
      for (let j = 0; j < 50; j++) {
        const xDiff = Math.abs(j - state.endNode.x);
        const yDiff = Math.abs(i - state.endNode.y);
        let value = 0;
        if (xDiff > yDiff) {
          value = xDiff * 100 + yDiff * 41;
        } else {
          value = yDiff * 100 + xDiff * 41;
        }
        dispatch({ type: "toEndCalculation", x: j, y: i, value: value });
      }
    }
  }

  function aStar() {
    toEndCalculation();
  }

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
