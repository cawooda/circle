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
  Spacer,
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";

import TermsAndConditions from "./TermsAndConditions";
import ProviderContactDetails from "./ProviderContactDetails";
import ProviderServiceSelect from "./ProviderServiceSelect";

import { ButtonStyles, ButtonHighlightStyle } from "./styles/ButtonStyle";
import { ModalHeadingStyle } from "./styles/modalStyles";
import { CardStyles } from "./styles/CardStyles";
import logo from "/logo.png";
import { useUser } from "../contexts/UserContext";

import { useMutation } from "@apollo/client";
import { UPDATE_PROVIDER_PROFILE } from "../utils/mutations";

const ProviderProfileForm = () => {
  const { user } = useUser();

  const [
    updateProviderProfile,
    {
      loading: updateProviderProfileLoading,
      data: updateProviderProfileData,
      error: updateProviderProfileError,
    },
  ] = useMutation(UPDATE_PROVIDER_PROFILE, {
    onError: (error) => {
      console.error("GraphL Error updating user Profile", error.graphQLErrors);
      console.error("Network Error updating user Profile", error.networkError);
      console.error("Message updating user Profile", error.message);
    },
  });
  const navigate = useNavigate();
  const { isOpen, onOpen, onClose } = useDisclosure(); //this is used for the Chakra modal

  const [formData, setFormData] = useState({
    providerId: user.roleProvider._id,
    providerName: user.roleProvider.providerName,
    abn: user.roleProvider.abn,
    termsAndConditions: user.roleProvider.termsAndConditions || [
      { heading: "", paragraph: "" },
    ],
    address: {
      street: user.roleProvider.address?.street || "d",
      city: user.roleProvider.address?.city || "d",
      state: user.roleProvider.address?.state || "d",
      postalCode: user.roleProvider.address?.postalCode || "d",
    },
    logo: null,
  });

  useEffect(() => {
    if (!user) {
      onOpen();
    }
  }, [user, onOpen]);

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onloadend = () => {
        setFormData((prev) => ({ ...prev, logo: reader.result }));
      };
    }
  };

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

      const updatedTerms = formData.termsAndConditions
        ? formData.termsAndConditions.map((tc, i) =>
            i === index ? { ...tc, [field]: value } : tc
          )
        : [];

      setFormData({
        ...formData,
        termsAndConditions: updatedTerms,
      });
    }
  };

  const handleFormSubmit = async (event) => {
    event.preventDefault(); // Prevent form reload
    const cleanedTermsAndConditions = formData.termsAndConditions.map(
      ({ __typename, ...rest }) => rest
    );
    const { providerName, abn, termsAndConditions, address, logo } = formData;

    try {
      const { data } = await updateProviderProfile({
        variables: {
          userId: user._id,
          providerId: formData.providerId,
          providerName,
          abn,
          cleanedTermsAndConditions,
          address,
          logo,
        },
      });

      console.log("Provider profile updated:", data);
      onClose();
    } catch (err) {
      console.error("Error submitting form:", err);
    }
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
                  <Heading {...ModalHeadingStyle}>Provider Profile</Heading>
                </VStack>
              </Center>
            </ModalHeader>
            <ModalCloseButton />

            <ModalBody>
              <Flex direction="column" {...CardStyles} gap={20}>
                <FormControl as="form" onSubmit={handleFormSubmit}>
                  <Flex direction="column" {...CardStyles}>
                    <TermsAndConditions
                      formData={formData}
                      handleInputChange={handleInputChange}
                      handleFormSubmit={() => {
                        onClose();
                        handleFormSubmit();
                      }}
                    />
                    <ProviderServiceSelect />
                  </Flex>
                  <ProviderContactDetails
                    formData={formData}
                    handleInputChange={handleInputChange}
                  />
                  <Spacer />
                  <FormControl>
                    <FormLabel>Upload Logo</FormLabel>
                    <Input
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                    />
                  </FormControl>
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

export default ProviderProfileForm;
