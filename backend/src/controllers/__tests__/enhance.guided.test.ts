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

describe('Guided API Handlers (P0)', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('POST /api/enhance/guided/structure', () => {
        it('should return 400 if messyIdea is less than 10 characters', async () => {
            const res = await request(app)
                .post('/api/enhance/guided/structure')
                .send({ intent: 'story', messyIdea: 'too short' });
            
            expect(res.status).toBe(400);
            expect(res.body.error).toBe('Validation error');
        });

        it('should return 200 and hooks on valid input', async () => {
            (llmService.generateGuidedStructure as jest.Mock).mockResolvedValue({
                hooks: ['H1', 'H2', 'H3'],
                angle: 'Angle',
                structure: 'Structure'
            });

            const res = await request(app)
                .post('/api/enhance/guided/structure')
                .send({ intent: 'story', messyIdea: 'This is a long enough messy idea for testing.' });

            expect(res.status).toBe(200);
            expect(res.body.hooks).toHaveLength(3);
        });
    });

    describe('POST /api/enhance/guided/post', () => {
        it('should return 200 and the refined post', async () => {
            (llmService.generateGuidedPost as jest.Mock).mockResolvedValue('The refined post');

            const res = await request(app)
                .post('/api/enhance/guided/post')
                .send({ 
                    intent: 'story', 
                    messyIdea: 'Some thoughts', 
                    selectedHook: 'H1', 
                    selectedStructure: 'PAS' 
                });

            expect(res.status).toBe(200);
            expect(res.body.refinedPost).toBe('The refined post');
        });
    });
});
