import { 
    BookOpen, 
    MessageSquare, 
    Award, 
    Megaphone, 
    Zap, 
    Sparkles 
} from 'lucide-react';

export const INTENT_OPTIONS = [
    { 
        id: 'insight', 
        label: 'Share a lesson', 
        icon: BookOpen, 
        description: 'Turn an experience into a teaching moment' 
    },
    { 
        id: 'story', 
        label: 'Tell a personal story', 
        icon: MessageSquare, 
        description: 'Connect with your audience through vulnerability' 
    },
    { 
        id: 'authority', 
        label: 'Build authority', 
        icon: Award, 
        description: 'Showcase your expertise and deep knowledge' 
    },
    { 
        id: 'promote', 
        label: 'Promote something', 
        icon: Megaphone, 
        description: 'A product, event, or newsletter launch' 
    },
    { 
        id: 'discussion', 
        label: 'Start a discussion', 
        icon: Zap, 
        description: 'Ask a hard question or share a hot take' 
    },
    { 
        id: 'announce', 
        label: 'Announce something', 
        icon: Sparkles, 
        description: 'Hiring, new role, or milestone' 
    },
];

export const STEPS = [
    'Goal',
    'Idea',
    'Hook',
    'Draft',
    'Variants',
    'Publish'
];
