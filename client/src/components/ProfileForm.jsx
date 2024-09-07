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
import { ButtonStyles, ButtonHighlightStyle } from "./styles/ButtonStyle";

import { InputStyles } from "./styles/InputStyles";

import logo from "/logo.png";
import { useUser } from "../contexts/UserContext";

import { useMutation } from "@apollo/client";
import { UPDATE_USER_PROFILE } from "../utils/mutations";
import PasswordResetForm from "./PasswordResetForm";

import ProviderProfileForm from "./ProviderProfileForm";

const ProfileForm = () => {
  const [
    updateUserProfile,
    {
      loading: updateUserRoleLoading,
      data: updateUserRoleData,
      error: updateUserRoleError,
    },
  ] = useMutation(UPDATE_USER_PROFILE, {
    onError: (error) => {
      console.error("GraphQL Error updating user Profile", err.graphQLErrors);
      console.error("Network Error updating user Profile", err.networkError);
      console.error("Message updating user Profile", err.message);
    },
  });
  const navigate = useNavigate();
  const { isOpen, onOpen, onClose } = useDisclosure(); //this is used for the Chakra modal
  const { user, setUser } = useUser();

  const [formData, setFormData] = useState({
    first: user.first,
    last: user.last,
    mobile: user.mobile,
    email: user.email,
  });

  useEffect(() => {
    if (!user) {
      onOpen();
    }
  }, [user, onOpen]);

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value }); //handle the change of for an input with useState
  };

  const handleFormSubmit = async (event) => {
    const response = await updateUserProfile({
      variables: {
        userId: user._id,
        ...formData,
      },
    });
  };

  return (
    <>
      <Button
        {...ButtonStyles}
        onClick={() => {
          if (!user) {
            onClose();
          } else {
            onOpen();
          }
        }}
      >
        Profile
      </Button>

      <Modal isOpen={isOpen} onClose={onClose} width={"80%"}>
        <ModalOverlay />
        <ModalContent maxWidth="900px" width="90%">
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
            <Flex direction="row" gap="5  " wrap="wrap" paddingBottom={5}>
              <PasswordResetForm />
              {user.roleProvider ? <ProviderProfileForm user={user} /> : <></>}
            </Flex>
            <Flex direction="column" align="center" justify="center">
              <FormControl as="form" onSubmit={handleFormSubmit}>
                <FormLabel htmlFor="first">First Name</FormLabel>
                <Input
                  id="first"
                  {...InputStyles}
                  placeholder="First Name..."
                  name="first"
                  onChange={handleInputChange}
                  value={formData.first}
                  required
                />

                <FormLabel htmlFor="last">Last Name</FormLabel>
                <Input
                  id="last"
                  {...InputStyles}
                  placeholder="Last Name..."
                  name="last"
                  onChange={handleInputChange}
                  value={formData.last}
                  required
                />

                <FormLabel htmlFor="email">Email</FormLabel>
                <Input
                  id="email"
                  {...InputStyles}
                  placeholder="Email..."
                  name="email"
                  onChange={handleInputChange}
                  value={formData.email}
                  required
                />

                <FormLabel htmlFor="mobile">Mobile</FormLabel>
                <Input
                  id="mobile"
                  {...InputStyles}
                  placeholder="Mobile..."
                  name="mobile"
                  onChange={handleInputChange}
                  value={formData.mobile}
                  required
                />

                <Container centerContent>
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
                    Update
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
export default ProfileForm;
