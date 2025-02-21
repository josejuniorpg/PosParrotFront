'use client';

import { useState } from 'react';
import {
  Box,
  Button,
  Flex,
  Group,
  Image,
  Notification,
  Text,
  TextInput,
  Title,
} from '@mantine/core';
import { useEmployeeAuth } from '@/src/hooks/useEmployeeAuth';
import classes from './employee-login.module.css';

export default function EmployeeLogin() {
  const { loginWithEmail } = useEmployeeAuth();
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async () => {
    try {
      await loginWithEmail(email);
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <>
      <Flex h="100vh" align="center" justify="center">
        <Box w="70vw">
          <div className={classes.wrapper}>
            <div className={classes.body}>
              <Title className={classes.title} c="deepGray.9">
                Bienvenido a Parrot
              </Title>
              <Text fw={500} fz="lg" mb={5} c="deepGray.9">
                Inicia sesión con tu email corporativo
              </Text>
              <Text fz="sm" c="dimmed">
                Una vez inicado sesion, podras acceder al punto de venta, y el reporte diario. (Solo
                si eres manager).
                <br />
                <strong>
                  Tambien sera necesario que haya seleccionado un restaurante para poder acceder al
                  dashboard y el reporte diario.
                </strong>
              </Text>

              <Group align="center">
                <TextInput
                  label="Introducte tu email"
                  placeholder="employee@example.com"
                  value={email}
                  w={500}
                  onChange={(e) => setEmail(e.currentTarget.value)}
                />
                {error && <Notification color="red">{error}</Notification>}
                <Button onClick={handleSubmit} color="deepRed.6">
                  Verificar Email
                </Button>
              </Group>
            </div>
            <Image src="/images/login-bg.webp" className={classes.image} />
          </div>
        </Box>
      </Flex>
    </>
  );
}
