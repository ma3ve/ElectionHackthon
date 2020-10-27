import React, { useState, useContext } from "react";
import Avatar from "@material-ui/core/Avatar";
import Button from "@material-ui/core/Button";
import CssBaseline from "@material-ui/core/CssBaseline";
import TextField from "@material-ui/core/TextField";
import Link from "@material-ui/core/Link";
import Grid from "@material-ui/core/Grid";
import LockOutlinedIcon from "@material-ui/icons/LockOutlined";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";
import { EthContext } from "../App";
import CircularProgress from "@material-ui/core/CircularProgress";
import axios from "axios";
import { green } from "@material-ui/core/colors";
import Snackbar from "@material-ui/core/Snackbar";
import MuiAlert from "@material-ui/lab/Alert";
import Cookies from "js-cookie";
function Alert(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

const useStyles = makeStyles((theme) => ({
  paper: {
    marginTop: theme.spacing(8),
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: "100%", // Fix IE 11 issue.
    marginTop: theme.spacing(3),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
  buttonProgress: {
    color: green[500],
    position: "absolute",
    top: "50%",
    left: "50%",
    marginTop: -12,
    marginLeft: -12,
  },
}));

export default function Login(props) {
  const ethState = useContext(EthContext);
  const classes = useStyles();
  const [isLogin, setIsLogin] = useState(false);
  const [error, setError] = useState("");
  const [authInfo, setAuthInfo] = useState({
    first_name: "",
    last_name: "",
    password: "",
    username: ethState.accounts[0],
  });
  const [loading, setLoading] = useState(false);
  const handleFormSubmit = (e) => {
    setLoading(true);
    e.preventDefault();
    axios({
      method: "POST",
      url: `auth/${isLogin ? "login" : "register"}/`,
      data: authInfo,
    })
      .then((res) => {
        Cookies.set("token", res.data.access);
        ethState.dispatch({
          type: "setToken",
          token: res.data.access,
        });
      })
      .catch((e) => {
        const { data } = e.response;
        let error = "";
        if (data) {
          if (typeof data == "String") {
            error = data;
          } else if (typeof data == "Object") {
            for (let key in data) {
              error += key + " : " + data[key][0] + "\n";
            }
          } else {
            error = "something went wrong! Please try again later";
          }
        } else {
          error = "something went wrong! Please try again later";
        }
        setError(error);
      })
      .finally(() => {
        setLoading(false);
      });
  };
  const handleChange = (e) => {
    authInfo[e.target.name] = e.target.value;
    setAuthInfo({ ...authInfo });
  };

  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <div className={classes.paper}>
        <Avatar className={classes.avatar}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          {isLogin ? "Login" : "Register"}
        </Typography>
        <form className={classes.form} onSubmit={handleFormSubmit}>
          <Grid container spacing={2}>
            {!isLogin ? (
              <>
                <Grid item xs={12} sm={6}>
                  <TextField
                    autoComplete="fname"
                    name="first_name"
                    variant="outlined"
                    required
                    fullWidth
                    id="firstName"
                    label="First Name"
                    autoFocus={!isLogin}
                    onChange={handleChange}
                    disabled={loading}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    variant="outlined"
                    required
                    fullWidth
                    id="lastName"
                    label="Last Name"
                    name="last_name"
                    autoComplete="lname"
                    onChange={handleChange}
                    disabled={loading}
                  />
                </Grid>
              </>
            ) : null}
            <Grid item xs={12}>
              <TextField
                variant="outlined"
                required
                fullWidth
                name="username"
                label="Eth Address"
                type="text"
                id="email"
                disabled={true}
                value={authInfo.username}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                variant="outlined"
                required
                fullWidth
                name="password"
                label="Password"
                type="password"
                id="password"
                autoComplete="current-password"
                onChange={handleChange}
                disabled={loading}
              />
            </Grid>
          </Grid>
          <Button
            variant="contained"
            color="primary"
            disabled={loading}
            className={classes.submit}
            type="submit"
            fullWidth
          >
            {isLogin ? "Login" : "Register"}
          </Button>
          {loading && (
            <CircularProgress
              size={50}
              className={classes.buttonProgress}
            />
          )}

          <Grid container justify="flex-end">
            <Grid item>
              <Link
                variant="body2"
                onClick={(e) => {
                  e.preventDefault();
                  setIsLogin(!isLogin);
                }}
                disabled={loading}
              >
                {isLogin
                  ? "New here? Register"
                  : "Already have an account? Login"}
              </Link>
            </Grid>
          </Grid>
        </form>
      </div>
      <Snackbar
        open={Boolean(error)}
        autoHideDuration={6000}
        onClose={() => {
          setError("");
        }}
      >
        <Alert
          onClose={() => {
            setError("");
          }}
          severity="error"
        >
          {error}
        </Alert>
      </Snackbar>
    </Container>
  );
}
