import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { register } from '../services/authService';
import { Sparkles, User, Mail, Lock, Loader2 } from 'lucide-react';

const Register = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [cursorPos, setCursorPos] = useState({ x: 0, y: 0 });
    const navigate = useNavigate();

    // Track cursor for interactive background
    useEffect(() => {
        const handleMouseMove = (e) => {
            setCursorPos({ x: e.clientX, y: e.clientY });
        };
        window.addEventListener('mousemove', handleMouseMove);
        return () => window.removeEventListener('mousemove', handleMouseMove);
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            await register(name, email, password);
            navigate('/chat');
        } catch (err) {
            setError('Registration failed. Try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gemini-black relative overflow-hidden">
            {/* Playful Animated Background with Mouse Tracking */}
            <div
                className="absolute inset-0 pointer-events-none overflow-hidden"
                style={{
                    background: `radial-gradient(600px circle at ${cursorPos.x}px ${cursorPos.y}px, rgba(181, 55, 255, 0.15), transparent 40%)`
                }}
            />
            <div className="absolute bottom-20 right-20 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl animate-blob" />
            <div className="absolute top-20 left-20 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-blob animation-delay-2000" />
            <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-pink-500/15 rounded-full blur-3xl animate-blob-reverse animation-delay-4000" />
            <div className="absolute bottom-40 left-40 w-80 h-80 bg-cyan-500/15 rounded-full blur-3xl animate-blob animation-delay-2000" />

            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="glass-panel p-10 w-full max-w-md z-10 border border-white/10 shadow-2xl"
            >
                <div className="text-center mb-8">
                    {/* Raze AI Logo */}
                    <div className="w-20 h-20 bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 rounded-3xl flex items-center justify-center mb-4 mx-auto shadow-2xl shadow-purple-500/40 animate-pulse">
                        <Sparkles size={40} className="text-white" />
                    </div>
                    <h1 className="text-5xl font-bold mb-2 animated-gradient bg-clip-text text-transparent">
                        Raze AI
                    </h1>
                    <h2 className="text-2xl font-semibold text-white mb-2">
                        Create Account
                    </h2>
                    <p className="text-gemini-text/60">Join us and start your AI journey</p>
                </div>

                {error && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-red-500/10 border border-red-500/30 text-red-400 p-3 rounded-xl mb-6 text-sm text-center backdrop-blur-sm"
                    >
                        {error}
                    </motion.div>
                )}

                <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                        <label className="block text-sm font-medium text-gemini-text/80 mb-2">Full Name</label>
                        <div className="relative">
                            <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gemini-text/50 w-5 h-5" />
                            <input
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="w-full glass-input bg-white/5 border border-white/10 rounded-xl py-3 pl-11 pr-4 text-white placeholder-gemini-text/40 outline-none focus:border-purple-500/50 focus:ring-2 focus:ring-purple-500/20 transition-all text-base"
                                placeholder="John Doe"
                                required
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gemini-text/80 mb-2">Email</label>
                        <div className="relative">
                            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gemini-text/50 w-5 h-5" />
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full glass-input bg-white/5 border border-white/10 rounded-xl py-3 pl-11 pr-4 text-white placeholder-gemini-text/40 outline-none focus:border-purple-500/50 focus:ring-2 focus:ring-purple-500/20 transition-all text-base"
                                placeholder="name@example.com"
                                required
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gemini-text/80 mb-2">Password</label>
                        <div className="relative">
                            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gemini-text/50 w-5 h-5" />
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full glass-input bg-white/5 border border-white/10 rounded-xl py-3 pl-11 pr-4 text-white placeholder-gemini-text/40 outline-none focus:border-purple-500/50 focus:ring-2 focus:ring-purple-500/20 transition-all text-base"
                                placeholder="••••••••"
                                required
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 hover:opacity-90 text-white font-medium py-3 rounded-xl transition-all transform hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center shadow-lg shadow-purple-500/40 disabled:opacity-50 disabled:cursor-not-allowed btn-glow"
                    >
                        {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Create Account'}
                    </button>
                </form>

                <p className="mt-6 text-center text-gemini-text/60 text-sm">
                    Already have an account?{' '}
                    <Link to="/login" className="gradient-text font-medium hover:opacity-80 transition-opacity">
                        Sign in
                    </Link>
                </p>
            </motion.div>
        </div>
    );
};

export default Register;
