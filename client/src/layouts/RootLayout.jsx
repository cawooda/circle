import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";
import { useState, useEffect } from "react";
import { Flex, Container, Box, Center } from "@chakra-ui/react";
import SigninForm from "../components/SigninForm";
import ProfileForm from "../components/ProfileForm";
import { useUser } from "../contexts/UserContext";
import logo from "/logo.png";
import Slideshow from "../components/Slideshow";
import { firstVisitSlideShow } from "../assets/training";
import Splash from "../components/Splash";
import { NavLink } from "react-router-dom";
const logoStyle = { paddingBottom: "15px" };
import { ButtonStyles } from "../components/styles/ButtonStyle";
import AuthService from "../utils/auth";

export default function RootLayout() {
  const { user, loggedIn, loading, error } = useUser();

  const [slideShow, setSlideShow] = useState();
  const [returnVisit, setReturnVisit] = useState(
    localStorage.getItem("returnVisit") || 1
  );

  useEffect(() => {
    if (returnVisit > 2) {
      setSlideShow(false);
    } else {
      setSlideShow(true);
      localStorage.setItem("returnVisit", parseInt(returnVisit) + 1);
    }
  }, [returnVisit]);

  if (loading) return <Splash />;

  if (slideShow)
    return <Slideshow data={firstVisitSlideShow} setSlideShow={setSlideShow} />;
  if (!loggedIn) {
    return (
      <Center height="100vh">
        <div>
          <Flex justify="center" align="center">
            <SigninForm />
          </Flex>
        </div>
      </Center>
    );
  }
  return (
    <Flex direction="column" height="100vh">
      <Box bg="blue.500" p={4} color="white" textAlign="center">
        <Center>
          <img src={logo} width={60} style={logoStyle} />
        </Center>
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
        (Ci) Circle Independent
      </Box>
      <Center bgColor="yellow.100" padding={5} gap={3}>
        <ProfileForm />
        <SigninForm />
        {user?.roleAdmin || user?.roleSuperAdmin ? (
          <Box>
            <NavLink to="/admin">
              <Container {...ButtonStyles}>Admin</Container>
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
      </Center>
    </Flex>
  );
}
