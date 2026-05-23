# Auto Audit — LLM Prompts & Rationale

This document outlines the prompt engineering decisions, prompt structures, failed experiments, and fallback mechanisms for the **Auto Audit** platform's AI executive summary generator.

---

## 1. Active Gemini Prompt Template

The prompt is executed dynamically in [src/lib/aiSummary.ts](file:///c:/Users/prith/OneDrive/Desktop/auto-audit/src/lib/aiSummary.ts).

### User Prompt Structure:
```text
You are a financial SaaS analyst. Write a concise (~100 words) executive summary audit summary for ${companyName}.
Metrics:
- Potential monthly savings: $${monthlySavings}/mo
- Potential annual savings: $${annualSavings}/yr
- Duplicate tools: ${duplicateCount}
- Ghost/inactive seats: ${inactiveCount}
- Primary workspace use case: ${primaryUseCase}
- Active recommendations generated: ${recsCount}

Summarize the key findings. Emphasize standardizing overlap (e.g. chat assistants or code editors) and pruning ghost accounts. Be direct, professional, and actionable. Avoid introductory filler. Keep it under 110 words.
```

---

## 2. Prompt Engineering Design Decisions

- **Role Prompting**: Declaring `You are a financial SaaS analyst` frames the behavior of the LLM to write in a professional, metrics-driven, corporate tone suitable for finance teams or startup founders.
- **Strict Word Limits**: Specifying `concise (~100 words)` and `Keep it under 110 words` constraints ensures that the response fits perfectly in the UI dashboard card layout without overflow or truncation.
- **Negative Constraints**: Instructing `Avoid introductory filler` prevents common conversational responses (e.g., *"Here is the summary you requested..."*) and cuts directly to the financial analysis.
- **Structured Inputs**: Formatting the metric variables as a clear bulleted list helps the model digest the numerical relationships immediately.
- **Model Parameters**:
  - **Temperature (`0.5`)**: Low enough to prevent creative hallucinations or mathematical errors, but high enough to write varied, natural-sounding summaries.
  - **Max Output Tokens (`250`)**: Prevents runaway generation costs and ensures prompt compliance.

---

## 3. Failed Prompt Experiments

### Experiment 1: Raw JSON Recommendation Generator (Failed)
- **Concept**: Attempted to use the LLM to analyze the subscription list directly and generate the recommendation JSON structure (title, description, cost, action) to replace the deterministic heuristics engine.
- **Failure Reason**: The model struggled to do exact calculations (e.g., Claude Team seat minimum rules, Cursor/Copilot overlapping seats) and sometimes skipped tools. Mathematical drift occurred often.
- **Solution**: We implemented a deterministic heuristics engine in TypeScript (`auditEngine.ts`), ensuring 100% calculation reliability, and limited the LLM to generating text-based executive summaries.

### Experiment 2: Unconstrained Summary (Failed)
- **Concept**: Simply asked the model to "Write a summary of the audit scorecard."
- **Failure Reason**: The model wrote 250-400 words, including generic introductory texts, conversational greetings, and lists of recommendation bullet points that duplicated the UI checklist.
- **Solution**: Added strict word counts and negative constraints.

---

## 4. Fallback Strategy

To guarantee uptime and function correctly even without network connectivity or API key setup, a deterministic fallback system is implemented.

### Local Mock Fallback Template:
If `process.env.GEMINI_API_KEY` is missing or when the REST fetch fails:
```typescript
export function getFallbackSummary(
  companyName: string,
  monthlySavings: number,
  annualSavings: number,
  duplicateCount: number,
  inactiveCount: number
): string {
  return `Our SaaS stack audit for ${companyName} highlights an optimization opportunity of $${monthlySavings.toLocaleString()}/mo ($${annualSavings.toLocaleString()}/yr) in recurring licensing fees. We detected ${duplicateCount} duplicate tool configurations and ${inactiveCount} unallocated or ghost seats across active accounts. Standardizing redundant developer code editors and consolidating ad-hoc chatbot accounts under centralized corporate billing agreements is recommended to recover immediate cash and improve capital efficiency.`;
}
```
This fallback is completely client-safe, requires no internet connection, and preserves clean dynamic variable integration.
