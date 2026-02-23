import React from "react";

import { Outlet } from "react-router-dom";
import SubMenu from "../components/SubMenu";

const menu = [
  { label: "Users", link: "users" },
  { label: "Service Agreements", link: "service-agreements" },
  { label: "Shifts", link: "shifts" },
  { label: "Invoices", link: "invoices" },
  { label: "Providers", link: "providers" },
];

export default function AdminLayout() {
  return (
    <>
      <SubMenu items={menu} />
      <Outlet />
    </>
  );
}
