import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { login } from '../services/authService';
import { Lock, Mail, Loader2, Sun, Moon } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const { theme, toggleTheme } = useTheme();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            await login(email, password);
            navigate('/chat');
        } catch (err) {
            setError('Invalid credentials');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gemini-black dark:bg-gemini-black relative overflow-hidden">
            {/* Interactive Background */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-20 left-20 w-96 h-96 bg-gemini-violet/10 rounded-full blur-3xl animate-blob"></div>
                <div className="absolute bottom-20 right-20 w-96 h-96 bg-gemini-violet-light/10 rounded-full blur-3xl animate-blob animation-delay-2000"></div>
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gemini-violet/5 rounded-full blur-3xl"></div>
            </div>

            {/* Theme Toggle */}
            <button
                onClick={toggleTheme}
                className="fixed top-6 right-6 z-50 p-3 glass-panel hover:bg-white/10 text-gemini-text rounded-xl transition-all shadow-lg"
            >
                {theme === 'dark' ? <Sun size={22} /> : <Moon size={22} />}
            </button>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="glass-panel p-10 w-full max-w-md z-10 border border-white/10 shadow-2xl"
            >
                <div className="text-center mb-8">
                    <div className="w-16 h-16 bg-gradient-to-br from-gemini-violet to-gemini-violet-light rounded-2xl flex items-center justify-center mb-4 mx-auto shadow-lg shadow-gemini-violet/30">
                        <Lock size={32} className="text-white" />
                    </div>
                    <h2 className="text-4xl font-bold bg-gradient-to-r from-white to-gemini-text bg-clip-text text-transparent">
                        Welcome Back
                    </h2>
                    <p className="text-gemini-text/60 mt-2">Sign in to continue to your account</p>
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
                        <label className="block text-sm font-medium text-gemini-text/80 mb-2">Email</label>
                        <div className="relative">
                            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gemini-text/50 w-5 h-5" />
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full glass-input bg-white/5 border border-white/10 rounded-xl py-3 pl-11 pr-4 text-white placeholder-gemini-text/40 outline-none transition-all text-base"
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
                                className="w-full glass-input bg-white/5 border border-white/10 rounded-xl py-3 pl-11 pr-4 text-white placeholder-gemini-text/40 outline-none transition-all text-base"
                                placeholder="••••••••"
                                required
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-gradient-to-r from-gemini-violet to-gemini-violet-light hover:opacity-90 text-white font-medium py-3 rounded-xl transition-all transform hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center shadow-lg shadow-gemini-violet/30 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Sign In'}
                    </button>
                </form>

                <p className="mt-6 text-center text-gemini-text/60 text-sm">
                    Don't have an account?{' '}
                    <Link to="/register" className="text-gemini-violet-light hover:text-gemini-violet font-medium transition-colors">
                        Sign up
                    </Link>
                </p>
            </motion.div>
        </div>
    );
};

export default Login;
