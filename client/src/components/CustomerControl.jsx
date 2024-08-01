import React from "react";
import { FormControl, FormLabel, Select } from "@chakra-ui/react";

export default function CustomerControl({
  customers,
  handleInputChange,
  locked,
}) {
  return (
    <FormControl>
      <FormLabel>Customer</FormLabel>
      <Select
        readOnly={locked || false}
        name="customer"
        onClick={handleInputChange}
        onChange={handleInputChange}
        defaultValue={customers.length > 0 ? customers[0].value : ""}
      >
        {customers.map((customer, index) => {
          return (
            <option key={customer.value} value={customer.value}>
              {customer.label}
            </option>
          );
        })}
      </Select>
    </FormControl>
  );
}
