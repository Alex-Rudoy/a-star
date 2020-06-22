import React, { useEffect, useState, useContext } from "react";
import DispatchContext from "../context/DispatchContext";

function Settings(props) {
  const appDispatch = useContext(DispatchContext);

  function run(e) {
    e.preventDefault();
    appDispatch({ type: "run" });
  }

  return (
    <div className="settings">
      <form onSubmit={run}>
        <button>Start</button>
      </form>
    </div>
  );
}

export default Settings;
