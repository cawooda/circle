import {
  Heading,
  HStack,
  Container,
  Box,
  Flex,
  Spacer,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { ButtonStyles } from "./ButtonStyle";
import Splash from "./Splash";
import { NavLink } from "react-router-dom";
import SigninForm from "./SigninForm";
import AuthService from "../utils/auth";

export default function NavBar() {
  const [loggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    AuthService.loggedIn() ? setLoggedIn(true) : setLoggedIn(false);
  }, [loggedIn]);

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
          <NavLink to="/customer">
            <Container {...ButtonStyles}>Customer</Container>
          </NavLink>
        </Box>
        <Box display="flex" justifyContent="center" alignItems="center">
          <SigninForm
            text={loggedIn ? "Logout" : "Login"}
            loggedIn={loggedIn}
            setLoggedIn={setLoggedIn}
          />
        </Box>
      </Flex>
    </>
  );
}
