import { validateMobileInput, validatePasswordInput } from "../utils/helpers";
import { useState, useEffect, useCallback } from "react";

import {
  Button,
  Text,
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
  Alert,
  InputGroup,
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
//new #useHook
import AuthService from "../utils/auth";
import { ButtonStyles, ButtonHighlightStyle } from "./styles/ButtonStyle";
import SmsCodeModal from "./SmsCodeModal"; // Import the new modal component
import { InputStyles } from "./styles/InputStyles";

import logo from "/logo.png";
// import { useAuth } from "../contexts/UserContext";
import Splash from "./Splash";

const SigninForm = ({ forceOpen }) => {
  const [formState, setFormState] = useState({
    loading: false,
    formValid: false,
    message: "",
  });

  const navigate = useNavigate();

  // const { user, refetchUser } = useAuth() || {};

  const userSignedUp = localStorage.getItem("user_signed_up");
  const [signup, setSignup] = useState(!userSignedUp);
  const [userFormData, setUserFormData] = useState({
    first: "",
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

    const formValid = validMobile;
    const message = !formValid
      ? `${!validMobile ? "enter your mobile number" : ""} `
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

  const handleCodeSubmit = async (code, password) => {
    try {
      setFormState((prev) => {
        return { ...prev, loading: true };
      });

      setFormState((prev) => ({ ...prev, loading: true }));

      const { success, message } = await AuthService.updateUserPassword(
        code,
        password
      );
      if (!success) {
        setFormState((prev) => ({
          ...prev,
          loading: false,
          message: message || "Login failed. Please try again.",
        }));
        return;
      }
      setFormState((prev) => ({ ...prev, loading: false }));
      navigate("/login"); // Redirect to home page
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
    return validMobile;
  };

  const handleFormSubmit = async (event) => {
    event.preventDefault();
    if (!isFormValid()) {
      setFormState((prev) => ({
        ...prev,
        message: "Please enter a valid mobile number and password.",
      }));
      return;
    }
    setFormState((prev) => ({ ...prev, loading: true }));
    try {
      let response;
      const contact = {
        mobile: userFormData?.mobile,
        email: userFormData?.email,
      };
      const first = userFormData?.first;
      if (signup) {
        response = await AuthService.addUser({ contact, first });
        if (!response?.success) {
          setFormState((prev) => ({
            ...prev,
            loading: false,
            message: response.message || "Signup failed. Please try again.",
          }));
          onSmsModalOpen();
          return;
        }
      } else {
        const password = userFormData?.password;
        response = await AuthService.loginUser(contact, password);

        if (!response.success) {
          setFormState((prev) => ({
            ...prev,
            loading: false,
            message: response?.message || "Login failed. Please try again.",
          }));

          return;
        }
      }

      // If signup or login succeeds
      AuthService.setToken(response.token); // Save token
      // refetchUser(); // Fetch user data
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
                  </>
                ) : (
                  <>
                    <FormLabel htmlFor="first">Password</FormLabel>
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
                      autoComplete="password"
                      onChange={handleInputChange}
                      value={userFormData.password}
                      required
                    />
                  </>
                )}

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
