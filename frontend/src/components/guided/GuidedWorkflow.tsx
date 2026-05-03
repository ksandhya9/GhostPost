import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    ChevronLeft,
    ArrowRight,
    Sparkles,
    MessageSquare,
    BookOpen,
    Zap,
    Award,
    Megaphone,
    Copy,
    RefreshCw,
    Check
} from 'lucide-react';
import axios from 'axios';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

const STEPS = [
    'Goal',
    'Idea',
    'Hook',
    'Draft',
    'Variants',
    'Publish'
];

const INTENTS = [
    { id: 'insight', label: 'Share a lesson', icon: BookOpen, description: 'Turn an experience into a teaching moment' },
    { id: 'story', label: 'Tell a personal story', icon: MessageSquare, description: 'Connect with your audience through vulnerability' },
    { id: 'authority', label: 'Build authority', icon: Award, description: 'Showcase your expertise and deep knowledge' },
    { id: 'promote', label: 'Promote something', icon: Megaphone, description: 'A product, event, or newsletter launch' },
    { id: 'discussion', label: 'Start a discussion', icon: Zap, description: 'Ask a hard question or share a hot take' },
    { id: 'announce', label: 'Announce something', icon: Sparkles, description: 'Hiring, new role, or milestone' },
];

export default function GuidedWorkflow() {
    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);
    const [copied, setCopied] = useState(false);

    // State for workflow data
    const [intent, setIntent] = useState('');
    const [messyIdea, setMessyIdea] = useState('');
    const [structureData, setStructureData] = useState<any>(null);
    const [selectedHook, setSelectedHook] = useState('');
    const [refinedPost, setRefinedPost] = useState('');
    const [variations, setVariations] = useState<any>(null);

    // Persist to local storage
    useEffect(() => {
        const saved = localStorage.getItem('ghostpost_guided_state');
        if (saved) {
            const parsed = JSON.parse(saved);
            setIntent(parsed.intent || '');
            setMessyIdea(parsed.messyIdea || '');
            setStep(parsed.step || 1);
        }
    }, []);

    useEffect(() => {
        localStorage.setItem('ghostpost_guided_state', JSON.stringify({ intent, messyIdea, step }));
    }, [intent, messyIdea, step]);

    const nextStep = () => setStep(prev => Math.min(prev + 1, 6));
    const prevStep = () => setStep(prev => Math.max(prev - 1, 1));

    const handleGenerateStructure = async () => {
        setLoading(true);
        try {
            const res = await axios.post('/api/enhance/guided/structure', { intent, messyIdea });
            setStructureData(res.data);
            nextStep();
        } catch (err) {
            alert('Failed to generate hooks. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleGeneratePost = async (hook: string) => {
        setSelectedHook(hook);
        setLoading(true);
        try {
            const res = await axios.post('/api/enhance/guided/post', {
                intent,
                messyIdea,
                selectedHook: hook,
                selectedStructure: structureData.structure
            });
            setRefinedPost(res.data.refinedPost);
            nextStep();
        } catch (err) {
            alert('Failed to generate post. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleGenerateVariations = async () => {
        setLoading(true);
        try {
            const res = await axios.post('/api/enhance/guided/variations', { originalPost: refinedPost });
            setVariations(res.data);
            nextStep();
        } catch (err) {
            alert('Failed to generate variations.');
        } finally {
            setLoading(false);
        }
    };

    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const renderStep = () => {
        switch (step) {
            case 1:
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
                            {INTENTS.map((i) => (
                                <button
                                    key={i.id}
                                    onClick={() => { setIntent(i.label); nextStep(); }}
                                    className={cn(
                                        "flex flex-col items-start p-4 bg-white/5 border rounded-lg transition-all text-left group hover:border-[#b86b3e]/50 hover:bg-[#b86b3e]/5",
                                        intent === i.label ? "border-[#b86b3e] bg-[#b86b3e]/10" : "border-[#4a6b8c]/20"
                                    )}
                                >
                                    <i.icon size={24} className="mb-3 text-[#b86b3e]" />
                                    <h3 className="font-semibold text-[#1a1a1a]">{i.label}</h3>
                                    <p className="text-xs text-[#4a6b8c] mt-1">{i.description}</p>
                                </button>
                            ))}
                        </div>
                    </motion.div>
                );
            case 2:
                return (
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="space-y-6"
                    >
                        <div className="text-center">
                            <h2 className="text-2xl font-bold text-[#b86b3e]">Dump the messy idea</h2>
                            <p className="text-[#4a6b8c]/70">Don't worry about quality yet. Just get your thoughts out.</p>
                        </div>
                        <textarea
                            value={messyIdea}
                            onChange={(e) => setMessyIdea(e.target.value)}
                            placeholder="Dump your messy thoughts here. Half-baked is welcome..."
                            className="w-full h-64 p-4 bg-white/40 border border-[#4a6b8c]/20 rounded-lg focus:outline-none focus:border-[#b86b3e]/50 transition-all text-[#1a1a1a] resize-none"
                        />
                        <div className="flex justify-between items-center">
                            <button onClick={prevStep} className="flex items-center gap-2 text-[#4a6b8c] hover:text-[#b86b3e] transition-all">
                                <ChevronLeft size={18} /> Back
                            </button>
                            <button
                                onClick={handleGenerateStructure}
                                disabled={loading || messyIdea.length < 10}
                                className="flex items-center gap-2 px-6 py-2 bg-[#b86b3e] text-white rounded-full hover:bg-[#a05a30] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {loading ? <RefreshCw size={18} className="animate-spin" /> : <>Generate Hooks <ArrowRight size={18} /></>}
                            </button>
                        </div>
                    </motion.div>
                );
            case 3:
                return (
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="space-y-6"
                    >
                        <div className="text-center">
                            <h2 className="text-2xl font-bold text-[#b86b3e]">Pick your hook</h2>
                            <p className="text-[#4a6b8c]/70">Choose the opening that fits your vision best.</p>
                        </div>
                        <div className="space-y-4">
                            {structureData?.hooks.map((h: string, idx: number) => (
                                <button
                                    key={idx}
                                    onClick={() => handleGeneratePost(h)}
                                    className="w-full p-4 bg-white/60 border border-[#4a6b8c]/10 rounded-lg hover:border-[#b86b3e]/50 text-left transition-all group"
                                >
                                    <p className="text-[#1a1a1a] italic">"{h}"</p>
                                    <div className="mt-2 flex items-center gap-2 text-[10px] uppercase tracking-wider text-[#4a6b8c]/60">
                                        <Sparkles size={10} /> Option {idx + 1}
                                    </div>
                                </button>
                            ))}
                        </div>
                        <div className="flex justify-between items-center">
                            <button onClick={prevStep} className="flex items-center gap-2 text-[#4a6b8c] hover:text-[#b86b3e] transition-all">
                                <ChevronLeft size={18} /> Back
                            </button>
                            <button onClick={handleGenerateStructure} className="text-[var(--text-sm)] text-[#4a6b8c] hover:text-[#b86b3e]">
                                Regenerate Options
                            </button>
                        </div>
                    </motion.div>
                );
            case 4:
                return (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="space-y-6"
                    >
                        <div className="text-center">
                            <h2 className="text-2xl font-bold text-[#b86b3e]">Shape the post</h2>
                            <p className="text-[#4a6b8c]/70">Your refined LinkedIn draft is ready.</p>
                        </div>
                        <div className="relative group">
                            <textarea
                                value={refinedPost}
                                onChange={(e) => setRefinedPost(e.target.value)}
                                className="w-full h-[400px] p-6 bg-white border border-[#4a6b8c]/20 rounded-lg shadow-sm font-sans text-[#1a1a1a] leading-relaxed focus:outline-none"
                            />
                            <button
                                onClick={() => copyToClipboard(refinedPost)}
                                className="absolute top-4 right-4 p-2 bg-[#f0f2f5] hover:bg-[#e4e6e9] rounded-md transition-all text-[#4a6b8c]"
                                title="Copy to clipboard"
                            >
                                {copied ? <Check size={16} className="text-green-600" /> : <Copy size={16} />}
                            </button>
                        </div>
                        <div className="flex justify-between items-center">
                            <button onClick={prevStep} className="flex items-center gap-2 text-[#4a6b8c] hover:text-[#b86b3e] transition-all">
                                <ChevronLeft size={18} /> Back
                            </button>
                            <button
                                onClick={handleGenerateVariations}
                                className="px-6 py-2 bg-[#b86b3e] text-white rounded-full hover:bg-[#a05a30] transition-all"
                            >
                                Explore Variations
                            </button>
                        </div>
                    </motion.div>
                );
            case 5:
                return (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="space-y-6"
                    >
                        <div className="text-center">
                            <h2 className="text-2xl font-bold text-[#b86b3e]">Choose a variation</h2>
                            <p className="text-[#4a6b8c]/70">Different lengths and tones for different platforms or tests.</p>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {variations && Object.entries(variations).map(([key, value]: [string, any]) => (
                                <div key={key} className="p-4 bg-white/60 border border-[#4a6b8c]/10 rounded-lg space-y-3">
                                    <h4 className="text-xs font-bold uppercase tracking-widest text-[#b86b3e]">{key}</h4>
                                    <p className="text-sm text-[#1a1a1a] line-clamp-4">{value}</p>
                                    <button
                                        onClick={() => { setRefinedPost(value); nextStep(); }}
                                        className="text-xs text-[#4a6b8c] hover:text-[#b86b3e] font-semibold"
                                    >
                                        Use this version
                                    </button>
                                </div>
                            ))}
                        </div>
                        <button onClick={prevStep} className="flex items-center gap-2 text-[#4a6b8c] hover:text-[#b86b3e] transition-all">
                            <ChevronLeft size={18} /> Back
                        </button>
                    </motion.div>
                );
            case 6:
                return (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="space-y-6"
                    >
                        <div className="text-center">
                            <h2 className="text-2xl font-bold text-[#b86b3e]">Polish and publish</h2>
                            <p className="text-[#4a6b8c]/70">Final copy is ready to go.</p>
                        </div>
                        <div className="bg-white p-8 border border-[#4a6b8c]/20 rounded-lg shadow-xl relative">
                            <div className="prose prose-slate max-w-none text-[#1a1a1a] whitespace-pre-wrap">
                                {refinedPost}
                            </div>
                            <button
                                onClick={() => copyToClipboard(refinedPost)}
                                className="absolute top-4 right-4 flex items-center gap-2 px-4 py-2 bg-[#b86b3e] text-white rounded-md hover:bg-[#a05a30] transition-all"
                            >
                                {copied ? <Check size={16} /> : <Copy size={16} />}
                                {copied ? 'Copied!' : 'Copy Copy'}
                            </button>
                        </div>
                        <div className="flex justify-center gap-4">
                            <button
                                onClick={() => setStep(1)}
                                className="px-6 py-2 border border-[#b86b3e] text-[#b86b3e] rounded-full hover:bg-[#b86b3e]/5 transition-all"
                            >
                                Start New Workflow
                            </button>
                        </div>
                    </motion.div>
                );
            default:
                return null;
        }
    };

    return (
        <div className="max-w-4xl mx-auto p-6 min-h-screen">
            {/* Stepper */}
            <div className="flex items-center justify-between mb-12 relative px-4">
                <div className="absolute top-1/2 left-0 w-full h-[1px] bg-[#4a6b8c]/10 -z-10" />
                {STEPS.map((s, idx) => {
                    const current = idx + 1 === step;
                    const completed = idx + 1 < step;
                    return (
                        <div key={s} className="flex flex-col items-center gap-2 bg-[#f0f2f5] px-2">
                            <div className={cn(
                                "w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300",
                                current ? "bg-[#b86b3e] text-white scale-110 shadow-lg" :
                                    completed ? "bg-[#b86b3e]/20 text-[#b86b3e]" : "bg-white border border-[#4a6b8c]/20 text-[#4a6b8c]"
                            )}>
                                {completed ? <Check size={14} /> : idx + 1}
                            </div>
                            <span className={cn(
                                "text-[10px] uppercase tracking-widest font-bold",
                                current ? "text-[#b86b3e]" : "text-[#4a6b8c]/40"
                            )}>{s}</span>
                        </div>
                    );
                })}
            </div>

            {/* Workflow Area */}
            <div className="min-h-[500px]">
                <AnimatePresence mode="wait">
                    {renderStep()}
                </AnimatePresence>
            </div>

            {loading && (
                <div className="fixed inset-0 bg-white/50 backdrop-blur-sm flex flex-col items-center justify-center z-50">
                    <div className="w-16 h-16 border-4 border-[#b86b3e]/20 border-t-[#b86b3e] rounded-full animate-spin mb-4" />
                    <p className="text-[#b86b3e] font-bold animate-pulse tracking-widest uppercase text-xs">Architecting your post...</p>
                </div>
            )}
        </div>
    );
}
