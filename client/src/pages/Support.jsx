import React from "react";
import SupportSubMenu from "../pages/Support/_SupportSubMenu";
import { Outlet } from "react-router-dom";

export default function Support() {
  return (
    <>
      <SupportSubMenu />
      <Outlet />
    </>
  );
}
