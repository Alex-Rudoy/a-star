import React, { useEffect, useContext } from "react";
import StateContext from "../context/StateContext";

function Map(props) {
  const appState = useContext(StateContext);

  console.log(appState);
  return (
    <div className="map">
      {appState.nodes.map((row) => {
        return row.map((node) => {
          return (
            <div
              className={`node ${
                node.isStart ? "start" : node.isEnd ? "end" : node.isClosed ? "closed" : node.isOpen ? "open" : ""
              }`}
              data-x={node.x}
              data-y={node.y}
            ></div>
          );
        });
      })}
    </div>
  );
}

export default Map;
