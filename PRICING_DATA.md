# Auto Audit — AI Tool Pricing Data

This document records the pricing data used in the audit engine's `pricing.ts` catalog. All prices are verified against official vendor pages. Plans are set to the monthly billing rate (annual-billed tiers are converted to monthly equivalent where noted).

Last verified: **May 2026**

---

## Cursor

| Plan | Monthly Price | Notes |
|---|---|---|
| Hobby | $0 | 50 slow premium requests included |
| Pro | $20/seat | 500 fast requests, Composer multi-file edit |
| Business | $40/seat | SSO, Privacy Mode, centralized billing |
| Enterprise | $100+/seat | Custom model options, enterprise guardrails |

**Official URL:** https://cursor.com/pricing  
**Verification Date:** May 2026  
**Notes:** Pro plan at $20/mo is the standard individual developer tier. Business adds SSO which matters for enterprise compliance but not for most startups.

---

## Claude (Anthropic)

| Plan | Monthly Price | Notes |
|---|---|---|
| Free | $0 | Rate-limited access to Claude 3.5 Haiku |
| Pro (Individual) | $20/seat | Claude 3.5 Sonnet + Opus, Projects, high limits |
| Max | $40/seat | ~5× usage of Pro, early feature access |
| Team | $25/seat | 5-seat billing minimum, admin console |
| Enterprise | $75+/seat | Custom pricing, SSO, data residency |
| API | Usage-based | Per-token pricing via Anthropic Console |

**Official URL:** https://www.anthropic.com/pricing  
**Verification Date:** May 2026  
**Notes:** The Team plan's 5-seat minimum is a critical audit rule. Teams with 2-4 users on Team are paying for empty seats. This is one of the highest-value recommendations the engine generates.

---

## ChatGPT (OpenAI)

| Plan | Monthly Price | Notes |
|---|---|---|
| Free | $0 | GPT-4o mini, limited messages |
| Plus (Individual) | $20/user | GPT-4o, DALL·E, custom GPTs |
| Team | $25/user | 2-seat minimum, shared workspace, admin controls |
| Enterprise | Custom | Unlimited high-speed GPT-4o, SOC 2 |
| API | Usage-based | Per-token via OpenAI platform |

**Official URL:** https://openai.com/chatgpt/pricing  
**Verification Date:** May 2026  
**Notes:** ChatGPT Team enforces a 2-seat minimum. A solo founder on Team is paying $50/mo when Plus ($20/mo) would be identical functionality. This is Rule D in the audit engine.

---

## GitHub Copilot

| Plan | Monthly Price | Notes |
|---|---|---|
| Individual | $10/seat | IDE autocomplete + Copilot Chat |
| Business | $19/seat | Org management, IP indemnity |
| Enterprise | $39/seat | Fine-tuned models, PR summarization |

**Official URL:** https://github.com/features/copilot#pricing  
**Verification Date:** May 2026  
**Notes:** The primary audit rule involving Copilot is its overlap with Cursor. Cursor's Pro plan ($20/seat) includes autocomplete, multi-file editing, and an embedded chat interface using the same underlying models. Running both concurrently for the same developers is direct redundancy.

---

## Gemini (Google)

| Plan | Monthly Price | Notes |
|---|---|---|
| Pro (Google One AI Premium) | $20/mo | Access to Gemini 1.5/2.0 Pro, Workspace integration |
| Ultra/Advanced | $30/mo | Gemini Advanced (highest capability), NotebookLM+ |
| API (Google AI Studio) | Usage-based | Per-token via Gemini API |

**Official URL:** https://one.google.com/about/ai-premium | https://ai.google.dev/pricing  
**Verification Date:** May 2026  
**Notes:** Gemini's consumer plan pricing is bundled with Google One. Enterprise pricing (Workspace add-on) varies. Used in the catalog at the consumer plan level for simplicity.

---

## Windsurf (by Codeium)

| Plan | Monthly Price | Notes |
|---|---|---|
| Free | $0 | Limited completions |
| Pro | $15/seat | Unlimited autocomplete, Cascade AI agent |
| Team | $30/seat | Shared policies, centralized billing |

**Official URL:** https://windsurf.com/pricing  
**Verification Date:** May 2026  
**Notes:** Windsurf's audit rule is identical in structure to Copilot — if a team is running both Cursor and Windsurf concurrently, that's direct redundancy. The engine flags Windsurf as the cheaper tool to decommission when overlap is detected.

---

## v0 (Vercel)

| Plan | Monthly Price | Notes |
|---|---|---|
| Free | $0 | Limited generations |
| Pro | $20/mo | Unlimited generations, design-to-code export |
| Enterprise | Custom | Team workspace controls, shared design tokens |

**Official URL:** https://v0.dev  
**Verification Date:** May 2026  
**Notes:** v0 is a specialized generative UI tool (React/shadcn components). Less likely to overlap with the standard audit tools, but included for teams with active design-engineering workflows.

---

## OpenAI API

| Tier | Approximate Monthly Spend | Rate Limits |
|---|---|---|
| Tier 1 | $0–$100 | Low RPM, daily token limits |
| Tier 2 | $100–$250 | Higher limits after $100 cumulative spend |
| Tier 3 | $250–$500 | Further expanded |
| Tier 4 | $500–$1,000 | Higher organizational quotas |
| Tier 5 | $1,000+ | Enterprise-level throughput |

**Official URL:** https://platform.openai.com/docs/guides/rate-limits  
**Verification Date:** May 2026  
**Notes:** OpenAI API is usage-based (per token). The tiers above describe spend thresholds that unlock higher rate limits, not fixed plan prices. For the audit catalog, representative spend buckets are used ($100, $250, $500, $1,000/mo). The API caching recommendation (Rule F) estimates 20% token savings via semantic caching — a widely-cited figure from OpenAI's own documentation on prompt caching.

---

## Anthropic API

| Tier | Approximate Monthly Spend | Notes |
|---|---|---|
| Tier 1 | $0–$100 | Pay-as-you-go, lower throughput |
| Tier 2 | $100–$250 | Higher limits |
| Tier 3 | $250–$500 | Expanded organization quotas |

**Official URL:** https://docs.anthropic.com/en/api/rate-limits  
**Verification Date:** May 2026  
**Notes:** Same model as OpenAI API — pay-per-token usage with rate limits that scale with cumulative spend. The caching recommendation applies equally here. Anthropic also offers explicit prompt caching on their API (cached tokens cost ~10% of the input token price), which is an additional optimization path not currently modeled in the engine.

---

## Pricing Data Confidence Notes

The pricing data in `pricing.ts` is best-effort current as of May 2026. AI tool pricing changes frequently — Claude has repriced its plans twice in the last 18 months, and ChatGPT's Team plan pricing changed when they launched the 2-seat minimum. 

For a production version of this product, pricing data should be:
1. Stored in the database (not hardcoded in source)
2. Refreshed via a scheduled scraper or vendor API where available
3. Flagged with a "last verified" timestamp visible to users in the audit output

The current hardcoded approach works for an MVP but would need to be replaced before real organizations rely on the savings estimates for financial decisions.
