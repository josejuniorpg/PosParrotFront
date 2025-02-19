'use client';
import Dashboard from '@/src/components/pages/dashboard';
import EmployeeAuthGuard from '@/src/components/shared/EmployeeAuthGuard';

export default function DashboardPage() {
  return (
    <EmployeeAuthGuard>
      <Dashboard />
    </EmployeeAuthGuard>
  );
}
