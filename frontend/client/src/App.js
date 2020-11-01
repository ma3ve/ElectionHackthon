import React, { useEffect, useReducer, useState } from "react";
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
import Navbar from "./components/Navbar";
import { MuiPickersUtilsProvider } from "@material-ui/pickers";
import MomentUtils from "@date-io/moment";
export const EthContext = React.createContext();

const reducer = (ethState, action) => {
  switch (action.type) {
    case "setEthState":
      return action.ethState;
    case "setToken":
      console.log(ethState);
      return { token: action.token, ...ethState };
    default:
      return ethState;
  }
};

function App(props) {
  const [ethState, dispatch] = useReducer(reducer, {
    web3: null,
    accounts: null,
    networkId: null,
    token: null,
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const web3 = await getWeb3();

        const accounts = await web3.eth.getAccounts();

        const networkId = await web3.eth.net.getId();

        // const deployedNetwork =
        //   FactoryContract.networks[
        //     Object.keys(FactoryContract.networks)[
        //       Object.keys(FactoryContract.networks).length - 1
        //     ]
        //   ];

        // const factory = new web3.eth.Contract(
        //   FactoryContract.abi,
        //   deployedNetwork.address
        // );
        // const res = await factory.methods.createElection().send({
        //   from: accounts[0],
        // });
        // let electionAddress =
        //   res.events.GetELectionAddress.returnValues[0];

        // const election = new web3.eth.Contract(
        //   ElectionContract.abi,
        //   electionAddress
        // );
        // console.log(await election.methods.admin().call());
        dispatch({
          type: "setEthState",
          ethState: { web3, accounts, networkId },
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
          console.log("token", token);
          const res = await axios({
            method: "GET",
            url: "/auth/verify/",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          if (res.data.success) {
            dispatch({ type: "setToken", token });
          }
        } else {
          props.history.push("/login");
        }
      } catch (error) {
        Cookies.remove("token");
      }
      setLoading(false);
    })();
  }, []);

  if (!ethState.web3 || loading) {
    return <div>Loading Web3, accounts, and contract...</div>;
  }
  return (
    <MuiPickersUtilsProvider utils={MomentUtils}>
      <EthContext.Provider value={{ ...ethState, dispatch }}>
        <Router>
          <Route component={Navbar} />
          <Switch>
            <ProtectedRoute
              component={Admin}
              path="/admin"
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
    </MuiPickersUtilsProvider>
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
