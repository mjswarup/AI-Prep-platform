// Frontend API handler for AI Career Coach
// Requests are proxied to the local Express server so the OpenAI API key stays on the server.

export async function careerCoachRequest(messages: Array<{ role: string; content: string }>) {
  try {
    const response = await fetch("/api/coach/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: messages,
        max_tokens: 500,
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        errorData.error?.message || `API Error: ${response.status} ${response.statusText}`
      );
    }

    return response.json();
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message);
    }
    throw new Error("Failed to connect to AI Career Coach API");
  }
}
