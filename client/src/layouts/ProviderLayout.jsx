import { Outlet } from "react-router-dom";
import { useState } from "react";
import {
  Container,
  Heading,
  Alert,
  AlertIcon,
  AlertTitle,
  Spacer,
} from "@chakra-ui/react";

import SubMenu from "../components/SubMenu";
import SigninForm from "../components/SigninForm";
import { useUser } from "../contexts/UserContext";
import AuthService from "../utils/auth";

const menu = [
  { highlight: true, label: "New Agreement", link: "service-agreement" },
  { label: "Service Agreements", link: "service-agreements" },
  { label: "Shifts", link: "shifts" },
  { label: "Consent", link: "consent" },
  { label: "Invoices", link: "invoices" },
];

import Splash from "../components/Splash";

export default function ProviderLayout() {
  const { loggedIn, setLoggedIn } = useState(AuthService.loggedIn());
  const { user, loading, error } = useUser();
  if (loading) return <Splash />;
  if (error) {
    console.log("error", error);
    return <SigninForm loggedIn={loggedIn} setLoggedIn={setLoggedIn} />;
  }
  if (user)
    return (
      <>
        <Container paddingBottom={5}>
          <Heading textAlign="right" size="sm">
            Hello {user.first}
          </Heading>
        </Container>
        <SubMenu items={menu} />

        {user ? (
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
