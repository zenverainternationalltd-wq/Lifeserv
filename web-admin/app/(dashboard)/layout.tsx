import Sidebar from '../../components/Sidebar';

export default function DashboardLayout({ children }) {
    return (
        <div className="flex min-h-screen bg-[#F5F5F7]">
            <Sidebar />
            <main className="flex-1 h-screen overflow-y-auto">
                <div className="p-8 max-w-7xl mx-auto">
                    {children}
                </div>
            </main>
        </div>
    );
}
