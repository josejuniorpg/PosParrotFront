import { ColorSchemeToggle } from '@/src/components/common/ColorSchemeToggle/ColorSchemeToggle';
import { Welcome } from '@/src/components/common/Welcome/Welcome';

export default function HomePage() {
  return (
    <>
      <Welcome />
      <ColorSchemeToggle />
    </>
  );
}
