import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Image as ImageIcon, Plus, MessageSquare, LogOut, Loader2, Menu, X } from 'lucide-react';
import { createSession, getUserSessions, getSessionMessages, sendMessage } from '../services/chatService';
import { logout } from '../services/authService';
import ModelDropdown from '../components/ModelDropdown';

const Chat = () => {
    const [sessions, setSessions] = useState([]);
    const [currentSessionId, setCurrentSessionId] = useState(null);
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
    const [image, setImage] = useState(null);
    const [loading, setLoading] = useState(false);
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [selectedModel, setSelectedModel] = useState('gemini-2.0-flash');
    const [cursorPos, setCursorPos] = useState({ x: 0, y: 0 });
    const messagesEndRef = useRef(null);
    const fileInputRef = useRef(null);
    const navigate = useNavigate();
    const userId = localStorage.getItem('userId');
    const userName = localStorage.getItem('userName') || 'User';

    useEffect(() => {
        loadSessions();
    }, []);

    useEffect(() => {
        if (currentSessionId) {
            loadMessages(currentSessionId);
        }
    }, [currentSessionId]);

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    // Track cursor position for interactive background
    useEffect(() => {
        const handleMouseMove = (e) => {
            setCursorPos({ x: e.clientX, y: e.clientY });
        };
        window.addEventListener('mousemove', handleMouseMove);
        return () => window.removeEventListener('mousemove', handleMouseMove);
    }, []);

    const loadSessions = async () => {
        try {
            const data = await getUserSessions(userId);
            setSessions(data);
            if (data.length > 0 && !currentSessionId) {
                setCurrentSessionId(data[0].sessionId);
            }
        } catch (error) {
            console.error("Failed to load sessions", error);
        }
    };

    const loadMessages = async (sessionId) => {
        try {
            const data = await getSessionMessages(sessionId);
            setMessages(data);
        } catch (error) {
            console.error("Failed to load messages", error);
        }
    };

    const handleNewChat = async () => {
        try {
            const newSession = await createSession(userId);
            setSessions([newSession, ...sessions]);
            setCurrentSessionId(newSession.sessionId);
            setMessages([]);
        } catch (error) {
            console.error("Failed to create session", error);
        }
    };

    const handleSend = async (e) => {
        e.preventDefault();
        if ((!input.trim() && !image) || loading) return;

        const tempMessage = {
            id: Date.now(),
            sender: 'USER',
            messageText: input,
            imagePath: image ? URL.createObjectURL(image) : null,
            timestamp: new Date().toISOString()
        };

        setMessages(prev => [...prev, tempMessage]);
        setInput('');
        setImage(null);
        setLoading(true);

        try {
            let sessionId = currentSessionId;
            if (!sessionId) {
                const newSession = await createSession(userId);
                sessionId = newSession.sessionId;
                setCurrentSessionId(sessionId);
                setSessions([newSession, ...sessions]);
            }

            const response = await sendMessage(sessionId, selectedModel, tempMessage.messageText, image);
            setMessages(prev => [...prev, response]);

            if (messages.length === 0) {
                loadSessions();
            }
        } catch (error) {
            console.error("Failed to send message", error);
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    const hasMessages = messages.length > 0;

    // Get model display name
    const getModelDisplayName = (modelId) => {
        const modelNames = {
            'gemini-2.0-flash': 'Gemini 2.0 Flash ⚡',
            'gemini-vision': 'Gemini Vision 🖼️',
            'google/gemma-3-4b-it:free': 'Gemma 3 4B Free 🔥',
            'grok-2-latest': 'Grok 2 Latest 💎',
            'gemma-local': 'Gemma AI - local 🏠'
        };
        return modelNames[modelId] || modelId;
    };

    return (
        <div className="flex h-screen bg-gemini-black dark:bg-gemini-black overflow-hidden relative">
            {/* Interactive Background with Vibrant Blobs */}
            <div
                className="absolute inset-0 pointer-events-none overflow-hidden"
                style={{
                    background: `radial-gradient(600px circle at ${cursorPos.x}px ${cursorPos.y}px, rgba(181, 55, 255, 0.2), transparent 40%)`
                }}
            />
            <div className="absolute top-20 left-20 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl animate-blob" />
            <div className="absolute bottom-20 right-20 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-blob animation-delay-2000" />
            <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-pink-500/15 rounded-full blur-3xl animate-blob-reverse animation-delay-4000" />
            <div className="absolute bottom-40 left-40 w-80 h-80 bg-cyan-500/15 rounded-full blur-3xl animate-blob animation-delay-2000" />

            {/* Mobile Sidebar Toggle */}
            <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="md:hidden fixed top-4 left-4 z-50 p-2 glass-panel text-gemini-text hover:bg-white/10 transition-all"
            >
                {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
            </button>

            {/* Sidebar */}
            <AnimatePresence>
                {sidebarOpen && (
                    <motion.div
                        initial={{ x: -300, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        exit={{ x: -300, opacity: 0 }}
                        className="w-72 glass-panel border-r border-white/5 flex flex-col fixed md:relative z-40 h-full"
                    >
                        <div className="p-4 space-y-3">
                            <button
                                onClick={handleNewChat}
                                className="w-full flex items-center gap-3 px-4 py-3 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 hover:opacity-90 text-white rounded-xl transition-all shadow-lg shadow-purple-500/30 font-medium btn-glow"
                            >
                                <Plus size={20} />
                                <span>New Chat</span>
                            </button>
                        </div>

                        <ModelDropdown selectedModel={selectedModel} onSelectModel={setSelectedModel} />


                        <div className="flex-1 overflow-y-auto px-3 space-y-2 custom-scrollbar">
                            {sessions.map(session => (
                                <button
                                    key={session.sessionId}
                                    onClick={() => setCurrentSessionId(session.sessionId)}
                                    className={`w-full text-left px-4 py-3 rounded-xl flex items-center gap-3 transition-all ${currentSessionId === session.sessionId
                                        ? 'bg-gemini-violet/20 text-white border border-gemini-violet/30'
                                        : 'text-gemini-text/70 hover:bg-white/5 hover:text-gemini-text'
                                        }`}
                                >
                                    <MessageSquare size={18} />
                                    <span className="truncate text-sm font-medium">{session.title || 'New Chat'}</span>
                                </button>
                            ))}
                        </div>

                        <div className="p-4 border-t border-white/5">
                            <button
                                onClick={handleLogout}
                                className="w-full flex items-center gap-3 px-4 py-3 text-gemini-text/70 hover:text-white hover:bg-white/5 rounded-xl transition-all"
                            >
                                <LogOut size={18} />
                                <span className="text-sm font-medium">Log out</span>
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Main Chat Area */}
            <div className={`flex-1 flex flex-col h-full relative z-10 ${hasMessages ? '' : 'justify-center'}`}>
                {/* Model Header - Show when messages exist */}
                {hasMessages && (
                    <div className="glass-panel/50 backdrop-blur-xl border-b border-white/5 px-6 py-3">
                        <div className="max-w-4xl mx-auto flex items-center gap-2">
                            <span className="text-sm text-gemini-text/60">AI Model:</span>
                            <span className="text-sm font-semibold gradient-text">
                                {getModelDisplayName(selectedModel)}
                            </span>
                        </div>
                    </div>
                )}

                {!hasMessages ? (
                    /* Centered Empty State with Input */
                    <div className="flex flex-col items-center justify-center px-4 max-w-3xl mx-auto w-full space-y-8">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-center space-y-4"
                        >
                            <div className="w-20 h-20 bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 rounded-3xl flex items-center justify-center mb-6 mx-auto shadow-2xl shadow-purple-500/40">
                                <MessageSquare size={40} className="text-white" />
                            </div>
                            <h1 className="text-6xl font-bold mb-2 animated-gradient bg-clip-text text-transparent">
                                Raze AI
                            </h1>
                            <h2 className="text-3xl font-semibold text-white mb-2">
                                Hi {userName}! 👋
                            </h2>
                            <p className="text-xl text-gemini-text/70 font-light">
                                Welcome to Raze AI. How can I help you today?
                            </p>
                        </motion.div>

                        {/* Centered Input */}
                        <motion.form
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                            onSubmit={handleSend}
                            className="w-full max-w-2xl relative"
                        >
                            {image && (
                                <div className="absolute bottom-full mb-3 left-0 glass-panel p-3 rounded-xl border border-white/10 flex items-center gap-3">
                                    <span className="text-sm text-gemini-text truncate max-w-[200px]">{image.name}</span>
                                    <button
                                        type="button"
                                        onClick={() => setImage(null)}
                                        className="text-gemini-text/70 hover:text-white transition-colors"
                                    >
                                        <X size={16} />
                                    </button>
                                </div>
                            )}

                            <div className="glass-panel border border-white/10 rounded-2xl p-3 focus-within:ring-2 focus-within:ring-gemini-violet/50 transition-all shadow-2xl backdrop-blur-xl">
                                <div className="flex items-center gap-3">
                                    <button
                                        type="button"
                                        onClick={() => fileInputRef.current?.click()}
                                        className="p-3 text-gemini-text/70 hover:text-white hover:bg-white/10 rounded-xl transition-all"
                                    >
                                        <ImageIcon size={22} />
                                    </button>
                                    <input
                                        type="file"
                                        ref={fileInputRef}
                                        className="hidden"
                                        accept="image/*"
                                        onChange={(e) => setImage(e.target.files[0])}
                                    />

                                    <input
                                        type="text"
                                        value={input}
                                        onChange={(e) => setInput(e.target.value)}
                                        placeholder="Ask me anything..."
                                        className="flex-1 bg-transparent text-white text-lg placeholder-gemini-text/50 outline-none px-2 font-light"
                                    />

                                    <button
                                        type="submit"
                                        disabled={(!input.trim() && !image) || loading}
                                        className="p-3 bg-gradient-to-r from-gemini-violet to-gemini-violet-light text-white rounded-xl disabled:opacity-50 disabled:cursor-not-allowed hover:opacity-90 transition-all shadow-lg shadow-gemini-violet/30"
                                    >
                                        {loading ? <Loader2 size={22} className="animate-spin" /> : <Send size={22} />}
                                    </button>
                                </div>
                            </div>
                        </motion.form>
                    </div>
                ) : (
                    /* Messages View with Bottom Input */
                    <>
                        <div className="flex-1 overflow-y-auto p-4 md:p-8 space-y-6 custom-scrollbar">
                            {messages.map((msg, idx) => (
                                <motion.div
                                    key={idx}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className={`flex ${msg.sender === 'USER' ? 'justify-end' : 'justify-start'}`}
                                >
                                    <div className={`max-w-[85%] md:max-w-[75%] rounded-2xl p-5 ${msg.sender === 'USER'
                                        ? 'bg-gradient-to-r from-gemini-violet to-gemini-violet-light text-white rounded-br-md shadow-lg shadow-gemini-violet/20'
                                        : 'glass-panel text-gemini-text rounded-bl-md border border-white/10'
                                        }`}>
                                        {msg.imagePath && (
                                            <img
                                                src={msg.sender === 'USER' && msg.imagePath.startsWith('blob')
                                                    ? msg.imagePath
                                                    : `http://localhost:8080/uploads/${msg.imagePath}`}
                                                alt="Uploaded"
                                                className="max-w-full rounded-xl mb-3 shadow-lg"
                                            />
                                        )}
                                        <p className="whitespace-pre-wrap leading-relaxed text-base">{msg.messageText}</p>
                                    </div>
                                </motion.div>
                            ))}
                            {loading && (
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className="flex justify-start"
                                >
                                    <div className="glass-panel rounded-2xl rounded-bl-md p-5 flex items-center gap-2 border border-white/10">
                                        <div className="w-2.5 h-2.5 bg-gemini-violet rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                                        <div className="w-2.5 h-2.5 bg-gemini-violet-light rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                                        <div className="w-2.5 h-2.5 bg-gemini-violet rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                                    </div>
                                </motion.div>
                            )}
                            <div ref={messagesEndRef} />
                        </div>

                        {/* Bottom Input */}
                        <div className="p-4 md:p-6 glass-panel/50 backdrop-blur-xl border-t border-white/5">
                            <form onSubmit={handleSend} className="max-w-4xl mx-auto relative">
                                {image && (
                                    <div className="absolute bottom-full mb-3 left-0 glass-panel p-3 rounded-xl border border-white/10 flex items-center gap-3">
                                        <span className="text-sm text-gemini-text truncate max-w-[200px]">{image.name}</span>
                                        <button
                                            type="button"
                                            onClick={() => setImage(null)}
                                            className="text-gemini-text/70 hover:text-white transition-colors"
                                        >
                                            <X size={16} />
                                        </button>
                                    </div>
                                )}

                                <div className="glass-panel border border-white/10 rounded-2xl p-3 focus-within:ring-2 focus-within:ring-gemini-violet/50 transition-all shadow-xl">
                                    <div className="flex items-center gap-3">
                                        <button
                                            type="button"
                                            onClick={() => fileInputRef.current?.click()}
                                            className="p-2.5 text-gemini-text/70 hover:text-white hover:bg-white/10 rounded-xl transition-all"
                                        >
                                            <ImageIcon size={20} />
                                        </button>
                                        <input
                                            type="file"
                                            ref={fileInputRef}
                                            className="hidden"
                                            accept="image/*"
                                            onChange={(e) => setImage(e.target.files[0])}
                                        />

                                        <input
                                            type="text"
                                            value={input}
                                            onChange={(e) => setInput(e.target.value)}
                                            placeholder="Send a message..."
                                            className="flex-1 bg-transparent text-white text-base placeholder-gemini-text/50 outline-none px-2"
                                        />

                                        <button
                                            type="submit"
                                            disabled={(!input.trim() && !image) || loading}
                                            className="p-2.5 bg-gradient-to-r from-gemini-violet to-gemini-violet-light text-white rounded-xl disabled:opacity-50 disabled:cursor-not-allowed hover:opacity-90 transition-all shadow-lg shadow-gemini-violet/20"
                                        >
                                            {loading ? <Loader2 size={20} className="animate-spin" /> : <Send size={20} />}
                                        </button>
                                    </div>
                                </div>
                                <div className="text-center mt-3">
                                    <p className="text-xs text-gemini-text/40">AI can make mistakes. Consider checking important information.</p>
                                </div>
                            </form>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default Chat;
