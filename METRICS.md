# Auto Audit — Product Metrics

This document defines what to measure, how to measure it, and what numbers would trigger a product decision. These are not generic SaaS metrics — they're specific to an audit/lead-generation product.

---

## North Star Metric

**Audits with actionable savings generated per week**

Not "audits completed" (too broad — includes empty stacks with $0 savings). Not "users registered" (vanity). The North Star is specifically audits where the engine returned at least one recommendation with savings > $0. This measures whether the product is delivering value, not just being used.

A user who completes an audit and sees $0 in potential savings has been served, but they've confirmed their stack is clean — which is fine but doesn't represent the core value. The target user is someone who discovers they have waste.

**Target:** 50+ actionable audits/week by month 3.

---

## Input Metrics

These are the leading indicators that drive the North Star.

### Acquisition
| Metric | Description | Target (Month 3) |
|---|---|---|
| Weekly unique audit form visits | How many people reach the audit form | 400 |
| Audit completion rate | % who complete the full form and submit | >30% |
| Email capture rate (post-audit) | % who submit email after seeing results | >15% |
| Shareable report clicks | Unique visits to `/report/:id` URLs | Tracking >0 from organic sharing |

### Engagement
| Metric | Description | Target (Month 3) |
|---|---|---|
| Return audit rate | % of users who run a second audit | >10% |
| Report share rate | % of audits where the shareable link is generated | >20% |
| Dashboard view rate | % who view the analytics tab | >40% |

### Retention
| Metric | Description | Target |
|---|---|---|
| Day 7 retention | % of email leads who open the follow-up email | >25% |
| Month 1 account retention | % of registered users with >1 audit in month 1 | >15% |

### Revenue (if paid tier exists)
| Metric | Description |
|---|---|
| Lead→paid conversion | % of email leads who convert to paid within 30 days |
| MRR | Monthly recurring revenue from paid subscriptions |
| LTV:CAC | Customer lifetime value vs. acquisition cost |

---

## Instrumentation Strategy

The current codebase doesn't have analytics instrumentation. Here's the minimum needed:

**Frontend events to track:**

```javascript
// Landing page
track('audit_form_opened')

// Audit form
track('subscription_added', { toolId, planName, seats })
track('audit_submitted', { subscriptionCount, teamSize })

// Results dashboard
track('recommendations_viewed', { totalSavings, recCount })
track('shareable_link_generated', { publicId })
track('email_capture_started')
track('email_capture_completed')

// Public report
track('public_report_viewed', { publicId })
```

**Tool recommendation:** Plausible Analytics (privacy-friendly, GDPR-compliant, $9/mo) or PostHog self-hosted (free). Avoid Google Analytics — it adds GDPR complexity and is overkill for MVP metrics.

**Server events to log (already partially in place):**

The Express server logs `[API Audit Error]`, `[Resend Email Sent Successfully]`, etc. These should be structured logs (JSON) rather than plain strings to allow filtering in production log tooling (e.g., Logtail, Datadog, or even Vercel's built-in log viewer).

---

## Pivot Thresholds

These are the numbers that would signal the current product direction isn't working:

| Signal | Threshold | What It Means |
|---|---|---|
| Audit completion rate < 10% | After 4 weeks | The form is too long or confusing — simplify or add more guidance |
| Email capture rate < 5% | After 4 weeks | The savings output isn't compelling enough — check if $0 savings is common; improve recommendations |
| Report share rate = 0% | After 6 weeks | The shareable report isn't landing — rethink OG preview text or sharing UX |
| Day 7 email open rate < 10% | After first 50 leads | The email content isn't relevant — A/B test subject lines |
| North Star < 10/week | After 8 weeks | Either low traffic (acquisition problem) or low savings detection (engine problem) |

**If all three of these are simultaneously true:**
- Completion rate < 10%
- Email capture < 5%  
- Zero organic report shares

...then the fundamental value hypothesis isn't landing. The product needs a qualitative investigation (user interviews, session recordings) before further engineering investment.

---

## Realistic SaaS Benchmarks for This Product Type

| Metric | Industry Avg | Auto Audit Target |
|---|---|---|
| Free tool → email signup | 15–25% | 15–20% |
| Email open rate (transactional) | 40–60% | 50%+ (high because personalized) |
| Free → paid conversion (self-serve) | 2–5% | 3% |
| Monthly churn (paid) | 3–5% | 4% |
| Net Revenue Retention | 90–110% | ~95% (no upsell yet) |

The email open rate for transactional emails (not marketing blasts) is significantly higher than newsletter benchmarks. The Resend email sent post-audit includes the user's specific savings number in the subject line — that's a personal, high-relevance message. Open rates of 50%+ are realistic.

---

## What Good Looks Like at 90 Days

If the product is working:
- 200+ total audits completed
- 30+ email leads captured
- At least 5 shareable report URLs visible in the wild (Slack previews, Twitter embeds, etc.)
- At least one user who has run 3+ audits (indicates ongoing value, not just one-time use)
- Zero support issues about wrong savings calculations (validates engine accuracy)

If the product is not working:
- Audit completion rate under 15% (form friction problem)
- Median savings of $0 across all audits (engine not catching real patterns)
- No organic report shares (the distribution mechanic isn't working)
- No repeat users (product is being used as a one-shot tool, not retained)

---

## Notes on Measurement Limitations

**Self-reported data bias:** The audit engine works on user-provided subscription data. Users might underreport seats (embarrassed about the number) or overreport to see bigger savings numbers. There's no way to validate the input data currently. If this becomes a paid product, the discrepancy between claimed savings and actual billing data would need to be addressed.

**Anonymization makes aggregate analytics hard:** The public report endpoint anonymizes all company data. This means aggregate analysis of "what are the most common duplicate tool patterns" would need to happen from the raw `audits` table (server-side), not from the public-facing API.

**Session attribution is missing:** Currently there's no way to track which acquisition channel (Reddit post, HN, Twitter, etc.) drove a specific audit. UTM parameter tracking on the audit form URL would solve this and is a 2-hour implementation.
