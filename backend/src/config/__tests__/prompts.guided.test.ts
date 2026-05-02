import { 
    generateStructurePrompt, 
    generatePostPrompt, 
    generateVariationsPrompt 
} from '../prompts.guided';

describe('Guided Prompt Builders', () => {
    const mockOptions = {
        intent: 'share a lesson',
        messyIdea: 'I learned that testing is hard but worth it.',
        targetAudience: 'junior developers',
        desiredTone: 'encouraging',
        avoidList: ['corporate fluff', 'jargon']
    };

    describe('generateStructurePrompt', () => {
        it('should include the intent and messy idea in the prompt', () => {
            const prompt = generateStructurePrompt(mockOptions);
            expect(prompt).toContain('share a lesson');
            expect(prompt).toContain('I learned that testing is hard but worth it.');
        });

        it('should include human-like writing guidelines', () => {
            const prompt = generateStructurePrompt(mockOptions);
            expect(prompt).toContain('HUMAN-LIKE WRITING GUIDELINES');
        });

        it('should specify the output format for hooks and angles', () => {
            const prompt = generateStructurePrompt(mockOptions);
            expect(prompt).toContain('[HOOK 1]');
            expect(prompt).toContain('[HOOK 2]');
            expect(prompt).toContain('[HOOK 3]');
            expect(prompt).toContain('[ANGLE]');
        });
    });

    describe('generatePostPrompt', () => {
        const postOptions = {
            ...mockOptions,
            selectedHook: 'Testing is the secret sauce.',
            selectedStructure: 'Problem-Agitation-Solution'
        };

        it('should incorporate the selected hook and structure', () => {
            const prompt = generatePostPrompt(postOptions);
            expect(prompt).toContain('Testing is the secret sauce.');
            expect(prompt).toContain('Problem-Agitation-Solution');
        });

        it('should enforce the 300-word limit rule', () => {
            const prompt = generatePostPrompt(postOptions);
            expect(prompt).toContain('300 words or less');
        });
    });

    describe('generateVariationsPrompt', () => {
        it('should request exactly 5 variants', () => {
            const prompt = generateVariationsPrompt('Original post content');
            expect(prompt).toContain('Short version');
            expect(prompt).toContain('More authoritative version');
            expect(prompt).toContain('More storytelling version');
            expect(prompt).toContain('More concise version');
            expect(prompt).toContain('Stronger hook version');
        });
    });
});
