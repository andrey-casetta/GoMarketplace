/* eslint-disable array-callback-return */
import React, { useState, useMemo } from 'react';

import { useNavigation } from '@react-navigation/native';

import FeatherIcon from 'react-native-vector-icons/Feather';
import {
  Container,
  CartPricing,
  CartButton,
  CartButtonText,
  CartTotalPrice,
} from './styles';

import formatValue from '../../utils/formatValue';

import { useCart } from '../../hooks/cart';

// Calculo do total
// Navegação no clique do TouchableHighlight

const FloatingCart: React.FC = () => {
  const { products } = useCart();
  const [valuesSum, setValuesSum] = useState(0.0);
  const [quantitySum, setQuantitySum] = useState(0);
  const navigation = useNavigation();

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
      <CartButton
        testID="navigate-to-cart-button"
        onPress={() => navigation.navigate('Cart')}
      >
        <FeatherIcon name="shopping-cart" size={24} color="#fff" />
        <CartButtonText>{`${totalItensInCart} itens`}</CartButtonText>
      </CartButton>

      <CartPricing>
        <CartTotalPrice>{cartTotal}</CartTotalPrice>
      </CartPricing>
    </Container>
  );
};

export default FloatingCart;
