import React, { useState } from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  Button,
  Input,
  FormControl,
  FormLabel,
  Alert,
  VStack,
  Center,
  useDisclosure,
} from "@chakra-ui/react";

const SmsCodeModal = ({ isOpen, onClose, onSubmit }) => {
  const [code, setCode] = useState("");
  const [message, setMessage] = useState("");

  const handleCodeChange = (event) => {
    setCode(event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (code.length !== 4) {
      setMessage("Please enter a valid 6-digit code.");
      return;
    }

    try {
      await onSubmit(code);
      onClose();
    } catch (error) {
      setMessage("Invalid code. Please try again.");
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Enter the SMS Code</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <VStack spacing={4}>
            <FormControl>
              <FormLabel htmlFor="code">Code</FormLabel>
              <Input
                id="code"
                type="text"
                value={code}
                onChange={handleCodeChange}
                placeholder="Enter the 6-digit code"
                maxLength={6}
              />
            </FormControl>
            {message && <Alert status="error">{message}</Alert>}
            <Button onClick={handleSubmit} colorScheme="blue">
              Submit
            </Button>
          </VStack>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default SmsCodeModal;
``;
