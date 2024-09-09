import { useEffect, useState } from "react";
import { useQuery } from "@apollo/client";
import { QUERY_PRODUCTS } from "../utils/queries"; // Adjust the path as necessary
import { QUERY_SERVICES } from "../utils/queries"; // Adjust the path as necessary
import {
  Heading,
  Spacer,
  Input,
  useDisclosure,
  Button,
  Textarea,
  Modal,
  Container,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  ModalFooter,
  FormLabel,
  Card,
  Switch, // Import ModalFooter for the button section
} from "@chakra-ui/react";
import {
  DisplayStyles,
  InputStyles,
  SmallInputStyle,
} from "./styles/InputStyles";
import { ButtonStyles, ButtonHighlightStyle } from "./styles/ButtonStyle";
import { ModalHeadingStyle } from "./styles/modalStyles";

const ProviderServiceSelect = ({ providerId }) => {
  const [products, setProducts] = useState([]);
  const [services, setServices] = useState([]);
  const [fullList, setFullList] = useState([]);

  const [hasError, setHasError] = useState(false);

  const {
    loading: loadingProducts,
    error: errorProducts,
    data: dataProducts,
    refetch: refetchProducts,
  } = useQuery(QUERY_PRODUCTS, {
    variables: {},
    skip: !providerId, // Skip query if no providerId is available
    onError: () => setHasError(true), // Set hasError state when error occurs
  });

  const {
    loading: loadingServices,
    error: errorServices,
    data: dataServices,
    refetch: refetchServices,
  } = useQuery(QUERY_SERVICES, {
    variables: { providerId: providerId },
    skip: !providerId, // Skip query if no providerId is available
    onError: () => setHasError(true), // Set hasError state when error occurs
  });

  useEffect(() => {
    if (
      dataProducts &&
      dataProducts.getProducts &&
      dataServices &&
      dataServices.getServices
    ) {
      const combinedList = [
        ...dataProducts.getProducts.products.map((product) => ({
          ...product,
          type: "product", // Add a type field to differentiate between products and services
          isActive: false, // Initial state, can be toggled by the user
        })),
        ...dataServices.getServices.services.map((service) => ({
          ...service,
          type: "service",
          isActive: true,
        })),
      ];

      setFullList(combinedList);
      setHasError(false); // Reset error state on successful data fetch
    }
  }, [dataProducts, dataServices]);

  const { isOpen, onOpen, onClose } = useDisclosure(); // this is used for the Chakra modal

  useEffect(() => {
    onClose();
  }, []);

  const handleFormSubmit = () => {};
  const handleInputChange = () => {};

  return (
    <>
      <Button
        {...ButtonStyles}
        onClick={() => {
          if (!providerId) {
            onClose();
          } else {
            onOpen();
          }
        }}
      >
        Services
      </Button>

      <Modal isOpen={isOpen} onClose={onClose} width={"80%"}>
        <ModalOverlay />
        <ModalContent maxWidth="900px" width="90%">
          <ModalHeader>
            <Heading {...ModalHeadingStyle}>Services</Heading>
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Spacer />
            {fullList.length ? (
              fullList.map((item, index) => (
                <div key={index}>
                  <Card borderWidth={"1px"}>
                    <FormLabel>Name</FormLabel>
                    <Input
                      id={`item-${index}`}
                      hidden="true"
                      value={item._id}
                    />
                    <Input
                      id={`item-${index}`}
                      {...DisplayStyles}
                      name={`itemName-${index}`}
                      onChange={handleInputChange}
                      value={item.name}
                      required
                    />
                    <FormLabel>Price</FormLabel>
                    <Input
                      id={`termsAndConditions-paragraph-${index}`}
                      {...InputStyles}
                      {...SmallInputStyle}
                      placeholder="Paragraph..."
                      name={`termsAndConditions-${index}-paragraph`}
                      onChange={handleInputChange}
                      value={item.price}
                      required
                    />
                    <Switch />
                  </Card>
                </div>
              ))
            ) : (
              <></>
            )}
            <Container centerContent>
              <Button
                {...ButtonStyles}
                {...ButtonHighlightStyle}
                style={{ margin: "50px" }}
                onClick={handleFormSubmit}
                variant="success"
              >
                Update
              </Button>
            </Container>
          </ModalBody>

          <ModalFooter></ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default ProviderServiceSelect;
