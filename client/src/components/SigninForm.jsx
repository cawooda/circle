import { useState, useEffect } from "react";
import {
  Button,
  Flex,
  Input,
  FormLabel,
  Modal,
  ModalOverlay,
  Heading,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  FormControl,
  Container,
  Image,
  Center,
  VStack,
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import AuthService from "../utils/auth";
import { ButtonStyles } from "./ButtonStyle";
import { ButtonHighlightStyle } from "./ButtonHighlightStyle";
import { InputStyles } from "./InputStyles";
import Splash from "./Splash";
import logo from "/logo.png";
import { useUser } from "../contexts/UserContext";

const SigninForm = ({ user }) => {
  const navigate = useNavigate();
  const { isOpen, onOpen, onClose } = useDisclosure(); //this is used for the Chakra modal
  const { setUser } = useUser();
  const [userFormData, setUserFormData] = useState({
    mobile: "",
    password: "",
  });
  const [splashVisible, setSplashVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setSplashVisible(false);
    }, 1500); // 1.5 seconds

    return () => clearTimeout(timer); // Cleanup the timer
  }, [splashVisible]);

  useEffect(() => {
    if (!user) {
      onOpen();
    }
  }, [user, onOpen]);

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setUserFormData({ ...userFormData, [name]: value }); //handle the change of for an input with useState
  };

  const handleFormSubmit = async (event) => {
    event.preventDefault();
    setSplashVisible(true);
    try {
      const newUserAuth = await AuthService.loginOrCreateUser(userFormData);

      if (newUserAuth) {
        setUser(newUserAuth);
        onClose();
        navigate("/");
      }
    } catch (error) {
      console.log(error);
    }

    setUserFormData({
      first: "",
      last: "",
      mobile: "",
      password: "",
    });
  };

  return (
    <>
      <Splash visible={splashVisible} />
      <Button
        {...ButtonStyles}
        {...ButtonHighlightStyle}
        onClick={() => {
          if (!user) {
            onOpen();
          } else {
            setUser(null);
            AuthService.logout();
            navigate("/");
          }
        }}
      >
        {user ? "Logout" : "Login"}
      </Button>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            <Center>
              <VStack>
                <Heading>Signup</Heading>
                <Image src={logo} boxSize="100px" />
              </VStack>
            </Center>
          </ModalHeader>
          <ModalCloseButton />
          <ModalHeader>New? Use this to create an account</ModalHeader>
          <ModalBody>
            <Flex direction="column" align="center" justify="center">
              <FormControl as="form" onSubmit={handleFormSubmit}>
                <FormLabel htmlFor="first">First Name</FormLabel>
                <Input
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      handleFormSubmit(e);
                    }
                  }}
                  autoFocus
                  id="first-name"
                  {...InputStyles}
                  type="text"
                  placeholder="name..."
                  name="first"
                  onChange={handleInputChange}
                  value={userFormData.first}
                  required
                />
                <FormLabel htmlFor="phone">Mobile</FormLabel>
                <Input
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      handleFormSubmit(e);
                    }
                  }}
                  id="mobileInput"
                  {...InputStyles}
                  type="mobile"
                  placeholder="mobile..."
                  name="mobile"
                  onChange={handleInputChange}
                  value={userFormData.mobile}
                  required
                />

                <FormLabel htmlFor="password">Password</FormLabel>
                <Input
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      handleFormSubmit(e);
                    }
                  }}
                  id="passwordInput"
                  {...InputStyles}
                  type="password"
                  placeholder="password..."
                  name="password"
                  onChange={handleInputChange}
                  value={userFormData.password}
                  required
                />
                <Container centerContent>
                  <Button
                    {...ButtonStyles}
                    style={{ margin: "50px" }}
                    disabled={!(userFormData.mobile && userFormData.password)}
                    type="submit"
                    onClick={handleFormSubmit}
                    variant="success"
                  >
                    Go
                  </Button>
                </Container>
              </FormControl>
            </Flex>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};

export default SigninForm;
