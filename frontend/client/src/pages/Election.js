import React from "react";

function Election(props) {
  const {
    params: { electionAddress },
  } = props.match;
  return (
    <div>
      <h1>Election {electionAddress}</h1>
    </div>
  );
}

export default Election;
