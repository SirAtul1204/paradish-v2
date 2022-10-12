import { AppBar, Button, Grid } from "@mui/material";
import { Container } from "@mui/system";
import { removeCookies } from "cookies-next";
import { useRouter } from "next/router";
import { trpc } from "../utils/trpc";
import MaterialImage from "./MaterialImage";

const Nav = () => {
  const router = useRouter();

  const { mutate } = trpc.user.signOut.useMutation({
    onSuccess: () => {
      router.push("/login");
    },
    onError: (error) => {
      console.log(error);
    },
  });

  const handleSignOut = () => {
    mutate();
  };

  return (
    <AppBar sx={{ paddingY: 2 }}>
      <Container>
        <Grid container justifyContent="space-between" alignItems="center">
          <Grid item>
            <MaterialImage
              src="/assets/Paradish-white.png"
              width={100}
              height={50}
              onClick={() => router.push("/")}
            />
          </Grid>
          <Grid item>
            <Grid container spacing={2}>
              <Grid item>
                <Button
                  variant="contained"
                  onClick={() => router.push("/dashboard")}
                >
                  Dashboard
                </Button>
              </Grid>
              <Grid item>
                <Button variant="contained" onClick={handleSignOut}>
                  Sign Out
                </Button>
              </Grid>
              <Grid item>
                <Button
                  variant="contained"
                  onClick={(e) => router.push("/login")}
                >
                  Login
                </Button>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Container>
    </AppBar>
  );
};

export default Nav;
