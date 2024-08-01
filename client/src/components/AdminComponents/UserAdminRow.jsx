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
import { DisplayStyles, InputStyles } from "../InputStyles";
import { ButtonStyles, ButtonHighlightStyle } from "../ButtonStyle";

export default function UserAdminRow({ user, index }) {
  //variables to manage state
  const [formData, setFormData] = useState({
    _id: user._id,
    first: user.first,
    mobile: user.mobile,
    isAdmin: false,
    isProvider: false,
    isCustomer: false,
  });

  //Change handler
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
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
                value={formData._id}
                onInput={handleChange}
              ></Input>
            </Box>
            <Box>
              <FormLabel>Last</FormLabel>
              <Input
                {...InputStyles}
                name="first"
                value={formData.first}
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
                  onChange={handleChange}
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
                  onChange={handleChange}
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
                  onChange={handleChange}
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
