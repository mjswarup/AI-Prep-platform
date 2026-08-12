export function summarizeRecentMemory(messages: Array<{ sender: string; text: string }>): string {
  const userMessages = messages.filter((m) => m.sender === 'User');
  if (!userMessages.length) {
    return 'This student has just started using the platform and has not asked any study questions yet.';
  }

  const recentTopics = userMessages.slice(-3).map((message) => message.text.trim()).join('; ');
  return `Recent study questions: ${recentTopics}`;
}

export function getAptitudeGuidance(): string {
  return `To get strong at aptitude, build a steady routine: focus first on core question types like number systems, arithmetic, algebra, logical reasoning, and data interpretation. Solve a few targeted questions daily, review every mistake immediately, and use timed mini-mocks to build speed and confidence. Tie the practice back to your platform workflow by filtering by the same topic areas and revisiting them after each mock.`;
}
