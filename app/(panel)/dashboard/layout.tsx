import { SidebarDashboard } from "./_components/sidebar";

export default function Dashboard({ children }: { children: React.ReactNode }) {
    return (
        <>
            <SidebarDashboard>
            {children}
            </SidebarDashboard>
        </>
    )
}