'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import { DonutChart, DonutChartProps } from '@mantine/charts';
import { Button, Center, Group, Paper, Table, Text } from '@mantine/core';
import { DatePickerInput } from '@mantine/dates';

type ReportProduct = {
  name: string;
  quantity_sold: number;
  total_revenue: number;
};

type DailyReport = {
  creation_report_date: string;
  total_revenue: number;
  products: ReportProduct[];
};
export default function DailyReport() {
  const [report, setReport] = useState<DailyReport | null>(null);
  const [startDate, setStartDate] = useState<Date | null>(new Date());
  const [endDate, setEndDate] = useState<Date | null>(new Date());

  const colors = ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#FF9F40'];
  const getRandomColor = (index: number) => colors[index % colors.length];

  const fetchReport = async () => {
    try {
      const formattedStart = startDate?.toISOString().split('T')[0]; // Formato YYYY-MM-DD
      const formattedEnd = endDate?.toISOString().split('T')[0];

      const response = await axios.get<DailyReport>(
        `http://localhost:8000/api/daily-report/products/?start_date=${formattedStart}&end_date=${formattedEnd}`,
        {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        }
      );

      setReport(response.data);
    } catch (error) {
      throw new Error('Failed to fetch report');
    }
  };

  useEffect(() => {
    fetchReport();
  }, []);

  return (
    <Paper shadow="sm" p={50} pt={100} radius="md">
      <Text size="lg" fw={700} fz={30} c="deepGray.9">
        Reporte Diario de Ventas - {report?.creation_report_date || 'Cargando...'}
      </Text>

      <Group justify="center" align="flex-end" mt="md">
        <DatePickerInput value={startDate} onChange={setStartDate} label="Fecha de inicio" />
        <DatePickerInput value={endDate} onChange={setEndDate} label="Fecha de fin" />
        <Button color="deepGray.9" onClick={fetchReport}>
          Consultar
        </Button>
      </Group>

      {report && (
        <>
          <Center mt="md">
            <DonutChart
              data={report.products.map((item, index): DonutChartProps['data'][number] => ({
                name: item.name,
                value: item.quantity_sold,
                color: getRandomColor(index),
              }))}
              withTooltip
              size={200}
              strokeWidth={2}
              withLabels
              chartLabel="Productos Vendidos"
            />
          </Center>

          <Text mt="md" size="lg" fw={700} fz={30} c="deepGray.9" ta="center">
            Total General: ${report.total_revenue.toFixed(2)}
          </Text>

          <Table verticalSpacing="sm" striped highlightOnHover mt="md">
            <Table.Thead>
              <Table.Tr>
                <Table.Th>
                  <Text fw={700} c="deepRed.9">
                    Producto
                  </Text>
                </Table.Th>
                <Table.Th>
                  <Text fw={700} c="deepRed.9">
                    Cantidad
                  </Text>
                </Table.Th>
                <Table.Th>
                  <Text fw={700} c="deepRed.9">
                    Total
                  </Text>
                </Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              {report.products.map((item) => (
                <Table.Tr key={item.name}>
                  <Table.Td>{item.name}</Table.Td>
                  <Table.Td>{item.quantity_sold}</Table.Td>
                  <Table.Td>${item.total_revenue.toFixed(2)}</Table.Td>
                </Table.Tr>
              ))}
            </Table.Tbody>
          </Table>
        </>
      )}
    </Paper>
  );
}
