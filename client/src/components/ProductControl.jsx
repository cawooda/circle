import React from "react";
import {
  FormControl,
  FormLabel,
  Select,
  NumberInput,
  NumberInputField,
} from "@chakra-ui/react";
import { InputStyles } from "./InputStyles";

export default function CustomerControl({
  products,
  handleInputChange,
  locked,
}) {
  return (
    <>
      <FormControl>
        <FormLabel>Product</FormLabel>
        <Select
          readOnly={locked || false}
          name="product"
          onClick={handleInputChange}
          onChange={handleInputChange}
        >
          {products.map((product, index) => {
            return (
              <option
                key={product.value}
                selected={index === 0}
                value={product.value}
              >
                {product.label}
              </option>
            );
          })}
        </Select>
      </FormControl>
      <FormControl>
        <FormLabel>Quantity</FormLabel>
        <NumberInput>
          <NumberInputField
            {...InputStyles}
            readOnly={locked || false}
            name="quantity"
            onInput={handleInputChange}
          />
        </NumberInput>
      </FormControl>
    </>
  );
}
