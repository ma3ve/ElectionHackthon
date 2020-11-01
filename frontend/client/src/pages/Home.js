import React, { useContext, useEffect, useState } from "react";
import {
  Container,
  Grid,
  Typography,
  TextField,
  Button,
} from "@material-ui/core";
import { EthContext } from "../App";
import ElectionContract from "../contracts/Election.json";
function Home(props) {
  const ethState = useContext(EthContext);
  const { web3, accounts } = ethState;

  const [ethAddress, setEthAddress] = useState(
    "0x0000000000000000000000000000000000000000"
  );
  const [error, setError] = useState("");

  // ethState.election.methods.admin().call();
  let e;
  const findElection = async (e) => {
    e.preventDefault();
    if (ethState.length !== 42 || ethState[1] !== "x")
      setError("invalid unique id or address");
    try {
      const election = new web3.eth.Contract(
        ElectionContract.abi,
        ethAddress.toLowerCase().trim()
      );
      let res = await election.methods.admin().call();
    } catch (e) {}
  };
  return (
    <Container>
      <Grid
        container
        justify="center"
        alignItems="center"
        className="vertical-center"
        style={{ textAlign: "center" }}
        spacing={2}
      >
        <Grid item xs={12}>
          <Typography variant="h3" gutterBottom>
            Welcome to Election Portal
          </Typography>
        </Grid>
        <Grid item sm={8}>
          <Typography variant="h6" gutterBottom>
            A blockchain based election portal where you can vote for an
            election by providing unique id(blockchain address) of the
            election below
          </Typography>
        </Grid>
        <Grid item sm={8}>
          <form onSubmit={findElection}>
            <TextField
              variant="outlined"
              fullWidth
              placeholder="unique id(blockchain address) of election"
              onChange={(e) => {
                setEthAddress(e.target.value);
              }}
              required
            />
            <Button
              type="submit"
              style={{ marginTop: "10px" }}
              variant="contained"
              color="primary"
            >
              Find Election
            </Button>
          </form>
        </Grid>
        <Grid item sm={8}>
          <Button
            style={{ marginTop: "10px" }}
            variant="contained"
            color="primary"
            onClick={() => {
              props.history.push("admin/");
            }}
          >
            or host an election
          </Button>
        </Grid>
      </Grid>
    </Container>
  );
}

export default Home;
