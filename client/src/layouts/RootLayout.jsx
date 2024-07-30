import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";
import { Container, Spacer, Flex, Box, Heading } from "@chakra-ui/react";

import logo from "/logo.png";

const logoStyle = { paddingBottom: "15px" };

export default function RootLayout() {
  return (
    <Flex direction="column" height="100vh">
      <Box bg="blue.500" p={4} color="white" textAlign="center">
        {/* <Heading {...logoStyle}> */}
        <img src={logo} width={60}></img>
        {/* </Heading> */}
      </Box>
      <Flex flex="1" direction={{ base: "column", md: "row" }}>
        <Box bg="gray.200" p={4} maxWidth={{ base: "100vw", md: "100vw" }}>
          <Navbar />
        </Box>
        <Box flex="1" bg="gray.50" p={4}>
          <Outlet />
        </Box>
      </Flex>
      <Box bg="blue.500" p={4} color="white" textAlign="center">
        (C) Circle Indeendent
      </Box>
    </Flex>
  );
}
