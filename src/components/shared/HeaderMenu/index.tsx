'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { Group, Text, Title } from '@mantine/core';
import classes from './HeaderMenu.module.css';

export function HeaderMenu() {
  const headerRef = useRef<HTMLDivElement>(null);
  const [lastScrollY, setLastScrollY] = useState(0);

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
      <Link href="/" style={{ textDecoration: 'none' }}>
        <Title c="deepGray.9">Parrot</Title>
      </Link>
      <Link href="/dashboard" style={{ textDecoration: 'none' }}>
        <Text c="deepRed.9" fz={20} fw={400} tt="uppercase">
          DashBoard
        </Text>
      </Link>
    </Group>
  );
}
