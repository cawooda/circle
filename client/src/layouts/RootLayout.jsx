import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";
import { Container, Grid, GridItem, Spacer } from "@chakra-ui/react";

export default function RootLayout() {
  return (
    <>
      <Container width="100%">
        <Navbar />
        <Spacer />
        <Outlet />
      </Container>
    </>
  );
}
