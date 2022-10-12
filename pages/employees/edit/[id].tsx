import { Box, Grid, Paper, TextField, Typography } from "@mui/material";
import { useRouter } from "next/router";

const Edit = () => {
  const router = useRouter();
  const { id } = router.query;

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
            <Grid item>
              <TextField label="Name" variant="standard" fullWidth />
            </Grid>
          </Paper>
        </Grid>
      </Grid>
    </>
  );
};

export default Edit;
