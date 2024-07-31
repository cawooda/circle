import dayjs from "dayjs";
import {
  FormControl,
  Input,
  Flex,
  Heading,
  Container,
  Spacer,
  Text,
  Button,
} from "@chakra-ui/react";
import { useState, useEffect } from "react";
//import Select from "react-select";
import { useQuery, useMutation } from "@apollo/client";
import { useNavigate } from "react-router-dom";
import { QUERY_USER_BY_ID, QUERY_SERVICE_AGREEMENT } from "../../utils/queries";
import Splash from "../../components/Splash";

import { SIGN_SERVICE_AGREEMENT } from "../../utils/mutations";
import AuthService from "../../utils/auth";
import { ButtonStyles } from "../../components/ButtonStyle";
import { ButtonHighlightStyle } from "../../components/ButtonHighlightStyle";

import { Routes, Route, useParams } from "react-router-dom";
import Error from "../../components/Error";
import NotifyUser from "../../components/NotifyUser";
import DateDisplay from "../../components/FormDisplays/DateDisplay";
import CustomerDisplay from "../../components/FormDisplays/CustomerDisplay";
import ProductDisplay from "../../components/FormDisplays/ProductDisplay";

const InputStyling = {
  borderRadius: "50px",
  borderColor: "Black",
  borderWidth: "2px",
};

export default function CustomerServiceAgreement() {
  const [splashVisible, setSplashVisible] = useState(true);
  useEffect(() => {
    const timer = setTimeout(() => {
      setSplashVisible(false);
    }, 3000); // 3 seconds

    return () => clearTimeout(timer); // Cleanup the timer
  }, [splashVisible]);
  const navigate = useNavigate();
  let { agreementNumber } = useParams();

  const [userId, setUserId] = useState(
    AuthService?.getProfile()?.authenticatedPerson?._id || false
  );

  const {
    loading: userQueryLoading,
    error: userQueryError,
    data: userQueryData,
  } = useQuery(QUERY_USER_BY_ID, {
    variables: { id: userId },
  });

  const [
    signServiceAgreement,
    {
      loading: AddServiceAgreementLoading,
      data: AddServiceAgreementData,
      error: AddServiceAgreementError,
    },
  ] = useMutation(SIGN_SERVICE_AGREEMENT, {
    onError: (err) => {
      console.error("GraphQL Error:", err.graphQLErrors);
      console.error("Network Error:", err.networkError);
      console.error("Message:", err.message);
    },
  });

  //Agreement Query and state
  const {
    loading: agreementQueryLoading,
    error: agreementQueryError,
    data: agreementQueryData,
  } = useQuery(QUERY_SERVICE_AGREEMENT, {
    variables: { agreementNumber },
  });

  const [agreementFormData, setAgreementFormData] = useState({});

  useEffect(() => {
    if (userId) {
      if (!agreementQueryLoading && agreementQueryData) {
        setAgreementFormData((prev) => ({
          ...prev,
          provider: agreementQueryData.getServiceAgreement.provider._id,
          product: agreementQueryData.getServiceAgreement.product.name,
          quantity: agreementQueryData.getServiceAgreement.quantity,
          totalPrice: agreementQueryData.getServiceAgreement.totalPrice,
        }));
      }
    }
  }, [
    userQueryLoading,
    userQueryData,
    agreementQueryData,
    agreementQueryLoading,
  ]);

  const handleInputChange = (event) => {
    if (event.target.name) {
      const { name, value } = event.target;
      setAgreementFormData((prevState) => ({ ...prevState, [name]: value })); //handle the change of for an input with useState
    } else {
    }
  };

  function handleFormSubmit(event) {
    event.preventDefault();
    signServiceAgreement({
      variables: {
        agreementId: agreementQueryData.getServiceAgreement._id,
        signature: "http://signature.com/sig.jpg",
      },
    });

    navigate(
      `/signed?name=${agreementQueryData.getServiceAgreement.customer.user.first}`
    );
    try {
    } catch (error) {
      console.log(error);
    }
  }

  if (userQueryLoading)
    return (
      <NotifyUser
        component="Customer Service agreement"
        message="user still loading..."
      />
    );
  if (agreementQueryLoading)
    return (
      <NotifyUser
        component="Customer Service agreement"
        message="agreement still loading..."
      />
    );

  if (userQueryError)
    return (
      <Error
        component="Customer Service Agreement"
        message="user query error... are you logged in"
      />
    );
  if (agreementQueryError)
    return (
      <Error
        component="Customer Service Agreement"
        message="agreement query error... try again"
      />
    );
  if (!userQueryData.getUserById.roleCustomer)
    return (
      <Error
        component="Customer Service Agreement"
        message="it doesent look like you are a customer on this agreement..."
      />
    );

  return (
    <Container
      borderRadius="50px"
      marginTop="50px"
      borderWidth="2px"
      bgColor="yellow.50"
      paddingTop="20px"
    >
      <Splash visible={splashVisible} />
      <Flex
        maxWidth={{ lg: "700px" }}
        justifyItems={"center"}
        direction="column"
        alignItems="center"
        textAlign="center"
      >
        <Heading size="md">You have a new</Heading>
        <Heading>Service Agreement</Heading>
        <Heading size="md">with</Heading>
        <Spacer />
        {/* the following are hidden but used for submission */}
        <FormControl>
          <Heading size="lg">
            {agreementQueryData.getServiceAgreement.provider.providerName}
          </Heading>
          <Heading size="sm">
            <strong>ABN:</strong>
            {agreementQueryData.getServiceAgreement.provider.abn}
          </Heading>
          <Input
            name="provider"
            hidden
            {...InputStyling}
            value={
              !agreementQueryLoading
                ? agreementQueryData.getServiceAgreement.provider._id
                : ""
            }
            onChange={handleInputChange}
          />
        </FormControl>
        {/* end invisible inputs */}
        <DateDisplay
          date={
            !agreementQueryLoading
              ? dayjs(agreementQueryData.getServiceAgreement.endDate).format(
                  "DD/MM/YYYY"
                )
              : dayjs().format("DD-MM-YYYY")
          }
        />
        <CustomerDisplay
          customer={agreementQueryData.getServiceAgreement.customer}
        />
        <ProductDisplay
          product={agreementQueryData.getServiceAgreement.product}
          quantity={agreementQueryData.getServiceAgreement.quantity}
          total={agreementQueryData.getServiceAgreement.totalPrice}
        />
        <Container paddingTop={5}>
          <Button
            {...ButtonStyles}
            {...ButtonHighlightStyle}
            onClick={handleFormSubmit}
          >
            Submit
          </Button>
        </Container>
        <Container paddingTop="20px">
          <Heading>Terms and Conditions</Heading>
          {agreementQueryData.getServiceAgreement.provider.termsAndConditions.map(
            (item) => (
              <>
                <Heading size="md">{item.heading}</Heading>
                <Text>{item.paragraph}</Text>
              </>
            )
          )}
        </Container>
      </Flex>
    </Container>
  );
}
