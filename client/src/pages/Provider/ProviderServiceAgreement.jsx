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
import { useQuery, useMutation } from "@apollo/client";
import Splash from "../../components/splash";
import { useNavigate } from "react-router-dom";

//currently use state is seving the user. The following line relates to context which is not working

// import { useCurrentUser } from "../../utils/UserContext";

import {
  QUERY_USER_BY_ID,
  QUERY_CUSTOMERS,
  QUERY_PRODUCTS,
} from "../../utils/queries";
import { ADD_SERVICE_AGREEMENT } from "../../utils/mutations";
import AuthService from "../../utils/auth";
import { ButtonStyles } from "../../components/ButtonStyle";

const InputStyling = {
  borderRadius: "50px",
  borderColor: "Black",
  borderWidth: "2px",
};

export default function ProviderServiceAgreement() {
  //const { currentUser } = useCurrentUser();

  const [splashVisible, setSplashVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setSplashVisible(false);
    }, 3000); // 3 seconds

    return () => clearTimeout(timer); // Cleanup the timer
  }, [splashVisible]);

  //setup use State for customers
  const [agreementFormData, setAgreementFormData] = useState({
    endDate: dayjs().format("YYYY-MM-DD"),
  });
  const [customers, setCustomers] = useState([]);
  const [products, setProducts] = useState([]);
  const [currentUser, setCurrentUser] = useState({});

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

  const [
    addServiceAgreement,
    {
      loading: AddServiceAgreementLoading,
      data: AddServiceAgreementData,
      error: AddServiceAgreementError,
    },
  ] = useMutation(ADD_SERVICE_AGREEMENT, {
    onError: (err) => {
      console.error("GraphQL Error:", err.graphQLErrors);
      console.error("Network Error:", err.networkError);
      console.error("Message:", err.message);
    },
  });

  const navigate = useNavigate();

  //implement this throughout the app and change window.location into the following router hook
  useEffect(() => {
    if (!AuthService.loggedIn()) {
      AuthService.logout();
      navigate("/");
    }
  }, []);

  useEffect(() => {
    setAgreementFormData({
      provider: !userQueryLoading
        ? userQueryData?.getUserById.roleProvider?._id
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
    if (!userQueryLoading && !userQueryError && userQueryData.roleCustomer) {
      console.log(
        "current user should be set as customer",
        userQueryData.roleCustomer
      );
      setCurrentUser(userQueryData.getUserById);
    }
  }, [userQueryLoading, userQueryData]);

  useEffect(() => {
    if (!customerQueryLoading && customerQueryData) {
      const customerList = customerQueryData.getCustomers.map((customer) => ({
        value: customer._id,
        label: customer.user.first,
      }));

      setCustomers(customerList);
    }
  }, [customerQueryLoading, customerQueryData]);

  const handleInputChange = (event) => {
    console.log("agreementFormData", agreementFormData);
    if (event.target.name) {
      const { name, value } = event.target;
      setAgreementFormData((prevState) => ({ ...prevState, [name]: value })); //handle the change of for an input with useState
    } else {
    }
    console.log("agreementFormData", agreementFormData);
  };

  function handleFormSubmit(event) {
    event.preventDefault();
    console.log("agreementFormData", agreementFormData);

    try {
      addServiceAgreement({
        variables: {
          provider: agreementFormData.provider,
          customer: agreementFormData.customer,
          endDate: agreementFormData.endDate,
          product: agreementFormData.product,
          quantity: parseInt(agreementFormData.quantity),
        },
      });
      setSplashVisible(true);
      navigate("/support");
    } catch (error) {
      console.log(error);
    }
  }

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
  if (!userQueryData?.getUserById.roleProvider)
    return (
      <Container paddingTop={10}>
        <Alert status="error">
          {console.log(userQueryData)}
          <AlertIcon />
          <AlertTitle>
            Your current role is not provider. You will need to gain provider
            access.
          </AlertTitle>
        </Alert>
      </Container>
    );
  return (
    <Container>
      <div>
        <Splash visible={splashVisible} />
      </div>
      <Heading>Service Agreement</Heading>
      <Spacer />
      {/* the following are hidden but used for submission */}
      <FormControl hidden={false}>
        <FormLabel>Provider Id</FormLabel>
        <Input
          name="provider"
          {...InputStyling}
          defaultValue={
            !userQueryLoading
              ? userQueryData?.getUserById.roleProvider?._id
              : ""
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
