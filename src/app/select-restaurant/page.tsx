'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { Badge, Button, Card, Group, Image, Notification, Stack, Text } from '@mantine/core';

export default function SelectRestaurant() {
  const [restaurants, setRestaurants] = useState<any[]>([]);
  const [error, setError] = useState('');
  const router = useRouter();

  useEffect(() => {
    const fetchRestaurants = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('http://localhost:8000/api/restaurants/', {
          headers: { Authorization: `Bearer ${token}` },
        });

        const data = response.data.results || [];
        setRestaurants(data);
      } catch (err) {
        setError('Error fetching restaurants. Please try again.');
      }
    };

    fetchRestaurants();
  }, []);

  const handleSelect = (id: number) => {
    localStorage.setItem('restaurant_id', id.toString());
    router.push('/dashboard');
  };

  return (
    <>
      <Text size="xl" fw={700} pt={100} c={'deepRed.0'} ta={'center'}>
        Seleccione un restaurante
      </Text>
      <Group mt={20} align={'center'} justify={'center'}>
        {error && <Notification color="red">{error}</Notification>}
        {restaurants.length > 0 ? (
          restaurants.map((restaurant: any) => (
            <Card key={restaurant.id} shadow="sm" padding="lg" radius="md" withBorder>
              <Card.Section>
                <Image
                  src="https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/images/bg-8.png"
                  height={160}
                  alt={restaurant.name}
                />
              </Card.Section>

              <Group justify="space-between" mt="md" mb="xs">
                <Text fw={500}>{restaurant.name}</Text>
                <Badge color="blue">Available</Badge>
              </Group>

              <Text size="sm" c="dimmed">
                Address: {restaurant.address} <br />
                Phone: {restaurant.phone_number}
              </Text>

              <Button
                color="blue"
                fullWidth
                mt="md"
                radius="md"
                onClick={() => handleSelect(restaurant.id)}
              >
                Select this restaurant
              </Button>
            </Card>
          ))
        ) : (
          <Text>No restaurants available</Text>
        )}
      </Group>
    </>
  );
}
