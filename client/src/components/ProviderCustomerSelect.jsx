import { useEffect, useState } from "react";

import {
  Heading,
  Spacer,
  Button,
  Modal,
  Container,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  ModalFooter,
  useDisclosure,
  Alert,
} from "@chakra-ui/react";
import { ButtonStyles, ButtonHighlightStyle } from "./styles/ButtonStyle";

import ProductList from "./ProductList";
import ServiceList from "./ServiceList";
import { useUser } from "../contexts/UserContext";

const ProviderCustomerSelect = ({
  formData,
  handleInputChange,
  handleFormSubmit,
}) => {
  const { user } = useUser();
  const [products, setProducts] = useState([]);

  const { isOpen, onOpen, onClose } = useDisclosure();

  if (!user.roleProvider) return <Alert>User is not a provider</Alert>;

  return (
    <>
      <Button {...ButtonStyles} onClick={onOpen}>
        Services
      </Button>
      <Modal isOpen={isOpen} onClose={onClose} width={"80%"}>
        <ModalOverlay />
        <ModalContent maxWidth="900px" width="90%">
          <ModalHeader></ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Spacer />
            <ServiceList />
            <ProductList />
            <Container centerContent>
              <Button
                {...ButtonStyles}
                {...ButtonHighlightStyle}
                style={{ margin: "50px" }}
                onClick={() => {
                  onClose();
                  handleFormSubmit();
                }}
                variant="success"
              >
                Update
              </Button>
            </Container>
          </ModalBody>
          <ModalFooter>
            <Button onClick={onClose} {...ButtonStyles}>
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default ProviderServiceSelect;
