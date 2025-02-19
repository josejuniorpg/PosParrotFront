import { useEffect, useState } from 'react';
import { useMantineTheme } from '@mantine/core';

type DeviceType = {
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
};

// Todo: add the documentation

export function useIsDevice(isOnly: boolean = false) {
  const theme = useMantineTheme();
  const [device, setDevice] = useState<DeviceType>({
    isMobile: false,
    isTablet: false,
    isDesktop: false,
  });

  const updateDevice = () => {
    const widthInPx = window.innerWidth; // Screen size on PX.
    const fontSize = parseFloat(getComputedStyle(document.documentElement).fontSize);
    const widthInEm = widthInPx / fontSize; // Convert to em, because mantine breakpoints return em.
    const sm = parseInt(theme.breakpoints.sm, 10);
    const md = parseInt(theme.breakpoints.md, 10);

    if (isOnly) {
      if (widthInEm < sm) {
        setDevice({ isMobile: true, isTablet: false, isDesktop: false });
      } else if (widthInEm >= sm && widthInEm <= md) {
        setDevice({ isMobile: false, isTablet: true, isDesktop: false });
      } else {
        setDevice({ isMobile: false, isTablet: false, isDesktop: true });
      }
    } else {
      setDevice({
        isMobile: widthInEm < sm,
        isTablet: widthInEm >= sm,
        isDesktop: widthInEm > md,
      });
    }
  };
  useEffect(() => {
    updateDevice();
    window.addEventListener('resize', updateDevice); // Listener for Resize changes.
    return () => {
      window.removeEventListener('resize', updateDevice); // Cleanup
    };
  }, [theme.breakpoints, isOnly]);
  return device;
}
