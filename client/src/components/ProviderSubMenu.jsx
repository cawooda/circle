import { Heading, HStack, Container, Box, Spacer } from "@chakra-ui/react";
import React from "react";
import { ButtonStyles } from "./ButtonStyle";
import { GridItem } from "@chakra-ui/react";
import { NavLink } from "react-router-dom";

export default function ProviderSubMenu() {
  return (
    <HStack justifyContent="space-around">
      <NavLink to="service-agreements">
        <Container {...ButtonStyles}>Service Agreement</Container>
      </NavLink>
    </HStack>
  );
}
