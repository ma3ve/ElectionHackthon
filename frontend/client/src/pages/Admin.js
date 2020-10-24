import React from "react";

function Admin(props) {
  const {
    params: { adminAddress },
  } = props.match;
  return (
    <div>
      <h1>Admin Page : {adminAddress}</h1>
    </div>
  );
}

export default Admin;
