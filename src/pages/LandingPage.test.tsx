import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { LandingPage } from './LandingPage';

describe('LandingPage', () => {
  it('renders the hero content and CTAs', () => {
    render(
      <LandingPage onStart={vi.fn()} onExploreCompanies={vi.fn()} onLoginClick={vi.fn()} />
    );

    expect(screen.getByRole('heading', { name: /Prepare Like You're Already Hired/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Start AI Interview/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Explore Practice/i })).toBeInTheDocument();
  });
});
