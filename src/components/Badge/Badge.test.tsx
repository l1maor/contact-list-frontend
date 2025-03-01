import { render, screen } from '@testing-library/react';
import { Badge } from './Badge';
import { customTheme } from '../../theme';

describe('Badge', () => {
  it('renders with the provided label', () => {
    const label = 'Test Badge';
    render(<Badge label={label} />);

    const badge = screen.getByText(label);
    expect(badge).toBeInTheDocument();
    expect(badge).toHaveTextContent(label);
  });

  it('applies correct styling', () => {
    const label = 'Test Badge';
    render(<Badge label={label} />);

    const badge = screen.getByText(label);
    expect(badge).toHaveStyle({
      backgroundColor: customTheme.colors.buttonBackground,
      borderRadius: '12px',
      padding: '4px 12px',
      fontSize: '14px',
      display: 'inline-block'
    });
  });
});
