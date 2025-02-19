'use client';

import { AppShell } from '@mantine/core';
import {HeaderMenu} from "@/src/components/shared/HeaderMenu";

export function AppShellLayout({ children }: { children: any }) {
    return (
        <AppShell>
            <AppShell.Header withBorder>
                <HeaderMenu />
            </AppShell.Header>
            <AppShell.Main pt={0}>
                {children}
            </AppShell.Main>
        </AppShell>
    );
}
