//libs
import React, { useEffect } from "react";
import ReactDOM from "react-dom";
import { BrowserRouter } from "react-router-dom";
import { useImmerReducer } from "use-immer";

//context
import StateContext from "./context/StateContext";
import DispatchContext from "./context/DispatchContext";

//components
import Header from "./components/Header";
import Map from "./components/Map";
import SideMenu from "./components/Settings";

function Main() {
  // reducer setup
  const initialState = {
    nodes: [],
    currentNode: {},
    startNode: {},
    endNode: {},
    mapLoaded: false,
    exampleLoaded: false,
    stepCount: 0,
    userAction: "Select start point",
    mouse: false,
  };

  function Reducer(draft, action) {
    switch (action.type) {
      case "buildMap":
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
              isWall: false,
              isPath: false,
              parent: { x: -1, y: -1 },
              fromStart: 0,
              toEnd: 0,
              index: Infinity,
            });
          }
        }
        draft.mapLoaded = true;
        return;
      case "selectStart":
        draft.nodes[action.y][action.x].isStart = true;
        draft.startNode = draft.nodes[action.y][action.x];
        draft.userAction = "Select end point";
        return;
      case "selectEnd":
        draft.nodes[action.y][action.x].isEnd = true;
        draft.endNode = draft.nodes[action.y][action.x];
        draft.userAction = "Select walls";
        return;
      case "selectWalls":
        if (!draft.nodes[action.y][action.x].isWall) {
          draft.nodes[action.y][action.x].isWall = true;
        } else {
          draft.nodes[action.y][action.x].isWall = false;
        }
        return;
      case "pathFound":
        draft.userAction = "Path found";
        return;
      case "stuck":
        draft.userAction = "Path can't be found";
        return;
      case "example":
        draft.nodes[action.startY][action.startX].isStart = true;
        draft.nodes[action.endY][action.endX].isEnd = true;
        draft.startNode = draft.nodes[action.startY][action.startX];
        draft.endNode = draft.nodes[action.endY][action.endX];
        draft.exampleLoaded = true;
        return;
      case "step":
        draft.stepCount++;
        draft.userAction = "Searching path";
        return;
      case "setToOpen":
        draft.nodes[action.y][action.x].isOpen = true;
        draft.nodes[action.y][action.x].parent.x = action.parentX;
        draft.nodes[action.y][action.x].parent.y = action.parentY;
        draft.nodes[action.y][action.x].fromStart = action.fromStart;
        draft.nodes[action.y][action.x].toEnd = action.toEnd;
        draft.nodes[action.y][action.x].index = action.fromStart + action.toEnd;
        return;
      case "toEndDistance":
        return;
      case "setToClosed":
        draft.nodes[action.y][action.x].isOpen = false;
        draft.nodes[action.y][action.x].isClosed = true;
        return;
      case "setToPath":
        draft.nodes[action.y][action.x].isClosed = false;
        draft.nodes[action.y][action.x].isPath = true;
        return;
      case "mouseDown":
        draft.mouse = true;
        return;
      case "mouseUp":
        draft.mouse = false;
        return;
    }
  }

  const [state, dispatch] = useImmerReducer(Reducer, initialState);

  //on load build map
  useEffect(() => {
    dispatch({ type: "buildMap" });
  }, []);

  useEffect(() => {
    if (state.userAction == "Select walls") {
      setToOpen(state.startNode.x, state.startNode.y, -1, -1, 0);
    }
  }, [state.userAction]);

  // actual pathfinding
  useEffect(() => {
    if (state.userAction == "Searching path") {
      step();
    }
  }, [state.stepCount]);

  function step() {
    // make array of open nodes with smallest index
    let minIndex = Infinity;
    let minToEnd = Infinity;
    let foundMinIndexNodes = [];
    let currentX;
    let currentY;

    for (let i = 0; i < 50; i++) {
      for (let j = 0; j < 50; j++) {
        if (state.nodes[j][i].isOpen && state.nodes[j][i].index <= minIndex) {
          foundMinIndexNodes.push(state.nodes[j][i]);
        }
      }
    }

    if (foundMinIndexNodes.length == 0) {
      dispatch({ type: "stuck" });
      return;
    }

    // find node with smallest distance to the end in that array
    foundMinIndexNodes.forEach((node) => {
      if (node.toEnd < minToEnd) {
        minToEnd = node.toEnd;
        currentX = node.x;
        currentY = node.y;
      }
    });

    // set the current node to closed
    dispatch({ type: "setToClosed", x: currentX, y: currentY });
    const currentNode = state.nodes[currentY][currentX];

    // if current one is the end, draw the path
    if (currentX == state.endNode.x && currentY == state.endNode.y) {
      drawPath(currentNode.parent.x, currentNode.parent.y);
      return;
    }

    // go through neighbours of the current

    for (let i = -1; i < 2; i++) {
      for (let j = -1; j < 2; j++) {
        if (currentY + j >= 0 && currentX + i >= 0 && currentY + j < 50 && currentX + i < 50) {
          const neighbourNode = state.nodes[currentY + j][currentX + i];
          let newFromStart;
          if ((j + i) % 2 == 0) {
            newFromStart = currentNode.fromStart + 141;
          } else {
            newFromStart = currentNode.fromStart + 100;
          }
          if (
            !(j == 0 && i == 0) &&
            !neighbourNode.isClosed &&
            !neighbourNode.isWall &&
            (!neighbourNode.isOpen || neighbourNode.fromStart > newFromStart)
          ) {
            setToOpen(neighbourNode.x, neighbourNode.y, currentNode.x, currentNode.y, newFromStart);
          }
        }
      }
    }
    dispatch({ type: "step" });
  }

  function setToOpen(x, y, parentX, parentY, fromStart) {
    const xDiff = Math.abs(x - state.endNode.x);
    const yDiff = Math.abs(y - state.endNode.y);
    let toEnd = 0;
    if (xDiff > yDiff) {
      toEnd = xDiff * 100 + yDiff * 41;
    } else {
      toEnd = yDiff * 100 + xDiff * 41;
    }
    dispatch({
      type: "setToOpen",
      x: x,
      y: y,
      parentX: parentX,
      parentY: parentY,
      fromStart: fromStart,
      toEnd: toEnd,
    });
  }

  function drawPath(x, y) {
    if (x == state.startNode.x && y == state.startNode.y) {
      dispatch({ type: "pathFound" });
      return;
    }
    dispatch({ type: "setToPath", x: x, y: y });
    drawPath(state.nodes[y][x].parent.x, state.nodes[y][x].parent.y);
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
              <SideMenu />
            </div>
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
