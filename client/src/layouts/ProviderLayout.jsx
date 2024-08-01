import { Outlet } from "react-router-dom";

import AuthService from "../utils/auth";
import {
  Container,
  Heading,
  Alert,
  AlertIcon,
  AlertTitle,
  Spacer,
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import SubMenu from "../components/SubMenu";
import SigninForm from "../components/SigninForm";

const menu = [
  { label: "New Agreement", link: "service-agreement" },
  { label: "Service Agreements", link: "service-agreements" },
  { label: "Shifts", link: "shifts" },
  { label: "Invoices", link: "invoices" },
];
import { useUser } from "../contexts/UserContext";

export default function ProviderLayout() {
  const { user, setUser, loading, error } = useUser();
  if (loading) return <p>Loading...</p>;
  if (error) {
    console.log("error", error);
    return <SigninForm user={user} />;
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
