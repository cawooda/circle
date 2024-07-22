import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";
import { Grid, GridItem } from "@chakra-ui/react";
import SideBar from "../components/SideBar";

const mainGridItemProps = {
  as: "main",
  colSpan: { base: 12, md: 10, xl: 5 },
};

export default function RootLayout() {
  return (
    // repeats the grid column 6 * 1 fraction
    <Grid templateColumns="repeat(12,1fr)" bg="gray.50">
      <SideBar {...mainGridItemProps} />
      <GridItem>
        <Navbar />
        <Outlet />
      </GridItem>
    </Grid>
  );
}
