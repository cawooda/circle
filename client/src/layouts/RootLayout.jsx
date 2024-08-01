import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";
import {
  Container,
  Spacer,
  Flex,
  Box,
  Heading,
  Center,
} from "@chakra-ui/react";
import SigninForm from "../components/SigninForm";
import { useUser } from "../contexts/UserContext";
import logo from "/logo.png";

const logoStyle = { paddingBottom: "15px" };

export default function RootLayout() {
  const { user, loading, error } = useUser();

  if (loading) return <p>Loading...</p>;
  if (error || !user)
    return (
      <Center height="100vh">
        <div>
          <Heading>Please log in</Heading>
          <Flex justify="center" align="center">
            <SigninForm />
          </Flex>
        </div>
      </Center>
    );

  return (
    <Flex direction="column" height="100vh">
      <Box bg="blue.500" p={4} color="white" textAlign="center">
        <img src={logo} width={60} style={logoStyle} />
        <SigninForm />
      </Box>
      <Flex flex="1" direction={{ base: "column", md: "row" }}>
        <Box bg="gray.200" p={4} maxWidth={{ base: "100vw", md: "100vw" }}>
          <Navbar user={user} />
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
