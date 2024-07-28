import {
  FormControl,
  FormLabel,
  Text,
  Box,
  Flex,
  Switch,
} from "@chakra-ui/react";
import React from "react";

const shifts = [
  {
    provider: "Provider A",
    customer: "Customer A",
    product: "Product A",
    duration: "4 hours",
    date: "2024-12-31",
  },
  {
    provider: "Provider B",
    customer: "Customer B",
    product: "Product B",
    duration: "6 hours",
    date: "2024-11-30",
  },
  // Add more shifts as needed
];

export default function ShiftsAdmin() {
  const shiftArray = shifts.map((shift, index) => (
    <Flex
      key={index}
      p={4}
      borderWidth={1}
      borderRadius="lg"
      boxShadow="sm"
      wrap="wrap"
      bg="white"
      m={2}
    >
      <Box>
        <strong>Provider:</strong>

        <Box borderRadius={30} borderWidth={2} px={3} m={1}>
          {shift.provider}
        </Box>
      </Box>
      <Box>
        <strong>Customer:</strong>
        <Box px={3} m={1}>
          {shift.customer}
        </Box>
      </Box>
      <Box>
        <strong>Product:</strong>
        <Box px={3} m={1}>
          {shift.product}
        </Box>
      </Box>
      <Box>
        <strong>Duration:</strong>
        <Box px={3} m={1}>
          {shift.duration}
        </Box>
      </Box>
      <Box>
        <strong>Date:</strong>
        <Box px={3} m={1}>
          {shift.date}
        </Box>
      </Box>
      <Box px={3} m={1}>
        <FormLabel htmlFor={`approve-switch-${index}`} mb="0">
          Approve
        </FormLabel>
        <Switch id={`approve-switch-${index}`} />
      </Box>
    </Flex>
  ));

  return (
    <Flex paddingTop={5} wrap="wrap" justify="center">
      {shiftArray}
    </Flex>
  );
}
