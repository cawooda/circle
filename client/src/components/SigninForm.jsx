import { useState } from "react";
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

import AuthService from "../utils/auth";

import { ButtonStyles } from "./ButtonStyle";
import { ButtonHighlightStyle } from "./ButtonHighlightStyle";
import { InputStyles } from "./InputStyles";

const SigninForm = ({ text }) => {
  const { isOpen, onOpen, onClose } = useDisclosure(); //this is used for the Chakra modal

  const [userFormData, setUserFormData] = useState({
    mobile: "",
    password: "",
  });

  // set state for alert
  const [showAlert, setShowAlert] = useState(false);

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setUserFormData({ ...userFormData, [name]: value }); //handle the change of for an input with useState
  };

  const handleFormSubmit = async (event) => {
    event.preventDefault();

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
      <Button
        {...ButtonStyles}
        {...ButtonHighlightStyle}
        onClick={() => {
          !AuthService.loggedIn() ? onOpen() : AuthService.logout();
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
