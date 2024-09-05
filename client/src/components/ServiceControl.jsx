import React from "react";
import {
  FormControl,
  FormLabel,
  Select,
  NumberInput,
  NumberInputField,
} from "@chakra-ui/react";
import { InputStyles } from "./styles/InputStyles";

export default function ServiceControl({
  services,
  handleInputChange,
  locked,
}) {
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
          {services.length
            ? services.map((service, index) => {
                return (
                  <option
                    key={service.value}
                    selected={index === 0}
                    value={service.value}
                  >
                    {service.label}
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
