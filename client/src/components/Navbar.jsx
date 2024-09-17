import {
  Heading,
  HStack,
  Container,
  Box,
  Flex,
  Spacer,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { ButtonStyles } from "./styles/ButtonStyle";
import { useUser } from "../contexts/UserContext";
import { NavLink } from "react-router-dom";

export default function NavBar() {
  const { user, setUser } = useUser();
  return (
    <>
      <Flex gap={3} flexDirection={{ base: "column", md: "column" }}>
        {/* Check roles and serve up what they should see */}
        {user?.roleProvider || user?.roleAdmin || user?.roleSuperAdmin ? (
          <Box>
            <NavLink to="/provider">
              <Container {...ButtonStyles}>
                {user.roleProvider.providerName}
              </Container>
            </NavLink>
          </Box>
        ) : null}
        <Box display="flex" justifyContent="center" alignItems="center"></Box>
      </Flex>
    </>
  );
}
