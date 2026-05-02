import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import GuidedWorkflow from '../GuidedWorkflow';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { vi } from 'vitest';
import axios from 'axios';

// Mock axios
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

describe('GuidedWorkflow BDD', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('should start at Step 1 and move to Step 2 when an intent is selected', async () => {
        render(<GuidedWorkflow />, { wrapper });

        expect(screen.getByText(/Choose your goal/i)).toBeInTheDocument();
        
        const intentCard = screen.getByText(/Share a lesson/i);
        fireEvent.click(intentCard);

        expect(screen.getByText(/Dump the messy idea/i)).toBeInTheDocument();
    });

    it('should generate hooks and move to Step 3 when messy idea is submitted', async () => {
        mockedAxios.post.mockResolvedValueOnce({
            data: {
                hooks: ['Hook 1', 'Hook 2', 'Hook 3'],
                angle: 'Insightful',
                structure: 'PAS',
                coreMessage: 'Test',
                cta: 'Read more'
            }
        });

        render(<GuidedWorkflow />, { wrapper });
        
        // Move to Step 2
        fireEvent.click(screen.getByText(/Share a lesson/i));

        const textarea = screen.getByPlaceholderText(/Dump your messy thoughts/i);
        fireEvent.change(textarea, { target: { value: 'This is a long enough messy idea for testing.' } });

        const nextBtn = screen.getByText(/Generate Hooks/i);
        fireEvent.click(nextBtn);

        await waitFor(() => {
            expect(screen.getByText(/Pick your hook/i)).toBeInTheDocument();
            expect(screen.getByText(/Hook 1/i)).toBeInTheDocument();
        });
    });

    it('should allow navigating back between steps', () => {
        render(<GuidedWorkflow />, { wrapper });

        fireEvent.click(screen.getByText(/Share a lesson/i));
        expect(screen.getByText(/Dump the messy idea/i)).toBeInTheDocument();

        const backBtn = screen.getByText(/Back/i);
        fireEvent.click(backBtn);

        expect(screen.getByText(/Choose your goal/i)).toBeInTheDocument();
    });
});
