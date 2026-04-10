import React from "react";

import { Outlet } from "react-router-dom";
import SubMenu from "../components/SubMenu";

const menu = [
  { label: "Service Agreements", link: "service-agreements" },
  { label: "Shifts", link: "shifts" },
  { label: "Invoices", link: "invoices" },
];

export default function CustomerLayout() {
  return (
    <>
      <SubMenu items={menu} />
      <Outlet />
    </>
  );
}
