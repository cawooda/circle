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

import {
  QUERY_USER_BY_ID,
  QUERY_PRODUCTS,
  QUERY_SERVICE_AGREEMENT,
} from "../../utils/queries";
// import { SIGN_SERVICE_AGREEMENT } from "../../utils/mutations";
import AuthService from "../../utils/auth";
import { ButtonStyles } from "../../components/ButtonStyle";

import { Routes, Route, useParams } from "react-router-dom";

const InputStyling = {
  borderRadius: "50px",
  borderColor: "Black",
  borderWidth: "2px",
};

export default function SupportServiceAgreement() {
  let { agreementNumber } = useParams();

  const {
    loading: userQueryLoading,
    error: userQueryError,
    data: userQueryData,
  } = useQuery(QUERY_USER_BY_ID, {
    variables: { id: AuthService.getProfile().authenticatedPerson._id },
  });

  const {
    loading: agreementQueryLoading,
    error: agreementQueryError,
    data: agreementQueryData,
  } = useQuery(QUERY_SERVICE_AGREEMENT, {
    variables: { agreementNumber },
  });

  //product list query
  const {
    loading: productQueryLoading,
    error: productQueryError,
    data: productQueryData,
  } = useQuery(QUERY_PRODUCTS);

  // const [
  //   signServiceAgreement,
  //   {
  //     loading: AddServiceAgreementLoading,
  //     data: AddServiceAgreementData,
  //     error: AddServiceAgreementError,
  //   },
  // ] = useMutation(SIGN_SERVICE_AGREEMENT, {
  //   onError: (err) => {
  //     console.error("GraphQL Error:", err.graphQLErrors);
  //     console.error("Network Error:", err.networkError);
  //     console.error("Message:", err.message);
  //   },
  // });

  //const { currentUser } = useCurrentUser();

  const [products, setProducts] = useState([]);
  const [agreementFormData, setAgreementFormData] = useState({});

  const [currentUser, setCurrentUser] = useState({});

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
    //   addServiceAgreement({
    //     variables: {
    //       provider: agreementFormData.provider,
    //       customer: agreementFormData.customer,
    //       endDate: agreementFormData.endDate,
    //       product: agreementFormData.product,
    //       quantity: parseInt(agreementFormData.quantity),
    //     },
    //   });
    //   try {
    //   } catch (error) {
    //     console.log(error);
    //   }
  }

  //set query for customers
  // const {
  //   loading: customerQueryLoading,
  //   error: customerQueryError,
  //   data: customerQueryData,
  // } = useQuery(QUERY_CUSTOMERS);

  //set query for user information

  //

  //use effects
  useEffect(() => {
    setAgreementFormData({
      provider: !userQueryLoading
        ? userQueryData.getUserById.roleCustomer?._id
        : "",
    });
  }, [userQueryLoading, userQueryData]);

  //use effects for queries
  useEffect(() => {
    if (!agreementQueryLoading && agreementQueryData) {
      console.log("agreementQueryData", agreementQueryData);
      setAgreementFormData((prev) => ({ ...prev, agreementFormData }));
    }

    if (!productQueryLoading && productQueryData) {
      console.log(productQueryData);
      const productList = productQueryData.getProducts.map((item) => ({
        value: item._id,
        label: item.name,
      }));

      setProducts(productList);
    }
  }, [
    productQueryLoading,
    productQueryData,
    agreementQueryData,
    agreementQueryData,
  ]);

  console.log(
    "checking agreement loading for provider _id",
    !agreementQueryLoading ? agreementQueryData : ""
  );

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
  if (!userQueryData.getUserById.roleCustomer)
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
      <Heading>Service Agreement</Heading>
      <Spacer />
      {/* the following are hidden but used for submission */}
      <FormControl>
        <Input
          name="provider"
          {...InputStyling}
          defaultValue={
            !agreementQueryLoading
              ? agreementQueryData.getServiceAgreement.provider?._id
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
          defaultValue={
            !agreementQueryLoading
              ? agreementQueryData.getServiceAgreement.endDate
              : dayjs()
          }
          onChange={handleInputChange}
        />
      </FormControl>
      <FormControl>
        <FormLabel>Customer</FormLabel>
        <Input
          name="customer"
          onChange={handleInputChange}
          value={
            !userQueryLoading ? userQueryData.getUserById.roleCustomer._id : ""
          }
        ></Input>
        {<p>replace with details from params {agreementNumber}</p>}
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

// export default function SupportServiceAgreement() {
//   return (
//     <Container>This will contain a support service agreement form</Container>
//   );
// }

//_______________________________________________________________________________________________________

// import { useCurrentUser } from "../../utils/UserContext";
