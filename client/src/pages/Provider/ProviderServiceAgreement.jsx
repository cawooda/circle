import {
  FormControl,
  FormLabel,
  Input,
  AlertIcon,
  AlertTitle,
  FormHelperText,
  Heading,
  Container,
  Spacer,
  Alert,
  Button,
} from "@chakra-ui/react";
import { useState, useEffect } from "react";
import Select from "react-select";
import { useQuery } from "@apollo/client";

//currently use state is seving the user. The following line relates to context which is not working

// import { useUser } from "../../utils/UserContext";
// const { currentUser } = useUser();

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

//the following relates to context which is not working

// const getUser = () => {
//   const { loading, data } = useQuery(QUERY_USER_BY_ID, {
//     variables: { id: AuthService.getProfile()._id },
//   });
//   const user = data?.user || [];
//   return setCurrentUser(user);
// };

// const { currentUser } = useUser();

export default function ProviderServiceAgreement() {
  //setup use State for customers
  const [customers, setCustomers] = useState([]);
  const [products, setProducts] = useState([]);
  //set query for customers
  const {
    loading: customerQueryLoading,
    error: customerQueryError,
    data: customerQueryData,
  } = useQuery(QUERY_CUSTOMERS);
  const [currentUser, setCurrentUser] = useState({});

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

  //use effects for queries
  useEffect(() => {
    if (!productQueryLoading && productQueryData) {
      const productList = productQueryData.getProducts.map((item) => ({
        value: item._id,
        label: item.name,
      }));
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
        value: item._id,
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
      <Heading>Service Agreement</Heading>
      <Spacer />
      {/* the following are hidden but used for submission */}
      <FormControl hidden={true}>
        {/* the following are hidden but used for submission */}
        <Input
          {...InputStyling}
          defaultValue={
            !userQueryLoading ? userQueryData.getUserById.roleProvider._id : ""
          }
        />
      </FormControl>
      <FormControl>
        <FormLabel>End Date</FormLabel>
        <Input {...InputStyling} type="date" />
      </FormControl>
      <FormControl>
        <FormLabel>Customer</FormLabel>
        <Select {...InputStyling} options={customers} />
        <FormHelperText>Select Customer from List</FormHelperText>
      </FormControl>
      <Spacer />
      <Container></Container>
      <FormControl>
        <FormLabel>Product</FormLabel>
        <Select {...InputStyling} options={products} />
        <FormHelperText>Select Customer from List</FormHelperText>
      </FormControl>
      <Container paddingTop={5}>
        <Button {...ButtonStyles}>Submit</Button>
      </Container>
    </Container>
  );
}
