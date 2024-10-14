import { useState, useEffect } from "react";
import React from "react";
import {
  FormControl,
  FormLabel,
  InputGroup,
  InputRightElement,
  Select,
  IconButton,
} from "@chakra-ui/react";
import { AddIcon } from "@chakra-ui/icons";

import { useUser } from "../contexts/UserContext";
import AddCustomerForm from "./AddCustomerForm";

export default function CustomerControl({
  handleInputChange,
  locked,
  defaultValue,
}) {
  const { provider } = useUser();
  const [customers, setCustomers] = useState([]);

  console.log("provider", provider);
  useEffect(() => {
    if (provider?.linkedCustomers) {
      const customerList = provider?.linkedCustomers.map((customer) => {
        return {
          value: customer._id,
          label: `${customer.user?.first || "first"} ${
            customer.user?.last || "last"
          }`,
        };
      });
      customerList.unshift({
        value: "00000--0000",
        label: "...choose customer",
      });
      setCustomers(customerList);
    }
  }, [provider]);

  if (!provider) return null;

  return (
    <FormControl>
      <FormLabel>Customer</FormLabel>
      <InputGroup>
        <Select
          readOnly={locked || false}
          name="customer"
          onClick={handleInputChange}
          onChange={handleInputChange}
        >
          {customers.map((customer, index) => {
            return (
              <option key={customer.value} value={customer.value}>
                {customer.label}
              </option>
            );
          })}
        </Select>
        <InputRightElement width="3rem">
          <AddCustomerForm />
        </InputRightElement>
      </InputGroup>
    </FormControl>
  );
}
