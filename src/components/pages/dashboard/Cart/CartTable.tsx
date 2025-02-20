import { IconMinus, IconPlus, IconTrash } from '@tabler/icons-react';
import { ActionIcon, Group, Image, Table, Text } from '@mantine/core';
import { useCart } from '@/src/context/CartContext';

export function CartTable() {
  const { cart, updateQuantity, removeFromCart } = useCart();
  return (
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
  );
}
