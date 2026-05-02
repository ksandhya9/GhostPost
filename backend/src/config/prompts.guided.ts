import { HUMAN_GUIDELINES, AI_BAN_LIST } from './index';

export interface GuidedStructureOptions {
    intent: string;
    messyIdea: string;
    targetAudience?: string;
    desiredTone?: string;
    avoidList?: string[];
}

export interface GuidedPostOptions extends GuidedStructureOptions {
    selectedHook: string;
    selectedStructure: string;
    userStyleProfile?: string;
}

/**
 * Stage 1: Generate hooks, angle, structure, core message, and CTA.
 */
export const generateStructurePrompt = (options: GuidedStructureOptions): string => {
    const { intent, messyIdea, targetAudience, desiredTone, avoidList } = options;

    return `
You are a world-class Content Strategist and LinkedIn Ghostwriter.
Your goal is to transform a "messy idea" into a strategic LinkedIn post architecture.

GOAL/INTENT: ${intent}
MESSY IDEA:
"""
${messyIdea}
"""

${targetAudience ? `TARGET AUDIENCE: ${targetAudience}` : ''}
${desiredTone ? `DESIRED TONE: ${desiredTone}` : ''}
${avoidList && avoidList.length > 0 ? `THINGS TO AVOID: ${avoidList.join(', ')}` : ''}

${HUMAN_GUIDELINES}

Your task is to generate:
1. Three distinct "Hook" options that would stop the scroll.
2. A recommended "Post Angle" (e.g., "The Counter-Intuitive Truth", "The Personal Transformation").
3. A suggested "Post Structure" (e.g., "Problem-Agitation-Solution", "The 5-Step Framework").
4. The "Core Message" in one sentence.
5. A natural "Call to Action" (CTA).

OUTPUT FORMAT (MANDATORY JSON):
{
    "hooks": [
        "[HOOK 1]",
        "[HOOK 2]",
        "[HOOK 3]"
    ],
    "angle": "...",
    "structure": "...",
    "coreMessage": "...",
    "cta": "..."
}
`;
};

/**
 * Stage 2: Generate the final polished LinkedIn post.
 */
export const generatePostPrompt = (options: GuidedPostOptions): string => {
    const { 
        intent, 
        messyIdea, 
        selectedHook, 
        selectedStructure, 
        targetAudience, 
        desiredTone, 
        userStyleProfile 
    } = options;

    return `
You are an elite LinkedIn Ghostwriter. 
Your mission: Write a high-authority LinkedIn post based on a specific strategy and a raw idea.

INTENT: ${intent}
STRATEGIC HOOK: ${selectedHook}
STRUCTURE TO FOLLOW: ${selectedStructure}

RAW IDEA:
"""
${messyIdea}
"""

${targetAudience ? `TARGET AUDIENCE: ${targetAudience}` : ''}
${desiredTone ? `TONE: ${desiredTone}` : ''}
${userStyleProfile ? `USER STYLE PROFILE: ${userStyleProfile}` : ''}

STRICT RULE: Your response must be 300 words or less. DO NOT exceed this limit.

${HUMAN_GUIDELINES}

GUIDELINES:
1. Use the [STRATEGIC HOOK] exactly as the first 1-2 lines.
2. Follow the [STRUCTURE TO FOLLOW] for the body of the post.
3. Sound human. Avoid all AI-isms: ${AI_BAN_LIST.slice(0, 5).join(', ')}.
4. Use short paragraphs and white space for readability.
5. Do not use generic motivational fluff.

OUTPUT:
Return ONLY the full post text.
`;
};

/**
 * Stage 3: Generate post variations.
 */
export const generateVariationsPrompt = (originalPost: string): string => {
    return `
You are a social media optimization expert.
Given the original LinkedIn post below, generate 5 distinct variations to suit different needs.

ORIGINAL POST:
"""
${originalPost}
"""

VARIATIONS NEEDED:
1. Short version: Under 100 words, punchy and direct.
2. More authoritative version: Focuses on expertise, data, and hard-earned lessons.
3. More storytelling version: Leans into narrative, vulnerability, and personal experience.
4. More concise version: Extreme brevity, bullet-heavy.
5. Stronger hook version: Keeps the body but tests a more controversial or curiosity-driven opening.

OUTPUT FORMAT (MANDATORY JSON):
{
    "short": "...",
    "authoritative": "...",
    "storytelling": "...",
    "concise": "...",
    "strongerHook": "..."
}
`;
};
