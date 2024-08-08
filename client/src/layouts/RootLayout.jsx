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
import ProfileForm from "../components/ProfileForm";
import { useUser } from "../contexts/UserContext";
import logo from "/logo.png";
import Slideshow from "../components/Slideshow";

const logoStyle = { paddingBottom: "15px" };

const data = [
  {
    title: 'Welcome to Circle',
    description: 'Circle helps you build trust in your NDIS business by making transparent pricing and NDIS compliant invoicing easy.',
  },
  {
    title: 'Log in with your phone',
    description: 'Create a password so


export default function RootLayout() {
  const { user, loading, error } = useUser();

  if (loading) return <p>Loading...</p>;
  if (error || !user)
    return (
      <Center height="100vh">
        <div>
          <Heading>Please log in</Heading>
          <Flex justify="center" align="center">
            <Slideshow />
            <SigninForm />
          </Flex>
        </div>
      </Center>
    );

  return (
    <Flex direction="column" height="100vh">
      <Box bg="blue.500" p={4} color="white" textAlign="center">
        <Center>
          <img src={logo} width={60} style={logoStyle} />
        </Center>
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
        (Ci) Circle Independent
      </Box>
      <Center padding={5}>
        <ProfileForm />
        <SigninForm />
      </Center>
    </Flex>
  );
}
