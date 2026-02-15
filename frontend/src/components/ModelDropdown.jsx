import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Zap, Image as ImageIcon, Flame, Gem, Cpu, Home } from 'lucide-react';

// Define model options
const models = [
    {
        id: 'gemma',
        name: 'Gemma 3 4B (Free)',
        icon: Flame,
        gradient: 'from-orange-500 to-red-500',
        glow: 'rgba(255, 0, 110, 0.4)',
    },
    {
        id: 'nova',
        name: 'Amazon Nova',
        icon: Cpu,
        gradient: 'from-green-500 to-emerald-500',
        glow: 'rgba(0, 212, 255, 0.4)',
    },
    {
        id: 'mistral',
        name: 'Mistral Small 3.1 (24B)',
        icon: Zap,
        gradient: 'from-blue-500 to-cyan-500',
        glow: 'rgba(0, 212, 255, 0.4)',
    },
    {
        id: 'nemotron',
        name: 'Nemotron Nano 12B v2',
        icon: ImageIcon,
        gradient: 'from-purple-500 to-pink-500',
        glow: 'rgba(181, 55, 255, 0.4)',
    },
    {
        id: 'gpt-oss',
        name: 'GPT‑OSS 20B',
        icon: Zap,
        gradient: 'from-gray-500 to-gray-700',
        glow: 'rgba(200,200,200,0.4)',
    },
    {
        id: 'llama',
        name: 'Llama 3.3 70B',
        icon: Flame,
        gradient: 'from-indigo-500 to-violet-500',
        glow: 'rgba(150, 0, 255, 0.4)',
    },
    {
        id: 'gemma-local',
        name: 'Gemma AI - local',
        icon: Home,
        gradient: 'from-amber-500 to-orange-500',
        glow: 'rgba(255, 165, 0, 0.4)',
    },
];

/**
 * ModelDropdown – a glass‑style dropdown placed below the chat input.
 * Props:
 *   selectedModel – currently selected model id
 *   onSelectModel – callback to change the selected model
 */
const ModelDropdown = ({ selectedModel, onSelectModel }) => {
    const [open, setOpen] = useState(false);

    const handleSelect = (id) => {
        onSelectModel(id);
        setOpen(false);
    };

    const Selected = models.find((m) => m.id === selectedModel) || models[0];
    const Icon = Selected.icon;

    return (
        <div className="relative mt-3">
            {/* Trigger button */}
            <button
                type="button"
                onClick={() => setOpen((prev) => !prev)}
                className="w-full flex items-center justify-between px-4 py-2 glass-panel border border-white/10 rounded-xl hover:bg-white/10 transition-colors"
            >
                <div className="flex items-center gap-2">
                    <Icon size={18} className="text-white" />
                    <span className="text-sm text-white">{Selected.name}</span>
                </div>
                <svg
                    className={`w-4 h-4 transform transition-transform ${open ? 'rotate-180' : ''}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
            </button>

            {/* Dropdown list */}
            <AnimatePresence>
                {open && (
                    <motion.ul
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="absolute left-0 right-0 mt-2 bg-black/70 backdrop-blur-xl border border-white/10 rounded-xl shadow-xl z-10"
                    >
                        {models.map((model) => {
                            const ModelIcon = model.icon;
                            const isActive = selectedModel === model.id;
                            return (
                                <li
                                    key={model.id}
                                    onClick={() => handleSelect(model.id)}
                                    className={`flex items-center gap-3 px-4 py-2 cursor-pointer transition-colors ${isActive ? 'bg-white/10' : ''}`}
                                >
                                    <div
                                        className={`p-2 rounded-lg bg-gradient-to-br ${model.gradient}`}
                                        style={isActive ? { boxShadow: `0 0 20px ${model.glow}` } : {}}
                                    >
                                        <ModelIcon size={16} className="text-white" />
                                    </div>
                                    <span className={`text-sm ${isActive ? 'text-white' : 'text-gemini-text'}`}>{model.name}</span>
                                </li>
                            );
                        })}
                    </motion.ul>
                )}
            </AnimatePresence>
        </div>
    );
};

export default ModelDropdown;
