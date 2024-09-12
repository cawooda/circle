import { useEffect, useState, useReducer } from "react";
import { useQuery, useMutation } from "@apollo/client";
import { QUERY_PRODUCTS, QUERY_SERVICES } from "../utils/queries";
import { ADD_SERVICE } from "../utils/mutations";
import { Button, Flex, Text, Input, Heading } from "@chakra-ui/react";
import { DisplayStyles, SmallInputStyle } from "./styles/InputStyles";
import { ButtonHighlightStyle, ButtonStyles } from "./styles/ButtonStyle";
import { ModalHeadingStyle } from "./styles/modalStyles";
import { useUser } from "../contexts/UserContext";

const ProductList = () => {
  const { user } = useUser();
  const [products, setProducts] = useState([]);
  const { loading, data, error } = useQuery(QUERY_PRODUCTS, {
    skip: !user.roleProvider._id,
    onError: () => setHasError(true),
  });

  const [addService] = useMutation(ADD_SERVICE, {
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
    }
  }, [data]);

  const handleAddService = async (productId) => {
    try {
      await addService({
        variables: { providerId: user?.roleProvider?._id, productId },
      });
    } catch (error) {}
  };

  return (
    <>
      {products.length ? (
        <>
          <Heading {...ModalHeadingStyle}>Available Products</Heading>
          <Text>Maximum price is shown</Text>
          {products.map((product, index) => (
            <Flex gap={2} alignItems="center">
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
                readOnly
              />

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
        </>
      ) : (
        <></>
      )}
    </>
  );
};

export default ProductList;
