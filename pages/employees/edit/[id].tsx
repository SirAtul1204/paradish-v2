import {
  Box,
  Button,
  Grid,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers";
import { Role } from "@prisma/client";
import axios from "axios";
import { DateTime } from "luxon";
import { useRouter } from "next/router";
import { FormEvent, useState } from "react";
import { useDispatch } from "react-redux";
import Spinner from "../../../components/Spinner";
import { openAlert } from "../../../redux/alertReducer";
import { trpc } from "../../../utils/trpc";

const Edit = () => {
  const router = useRouter();
  const { id } = router.query;

  const [name, setName] = useState("");
  const [role, setRole] = useState<Role | null>(null);
  const [address, setAddress] = useState("");
  const [aadharNumber, setAadharNumber] = useState(0);
  const [panNumber, setPanNumber] = useState("");
  const [photo, setPhoto] = useState<File>();
  const [phone, setPhone] = useState(0);
  const [dob, setDob] = useState<DateTime | null>(null);
  const [doj, setDoj] = useState<DateTime | null>(null);
  const [salary, setSalary] = useState(0);

  const dispatch = useDispatch();

  const { isLoading } = trpc.user.getById.useQuery(
    {
      id: id as string,
    },
    {
      onSuccess: (data) => {
        setName(data.name ?? "");
        setRole(data.role);
        setAddress(data.address ?? "");
        setAadharNumber(Number(data.aadharNumber) ?? 0);
        setPanNumber(data.panNumber ?? "");
        setPhone(Number(data.phone) ?? 0);
        setDob(DateTime.fromISO(data.dob ?? ""));
        setDoj(DateTime.fromISO(data.doj ?? ""));
        setSalary(data.salary ?? 0);
      },
      onError: (error) => {
        dispatch(
          openAlert({
            message: error.message,
            type: "error",
          })
        );
        router.push("/404");
      },
    }
  );

  const mutation = trpc.user.updateUser.useMutation({
    onSuccess: (data) => {
      if (data.signedUrl) {
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
            router.push("/employees");
          })
          .catch(function (error) {
            console.log(error);
          });
      } else {
        router.push("/employees");
      }
    },
    onError: (error) => {
      dispatch(
        openAlert({
          message: error.message,
          type: "error",
        })
      );
    },
  });

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (
      name &&
      role &&
      address &&
      aadharNumber &&
      panNumber &&
      phone &&
      dob &&
      doj &&
      salary
    ) {
      mutation.mutate({
        id: id as string,
        name,
        role,
        address,
        aadharNumber: String(aadharNumber),
        panNumber,
        phone: String(phone),
        dob: dob?.toISO(),
        doj: doj?.toISO(),
        salary,
        extension: String(photo?.type.split("/")[1]),
      });
    }
  };

  if (isLoading) return <Spinner loadingText="Fetching user details" />;

  if (mutation.isLoading || mutation.isSuccess)
    return <Spinner loadingText="Updating user details" />;

  return (
    <>
      <Typography variant="h5" color="secondary" textAlign="center">
        Edit Employee
      </Typography>
      <br />
      <br />
      <Grid container justifyContent="center" alignItems="center">
        <Grid
          item
          lg={6}
          container
          direction="column"
          spacing={3}
          justifyContent="center"
          alignItems="center"
        >
          <Paper elevation={3} sx={{ padding: 3, width: "100%" }}>
            <form onSubmit={handleSubmit}>
              <Grid container direction="column" spacing={3}>
                <Grid item>
                  <TextField
                    required
                    label="Name"
                    variant="standard"
                    fullWidth
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </Grid>
                <Grid item>
                  <InputLabel id="select-role">Role</InputLabel>
                  <Select
                    fullWidth
                    label="Role"
                    labelId="select-role"
                    value={role ?? ""}
                    onChange={(e) => setRole(e.target.value as Role)}
                  >
                    <MenuItem value={Role.OWNER}>{Role.OWNER}</MenuItem>
                    <MenuItem value={Role.MANAGER}>{Role.MANAGER}</MenuItem>
                    <MenuItem value={Role.CHEF}>{Role.CHEF}</MenuItem>
                    <MenuItem value={Role.WAITER}>{Role.WAITER}</MenuItem>
                  </Select>
                </Grid>
                <Grid item>
                  <TextField
                    required
                    label="Address"
                    variant="standard"
                    fullWidth
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                  />
                </Grid>
                <Grid item>
                  <TextField
                    required
                    label="Aadhar Number"
                    variant="standard"
                    fullWidth
                    type="number"
                    value={aadharNumber}
                    onChange={(e) => setAadharNumber(Number(e.target.value))}
                  />
                </Grid>
                <Grid item>
                  <TextField
                    required
                    label="PAN Number"
                    variant="standard"
                    fullWidth
                    value={panNumber}
                    onChange={(e) => setPanNumber(e.target.value)}
                  />
                </Grid>

                <Grid item>
                  <TextField
                    label="Photo"
                    variant="standard"
                    fullWidth
                    type="file"
                    inputProps={{ accept: "image/*" }}
                    onChange={(e) => {
                      // @ts-ignore
                      setPhoto(e.target.files?.[0]);
                    }}
                    helperText="Don't change if you don't want to update"
                  />
                </Grid>
                <Grid item>
                  <TextField
                    required
                    label="Phone"
                    variant="standard"
                    fullWidth
                    value={phone}
                    onChange={(e) => setPhone(Number(e.target.value))}
                  />
                </Grid>
                <Grid item>
                  <DatePicker
                    disableMaskedInput
                    inputFormat="dd/MM/yyyy"
                    value={dob}
                    onChange={(e) => {
                      setDob(e);
                    }}
                    label="Date of Birth"
                    renderInput={(params) => (
                      <TextField
                        required
                        fullWidth
                        {...params}
                        variant="standard"
                      />
                    )}
                  />
                </Grid>
                <Grid item>
                  <DatePicker
                    disableMaskedInput
                    inputFormat="dd/MM/yyyy"
                    value={doj}
                    onChange={(e) => {
                      setDoj(e);
                    }}
                    label="Date of Joining"
                    renderInput={(params) => (
                      <TextField
                        required
                        fullWidth
                        {...params}
                        variant="standard"
                      />
                    )}
                  />
                </Grid>
                <Grid item>
                  <TextField
                    required
                    label="Salary"
                    variant="standard"
                    fullWidth
                    type="number"
                    value={salary}
                    onChange={(e) => setSalary(Number(e.target.value))}
                  />
                </Grid>
                <Grid item alignSelf="flex-end">
                  <Button type="submit" variant="outlined">
                    Update
                  </Button>
                </Grid>
              </Grid>
            </form>
          </Paper>
        </Grid>
      </Grid>
    </>
  );
};

export default Edit;
