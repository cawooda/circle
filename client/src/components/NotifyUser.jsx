import React from "react";
import {
  Container,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
} from "@chakra-ui/react";

export default function NotifyUser({ component, message }) {
  return (
    <Container paddingTop={10}>
      <Alert status="info">
        <AlertIcon />
        <AlertTitle>{component}</AlertTitle>
        <AlertDescription>{message}</AlertDescription>
      </Alert>
    </Container>
  );
}
