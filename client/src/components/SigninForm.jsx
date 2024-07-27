import { useState, useEffect } from "react";
import {
  Button,
  Flex,
  Input,
  FormLabel,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  FormControl,
} from "@chakra-ui/react";
//routing and redirecting
import { useNavigate } from "react-router-dom";
//Auth Service
import AuthService from "../utils/auth";
//Styles and Splash
import { ButtonStyles } from "./ButtonStyle";
import { ButtonHighlightStyle } from "./ButtonHighlightStyle";
import { InputStyles } from "./InputStyles";
import Splash from "./splash";

const SigninForm = ({ text }) => {
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
    navigate("/");

    try {
      //the only use of traditional API in this app is for new user creation or login. Other queries are done in grapghQL.
      const newUserAuth = await AuthService.loginOrCreateUser(userFormData);
    } catch (error) {
      console.log(error);
    }

    setUserFormData({
      mobile: "",
      password: "",
    });
    window.location.reload();
    onClose();
  };

  return (
    <>
      <Splash visible={splashVisible} />
      <Button
        {...ButtonStyles}
        {...ButtonHighlightStyle}
        onClick={() => {
          !AuthService.loggedIn() ? onOpen() : AuthService.logout();
          navigate("/");
        }}
      >
        {text}
      </Button>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Signup</ModalHeader>
          <ModalCloseButton />
          <ModalHeader>New? Use this to create an account</ModalHeader>
          <ModalBody>
            <Flex direction="column" align="center" justify="center">
              <FormControl onSubmit={() => handleFormSubmit()}>
                {/* show alert if server response is bad */}

                <FormLabel htmlFor="phone">Mobile</FormLabel>
                <Input
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      handleSubmit(e);
                    }
                  }}
                  autoFocus
                  id="emailInput"
                  {...InputStyles}
                  type="mobile"
                  placeholder="Your phone number"
                  name="mobile"
                  onChange={handleInputChange}
                  value={userFormData.mobile}
                  required
                />

                <FormLabel htmlFor="password">Password</FormLabel>
                <Input
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      handleSubmit(e);
                    }
                  }}
                  id="passwordInput"
                  {...InputStyles}
                  type="password"
                  placeholder="Your password"
                  name="password"
                  onChange={handleInputChange}
                  value={userFormData.password}
                  required
                />

                <Button
                  {...ButtonStyles}
                  style={{ marginTop: "10px" }}
                  disabled={!(userFormData.mobile && userFormData.password)}
                  type="submit"
                  onClick={handleFormSubmit}
                  variant="success"
                >
                  Go
                </Button>
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
