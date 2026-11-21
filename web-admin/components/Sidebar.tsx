'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Sidebar() {
    const pathname = usePathname();

    const isActive = (path) => pathname === path;

    return (
        <aside className="w-[260px] bg-white border-r border-gray-200/60 p-6 hidden md:flex flex-col flex-shrink-0 h-screen sticky top-0 overflow-y-auto">
            <div className="mb-10 px-2">
                <h1 className="text-2xl font-semibold tracking-tight text-[#1D1D1F]">
                    ServeConnect
                </h1>
            </div>

            <nav className="space-y-1.5 flex-1">
                <NavLink href="/" icon="📊" label="Dashboard" active={isActive('/')} />
                <NavLink href="/users" icon="👥" label="Users" active={isActive('/users')} />
                <NavLink href="/providers" icon="👷" label="Providers" active={isActive('/providers')} />
                <NavLink href="/services" icon="🛠️" label="Services" active={isActive('/services')} />
                <NavLink href="/bookings" icon="📅" label="Bookings" active={isActive('/bookings')} />
                <NavLink href="/verifications" icon="✓" label="Verifications" active={isActive('/verifications')} />
            </nav>

            <div className="mt-8 pt-6 border-t border-gray-200/60">
                <button
                    onClick={() => {
                        localStorage.removeItem('adminToken');
                        window.location.href = '/login';
                    }}
                    className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-[#E03A3A] hover:bg-[#FFF2F2] transition-colors w-full font-medium"
                >
                    <span className="text-xl">🚪</span>
                    <span className="text-[15px]">Logout</span>
                </button>
            </div>
        </aside>
    );
}

function NavLink({ href, icon, label, active }) {
    return (
        <Link
            href={href}
            className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 ${active
                    ? 'bg-[#1D1D1F] text-white shadow-sm'
                    : 'text-[#515154] hover:bg-[#F5F5F7] hover:text-[#1D1D1F]'
                }`}
        >
            <span className="text-xl opacity-90">{icon}</span>
            <span className="text-[15px] font-medium">{label}</span>
        </Link>
    );
}
