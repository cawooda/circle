import React from "react";

import { Outlet } from "react-router-dom";
import SubMenu from "../components/SubMenu";
import { AdminProvider } from "../contexts/AdminContext";

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
      <AdminProvider>
        <SubMenu items={menu} />
        <Outlet />
      </AdminProvider>
    </>
  );
}
