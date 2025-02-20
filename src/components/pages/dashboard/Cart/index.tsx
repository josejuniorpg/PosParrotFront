'use client';

import { useEffect, useState } from 'react';
import { IconAlertCircle, IconCheck } from '@tabler/icons-react';
import axios from 'axios';
import {
  Alert,
  Button,
  Card,
  Group,
  NumberInput,
  Progress,
  Select,
  Text,
  TextInput,
} from '@mantine/core';
import { CartTable } from '@/src/components/pages/dashboard/Cart/CartTable';
import { useCart } from '@/src/context/CartContext';

//todo: Divide the Cart component into smaller components
export default function Cart() {
  const { cart, clearCart } = useCart();
  const [employees, setEmployees] = useState([]);
  const [tables, setTables] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [selectedEmployee, setSelectedEmployee] = useState<string | null>(null);
  const [selectedTable, setSelectedTable] = useState<string | null>(null);
  const [selectedCustomer, setSelectedCustomer] = useState<string | null>(null);
  const [customerName, setCustomerName] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<string | null>(null);
  const [tips, setTips] = useState(0);
  const [notification, setNotification] = useState<{
    message: string;
    type: 'success' | 'error';
  } | null>(null);
  const [progress, setProgress] = useState(100);
  const restaurantId = localStorage.getItem('restaurant_id');
  let progressInterval: NodeJS.Timeout;
  const paymentMethods = [
    { value: '0', label: 'Cash' },
    { value: '1', label: 'Credit Card' },
    { value: '2', label: 'Debit Card' },
    { value: '3', label: 'Mobile Payment' },
    { value: '4', label: 'Bank Transfer' },
    { value: '5', label: 'Voucher' },
  ];

  const showNotification = (message: string, type: 'success' | 'error') => {
    setNotification({ message, type });
    setProgress(100);
    if (progressInterval) {
      clearInterval(progressInterval);
    }
    progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev <= 0) {
          clearInterval(progressInterval);
          setNotification(null);
          return 0;
        }
        return prev - 10;
      });
    }, 300);
  };

  useEffect(() => {
    if (restaurantId) {
      Promise.all([
        axios.get(`http://localhost:8000/api/employees/?restaurant=${restaurantId}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        }),
        axios.get(`http://localhost:8000/api/tables/?restaurant=${restaurantId}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        }),
        axios.get(`http://localhost:8000/api/customers/?restaurant=${restaurantId}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        }),
      ])
        .then(([employeeResponse, tableResponse, customerResponse]) => {
          setEmployees(
            employeeResponse.data.results.map((emp: { id: number; name: string }) => ({
              value: emp.id.toString(),
              label: emp.name,
            }))
          );
          setTables(
            tableResponse.data.results.map((table: { id: number; table_number: string }) => ({
              value: table.id.toString(),
              label: `Mesa ${table.table_number}`,
            }))
          );
          setCustomers(
            customerResponse.data.results.map((cust: { id: number; name: string }) => ({
              value: cust.id.toString(),
              label: cust.name,
            }))
          );
        })
        .catch((error) => {
          console.error('Error fetching data:', error);
          showNotification('Error al cargar los datos.', 'error');
        });
    }
  }, [restaurantId]);

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const tax = 15;
  const grandTotal = total + tax + tips;

  const submitOrder = async () => {
    if (!selectedEmployee || !selectedTable || !paymentMethod) {
      showNotification('Seleccione un empleado, una mesa y un método de pago.', 'error');
      return;
    }
    try {
      const orderResponse = await axios.post(
        'http://localhost:8000/api/orders/',
        {
          restaurant: restaurantId,
          tables: [selectedTable],
          employee: selectedEmployee,
          customer: selectedCustomer || null,
          customer_name: selectedCustomer ? '' : customerName,
          status: 0,
          subtotal: total,
          discount: 0,
          tax,
          tips,
          total: grandTotal,
          payment_method: paymentMethod,
        },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        }
      );
      const orderId = orderResponse.data.id;
      await Promise.all(
        cart.map((item) =>
          axios.post(
            'http://localhost:8000/api/order-products/',
            {
              order: orderId,
              product: item.id,
              quantity: item.quantity,
            },
            {
              headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
            }
          )
        )
      );
      showNotification('Orden enviada con éxito.', 'success');
      clearCart();
    } catch (error) {
      console.error('Error al enviar la orden:', error);
      showNotification('Hubo un error al enviar la orden.', 'error');
    }
  };

  return (
    <Card shadow="sm" padding="lg" radius="md" w="35vw">
      {notification && (
        <>
          <Alert
            variant="light"
            color={notification.type === 'success' ? 'green' : 'red'}
            title={notification.type === 'success' ? 'Éxito' : 'Error'}
            icon={notification.type === 'success' ? <IconCheck /> : <IconAlertCircle />}
            mt="md"
          >
            {notification.message}
          </Alert>
          <Progress value={progress} animated mt="sm" />
        </>
      )}
      <Text size="lg" c="deepGray.9" fw={700}>
        🍽️ ORDEN
      </Text>
      <Select
        data={employees}
        placeholder="Seleccionar empleado"
        value={selectedEmployee}
        onChange={setSelectedEmployee}
        mt="md"
      />
      <Select
        data={tables}
        placeholder="Seleccionar mesa"
        value={selectedTable}
        onChange={setSelectedTable}
        mt="md"
      />
      <Select
        data={customers}
        placeholder="Seleccionar cliente"
        value={selectedCustomer}
        onChange={setSelectedCustomer}
        mt="md"
      />

      {!selectedCustomer && (
        <TextInput
          placeholder="Nombre del cliente (si es anónimo)"
          value={customerName}
          onChange={(event) => setCustomerName(event.currentTarget.value)}
          mt="md"
        />
      )}
      <Select
        data={paymentMethods}
        placeholder="Seleccionar método de pago"
        value={paymentMethod}
        onChange={setPaymentMethod}
        mt="md"
      />
      <CartTable />

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
      <Group grow mt="md">
        <Button color="deepRed.9" onClick={submitOrder} disabled={cart.length === 0}>
          Place Order
        </Button>
        <Button color="deepGray.9" onClick={clearCart} disabled={cart.length === 0}>
          Clear Cart
        </Button>
      </Group>
    </Card>
  );
}
