import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ContactCard from './ContactCard';
import { Contact } from '../../types/Contact';
import defaultAvatar from '../../assets/default-avatar.svg';

const mockNavigate = vi.fn();

vi.mock('react-router-dom', () => ({
  ...vi.importActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));

describe('ContactCard', () => {
  const mockContact: Contact = {
    id: '1',
    name: 'John Doe',
    phone: '123-456-7890',
    bio: 'Test bio',
    avatar: 'https://example.com/avatar.jpg',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Rendering', () => {
    it('renders contact information correctly', () => {
      render(
        <ContactCard contact={mockContact} />
      );

      expect(screen.getByText('John Doe')).toBeInTheDocument();
      expect(screen.getByRole('img')).toHaveAttribute('src', mockContact.avatar);
    });

    it('uses default avatar when contact has no avatar', () => {
      const contactWithoutAvatar = { ...mockContact, avatar: null };
      render(
        // @ts-expect-error necessary for testing
        <ContactCard contact={contactWithoutAvatar} />
      );

      expect(screen.getByRole('img')).toHaveAttribute('src', defaultAvatar);
    });

    it('uses default avatar when avatar image fails to load', () => {
      render(
        <ContactCard contact={mockContact} />
      );

      const img = screen.getByRole('img');
      fireEvent.error(img);

      expect(img).toHaveAttribute('src', defaultAvatar);
    });
  });

  describe('Navigation', () => {
    it('navigates to contact details on click', async () => {
      const user = userEvent.setup();
      render(
        <ContactCard contact={mockContact} />
      );

      await user.click(screen.getByRole('button'));

      expect(mockNavigate).toHaveBeenCalledWith('/contact/1');
    });

    it('navigates to contact details on Enter key', async () => {
      const user = userEvent.setup();
      render(
        <ContactCard contact={mockContact} />
      );

      await user.type(screen.getByRole('button'), '{Enter}');

      expect(mockNavigate).toHaveBeenCalledWith('/contact/1');
    });
  });
});
