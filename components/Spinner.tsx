import { Box, Grid, Typography } from "@mui/material";
import { FC } from "react";
import { HashLoader } from "react-spinners";

const Spinner: FC<{ loadingText?: string }> = ({ loadingText }) => {
  return (
    <Box
      sx={{
        width: "100vw",
        height: "100vh",
        position: "absolute",
        top: 0,
        left: 0,
      }}
    >
      <Grid
        container
        justifyContent="center"
        alignItems="center"
        direction="column"
        sx={{ height: "100%" }}
      >
        <Grid item>
          <HashLoader color="#f87474" />
        </Grid>
        {loadingText && (
          <Grid item>
            <Typography variant="h5">{loadingText}</Typography>
          </Grid>
        )}
      </Grid>
    </Box>
  );
};

export default Spinner;
