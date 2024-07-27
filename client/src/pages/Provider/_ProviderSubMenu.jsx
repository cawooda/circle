import { Heading, HStack, Container, Box, Spacer } from "@chakra-ui/react";
import React from "react";
import { ButtonStyles } from "../../components/ButtonStyle";
import { GridItem } from "@chakra-ui/react";
import { NavLink } from "react-router-dom";

export default function ProviderSubMenu() {
  return (
    <HStack justifyContent="center">
      <NavLink to="service-agreements">
        <Container {...ButtonStyles}>Service Agreement</Container>
      </NavLink>
      <NavLink to="shifts">
        <Container {...ButtonStyles}>Shifts</Container>
      </NavLink>
    </HStack>
  );
}
