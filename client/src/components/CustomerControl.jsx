import React from "react";
import { FormControl, FormLabel, Select } from "@chakra-ui/react";

export default function CustomerControl({ customers, handleInputChange }) {
  return (
    <FormControl>
      <FormLabel>Customer</FormLabel>
      <Select
        name="customer"
        onClick={handleInputChange}
        onChange={handleInputChange}
      >
        {customers.map((customer, index) => {
          return (
            <option
              key={customer.value}
              selected={index === 0}
              value={customer.value}
            >
              {customer.label}
            </option>
          );
        })}
      </Select>
    </FormControl>
  );
}
