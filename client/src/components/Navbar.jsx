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
import Splash from "./splash";
import { NavLink } from "react-router-dom";
import SigninForm from "./SigninForm";
import AuthService from "../utils/auth";

export default function NavBar() {
  return (
    <>
      <Splash />
      <Flex gap={3} flexDirection={{ base: "column", md: "column" }}>
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
        <Box display="flex" justifyContent="center" alignItems="center">
          <SigninForm text={!AuthService.loggedIn() ? "Login" : "Logout"} />
        </Box>
      </Flex>
    </>
  );
}
