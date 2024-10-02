import React, { useEffect, useState, useRef } from "react";
import { isWithinRange, isNumber } from "../utils/helpers";
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
  const [codeIsValid, setCodeIsValid] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (isNumber(code) && isWithinRange(code, 4, 4)) {
      setMessage(false);
      setCodeIsValid(true);
      console.log("setCodeIsValid(true)", setCodeIsValid(true));
    } else {
      setMessage("Please enter a valid 6-digit code.");
      setCodeIsValid(false);
    }
  }, [code]);

  const handleCodeChange = (event) => {
    setCode(event.target.value);
    console.log(code);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      await onSubmit(code);

      onClose();
    } catch (error) {
      console.log(error);
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
                autoFocus={true}
                value={code}
                onChange={handleCodeChange}
                placeholder="Enter the 6-digit code"
                maxLength={6}
              />
            </FormControl>
            {message ? <Alert status="error">{message}</Alert> : <></>}
            <Button
              onClick={handleSubmit}
              disabled={codeIsValid}
              colorScheme="blue"
            >
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
