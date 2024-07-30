import { Outlet } from "react-router-dom";
import ProviderSubMenu from "../pages/Provider/_ProviderSubMenu";
import AuthService from "../utils/auth";
import {
  Heading,
  Container,
  Alert,
  AlertIcon,
  AlertTitle,
} from "@chakra-ui/react";

const userId = AuthService.getProfile()?.authenticatedPerson._id || false;

export default function Provider() {
  if (userId) {
    return (
      <>
        <ProviderSubMenu />
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
  } else {
    navigate("/");
  }
}
