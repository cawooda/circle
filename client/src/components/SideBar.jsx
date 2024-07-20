import { Heading, Stack, Container, Box } from "@chakra-ui/react";
import React from "react";
import { ButtonStyles } from "./ButtonStyle";
import { GridItem } from "@chakra-ui/react";
import { NavLink } from "react-router-dom";

const sideBarGridItemProps = {
  as: "aside",
  colSpan: { base: 4, md: 2, xl: 1 },
  bg: "yellow.400",
  minHeight: { md: "10vh", lg: "100vh" },
  minWidth: { base: "100vw", md: "10vh" },
  p: { base: "20px", lg: "30px" },
  // borderWidth: "1px",
  // borderColor: "black",
};

const logoStyle = { paddingBottom: "15px" };

export default function SideBar() {
  return (
    <>
      <GridItem {...sideBarGridItemProps}>
        <Box {...logoStyle}>
          <Heading>Ci</Heading>
        </Box>
        <div>
          <Stack paddingTop="10px">
            <NavLink {...ButtonStyles} to="/admin">
              <Container {...ButtonStyles}>Admin</Container>
            </NavLink>

            <NavLink {...ButtonStyles} to="/provider">
              <Container {...ButtonStyles}>Provider</Container>
            </NavLink>

            <NavLink {...ButtonStyles} to="/support">
              <Container {...ButtonStyles}>Support</Container>
            </NavLink>
          </Stack>
        </div>
      </GridItem>
    </>
  );
}
