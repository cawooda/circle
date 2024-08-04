import { useState } from "react";
import {
  Button,
  Input,
  Flex,
  Box,
  FormControl,
  FormLabel,
  Switch,
} from "@chakra-ui/react";
import { DisplayStyles, InputStyles } from "../styles/InputStyles";
import { ButtonStyles, ButtonHighlightStyle } from "../styles/ButtonStyle";
import { useMutation } from "@apollo/client";
import { TOGGLE_USER_ROLE, UPDATE_USER_PROFILE } from "../../utils/mutations";

export default function UserAdminRow({ user, index }) {
  const [
    updateUserProfile,
    {
      loading: updateUserRoleLoading,
      data: updateUserRoleData,
      error: updateUserRoleError,
    },
  ] = useMutation(UPDATE_USER_PROFILE, {
    onError: (error) => {
      console.error("GraphQL Error updating user Profile", err.graphQLErrors);
      console.error("Network Error updating user Profile", err.networkError);
      console.error("Message updating user Profile", err.message);
    },
  });
  const [
    toggleUserRole,
    {
      loading: toggleUserRoleLoading,
      data: toggleUserRoleData,
      error: toggleUserRoleError,
    },
  ] = useMutation(TOGGLE_USER_ROLE, {
    onError: (err) => {
      console.error("GraphQL Error toggling user role", err.graphQLErrors);
      console.error("Network Error toggling user role", err.networkError);
      console.error("Message toggling user role", err.message);
    },
  });
  //variables to manage state
  const [formData, setFormData] = useState({
    _id: user._id,
    first: user.first,
    last: user.last,
    mobile: user.mobile,
    email: user.email,
    isAdmin: user.roleAdmin,
    isProvider: user.roleProvider,
    isCustomer: user.roleCustomer,
  });

  //Change handler
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleAdminChange = async (e) => {
    const response = await toggleUserRole({
      variables: {
        userId: formData._id,
        role: "admin",
      },
    });
    setFormData((prev) => ({ ...prev, isAdmin: !prev.isAdmin }));
  };
  const handleProviderChange = async (e) => {
    const response = await toggleUserRole({
      variables: {
        userId: formData._id,
        role: "provider",
      },
    });
    setFormData((prev) => ({ ...prev, isProvider: !prev.isProvider }));
  };
  const handleCustomerChange = async (e) => {
    const response = await toggleUserRole({
      variables: {
        userId: formData._id,
        role: "customer",
      },
    });
    setFormData((prev) => ({ ...prev, isCustomer: !prev.isCustomer }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    updateUserProfile({
      variables: {
        userId: user._id,
        ...formData,
      },
    });
    console.log("formdata", formData);
  };

  return (
    <>
      <form onSubmit={handleSubmit}>
        <FormControl wrap="wrap">
          <Flex
            key={index}
            p={2}
            gap={2}
            borderWidth={2}
            borderRadius="lg"
            boxShadow="sm"
            wrap="wrap"
            m={2}
          >
            <Box>
              <FormLabel>ID</FormLabel>
              <Input
                {...DisplayStyles}
                name="_id"
                readOnly
                value={formData._id}
                onInput={handleChange}
              ></Input>
            </Box>
            <Box>
              <FormLabel>First</FormLabel>
              <Input
                {...InputStyles}
                name="first"
                value={formData.first}
                onChange={handleChange}
              ></Input>
            </Box>
            <Box>
              <FormLabel>Last</FormLabel>
              <Input
                {...InputStyles}
                name="last"
                value={formData.last}
                onChange={handleChange}
              ></Input>
            </Box>
            <Box>
              <FormLabel>Email</FormLabel>
              <Input
                {...InputStyles}
                name="email"
                value={formData.email}
                onChange={handleChange}
              ></Input>
            </Box>
            <Box>
              <FormLabel>Mobile</FormLabel>
              <Input
                {...InputStyles}
                name="mobile"
                value={formData.mobile}
                onChange={handleChange}
              ></Input>
            </Box>

            <Flex borderRadius={1} borderWidth={1} padding={3}>
              <Box>
                <FormLabel htmlFor={`admin-switch-${index}`} mb="0">
                  Admin
                </FormLabel>
                <Switch
                  id={`admin-switch-${index}`}
                  name="isAdmin"
                  isChecked={formData.isAdmin}
                  onChange={handleAdminChange}
                />
              </Box>
              <Box>
                <FormLabel htmlFor={`approve-switch-${index}`} mb="0">
                  Provider
                </FormLabel>
                <Switch
                  id={`provider-switch-${index}`}
                  name="isProvider"
                  isChecked={formData.isProvider}
                  onChange={handleProviderChange}
                />
              </Box>
              <Box>
                <FormLabel htmlFor={`customer-switch-${index}`} mb="0">
                  Customer
                </FormLabel>
                <Switch
                  id={`customer-switch-${index}`}
                  name="isCustomer"
                  isChecked={formData.isCustomer}
                  onChange={handleCustomerChange}
                />
              </Box>
            </Flex>
            <Box alignSelf={"end"}>
              <Button
                type="submit"
                onClick={handleSubmit}
                {...ButtonStyles}
                {...ButtonHighlightStyle}
              >
                Update
              </Button>
            </Box>
          </Flex>
        </FormControl>
      </form>
    </>
  );
}
