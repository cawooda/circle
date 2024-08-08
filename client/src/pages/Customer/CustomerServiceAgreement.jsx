import dayjs from "dayjs";
import {
  FormControl,
  Box,
  Input,
  Flex,
  Heading,
  Container,
  Spacer,
  Text,
  Button,
} from "@chakra-ui/react";
import { useState, useEffect, useRef } from "react";
//import Select from "react-select";
import { useQuery, useMutation } from "@apollo/client";
import { useNavigate } from "react-router-dom";
import { QUERY_USER_BY_ID, QUERY_SERVICE_AGREEMENT } from "../../utils/queries";
import { useUser } from "../../contexts/UserContext";

import Splash from "../../components/Splash";
import SignatureCanvas from "react-signature-canvas";

import { SIGN_SERVICE_AGREEMENT } from "../../utils/mutations";
import AuthService from "../../utils/auth";
import {
  ButtonStyles,
  ButtonHighlightStyle,
} from "../../components/styles/ButtonStyle";

import { Routes, Route, useParams } from "react-router-dom";
import Error from "../../components/Error";
import NotifyUser from "../../components/NotifyUser";
import DateDisplay from "../../components/FormDisplays/DateDisplay";
import CustomerDisplay from "../../components/FormDisplays/CustomerDisplay";
import ProductDisplay from "../../components/FormDisplays/ProductDisplay";
import { InputStyles } from "../../components/styles/InputStyles";

export default function CustomerServiceAgreement() {
  const [splashVisible, setSplashVisible] = useState(true);
  useEffect(() => {
    const timer = setTimeout(() => {
      setSplashVisible(false);
    }, 1500); // 3 seconds

    return () => clearTimeout(timer); // Cleanup the timer
  }, [splashVisible]);
  const navigate = useNavigate();
  let { agreementNumber } = useParams();

  const { user, loading, error } = useUser();

  const {
    loading: userQueryLoading,
    error: userQueryError,
    data: userQueryData,
  } = useQuery(QUERY_USER_BY_ID, {
    variables: { id: user._id },
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
  const sigCanvas = useRef(null);

  useEffect(() => {
    if (user._id) {
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

  function handleSignatureEnd() {
    setAgreementFormData((prevState) => ({
      ...prevState,
      customerSignature: sigCanvas.current.toDataURL(),
    })); //handle the change of for an input with useState
  }

  function handleFormSubmit(event) {
    event.preventDefault();
    signServiceAgreement({
      variables: {
        userId: user._id,
        agreementId: agreementQueryData.getServiceAgreement._id,
        customerSignature: agreementFormData.signature,
      },
    });

    navigate(
      `/signed?name=${agreementQueryData.getServiceAgreement.customer.user.first}`
    );
    try {
    } catch (error) {
      console.log(error);
      throw error;
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
  if (!userQueryData.getMe.roleCustomer)
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
            {...InputStyles}
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
        <button type="button" onClick={() => sigCanvas.current.clear()}>
          Clear Signature
        </button>
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
