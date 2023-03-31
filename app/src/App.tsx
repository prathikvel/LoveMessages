import { HelmetProvider, Helmet } from "react-helmet-async";
import { RouterProvider } from "react-router-dom";

import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";

import router from "./routes";
import theme from "./themes";

const App = () => {
  return (
    <HelmetProvider>
      <Helmet
        defaultTitle="Project Meghna"
        titleTemplate="Project Meghna | %s"
      />
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <RouterProvider router={router} />
      </ThemeProvider>
    </HelmetProvider>
  );
};

export default App;
