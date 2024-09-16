import { useEffect, useState, useReducer } from "react";
import { useQuery, useMutation } from "@apollo/client";
import { QUERY_PRODUCTS, QUERY_SERVICES } from "../utils/queries";
import { ADD_SERVICE } from "../utils/mutations";
import {
  Button,
  FormLabel,
  Flex,
  Stack,
  Text,
  Input,
  Heading,
  Container,
} from "@chakra-ui/react";
import { DisplayStyles, SmallInputStyle } from "./styles/InputStyles";
import { ButtonHighlightStyle, ButtonStyles } from "./styles/ButtonStyle";
import { ModalHeadingStyle } from "./styles/modalStyles";
import { useUser } from "../contexts/UserContext";
import Splash from "./Splash";
const ProductList = () => {
  const { user } = useUser();
  const [products, setProducts] = useState([]);
  const [splash, setSplash] = useState(true);
  const { loading, data, error } = useQuery(QUERY_PRODUCTS, {
    skip: !user.roleProvider._id,
    onError: () => setHasError(true),
  });

  const [
    addService,
    {
      loading: addServiceLoading,
      data: addServiceData,
      error: addServiceError,
    },
  ] = useMutation(ADD_SERVICE, {
    refetchQueries: [
      {
        query: QUERY_PRODUCTS,
      },
      {
        query: QUERY_SERVICES,
        variables: { providerId: user?.roleProvider?._id },
      },
    ],
    awaitRefetchQueries: true,
    onError: (err) => console.error(err),
  });

  useEffect(() => {
    if (data) {
      const productList = data.getProducts.products.map((product) => ({
        _id: product._id,
        name: product.name,
        maxPrice: product.price,
      }));
      setProducts(productList);
      setSplash(false);
    }
  }, [data]);

  const handleAddService = async (productId) => {
    try {
      setSplash(true);
      await addService({
        variables: { providerId: user?.roleProvider?._id, productId },
      });
    } catch (error) {}
  };
  if (splash) return <Splash />;
  return (
    <>
      <Heading size="md" mb={4}>
        Available Products
      </Heading>
      <Text>Maximum price is shown. Add the Products you need</Text>
      {products.length ? (
        <>
          <Stack spacing={4}>
            {products.map((product, index) => (
              <Flex
                key={index}
                bgColor={"#A4CBE0"}
                borderRadius={20}
                wrap="wrap"
                gap={2}
                padding={3}
                alignItems="center"
                mb={4}
              >
                <Input
                  id={`productId-${index}`}
                  hidden
                  value={product.productId}
                />
                <Input
                  id={`productName-${index}`}
                  {...DisplayStyles}
                  name={`productName-${index}`}
                  value={product.name}
                  required
                  minWidth={200}
                  isReadOnly
                />
                <FormLabel>$</FormLabel>
                <Input
                  id={`productPrice-${index}`}
                  {...DisplayStyles}
                  {...SmallInputStyle}
                  name={`productPrice-${index}`}
                  value={product.maxPrice}
                  readOnly
                />

                <Button
                  onClick={() => handleAddService(product._id)}
                  {...ButtonStyles}
                  {...ButtonHighlightStyle}
                >
                  Add
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

export default ProductList;
