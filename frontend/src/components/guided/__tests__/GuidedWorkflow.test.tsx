import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import GuidedWorkflow from '../GuidedWorkflow';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { vi } from 'vitest';
import axios from 'axios';

// Mock axios for API calls
vi.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

const queryClient = new QueryClient({
    defaultOptions: {
        queries: { retry: false },
    },
});

const wrapper = ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
);

describe('GuidedWorkflow BDD (P0 & P1)', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        localStorage.clear();
    });

    describe('Priority 0: Core Flow', () => {
        it('Scenario: Intent selection moves user to Step 2', async () => {
            render(<GuidedWorkflow />, { wrapper });
            
            const intentCard = screen.getByText(/Share a lesson/i);
            fireEvent.click(intentCard);

            expect(screen.getByText(/Dump the messy idea/i)).toBeInTheDocument();
        });

        it('Scenario: Valid messy idea allows hook generation', async () => {
            mockedAxios.post.mockResolvedValueOnce({
                data: { hooks: ['H1', 'H2', 'H3'], structure: 'PAS' }
            });

            render(<GuidedWorkflow />, { wrapper });
            fireEvent.click(screen.getByText(/Share a lesson/i));

            const textarea = screen.getByPlaceholderText(/Dump your messy thoughts/i);
            fireEvent.change(textarea, { target: { value: 'This is a test idea that meets the length requirement.' } });

            const nextBtn = screen.getByText(/Generate Hooks/i);
            fireEvent.click(nextBtn);

            await waitFor(() => {
                expect(screen.getByText(/Pick your hook/i)).toBeInTheDocument();
            });
        });
    });

    describe('Priority 1: Resilience & Persistence', () => {
        it('Scenario: Local Storage preserves data on refresh', () => {
            // Pre-seed local storage
            localStorage.setItem('ghostpost_guided_state', JSON.stringify({
                step: 2,
                intent: 'Share a lesson',
                messyIdea: 'Persisted messy idea'
            }));

            render(<GuidedWorkflow />, { wrapper });

            expect(screen.getByText(/Dump the messy idea/i)).toBeInTheDocument();
            expect(screen.getByDisplayValue('Persisted messy idea')).toBeInTheDocument();
        });

        it('Scenario: Backtracking allows editing previous steps', () => {
            render(<GuidedWorkflow />, { wrapper });
            
            fireEvent.click(screen.getByText(/Share a lesson/i));
            expect(screen.getByText(/Dump the messy idea/i)).toBeInTheDocument();

            const backBtn = screen.getByText(/Back/i);
            fireEvent.click(backBtn);

            expect(screen.getByText(/Choose your goal/i)).toBeInTheDocument();
        });
    });
});
