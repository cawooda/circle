import {
  Heading,
  HStack,
  Container,
  Box,
  Flex,
  Spacer,
} from "@chakra-ui/react";
import React from "react";
import { ButtonStyles } from "./ButtonStyle";

import { NavLink } from "react-router-dom";
import SigninForm from "./SigninForm";
import AuthService from "../utils/auth";

const logoStyle = { paddingBottom: "15px" };

export default function NavBar() {
  return (
    <>
      <Container
        justifyContent="space-between"
        flexDirection={{ base: "column", md: "row" }}
        alignItems="center"
      >
        <Heading {...logoStyle}>Ci</Heading>
        <Spacer />
        <Flex wrap={{ base: "wrap", sm: "no-wrap" }}>
          <Box>
            <NavLink to="/admin">
              <Container {...ButtonStyles}>Admin</Container>
            </NavLink>
          </Box>
          <Box>
            <NavLink to="/provider">
              <Container {...ButtonStyles}>Provider</Container>
            </NavLink>
          </Box>
          <Box>
            <NavLink to="/support">
              <Container {...ButtonStyles}>Support</Container>
            </NavLink>
          </Box>
          <Box>
            <SigninForm text={!AuthService.loggedIn() ? "Login" : "Logout"} />
          </Box>
        </Flex>
      </Container>
    </>
  );
}
