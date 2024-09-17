import { useState, useEffect } from "react";
import {
  ButtonStyles,
  SmallButtonStyle,
  ButtonHighlightStyle,
} from "./styles/ButtonStyle";
import { InputStyles } from "./styles/InputStyles";
import logo from "/logo.png";
import { useMutation } from "@apollo/client";
import { UPDATE_USER_PASSWORD } from "../utils/mutations";
import { useUser } from "../contexts/UserContext";
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

export default function PasswordResetForm() {
  const { user } = useUser();
  const [formData, setFormData] = useState({
    password: "",
    confirmPassword: "",
  });

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value }); //handle the change of for an input with useState
  };
  const [
    updateUserPassword,
    {
      loading: updateUserRoleLoading,
      data: updateUserRoleData,
      error: updateUserRoleError,
    },
  ] = useMutation(UPDATE_USER_PASSWORD, {
    onError: (error) => {
      console.error("GraphQL Error updating user Profile", err.graphQLErrors);
      console.error("Network Error updating user Profile", err.networkError);
      console.error("Message updating user Profile", err.message);
    },
  });
  const { isOpen, onOpen, onClose } = useDisclosure();

  const handleFormSubmit = () => {
    updateUserPassword({
      variables: {
        userId: user._id,
        password: formData.password,
      },
    });
  };

  return (
    <>
      <Button
        {...ButtonStyles}
        {...SmallButtonStyle}
        onClick={() => {
          if (!user) {
            onClose();
          } else {
            onOpen();
          }
        }}
      >
        Reset Password
      </Button>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            <Center>
              <VStack>
                <Image src={logo} boxSize="70" />
                <Heading size="sm">My Profile</Heading>
              </VStack>
            </Center>
          </ModalHeader>
          <ModalCloseButton />
          <ModalHeader size="md">Update your details here</ModalHeader>
          <ModalBody>
            <FormControl as="form" onSubmit={handleFormSubmit}>
              <FormLabel htmlFor="password">New Password</FormLabel>
              <InputGroup>
                <Input
                  id="password"
                  {...InputStyles}
                  type="password"
                  placeholder="Password..."
                  name="password"
                  onChange={handleInputChange}
                  value={formData.password}
                  required
                />
              </InputGroup>

              <FormLabel htmlFor="passwordAgain">
                Confirm New Password
              </FormLabel>
              <InputGroup>
                <Input
                  id="passwordAgain"
                  {...InputStyles}
                  type="password"
                  placeholder="Confirm Password..."
                  name="passwordAgain"
                  onChange={handleInputChange}
                  value={formData.passwordAgain}
                  required
                />
              </InputGroup>
              <Button
                {...ButtonStyles}
                style={{ margin: "50px" }}
                disabled={
                  !(
                    formData.mobile &&
                    formData.email &&
                    formData.first &&
                    formData.last
                  )
                }
                type="submit"
                variant="success"
              >
                Submit
              </Button>
            </FormControl>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
}
