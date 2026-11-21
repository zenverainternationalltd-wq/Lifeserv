'use client';

import { useEffect, useState } from 'react';
import { Search, MapPin, Star, CheckCircle, XCircle, Clock, FileText, Eye, Shield } from 'lucide-react';
import api from '../../../lib/api';

interface Provider {
    id: string;
    userId: string;
    services: any[];
    documents: Array<{
        type: string;
        fileUrl: string;
        isVerified: boolean;
    }>;
    location: {
        address: string;
        city: string;
        state: string;
    };
    rating: number;
    totalJobs: number;
    isVerified: boolean;
    verificationStatus: 'pending' | 'approved' | 'rejected';
    rejectionReason?: string;
    user: {
        id: string;
        name: string;
        email: string;
        phone: string;
        photo?: string;
        isActive: boolean;
    };
}

export default function ProvidersPage() {
    const [providers, setProviders] = useState<Provider[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState<string>('all');
    const [selectedProvider, setSelectedProvider] = useState<Provider | null>(null);
    const [showModal, setShowModal] = useState(false);

    useEffect(() => {
        fetchProviders();
    }, [statusFilter]);

    const fetchProviders = async () => {
        try {
            setLoading(true);
            const params: any = {};

            if (statusFilter !== 'all') {
                params.verificationStatus = statusFilter;
            }

            if (searchTerm) {
                params.search = searchTerm;
            }

            const res = await api.get('/admin/providers', { params });
            setProviders(res.data);
            setLoading(false);
        } catch (error) {
            console.error('Failed to fetch providers:', error);
            setLoading(false);
        }
    };

    const updateVerificationStatus = async (providerId: string, status: 'approved' | 'rejected', reason?: string) => {
        try {
            await api.put(`/admin/providers/${providerId}/verify`, {
                verificationStatus: status,
                rejectionReason: reason
            });
            fetchProviders();
            setShowModal(false);
            setSelectedProvider(null);
        } catch (error) {
            console.error('Failed to update verification status:', error);
            alert('Failed to update verification status');
        }
    };

    const verifyDocument = async (providerId: string, docIndex: number, isVerified: boolean) => {
        try {
            await api.put(`/admin/providers/${providerId}/documents/${docIndex}/verify`, {
                isVerified
            });
            fetchProviders();
        } catch (error) {
            console.error('Failed to verify document:', error);
            alert('Failed to verify document');
        }
    };

    const viewProviderDetails = (provider: Provider) => {
        setSelectedProvider(provider);
        setShowModal(true);
    };

    const filteredProviders = providers.filter(provider =>
        provider.user?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        provider.user?.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="p-2 min-h-screen">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
                <h1 className="text-[32px] font-semibold tracking-tight text-[#1D1D1F]">Service Providers</h1>
                <div className="flex flex-wrap gap-3">
                    {/* Status Filter */}
                    <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="px-4 py-2.5 bg-[#F5F5F7] border-2 border-transparent text-[15px] font-medium text-[#1D1D1F] rounded-xl focus:outline-none focus:bg-white focus:border-[#0066CC] transition-all cursor-pointer"
                    >
                        <option value="all">All Status</option>
                        <option value="pending">Pending</option>
                        <option value="approved">Approved</option>
                        <option value="rejected">Rejected</option>
                    </select>

                    {/* Search */}
                    <div className="relative">
                        <input
                            type="text"
                            placeholder="Search providers..."
                            className="pl-11 pr-4 py-2.5 bg-[#F5F5F7] border-2 border-transparent text-[15px] text-[#1D1D1F] placeholder-[#86868B] rounded-xl focus:outline-none focus:bg-white focus:border-[#0066CC] transition-all w-64 md:w-72"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && fetchProviders()}
                        />
                        <Search className="w-5 h-5 text-[#86868B] absolute left-3.5 top-3" />
                    </div>
                </div>
            </div>

            {loading ? (
                <div className="bg-white rounded-[28px] shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-gray-100/50 p-12 text-center">
                    <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#1D1D1F] mx-auto"></div>
                    <p className="mt-4 text-[#86868B] font-medium text-[15px]">Loading providers...</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredProviders.map((provider) => (
                        <div key={provider.id} className="bg-white p-7 rounded-[28px] shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-gray-100/50 hover:shadow-[0_8px_30px_rgba(0,0,0,0.08)] transition-all duration-300 flex flex-col h-full group">
                            <div className="flex justify-between items-start mb-6">
                                <div className="flex items-center gap-4">
                                    <div className="w-14 h-14 bg-white border border-gray-200/60 shadow-sm rounded-2xl flex items-center justify-center text-[#1D1D1F] font-semibold text-[20px]">
                                        {provider.user?.name?.[0] || 'P'}
                                    </div>
                                    <div>
                                        <h3 className="text-[17px] font-semibold text-[#1D1D1F] leading-tight">{provider.user?.name || 'Unknown'}</h3>
                                        <p className="text-[14px] text-[#86868B] mt-0.5">{provider.user?.email}</p>
                                    </div>
                                </div>
                                <span className={`px-2.5 py-1 rounded-lg text-[13px] font-semibold ${provider.verificationStatus === 'approved' ? 'bg-[#E5F9E0] text-[#34C759]' :
                                    provider.verificationStatus === 'rejected' ? 'bg-[#FFF2F2] text-[#FF3B30]' :
                                        'bg-[#FFF7E5] text-[#FF9500]'
                                    }`}>
                                    {provider.verificationStatus.charAt(0).toUpperCase() + provider.verificationStatus.slice(1)}
                                </span>
                            </div>

                            <div className="space-y-3 mb-6 flex-1">
                                <div className="flex items-center text-[#515154] text-[14px] font-medium bg-[#F5F5F7] p-3 rounded-xl hover:bg-[#EAEAEA] transition-colors">
                                    <MapPin className="w-4 h-4 mr-3 text-[#0066CC]" />
                                    {provider.location?.city || 'Location not set'}, {provider.location?.state || ''}
                                </div>
                                <div className="flex items-center text-[#515154] text-[14px] font-medium bg-[#F5F5F7] p-3 rounded-xl hover:bg-[#EAEAEA] transition-colors">
                                    <Star className="w-4 h-4 mr-3 text-[#FF9500] fill-[#FF9500]" />
                                    {provider.rating || 0} Rating • {provider.totalJobs || 0} Jobs
                                </div>
                                <div className="flex items-center text-[#515154] text-[14px] font-medium bg-[#F5F5F7] p-3 rounded-xl hover:bg-[#EAEAEA] transition-colors">
                                    <FileText className="w-4 h-4 mr-3 text-[#32ADE6]" />
                                    {provider.documents?.length || 0} Documents
                                </div>
                            </div>

                            <div className="flex gap-3">
                                <button
                                    onClick={() => viewProviderDetails(provider)}
                                    className="flex-1 px-4 py-3 bg-[#F5F5F7] text-[#1D1D1F] rounded-[14px] hover:bg-[#EAEAEA] text-[14px] font-medium flex items-center justify-center gap-2 transition-colors duration-200"
                                >
                                    <Eye className="w-4 h-4" />
                                    Details
                                </button>
                                {provider.verificationStatus === 'pending' && (
                                    <button
                                        onClick={() => updateVerificationStatus(provider.id, 'approved')}
                                        className="flex-1 px-4 py-3 bg-[#1D1D1F] text-white rounded-[14px] hover:bg-[#333336] text-[14px] font-medium flex items-center justify-center gap-2 transition-colors duration-200"
                                    >
                                        <CheckCircle className="w-4 h-4" />
                                        Approve
                                    </button>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {!loading && filteredProviders.length === 0 && (
                <div className="bg-white rounded-[28px] shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-gray-100/50 p-16 text-center">
                    <Search className="w-12 h-12 mx-auto mb-4 text-[#C7C7CC]" />
                    <p className="text-[17px] font-semibold text-[#1D1D1F]">No providers found</p>
                    <p className="text-[15px] text-[#86868B] mt-1">Try adjusting your search or filters</p>
                </div>
            )}

            {/* Provider Details Modal */}
            {showModal && selectedProvider && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
                        <div className="p-6 border-b border-gray-200 sticky top-0 bg-white">
                            <div className="flex justify-between items-center">
                                <h2 className="text-2xl font-bold text-gray-900">Provider Details</h2>
                                <button
                                    onClick={() => setShowModal(false)}
                                    className="text-gray-400 hover:text-gray-600"
                                >
                                    <XCircle className="w-6 h-6" />
                                </button>
                            </div>
                        </div>

                        <div className="p-6 space-y-6">
                            {/* User Info */}
                            <div>
                                <h3 className="text-lg font-bold mb-3">Personal Information</h3>
                                <div className="grid grid-cols-2 gap-4 bg-gray-50 p-4 rounded-lg">
                                    <div>
                                        <p className="text-sm text-gray-500">Name</p>
                                        <p className="font-semibold">{selectedProvider.user?.name}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500">Email</p>
                                        <p className="font-semibold">{selectedProvider.user?.email}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500">Phone</p>
                                        <p className="font-semibold">{selectedProvider.user?.phone}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500">Status</p>
                                        <p className={`font-semibold ${selectedProvider.user?.isActive ? 'text-green-600' : 'text-red-600'}`}>
                                            {selectedProvider.user?.isActive ? 'Active' : 'Inactive'}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Documents */}
                            <div>
                                <h3 className="text-lg font-bold mb-3">Documents</h3>
                                {selectedProvider.documents && selectedProvider.documents.length > 0 ? (
                                    <div className="space-y-3">
                                        {selectedProvider.documents.map((doc, index) => (
                                            <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                                                <div className="flex items-center gap-3">
                                                    <FileText className="w-5 h-5 text-blue-600" />
                                                    <div>
                                                        <p className="font-semibold">{doc.type}</p>
                                                        <a
                                                            href={doc.fileUrl}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="text-sm text-blue-600 hover:underline"
                                                        >
                                                            View Document
                                                        </a>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    {doc.isVerified ? (
                                                        <span className="flex items-center gap-1 text-green-600 text-sm font-medium">
                                                            <CheckCircle className="w-4 h-4" />
                                                            Verified
                                                        </span>
                                                    ) : (
                                                        <button
                                                            onClick={() => verifyDocument(selectedProvider.id, index, true)}
                                                            className="px-3 py-1 bg-green-600 text-white rounded text-sm font-semibold hover:bg-green-700"
                                                        >
                                                            Verify
                                                        </button>
                                                    )}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <p className="text-gray-500 text-center py-4">No documents uploaded</p>
                                )}
                            </div>

                            {/* Verification Actions */}
                            {selectedProvider.verificationStatus === 'pending' && (
                                <div className="flex gap-3 pt-4 border-t border-gray-200">
                                    <button
                                        onClick={() => updateVerificationStatus(selectedProvider.id, 'approved')}
                                        className="flex-1 px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 font-semibold flex items-center justify-center gap-2"
                                    >
                                        <CheckCircle className="w-5 h-5" />
                                        Approve Provider
                                    </button>
                                    <button
                                        onClick={() => {
                                            const reason = prompt('Enter rejection reason:');
                                            if (reason) {
                                                updateVerificationStatus(selectedProvider.id, 'rejected', reason);
                                            }
                                        }}
                                        className="flex-1 px-4 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 font-semibold flex items-center justify-center gap-2"
                                    >
                                        <XCircle className="w-5 h-5" />
                                        Reject Provider
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
