import dayjs from "dayjs";
import {
  FormControl,
  FormLabel,
  Input,
  AlertIcon,
  AlertTitle,
  Heading,
  Container,
  Spacer,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  Select,
  Alert,
  Button,
} from "@chakra-ui/react";
import { useState, useEffect } from "react";
//import Select from "react-select";
import { useQuery } from "@apollo/client";

//currently use state is seving the user. The following line relates to context which is not working

// import { useCurrentUser } from "../../utils/UserContext";

import {
  QUERY_USER_BY_ID,
  QUERY_CUSTOMERS,
  QUERY_PRODUCTS,
} from "../../utils/queries";
import AuthService from "../../utils/auth";
import { ButtonStyles } from "../../components/ButtonStyle";

const InputStyling = {
  borderRadius: "50px",
  borderColor: "Black",
  borderWidth: "2px",
};

export default function ProviderServiceAgreement() {
  // const { currentUser } = useCurrentUser();
  console.log(currentUser);
  //setup use State for customers
  const [agreementFormData, setAgreementFormData] = useState({
    endDate: dayjs().format("YYYY-MM-DD"),
  });
  const [customers, setCustomers] = useState([]);
  const [products, setProducts] = useState([]);
  //const [currentUser, setCurrentUser] = useState({});

  const handleInputChange = (event) => {
    if (event.target.name) {
      const { name, value } = event.target;
      setAgreementFormData({ ...agreementFormData, [name]: value }); //handle the change of for an input with useState
      console.log(event.target);
      console.log(agreementFormData);
    } else {
    }
  };

  function handleFormSubmit(event) {
    event.preventDefault();
    console.log(agreementFormData);
    try {
    } catch (error) {
      console.log(error);
    }
  }

  //set query for customers
  const {
    loading: customerQueryLoading,
    error: customerQueryError,
    data: customerQueryData,
  } = useQuery(QUERY_CUSTOMERS);

  //set query for user information
  const {
    loading: userQueryLoading,
    error: userQueryError,
    data: userQueryData,
  } = useQuery(QUERY_USER_BY_ID, {
    variables: { id: AuthService.getProfile().authenticatedPerson._id },
  });
  //product list query
  const {
    loading: productQueryLoading,
    error: productQueryError,
    data: productQueryData,
  } = useQuery(QUERY_PRODUCTS);

  useEffect(() => {
    setAgreementFormData({
      provider: !userQueryLoading
        ? userQueryData.getUserById.roleProvider._id
        : "",
    });
  }, [userQueryLoading, userQueryData]);

  //use effects for queries
  useEffect(() => {
    if (!productQueryLoading && productQueryData) {
      console.log(productQueryData);
      const productList = productQueryData.getProducts.map((item) => ({
        value: item._id,
        label: item.name,
      }));
      console.log(productList);
      setProducts(productList);
    }
  }, [productQueryLoading, productQueryData]);

  useEffect(() => {
    if (!userQueryLoading && userQueryData) {
      setCurrentUser(userQueryData.getUserById);
    }
  }, [userQueryLoading, userQueryData]);

  useEffect(() => {
    if (!customerQueryLoading && customerQueryData) {
      const customerList = customerQueryData.getCustomers.map((item) => ({
        value: item.user._id,
        label: item.user.first,
      }));

      setCustomers(customerList);
    }
  }, [customerQueryLoading, customerQueryData]);

  if (userQueryLoading)
    return (
      <Container paddingTop={10}>
        <Alert status="info">
          <AlertIcon />
          <AlertTitle>Loading Info about Your Service</AlertTitle>
        </Alert>
      </Container>
    );
  if (userQueryError)
    return (
      <Container paddingTop={10}>
        <Alert status="error">
          <AlertIcon />
          <AlertTitle>
            We recieved an error loading your data. try refresh and make sure
            you are logged in.
          </AlertTitle>
        </Alert>
      </Container>
    );
  return (
    <Container>
      <Heading>{currentUser.email}</Heading>
      <Heading>Service Agreement</Heading>
      <Spacer />
      {/* the following are hidden but used for submission */}
      <FormControl hidden={true}>
        <Input
          name="provider"
          {...InputStyling}
          defaultValue={
            !userQueryLoading ? userQueryData.getUserById.roleProvider._id : ""
          }
          onChange={handleInputChange}
        />
      </FormControl>
      {/* end invisible inputs */}
      <FormControl>
        <FormLabel>End Date</FormLabel>
        <Input
          {...InputStyling}
          name="endDate"
          type="date"
          value={agreementFormData.endDate || ""}
          onChange={handleInputChange}
        />
      </FormControl>
      <FormControl>
        <FormLabel>Customer</FormLabel>
        <Select
          name="customer"
          onChange={handleInputChange}
          value={agreementFormData.customer}
        >
          {customers.map((customer) => {
            return (
              <option key={customer.value} value={customer.value}>
                {customer.label}
              </option>
            );
          })}
        </Select>
      </FormControl>
      <Spacer />
      <Container></Container>
      <FormControl>
        <FormLabel>Product</FormLabel>
        <Select
          {...InputStyling}
          name="product"
          onChange={handleInputChange}
          value={agreementFormData.product}
        >
          {products.map((customer) => {
            return (
              <option key={customer.value} value={customer.value}>
                {customer.label}
              </option>
            );
          })}
        </Select>
      </FormControl>
      <FormControl>
        <FormLabel>Quantity</FormLabel>
        <NumberInput>
          <NumberInputField
            {...InputStyling}
            name="quantity"
            onInput={handleInputChange}
            value={agreementFormData.quantity}
          />
          <NumberInputStepper>
            <NumberIncrementStepper />
            <NumberDecrementStepper />
          </NumberInputStepper>
        </NumberInput>
      </FormControl>
      <Container paddingTop={5}>
        <Button {...ButtonStyles} onClick={handleFormSubmit}>
          Submit
        </Button>
      </Container>
    </Container>
  );
}
