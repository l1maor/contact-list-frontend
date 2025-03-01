import { describe, it, expect, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import ContactForm from './ContactForm';
import { Contact } from '../../types/Contact';
import userEvent from '@testing-library/user-event';

const mockNavigate = vi.fn();

vi.mock('react-router-dom', async () => ({
  ...await vi.importActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));

describe('ContactForm', () => {
  const mockContact: Contact = {
    id: '1',
    name: 'John Doe',
    phone: '123-456-7890',
    bio: 'Test bio',
    // @ts-expect-error necessary for testing
    avatar: null,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  const mockOnSubmit = vi.fn().mockResolvedValue(undefined);

  const renderComponent = (props = {}) => {
    return render(
      <MemoryRouter>
        <ContactForm
          mode="create"
          onSubmit={mockOnSubmit}
          {...props}
        />
      </MemoryRouter>
    );
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Rendering', () => {
    it('renders all form fields', () => {
      renderComponent();

      expect(screen.getByLabelText(/name/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/phone/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/bio/i)).toBeInTheDocument();
      expect(screen.getByText(/drag & drop an image here/i)).toBeInTheDocument();
    });

    it('renders with initial values', () => {
      renderComponent({ initialValues: mockContact });

      expect(screen.getByLabelText(/name/i)).toHaveValue(mockContact.name);
      expect(screen.getByLabelText(/phone/i)).toHaveValue(mockContact.phone);
      expect(screen.getByLabelText(/bio/i)).toHaveValue(mockContact.bio);
    });
  });

  describe('Form Submission', () => {
    it('submits form with valid data', async () => {
      const user = userEvent.setup();
      renderComponent();

      await user.type(screen.getByLabelText(/name/i), 'John Doe');
      await user.type(screen.getByLabelText(/phone/i), '123-456-7890');
      await user.type(screen.getByLabelText(/bio/i), 'Test bio');

      const submitButton = screen.getByRole('button', { name: /create contact/i });
      await user.click(submitButton);

      await waitFor(() => {
        expect(mockOnSubmit).toHaveBeenCalledWith({
          name: 'John Doe',
          phone: '123-456-7890',
          bio: 'Test bio',
          avatar: ''
        });
      });
    });

    it('disables submit button while loading', () => {
      renderComponent({ isLoading: true });
      expect(screen.getByRole('button', { name: /create contact/i })).toBeDisabled();
    });
  });

  describe('Mode Specific Behavior', () => {
    it('shows correct button text for create mode', () => {
      renderComponent({ mode: 'create' });
      expect(screen.getByRole('button', { name: /create contact/i })).toBeInTheDocument();
    });

    it('shows correct button text for edit mode', () => {
      renderComponent({ mode: 'edit' });
      expect(screen.getByRole('button', { name: /update contact/i })).toBeInTheDocument();
    });
  });
});