import type { AppProps } from "next/app";
import {
  Alert,
  Box,
  CssBaseline,
  GlobalStyles,
  ThemeProvider,
} from "@mui/material";
import { theme } from "../themeOptions";
import { trpc } from "../utils/trpc";
import Nav from "../components/Nav";
import { Container } from "@mui/system";
import { Provider, useSelector } from "react-redux";
import store, { RootState } from "../redux/store";
import MyAlert from "../components/MyAlert";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Container>
          <Nav />
          <Box sx={{ paddingTop: 15 }}>
            <Component {...pageProps} />
          </Box>
        </Container>
        <MyAlert />
      </ThemeProvider>
    </Provider>
  );
}

export default trpc.withTRPC(MyApp);
