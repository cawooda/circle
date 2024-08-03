import React from "react";
import { FormControl, FormLabel, Input } from "@chakra-ui/react";
import { DisplayStyles } from "../styles/InputStyles";

export default function ProductDisplay({ product, quantity, total }) {
  if (!product) return null;
  return (
    <>
      <FormControl>
        <FormLabel>Product</FormLabel>
        <Input
          {...DisplayStyles}
          name="product"
          readOnly
          value={`${product.name}`}
        ></Input>
      </FormControl>
      <FormControl>
        <FormLabel>Quantity</FormLabel>
        <Input
          {...DisplayStyles}
          name="quantity"
          type="text"
          readOnly
          value={quantity}
        />
      </FormControl>
      <FormControl>
        <FormLabel>Total Cost</FormLabel>
        <Input
          {...DisplayStyles}
          name="totalCost"
          type="text"
          readOnly
          value={total}
        />
      </FormControl>
    </>
  );
}
