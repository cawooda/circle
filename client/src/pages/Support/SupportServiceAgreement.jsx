import dayjs from "dayjs";
import {
  FormControl,
  FormLabel,
  Input,
  Flex,
  AlertIcon,
  AlertTitle,
  Heading,
  Container,
  Spacer,
  Alert,
  Text,
  Button,
  AlertDescription,
  Center,
} from "@chakra-ui/react";
import { useState, useEffect } from "react";
//import Select from "react-select";
import { useQuery, useMutation } from "@apollo/client";
import { useNavigate } from "react-router-dom";
import { QUERY_USER_BY_ID, QUERY_SERVICE_AGREEMENT } from "../../utils/queries";

import { SIGN_SERVICE_AGREEMENT } from "../../utils/mutations";
import AuthService from "../../utils/auth";
import { ButtonStyles } from "../../components/ButtonStyle";
import { ButtonHighlightStyle } from "../../components/ButtonHighlightStyle";

import { Routes, Route, useParams } from "react-router-dom";

const InputStyling = {
  borderRadius: "50px",
  borderColor: "Black",
  borderWidth: "2px",
};

export default function SupportServiceAgreement() {
  let { agreementNumber } = useParams();
  const navigate = useNavigate();
  !agreementNumber ? navigate("/") : "";
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
  !agreementNumber ? navigate("/") : "";
  //product list query

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

  //const { currentUser } = useCurrentUser();

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

  //use effects
  useEffect(() => {
    setAgreementFormData({
      provider: !userQueryLoading
        ? userQueryData.getUserById.roleCustomer?._id
        : "",
      product: !agreementQueryLoading
        ? agreementQueryData.getServiceAgreement.product
        : "",
    });
  }, [userQueryLoading, userQueryData]);

  //use effects for queries
  useEffect(() => {
    if (!agreementQueryLoading && agreementQueryData) {
      console.log("agreementQueryData", agreementQueryData);
      setAgreementFormData((prev) => ({ ...prev, agreementFormData }));
    }
  }, [agreementQueryData, agreementQueryData]);

  console.log(
    "checking agreement loading for provider _id",
    !agreementQueryLoading ? agreementQueryData : ""
  );
  // console.log(agreementQueryData.getServiceAgreement.endDate);

  if (userQueryLoading || agreementQueryLoading)
    return (
      <Container paddingTop={10}>
        <Alert status="info">
          <AlertIcon />
          <AlertTitle>
            Loading Info about you and your Service Agreement
          </AlertTitle>
          <AlertDescription>
            {userQueryLoading ? "..loading user information" : ""}
          </AlertDescription>
          <AlertDescription>
            {agreementQueryLoading ? "..loading agreement information" : ""}
          </AlertDescription>
        </Alert>
      </Container>
    );
  if (userQueryError || agreementQueryError)
    return (
      <Container paddingTop={10}>
        <Alert status="error">
          <AlertIcon />
          <AlertTitle>
            We recieved an error loading your data. try refresh and make sure
            you are logged in.
          </AlertTitle>
          <AlertDescription>
            {userQueryError
              ? "...error getting your info, are you logged on?"
              : ""}
          </AlertDescription>
          <AlertDescription>
            {agreementQueryError ? "...error getting your agreement info" : ""}
          </AlertDescription>
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
        <FormControl>
          <FormLabel>End Date</FormLabel>
          <Input
            {...InputStyling}
            name="endDate"
            type="text"
            readOnly
            value={
              !agreementQueryLoading
                ? dayjs(agreementQueryData.getServiceAgreement.endDate).format(
                    "DD/MM/YYYY"
                  )
                : dayjs().format("DD-MM-YYYY")
            }
            onChange={handleInputChange}
          />
        </FormControl>
        <FormControl>
          <FormLabel>Customer</FormLabel>
          <Input
            {...InputStyling}
            name="customer"
            readOnly
            value={
              !userQueryLoading
                ? `${agreementQueryData.getServiceAgreement.customer.user.first} ${agreementQueryData.getServiceAgreement.customer.user.last}`
                : "name"
            }
          ></Input>
        </FormControl>
        <FormLabel>NDIS Number</FormLabel>
        <Input
          {...InputStyling}
          name="ndisNumber"
          readOnly
          value={
            !userQueryLoading
              ? `${agreementQueryData.getServiceAgreement.customer.ndisNumber}`
              : "name"
          }
        ></Input>

        <Spacer />

        <FormControl>
          <FormLabel>Product</FormLabel>
          <Input
            {...InputStyling}
            name="product"
            type="text"
            readOnly
            value={
              !agreementQueryLoading
                ? agreementQueryData.getServiceAgreement.product.name
                : "no product ask to check"
            }
            onChange={handleInputChange}
          />
        </FormControl>
        <FormControl>
          <FormLabel>Quantity</FormLabel>
          <Input
            {...InputStyling}
            name="quantity"
            type="text"
            readOnly
            value={
              !agreementQueryLoading
                ? agreementQueryData.getServiceAgreement.quantity
                : "no product ask to check"
            }
            onChange={handleInputChange}
          />
        </FormControl>
        <FormControl>
          <FormLabel>Total Cost</FormLabel>
          <Input
            {...InputStyling}
            name="quantity"
            type="text"
            readOnly
            value={
              !agreementQueryLoading
                ? agreementQueryData.getServiceAgreement.totalPrice
                : "no product ask to check"
            }
            onChange={handleInputChange}
          />
        </FormControl>
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

// export default function SupportServiceAgreement() {
//   return (
//     <Container>This will contain a support service agreement form</Container>
//   );
// }

//_______________________________________________________________________________________________________

// import { useCurrentUser } from "../../utils/UserContext";
