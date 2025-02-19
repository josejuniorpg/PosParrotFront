'use client';

import { useState } from 'react';
import { IconMinus, IconPlus, IconTrash } from '@tabler/icons-react';
import { ActionIcon, Button, Card, Group, Image, NumberInput, Table, Text } from '@mantine/core';
import { useCart } from '@/src/context/CartContext';

export default function Cart() {
  const { cart, removeFromCart, updateQuantity, clearCart } = useCart();
  const [tips, setTips] = useState(0);

  // todo: Add a table on the Db for this configuration.
  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const tax = total * 0.095;
  const grandTotal = total + tax + tips;

  return (
    <Card shadow="sm" padding="lg" radius="md" w="35vw">
      <Text size="lg"  c="deepGray.9" fw={700}>
        🍽️ ORDEN
      </Text>
      <Table verticalSpacing="sm" mt="md">
        <thead>
          <tr>
            <th>
              <Text c="deepGray.9" fw={700}>
                Item
              </Text>
            </th>
            <th>
              <Text c="deepGray.9" fw={700}>
                Qty
              </Text>
            </th>
            <th>
              <Text c="deepGray.9" fw={700}>
                Price
              </Text>
            </th>
            <th>
              <Text c="deepGray.9" fw={700}>
                Delete
              </Text>
            </th>
          </tr>
        </thead>
        <tbody>
          {cart.length > 0 ? (
            cart.map((product) => (
              <tr key={product.id}>
                <td>
                  <Group align="center">
                    <Image
                      src={
                        product.image ||
                        'https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/images/bg-7.png'
                      }
                      width={40}
                      height={40}
                      fit="cover"
                    />
                    <Text>{product.name}</Text>
                  </Group>
                </td>
                <td width={150}>
                  <Group justify="center">
                    <ActionIcon
                      color="deepGray.9"
                      onClick={() => updateQuantity(product.id, product.quantity - 1)}
                    >
                      <IconMinus size={16} />
                    </ActionIcon>
                    <Text>{product.quantity}</Text>
                    <ActionIcon
                      color="deepGray.9"
                      onClick={() => updateQuantity(product.id, product.quantity + 1)}
                    >
                      <IconPlus size={16} />
                    </ActionIcon>
                  </Group>
                </td>
                <td align="center" width={100}>
                  ${(product.price * product.quantity).toFixed(2)}
                </td>
                <td align="center">
                  <ActionIcon color="deepRed.8" onClick={() => removeFromCart(product.id)}>
                    <IconTrash size={16} />
                  </ActionIcon>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={4} style={{ textAlign: 'center' }}>
                No hay productos en el carrito.
              </td>
            </tr>
          )}
        </tbody>
      </Table>
      <Text size="sm" mt="md">
        Subtotal: ${total.toFixed(2)}
      </Text>
      <Text size="sm">Tax (9.5%): ${tax.toFixed(2)}</Text>
      <Group align="center">
        <Text size="sm">Propina</Text>
        <NumberInput
          hideControls
          variant="unstyled"
          min={0}
          value={tips}
          onChange={(value) => setTips(Number(value) || 0)}
          prefix="$"
        />
      </Group>

      <Text size="lg" fw={700} mt="md" c="deepGray.9">
        Total: ${grandTotal.toFixed(2)}
      </Text>
      {/*  Todo: Finish the order on the DB. */}
      <Group grow mt="md">
        <Button
          color="deepRed.9"
          onClick={() => alert('Send order to the DB')}
          disabled={cart.length === 0}
        >
          Place Order
        </Button>
        <Button color="deepGray.9" onClick={clearCart} disabled={cart.length === 0}>
          Clear Cart
        </Button>
      </Group>
    </Card>
  );
}
