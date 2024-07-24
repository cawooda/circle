import React from "react";
import SupportSubMenu from "../components/AdminSubMenu";
import { Outlet } from "react-router-dom";

export default function Support() {
  return (
    <>
      <SupportSubMenu />
      <Outlet />
    </>
  );
}
