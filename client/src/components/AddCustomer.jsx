import React from "react";
import { IconButton } from "@chakra-ui/react";
import { AddIcon } from "@chakra-ui/icons";

export default function AddCustomer({ handleSubmit }) {
  return (
    <IconButton
      aria-label="Add Customer"
      icon={<AddIcon />}
      size="sm"
      //   onClick={handleSubmit}
    />
  );
}
