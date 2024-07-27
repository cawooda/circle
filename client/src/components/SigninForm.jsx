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
    email: "",
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
      const newUserAuth = await AuthService.loginOrCreateUser(userFormData);
    } catch (error) {
      console.log(error);
    }

    setUserFormData({
      email: "",
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
          <ModalBody>
            <Flex direction="column" align="center" justify="center">
              <FormControl onSubmit={() => handleFormSubmit()}>
                {/* show alert if server response is bad */}

                <FormLabel htmlFor="email">Email</FormLabel>
                <Input
                  id="emailInput"
                  {...InputStyles}
                  type="email"
                  placeholder="Your email address"
                  name="email"
                  onChange={handleInputChange}
                  value={userFormData.email}
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
                  disabled={!(userFormData.email && userFormData.password)}
                  type="submit"
                  onClick={handleFormSubmit}
                  variant="success"
                >
                  Submit
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
