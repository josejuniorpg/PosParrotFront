import { ReactNode, useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { LoadingOverlay, Box } from '@mantine/core';

export default function PrivateRoute({ children }: { children: ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');

    if (!token && pathname !== '/login') {
      router.replace('/login');
    } else if (token) {
      setIsAuthenticated(true);
    }

    setLoading(false);
  }, [pathname]);

  if (loading) {
    return (
        <Box pos="relative" style={{ minHeight: '100vh' }}>
          <LoadingOverlay visible overlayProps={{ radius: "sm", blur: 2 }} />
        </Box>
    );
  }

  if (!isAuthenticated && pathname !== '/login') {
    return null;
  }

  return <>{children}</>;
}
