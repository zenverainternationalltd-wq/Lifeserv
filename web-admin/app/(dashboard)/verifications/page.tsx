'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import api from '../../../lib/api';

export default function VerificationsPage() {
    const [verifications, setVerifications] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchVerifications();
    }, []);

    const fetchVerifications = async () => {
        try {
            const token = localStorage.getItem('adminToken');
            const res = await api.get('/admin/verifications/pending');
            setVerifications(res.data);
        } catch (error) {
            console.error('Error fetching verifications:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="p-8 pb-0 text-center">
                <div className="bg-white rounded-[28px] shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-gray-100/50 p-12">
                    <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#1D1D1F] mx-auto"></div>
                    <p className="mt-4 text-[#86868B] font-medium text-[15px]">Loading verifications...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="p-2 min-h-screen">
            <h1 className="text-[32px] font-semibold tracking-tight text-[#1D1D1F] mb-8">Pending Verifications</h1>

            <div className="bg-white rounded-[28px] shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-gray-100/50 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead className="bg-[#F5F5F7] border-b border-gray-200/60">
                            <tr>
                                <th className="px-6 py-4 font-semibold text-[#86868B] text-[13px] uppercase tracking-wider">Provider</th>
                                <th className="px-6 py-4 font-semibold text-[#86868B] text-[13px] uppercase tracking-wider">Email</th>
                                <th className="px-6 py-4 font-semibold text-[#86868B] text-[13px] uppercase tracking-wider">Applied Date</th>
                                <th className="px-6 py-4 font-semibold text-[#86868B] text-[13px] uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100/60">
                            {verifications.map((provider) => (
                                <tr key={provider.id} className="hover:bg-[#F2F2F4] transition-colors duration-200 group">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-4">
                                            <div className="w-11 h-11 bg-white border border-gray-200/60 shadow-sm rounded-[14px] flex items-center justify-center text-[#1D1D1F] font-semibold text-[16px]">
                                                {provider.user?.name?.[0] || 'P'}
                                            </div>
                                            <div>
                                                <div className="font-semibold text-[15px] text-[#1D1D1F]">{provider.user?.name}</div>
                                                <div className="text-[13px] text-[#86868B] mt-0.5">ID: {provider.id?.substring(0, 8)}...</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-[14px] text-[#515154] font-medium">{provider.user?.email}</td>
                                    <td className="px-6 py-4 text-[14px] text-[#515154] font-medium">
                                        {new Date(provider.createdAt).toLocaleDateString()}
                                    </td>
                                    <td className="px-6 py-4">
                                        <Link
                                            href={`/verifications/${provider.id}`}
                                            className="inline-flex items-center px-4 py-2 bg-[#F5F5F7] text-[#1D1D1F] hover:bg-[#EAEAEA] rounded-[10px] transition-colors font-medium text-[14px]"
                                        >
                                            Review details
                                        </Link>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {verifications.length === 0 && (
                    <div className="p-16 text-center">
                        <div className="text-[#1D1D1F] font-semibold text-[17px]">No pending verifications found</div>
                        <div className="text-[#86868B] text-[15px] mt-1">All caught up!</div>
                    </div>
                )}
            </div>
        </div>
    );
}
