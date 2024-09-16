import dayjs from "dayjs";
import Splash from "../../components/Splash";
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
import { useState, useEffect, useRef } from "react";
//import Select from "react-select";
import { useQuery, useMutation } from "@apollo/client";
import { useNavigate } from "react-router-dom";
import { QUERY_SERVICE_AGREEMENT } from "../../utils/queries";

import SignatureCanvas from "react-signature-canvas";

import { SIGN_SERVICE_AGREEMENT } from "../../utils/mutations";

import {
  ButtonStyles,
  ButtonHighlightStyle,
} from "../../components/styles/ButtonStyle";

import { Routes, Route, useParams } from "react-router-dom";
import Error from "../../components/Error";
import NotifyUser from "../../components/NotifyUser";
import DateDisplay from "../../components/FormDisplays/DateDisplay";
import CustomerDisplay from "../../components/FormDisplays/CustomerDisplay";
import ServiceDisplay from "../../components/FormDisplays/ServiceDisplay";
import { InputStyles } from "../../components/styles/InputStyles";

export default function CustomerServiceAgreement() {
  const navigate = useNavigate();
  let { agreementNumber } = useParams();

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

  if (AddServiceAgreementError) {
    console.error("Add Service Agreement Error:", AddServiceAgreementError);
  }

  if (agreementQueryError) {
    console.error("Agreement Query Error:", agreementQueryError);
  }

  const [agreementFormData, setAgreementFormData] = useState({});
  const sigCanvas = useRef(null);

  useEffect(() => {
    if (agreementQueryData) {
      setAgreementFormData((prev) => ({
        ...prev,
        provider: agreementQueryData.getServiceAgreement.provider._id,
        service: agreementQueryData.getServiceAgreement.service,
        quantity: agreementQueryData.getServiceAgreement.quantity,
        totalPrice: agreementQueryData.getServiceAgreement.totalPrice,
      }));
    }
  }, [agreementQueryData, agreementQueryLoading]);

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
        agreementId: agreementQueryData.getServiceAgreement._id,
        customerSignature: agreementFormData.customerSignature,
      },
    });

    navigate(`/`);
    try {
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  if (agreementQueryLoading) return <Splash />;

  if (agreementQueryError || agreementNumber === "expired") {
    if (agreementNumber === "expired") {
      return (
        <Error
          component="Customer Service Agreement"
          message="agreement expired, sorry. For security we expire after 30 minutes... try again, please ask your provider to try again"
        />
      );
    }
    return (
      <Error
        component="Customer Service Agreement"
        message="agreement query error... try again, please ask your provider to try again"
      />
    );
  }

  return (
    <Container
      borderRadius="50px"
      marginTop="50px"
      borderWidth="2px"
      bgColor="yellow.50"
      paddingTop="20px"
    >
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
        <ServiceDisplay
          service={agreementQueryData.getServiceAgreement.service}
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
            (item, index) => (
              <>
                <Heading key={`heading-${index}`} size="md">
                  {item.heading}
                </Heading>
                <Text key={`term-${index}`}>{item.paragraph}</Text>
              </>
            )
          )}
        </Container>
      </Flex>
    </Container>
  );
}
