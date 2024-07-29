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
//routing and redirecting
import { useNavigate } from "react-router-dom";
//Auth Service
import AuthService from "../utils/auth";
//Styles and Splash
import { ButtonStyles } from "./ButtonStyle";
import { ButtonHighlightStyle } from "./ButtonHighlightStyle";
import { InputStyles } from "./InputStyles";
import Splash from "./Splash";
import logo from "/logo.png";

const SigninForm = ({ text, loggedIn, setLoggedIn }) => {
  const navigate = useNavigate();
  const { isOpen, onOpen, onClose } = useDisclosure(); //this is used for the Chakra modal
  // set state for alert
  const [showAlert, setShowAlert] = useState(false);
  const [userFormData, setUserFormData] = useState({
    mobile: "",
    password: "",
  });
  const [splashVisible, setSplashVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setSplashVisible(false);
    }, 1500); // 3 seconds

    return () => clearTimeout(timer); // Cleanup the timer
  }, [splashVisible]);

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setUserFormData({ ...userFormData, [name]: value }); //handle the change of for an input with useState
  };

  const handleFormSubmit = async (event) => {
    event.preventDefault();
    setSplashVisible(true);
    const newUserAuth = await AuthService.loginOrCreateUser(userFormData);
    if (newUserAuth) setLoggedIn(true);
    navigate("/");

    try {
      //the only use of traditional API in this app is for new user creation or login. Other queries are done in grapghQL.
    } catch (error) {
      console.log(error);
    }

    setUserFormData({
      first: "",
      last: "",
      mobile: "",
      password: "",
    });
    navigate("/");
    onClose();
  };

  return (
    <>
      <Splash visible={splashVisible} />
      <Button
        {...ButtonStyles}
        {...ButtonHighlightStyle}
        onClick={() => {
          if (!loggedIn) {
            onOpen();
          } else {
            AuthService.logout();
            setLoggedIn(false);
            navigate("/");
          }
        }}
      >
        {text}
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
              <FormControl onSubmit={() => handleFormSubmit()}>
                {/* show alert if server response is bad */}
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
                  id="emailInput"
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

      {/* This is needed for the validation functionality above */}
    </>
  );
};

export default SigninForm;
