'use client';

import { useEffect, useState } from 'react';
import api from '../../../lib/api';
import { Search, UserCheck, Ban, MoreVertical, Filter, Eye } from 'lucide-react';

interface User {
    id: string;
    name: string;
    email: string;
    phone: string;
    role: 'customer' | 'provider' | 'admin';
    isActive: boolean;
    isVerified: boolean;
    createdAt: string;
}

export default function UsersPage() {
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [roleFilter, setRoleFilter] = useState<string>('all');
    const [statusFilter, setStatusFilter] = useState<string>('all');

    useEffect(() => {
        fetchUsers();
    }, [roleFilter, statusFilter]);

    const fetchUsers = async () => {
        try {
            setLoading(true);
            const params: any = {};

            if (roleFilter !== 'all') {
                params.role = roleFilter;
            }

            if (statusFilter === 'active') {
                params.status = 'active';
            } else if (statusFilter === 'inactive') {
                params.status = 'inactive';
            }

            if (searchTerm) {
                params.search = searchTerm;
            }

            const res = await api.get('/admin/users', { params });
            setUsers(res.data);
            setLoading(false);
        } catch (error) {
            console.error('Failed to fetch users:', error);
            setLoading(false);
        }
    };

    const handleSearch = () => {
        fetchUsers();
    };

    const toggleUserStatus = async (userId: string, currentStatus: boolean) => {
        try {
            await api.put(`/admin/users/${userId}/status`, {
                isActive: !currentStatus
            });
            fetchUsers();
        } catch (error) {
            console.error('Failed to update user status:', error);
            alert('Failed to update user status');
        }
    };

    const verifyUser = async (userId: string) => {
        try {
            await api.put(`/admin/users/${userId}/status`, {
                isVerified: true
            });
            fetchUsers();
        } catch (error) {
            console.error('Failed to verify user:', error);
            alert('Failed to verify user');
        }
    };

    const filteredUsers = users.filter(user =>
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.phone.includes(searchTerm)
    );

    return (
        <div className="p-2 min-h-screen">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
                <h1 className="text-[32px] font-semibold tracking-tight text-[#1D1D1F]">User Management</h1>
                <div className="flex flex-wrap gap-3">
                    {/* Role Filter */}
                    <select
                        value={roleFilter}
                        onChange={(e) => setRoleFilter(e.target.value)}
                        className="px-4 py-2.5 bg-[#F5F5F7] border-2 border-transparent text-[15px] font-medium text-[#1D1D1F] rounded-xl focus:outline-none focus:bg-white focus:border-[#0066CC] transition-all cursor-pointer"
                    >
                        <option value="all">All Roles</option>
                        <option value="customer">Customers</option>
                        <option value="provider">Providers</option>
                        <option value="admin">Admins</option>
                    </select>

                    {/* Status Filter */}
                    <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="px-4 py-2.5 bg-[#F5F5F7] border-2 border-transparent text-[15px] font-medium text-[#1D1D1F] rounded-xl focus:outline-none focus:bg-white focus:border-[#0066CC] transition-all cursor-pointer"
                    >
                        <option value="all">All Status</option>
                        <option value="active">Active</option>
                        <option value="inactive">Inactive</option>
                    </select>

                    {/* Search */}
                    <div className="relative">
                        <input
                            type="text"
                            placeholder="Search users..."
                            className="pl-11 pr-4 py-2.5 bg-[#F5F5F7] border-2 border-transparent text-[15px] text-[#1D1D1F] placeholder-[#86868B] rounded-xl focus:outline-none focus:bg-white focus:border-[#0066CC] transition-all w-64 md:w-72"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                        />
                        <Search className="w-5 h-5 text-[#86868B] absolute left-3.5 top-3" />
                    </div>
                </div>
            </div>

            {loading ? (
                <div className="bg-white rounded-[28px] shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-gray-100/50 p-12 text-center">
                    <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#1D1D1F] mx-auto"></div>
                    <p className="mt-4 text-[#86868B] font-medium text-[15px]">Loading users...</p>
                </div>
            ) : (
                <div className="bg-white rounded-[28px] shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-gray-100/50 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead className="bg-[#F5F5F7] border-b border-gray-200/60">
                                <tr>
                                    <th className="px-6 py-4 font-semibold text-[#86868B] text-[13px] uppercase tracking-wider">User</th>
                                    <th className="px-6 py-4 font-semibold text-[#86868B] text-[13px] uppercase tracking-wider">Phone</th>
                                    <th className="px-6 py-4 font-semibold text-[#86868B] text-[13px] uppercase tracking-wider">Role</th>
                                    <th className="px-6 py-4 font-semibold text-[#86868B] text-[13px] uppercase tracking-wider">Status</th>
                                    <th className="px-6 py-4 font-semibold text-[#86868B] text-[13px] uppercase tracking-wider">Verified</th>
                                    <th className="px-6 py-4 font-semibold text-[#86868B] text-[13px] uppercase tracking-wider">Joined</th>
                                    <th className="px-6 py-4 font-semibold text-[#86868B] text-[13px] uppercase tracking-wider text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100/60">
                                {filteredUsers.map((user) => (
                                    <tr key={user.id} className="hover:bg-[#F2F2F4] transition-colors duration-200 group">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-4">
                                                <div className="w-11 h-11 bg-white border border-gray-200/60 shadow-sm rounded-[14px] flex items-center justify-center text-[#1D1D1F] font-semibold text-[16px]">
                                                    {user.name[0].toUpperCase()}
                                                </div>
                                                <div>
                                                    <p className="font-semibold text-[15px] text-[#1D1D1F]">{user.name}</p>
                                                    <p className="text-[13px] text-[#86868B] mt-0.5">{user.email}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-[15px] text-[#515154] font-medium">
                                            {user.phone}
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`px-2.5 py-1 rounded-lg text-[13px] font-semibold ${user.role === 'provider' ? 'bg-[#F2F2F7] text-[#AF52DE]' :
                                                user.role === 'admin' ? 'bg-[#FFF2F2] text-[#FF3B30]' :
                                                    'bg-[#F2F2F7] text-[#007AFF]'
                                                }`}>
                                                {user.role.toUpperCase()}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[13px] font-semibold ${user.isActive ? 'bg-[#E5F9E0] text-[#34C759]' : 'bg-[#FFF2F2] text-[#FF3B30]'
                                                }`}>
                                                <span className={`w-1.5 h-1.5 rounded-full ${user.isActive ? 'bg-[#34C759]' : 'bg-[#FF3B30]'}`} />
                                                {user.isActive ? 'Active' : 'Inactive'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            {user.isVerified ? (
                                                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#E5F9E0] text-[#34C759] text-[13px] font-semibold">
                                                    <UserCheck className="w-3.5 h-3.5" />
                                                    Verified
                                                </span>
                                            ) : (
                                                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#FFF7E5] text-[#FF9500] text-[13px] font-semibold">
                                                    Pending
                                                </span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 text-[#86868B] text-[14px]">
                                            {new Date(user.createdAt).toLocaleDateString()}
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex justify-end gap-2 text-white">
                                                {!user.isVerified && (
                                                    <button
                                                        onClick={() => verifyUser(user.id)}
                                                        className="p-2 text-[#34C759] hover:bg-[#E5F9E0] rounded-[10px] transition-colors"
                                                        title="Verify User"
                                                    >
                                                        <UserCheck className="w-5 h-5" />
                                                    </button>
                                                )}
                                                <button
                                                    onClick={() => toggleUserStatus(user.id, user.isActive)}
                                                    className={`p-2 rounded-[10px] transition-colors ${user.isActive
                                                        ? 'text-[#FF3B30] hover:bg-[#FFF2F2]'
                                                        : 'text-[#34C759] hover:bg-[#E5F9E0]'
                                                        }`}
                                                    title={user.isActive ? 'Suspend User' : 'Activate User'}
                                                >
                                                    <Ban className="w-5 h-5" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {filteredUsers.length === 0 && (
                        <div className="p-16 text-center">
                            <Search className="w-12 h-12 mx-auto mb-4 text-[#C7C7CC]" />
                            <p className="text-[17px] font-semibold text-[#1D1D1F]">No users found</p>
                            <p className="text-[15px] text-[#86868B] mt-1">Try adjusting your search or filters</p>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
