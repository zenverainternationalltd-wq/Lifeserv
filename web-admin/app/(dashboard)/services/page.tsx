'use client';

import { useEffect, useState } from 'react';
import { Search, Plus, Trash2, X } from 'lucide-react';
import api from '../../../lib/api';

interface Service {
    id: string;
    name: string;
    category: string;
    icon?: string;
}

export default function ServicesPage() {
    const [services, setServices] = useState<Service[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [newItem, setNewItem] = useState({ name: '', category: '', icon: '' });
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        fetchServices();
    }, []);

    const fetchServices = async () => {
        try {
            const res = await api.get('/services');
            setServices(res.data);
        } catch (error) {
            console.error('Failed to fetch services:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleCreate = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            await api.post('/services', newItem);
            fetchServices();
            setShowModal(false);
            setNewItem({ name: '', category: '', icon: '' });
        } catch (error) {
            console.error('Failed to create service:', error);
            alert('Failed to create service');
        } finally {
            setSubmitting(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this service?')) return;
        try {
            await api.delete(`/services/${id}`);
            fetchServices();
        } catch (error) {
            console.error('Failed to delete service:', error);
            alert('Failed to delete service');
        }
    };

    const filtered = services.filter((s) =>
        s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.category.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) {
        return (
            <div className="p-8 pb-0 text-center">
                <div className="bg-white rounded-[28px] shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-gray-100/50 p-12">
                    <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#1D1D1F] mx-auto"></div>
                    <p className="mt-4 text-[#86868B] font-medium text-[15px]">Loading services...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="p-2 min-h-screen">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
                <h1 className="text-[32px] font-semibold tracking-tight text-[#1D1D1F]">Services</h1>
                <button
                    onClick={() => setShowModal(true)}
                    className="flex items-center gap-2 px-5 py-3 bg-[#1D1D1F] text-white rounded-[14px] hover:bg-[#333336] transition-all transform active:scale-[0.98] font-medium text-[15px]"
                >
                    <Plus className="w-5 h-5" />
                    Add Service
                </button>
            </div>

            <div className="bg-white rounded-[28px] shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-gray-100/50 overflow-hidden">
                <div className="p-5 border-b border-gray-100/60 bg-[#F5F5F7]/50">
                    <div className="relative w-full md:w-80">
                        <input
                            type="text"
                            placeholder="Search services..."
                            className="pl-11 pr-4 py-2.5 bg-white border-2 border-transparent text-[15px] text-[#1D1D1F] placeholder-[#86868B] rounded-[14px] focus:outline-none focus:border-[#0066CC] transition-all w-full shadow-sm"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                        <Search className="w-5 h-5 text-[#86868B] absolute left-3.5 top-3" />
                    </div>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead className="bg-[#F5F5F7] border-b border-gray-200/60">
                            <tr>
                                <th className="px-6 py-4 font-semibold text-[#86868B] text-[13px] uppercase tracking-wider">Icon</th>
                                <th className="px-6 py-4 font-semibold text-[#86868B] text-[13px] uppercase tracking-wider">Name</th>
                                <th className="px-6 py-4 font-semibold text-[#86868B] text-[13px] uppercase tracking-wider">Category</th>
                                <th className="px-6 py-4 font-semibold text-[#86868B] text-[13px] uppercase tracking-wider text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100/60">
                            {filtered.length > 0 ? (
                                filtered.map((service) => (
                                    <tr key={service.id} className="hover:bg-[#F2F2F4] transition-colors duration-200">
                                        <td className="px-6 py-4 text-2xl">
                                            <div className="w-12 h-12 bg-white border border-gray-200/60 shadow-sm rounded-[14px] flex items-center justify-center">
                                                {service.icon || '🔧'}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 font-semibold text-[15px] text-[#1D1D1F]">{service.name}</td>
                                        <td className="px-6 py-4 text-[14px] text-[#86868B]">{service.category}</td>
                                        <td className="px-6 py-4 text-right">
                                            <button
                                                onClick={() => handleDelete(service.id)}
                                                className="text-[#FF3B30] hover:bg-[#FFF2F2] p-2 rounded-[10px] transition-colors"
                                            >
                                                <Trash2 className="w-5 h-5" />
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={4} className="px-6 py-16 text-center">
                                        <div className="text-[#1D1D1F] font-semibold text-[17px]">No services found</div>
                                        <div className="text-[#86868B] text-[15px] mt-1">Try adjusting your search</div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Create Service Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-[28px] shadow-[0_8px_40px_rgba(0,0,0,0.12)] max-w-[440px] w-full p-8 transition-transform transform scale-100">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-[22px] font-semibold tracking-tight text-[#1D1D1F]">Add New Service</h2>
                            <button
                                onClick={() => setShowModal(false)}
                                className="text-[#86868B] hover:text-[#1D1D1F] transition-colors p-2 hover:bg-[#F5F5F7] rounded-full"
                            >
                                <X className="w-6 h-6" />
                            </button>
                        </div>

                        <form onSubmit={handleCreate} className="space-y-5">
                            <div>
                                <label className="block text-[14px] font-medium text-[#1D1D1F] mb-1.5 ml-1">Service Name</label>
                                <input
                                    type="text"
                                    required
                                    className="w-full bg-[#F5F5F7] border-2 border-transparent rounded-[14px] px-4 py-3 text-[15px] text-[#1D1D1F] placeholder-[#86868B] focus:outline-none focus:bg-white focus:border-[#0066CC] transition-all"
                                    placeholder="e.g. Plumbing"
                                    value={newItem.name}
                                    onChange={e => setNewItem({ ...newItem, name: e.target.value })}
                                />
                            </div>

                            <div>
                                <label className="block text-[14px] font-medium text-[#1D1D1F] mb-1.5 ml-1">Category</label>
                                <select
                                    required
                                    className="w-full bg-[#F5F5F7] border-2 border-transparent rounded-[14px] px-4 py-3 text-[15px] text-[#1D1D1F] focus:outline-none focus:bg-white focus:border-[#0066CC] transition-all appearance-none"
                                    value={newItem.category}
                                    onChange={e => setNewItem({ ...newItem, category: e.target.value })}
                                >
                                    <option value="">Select Category...</option>
                                    <option value="Home Maintenance">Home Maintenance</option>
                                    <option value="Personal Care">Personal Care</option>
                                    <option value="Education">Education</option>
                                    <option value="Tech Support">Tech Support</option>
                                    <option value="Automotive">Automotive</option>
                                    <option value="Other">Other</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-[14px] font-medium text-[#1D1D1F] mb-1.5 ml-1">Icon (Emoji)</label>
                                <input
                                    type="text"
                                    required
                                    className="w-full bg-[#F5F5F7] border-2 border-transparent rounded-[14px] px-4 py-3 text-[15px] text-[#1D1D1F] placeholder-[#86868B] focus:outline-none focus:bg-white focus:border-[#0066CC] transition-all"
                                    placeholder="e.g. 🔧"
                                    value={newItem.icon}
                                    onChange={e => setNewItem({ ...newItem, icon: e.target.value })}
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={submitting}
                                className="w-full bg-[#1D1D1F] hover:bg-[#333336] text-white font-medium text-[15px] py-4 rounded-[14px] transition-all active:scale-[0.98] mt-4 disabled:opacity-50"
                            >
                                {submitting ? 'Creating...' : 'Create Service'}
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
