import { Outlet } from "react-router-dom";

import Container from "@mui/material/Container";

import Navbar from "./Navbar";

const Layout = () => {
  return (
    <>
      <Navbar />
      <Container sx={{ maxWidth: "lg", mt: 3 }}>
        <Outlet />
      </Container>
    </>
  );
};

export default Layout;
