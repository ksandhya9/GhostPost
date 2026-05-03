import { 
    generateStructurePrompt, 
    generatePostPrompt, 
    generateVariationsPrompt 
} from '../prompts.guided';

describe('Guided Prompt Builders (P0 & P1)', () => {
    const mockOptions = {
        intent: 'share a lesson',
        messyIdea: 'Testing is hard but worth it.',
        targetAudience: 'junior developers',
        desiredTone: 'encouraging',
        avoidList: ['corporate fluff']
    };

    describe('generateStructurePrompt (P0)', () => {
        it('should include the strategic intent and messy idea', () => {
            const prompt = generateStructurePrompt(mockOptions);
            expect(prompt).toContain('share a lesson');
            expect(prompt).toContain('Testing is hard but worth it.');
        });

        it('should mandate a JSON output with hooks, angle, and structure', () => {
            const prompt = generateStructurePrompt(mockOptions);
            expect(prompt).toContain('OUTPUT FORMAT (MANDATORY JSON)');
            expect(prompt).toContain('"hooks":');
            expect(prompt).toContain('"angle":');
            expect(prompt).toContain('"structure":');
        });

        it('should include human-like writing guidelines', () => {
            const prompt = generateStructurePrompt(mockOptions);
            expect(prompt).toContain('HUMAN-LIKE WRITING GUIDELINES');
        });
    });

    describe('generatePostPrompt (P0)', () => {
        const postOptions = {
            ...mockOptions,
            selectedHook: 'The secret to good code is testing.',
            selectedStructure: 'Problem-Agitation-Solution'
        };

        it('should incorporate the user-selected hook exactly', () => {
            const prompt = generatePostPrompt(postOptions);
            expect(prompt).toContain('The secret to good code is testing.');
        });

        it('should enforce the platform-specific word limit', () => {
            const prompt = generatePostPrompt(postOptions);
            expect(prompt).toContain('300 words or less');
        });

        it('should include the AI ban list', () => {
            const prompt = generatePostPrompt(postOptions);
            expect(prompt).toContain('AI-ISM BAN LIST');
        });
    });

    describe('generateVariationsPrompt (P1)', () => {
        it('should request the 5 mandatory variation types', () => {
            const prompt = generateVariationsPrompt('Original post');
            expect(prompt).toContain('Short version');
            expect(prompt).toContain('More authoritative version');
            expect(prompt).toContain('More storytelling version');
            expect(prompt).toContain('More concise version');
            expect(prompt).toContain('Stronger hook version');
        });
    });
});
