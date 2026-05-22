export function getFallbackSummary(
  companyName: string,
  monthlySavings: number,
  annualSavings: number,
  duplicateCount: number,
  inactiveCount: number
): string {
  return `Our SaaS stack audit for ${companyName} highlights an optimization opportunity of $${monthlySavings.toLocaleString()}/mo ($${annualSavings.toLocaleString()}/yr) in recurring licensing fees. We detected ${duplicateCount} duplicate tool configurations and ${inactiveCount} unallocated or ghost seats across active accounts. Standardizing redundant developer code editors and consolidating ad-hoc chatbot accounts under centralized corporate billing agreements is recommended to recover immediate cash and improve capital efficiency.`;
}

/**
 * Generates a ~100-word executive summary using the Gemini API, falling back to a structured template on failure.
 */
export async function generateAISummary(
  companyName: string,
  monthlySavings: number,
  annualSavings: number,
  duplicateCount: number,
  inactiveCount: number,
  primaryUseCase: string,
  recsCount: number
): Promise<string> {
  const apiKey = process.env.GEMINI_API_KEY;

  // If no valid API key is present, use fallback immediately
  if (!apiKey || apiKey === 'MY_GEMINI_API_KEY') {
    return getFallbackSummary(companyName, monthlySavings, annualSavings, duplicateCount, inactiveCount);
  }

  try {
    const prompt = `You are a financial SaaS analyst. Write a concise (~100 words) executive summary audit summary for ${companyName}.
Metrics:
- Potential monthly savings: $${monthlySavings}/mo
- Potential annual savings: $${annualSavings}/yr
- Duplicate tools: ${duplicateCount}
- Ghost/inactive seats: ${inactiveCount}
- Primary workspace use case: ${primaryUseCase}
- Active recommendations generated: ${recsCount}

Summarize the key findings. Emphasize standardizing overlap (e.g. chat assistants or code editors) and pruning ghost accounts. Be direct, professional, and actionable. Avoid introductory filler. Keep it under 110 words.`;

    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`;
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: {
          maxOutputTokens: 250,
          temperature: 0.5,
        },
      }),
    });

    if (!response.ok) {
      throw new Error(`Gemini API returned status ${response.status}`);
    }

    const data = await response.json();
    const generatedText = data.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!generatedText) {
      throw new Error('Invalid response structure from Gemini API');
    }

    return generatedText.trim();
  } catch (error) {
    console.error('[Gemini API Error] Failed to generate AI summary. Using fallback:', error);
    return getFallbackSummary(companyName, monthlySavings, annualSavings, duplicateCount, inactiveCount);
  }
}
