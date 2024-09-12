import React from "react";
import { FormControl, FormLabel, Input } from "@chakra-ui/react";
import { DisplayStyles } from "../styles/InputStyles";

export default function ServiceDisplay({ service, quantity, total }) {
  console.log(service);

  return (
    <>
      <FormControl>
        <FormLabel>Service</FormLabel>
        <Input
          {...DisplayStyles}
          name="service"
          readOnly
          value={`${service.product.name}`}
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
