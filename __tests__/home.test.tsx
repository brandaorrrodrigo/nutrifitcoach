import { render, screen } from '@testing-library/react';
import HomePage from '@/app/page';

describe('HomePage', () => {
  it('renderiza o título principal', () => {
    render(<HomePage />);
    const heading = screen.getByText(/Cardápios Personalizados/i);
    expect(heading).toBeInTheDocument();
  });

  it('renderiza botão de começar', () => {
    render(<HomePage />);
    const button = screen.getByText(/Começar Grátis/i);
    expect(button).toBeInTheDocument();
  });
});
