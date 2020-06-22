import React, { useEffect, useContext } from "react";
import StateContext from "../context/StateContext";
import Node from "./Node";

function Map(props) {
  const appState = useContext(StateContext);
  console.log(appState.endNode);
  return (
    <div className="map">
      {appState.nodes.map((row) => {
        return row.map((node) => {
          return <Node node={node} key={node.x + "_" + node.y}></Node>;
        });
      })}
    </div>
  );
}

export default Map;
