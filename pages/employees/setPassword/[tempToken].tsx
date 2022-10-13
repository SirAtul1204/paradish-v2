import { useRouter } from "next/router";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Paper from "@mui/material/Paper";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import { FormEvent, useState } from "react";
import { useDispatch } from "react-redux";
import { openAlert } from "../../../redux/alertReducer";
import { trpc } from "../../../utils/trpc";
import Spinner from "../../../components/Spinner";

const SetPassword = () => {
  const router = useRouter();
  const { tempToken } = router.query;

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const dispatch = useDispatch();

  const { mutate, isLoading, isSuccess } = trpc.user.updatePassword.useMutation(
    {
      onSuccess: () => {
        dispatch(
          openAlert({
            message: "Password updated successfully",
            type: "success",
          })
        );
        router.push("/login");
      },
    }
  );

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      dispatch(
        openAlert({
          message: "Passwords do not match",
          type: "error",
        })
      );
      return;
    }
    mutate({
      tempToken: tempToken as string,
      password,
    });
  };

  if (isLoading || isSuccess)
    return <Spinner loadingText="Setting password..." />;

  return (
    <Box
      sx={{
        position: "absolute",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        width: "40%",
      }}
    >
      <Typography variant="h5" color="secondary" textAlign="center">
        Set Password
      </Typography>
      <br />
      <form onSubmit={handleSubmit}>
        <Paper elevation={3} sx={{ padding: 3 }}>
          <Grid container spacing={2} direction="column">
            <Grid item>
              <TextField
                fullWidth
                type="password"
                label="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </Grid>
            <Grid item>
              <TextField
                fullWidth
                type="password"
                label="Confirm Password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </Grid>
            <Grid item alignSelf="flex-end">
              <Button type="submit" variant="outlined" color="error">
                Set Password
              </Button>
            </Grid>
          </Grid>
        </Paper>
      </form>
    </Box>
  );
};

export default SetPassword;
