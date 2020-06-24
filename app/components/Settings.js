import React, { useEffect, useState, useContext } from "react";
import DispatchContext from "../context/DispatchContext";
import StateContext from "../context/StateContext";
import Loader from "./Loader.svg";

function SideMenu(props) {
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
      <div className="user-actions">
        {appState.userAction == "Select walls" && !appState.toEndLoader ? "" : <h2>{appState.userAction}</h2>}
        {appState.userAction == "Select start point" ? (
          <p>
            Click anywhere on the grid to place <span className="node start"></span> starting node
          </p>
        ) : appState.userAction == "Select end point" ? (
          <p>
            Click anywhere on the grid to place <span className="node end"></span> end node
          </p>
        ) : appState.userAction == "Select walls" ? (
          !appState.toEndLoaded ? (
            <>
              <h2>Calculating</h2>
              <Loader />
              <p>Calculating heuristic distance to the end</p>
            </>
          ) : (
            <>
              <p>
                You can click and drag to draw <br />
                <span className="node wall"></span> walls
              </p>
              <div className="button" onClick={step}>
                Find the path!
              </div>
            </>
          )
        ) : appState.userAction == "Searching path" ? (
          <Loader />
        ) : appState.userAction == "Path found" ? (
          <div className="button" onClick={reloadBrowser}>
            Reload
          </div>
        ) : appState.userAction == "Path can't be found" ? (
          <div className="button" onClick={reloadBrowser}>
            Reload
          </div>
        ) : (
          ""
        )}
      </div>
      <div className="legend">
        <p>
          <span className="node start"></span> Start node
        </p>
        <p>
          <span className="node end"></span> End node
        </p>
        <p>
          <span className="node"></span> Empty field node
        </p>
        <p>
          <span className="node open"></span> Open node - possible next step
        </p>
        <p>
          <span className="node closed"></span> Closed node - where algorhitm already desided optimal path
        </p>
        <p>
          <span className="node wall"></span> Wall node - impassable node
        </p>
        <p>
          <span className="node path"></span> Path node
        </p>
      </div>
    </div>
  );
}

export default SideMenu;
