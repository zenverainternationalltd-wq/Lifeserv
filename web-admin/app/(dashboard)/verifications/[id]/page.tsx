'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import api from '../../../../lib/api';

export default function VerificationDetailsPage({ params }) {
    const { id } = params;
    const router = useRouter();
    const [provider, setProvider] = useState(null);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [reason, setReason] = useState('');

    useEffect(() => {
        fetchProvider();
    }, [id]);

    const fetchProvider = async () => {
        try {
            const res = await api.get(`/admin/providers/${id}`);
            setProvider(res.data);
        } catch (error) {
            console.error('Error fetching provider:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleDocumentVerify = async (docIndex, isVerified) => {
        try {
            await api.put(`/admin/providers/${id}/documents/${docIndex}/verify`, { isVerified });
            // Optimistically update UI or Refetch
            fetchProvider();
        } catch (error) {
            console.error('Error verifying document:', error);
        }
    };

    const handleOverallStatus = async (status) => {
        if (status === 'rejected' && !reason.trim()) {
            alert('Please provide a rejection reason');
            return;
        }

        setSubmitting(true);
        try {
            await api.put(`/admin/providers/${id}/verify`, {
                verificationStatus: status,
                rejectionReason: status === 'rejected' ? reason : null
            });
            router.push('/verifications');
        } catch (error) {
            console.error('Error updating status:', error);
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) {
        return (
            <div className="p-8 pb-0 text-center">
                <div className="bg-white rounded-[28px] shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-gray-100/50 p-12">
                    <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#1D1D1F] mx-auto"></div>
                    <p className="mt-4 text-[#86868B] font-medium text-[15px]">Loading details...</p>
                </div>
            </div>
        );
    }

    if (!provider) {
        return (
            <div className="p-8 text-center">
                <div className="bg-[#FFF2F2] border border-[#FFD1D1] text-[#E03A3A] p-6 rounded-[20px] font-medium text-[15px]">
                    Provider not found
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-5xl mx-auto p-2">
            <div className="flex items-center gap-4 mb-8">
                <Link href="/verifications" className="text-[#86868B] hover:text-[#1D1D1F] transition-colors flex items-center justify-center p-2 rounded-full hover:bg-[#F5F5F7]">
                    <span className="text-xl leading-none -mt-1">←</span>
                </Link>
                <h1 className="text-[32px] font-semibold tracking-tight text-[#1D1D1F]">Verification Details</h1>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Info */}
                <div className="lg:col-span-2 space-y-6">
                    {/* User Info Card */}
                    <div className="bg-white p-8 rounded-[28px] shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-gray-100/50">
                        <h2 className="text-[20px] font-semibold mb-6 text-[#1D1D1F]">Provider Information</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-[#F5F5F7] p-6 rounded-[20px] border border-gray-100/50">
                            <div>
                                <label className="text-[13px] text-[#86868B] uppercase font-semibold tracking-wider">Name</label>
                                <div className="text-[15px] font-medium text-[#1D1D1F] mt-1.5">{provider.user?.name}</div>
                            </div>
                            <div>
                                <label className="text-[13px] text-[#86868B] uppercase font-semibold tracking-wider">Email</label>
                                <div className="text-[15px] font-medium text-[#1D1D1F] mt-1.5">{provider.user?.email}</div>
                            </div>
                            <div>
                                <label className="text-[13px] text-[#86868B] uppercase font-semibold tracking-wider">Phone</label>
                                <div className="text-[15px] font-medium text-[#1D1D1F] mt-1.5">{provider.user?.phone}</div>
                            </div>
                            <div>
                                <label className="text-[13px] text-[#86868B] uppercase font-semibold tracking-wider">Address</label>
                                <div className="text-[15px] font-medium text-[#1D1D1F] mt-1.5">
                                    {provider.location?.address}, {provider.location?.city}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Documents */}
                    <div className="bg-white p-8 rounded-[28px] shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-gray-100/50">
                        <h2 className="text-[20px] font-semibold mb-6 text-[#1D1D1F]">Documents</h2>
                        <div className="space-y-4">
                            {provider.documents && provider.documents.length > 0 ? (
                                provider.documents.map((doc, index) => (
                                    <div key={index} className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-5 border border-gray-100/50 rounded-[20px] bg-[#F5F5F7]">
                                        <div className="mb-4 sm:mb-0">
                                            <div className="font-semibold text-[15px] text-[#1D1D1F] capitalize">{doc.type}</div>
                                            <a
                                                href={doc.fileUrl}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-[14px] font-medium text-[#0066CC] hover:underline mt-1 inline-block"
                                            >
                                                View Document ↗
                                            </a>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            {doc.isVerified ? (
                                                <span className="text-[#34C759] bg-[#E5F9E0] px-3.5 py-1.5 rounded-lg text-[13px] font-semibold">Verified</span>
                                            ) : (
                                                <span className="text-[#FF9500] bg-[#FFF7E5] px-3.5 py-1.5 rounded-lg text-[13px] font-semibold">Pending</span>
                                            )}

                                            {doc.isVerified ? (
                                                <button
                                                    onClick={() => handleDocumentVerify(index, false)}
                                                    className="px-4 py-2 text-[14px] font-medium bg-white border border-gray-200/60 rounded-xl hover:bg-gray-50 text-[#1D1D1F] transition-colors"
                                                >
                                                    Revoke
                                                </button>
                                            ) : (
                                                <button
                                                    onClick={() => handleDocumentVerify(index, true)}
                                                    className="px-4 py-2 text-[14px] font-medium bg-[#1D1D1F] text-white rounded-xl hover:bg-[#333336] transition-colors"
                                                >
                                                    Verify
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="text-[#86868B] italic bg-[#F5F5F7] p-6 rounded-[20px] text-center text-[15px]">No documents uploaded.</div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Actions Sidebar */}
                <div className="space-y-6">
                    <div className="bg-white p-8 rounded-[28px] shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-gray-100/50 sticky top-8">
                        <h2 className="text-[20px] font-semibold mb-6 text-[#1D1D1F]">Final Decision</h2>

                        <div className="mb-6 bg-[#F5F5F7] p-5 rounded-[20px] border border-gray-100/50">
                            <label className="text-[13px] text-[#86868B] uppercase font-semibold tracking-wider mb-2.5 block relative">Current Status</label>
                            <div className={`inline-block px-4 py-1.5 rounded-lg text-[14px] font-bold capitalize
                                ${provider.verificationStatus === 'approved' ? 'bg-[#E5F9E0] text-[#34C759]' :
                                    provider.verificationStatus === 'rejected' ? 'bg-[#FFF2F2] text-[#FF3B30]' :
                                        'bg-[#FFF7E5] text-[#FF9500]'}`}>
                                {provider.verificationStatus}
                            </div>
                        </div>

                        <div className="space-y-4">
                            <button
                                onClick={() => handleOverallStatus('approved')}
                                disabled={submitting || provider.verificationStatus === 'approved'}
                                className="w-full py-4 bg-[#1D1D1F] hover:bg-[#333336] text-white rounded-[14px] font-medium text-[15px] disabled:opacity-50 disabled:bg-[#86868B] disabled:cursor-not-allowed transition-all active:scale-[0.98]"
                            >
                                Approve Provider
                            </button>

                            <div className="relative py-4">
                                <div className="absolute inset-0 flex items-center">
                                    <div className="w-full border-t border-gray-200/60"></div>
                                </div>
                                <div className="relative flex justify-center">
                                    <span className="bg-white px-3 text-[13px] text-[#86868B] font-medium tracking-wider uppercase">Or</span>
                                </div>
                            </div>

                            <div>
                                <label className="text-[14px] text-[#1D1D1F] font-medium mb-2 block">Rejection Reason</label>
                                <textarea
                                    value={reason}
                                    onChange={(e) => setReason(e.target.value)}
                                    className="w-full bg-[#F5F5F7] border border-transparent rounded-[16px] p-4 text-[15px] text-[#1D1D1F] placeholder-[#86868B] mb-4 h-32 focus:outline-none focus:bg-white focus:border-[#0066CC] transition-all resize-none"
                                    placeholder="Required if rejecting..."
                                ></textarea>
                                <button
                                    onClick={() => handleOverallStatus('rejected')}
                                    disabled={submitting || provider.verificationStatus === 'rejected'}
                                    className="w-full py-4 bg-[#FFF2F2] text-[#FF3B30] hover:bg-[#FFE5E5] rounded-[14px] font-medium text-[15px] border border-[#FFD1D1] disabled:opacity-50 disabled:cursor-not-allowed transition-all active:scale-[0.98]"
                                >
                                    Reject Provider
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
