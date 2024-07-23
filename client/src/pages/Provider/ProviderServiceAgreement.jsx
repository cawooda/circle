import {
  FormControl,
  FormLabel,
  Input,
  FormErrorMessage,
  FormHelperText,
  Heading,
  Container,
  Spacer,
} from "@chakra-ui/react";
import { useEffect } from "react";

const InputStyling = {
  borderRadius: "50px",
  borderColor: "Black",
  borderWidth: "2px",
};

useEffect;

export default function ProviderServiceAgreement() {
  return (
    <Container>
      <Heading>Service Agreement</Heading>
      <Spacer />
      <FormControl>
        <FormLabel>Provider Name</FormLabel>
        <Input {...InputStyling}></Input>
      </FormControl>
      <FormControl>
        <FormLabel>Provider Address</FormLabel>
        <Input {...InputStyling}></Input>
      </FormControl>
      <FormControl>
        <FormLabel>Provider Abn</FormLabel>
        <Input {...InputStyling}></Input>
      </FormControl>
      <FormControl>
        <FormLabel>End Date</FormLabel>
        <Input {...InputStyling}></Input>
      </FormControl>
      <FormControl>
        <FormLabel>Customer</FormLabel>
        <Input {...InputStyling}></Input>
        <FormHelperText>Select Customer from List</FormHelperText>
      </FormControl>
    </Container>
  );
}
