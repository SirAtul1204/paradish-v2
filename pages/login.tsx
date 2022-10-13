import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import { useRouter } from "next/router";
import { FormEvent, useState } from "react";
import Spinner from "../components/Spinner";
import { trpc } from "../utils/trpc";
import { useDispatch } from "react-redux";
import { openAlert } from "../redux/alertReducer";
const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const router = useRouter();
  const dispatch = useDispatch();
  const utils = trpc.useContext();
  const { mutate, isLoading, isSuccess } = trpc.user.login.useMutation({
    onSuccess: () => {
      utils.user.isAuthenticated.invalidate();
      router.push("/dashboard");
    },
    onError: (err) => {
      dispatch(openAlert({ message: err.message, type: "error" }));
    },
  });

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    mutate({ email, password });
  };

  if (isLoading || isSuccess) return <Spinner loadingText="Logging you in!" />;

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        position: "absolute",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        width: "30%",
      }}
    >
      <Grid
        container
        justifyContent="center"
        alignItems="stretch"
        direction="column"
        spacing={3}
        // lg={4}
      >
        <Grid item alignSelf="center">
          <Typography variant="h6" color="secondary">
            Enter your credentials to Log in!
          </Typography>
        </Grid>
        <Grid item>
          <Paper elevation={3} sx={{ padding: 3 }}>
            <form onSubmit={handleSubmit}>
              <Grid container direction="column" spacing={2}>
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
                    Login
                  </Button>
                </Grid>
              </Grid>
            </form>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Login;
