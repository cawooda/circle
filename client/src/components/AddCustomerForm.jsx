import { useState, useEffect } from "react";
import { InputStyles } from "./styles/InputStyles";
import AuthService from "../utils/auth";
import {
  Button,
  Flex,
  Input,
  FormLabel,
  InputRightElement,
  Modal,
  InputGroup,
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
  Spacer,
} from "@chakra-ui/react";
import { IconButton } from "@chakra-ui/react";
import { AddIcon } from "@chakra-ui/icons";
import { ButtonStyles, ButtonHighlightStyle } from "./styles/ButtonStyle";
import { ModalHeadingStyle } from "./styles/modalStyles";
import { CardStyles } from "./styles/CardStyles";
import logo from "/logo.png";
import { useUser } from "../contexts/UserContext";

import { useMutation } from "@apollo/client";
import { ADD_CUSTOMER } from "../utils/mutations";

const AddCustomerForm = () => {
  const { user, refetchUser } = useUser();

  const [
    addCustomer,
    {
      loading: addCustomerLoading,
      data: addCustomerData,
      error: addCustomerError,
    },
  ] = useMutation(ADD_CUSTOMER, {
    onError: (error) => {
      console.error("GraphL Error updating user Profile", err.graphQLErrors);
      console.error("Network Error updating user Profile", err.networkError);
      console.error("Message updating user Profile", err.message);
    },
  });

  const { isOpen, onOpen, onClose } = useDisclosure(); //this is used for the Chakra modal

  const [formData, setFormData] = useState({
    providerId: user.roleProvider._id,
    first: "",
    last: "",
    mobile: "",
    email: "",
    invoiceEmail: "",
    referenceNumber: "",
    referenceName: "",
    datOfBirth: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleFormSubmit = async (event) => {
    event.preventDefault();
    const {
      providerId,
      first,
      last,
      mobile,
      email,
      invoiceEmail,
      referenceNumber,
      referenceName,
      datOfBirth,
    } = formData;

    const response = await addCustomer({
      variables: {
        token: AuthService.getToken(),
        providerId,
        first,
        last,
        mobile,
        email,
        invoiceEmail,
        referenceNumber,
        referenceName,
        datOfBirth,
      },
    });
    onClose();
    refetchUser();
  };

  if (user.roleProvider)
    return (
      <>
        <IconButton
          aria-label="Add Customer"
          onClick={() => {
            if (!user) {
              onClose();
            } else {
              onOpen();
            }
          }}
          icon={<AddIcon />}
          size="sm"
        />

        <Modal isOpen={isOpen} onClose={onClose}>
          <ModalOverlay />
          <ModalContent maxWidth="900px" width="90%">
            <ModalHeader>
              <Center>
                <VStack>
                  <Image src={logo} boxSize="20" />
                  <Heading {...ModalHeadingStyle}>Add Customer</Heading>
                </VStack>
              </Center>
            </ModalHeader>
            <ModalCloseButton />

            <ModalBody>
              <Flex direction="column" {...CardStyles} gap={20}>
                <FormControl as="form" gap={10} onSubmit={handleFormSubmit}>
                  <FormLabel>First Name:</FormLabel>
                  <Input
                    id="first"
                    {...InputStyles}
                    type="text"
                    placeholder="First name..."
                    name="first"
                    onChange={handleInputChange}
                    value={formData.first}
                    required
                  />

                  <FormLabel>Last Name:</FormLabel>
                  <Input
                    id="last"
                    {...InputStyles}
                    type="text"
                    placeholder="Last name..."
                    name="last"
                    onChange={handleInputChange}
                    value={formData.last}
                    required
                  />

                  <FormLabel>Mobile:</FormLabel>
                  <Input
                    id="mobile"
                    {...InputStyles}
                    type="tel"
                    placeholder="Mobile..."
                    name="mobile"
                    onChange={handleInputChange}
                    value={formData.mobile}
                    required
                  />

                  <FormLabel>Email:</FormLabel>
                  <Input
                    id="email"
                    {...InputStyles}
                    type="email"
                    placeholder="Email..."
                    name="email"
                    onChange={handleInputChange}
                    value={formData.email}
                    required
                  />

                  <FormLabel>Invoice Email:</FormLabel>
                  <Input
                    id="invoiceEmail"
                    {...InputStyles}
                    type="email"
                    placeholder="Invoice email..."
                    name="invoiceEmail"
                    onChange={handleInputChange}
                    value={formData.invoiceEmail}
                  />

                  <FormLabel>Reference Name(default is NDIS Number):</FormLabel>
                  <Input
                    id="referenceName"
                    {...InputStyles}
                    type="text"
                    placeholder="Reference name...eg. NDIS Number"
                    name="referenceName"
                    onChange={handleInputChange}
                    value={formData.referenceName || "NDIS Number"}
                  />
                  <FormLabel>Reference Number:</FormLabel>
                  <Input
                    id="referenceNumber"
                    {...InputStyles}
                    type="text"
                    placeholder="Reference number..."
                    name="referenceNumber"
                    onChange={handleInputChange}
                    value={formData.referenceNumber}
                  />

                  <FormLabel>Date of Birth:</FormLabel>
                  <Input
                    id="dateOfBirth"
                    {...InputStyles}
                    type="date"
                    placeholder="Date of birth..."
                    name="dateOfBirth"
                    onChange={handleInputChange}
                    value={formData.dateOfBirth || "1978-01-01"}
                  />

                  <Container centerContent>
                    <Button
                      {...ButtonStyles}
                      {...ButtonHighlightStyle}
                      style={{ margin: "50px" }}
                      disabled={
                        formData.first == "" ||
                        formData.last == "" ||
                        formData.mobile == "" ||
                        formData.email == "" ||
                        formData.invoiceEmail == "" ||
                        formData.referenceNumber == "" ||
                        formData.referenceName == "" ||
                        formData.datOfBirth == ""
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

export default AddCustomerForm;
