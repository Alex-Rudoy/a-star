import React, { useEffect, useState, useContext } from "react";
import DispatchContext from "../context/DispatchContext";
import StateContext from "../context/StateContext";

function Settings(props) {
  const appDispatch = useContext(DispatchContext);
  const appState = useContext(StateContext);

  function step(e) {
    appDispatch({ type: "step" });
  }

  function reloadBrowser() {
    location.reload();
  }

  return (
    <div className="settings">
      <h2>{appState.userAction}</h2>
      {appState.userAction == "Select start point" ? (
        <p>
          Click anywhere on the grid to place <div className="node start"></div> starting point
        </p>
      ) : appState.userAction == "Select end point" ? (
        <p>
          Click anywhere on the grid to place <div className="node end"></div> end point
        </p>
      ) : appState.userAction == "Select walls" ? (
        <>
          <p>
            You can click and drag to draw <br />
            <div className="node wall"></div> walls
          </p>
          <div className="button" onClick={step}>
            Find the path!
          </div>
        </>
      ) : appState.userAction == "Path found" ? (
        <div className="button" onClick={reloadBrowser}>
          Reload
        </div>
      ) : (
        ""
      )}
    </div>
  );
}

export default Settings;
