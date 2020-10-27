import React, { useEffect, useReducer, useState } from "react";
import ElectionContract from "./contracts/Election.json";
import getWeb3 from "./getWeb3";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
} from "react-router-dom";
import Admin from "./pages/Admin";
import Election from "./pages/Election";
import Home from "./pages/Home";
import Login from "./pages/Login";
import NotFound from "./pages/NotFound";
import Cookies from "js-cookie";
import axios from "axios";

export const EthContext = React.createContext();

const reducer = (ethState, action) => {
  switch (action.type) {
    case "setEthState":
      return action.ethState;
    case "setToken":
      return { token: action.token, ...ethState };
    default:
      return ethState;
  }
};

function App(props) {
  const [ethState, dispatch] = useReducer(reducer, {
    web3: null,
    accounts: null,
    contract: null,
    networkId: null,
    token: null,
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

      try {
        const token = Cookies.get("token");
        if (token) {
          console.log(token);
          const res = await axios({
            method: "GET",
            url: "auth/verify/",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          if (res.data.success) {
            dispatch({ type: "setToken", token });
          }
        } else {
          console.log("haha");
          props.history.push("/login");
        }
      } catch (error) {
        Cookies.remove("token");
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
          <ProtectedRoute
            component={Admin}
            path="/admin/:adminAddress"
            isAuthenticated={ethState.token}
            exact
            redirectPath="/login"
          />
          <Route
            component={Election}
            path="/election/:electionAddress"
            exact
          />
          <ProtectedRoute
            component={Login}
            redirectPath="/"
            path="/login"
            exact
            isAuthenticated={!ethState.token}
          />
          <Route component={Home} path="/" exact />
          <Route component={NotFound} path="" exact />
        </Switch>
      </Router>
    </EthContext.Provider>
  );
}

export default App;

const ProtectedRoute = ({
  component: Component,
  isAuthenticated,
  redirectPath,
  ...rest
}) => {
  return (
    <Route
      {...rest}
      render={(props) => {
        if (isAuthenticated) {
          return <Component {...props} />;
        } else {
          return (
            <Redirect
              to={{
                pathname: redirectPath,
                state: {
                  from: props.location,
                },
              }}
            />
          );
        }
      }}
    />
  );
};
