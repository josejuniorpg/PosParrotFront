import EmployeeAuthGuard from "@/src/components/shared/EmployeeAuthGuard";

export default function DashboardPage() {
    return (
        <EmployeeAuthGuard>
            <h1>Dashboard</h1>
        </EmployeeAuthGuard>
    );
}
