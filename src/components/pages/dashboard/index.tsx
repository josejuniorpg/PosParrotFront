'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import Cart from 'components/pages/dashboard/Cart';
import ProductCard from 'components/pages/dashboard/ProductCard';
import {
  Box,
  Button,
  Center,
  Divider,
  Group,
  Loader,
  Paper,
  SimpleGrid,
  Text,
  Title,
} from '@mantine/core';
import { CartProvider } from '@/src/context/CartContext';
import Cookies from "js-cookie";

export default function Dashboard() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const token = localStorage.getItem('token');
        const restaurantId = localStorage.getItem('restaurant_id');

        if (!token || !restaurantId) {
          throw new Error('Authentication or restaurant selection missing');
        }

        const { data } = await axios.get(`http://localhost:8000/api/products/`, {
          params: { restaurant: restaurantId },
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        setProducts(data.results);
      } catch (err) {
        setError('Error loading products');
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  if (loading) {
    return (
      <Center>
        <Loader size="lg" />
      </Center>
    );
  }

  if (error) {
    return (
      <Center>
        <Text c="red">{error}</Text>
      </Center>
    );
  }

  return (
    <CartProvider>
      <Box h="100vh" pt={100}>
        <Group justify="space-evenly" align="flex-start">
          <Paper shadow="xs" p="xl" w="60vw">
            <Group justify="space-between">
              <Title c="deepGray.9">Productos</Title>

              <Button
                color="deepRed.9"
                variant="outline"
                onClick={() => {
                  Cookies.remove("employee_email");
                  window.location.href = '/select-restaurant';
                }}
              >
                Cerrar Sesión de Email
              </Button>
            </Group>
            <Divider mt={5} color="deepRed.4" />
            <Text>
              Selecciona los productos que deseas añadir al carrito. Puedes ver los productos que
              has añadido al carrito en la sección de la derecha.
            </Text>

            <SimpleGrid cols={4} mt={30}>
              {products.length > 0 ? (
                products.map((product) => (
                  <ProductCard
                    key={product.id}
                    id={product.id}
                    image={product.image}
                    name={product.name}
                    price={product.price}
                    status={product.status}
                  />
                ))
              ) : (
                <Text>No hay productos disponibles</Text>
              )}
            </SimpleGrid>
          </Paper>
          <Cart />
        </Group>
      </Box>
    </CartProvider>
  );
}
