import { validateMobileInput, validatePasswordInput } from "../utils/helpers";
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
import Splash from "./Splash";

const SigninForm = ({ forceOpen }) => {
  const [loadingState, setLoadingState] = useState(false);
  const [formValidState, setFormValidState] = useState(false);
  const navigate = useNavigate();
  const { isOpen, onOpen, onClose } = useDisclosure(); //this is used for the Chakra modal
  const { user, setUser, refetchUser, loading, error } = useUser();
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

  useEffect(() => {
    if (!user) {
      onOpen();
    }
    if (forceOpen) {
      onOpen();
    }
  }, [user]);

  useEffect(() => {
    //set
    const validMobile = validateMobileInput(userFormData.mobile);
    const validPassword = validatePasswordInput(userFormData.password);
    //check
    if (validMobile && validPassword) {
      setFormValidState(true);
      setMessage(``);
      return;
    } else {
      setFormValidState(false);
    }
    //compile message
    if (!formValidState) {
      let message = `${!validMobile ? `enter your mobile number` : ``}${
        !validPassword ? `enter your password` : ``
      }`;
      setMessage(message);
    } else setMessage(``);
  }, [userFormData]);

  const handleInputChange = (event) => {
    var { name, value } = event.target;
    if (name == "mobile") {
      value = value.replace(/ /g, "");
    }
    setUserFormData({ ...userFormData, [name]: value }); //handle the change of for an input with useState
  };

  const handleSMSlinkLogin = async (event) => {
    setLoadingState(true);
    event.preventDefault();
    if (userFormData.mobile.length === 10) {
      try {
        const response = await AuthService.smsLinkLogin(userFormData);

        if (response.linkSent) {
          setMessage("We sent you a link to login with.");
          setLoadingState(false);
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
      setLoadingState(true);
      const response = await AuthService.verifySmsCode(code);
      if (!response.user) {
        setMessage(response.message); // Set the error message
      } else {
        setUser(response.user);
        refetchUser();
        setLoadingState(false);
        onClose();
      }
    } catch (error) {
      throw error;
    }
  };

  const handleFormSubmit = async (event) => {
    setLoadingState(true);
    event.preventDefault();
    try {
      if (signup) {
        console.log("signup");
        const responseSignup = await AuthService.signUpUser(userFormData);
        if (!responseSignup.user) {
          setMessage(responseSignup.message); // Set the error message
          throw new Error("error with signup");
        } else {
          setUser(responseSignup.user);
          setLoadingState(false);
          onClose();
        }
      } else {
        const responseLogin = await AuthService.loginUser({
          ...userFormData,
        });
        if (!responseLogin.user) {
          setMessage(responseLogin.message); // Set the error message
        } else {
          setUser(responseLogin.user);
          setLoadingState(false);
        }
      }
      refetchUser();
      onClose();
      setUserFormData({
        first: "",
        last: "",
        mobile: "",
        password: "",
      });
    } catch (error) {
      console.log("Error received trying to create new userAuth", error);
    }
  };
  if (loadingState) return <Splash />;
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
              <FormControl as="form" onSubmit={(e) => handleFormSubmit(e)}>
                <Center>
                  <Text>{signup ? "Already Signed Up?" : "No Account?"}</Text>
                  <Button width="20%" onClick={() => setSignup(!signup)}>
                    {signup ? "Login" : "Signup"}
                  </Button>
                </Center>
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
                      autoComplete="given-name"
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
                      autoComplete="family-name"
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
                  autoComplete={signup ? "mobile" : "username"}
                  onChange={handleInputChange}
                  value={userFormData.mobile}
                  required
                />
                <FormLabel htmlFor="password">Password</FormLabel>
                <InputGroup>
                  <InputRightElement width="4.5rem">
                    <Button
                      isDisabled={signup ? true : false}
                      h="1.75rem"
                      size="sm"
                      onClick={handleSMSlinkLogin}
                    >
                      SMS
                    </Button>
                  </InputRightElement>
                  <Input
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        handleFormSubmit(e);
                      }
                    }}
                    autoComplete="current-password"
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
                    isDisabled={formValidState ? false : true}
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
      <SmsCodeModal
        isOpen={isSmsModalOpen}
        onClose={onSmsModalClose}
        onSubmit={handleCodeSubmit}
      />
    </>
  );
};

export default SigninForm;
