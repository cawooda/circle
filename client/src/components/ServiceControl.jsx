import React from "react";
import {
  FormControl,
  FormLabel,
  Select,
  NumberInput,
  NumberInputField,
} from "@chakra-ui/react";
import { InputStyles } from "./styles/InputStyles";
import { useAuth } from "../contexts/AuthContext";

export default function ServiceControl({ handleInputChange, locked }) {
  const { user } = useAuth();
  if (!user.roleProvider.services) return null;

  return (
    <>
      <FormControl>
        <FormLabel>Service</FormLabel>
        <Select
          readOnly={locked || false}
          name="service"
          onClick={handleInputChange}
          onChange={handleInputChange}
        >
          <option value="">-- Select a service --</option>

          {user.roleProvider.services.length
            ? user.roleProvider.services.map((service, index) => {
                return (
                  <option key={service._id} value={service._id}>
                    {service.product.name}
                  </option>
                );
              })
            : ""}
        </Select>
      </FormControl>
      <FormControl>
        <FormLabel>Quantity</FormLabel>
        <NumberInput>
          <NumberInputField
            {...InputStyles}
            readOnly={locked || false}
            name="serviceQuantity"
            onInput={handleInputChange}
          />
        </NumberInput>
      </FormControl>
    </>
  );
}
