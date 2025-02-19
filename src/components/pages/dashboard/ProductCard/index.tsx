'use client';

import { useEffect, useState } from 'react';
import { IconArrowLeft, IconArrowRight, IconShoppingCart } from '@tabler/icons-react';
import { ActionIcon, Box, Button, Group, Image, Text } from '@mantine/core';
import { useCart } from '@/src/context/CartContext';
import styles from './ProductCard.module.css';

interface ProductCardProps {
  id: number;
  image?: string | undefined;
  name: string;
  price: number;
  status: number;
}

export default function ProductCard({ id, image, name, price, status }: ProductCardProps) {
  const { addToCart } = useCart();
  const isAvailable = status === 0;
  const [quantity, setQuantity] = useState(1);

  const increment = () => setQuantity((prev) => prev + 1);
  const decrement = () => setQuantity((prev) => Math.max(1, prev - 1));

  return (
    <Box className={styles.flipCard}>
      <div className={styles.flipCardInner}>
        <div className={styles.flipCardFront}>
          <Image
            src={
              image ||
              'https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/images/bg-7.png'
            }
            alt={name}
            height={200}
            style={{ borderRadius: '10px 10px 0 0' }}
          />
          <Text size="lg" fw={500} mt="md" c="deepGray.9">
            {name}
          </Text>
          <Text size="md" fw={700} mt="sm" c="deepRed.8">
            ${price}
          </Text>
        </div>
        <div className={styles.flipCardBack}>
          <Text size="lg" fw={500}>
            Cantidad
          </Text>
          <Group mt="md">
            <ActionIcon size="lg" variant="filled" color="deepGray.9" onClick={decrement}>
              <IconArrowLeft size={20} />
            </ActionIcon>
            <Text size="lg">{quantity}</Text>
            <ActionIcon size="lg" variant="filled" color="deepGray.9" onClick={increment}>
              <IconArrowRight size={20} />
            </ActionIcon>
          </Group>
          <Group mt="md">
            <Button
              fullWidth
              leftSection={<IconShoppingCart size={16} />}
              onClick={() => addToCart({ id, image, name, price, quantity })}
              disabled={!isAvailable}
              color="deepGray.9"
            >
              {isAvailable ? 'Añadir al Carrito' : 'Agotado'}
            </Button>
          </Group>
        </div>
      </div>
    </Box>
  );
}
