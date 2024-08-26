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
import { DisplayStyles, InputStyles } from "./styles/InputStyles";
import { ButtonStyles, ButtonHighlightStyle } from "./styles/ButtonStyle";
import { useMutation } from "@apollo/client";
import { TOGGLE_USER_ROLE, UPDATE_USER_PROFILE } from "../utils/mutations";

export default function ServiceAgreementRow({ agreement, index, userId }) {
  //variables to manage state
  const [formData, setFormData] = useState({
    _id: userId,
    provider: agreement.provider,
    customer: agreement.customer.user.fullName,
    startDate: agreement.startDate,
    product: agreement.product?.name,
    service: agreement?.service?.product?.name,
    quantity: agreement.quantity,
    endDate: agreement.endDate,
    totaPrice: agreement.totalPrice,
    approvedByCustomer: agreement.approvedByCustomer,
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
    updateUserProfile({
      variables: {
        userId: user._id,
        ...formData,
      },
    });
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
              <FormLabel>Customer</FormLabel>
              <Input
                {...InputStyles}
                name="customer"
                value={formData.customer}
                onChange={handleChange}
              ></Input>
            </Box>
            <Box>
              <FormLabel>Product</FormLabel>
              <Input
                {...InputStyles}
                name="product"
                value={formData.product}
                onChange={handleChange}
              ></Input>
            </Box>
            <Box>
              <FormLabel>Service</FormLabel>
              <Input
                {...InputStyles}
                name="service"
                value={formData.service}
                onChange={handleChange}
              ></Input>
            </Box>
            <Box>
              <FormLabel>Quantity</FormLabel>
              <Input
                {...InputStyles}
                name="quantity"
                value={formData.quantity}
                onChange={handleChange}
              ></Input>
            </Box>
            <Box>
              <FormLabel>Total Price</FormLabel>
              <Input
                {...InputStyles}
                name="quantity"
                value={formData.quantity}
                onChange={handleChange}
              ></Input>
            </Box>
            <Flex borderRadius={1} borderWidth={1} padding={3}>
              <Box>
                <FormLabel htmlFor={`approvded-switch-${index}`} mb="0">
                  Approved By Customer
                </FormLabel>
                <Switch
                  id={`approvded-switch-${index}`}
                  name="approvedByCustomer"
                  isChecked={formData.approvedByCustomer}
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
