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
      <Container>
        <Box>
          <Heading {...logoStyle}>Ci</Heading>
        </Box>
        {/* <Flex wrap={{ base: "wrap", sm: "no-wrap" }}> */}
        <Box>
          <Flex flexDirection={{ base: "column", md: "row" }}>
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
            {/* </Flex> */}
          </Flex>
        </Box>
      </Container>
    </>
  );
}
