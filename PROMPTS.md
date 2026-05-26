# Auto Audit — Prompt Engineering Documentation

## Overview

The system uses Gemini 2.5 Flash for one specific task: generating an executive summary of audit results. The scope is intentionally narrow — all financial calculations and recommendations are deterministic. Gemini only writes the narrative wrapper.

---

## The Production Prompt

**Location:** `src/lib/aiSummary.ts`, `generateAISummary()`

```
You are a financial SaaS analyst. Write a concise (~100 words) executive summary audit summary for {companyName}.

Metrics:
- Potential monthly savings: ${monthlySavings}/mo
- Potential annual savings: ${annualSavings}/yr
- Duplicate tools: {duplicateCount}
- Ghost/inactive seats: {inactiveCount}
- Primary workspace use case: {primaryUseCase}
- Active recommendations generated: {recsCount}

Summarize the key findings. Emphasize standardizing overlap (e.g. chat assistants or code editors) and pruning ghost accounts. Be direct, professional, and actionable. Avoid introductory filler. Keep it under 110 words.
```

**Gemini configuration:**
```json
{
  "model": "gemini-2.5-flash",
  "maxOutputTokens": 250,
  "temperature": 0.5
}
```

---

## Why the Prompt is Structured This Way

**"You are a financial SaaS analyst"**

The role framing matters. Without it, Gemini tends to write generic productivity advice ("AI tools can help your team work smarter!"). The financial analyst framing pushes toward concrete metrics-focused language — savings figures, efficiency ratios, actionable steps.

**Explicit metrics as numbered list**

Passing the raw numbers directly into the prompt prevents hallucination on specific figures. Gemini can't invent a savings number because it's told exactly what the savings are. The model's job is phrasing and framing, not calculation.

**"Avoid introductory filler"**

Without this, Gemini almost always starts with something like "In today's rapidly evolving AI landscape..." or "Our analysis has identified several opportunities...". The filler constraint pushes it to start with the actual finding: "Acme Corp has $340/mo in recoverable spend across 3 recommendations."

**Word count constraint (100–110 words)**

The summary appears in two places: the dashboard scorecard and the transactional email. Both have limited vertical space. A 300-word summary breaks the layout. The 110-word ceiling is specific enough that Gemini takes it seriously — a vague "be brief" doesn't work as well.

**Temperature 0.5**

Lower than the default (~0.7-0.9) but not deterministic. At 0.0, the output becomes repetitive across audits with similar inputs. At 0.5, there's enough variation to feel natural while keeping the tone consistent and professional.

**maxOutputTokens: 250**

A 110-word summary at roughly 1.3 tokens/word is ~143 tokens. 250 gives headroom for punctuation and formatting without risking runaway generation.

---

## Prompt Experiments That Didn't Work

**Attempt 1: Fully structured output (JSON)**

I tried prompting for JSON output with keys like `headline`, `keyFindings`, `recommendation`. The idea was to use the structured fields in the UI separately.

*Problem:* Gemini 2.5 Flash is not consistent about JSON formatting, especially when the content has dollar signs and numbers. It would sometimes include trailing commas, sometimes wrap the JSON in markdown code fences, sometimes add commentary outside the JSON block. Parsing this reliably required regex gymnastics that weren't worth it for a summary field.

*Resolution:* Dropped the structured output idea entirely. Plain text is more reliable and easier to display.

**Attempt 2: Asking Gemini to recommend specific tools to cut**

Early version of the prompt included: "Based on the data, recommend which specific tools the company should cancel."

*Problem:* Gemini would confidently name tools to cancel without having the full subscription list. It would hallucinate specifics — "Cancel your Notion subscription" when Notion wasn't in the audit at all. This is the exact failure mode that makes LLM-generated recommendations dangerous in financial contexts.

*Resolution:* Gemini now only sees aggregated metrics (savings figures, counts), not the full subscription list. It cannot name specific tools because it doesn't know which tools are present. All specific recommendations come from the deterministic engine.

**Attempt 3: Longer context prompt with all recommendations listed**

Passed the full `recommendations` array (as a serialized list) into the prompt so Gemini could reference each one.

*Problem:* The prompt became 800+ tokens, the output was longer and harder to constrain, and the model would occasionally confuse its own summary with the engine's recommendations — leading to inconsistencies like "save $50/mo by canceling Copilot" when the engine said $50 but Gemini summarized it as "$45."

*Resolution:* Reverted to passing only aggregate counts. The summary doesn't enumerate individual recommendations — it describes the pattern (e.g., "3 duplicate tool overlaps") and the overall savings. Individual recommendations are listed separately by the engine.

---

## Hallucination Prevention Strategy

**Rule 1: Only pass numbers, not lists**

The prompt contains exact dollar amounts and counts. Gemini cannot fabricate a savings figure because the savings figure is in the prompt. It can only choose how to phrase "$340/mo in savings," not invent a different number.

**Rule 2: Gemini doesn't have the subscription list**

The model doesn't know which tools are in the audit. It cannot name a specific tool to cancel because it doesn't know the tool names. Specific recommendations are engine-only.

**Rule 3: The fallback exists and is production-ready**

The `getFallbackSummary()` function produces a clean, grammatically correct summary using a template. It's not obviously AI-generated or obviously templated. If Gemini fails or returns garbage, the user never notices — they just get the template.

---

## Fallback Behavior

```typescript
// From src/lib/aiSummary.ts
export function getFallbackSummary(
  companyName: string,
  monthlySavings: number,
  annualSavings: number,
  duplicateCount: number,
  inactiveCount: number
): string {
  return `Our SaaS stack audit for ${companyName} highlights an optimization 
opportunity of $${monthlySavings.toLocaleString()}/mo 
($${annualSavings.toLocaleString()}/yr) in recurring licensing fees. 
We detected ${duplicateCount} duplicate tool configurations and 
${inactiveCount} unallocated or ghost seats across active accounts. 
Standardizing redundant developer code editors and consolidating ad-hoc 
chatbot accounts under centralized corporate billing agreements is recommended 
to recover immediate cash and improve capital efficiency.`;
}
```

The fallback fires in three situations:
1. `GEMINI_API_KEY` is missing or set to the placeholder value
2. The Gemini API returns a non-200 status
3. The response body doesn't contain the expected `candidates[0].content.parts[0].text` path

The fallback template uses the same metrics as the prompt, so the numbers are always accurate even when the prose is templated.

---

## Cost Estimate

At current Gemini 2.5 Flash pricing (~$0.30/1M input tokens, $1.00/1M output tokens):

- Input prompt: ~200 tokens
- Output: ~130 tokens  
- Cost per audit summary: ~$0.0002 (≈ 0.02 cents)

At 100 audits/day, monthly AI cost is approximately **$0.60/month**. This is effectively free at MVP scale and manageable even at thousands of audits/day.
