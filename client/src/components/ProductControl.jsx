import React from "react";
import { FormControl, FormLabel, Select } from "@chakra-ui/react";

export default function CustomerControl({ products, handleInputChange }) {
  return (
    <FormControl>
      <FormLabel>Product</FormLabel>
      <Select
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
  );
}
