import { useState, useEffect } from "react";
import {
  Button,
  Text,
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
import SmsCodeModal from "./SmsCodeModal"; // Import the new modal component
import { InputStyles } from "./styles/InputStyles";

import logo from "/logo.png";
import { useUser } from "../contexts/UserContext";

const SigninForm = () => {
  const navigate = useNavigate();
  const { isOpen, onOpen, onClose } = useDisclosure(); //this is used for the Chakra modal
  const { user, setUser, refetch, loading, error } = useUser();
  const userSignedUp = localStorage.getItem("user_signed_up");
  const [signup, setSignup] = useState(!userSignedUp);
  const [message, setMessage] = useState("");
  const [userFormData, setUserFormData] = useState({
    mobile: userSignedUp || "",
    password: "",
  });

  const {
    isOpen: isSmsModalOpen,
    onOpen: onSmsModalOpen,
    onClose: onSmsModalClose,
  } = useDisclosure();

  // useEffect(() => {
  //   if (loading) onClose;
  //   if (!user) {
  //     onOpen();
  //   }
  // }, [user]);

  const handleInputChange = (event) => {
    var { name, value } = event.target;
    if (name == "mobile") {
      value = value.replace(/ /g, "");
    }
    setUserFormData({ ...userFormData, [name]: value }); //handle the change of for an input with useState
  };

  const handleSMSlinkLogin = async (event) => {
    event.preventDefault();
    if (userFormData.mobile.length === 10) {
      try {
        const response = await AuthService.smsLinkLogin(userFormData);

        if (response.linkSent) {
          setMessage("We sent you a link to login with.");
          onSmsModalOpen(); // Open the SMS code modal
        } else {
          setMessage("Failed to send the link. Please try again.");
        }
      } catch (error) {
        setMessage("An error occurred. Please try again.");
      }
    } else {
      setMessage("Please enter a valid mobile number.");
    }
  };

  const handleCodeSubmit = async (code) => {
    try {
      const response = await AuthService.verifySmsCode(code);

      if (response.user) {
        setUser(response.user);
        navigate("/");
      } else {
        throw new Error("Invalid code");
      }
    } catch (error) {
      throw error;
    }
  };

  const handleFormSubmit = async (event) => {
    event.preventDefault();
    try {
      if (signup) {
        const response = await AuthService.signUpUser(userFormData);
        if (!response.user) {
          setMessage(response.message); // Set the error message
        } else {
          setUser(user);
          refetch(); // Refetch user data after login
          onClose();
        }
      } else {
        const response = await AuthService.loginUser({
          ...userFormData,
        });
        if (!response.user) {
          setMessage(response.message); // Set the error message
        } else {
          setUser(response.user);
        }
      }
    } catch (error) {
      console.log("Error received trying to create new userAuth", error);
    }
    onClose();
    setUserFormData({
      first: "",
      last: "",
      mobile: "",
      password: "",
    });
  };
  console.log(user);
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
                <Image src={logo} boxSize="100px" />
                <Center>
                  <Heading>{signup ? "Signup" : "Login"}</Heading>
                </Center>
              </VStack>
            </Center>
          </ModalHeader>
          <ModalCloseButton />
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
                    <Button h="1.75rem" size="sm" onClick={handleSMSlinkLogin}>
                      SMS
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
                <Center>
                  <Text>{signup ? "Already Signed Up?" : "No Account?"}</Text>
                  <Button width="20%" onClick={() => setSignup(!signup)}>
                    {signup ? "Login" : "Signup"}
                  </Button>
                </Center>
              </FormControl>
            </Flex>
          </ModalBody>
        </ModalContent>
      </Modal>
      <SmsCodeModal
        isOpen={isSmsModalOpen}
        onClose={onSmsModalClose}
        onSubmit={handleCodeSubmit}
      />
    </>
  );
};

export default SigninForm;
