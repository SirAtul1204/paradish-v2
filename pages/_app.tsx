import type { AppProps } from "next/app";
import { Box, CssBaseline, GlobalStyles, ThemeProvider } from "@mui/material";
import { theme } from "../themeOptions";
import { trpc } from "../utils/trpc";
import Nav from "../components/Nav";
import { Container } from "@mui/system";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Container>
        <Nav />
        <Box sx={{ paddingTop: 15 }}>
          <Component {...pageProps} />
        </Box>
      </Container>
    </ThemeProvider>
  );
}

export default trpc.withTRPC(MyApp);
