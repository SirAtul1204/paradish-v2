import { ThemeOptions, Theme } from "@mui/material/styles";
import { createTheme } from "@mui/material";
import type {} from "@mui/x-date-pickers/themeAugmentation";

export const themeOptions: ThemeOptions = {
  palette: {
    mode: "dark",
    secondary: {
      main: "#3ab0ff",
      contrastText: "#000000",
    },
    primary: {
      main: "#f87474",
      contrastText: "#000000",
    },
    background: {
      default: "#161616",
    },
  },
  typography: {
    fontFamily: "Quicksand",
    fontWeightLight: 400,
    fontWeightRegular: 500,
    fontWeightMedium: 600,
    fontWeightBold: 800,
  },
};

export const theme = createTheme(themeOptions);
