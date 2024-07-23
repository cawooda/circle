import React from "react";
import AdminSubMenu from "../components/AdminSubMenu";
import { Outlet } from "react-router-dom";

export default function Admin() {
  return (
    <>
      <AdminSubMenu />
      <Outlet />
    </>
  );
}
