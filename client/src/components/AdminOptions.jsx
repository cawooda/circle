import {
  Container,
  FormControl,
  FormLabel,
  HStack,
  Input,
} from "@chakra-ui/react";
import React from "react";
import { InputStyles } from "./styles/InputStyles";

export default function AdminOptions() {
  return (
    <>
      <Container padding="10px">
        <HStack>
          <FormControl>
            <FormLabel>Start</FormLabel>
            <Input {...InputStyles} type="date"></Input>
          </FormControl>
          <FormControl>
            <FormLabel>End</FormLabel>
            <Input {...InputStyles} type="date"></Input>
          </FormControl>
          <FormControl>
            <FormLabel>Customer</FormLabel>
            <Input {...InputStyles}></Input>
          </FormControl>
          <FormControl>
            <FormLabel>Provider</FormLabel>
            <Input {...InputStyles}></Input>
          </FormControl>
        </HStack>
      </Container>
    </>
  );
}
