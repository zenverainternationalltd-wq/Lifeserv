'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const res = await fetch('http://localhost:5000/api/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }),
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.message || 'Login failed');
            }

            if (data.role !== 'admin') {
                throw new Error('Access denied. Admin only.');
            }

            // Store token
            localStorage.setItem('adminToken', data.token);
            localStorage.setItem('adminUser', JSON.stringify(data));

            // Redirect to dashboard
            router.push('/');
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-[#F5F5F7]">
            <div className="bg-white p-10 rounded-[28px] shadow-[0_8px_40px_rgba(0,0,0,0.04)] w-full max-w-[440px] border border-gray-100/50">
                <div className="text-center mb-10">
                    <h1 className="text-[32px] font-semibold tracking-tight text-[#1D1D1F] mb-2">
                        ServeConnect
                    </h1>
                    <p className="text-[#86868B] text-[15px] font-medium">Admin Portal</p>
                </div>

                {error && (
                    <div className="bg-[#FFF2F2] border border-[#FFD1D1] text-[#E03A3A] p-4 rounded-2xl mb-6 text-[14px] font-medium text-center">
                        {error}
                    </div>
                )}

                <form onSubmit={handleLogin} className="space-y-5">
                    <div>
                        <input
                            type="email"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full bg-[#F5F5F7] border-2 border-transparent rounded-[14px] px-5 py-4 text-[15px] text-[#1D1D1F] placeholder-[#86868B] focus:outline-none focus:bg-white focus:border-[#0066CC] focus:ring-4 focus:ring-[#0066CC]/10 transition-all duration-300"
                            placeholder="Email address"
                        />
                    </div>

                    <div>
                        <input
                            type="password"
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full bg-[#F5F5F7] border-2 border-transparent rounded-[14px] px-5 py-4 text-[15px] text-[#1D1D1F] placeholder-[#86868B] focus:outline-none focus:bg-white focus:border-[#0066CC] focus:ring-4 focus:ring-[#0066CC]/10 transition-all duration-300"
                            placeholder="Password"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-[#1D1D1F] hover:bg-[#333336] text-white font-medium text-[15px] py-4 rounded-[14px] transition-all duration-300 transform active:scale-[0.98] mt-4 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {loading ? 'Signing in...' : 'Sign In'}
                    </button>
                    
                    <div className="mt-8 text-center text-[#86868B] text-[13px]">
                        Secure access for administrators only
                    </div>
                </form>
            </div>
        </div>
    );
}
