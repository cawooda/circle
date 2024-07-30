import React from "react";
import CustomerSubMenu from "./Customer/_CustomerSubMenu";
import { Outlet } from "react-router-dom";

export default function Customer() {
  return (
    <>
      <CustomerSubMenu />
      <Outlet />
    </>
  );
}
