import { useState, useEffect } from "react";
import {
  Button,
  Flex,
  Input,
  FormLabel,
  InputRightElement,
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
  Alert,
  InputGroup,
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import AuthService from "../utils/auth";
import {
  ButtonStyles,
  ButtonHighlightStyle,
} from "../components/styles/ButtonStyle";

import { InputStyles } from "./styles/InputStyles";
import Splash from "./Splash";
import logo from "/logo.png";
import { useUser } from "../contexts/UserContext";

const SigninForm = () => {
  const navigate = useNavigate();
  const { isOpen, onOpen, onClose } = useDisclosure(); //this is used for the Chakra modal
  const { user, setUser } = useUser();
  const [message, setMessage] = useState("");
  const [userFormData, setUserFormData] = useState({
    mobile: "",
    password: "",
  });
  const [splashVisible, setSplashVisible] = useState(true);

  useEffect(() => {}, message);

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
  }, [user]);

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setUserFormData({ ...userFormData, [name]: value }); //handle the change of for an input with useState
  };

  const handlePasswordHelp = async (event) => {
    console.log("handlepasswordhelp");
    event.preventDefault();
    setSplashVisible(true);
    if (userFormData.mobile.length == 10) {
      try {
        const response = await AuthService.resetPassword(userFormData);

        if (!response.user === undefined) {
          setMessage(response.message); // Set the error message
        } else {
          setUser(response.user);
          onClose();
        }
      } catch (error) {
        console.error("Error received trying to create new userAuth", error);
        throw error;
      }
    } else {
      setMessage("add your mobile to reset password");
    }
  };

  const handleFormSubmit = async (event) => {
    setSplashVisible(true);
    onClose();
    event.preventDefault();
    try {
      const response = await AuthService.loginOrCreateUser(userFormData);

      if (!response.user === undefined) {
        setMessage(response.message); // Set the error message
      } else {
        setUser(response.user);
        onClose();
      }
    } catch (error) {
      console.log("Error received trying to create new userAuth", error);
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
                <InputGroup>
                  <InputRightElement width="4.5rem">
                    <Button h="1.75rem" size="sm" onClick={handlePasswordHelp}>
                      Help
                    </Button>
                  </InputRightElement>
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
                </InputGroup>
                {message ? <Alert status="error">{message}</Alert> : null}
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
