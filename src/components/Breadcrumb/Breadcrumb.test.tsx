import { render, screen, fireEvent } from '@testing-library/react';
import { Breadcrumb } from './Breadcrumb';
import { vi } from 'vitest';
import { useNavigate } from 'react-router-dom';

// Mock useNavigate
vi.mock('react-router-dom', () => ({
  useNavigate: vi.fn()
}));

describe('Breadcrumb', () => {
  const mockNavigate = vi.fn();
  const items = [
    { label: 'Home', path: '/' },
    { label: 'Contacts', path: '/contacts' },
    { label: 'Details' }
  ];

  beforeEach(() => {
    vi.mocked(useNavigate).mockReturnValue(mockNavigate);
    mockNavigate.mockClear();
  });

  it('renders all breadcrumb items', () => {
    render(<Breadcrumb items={items} />);

    // Check if each label is present
    items.forEach(item => {
      expect(screen.getByText(item.label)).toBeInTheDocument();
    });
  });

  it('renders separators between items', () => {
    const { container } = render(<Breadcrumb items={items} />);

    // There should be one less separator than items
    const separators = container.getElementsByClassName('pi-angle-right');
    expect(separators.length).toBe(items.length - 1);
  });

  it('navigates when clicking on items with paths', () => {
    render(<Breadcrumb items={items} />);

    // Click the items with paths
    fireEvent.click(screen.getByText('Home'));
    expect(mockNavigate).toHaveBeenCalledWith('/');

    fireEvent.click(screen.getByText('Contacts'));
    expect(mockNavigate).toHaveBeenCalledWith('/contacts');
  });

  it('does not navigate when clicking on items without paths', () => {
    render(<Breadcrumb items={items} />);

    // Click the item without path
    fireEvent.click(screen.getByText('Details'));
    expect(mockNavigate).not.toHaveBeenCalled();
  });

  it('applies cursor-pointer class only to clickable items', () => {
    render(<Breadcrumb items={items} />);

    // First two items should be clickable
    const homeItem = screen.getByText('Home').parentElement;
    const contactsItem = screen.getByText('Contacts').parentElement;
    const detailsItem = screen.getByText('Details').parentElement;

    expect(homeItem).toHaveClass('cursor-pointer');
    expect(contactsItem).toHaveClass('cursor-pointer');
    expect(detailsItem).not.toHaveClass('cursor-pointer');
  });
});
