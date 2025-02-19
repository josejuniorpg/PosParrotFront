'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { Button, Notification, Paper, PasswordInput, TextInput, Title } from '@mantine/core';
import { useForm } from '@mantine/form';
import classes from './login.module.css';

export function Login() {
  const [error, setError] = useState('');
  const router = useRouter();

  const form = useForm({
    initialValues: { username: '', password: '' },
    validate: {
      username: (value) => (value.length >= 5 ? null : 'Mínimo 5 caracteres'),
      password: (value) => (value.length >= 5 ? null : 'Mínimo 5 caracteres'),
    },
  });

  const handleSubmit = async (values: { username: string; password: string }) => {
    setError('');
    try {
      const { data } = await axios.post('http://localhost:8000/api/token/', values);
      localStorage.setItem('token', data.access);
      router.push('/select-restaurant');
    } catch (err) {
      setError('Credenciales incorrectas');
    }
  };

  return (
    <div className={classes.wrapper}>
      <Paper className={classes.form} radius={0} p={30}>
        <Title order={2} className={classes.title} ta="center" mt="50" mb={50}>
          Bienvenido a Parrot
        </Title>
        <form onSubmit={form.onSubmit(handleSubmit)}>
          <TextInput label="Username" {...form.getInputProps('username')} />
          <PasswordInput label="Contraseña" {...form.getInputProps('password')} />
          {error && <Notification color="red">{error}</Notification>}
          <Button type="submit" fullWidth mt="md" bg="deepRed.4">
            Iniciar sesión
          </Button>
        </form>
      </Paper>
    </div>
  );
}
