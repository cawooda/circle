import { useState, useEffect } from "react";
import {
  Button,
  Flex,
  Input,
  FormLabel,
  InputRightElement,
  Modal,
  Textarea,
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

import { ButtonStyles, ButtonHighlightStyle } from "./styles/ButtonStyle";

import { InputStyles, InputTextareaStyles } from "./styles/InputStyles";

import logo from "/logo.png";
import { useUser } from "../contexts/UserContext";

import { useMutation } from "@apollo/client";
import { UPDATE_PROVIDER_PROFILE } from "../utils/mutations";

export default (ProviderProfileForm) => {
  const [
    updateProviderProfile,
    {
      loading: updateProviderProfileLoading,
      data: updateProviderProfileData,
      error: updateProviderProfileError,
    },
  ] = useMutation(UPDATE_PROVIDER_PROFILE, {
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
    providerId: user.roleProvider._id,
    providerName: user.roleProvider.providerName,
    abn: user.roleProvider.abn,
    termsAndConditions: user.roleProvider.termsAndConditions,
    address: {
      street: user.roleProvider.address.street,
      city: user.roleProvider.address.city,
      state: user.roleProvider.address.state,
      postalCode: user.roleProvider.address.postalCode,
    },
  });

  useEffect(() => {
    if (!user) {
      onOpen();
    }
  }, [user, onOpen]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    if (name === "providerName" || name === "abn") {
      setFormData({
        ...formData,
        [name]: value,
      });
    } else if (
      name === "street" ||
      name === "city" ||
      name === "state" ||
      name === "postalCode"
    ) {
      setFormData({
        ...formData,
        address: {
          ...formData.address,
          [name]: value,
        },
      });
    } else if (name.startsWith("termsAndConditions")) {
      const index = parseInt(name.split("-")[1], 10);
      const field = name.split("-")[2];

      const updatedTerms = formData.termsAndConditions.map((tc, i) =>
        i === index ? { ...tc, [field]: value } : tc
      );

      setFormData({
        ...formData,
        termsAndConditions: updatedTerms,
      });
    }
  };

  const handleFormSubmit = async (event) => {
    const { providerName, abn, termsAndConditions, address } = formData;

    const response = await updateProviderProfile({
      variables: {
        userId: user._id,
        providerId: formData.providerId,
        providerName,
        abn,
        termsAndConditions: termsAndConditions.map(
          ({ heading, paragraph }) => ({
            heading,
            paragraph,
          })
        ),
        address,
      },
    });
  };
  if (user.roleProvider)
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
          Provider Details
        </Button>

        <Modal isOpen={isOpen} onClose={onClose}>
          <ModalOverlay />
          <ModalContent maxWidth="900px" width="90%">
            <ModalHeader>
              <Center>
                <VStack>
                  <Image src={logo} boxSize="20" />
                  <Heading size="sm">Provider Profile</Heading>
                </VStack>
              </Center>
            </ModalHeader>
            <ModalCloseButton />

            <ModalBody>
              <Heading>Provider Details</Heading>
              <Flex direction="column" align="center" justify="center">
                <FormControl as="form" onSubmit={handleFormSubmit}>
                  <FormLabel htmlFor="providerName">Provider Name</FormLabel>
                  <Input
                    id="providerName"
                    {...InputStyles}
                    placeholder="Provider Name..."
                    name="providerName"
                    onChange={handleInputChange}
                    value={formData.providerName}
                    required
                  />

                  <FormLabel htmlFor="abn">ABN</FormLabel>
                  <Input
                    id="abn"
                    {...InputStyles}
                    placeholder="ABN..."
                    name="abn"
                    onChange={handleInputChange}
                    value={formData.abn}
                    required
                  />

                  <FormLabel htmlFor="street">Street</FormLabel>
                  <Input
                    id="street"
                    {...InputStyles}
                    placeholder="Street..."
                    name="street"
                    onChange={handleInputChange}
                    value={formData.address.street}
                    required
                  />

                  <FormLabel htmlFor="city">City</FormLabel>
                  <Input
                    id="city"
                    {...InputStyles}
                    placeholder="City..."
                    name="city"
                    onChange={handleInputChange}
                    value={formData.address.city}
                    required
                  />

                  <FormLabel htmlFor="state">State</FormLabel>
                  <Input
                    id="state"
                    {...InputStyles}
                    placeholder="State..."
                    name="state"
                    onChange={handleInputChange}
                    value={formData.address.state}
                    required
                  />

                  <FormLabel htmlFor="postalCode">Postal Code</FormLabel>
                  <Input
                    id="postalCode"
                    {...InputStyles}
                    placeholder="Postal Code..."
                    name="postalCode"
                    onChange={handleInputChange}
                    value={formData.address.postalCode}
                    required
                  />
                  <Heading>Terms and Conditions</Heading>
                  {formData.termsAndConditions.map((tc, index) => (
                    <div key={index}>
                      <FormLabel
                        fontSize={"1.5rem"}
                        htmlFor={`termsAndConditions-heading-${index}`}
                      >
                        Terms and Conditions Heading {index + 1}
                      </FormLabel>
                      <Input
                        id={`termsAndConditions-heading-${index}`}
                        {...InputStyles}
                        placeholder="Heading..."
                        name={`termsAndConditions-${index}-heading`}
                        onChange={handleInputChange}
                        value={tc.heading}
                        required
                      />

                      <FormLabel
                        fontSize={"1.5rem"}
                        htmlFor={`termsAndConditions-paragraph-${index}`}
                      >
                        Terms and Conditions Paragraph {index + 1}
                      </FormLabel>
                      <Textarea
                        id={`termsAndConditions-paragraph-${index}`}
                        {...InputStyles}
                        {...InputTextareaStyles}
                        placeholder="Paragraph..."
                        name={`termsAndConditions-${index}-paragraph`}
                        onChange={handleInputChange}
                        value={tc.paragraph}
                        required
                      />
                    </div>
                  ))}

                  <Container centerContent>
                    <Button
                      {...ButtonStyles}
                      {...ButtonHighlightStyle}
                      style={{ margin: "50px" }}
                      disabled={
                        !formData.providerName ||
                        !formData.abn ||
                        !formData.address.street ||
                        !formData.address.city ||
                        !formData.address.state ||
                        !formData.address.postalCode
                      }
                      type="submit"
                      variant="success"
                    >
                      Update Profile
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
