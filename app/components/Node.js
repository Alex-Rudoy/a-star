import React, { useEffect } from "react";

function Node(props) {
  return (
    <div
      key={props.node.x + "_" + props.node.y}
      className={`node ${
        props.node.isStart
          ? "start"
          : props.node.isEnd
          ? "end"
          : props.node.isClosed
          ? "closed"
          : props.node.isOpen
          ? "open"
          : ""
      }`}
      data-x={props.node.x}
      data-y={props.node.y}
    >
      {props.node.toEnd}
    </div>
  );
}

export default Node;
