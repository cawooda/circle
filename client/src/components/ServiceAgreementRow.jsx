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
import { useUser } from "../contexts/UserContext";
import { CardStyles } from "./styles/CardStyles";

export default function ServiceAgreementRow({ agreement, index }) {
  const { user, loading, error } = useUser();
  if (!user) {
    return null; // Don't render anything if user is not available
  }

  const provider = agreement.provider || {};
  const customer = agreement.customer || {};
  const customerUser = customer.user || {};
  const fullName = `${customerUser.first} ${customerUser.last}` || "N/A"; // Fallback if fullName is undefined

  const product = agreement.product || {};
  const service = agreement.service || {};

  // Provide default text if product is null
  const productName = product ? product.name : "No product name";
  const serviceName = service ? service.name : "No service name";

  const [formData, setFormData] = useState({
    _id: user._id || "", // Ensure a safe fallback
    provider: provider.providerName || "",
    customer: fullName || "",
    startDate: agreement.startDate || "",
    product: productName,
    service: serviceName,
    quantity: agreement.quantity || 0,
    endDate: agreement.endDate || "",
    totalPrice: agreement.totalPrice || 0,
    agreementNumber: agreement.agreementNumber || "",
    approvedByCustomer: agreement.approvedByCustomer || false,
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
    mutation({
      variables: {
        userId: user._id,
        ...formData,
      },
    });
  };

  //Form Fields
  const fields = [
    { label: "ID", name: "_id", readOnly: true },
    { label: "Customer", name: "customer" },
    { label: "Product", name: "product" },
    { label: "Service", name: "service" },
    { label: "Quantity", name: "quantity" },
    { label: "Total Price", name: "totalPrice" },
  ];

  return (
    <form onSubmit={handleSubmit}>
      <FormControl wrap="wrap">
        <Flex key={index} {...CardStyles} wrap="wrap" m={2}>
          {fields.map((field, index) => (
            <Box key={index}>
              <FormLabel>{field.label}</FormLabel>
              <Input
                {...(field.readOnly ? DisplayStyles : InputStyles)}
                name={field.name}
                value={formData[field.name]}
                onChange={handleChange}
                readOnly={field.readOnly}
              />
            </Box>
          ))}
          <Flex borderRadius={1} borderWidth={1} padding={3}>
            <Box>
              <FormLabel htmlFor={`approved-switch-${index}`} mb="0">
                Approved By Customer
              </FormLabel>
              <Switch
                id={`approved-switch-${index}`}
                name="approvedByCustomer"
                isChecked={formData.approvedByCustomer}
                onChange={handleChange}
              />
            </Box>
          </Flex>
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
