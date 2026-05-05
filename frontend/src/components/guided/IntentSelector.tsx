import React from 'react';
import { motion } from 'framer-motion';
import { INTENT_OPTIONS } from '../../config/workflow';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

interface IntentSelectorProps {
    onSelect: (intent: string) => void;
    selectedIntent: string;
}

export const IntentSelector: React.FC<IntentSelectorProps> = ({ onSelect, selectedIntent }) => {
    return (
        <motion.div 
            initial={{ opacity: 0, y: 10 }} 
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
        >
            <div className="text-center">
                <h2 className="text-2xl font-bold text-[#b86b3e]">Choose your goal</h2>
                <p className="text-[#4a6b8c]/70">What is the primary purpose of this post?</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {INTENT_OPTIONS.map((option) => {
                    const isSelected = selectedIntent === option.label;
                    const Icon = option.icon;
                    
                    return (
                        <button
                            key={option.id}
                            onClick={() => onSelect(option.label)}
                            className={cn(
                                "flex flex-col items-start p-5 bg-white/5 border rounded-xl transition-all text-left group",
                                "hover:border-[#b86b3e]/50 hover:bg-[#b86b3e]/5 hover:shadow-lg hover:shadow-[#b86b3e]/5",
                                isSelected 
                                    ? "border-[#b86b3e] bg-[#b86b3e]/10 ring-1 ring-[#b86b3e]/20" 
                                    : "border-[#4a6b8c]/20"
                            )}
                        >
                            <div className={cn(
                                "p-2 rounded-lg mb-4 transition-colors",
                                isSelected ? "bg-[#b86b3e] text-white" : "bg-[#4a6b8c]/10 text-[#b86b3e]"
                            )}>
                                <Icon size={24} />
                            </div>
                            
                            <h3 className={cn(
                                "font-bold text-lg transition-colors",
                                isSelected ? "text-[#b86b3e]" : "text-[#1a1a1a]"
                            )}>
                                {option.label}
                            </h3>
                            
                            <p className="text-sm text-[#4a6b8c]/80 mt-2 leading-relaxed">
                                {option.description}
                            </p>
                        </button>
                    );
                })}
            </div>
        </motion.div>
    );
};
