'use client';

import { useEffect, useRef, useState } from 'react';
import { Group, Text, Title, UnstyledButton, useMantineTheme } from '@mantine/core';
import classes from './HeaderMenu.module.css';

export function HeaderMenu() {
  const headerRef = useRef<HTMLDivElement>(null);
  const [lastScrollY, setLastScrollY] = useState(0);
  const theme = useMantineTheme();

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      if (headerRef.current) {
        if (currentScrollY > lastScrollY) {
          headerRef.current.style.transform = 'translateY(-100%)'; // Hide
        } else {
          headerRef.current.style.transform = 'translateY(0)'; // Show
        }
      }

      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll);

    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  return (
    <Group
      ref={headerRef}
      className={classes.header}
      h={90}
      justify="space-between"
      pr="5vw"
      pl="5vw"
    >
      <Title>Parrot</Title>
      <UnstyledButton>
        <Text c="deepRed.4" fz={30} fw={400} tt="uppercase">
          Menu
        </Text>
      </UnstyledButton>
    </Group>
  );
}
