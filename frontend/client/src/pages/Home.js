import React, { useContext } from "react";
import { EthContext } from "../App";
function Home() {
  const ethState = useContext(EthContext);
  console.log(ethState);
  return (
    <div>
      <h1>HomePage {ethState.accounts[0]}</h1>
    </div>
  );
}

export default Home;
