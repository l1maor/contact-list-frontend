import { vi } from 'vitest';

const mockNavigate = vi.fn();

vi.mock('react-router-dom', async (importOriginal) => {
  const actual = await importOriginal();
  return {
    ...actual as object,
    useNavigate: () => mockNavigate,
    useLocation: vi.fn(() => ({ pathname: '/' })),
    useParams: vi.fn(() => ({})),
  };
});

export { mockNavigate };

beforeEach(() => {
  mockNavigate.mockReset();
});
