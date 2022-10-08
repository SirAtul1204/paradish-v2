import { AppBar, Button, Grid } from "@mui/material";
import { Container } from "@mui/system";
import MaterialImage from "./MaterialImage";

const Nav = () => {
  return (
    <AppBar sx={{ paddingY: 2 }}>
      <Container>
        <Grid container justifyContent="space-between" alignItems="center">
          <Grid item>
            <MaterialImage
              src="/assets/Paradish-white.png"
              width={100}
              height={50}
            />
          </Grid>
          <Grid item>
            <Button variant="contained">Dashboard</Button>
          </Grid>
        </Grid>
      </Container>
    </AppBar>
  );
};

export default Nav;
