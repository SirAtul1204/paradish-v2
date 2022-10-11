import type { AppProps } from "next/app";
import { Box, CssBaseline, ThemeProvider } from "@mui/material";
import { theme } from "../themeOptions";
import { trpc } from "../utils/trpc";
import Nav from "../components/Nav";
import { Container } from "@mui/system";
import { Provider } from "react-redux";
import store from "../redux/store";
import MyAlert from "../components/MyAlert";
import { AdapterLuxon } from "@mui/x-date-pickers/AdapterLuxon";
import { LocalizationProvider } from "@mui/x-date-pickers";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Container>
          <Nav />
          <Box sx={{ paddingTop: 15 }}>
            <LocalizationProvider dateAdapter={AdapterLuxon}>
              <Component {...pageProps} />
            </LocalizationProvider>
          </Box>
        </Container>
        <MyAlert />
      </ThemeProvider>
    </Provider>
  );
}

export default trpc.withTRPC(MyApp);
