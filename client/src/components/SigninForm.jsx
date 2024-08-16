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

import logo from "/logo.png";
import { useUser } from "../contexts/UserContext";

const SigninForm = () => {
  const navigate = useNavigate();
  const { isOpen, onOpen, onClose } = useDisclosure(); //this is used for the Chakra modal
  const { user, setUser, loading, error } = useUser();
  const [signup, setSignup] = useState(false);
  const [message, setMessage] = useState("");
  const [userFormData, setUserFormData] = useState({
    mobile: "",
    password: "",
  });

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

    if (userFormData.mobile.length == 10) {
      try {
        const response = await AuthService.resetPassword(userFormData);

        if (!response.user) {
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
    onClose();
    event.preventDefault();
    try {
      if (!signup) {
        const response = await AuthService.loginUser(userFormData);
        if (!response.user) {
          setMessage(response.message); // Set the error message
        } else {
          setUser(response.user);
          onClose();
        }
      } else {
        const response = await AuthService.signUpUser(userFormData);
        console.log(userFormData);
        if (!response.user) {
          setMessage(response.message); // Set the error message
        } else {
          setUser(response.user);
          onClose();
        }
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
      <Button
        {...ButtonStyles}
        onClick={() => {
          if (!user) {
            onOpen();
          } else {
            AuthService.logout();
            setUser(null);
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
          <Button onClick={() => setSignup(!signup)}>
            {signup ? "Login" : "Signup"}
          </Button>
          <ModalBody>
            <Flex direction="column" align="center" justify="center">
              <FormControl as="form" onSubmit={handleFormSubmit}>
                {signup ? (
                  <>
                    <FormLabel htmlFor="first">First Name</FormLabel>
                    <Input
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          handleFormSubmit(e);
                        }
                      }}
                      id="firstInput"
                      {...InputStyles}
                      type="text"
                      placeholder="first name..."
                      name="first"
                      onChange={handleInputChange}
                      value={userFormData.first}
                      required
                    />
                    <FormLabel htmlFor="last">Last Name</FormLabel>
                    <Input
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          handleFormSubmit(e);
                        }
                      }}
                      id="lastInput"
                      {...InputStyles}
                      type="text"
                      placeholder="last name..."
                      name="last"
                      onChange={handleInputChange}
                      value={userFormData.last}
                      required
                    />
                  </>
                ) : (
                  <></>
                )}
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
                {message ? <Alert status="error">{message}</Alert> : <></>}
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
