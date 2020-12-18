/* eslint-disable array-callback-return */
import React, { useMemo, useState } from 'react';
import FeatherIcon from 'react-native-vector-icons/Feather';

import { View } from 'react-native';

import {
  Container,
  ProductContainer,
  ProductList,
  Product,
  ProductImage,
  ProductTitleContainer,
  ProductTitle,
  ProductPriceContainer,
  ProductSinglePrice,
  TotalContainer,
  ProductPrice,
  ProductQuantity,
  ActionContainer,
  ActionButton,
  TotalProductsContainer,
  TotalProductsText,
  SubtotalValue,
} from './styles';

import { useCart } from '../../hooks/cart';

import formatValue from '../../utils/formatValue';

interface Product {
  id: string;
  title: string;
  image_url: string;
  price: number;
  quantity: number;
}

const Cart: React.FC = () => {
  const { increment, decrement, products } = useCart();
  const [valuesSum, setValuesSum] = useState(0.0);
  const [quantitySum, setQuantitySum] = useState(0);

  function handleIncrement(id: string): void {
    increment(id);
    const newQtt = quantitySum + 1;
    setQuantitySum(newQtt);

    let newValueSum = 0;

    products.map(prod => {
      newValueSum += prod.price * prod.quantity;
    });

    setValuesSum(newValueSum);
  }

  function handleDecrement(id: string): void {
    decrement(id);
    const newQtt = quantitySum - 1;
    setQuantitySum(newQtt);

    let newValueSum = 0;

    products.map(prod => {
      newValueSum += prod.price * prod.quantity;
    });

    setValuesSum(newValueSum);
  }

  const cartTotal = useMemo(() => {
    let newValueSum = 0;

    products.map(prod => {
      newValueSum += prod.price * prod.quantity;
    });

    setValuesSum(newValueSum);
    return formatValue(valuesSum);
  }, [products, valuesSum]);

  const totalItensInCart = useMemo(() => {
    let newQuantitySum = 0;

    products.map(prod => {
      newQuantitySum += prod.quantity;
    });

    setQuantitySum(newQuantitySum);

    return quantitySum;
  }, [products, quantitySum]);

  return (
    <Container>
      <ProductContainer>
        <ProductList
          data={products}
          keyExtractor={item => item.id}
          ListFooterComponent={<View />}
          ListFooterComponentStyle={{
            height: 80,
          }}
          renderItem={({ item }: { item: Product }) => (
            <Product>
              <ProductImage source={{ uri: item.image_url }} />
              <ProductTitleContainer>
                <ProductTitle>{item.title}</ProductTitle>
                <ProductPriceContainer>
                  <ProductSinglePrice>
                    {formatValue(item.price)}
                  </ProductSinglePrice>

                  <TotalContainer>
                    <ProductQuantity>{`${item.quantity}x`}</ProductQuantity>

                    <ProductPrice>
                      {formatValue(item.price * item.quantity)}
                    </ProductPrice>
                  </TotalContainer>
                </ProductPriceContainer>
              </ProductTitleContainer>
              <ActionContainer>
                <ActionButton
                  testID={`increment-${item.id}`}
                  onPress={() => handleIncrement(item.id)}
                >
                  <FeatherIcon name="plus" color="#E83F5B" size={16} />
                </ActionButton>
                <ActionButton
                  testID={`decrement-${item.id}`}
                  onPress={() => handleDecrement(item.id)}
                >
                  <FeatherIcon name="minus" color="#E83F5B" size={16} />
                </ActionButton>
              </ActionContainer>
            </Product>
          )}
        />
      </ProductContainer>
      <TotalProductsContainer>
        <FeatherIcon name="shopping-cart" color="#fff" size={24} />
        <TotalProductsText>{`${totalItensInCart} itens`}</TotalProductsText>
        <SubtotalValue>{cartTotal}</SubtotalValue>
      </TotalProductsContainer>
    </Container>
  );
};

export default Cart;
