import React from "react";

import { Outlet } from "react-router-dom";
import SubMenu from "../components/SubMenu";
import { useUser } from "../contexts/UserContext";

const menu = [
  { label: "Service Agreements", link: "service-agreements" },
  { label: "Shifts", link: "shifts" },
  { label: "Invoices", link: "invoices" },
];

export default function CustomerLayout() {
  const { user, setUser, loading, error } = useUser();
  console.log("user", user);
  return (
    <>
      <SubMenu items={menu} />
      <Outlet />
    </>
  );
}
