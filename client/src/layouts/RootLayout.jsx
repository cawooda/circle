import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";
import { useState, useEffect } from "react";
import { Flex, Box, Center } from "@chakra-ui/react";
import SigninForm from "../components/SigninForm";
import ProfileForm from "../components/ProfileForm";
import { useUser } from "../contexts/UserContext";
import logo from "/logo.png";
import Slideshow from "../components/Slideshow";
import { firstVisitSlideShow } from "../assets/training";
import Splash from "../components/Splash";
const logoStyle = { paddingBottom: "15px" };

export default function RootLayout() {
  const { user, loading, error } = useUser();
  const [slideShow, setSlideShow] = useState();
  const [returnVisitor, setReturnVisitor] = useState(
    localStorage.getItem("returnVisitor")
  );

  useEffect(() => {
    if (returnVisitor) {
      setSlideShow(false);
    } else {
      setSlideShow(true);
      localStorage.setItem("returnVisitor", true);
    }
  }, [returnVisitor]);

  if (loading) return <Splash />;

  if (slideShow)
    return <Slideshow data={firstVisitSlideShow} setSlideShow={setSlideShow} />;
  if (error || !user) {
    console.log("error in rootLayout", error);
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
          <Navbar user={user} />
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
      </Center>
    </Flex>
  );
}
