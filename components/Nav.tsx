import AppBar from "@mui/material/AppBar";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import Container from "@mui/material/Container";
import { useRouter } from "next/router";
import { trpc } from "../utils/trpc";
import MaterialImage from "./MaterialImage";

const Nav = () => {
  const router = useRouter();
  const { data, isLoading, refetch } = trpc.user.isAuthenticated.useQuery();

  const { mutate } = trpc.user.signOut.useMutation({
    onSuccess: () => {
      refetch();
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
            {!isLoading && (
              <Grid container spacing={2}>
                {data?.isAuthenticated && (
                  <Grid item>
                    <Button
                      variant="contained"
                      onClick={() => router.push("/dashboard")}
                    >
                      Dashboard
                    </Button>
                  </Grid>
                )}
                {data?.isAuthenticated && (
                  <Grid item>
                    <Button variant="contained" onClick={handleSignOut}>
                      Sign Out
                    </Button>
                  </Grid>
                )}
                {!data?.isAuthenticated && router?.asPath !== "/login" && (
                  <Grid item>
                    <Button
                      variant="contained"
                      onClick={(e) => router.push("/login")}
                    >
                      Login
                    </Button>
                  </Grid>
                )}
                {router?.asPath === "/login" && (
                  <Grid item>
                    <Button
                      variant="contained"
                      onClick={(e) => router.push("/")}
                    >
                      Sign up
                    </Button>
                  </Grid>
                )}
              </Grid>
            )}
          </Grid>
        </Grid>
      </Container>
    </AppBar>
  );
};

export default Nav;
