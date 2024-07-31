import React from "react";
import {
  Container,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
} from "@chakra-ui/react";

export default function Error(component, message) {
  return (
    <Container paddingTop={10}>
      <Alert status="error">
        <AlertIcon />
        <AlertTitle>We recieved an error in {component.toString()}</AlertTitle>
        <AlertDescription>{message.toString()}</AlertDescription>
      </Alert>
    </Container>
  );
}
