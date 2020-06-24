import React, { useEffect } from "react";

function Header(props) {
  return (
    <>
      <h1>This is my pet project showing the A* algorhitm</h1>
      <p>
        A* is a pathfinding algorhitm, you can read more at{" "}
        <a href="https://en.wikipedia.org/wiki/A*_search_algorithm">Wikipedia</a>. It is not ideal, and in some
        conditions can provide suboptimal path, but is considered more efficient than mapping all possible paths before
        selecting the optimal one.
      </p>
    </>
  );
}

export default Header;
