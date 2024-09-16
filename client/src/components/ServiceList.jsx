import { useEffect, useReducer } from "react";
import { useQuery, useMutation } from "@apollo/client";
import { QUERY_SERVICES, QUERY_PRODUCTS } from "../utils/queries";
import { UPDATE_SERVICE, DELETE_SERVICE } from "../utils/mutations"; // Add DELETE_SERVICE mutation here
import { CardStyles } from "./styles/CardStyles";
import {
  Button,
  Flex,
  Input,
  Heading,
  Text,
  Stack,
  FormLabel,
} from "@chakra-ui/react";
import {
  DisplayStyles,
  InputStyles,
  SmallInputStyle,
} from "./styles/InputStyles";
import {
  ButtonStyles,
  ButtonHighlightStyle,
  DeleteButtonStyle,
} from "./styles/ButtonStyle";
import { useUser } from "../contexts/UserContext";
import Splash from "./Splash";

// Reducer actions
const SET_SERVICES = "SET_SERVICES";
const UPDATE_PRICE = "UPDATE_PRICE";
const DELETE_SERVICE_ACTION = "DELETE_SERVICE_ACTION";

// Pure reducer to manage state
const serviceReducer = (state, action) => {
  switch (action.type) {
    case SET_SERVICES:
      return { ...state, services: action.payload };
    case UPDATE_PRICE:
      const updatedServices = [...state.services];
      updatedServices[action.index].price = action.newPrice;
      return { ...state, services: updatedServices };
    case DELETE_SERVICE_ACTION:
      return {
        ...state,
        services: state.services.filter(
          (service) => service.serviceId !== action.serviceId
        ),
      };
    default:
      return state;
  }
};

const ServiceList = () => {
  const { user } = useUser();
  const initialState = { services: [] };
  const [state, dispatch] = useReducer(serviceReducer, initialState);

  const { loading, data, error } = useQuery(QUERY_SERVICES, {
    variables: { providerId: user?.roleProvider?._id },
    skip: !user?.roleProvider?._id,
    onError: () => console.error("Error loading services"),
  });

  const [
    updateService,
    {
      data: updateServiceData,
      loading: updateServiceLoading,
      error: updateServiceError,
    },
  ] = useMutation(UPDATE_SERVICE, {
    refetchQueries: [
      {
        query: QUERY_SERVICES,
        variables: { providerId: user?.roleProvider?._id },
      },
      {
        query: QUERY_PRODUCTS,
      },
    ],
    awaitRefetchQueries: true,
    onError: (err) => console.error(err),
  });

  const [
    deleteService,
    {
      data: deleteServiceData,
      loading: deleteServiceLoading,
      error: deleteServiceError,
    },
  ] = useMutation(DELETE_SERVICE, {
    refetchQueries: [
      {
        query: QUERY_SERVICES,
        variables: { providerId: user?.roleProvider?._id },
      },
      {
        query: QUERY_PRODUCTS,
      },
    ],
    awaitRefetchQueries: true,
    onError: (err) => console.error(err),
  });

  useEffect(() => {
    if (data) {
      const serviceList = data.getServices.services.map((service) => ({
        serviceId: service._id,
        name: service.product.name,
        maxPrice: service.product.price,
        price: service.price,
      }));

      dispatch({ type: SET_SERVICES, payload: serviceList });
    }
  }, [data]);

  const handlePriceChange = (index, newPrice) => {
    const maxPrice = state.services[index].maxPrice;
    if (!newPrice || isNaN(newPrice)) {
      dispatch({ type: UPDATE_PRICE, index, newPrice: "" });
    } else if (parseFloat(newPrice) <= maxPrice) {
      dispatch({ type: UPDATE_PRICE, index, newPrice });
    } else {
      dispatch({ type: UPDATE_PRICE, index, newPrice: maxPrice });
    }
  };

  // Move mutation out of the reducer
  const handleUpdateServicePrice = async (serviceId, price) => {
    try {
      await updateService({
        variables: { serviceId, price: parseFloat(price) },
      });
    } catch (error) {
      console.error("Error updating service: ", error);
    }
  };

  // Move mutation out of the reducer
  const handleDeleteService = async (serviceId) => {
    try {
      await deleteService({
        variables: { serviceId },
      });
      dispatch({ type: DELETE_SERVICE_ACTION, serviceId });
    } catch (error) {
      console.error("Error deleting service: ", error);
    }
  };
  if (updateServiceLoading || deleteServiceLoading) return <Splash />;
  return (
    <>
      {state.services.length ? (
        <>
          <Heading size="md" mb={4}>
            Current Services
          </Heading>
          <Text>
            You can Edit the Price of Serices. Below are further Products you
            can add you your list.
          </Text>
          <Stack spacing={4}>
            {state.services.map((service, index) => (
              <Flex
                key={index}
                {...CardStyles}
                wrap="wrap"
                alignItems="center"
                mb={4}
              >
                <Input
                  id={`serviceId-${index}`}
                  hidden
                  value={service.serviceId}
                />
                <Input
                  id={`serviceName-${index}`}
                  {...DisplayStyles}
                  name={`serviceName-${index}`}
                  value={service.name}
                  required
                  minWidth={200}
                  isReadOnly
                />
                <FormLabel>$</FormLabel>
                <Input
                  id={`servicePrice-${index}`}
                  {...InputStyles}
                  {...SmallInputStyle}
                  name={`servicePrice-${index}`}
                  value={service.price}
                  onChange={(e) => handlePriceChange(index, e.target.value)}
                  required
                />

                <Button
                  {...ButtonStyles}
                  {...ButtonHighlightStyle}
                  onClick={() =>
                    handleUpdateServicePrice(service.serviceId, service.price)
                  }
                  isDisabled={isNaN(service.price) || service.price === ""} // Disable if price is invalid
                >
                  Update
                </Button>
                <Button
                  {...ButtonStyles}
                  onClick={() => handleDeleteService(service.serviceId)}
                >
                  Remove
                </Button>
              </Flex>
            ))}
          </Stack>
        </>
      ) : (
        <></>
      )}
    </>
  );
};

export default ServiceList;
