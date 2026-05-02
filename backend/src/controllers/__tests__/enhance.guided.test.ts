import request from 'supertest';
import express from 'express';
import * as enhanceController from '../enhance.controller';
import * as llmService from '../../services/llm.service';

// Mock the services
jest.mock('../../services/llm.service');

const app = express();
app.use(express.json());
app.post('/api/enhance/guided/structure', enhanceController.generateGuidedStructure);
app.post('/api/enhance/guided/post', enhanceController.generateGuidedPost);
app.post('/api/enhance/guided/variations', enhanceController.generateGuidedVariations);

describe('Guided API Endpoints', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('POST /api/enhance/guided/structure', () => {
        it('should return 400 if messyIdea is missing', async () => {
            const res = await request(app)
                .post('/api/enhance/guided/structure')
                .send({ intent: 'story' });
            expect(res.status).toBe(400);
            expect(res.body.error).toContain('Validation error');
        });

        it('should return 200 and structure data on success', async () => {
            (llmService.generateGuidedStructure as jest.Mock).mockResolvedValue({
                hooks: ['H1', 'H2', 'H3'],
                angle: 'Angle',
                structure: 'Structure',
                coreMessage: 'Msg',
                cta: 'CTA'
            });

            const res = await request(app)
                .post('/api/enhance/guided/structure')
                .send({ 
                    messyIdea: 'Some thoughts about AI and art.',
                    intent: 'share a lesson'
                });
            
            expect(res.status).toBe(200);
            expect(res.body.hooks).toHaveLength(3);
            expect(llmService.generateGuidedStructure).toHaveBeenCalled();
        });
    });

    describe('POST /api/enhance/guided/post', () => {
        it('should return 200 and the refined post', async () => {
            (llmService.generateGuidedPost as jest.Mock).mockResolvedValue('The refined post content');

            const res = await request(app)
                .post('/api/enhance/guided/post')
                .send({ 
                    messyIdea: 'Thoughts',
                    selectedHook: 'Hook 1',
                    selectedStructure: 'Structure A',
                    intent: 'story'
                });
            
            expect(res.status).toBe(200);
            expect(res.body.refinedPost).toBe('The refined post content');
        });
    });

    describe('POST /api/enhance/guided/variations', () => {
        it('should return 200 and variations', async () => {
            (llmService.generateGuidedVariations as jest.Mock).mockResolvedValue({
                short: 'short version',
                authoritative: 'auth version',
                storytelling: 'story version',
                concise: 'concise version',
                strongerHook: 'strong hook version'
            });

            const res = await request(app)
                .post('/api/enhance/guided/variations')
                .send({ originalPost: 'Long post content' });
            
            expect(res.status).toBe(200);
            expect(res.body.short).toBe('short version');
        });
    });
});
