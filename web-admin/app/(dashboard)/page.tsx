'use client';

import { useEffect, useState } from 'react';
import { Users, DollarSign, Calendar, Activity, Clock, CheckCircle } from 'lucide-react';
import api from '../../lib/api';
import Link from 'next/link';

interface DashboardStats {
    users: number;
    providers: number;
    bookings: number;
    revenue: number;
    pendingVerifications: number;
    recentBookings: any[];
}

export default function Dashboard() {
    const [stats, setStats] = useState<DashboardStats>({
        users: 0,
        providers: 0,
        bookings: 0,
        revenue: 0,
        pendingVerifications: 0,
        recentBookings: []
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const fetchDashboardData = async () => {
        try {
            const response = await api.get('/admin/dashboard');
            setStats(response.data);
            setLoading(false);
        } catch (error) {
            console.error('Failed to fetch dashboard data:', error);
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="p-8 flex items-center justify-center h-full">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Loading dashboard...</p>
                </div>
            </div>
        );
    }

    return (
        <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-8">Admin Dashboard</h1>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <StatsCard
                    title="Total Users"
                    value={stats.users}
                    icon={<Users className="w-5 h-5 text-[#0066CC]" />}
                    color="bg-[#F5F5F7] text-[#0066CC]"
                    link="/users"
                />
                <StatsCard
                    title="Service Providers"
                    value={stats.providers}
                    icon={<Activity className="w-5 h-5 text-[#32ADE6]" />}
                    color="bg-[#F5F5F7] text-[#32ADE6]"
                    link="/providers"
                />
                <StatsCard
                    title="Total Bookings"
                    value={stats.bookings}
                    icon={<Calendar className="w-5 h-5 text-[#FF9500]" />}
                    color="bg-[#F5F5F7] text-[#FF9500]"
                    link="/bookings"
                />
                <StatsCard
                    title="Total Revenue"
                    value={`₹${stats.revenue.toLocaleString()}`}
                    icon={<DollarSign className="w-5 h-5 text-[#34C759]" />}
                    color="bg-[#F5F5F7] text-[#34C759]"
                    link="/finance"
                />
            </div>

            {/* Pending Verifications Alert */}
            {stats.pendingVerifications > 0 && (
                <div className="bg-[#FFF8E6] border border-[#FFE4A0] px-5 py-4 mb-8 rounded-[20px] shadow-sm">
                    <div className="flex items-center">
                        <Clock className="w-5 h-5 text-[#E68A00] mr-3" />
                        <div className="flex-1">
                            <p className="text-[15px] font-medium text-[#B86E00]">
                                {stats.pendingVerifications} provider{stats.pendingVerifications > 1 ? 's' : ''} pending verification
                            </p>
                        </div>
                        <Link
                            href="/verifications"
                            className="text-[14px] font-semibold text-[#B86E00] hover:text-[#E68A00] transition-colors"
                        >
                            Review Now →
                        </Link>
                    </div>
                </div>
            )}

            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
                {/* Recent Bookings */}
                <div className="xl:col-span-2 bg-white p-7 rounded-[28px] shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-gray-100/50">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-[20px] font-semibold tracking-tight text-[#1D1D1F]">Recent Bookings</h2>
                        <Link href="/bookings" className="text-[14px] font-medium text-[#0066CC] hover:underline">
                            View All
                        </Link>
                    </div>
                    <div className="space-y-3">
                        {stats.recentBookings && stats.recentBookings.length > 0 ? (
                            stats.recentBookings.map((booking: any) => (
                                <div key={booking.id} className="flex items-center justify-between p-4 bg-[#F5F5F7] rounded-[20px] hover:bg-[#F2F2F4] transition-colors">
                                    <div className="flex items-center gap-4">
                                        <div className="w-11 h-11 bg-white rounded-[14px] shadow-sm flex items-center justify-center text-[#1D1D1F] font-semibold text-[16px]">
                                            {booking.customer?.name?.[0] || 'U'}
                                        </div>
                                        <div>
                                            <p className="font-semibold text-[15px] text-[#1D1D1F]">{booking.customer?.name || 'Unknown'}</p>
                                            <p className="text-[13px] text-[#86868B] mt-0.5">{booking.Service?.name || 'Service'}</p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="font-semibold text-[15px] text-[#1D1D1F]">₹{booking.price}</p>
                                        <p className={`text-[13px] font-medium mt-0.5 ${booking.status === 'completed' ? 'text-[#34C759]' :
                                            booking.status === 'pending' ? 'text-[#FF9500]' :
                                                'text-[#0066CC]'
                                            }`}>
                                            {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                                        </p>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="text-center py-10 bg-[#F5F5F7] rounded-[20px]">
                                <Calendar className="w-10 h-10 mx-auto mb-3 text-[#B0B0B5]" />
                                <p className="text-[15px] font-medium text-[#86868B]">No recent bookings</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Quick Actions */}
                <div className="bg-white p-7 rounded-[28px] shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-gray-100/50">
                    <h2 className="text-[20px] font-semibold tracking-tight text-[#1D1D1F] mb-6">Quick Actions</h2>
                    <div className="space-y-3">
                        <Link
                            href="/users"
                            className="flex items-center justify-between p-4 bg-[#F5F5F7] hover:bg-[#EAEAEA] rounded-[20px] transition-colors group"
                        >
                            <div className="flex items-center gap-4">
                                <div className="p-2 bg-white rounded-xl shadow-sm">
                                    <Users className="w-5 h-5 text-[#0066CC]" />
                                </div>
                                <span className="font-medium text-[15px] text-[#1D1D1F]">Manage Users</span>
                            </div>
                            <span className="text-[#86868B] group-hover:text-[#1D1D1F] group-hover:translate-x-1 transition-all">→</span>
                        </Link>

                        <Link
                            href="/providers"
                            className="flex items-center justify-between p-4 bg-[#F5F5F7] hover:bg-[#EAEAEA] rounded-[20px] transition-colors group"
                        >
                            <div className="flex items-center gap-4">
                                <div className="p-2 bg-white rounded-xl shadow-sm">
                                    <Activity className="w-5 h-5 text-[#32ADE6]" />
                                </div>
                                <span className="font-medium text-[15px] text-[#1D1D1F]">Manage Providers</span>
                            </div>
                            <span className="text-[#86868B] group-hover:text-[#1D1D1F] group-hover:translate-x-1 transition-all">→</span>
                        </Link>

                        <Link
                            href="/services"
                            className="flex items-center justify-between p-4 bg-[#F5F5F7] hover:bg-[#EAEAEA] rounded-[20px] transition-colors group"
                        >
                            <div className="flex items-center gap-4">
                                <div className="p-2 bg-white rounded-xl shadow-sm">
                                    <CheckCircle className="w-5 h-5 text-[#34C759]" />
                                </div>
                                <span className="font-medium text-[15px] text-[#1D1D1F]">Manage Services</span>
                            </div>
                            <span className="text-[#86868B] group-hover:text-[#1D1D1F] group-hover:translate-x-1 transition-all">→</span>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}

function StatsCard({ title, value, icon, color, link }: any) {
    const content = (
        <div className={`bg-white p-6 rounded-[28px] shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-gray-100/50 flex flex-col justify-between h-full ${link ? 'hover:shadow-[0_8px_30px_rgba(0,0,0,0.08)] transition-all duration-300 transform hover:-translate-y-1 cursor-pointer' : ''}`}>
            <div className="flex items-start justify-between mb-4">
                <div className={`p-3 rounded-[16px] ${color}`}>
                    {icon}
                </div>
            </div>
            <div>
                <p className="text-[28px] font-bold tracking-tight text-[#1D1D1F] mb-1">{value}</p>
                <p className="text-[15px] font-medium text-[#86868B]">{title}</p>
            </div>
        </div>
    );

    if (link) {
        return <Link href={link}>{content}</Link>;
    }

    return content;
}
