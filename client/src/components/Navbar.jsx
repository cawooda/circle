import {
  Heading,
  HStack,
  Container,
  Box,
  Flex,
  Spacer,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { ButtonStyles } from ".styles/ButtonStyle";
import Splash from "./Splash";
import { NavLink } from "react-router-dom";

import AuthService from "../utils/auth";

export default function NavBar({ user }) {
  return (
    <>
      <Splash />
      <Flex gap={3} flexDirection={{ base: "column", md: "column" }}>
        {/* Check roles and serve up what they should see */}
        {user?.roleAdmin || user?.roleSuperAdmin ? (
          <Box>
            <NavLink to="/admin">
              <Container {...ButtonStyles}>Admin</Container>
            </NavLink>
          </Box>
        ) : null}
        {user?.roleProvider || user?.roleAdmin || user?.roleSuperAdmin ? (
          <Box>
            <NavLink to="/provider">
              <Container {...ButtonStyles}>Provider</Container>
            </NavLink>
          </Box>
        ) : null}
        {user?.roleCustomer || user?.roleAdmin || user?.roleSuperAdmin ? (
          <Box>
            <NavLink to="/customer">
              <Container {...ButtonStyles}>Customer</Container>
            </NavLink>
          </Box>
        ) : null}
        <Box display="flex" justifyContent="center" alignItems="center"></Box>
      </Flex>
    </>
  );
}
