'use client';

import { AppShell } from '@mantine/core';
import { HeaderMenu } from '@/src/components/shared/HeaderMenu';
import PrivateRoute from '@/src/components/shared/PrivateRoute';

export function AppShellLayout({ children }: { children: any }) {
  return (
    <AppShell>
      <AppShell.Header withBorder>
        <HeaderMenu />
      </AppShell.Header>
      <AppShell.Main pt={0}>
        <PrivateRoute> {children}</PrivateRoute>
      </AppShell.Main>
    </AppShell>
  );
}
