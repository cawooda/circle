import { Outlet } from "react-router-dom";

import AuthService from "../utils/auth";
import { Container, Alert, AlertIcon, AlertTitle } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import SubMenu from "../components/SubMenu";

const userId = AuthService.getProfile()?.authenticatedPerson._id || false;

const menu = [
  { label: "New Agreement", link: "service-agreement" },
  { label: "Service Agreements", link: "service-agreements" },
  { label: "Shifts", link: "shifts" },
  { label: "Invoices", link: "invoices" },
];

export default function ProviderLayout() {
  return (
    <>
      <SubMenu items={menu} />
      {userId ? (
        <Outlet />
      ) : (
        <Container paddingTop={10}>
          <Alert status="error">
            <AlertIcon />
            <AlertTitle>You Need to Be logged in for this</AlertTitle>
          </Alert>
        </Container>
      )}
    </>
  );
}
