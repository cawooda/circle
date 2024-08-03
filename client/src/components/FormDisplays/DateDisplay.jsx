import React from "react";
import { FormControl, FormLabel, Input } from "@chakra-ui/react";
import { DisplayStyles } from "../styles/InputStyles";

export default function DateDisplay({ date }) {
  return (
    <FormControl>
      <FormLabel>End Date</FormLabel>
      <Input
        {...DisplayStyles}
        name="endDate"
        type="text"
        readOnly
        value={date}
      />
    </FormControl>
  );
}
