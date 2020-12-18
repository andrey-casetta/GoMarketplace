import React, {
  createContext,
  useState,
  useCallback,
  useContext,
  useEffect,
} from 'react';

import AsyncStorage from '@react-native-community/async-storage';

interface Product {
  id: string;
  title: string;
  image_url: string;
  price: number;
  quantity: number;
}

interface CartContext {
  products: Product[];
  addToCart(item: Omit<Product, 'quantity'>): void;
  increment(id: string): void;
  decrement(id: string): void;
}

const CartContext = createContext<CartContext | null>(null);

const CartProvider: React.FC = ({ children }) => {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    async function loadProducts(): Promise<void> {
      const sListProducts = await AsyncStorage.getItem('@GoMarket:products');
      if (sListProducts) {
        setProducts(JSON.parse(sListProducts));
      }
    }
    loadProducts();
  }, []);

  const increment = useCallback(
    async id => {
      setProducts(
        products.map(product =>
          product.id === id
            ? { ...product, quantity: product.quantity + 1 }
            : product,
        ),
      );

      await AsyncStorage.setItem(
        '@GoMarket:products',
        JSON.stringify(products),
      );
    },

    [products],
  );

  const decrement = useCallback(
    async id => {
      const newProds = products.map(product =>
        product.id === id && product.quantity > 1
          ? { ...product, quantity: product.quantity - 1 }
          : product,
      );

      const prod = products.find(existingProd => existingProd.id === id);
      if (prod) {
        prod.quantity -= 1;
        if (prod.quantity <= 0) {
          newProds.splice(newProds.indexOf(prod), 1);
        }
      }

      setProducts(newProds);

      await AsyncStorage.setItem(
        '@GoMarket:products',
        JSON.stringify(products),
      );
    },
    [products],
  );

  const addToCart = useCallback(
    async product => {
      const prod = products.find(
        existingProd => existingProd.id === product.id,
      );
      if (prod) {
        const newProds = products.map(existingProduct =>
          existingProduct.id === product.id
            ? { ...existingProduct, quantity: existingProduct.quantity + 1 }
            : existingProduct,
        );
        setProducts(newProds);
      } else {
        const newProd = product;
        newProd.quantity += 1;

        setProducts([...products, newProd]);
      }
      await AsyncStorage.setItem(
        '@GoMarket:products',
        JSON.stringify(products),
      );
    },
    [products],
  );

  const value = React.useMemo(
    () => ({ addToCart, increment, decrement, products }),
    [products, addToCart, increment, decrement],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

function useCart(): CartContext {
  const context = useContext(CartContext);

  if (!context) {
    throw new Error(`useCart must be used within a CartProvider`);
  }

  return context;
}

export { CartProvider, useCart };
