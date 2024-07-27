import { Heading, HStack, Container, Box, Spacer } from "@chakra-ui/react";
import React from "react";
import { ButtonStyles } from "../../components/ButtonStyle";
import { GridItem } from "@chakra-ui/react";
import { NavLink } from "react-router-dom";

export default function AdminSubMenu() {
  return (
    <HStack justifyContent="center">
      <NavLink to="users">
        <Container {...ButtonStyles}>Users</Container>
      </NavLink>

      <NavLink to="service-agreements">
        <Container {...ButtonStyles}>Service Agreements</Container>
      </NavLink>

      <NavLink to="shifts">
        <Container {...ButtonStyles}>Shifts</Container>
      </NavLink>
      <NavLink to="invoices">
        <Container {...ButtonStyles}>Invoices</Container>
      </NavLink>
    </HStack>
  );
}