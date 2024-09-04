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
import SignatureCanvas from "react-signature-canvas";
import { useState, useEffect, useRef } from "react";

import { useUser } from "../../contexts/UserContext";

import AuthService from "../../utils/auth";

import { useQuery, useMutation } from "@apollo/client";
import { QUERY_CUSTOMERS, QUERY_PRODUCTS } from "../../utils/queries";
import { ADD_SERVICE_AGREEMENT } from "../../utils/mutations";

import { ButtonStyles } from "../../components/styles/ButtonStyle";
import { InputStyles } from "../../components/styles/InputStyles";
import CustomerControl from "../../components/CustomerControl";
import ProductControl from "../../components/ProductControl";
import ServiceControl from "../../components/ServiceControl";

export default function ProviderServiceAgreement() {
  const { user, loading, error } = useUser();
  const [returnServiceAgreementVisitor, setReturnServiceAgreementVisitor] =
    useState(
      localStorage.getItem(
        "CreateServiceAgreementReturnServiceAgreementVisitor"
      )
    );
  const [slideShow, setSlideShow] = useState();

  useEffect(() => {
    if (returnServiceAgreementVisitor) {
      setSlideShow(false);
    } else {
      setSlideShow(true);
      localStorage.setItem("ReturnServiceAgreementVisitor", true);
    }
  }, [returnServiceAgreementVisitor]);

  const navigate = useNavigate();
  //use States
  const [userId, setUserId] = useState(user._id || false);

  //setup use State for customers
  const [agreementFormData, setAgreementFormData] = useState({
    endDate: dayjs().format("YYYY-MM-DD"),
  });
  const sigCanvas = useRef(null);
  const [customers, setCustomers] = useState([]);
  const [products, setProducts] = useState([]);
  const [services, setServices] = useState([]);
  const [currentUser, setCurrentUser] = useState({});

  //set query for customers
  const {
    loading: customerQueryLoading,
    error: customerQueryError,
    data: customerQueryData,
  } = useQuery(QUERY_CUSTOMERS);

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
  }, [userId]);

  useEffect(() => {
    setAgreementFormData({
      provider: user.roleProvider._id,
    });
  }, [user]);

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
    if (user) {
      setCurrentUser(user);
    }
  });

  // useEffect(() => {
  //   if (!userQueryLoading && !userQueryError && userQueryData.roleCustomer) {
  //     setCurrentUser(userQueryData.getMe);
  //   }
  // });
  // if (!customerQueryLoading && customerQueryData) {
  //   if (customerQueryData.getCustomers) {
  //     const customerList = customerQueryData.getCustomers.map((customer) => {
  //       return {
  //         value: customer._id,
  //         label: `${customer.user.first} ${customer.user.last}`,
  //       };
  //     });
  //     customerList.unshift({
  //       value: "00000--0000",
  //       label: "...choose customer",
  //     });
  //     setCustomers(customerList);
  //   }
  // }
  //try to set the default end date to 3 months from now
  //   const defaultEndDate = dayjs().add(3, "month").format("YYYY-MM-DD");
  //   setAgreementFormData((prevState) => ({
  //     ...prevState,
  //     endDate: defaultEndDate,
  //   }));
  // }, [
  //   userQueryLoading,
  //   userQueryData,
  //   customerQueryLoading,
  //   customerQueryData,
  // ]);

  const handleInputChange = (event) => {
    if (event.target.name) {
      const { name, value } = event.target;
      setAgreementFormData((prevState) => ({ ...prevState, [name]: value })); //handle the change of for an input with useState
    } else {
    }
  };

  function handleSignatureEnd() {
    setAgreementFormData((prevState) => ({
      ...prevState,
      providerSignature: sigCanvas.current.toDataURL(),
    })); //handle the change of for an input with useState
  }

  async function handleFormSubmit(event) {
    event.preventDefault();

    try {
      const newServiceAgreement = await addServiceAgreement({
        variables: {
          provider: agreementFormData.provider,
          customer: agreementFormData.customer,
          startDate: new Date(),
          endDate: new Date(agreementFormData.endDate),
          product: agreementFormData.product,
          quantity: parseInt(agreementFormData.quantity),
          providerSignature: agreementFormData.providerSignature,
        },
      });

      if (newServiceAgreement?.data?.addServiceAgreement?.agreementNumber) {
        navigate(
          `/agreement/${newServiceAgreement.data.addServiceAgreement.agreementNumber}`
        );
      } else navigate("/customer");
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  if (!user) {
    return (
      <Container paddingTop={10}>
        <Alert status="info">
          <AlertIcon />
          <AlertTitle>Loading Info about Your Service</AlertTitle>
          <AlertDescription>No user, have you logged in?</AlertDescription>
        </Alert>
      </Container>
    );
  }

  if (!user.roleProvider)
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
      <div></div>
      <Heading>Service Agreement</Heading>
      <Spacer />
      {/* the following are hidden but used for submission */}
      <FormControl hidden={true}>
        <FormLabel>Provider Id</FormLabel>
        <Input
          name="provider"
          {...InputStyles}
          defaultValue={user.roleProvider?._id}
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
      <ServiceControl
        handleInputChange={handleInputChange}
        products={services}
      />
      <Heading>Please Sign</Heading>
      <div
        style={{
          marginTop: 20,
          ...InputStyles,
          position: "relative",
          width: "100%",
          height: "200px",
          border: "1px solid #000",
        }}
      >
        <SignatureCanvas
          ref={sigCanvas}
          onEnd={handleSignatureEnd}
          canvasProps={{
            style: {
              width: "100%",
              height: "100%",
              display: "block",
            },
          }}
        />
      </div>
      <Container paddingTop={5}>
        <Button {...ButtonStyles} onClick={handleFormSubmit}>
          Submit
        </Button>
      </Container>
    </Container>
  );
}
