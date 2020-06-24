import React, { useEffect, useContext, useState } from "react";
import StateContext from "../context/StateContext";
import DispatchContext from "../context/DispatchContext";

function Map(props) {
  const appState = useContext(StateContext);
  const appDispatch = useContext(DispatchContext);
  const [mouseIsDown, setMouse] = useState(false);

  function mouseDown() {
    setMouse(true);
  }

  function mouseUp() {
    setMouse(false);
  }

  function nodeClick(e) {
    const x = e.target.getAttribute("data-x");
    const y = e.target.getAttribute("data-y");
    if (appState.userAction == "Select start point") {
      appDispatch({ type: "selectStart", x: x, y: y });
    }
    if (appState.userAction == "Select end point") {
      appDispatch({ type: "selectEnd", x: x, y: y });
    }
    if (appState.userAction == "Select walls" && appState.toEndLoaded) {
      appDispatch({ type: "selectWalls", x: x, y: y });
    }
  }

  function nodeDrag(e) {
    const x = e.target.getAttribute("data-x");
    const y = e.target.getAttribute("data-y");
    if (appState.userAction == "Select walls" && mouseIsDown) {
      appDispatch({ type: "selectWalls", x: x, y: y });
    }
  }

  return (
    <div className="map" onMouseDown={mouseDown} onMouseUp={mouseUp}>
      {appState.nodes.map((row) => {
        return row.map((node) => {
          return (
            <div
              key={node.x + "_" + node.y}
              className={`node ${
                node.isStart
                  ? "start"
                  : node.isEnd
                  ? "end"
                  : node.isWall
                  ? "wall"
                  : node.isPath
                  ? "path"
                  : node.isClosed
                  ? "closed"
                  : node.isOpen
                  ? "open"
                  : ""
              }`}
              data-x={node.x}
              data-y={node.y}
              onClick={nodeClick}
              onMouseEnter={nodeDrag}
            ></div>
          );
        });
      })}
    </div>
  );
}

export default Map;
