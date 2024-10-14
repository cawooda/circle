import dayjs from "dayjs";
import { useState, useEffect } from "react";
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
import { useUser } from "../contexts/UserContext";
import { CardStyles } from "./styles/CardStyles";
import CustomerControl from "./CustomerControl";

export default function ShiftRow({ shift, index }) {
  const { user, loading, error } = useUser();
  const [customerList, setCustomerList] = useState([]);
  if (!user || loading || error) {
    return null; // Don't render anything if user is not available
  }
  console.log(shift.start_time);
  const [shiftFormData, setShiftFormData] = useState({
    _id: shift._id || "", // Ensure a safe fallback
    customer: shift.customer.fullName || "",
    start_date: dayjs(shift.start_time).format("YYYY-MM-DD"),
    end_date: dayjs(shift.end_time).format("YYYY-MM-DD"),
    start_time: dayjs(shift.start_time).format("HH:mm"),
    end_time: dayjs(shift.end_time).format("HH:mm"),
    serviceName: shift.service.product.name || "",
    units: shift.units || "",
  });

  useEffect(() => {
    setCustomerList(
      user.roleProvider.linkedCustomers.map((customer) => {
        return {
          value: customer._id,
          label: `${customer.user.first} ${customer.user.last}`,
        };
      })
    );
  }, [user]);

  const handleInputChange = (event) => {
    if (event.target.name) {
      const { name, value } = event.target;
      setShiftFormData((prevState) => ({ ...prevState, [name]: value })); //handle the change of for an input with useState
    } else {
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    mutation({
      variables: {
        userId: user._id,
        ...setShiftFormData,
      },
    });
  };

  return (
    <form onSubmit={handleSubmit}>
      <FormControl wrap="wrap">
        <Flex key={index} {...CardStyles} wrap="wrap" m={2}>
          <FormControl hidden={true}>
            <FormLabel>Shift Id</FormLabel>
            <Input
              name="_id"
              {...InputStyles}
              value={shift._id}
              onChange={handleInputChange}
            />
          </FormControl>

          <CustomerControl
            handleInputChange={handleInputChange}
            customers={customerList}
            value={shift.customer._id}
          />
          <FormControl>
            <Flex direction="row" gap={2}>
              <FormLabel>Start Date</FormLabel>
              <Input
                {...InputStyles}
                name="start_date"
                type="date"
                value={shiftFormData.start_date}
                onChange={handleInputChange}
              />
              <FormLabel>Start Time</FormLabel>
              <Input
                {...InputStyles}
                name="start_time"
                type="time"
                value={shiftFormData.start_time || ""}
                onChange={handleInputChange}
              />
            </Flex>
            <Flex direction="row" gap={2}>
              <FormLabel>End Date</FormLabel>
              <Input
                {...InputStyles}
                name="end_date"
                type="date"
                value={shiftFormData.end_date}
                onChange={handleInputChange}
              />
              <FormLabel>End Time</FormLabel>
              <Input
                {...InputStyles}
                name="end_time"
                type="time"
                value={shiftFormData.end_time || ""}
                onChange={handleInputChange}
              />
            </Flex>
          </FormControl>

          <Box alignSelf={"end"}>
            <Button type="submit" {...ButtonStyles} {...ButtonHighlightStyle}>
              Update
            </Button>
          </Box>
        </Flex>
      </FormControl>
    </form>
  );
}
