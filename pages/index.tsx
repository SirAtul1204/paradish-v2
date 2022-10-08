import {
  Button,
  Grid,
  Input,
  TextField,
  Typography,
  Box,
  Paper,
} from "@mui/material";
import type { NextPage } from "next";
import { useRouter } from "next/router";
import { FormEvent, useState } from "react";
import MaterialImage from "../components/MaterialImage";
import Spinner from "../components/Spinner";
import { trpc } from "../utils/trpc";
import { useDispatch } from "react-redux";
import { openAlert } from "../redux/alertReducer";

const Home: NextPage = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const router = useRouter();
  const dispatch = useDispatch();

  const { isLoading, mutate, isSuccess } = trpc.restaurant.create.useMutation({
    onSuccess: () => {
      router.push("/login");
    },
    onError: (err) => {
      console.log(err);
      dispatch(openAlert({ message: err.message, type: "error" }));
    },
  });

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    mutate({
      name,
      email,
      password,
    });
  };

  if (isLoading || isSuccess)
    return <Spinner loadingText="Registering your restaurant" />;

  return (
    <>
      <Typography variant="h2" textAlign="center" color="secondary">
        Your one stop solution for all you Restaurant needs!
      </Typography>
      <br />
      <Typography textAlign="center" variant="h4">
        Just sign up and get started today
      </Typography>
      <Box sx={{ marginY: 5 }}>
        <Grid container justifyContent="space-between" alignItems="center">
          <Grid item lg={4}>
            <Paper elevation={5} sx={{ paddingX: 3, paddingY: 3 }}>
              <form onSubmit={handleSubmit}>
                <Grid container direction="column" spacing={2}>
                  <Grid item>
                    <TextField
                      fullWidth
                      label="Restaurant Name"
                      type="text"
                      variant="standard"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                    />
                  </Grid>
                  <Grid item>
                    <TextField
                      fullWidth
                      label="Email"
                      type="email"
                      variant="standard"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </Grid>
                  <Grid item>
                    <TextField
                      fullWidth
                      label="Password"
                      type="password"
                      variant="standard"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                  </Grid>
                  <Grid item alignSelf="flex-end">
                    <Button variant="outlined" type="submit">
                      Sign Up
                    </Button>
                  </Grid>
                </Grid>
              </form>
            </Paper>
          </Grid>
          <Grid item>
            <MaterialImage
              src="/assets/restaurant.webp"
              width={500}
              height={300}
            />
          </Grid>
        </Grid>
      </Box>
    </>
  );
};

export default Home;
