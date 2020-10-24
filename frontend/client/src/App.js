import React, { useEffect, useReducer } from "react";
import ElectionContract from "./contracts/Election.json";
import getWeb3 from "./getWeb3";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import Admin from "./pages/Admin";
import Election from "./pages/Election";
import Home from "./pages/Home";
import Login from "./pages/Login";
import NotFound from "./pages/NotFound";

export const EthContext = React.createContext();

const reducer = (ethState, action) => {
  switch (action.type) {
    case "setEthState":
      return action.ethState;
    default:
      return ethState;
  }
};

function App() {
  const [ethState, dispatch] = useReducer(reducer, {
    web3: null,
    accounts: null,
    contract: null,
    networkId: null,
  });

  useEffect(() => {
    (async () => {
      try {
        const web3 = await getWeb3();

        const accounts = await web3.eth.getAccounts();

        const networkId = await web3.eth.net.getId();

        const deployedNetwork =
          ElectionContract.networks[
            Object.keys(ElectionContract.networks)[
              Object.keys(ElectionContract.networks).length - 1
            ]
          ];

        const election = new web3.eth.Contract(
          ElectionContract.abi,
          deployedNetwork.address
        );

        dispatch({
          type: "setEthState",
          ethState: { web3, accounts, networkId, election },
        });
      } catch (error) {
        alert(
          `Failed to load web3, accounts, or contract. Check console for details.`
        );
        console.error(error);
      }
    })();
  }, []);

  if (!ethState.web3) {
    return <div>Loading Web3, accounts, and contract...</div>;
  }
  return (
    <EthContext.Provider value={{ ...ethState, dispatch }}>
      <Router>
        <Switch>
          <Route component={Admin} path="/admin/:adminAddress" exact />
          <Route
            component={Election}
            path="/election/:electionAddress"
            exact
          />
          <Route component={Login} path="/login" exact />
          <Route component={Home} path="/" exact />
          <Route component={NotFound} path="" exact />
        </Switch>
      </Router>
    </EthContext.Provider>
  );
}

export default App;
