import { FormLabel, Heading, Input, Flex, Spacer } from "@chakra-ui/react";
import { InputStyles } from "./styles/InputStyles";
import { ModalHeadingStyle } from "./styles/modalStyles";

const ProviderDetails = ({ formData, handleInputChange, handleSubmit }) => {
  return (
    <>
      <Heading {...ModalHeadingStyle}>Provider Details</Heading>
      <FormLabel htmlFor="providerName">Provider Name</FormLabel>
      <Input
        id="providerName"
        {...InputStyles}
        placeholder="Provider Name..."
        name="providerName"
        onChange={handleInputChange}
        value={formData.providerName}
        required
      />

      <FormLabel htmlFor="abn">ABN</FormLabel>
      <Input
        id="abn"
        {...InputStyles}
        placeholder="ABN..."
        name="abn"
        onChange={handleInputChange}
        value={formData.abn}
        required
      />

      <FormLabel htmlFor="street">Street</FormLabel>
      <Input
        id="street"
        {...InputStyles}
        placeholder="Street..."
        name="street"
        onChange={handleInputChange}
        value={formData.address.street}
        required
      />

      <FormLabel htmlFor="city">City</FormLabel>
      <Input
        id="city"
        {...InputStyles}
        placeholder="City..."
        name="city"
        onChange={handleInputChange}
        value={formData.address.city}
        required
      />

      <FormLabel htmlFor="state">State</FormLabel>
      <Input
        id="state"
        {...InputStyles}
        placeholder="State..."
        name="state"
        onChange={handleInputChange}
        value={formData.address.state}
        required
      />

      <FormLabel htmlFor="postalCode">Postal Code</FormLabel>
      <Input
        id="postalCode"
        {...InputStyles}
        placeholder="Postal Code..."
        name="postalCode"
        onChange={handleInputChange}
        value={formData.address.postalCode}
        required
      />
      <Spacer />
    </>
  );
};

export default ProviderDetails;
