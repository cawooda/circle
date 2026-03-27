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
  const [password, setPassword] = useState("");
  const [codeIsValid, setCodeIsValid] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (isWithinRange(code, 4, 4)) {
      setMessage(false);
      setCodeIsValid(true);
    } else {
      setMessage("Please enter a valid 4-digit code.");
      setCodeIsValid(false);
    }
  }, [code, password]);

  const handleCodeChange = (event) => {
    setCode(event.target.value);
  };
  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      await onSubmit(code, password);

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
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    handleSubmit(e);
                  }
                }}
                placeholder="Enter 4-digit code we sent to you"
                maxLength={6}
              />
              <FormLabel htmlFor="password">Password</FormLabel>
              <Input
                id="password"
                type="text"
                value={password}
                onChange={handlePasswordChange}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    handleSubmit(e);
                  }
                }}
                placeholder="password"
                minLength={10}
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
