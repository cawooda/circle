import React from "react";
import {
  Button,
  Input,
  Grid,
  GridItem,
  FormLabel,
  Container,
} from "@chakra-ui/react";
import { ButtonStyles } from "./ButtonStyle";

export default function AdminOptionsPanel() {
  return (
    <Container>
      <FormLabel>Provider</FormLabel>
      <Input {...ButtonStyles} type="text" />
      <FormLabel>Customer</FormLabel>
      <Input {...ButtonStyles} type="text" />
    </Container>
  );
}
