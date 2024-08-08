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
  Select,
  Alert,
  Button,
  AlertDescription,
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";

import { useState, useEffect } from "react";

import Splash from "../../components/Splash";

import AuthService from "../../utils/auth";

import { useQuery, useMutation } from "@apollo/client";
import {
  QUERY_USER_BY_ID,
  QUERY_CUSTOMERS,
  QUERY_PRODUCTS,
} from "../../utils/queries";
import { ADD_SERVICE_AGREEMENT } from "../../utils/mutations";

import { ButtonStyles } from "../../components/styles/ButtonStyle";
import { InputStyles } from "../../components/styles/InputStyles";
import CustomerControl from "../../components/CustomerControl";
import ProductControl from "../../components/ProductControl";

export default function ProviderServiceAgreement() {
  const navigate = useNavigate();
  //use States
  const [userId, setUserId] = useState(
    AuthService?.getProfile()?.authenticatedPerson?._id || false
  );
  const [splashVisible, setSplashVisible] = useState(true);
  //setup use State for customers
  const [agreementFormData, setAgreementFormData] = useState({
    endDate: dayjs().format("YYYY-MM-DD"),
  });
  const [customers, setCustomers] = useState([]);
  const [products, setProducts] = useState([]);
  const [currentUser, setCurrentUser] = useState({});

  useEffect(() => {
    const timer = setTimeout(() => {
      setSplashVisible(false);
    }, 1500); // 3 seconds

    return () => clearTimeout(timer); // Cleanup the timer
  }, [splashVisible]);

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
    variables: { id: userId },
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
      console.error(
        "GraphQL Error adding service agreement:",
        err.graphQLErrors
      );
      console.error(
        "Network Error adding service agreement:",
        err.networkError
      );
      console.error("Message adding service agreement:", err.message);
    },
  });

  //implement this throughout the app and change window.location into the following router hook
  useEffect(() => {
    if (!userId) {
      AuthService.logout();
      navigate("/");
    }
  }, [userId, userQueryLoading]);

  useEffect(() => {
    setAgreementFormData({
      provider: !userQueryLoading ? userQueryData?.getMe.roleProvider?._id : "",
    });
  }, [userQueryLoading, userQueryData]);

  //use effects for queries
  useEffect(() => {
    if (!productQueryLoading && productQueryData) {
      const productList = productQueryData.getProducts.map((product) => ({
        value: product._id,
        label: product.name,
      }));
      productList.unshift({ value: "00000--0000", label: "...choose product" });

      setProducts(productList);
    }
  }, [productQueryLoading, productQueryData]);

  useEffect(() => {
    if (!userQueryLoading && !userQueryError && userQueryData.roleCustomer) {
      setCurrentUser(userQueryData.getMe);
    }

    if (!customerQueryLoading && customerQueryData) {
      const customerList = customerQueryData.getCustomers.map((customer) => {
        return {
          value: customer._id,
          label: `${customer.user.first} ${customer.user.last}`,
        };
      });
      customerList.unshift({
        value: "00000--0000",
        label: "...choose customer",
      });
      setCustomers(customerList);
    }
    //try to set the default end date to 3 months from now
    const defaultEndDate = dayjs().add(3, "month").format("YYYY-MM-DD");
    setAgreementFormData((prevState) => ({
      ...prevState,
      endDate: defaultEndDate,
    }));
  }, [
    userQueryLoading,
    userQueryData,
    customerQueryLoading,
    customerQueryData,
  ]);

  const handleInputChange = (event) => {
    if (event.target.name) {
      const { name, value } = event.target;
      setAgreementFormData((prevState) => ({ ...prevState, [name]: value })); //handle the change of for an input with useState
    } else {
    }
  };

  async function handleFormSubmit(event) {
    event.preventDefault();

    setSplashVisible(true);
    try {
      const newServiceAgreement = await addServiceAgreement({
        variables: {
          provider: agreementFormData.provider,
          customer: agreementFormData.customer,
          endDate: new Date(agreementFormData.endDate),
          product: agreementFormData.product,
          quantity: parseInt(agreementFormData.quantity),
        },
      });

      if (newServiceAgreement?.data?.addServiceAgreement?.agreementNumber) {
        navigate(
          `/customer/agreement/${newServiceAgreement.data.addServiceAgreement.agreementNumber}`
        );
      } else navigate("/customer");
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  if (userQueryLoading || customerQueryLoading || !userId) {
    return (
      <Container paddingTop={10}>
        <Alert status="info">
          <AlertIcon />
          <AlertTitle>Loading Info about Your Service</AlertTitle>
          <AlertDescription>
            {userQueryLoading ? "loading user data... " : ""}
            {customerQueryLoading ? "loading user data... " : ""}
            {!userId ? "You need to be signed in..." : ""}
          </AlertDescription>
        </Alert>
      </Container>
    );
  }
  if (userQueryError)
    return (
      <Container paddingTop={10}>
        <Alert status="error">
          <AlertIcon />
          <AlertTitle>
            We recieved an error loading your data. try refresh and make sure
            you are logged in. {userQueryError.message}
          </AlertTitle>
          <AlertDescription>
            {userQueryError
              ? "Error loading user data...are you logged in? "
              : ""}
            {customerQueryError
              ? "loading customer data... please notify Admin "
              : ""}
            {!userQueryData
              ? "It doesent look like you have a provider account "
              : ""}
          </AlertDescription>
        </Alert>
      </Container>
    );
  if (!userQueryData.getMe.roleProvider)
    return (
      <Container paddingTop={10}>
        <Alert status="error">
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
      <FormControl hidden={true}>
        <FormLabel>Provider Id</FormLabel>
        <Input
          name="provider"
          {...InputStyles}
          defaultValue={
            !userQueryLoading ? userQueryData?.getMe.roleProvider?._id : ""
          }
          onChange={handleInputChange}
        />
      </FormControl>
      {/* end invisible inputs */}
      <FormControl>
        <FormLabel>End Date</FormLabel>
        <Input
          {...InputStyles}
          name="endDate"
          type="date"
          value={agreementFormData.endDate || ""}
          onChange={handleInputChange}
        />
      </FormControl>
      <CustomerControl
        handleInputChange={handleInputChange}
        customers={customers}
      />

      <Spacer />
      <ProductControl
        handleInputChange={handleInputChange}
        products={products}
      />
      <Container paddingTop={5}>
        <Button {...ButtonStyles} onClick={handleFormSubmit}>
          Submit
        </Button>
      </Container>
    </Container>
  );
}
