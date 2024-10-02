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
  ModalFooter, // Import ModalFooter for the button section
} from "@chakra-ui/react";
import { InputStyles, InputTextareaStyles } from "./styles/InputStyles";
import { ButtonStyles, ButtonHighlightStyle } from "./styles/ButtonStyle";
import { ModalHeadingStyle } from "./styles/modalStyles";

const TermsAndConditions = ({
  formData,
  handleInputChange,
  handleFormSubmit,
}) => {
  const { isOpen, onOpen, onClose } = useDisclosure(); // this is used for the Chakra modal
  console.log(formData.termsAndConditions);
  return (
    <>
      <Button
        {...ButtonStyles}
        onClick={() => {
          if (!formData.termsAndConditions) {
            onClose();
          } else {
            onOpen();
          }
        }}
      >
        Terms And Conditions
      </Button>

      <Modal isOpen={isOpen} onClose={onClose} width={"80%"}>
        <ModalOverlay />
        <ModalContent maxWidth="900px" width="90%">
          <ModalHeader>
            <Heading {...ModalHeadingStyle}>Terms and Conditions</Heading>
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Spacer />
            {formData.termsAndConditions.map((tc, index) => (
              <div key={index}>
                <Input
                  id={`termsAndConditions-heading-${index}`}
                  {...InputStyles}
                  placeholder="Heading..."
                  name={`termsAndConditions-${index}-heading`}
                  onChange={handleInputChange}
                  value={tc.heading}
                  required
                />

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
                onClick={handleFormSubmit}
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

export default TermsAndConditions;
