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
import Select from "react-select";
import { useUser } from "../../utils/UserContext";
// const { currentUser } = useUser();

const options = [
  { value: "ID", label: "CustomerName" },
  { value: "ID2", label: "CustomerName2" },
  { value: "ID3", label: "CustomerName3" },
];

const InputStyling = {
  borderRadius: "50px",
  borderColor: "Black",
  borderWidth: "2px",
};

export default function ProviderServiceAgreement() {
  // const { currentUser } = useUser();
  return (
    <Container>
      <Heading>Service Agreement</Heading>
      <Spacer />
      <FormControl>
        <FormLabel>Provider Name</FormLabel>
        <Input
          {...InputStyling}
          // default={currentUser.roleProvider.providerName}
        ></Input>
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
        <Select {...InputStyling} options={options} />
        <FormHelperText>Select Customer from List</FormHelperText>
      </FormControl>
    </Container>
  );
}
