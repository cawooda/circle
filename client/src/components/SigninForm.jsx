import { validateMobileInput, validatePasswordInput } from "../utils/helpers";
import { useState, useEffect, useCallback } from "react";
import useToken from "../hooks/UseToken";

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
//new #useHook
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
  const { setToken } = useToken();
  const [formState, setFormState] = useState({
    loading: false,
    formValid: false,
    message: "",
  });

  const navigate = useNavigate();

  const { user, refetchUser } = useUser() || {};

  const userSignedUp = localStorage.getItem("user_signed_up");
  const [signup, setSignup] = useState(!userSignedUp);
  const [userFormData, setUserFormData] = useState({
    mobile: "",
    password: "",
  });

  const {
    isOpen: isSmsModalOpen,
    onOpen: onSmsModalOpen,
    onClose: onSmsModalClose,
  } = useDisclosure();

  const { isOpen, onOpen, onClose } = useDisclosure();

  // Use `useCallback` to memoize the handlers.
  const handleOpen = useCallback(() => onOpen(), [onOpen]);
  const handleClose = useCallback(() => onClose(), [onClose]);

  useEffect(() => {
    const validMobile = validateMobileInput(userFormData.mobile);
    const validPassword = validatePasswordInput(userFormData.password);

    const formValid = validMobile && validPassword;
    const message = !formValid
      ? `${!validMobile ? "enter your mobile number" : ""} ${
          !validPassword ? "enter your password" : ""
        }`
      : "";

    setFormState((prev) => ({ ...prev, formValid, message }));
  }, [userFormData]);

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    if (userFormData[name] !== value.trim()) {
      setUserFormData((prev) => ({ ...prev, [name]: value.trim() }));
    }
  };

  const handleSMSlinkLogin = async (event) => {
    setFormState((prev) => {
      return { ...prev, loading: true };
    });
    event.preventDefault();
    if (userFormData.mobile.length === 10) {
      try {
        //new #useHook
        const response = await AuthService.smsLinkLogin(userFormData);
        if (response) {
          setFormState((prev) => {
            return { ...prev, message: "We sent you a link to log in with " };
          });

          setFormState((prev) => {
            return { ...prev, loading: false };
          });
          onSmsModalOpen();
        } else {
          setFormState((prev) => {
            return {
              ...prev,
              message: "Failed to send the link. Please try again",
            };
          });
        }
      } catch (error) {
        setFormState((prev) => {
          return {
            ...prev,
            message: `An error occurred. ${error.message} Please try again`,
          };
        });
      }
    } else {
      setFormState((prev) => {
        return { ...prev, message: "Please enter a valid mobile number" };
      });
    }
  };

  const handleCodeSubmit = async (code) => {
    try {
      setFormState((prev) => {
        return { ...prev, loading: true };
      });
      //new #useHook
      setFormState((prev) => ({ ...prev, loading: true }));
      let response;
      response = await AuthService.verifySmsCode(code);
      if (!response?.token) {
        setFormState((prev) => ({
          ...prev,
          loading: false,
          message: response?.message || "Login failed. Please try again.",
        }));
        return;
      }
      setToken({ token: response.token }); // Save token

      refetchUser(); // Fetch user data
      setFormState((prev) => ({ ...prev, loading: false }));
      setUserFormData({ mobile: "", password: "" });
      onClose(); // Close modal
      navigate("/"); // Redirect to home page
    } catch (error) {
      setFormState((prev) => {
        return {
          ...prev,
          message: `An error occurred: ${error.message}. Please try Again`,
        };
      });

      throw error;
    }
  };

  const isFormValid = () => {
    const validMobile = validateMobileInput(userFormData.mobile);
    const validPassword = validatePasswordInput(userFormData.password);
    return validMobile && validPassword;
  };

  const handleFormSubmit = async (event) => {
    if (!isFormValid()) {
      setFormState((prev) => ({
        ...prev,
        message: "Please enter a valid mobile number and password.",
      }));
      return;
    }

    setFormState((prev) => ({ ...prev, loading: true }));
    event.preventDefault();

    try {
      let response;
      if (signup) {
        response = await AuthService.signUpUser(userFormData);
        if (!response?.token) {
          setFormState((prev) => ({
            ...prev,
            loading: false,
            message: response?.message || "Signup failed. Please try again.",
          }));
          return;
        }
      } else {
        // Handle Login
        response = await AuthService.loginUser(userFormData);
        if (!response?.token) {
          setFormState((prev) => ({
            ...prev,
            loading: false,
            message: response?.message || "Login failed. Please try again.",
          }));
          return;
        }
      }

      // If signup or login succeeds
      setToken({ token: response.token }); // Save token
      refetchUser(); // Fetch user data
      setFormState((prev) => ({ ...prev, loading: false }));
      setUserFormData({ mobile: "", password: "" });
      onClose(); // Close modal
      navigate("/"); // Redirect to home page
    } catch (error) {
      setFormState((prev) => ({
        ...prev,
        loading: false,
        message: `An error occurred: ${error.message}. Please try again.`,
      }));
      console.error("Login/Signup Error:", error);
    }
  };

  if (formState.loading) return <Splash />;

  return (
    <>
      <Button
        {...ButtonStyles}
        onClick={() => {
          onOpen();
        }}
      >
        Login
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
                <Center gap={3}>
                  <Text>{signup ? "Already Signed Up?" : "No Account?"}</Text>
                  <Button
                    {...ButtonStyles}
                    width="20%"
                    onClick={() => setSignup(!signup)}
                  >
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
                {formState.message ? (
                  <Alert status="error">{formState.message}</Alert>
                ) : (
                  <></>
                )}
                <Container centerContent>
                  <Button
                    isDisabled={formState.formValid ? false : true}
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
