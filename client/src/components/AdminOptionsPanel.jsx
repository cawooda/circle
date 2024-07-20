import React from "react";
import { Button, Input, Grid, GridItem, FormLabel } from "@chakra-ui/react";
import { ButtonStyles } from "./ButtonStyle";

export default function AdminOptionsPanel() {
  return (
    <Grid templateColumns="repeat(6, 1fr)" gap="5px">
      <GridItem colSpan={1}>
        <FormLabel>Start</FormLabel>
        <Input {...ButtonStyles} type="date" />
      </GridItem>
      <GridItem colSpan={1}>
        <FormLabel>End</FormLabel>
        <Input {...ButtonStyles} type="date" />
      </GridItem>
      <GridItem colSpan={2}>
        <FormLabel>Provider</FormLabel>
        <Input {...ButtonStyles} type="text" />
      </GridItem>
      <GridItem colSpan={2}>
        <FormLabel>Customer</FormLabel>
        <Input {...ButtonStyles} type="text" />
      </GridItem>
    </Grid>
  );
}
