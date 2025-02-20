import Link from 'next/link';
import { Center, List, Stack, Text, Title } from '@mantine/core';
import classes from './Welcome.module.css';

export function Welcome() {
  return (
    <>
      <Title className={classes.title} ta="center" mt={100}>
        Welcome to{' '}
        <Text inherit variant="gradient" component="span" gradient={{ from: 'pink', to: 'yellow' }}>
          Parrot
        </Text>
      </Title>
      <Text c="dimmed" ta="center" size="lg" maw={580} mx="auto" mt="xl">
        Es es un proyecto de ejemplo con Mantine y Next.js. El Frotn es en Next 15 y el Back usa
        Django 5.1
      </Text>
      <Stack align={'center'}>
        <List c={'deepGray.9'}>
          <li>Para acceder a links sera neceesario que crees un Usuarios en el Backend.</li>
          <li> Ademas tambien, deberas de crearle uno o mas restaurantes.</li>
          <li>Y por ultimo crear empleados para esos restaurantes.</li>
        </List>
        <Title fz={40} c={'deepRed.9'} size="lg">
          <br />
          Estas son las ULRS del Fronted.
          <br />
        </Title>
        <Stack>
          <Link href="/dashboard">Dashboard</Link>
          <Link href="/select-restaurant">Seleccionar Restaurante</Link>
          <Link href="/daily-report/products">Reporte Diario</Link>
        </Stack>
      </Stack>
    </>
  );
}
