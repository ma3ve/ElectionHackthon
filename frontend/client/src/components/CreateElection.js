import React, { useState, useContext } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Modal from "@material-ui/core/Modal";
import Backdrop from "@material-ui/core/Backdrop";
import Fade from "@material-ui/core/Fade";
import {
  Button,
  Divider,
  Grid,
  Paper,
  TextField,
  Typography,
} from "@material-ui/core";
import DateFnsUtils from "@date-io/date-fns";
import {
  MuiPickersUtilsProvider,
  KeyboardDateTimePicker,
} from "@material-ui/pickers";
import FactoryContract from "../contracts/Factory.json";
import { EthContext } from "../App";
import axios from "axios";
import FormData from "form-data";

const useStyles = makeStyles((theme) => ({
  modal: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
}));

export default function TransitionsModal() {
  const defaultFormValues = {
    name: "",
    description: "",
    start: null,
    end: null,
    address: null,
    image: null,
  };
  const ethState = useContext(EthContext);
  const classes = useStyles();
  const [open, setOpen] = React.useState(false);
  const [formValues, setFormValues] = useState(defaultFormValues);
  const { web3, accounts, token } = ethState;
  const handleChange = (e) => {
    formValues[e.target.name] = e.target.value;
    setFormValues({ ...formValues });
  };

  const convertToPydate = (date) => {
    return (
      date.getFullYear() +
      "-" +
      (date.getMonth() + 1) +
      "-" +
      date.getDate() +
      "T" +
      date.getHours() +
      ":" +
      date.getMinutes()
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const deployedNetwork =
        FactoryContract.networks[
          Object.keys(FactoryContract.networks)[
            Object.keys(FactoryContract.networks).length - 1
          ]
        ];

      const factory = new web3.eth.Contract(
        FactoryContract.abi,
        deployedNetwork.address
      );
      let res = await factory.methods.createElection().send({
        from: accounts[0],
      });

      let electionAddress = res.events.GetELectionAddress.returnValues[0];
      formValues.address = electionAddress;
      var formData = new FormData();
      for (let key in formValues) {
        if (!formValues[key]) continue;
        formData.append(key, formValues[key]);
      }
      formData.set("start", convertToPydate(formValues.start));
      formData.set("end", convertToPydate(formValues.end));

      res = await axios({
        url: "/api/election/create/",
        method: "POST",
        data: formData,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div>
      <Button
        onClick={() => {
          setOpen(true);
        }}
      >
        create Election
      </Button>
      <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        className={classes.modal}
        open={open}
        onClose={() => {
          setOpen(false);
        }}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}
      >
        <MuiPickersUtilsProvider utils={DateFnsUtils}>
          <Fade in={open}>
            <Paper style={{ padding: "10px", width: "60vw" }}>
              <form onSubmit={handleSubmit}>
                <Grid container spacing={2}>
                  <Typography variant="h5">Election Creation</Typography>
                  <Grid item xs={12}>
                    <TextField
                      label="Name"
                      variant="outlined"
                      fullWidth
                      value={formValues.name}
                      name="name"
                      onChange={handleChange}
                      required
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      label="description"
                      multiline
                      rows={4}
                      variant="outlined"
                      fullWidth
                      name="description"
                      value={formValues.description}
                      onChange={handleChange}
                      required
                    />
                  </Grid>

                  <Grid item md={4}>
                    <KeyboardDateTimePicker
                      variant="inline"
                      ampm={false}
                      label="Start"
                      value={formValues.start}
                      onChange={(value) => {
                        formValues.start = value;
                        setFormValues({ ...formValues });
                      }}
                      disablePast
                      inputVariant="outlined"
                      format="yyyy/MM/dd HH:mm"
                      style={{ marginRight: "10px" }}
                      required
                    />
                  </Grid>
                  <Grid item md={4}>
                    <KeyboardDateTimePicker
                      variant="inline"
                      ampm={false}
                      label="End"
                      value={formValues.end}
                      onChange={(value) => {
                        formValues.end = value;
                        setFormValues({ ...formValues });
                      }}
                      disablePast
                      inputVariant="outlined"
                      format="yyyy/MM/dd HH:mm"
                      required
                    />
                  </Grid>
                  <Grid item md={4}>
                    <input
                      accept="image/*"
                      className={classes.input}
                      id="contained-button-file"
                      multiple
                      type="file"
                      hidden={true}
                      onChange={(e) => {
                        console.log(e.target.files);
                        setFormValues({
                          ...formValues,
                          image: e.target.files[0],
                        });
                      }}
                    />
                    <label htmlFor="contained-button-file">
                      <Button
                        variant="contained"
                        color="secondary"
                        component="span"
                      >
                        Image
                      </Button>
                      <br />
                      <span>
                        {formValues.image ? formValues.image.name : ""}
                      </span>
                    </label>
                  </Grid>
                  <Grid xs={12} item>
                    <Button
                      type="submit"
                      color="primary"
                      variant="contained"
                      style={{ marginRight: "10px" }}
                    >
                      Create
                    </Button>
                    <Button
                      color="secondary"
                      variant="contained"
                      onClick={() => {
                        setFormValues(defaultFormValues);
                        setOpen(false);
                      }}
                    >
                      Discard
                    </Button>
                  </Grid>
                </Grid>
              </form>
            </Paper>
          </Fade>
        </MuiPickersUtilsProvider>
      </Modal>
    </div>
  );
}
