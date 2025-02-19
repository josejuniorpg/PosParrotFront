'use client';

import { ReactNode, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';
import { Box, LoadingOverlay } from '@mantine/core';

export default function EmployeeAuthGuard({ children }: { children: ReactNode }) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const email = Cookies.get('employee_email');

  useEffect(() => {
    if (!email) {
      router.push('/auth/employee-login');
    } else {
      setLoading(false);
    }
  }, [email]);

  if (loading) {
    return (
      <Box pos="relative" style={{ minHeight: '100vh' }}>
        <LoadingOverlay
          visible
          overlayProps={{ radius: 'sm', blur: 2 }}
          loaderProps={{ color: 'deepRed.4', type: 'bars' }}
        />
      </Box>
    );
  }

  return <>{children}</>;
}
