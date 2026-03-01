import React from "react";
import {
  FormControl,
  FormLabel,
  Select,
  NumberInput,
  NumberInputField,
} from "@chakra-ui/react";
import { InputStyles } from "./styles/InputStyles";
import { useUser } from "../contexts/UserContext";

export default function ProductControl({ handleInputChange, locked }) {
  const { user } = useUser();
  if (!user.roleProvider.products) return null;

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
          <option value="">-- Select a product --</option>

          {user.roleProvider.products.length
            ? user.roleProvider.products.map((product, index) => {
                return (
                  <option key={product._id} value={product._id}>
                    {product.name}
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
            name="productQuantity"
            onInput={handleInputChange}
          />
        </NumberInput>
      </FormControl>
    </>
  );
}
