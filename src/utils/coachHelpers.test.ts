import { describe, it, expect } from 'vitest';
import { summarizeRecentMemory, getAptitudeGuidance } from './coachHelpers';

describe('coachHelpers', () => {
  it('returns a default message when there is no user message history', () => {
    const summary = summarizeRecentMemory([]);

    expect(summary).toBe('This student has just started using the platform and has not asked any study questions yet.');
  });

  it('summarizes the last three user messages', () => {
    const messages = [
      { sender: 'User', text: 'hello' },
      { sender: 'Coach', text: 'hi' },
      { sender: 'User', text: 'what is aptitude' },
      { sender: 'User', text: 'how do I improve' },
      { sender: 'User', text: 'need a plan' },
    ];

    const summary = summarizeRecentMemory(messages);

    expect(summary).toBe('Recent study questions: what is aptitude; how do I improve; need a plan');
  });

  it('returns a consistent aptitude guidance message', () => {
    const guidance = getAptitudeGuidance();

    expect(guidance).toContain('To get strong at aptitude');
    expect(guidance).toContain('timed mini-mocks');
  });
});
