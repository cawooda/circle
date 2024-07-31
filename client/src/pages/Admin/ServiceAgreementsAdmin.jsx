import {
  FormControl,
  FormLabel,
  Text,
  Box,
  Flex,
  Switch,
} from "@chakra-ui/react";
import React from "react";

const serviceAgreements = [
  {
    provider: "Provider A",
    customer: "Customer A",
    value: "$1000",
    endDate: "2024-12-31",
    product: "Product A",
  },
  {
    provider: "Provider A",
    customer: "Customer A",
    value: "$1000",
    endDate: "2024-12-31",
    product: "Product A",
  },
  {
    provider: "Provider A",
    customer: "Customer A",
    value: "$1000",
    endDate: "2024-12-31",
    product: "Product A",
  },
  {
    provider: "Provider B",
    customer: "Customer B",
    value: "$2000",
    endDate: "2024-11-30",
    product: "Product B",
  },
  // Add more service agreements as needed
];

export default function ServiceAgreementsAdmin() {
  const serviceAgreementArray = serviceAgreements.map((agreement, index) => (
    <Flex
      key={index * 122}
      p={4}
      borderWidth={1}
      borderRadius="lg"
      boxShadow="sm"
      wrap="wrap"
      bg="white"
    >
      <Box borderRadius={30} borderWidth={2} px={3}>
        <strong>Provider:</strong> {agreement.provider}
      </Box>
      <Box px={3}>
        <strong>Customer:</strong> {agreement.customer}
      </Box>
      <Box px={3}>
        <strong>Value:</strong> {agreement.value}
      </Box>
      <Box px={3}>
        <strong>End Date:</strong> {agreement.endDate}
      </Box>
      <Box px={3}>
        <strong>Product:</strong> {agreement.product}
      </Box>
      <Switch id="email-alerts" />
    </Flex>
  ));
  return (
    <Flex paddingTop={5} wrap="wrap" justify="center">
      {serviceAgreementArray}
    </Flex>
  );
}
