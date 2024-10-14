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

const SigninForm = ({ forceOpen, loggedIn, setLoggedIn }) => {
  const [formState, setFormState] = useState({
    loading: false,
    formValid: false,
    message: "",
  });

  const navigate = useNavigate();
  const { isOpen, onOpen, onClose } = useDisclosure(); //this is used for the Chakra modal
  const { user, refetchUser, loading, error } = useUser() ? useUser() : {};
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

  useEffect(() => {
    if (!user || forceOpen) {
      onOpen();
    }
  }, [user, forceOpen]);

  useEffect(() => {
    //set
    const validMobile = validateMobileInput(userFormData.mobile);
    const validPassword = validatePasswordInput(userFormData.password);
    //check
    if (validMobile && validPassword) {
      setFormState((prev) => {
        return { ...prev, formValid: true };
      });

      return;
    } else {
      setFormState((prev) => {
        return { ...prev, formValid: false };
      });
    }
    //compile message
    if (!formState.formValid) {
      let message = `${!validMobile ? `enter your mobile number` : ``}${
        !validPassword ? `enter your password` : ``
      }`;
      setFormState((prev) => {
        return { ...prev, message };
      });
    } else
      setFormState((prev) => {
        return { ...prev, message: "" };
      });
  }, [userFormData]);

  const handleInputChange = (event) => {
    var { name, value } = event.target;
    if (name == "mobile") {
      value = value.replace(/ /g, "");
    }
    setUserFormData({ ...userFormData, [name]: value }); //handle the change of for an input with useState
  };

  const handleSMSlinkLogin = async (event) => {
    setFormState((prev) => {
      return { ...prev, loading: true };
    });
    event.preventDefault();
    if (userFormData.mobile.length === 10) {
      try {
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
      const response = await AuthService.verifySmsCode(code);
      if (response) {
        navigate("/");

        setLoggedIn(true);
        setFormState((prev) => {
          return { ...prev, loading: false };
        });

        onClose();
      }
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

  const handleFormSubmit = async (event) => {
    setFormState((prev) => {
      return { ...prev, loading: true };
    });
    event.preventDefault();
    try {
      if (signup) {
        const response = await AuthService.signUpUser(userFormData);
        if (!response) {
          setFormState((prev) => {
            return {
              ...prev,
              message: "sorry we didnt get a response from the server",
            };
          });
          setFormState((prev) => {
            return { ...prev, loading: false };
          });
          setLoggedIn(false);
          throw new Error("error with signup");
        } else {
          setLoggedIn(true);
          refetchUser();
          setFormState((prev) => {
            return { ...prev, loading: false };
          });
          onClose();
          navigate("/");
          return;
        }
      }
      const responseLogin = await AuthService.loginUser({
        ...userFormData,
      });

      if (responseLogin?.token) {
        onClose();
        setLoggedIn(true);

        setFormState((prev) => {
          return { ...prev, loading: false };
        });
        setUserFormData({
          first: "",
          last: "",
          mobile: "",
          password: "",
        });
      } else {
        setFormState((prev) => {
          return { ...prev, loading: false };
        });
        setLoggedIn(false);
        setFormState((prev) => {
          return {
            ...prev,
            message: responseLogin.message,
          };
        });

        return;
      }
      refetchUser();
      onClose();
    } catch (error) {
      console.log("Error received trying to create new userAuth", error);
    }
  };

  if (formState.loading) return <Splash />;
  return (
    <>
      <Button
        {...ButtonStyles}
        onClick={() => {
          if (!loggedIn) {
            onOpen();
          } else {
            AuthService.logout();
            navigate("/login");
          }
        }}
      >
        {loggedIn ? "Logout" : "Login"}
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
