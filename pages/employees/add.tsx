import {
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  TextField,
  Typography,
  Button,
} from "@mui/material";
import { Role } from "@prisma/client";
import { DatePicker } from "@mui/x-date-pickers";
import { FormEvent, useEffect, useState } from "react";
import { trpc } from "../../utils/trpc";
import { file2Base64 } from "../../utils/file2Base64";
import Spinner from "../../components/Spinner";
import { DateTime } from "luxon";
import axios from "axios";

const AddEmployees = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [aadharNumber, setAadharNumber] = useState("");
  const [panNumber, setPanNumber] = useState("");
  const [address, setAddress] = useState("");
  const [role, setRole] = useState<Role | null>(null);
  const [photo, setPhoto] = useState<File>();
  const [dob, setDob] = useState<DateTime | null>(null);
  const [doj, setDoj] = useState<DateTime | null>(null);
  const [salary, setSalary] = useState(0);

  const { mutate, isLoading } = trpc.user.create.useMutation({
    onSuccess: async (data) => {
      const config = {
        method: "put",
        url: data.signedUrl!,
        headers: {
          "Content-Type": `image/${photo?.type.split("/")[1]}`,
        },
        data: photo!,
      };

      axios(config)
        .then(function (response) {
          console.log(JSON.stringify(response.data));
        })
        .catch(function (error) {
          console.log(error);
        });
    },
    onError: (error) => {
      console.log(error);
    },
  });

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (
      name &&
      email &&
      phone &&
      aadharNumber &&
      panNumber &&
      address &&
      role &&
      photo &&
      dob &&
      doj &&
      salary
    ) {
      const inputs = {
        name,
        email,
        phone,
        aadharNumber,
        panNumber,
        address,
        role,
        extension: photo.type.split("/")[1],
        dob: dob.toISODate(),
        doj: doj.toISODate(),
        salary,
      };
      mutate(inputs);
    }
  };

  if (isLoading) return <Spinner loadingText="Adding Employee" />;

  return (
    <Grid
      container
      direction="column"
      spacing={2}
      justifyContent="flex-start"
      alignItems="center"
    >
      <Grid item>
        <Typography variant="h5" color="secondary">
          Add Employee
        </Typography>
      </Grid>
      <Grid item sx={{ width: 900 }}>
        <Paper elevation={3} sx={{ padding: 3 }}>
          <form onSubmit={handleSubmit}>
            <Grid
              container
              alignItems="flex-start"
              justifyContent="center"
              spacing={5}
            >
              <Grid item lg={6} container direction="column" spacing={3}>
                <Grid item>
                  <TextField
                    fullWidth
                    label="Name"
                    variant="standard"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </Grid>
                <Grid item>
                  <TextField
                    fullWidth
                    label="Email"
                    variant="standard"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </Grid>
                <Grid item>
                  <TextField
                    fullWidth
                    label="Phone"
                    variant="standard"
                    type="number"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    required
                  />
                </Grid>
                <Grid item>
                  <TextField
                    fullWidth
                    label="Aadhar Number"
                    variant="standard"
                    type="number"
                    value={aadharNumber}
                    onChange={(e) => setAadharNumber(e.target.value)}
                    required
                  />
                </Grid>
                <Grid item>
                  <FormControl fullWidth>
                    <InputLabel id="select-role">Role</InputLabel>
                    <Select
                      label="Role"
                      labelId="select-role"
                      value={role ?? ""}
                      onChange={(e) => setRole(e.target.value as Role)}
                      required
                    >
                      <MenuItem value={Role.OWNER}>{Role.OWNER}</MenuItem>
                      <MenuItem value={Role.MANAGER}>{Role.MANAGER}</MenuItem>
                      <MenuItem value={Role.CHEF}>{Role.CHEF}</MenuItem>
                      <MenuItem value={Role.WAITER}>{Role.WAITER}</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item>
                  <TextField
                    fullWidth
                    label="Salary"
                    variant="standard"
                    type="number"
                    required
                    value={salary === 0 ? "" : salary}
                    onChange={(e) => setSalary(Number(e.target.value))}
                    inputProps={{ min: 1 }}
                  />
                </Grid>
              </Grid>
              <Grid item lg={6} container direction="column" spacing={3}>
                <Grid item>
                  <DatePicker
                    mask="__.__.____"
                    value={dob}
                    onChange={(e) => {
                      setDob(e);
                    }}
                    label="Date of Birth"
                    renderInput={(params) => (
                      <TextField
                        fullWidth
                        {...params}
                        variant="standard"
                        required
                      />
                    )}
                  />
                </Grid>
                <Grid item>
                  <TextField
                    fullWidth
                    label="Pan Number"
                    variant="standard"
                    value={panNumber}
                    onChange={(e) => setPanNumber(e.target.value)}
                    required
                  />
                </Grid>
                <Grid item>
                  <TextField
                    fullWidth
                    label="Address"
                    variant="standard"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    required
                  />
                </Grid>
                <Grid item>
                  <TextField
                    fullWidth
                    label="Photo"
                    variant="standard"
                    type="file"
                    onChange={(e) => {
                      //@ts-ignore
                      setPhoto(e.target.files?.[0]);
                    }}
                    required
                  />
                </Grid>
                <Grid item>
                  <DatePicker
                    mask="__.__.____"
                    value={doj}
                    onChange={(e) => {
                      setDoj(e);
                    }}
                    label="Date of Joining"
                    renderInput={(params) => (
                      <TextField
                        fullWidth
                        {...params}
                        variant="standard"
                        required
                      />
                    )}
                  />
                </Grid>
              </Grid>
            </Grid>
            <Grid
              container
              sx={{ marginY: 2, width: "100%" }}
              justifyContent="flex-end"
            >
              <Grid item>
                <Button type="submit" variant="outlined">
                  Submit
                </Button>
              </Grid>
            </Grid>
          </form>
        </Paper>
      </Grid>
    </Grid>
  );
};

export default AddEmployees;
