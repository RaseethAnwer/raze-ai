import React from 'react';
import { motion } from 'framer-motion';
import { Zap, Image as ImageIcon, Flame, Gem } from 'lucide-react';

const models = [
    {
        id: 'gemini-2.0-flash',
        name: 'Gemini Flash',
        icon: Zap,
        description: 'Lightning fast responses',
        badge: 'Fast',
        gradient: 'from-blue-500 to-cyan-500',
        glowColor: 'rgba(0, 212, 255, 0.4)',
    },
    {
        id: 'gemini-vision',
        name: 'Gemini Vision',
        icon: ImageIcon,
        description: 'Image understanding',
        badge: 'Vision',
        gradient: 'from-purple-500 to-pink-500',
        glowColor: 'rgba(181, 55, 255, 0.4)',
    },
    {
        id: 'google/gemma-3-4b-it:free',
        name: 'Gemma 3 4B',
        icon: Flame,
        description: 'Free & powerful',
        badge: 'Free',
        gradient: 'from-orange-500 to-red-500',
        glowColor: 'rgba(255, 0, 110, 0.4)',
    },
    {
        id: 'grok-2-latest',
        name: 'Grok 2',
        icon: Gem,
        description: 'Advanced reasoning',
        badge: 'Premium',
        gradient: 'from-violet-500 to-fuchsia-500',
        glowColor: 'rgba(217, 70, 239, 0.4)',
    },
];

const ModelSelector = ({ selectedModel, onSelectModel }) => {
    return (
        <div className="px-3 py-4 space-y-2">
            <h3 className="text-xs font-semibold text-gemini-text/60 uppercase tracking-wider px-2 mb-3">
                AI Model
            </h3>
            {models.map((model, index) => {
                const Icon = model.icon;
                const isActive = selectedModel === model.id;

                return (
                    <motion.button
                        key={model.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.05 }}
                        onClick={() => onSelectModel(model.id)}
                        className={`
                            w-full text-left p-3 rounded-xl transition-all duration-300
                            model-card
                            ${isActive
                                ? 'model-card-active'
                                : 'glass-panel hover:bg-white/10 border border-white/5'
                            }
                        `}
                        style={isActive ? {
                            boxShadow: `0 0 30px ${model.glowColor}, 0 10px 40px ${model.glowColor}`
                        } : {}}
                    >
                        <div className="flex items-start gap-3">
                            <div className={`
                                p-2 rounded-lg bg-gradient-to-br ${model.gradient}
                                flex items-center justify-center
                                ${isActive ? 'shadow-lg' : ''}
                            `}>
                                <Icon size={18} className="text-white" />
                            </div>

                            <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 mb-1">
                                    <span className={`
                                        font-semibold text-sm
                                        ${isActive ? 'text-white' : 'text-gemini-text'}
                                    `}>
                                        {model.name}
                                    </span>
                                    <span className={`
                                        text-xs px-2 py-0.5 rounded-full
                                        bg-gradient-to-r ${model.gradient}
                                        text-white font-medium
                                    `}>
                                        {model.badge}
                                    </span>
                                </div>
                                <p className={`
                                    text-xs
                                    ${isActive ? 'text-white/80' : 'text-gemini-text/60'}
                                `}>
                                    {model.description}
                                </p>
                            </div>
                        </div>

                        {isActive && (
                            <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                className="absolute top-2 right-2"
                            >
                                <div className="w-2 h-2 rounded-full bg-gradient-to-r from-green-400 to-emerald-500 shadow-lg shadow-green-500/50" />
                            </motion.div>
                        )}
                    </motion.button>
                );
            })}
        </div>
    );
};

export default ModelSelector;
