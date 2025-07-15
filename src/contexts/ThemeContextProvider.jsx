import {
  ThemeProvider,
  createTheme,
  responsiveFontSizes,
} from "@mui/material/styles";

const SIDEBAR_COLOR = "#132353";

const theme = responsiveFontSizes(
  createTheme({
    palette: {
      primary: {
        main: "#4A57A9",
        light: "#7A8BE0",
        dark: "#182778",
        contrastText: "#fff",
      },
      secondary: {
        main: "#5A5D72",
        light: "#DFE1FA",
        dark: "#2C2F41",
        contrastText: "#fff",
      },
      success: {
        main: "#37A370",
        light: "#8FF7BD",
        dark: "#005231",
        contrastText: "#fff",
      },
      error: {
        main: "#d13932",
        light: "#FF897A",
        dark: "#930006",
        contrastText: "#fff",
      },
      headerWhite: {
        main: "#f7f7f7",
        light: "#fff",
        dark: "#ddd",
        contrastText: "#000",
      },
      orange: {
        main: "#ED980E",
        light: "#FFB95C",
        dark: "#A96900",
        contrastText: "#fff",
      },
      blue: {
        main: SIDEBAR_COLOR,
        light: "#4597D7",
        dark: "#001D33",
        contrastText: "#fff",
      },
      tableBg: {
        main: "#edeff7",
        light: "#edeff7",
        dark: "#edeff7",
        contrastText: "#edeff7",
        textColor: "#46464E",
      },
    },
    components: {
      MuiOutlinedInput: {
        styleOverrides: {
          root: {
            borderRadius: 7,
          },
        },
      },
      MuiDrawer: {
        styleOverrides: {
          paper: {
            background: SIDEBAR_COLOR,
            color: "white",
          },
        },
      },
    },
    typography: {
      fontFamily: "Rubik, Roboto, sans-serif, Bookman Old Style",
      fontSize: 12,
    },
    mixins: {
      MuiDataGrid: {
        containerBackground: "rgba(74, 87, 169, 0.1)",
      },
    },
  })
);

function ThemeContextProvider({ children }) {
  return <ThemeProvider theme={theme}>{children}</ThemeProvider>;
}

export default ThemeContextProvider;
