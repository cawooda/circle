import React from "react";
import { FormControl, FormLabel, Input } from "@chakra-ui/react";
import { DisplayStyles } from "../styles/InputStyles";

export default function CustomerDisplay({ customer }) {
  if (!customer) return null;
  return (
    <>
      <FormControl>
        <FormLabel>Customer</FormLabel>
        <Input
          {...DisplayStyles}
          name="customer"
          readOnly
          value={`${customer.user.first} ${customer.user.last}`}
        ></Input>
      </FormControl>
      <FormControl>
        <FormLabel>NDIS Number</FormLabel>
        <Input
          {...DisplayStyles}
          name="ndisNumber"
          readOnly
          value={customer.ndisNumber}
        ></Input>
      </FormControl>
    </>
  );
}
