import { Button } from "@material-ui/core";
import React, { useState } from "react";
import CreateElection from "../components/CreateElection";
function Admin(props) {
  const [elections, setElections] = useState([]);

  if (!elections.length) {
    return (
      <>
        <h1>
          You dont have any election please create an election by clicking
          the create Election Button
        </h1>
        <CreateElection />
      </>
    );
  }

  return (
    <div>
      <h1></h1>
    </div>
  );
}

export default Admin;
