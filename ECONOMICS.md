# Auto Audit — Unit Economics and Revenue Model

This document uses spreadsheet-style reasoning to estimate what it would take to build a financially viable product from the Auto Audit MVP. All numbers are explicit assumptions — not projections.

---

## What the Product Does Financially

Auto Audit surfaces SaaS cost savings for startups. The business model is **freemium lead generation**: the audit tool is free, and the backend captures the email of anyone who wants their report delivered. The lead list is the asset.

Two potential monetization paths:

**Path A: Paid SaaS (self-serve)**  
Charge for advanced features — IdP integrations, scheduled audits, multi-department reports, export to PDF/CSV.

**Path B: Marketplace / Consulting Referrals**  
Recommend SaaS management vendors (Torii, Productiv, Zluri) or IT consultants on the back of the audit report. Take a referral fee or a rev-share.

The economics below model Path A (subscription SaaS), since it's more predictable.

---

## Funnel Assumptions

| Stage | Number | Assumption |
|---|---|---|
| Monthly website visitors | 2,000 | Realistic after 3–4 months of community posting |
| Audit form completion rate | 25% | 500 audits/mo — the form is short, low friction |
| Email capture rate (post-audit) | 20% | 100 leads/mo — the savings hook should convert ~1 in 5 |
| Free → Paid conversion | 3% | 3 new paid customers/mo — standard SaaS self-serve benchmark |
| Monthly paid plan price | $49/mo | One-person startup tier — reasonable for demonstrated savings |
| Annual churn rate | 40% | High — these are cost-sensitive founders who may cancel if they've optimized |

These are conservative. The email capture rate might be higher if the savings number is compelling (a report showing $500/mo in savings should convert well above 20%). The free→paid conversion of 3% is a commonly cited SaaS benchmark for self-serve, and might be higher given the product has demonstrated concrete monetary value.

---

## Monthly Revenue Model

```
Month 1:   3 new paid × $49 = $147/mo MRR
Month 6:   ~15 cumulative paid (with churn) → ~$735 MRR
Month 12:  ~30 cumulative paid → ~$1,470 MRR
Month 18:  ~55 cumulative paid → ~$2,695 MRR
Month 24:  ~85 cumulative paid → ~$4,165 MRR
```

At this growth rate, the product is generating ~$50K ARR by end of year 2. Not $1M ARR, but a fundable signal if acquisition is accelerating.

---

## What Needs to Change to Hit $1M ARR

$1M ARR = ~$83,333 MRR = ~1,700 paid customers at $49/mo.

At 3% free→paid conversion and 500 audits/month, getting to 1,700 paid customers requires either:
- 10× the audit volume (5,000 audits/month) with the same conversion, or
- Higher ACV with an enterprise tier, or
- A conversion rate improvement via outbound

### Realistic path to $1M ARR:

**Option 1: Move upmarket (higher ACV)**  
Current: $49/mo self-serve for founders  
Target: $299/mo for teams with 10–50 employees, IdP integrations, monthly automated audits, Slack bot

If 10% of users are enterprise-grade and paying $299/mo, you need ~280 enterprise customers. That's achievable with a sales assist motion (targeted outreach to ops leads at Series A startups who actually care about cost control).

**Option 2: Referral/marketplace model**  
SaaS management tools (Torii, Productiv) pay $200–500 per qualified lead. If Auto Audit captures 100 leads/month and converts 15% to a managed SaaS platform referral, that's 15 referrals × $300 = $4,500/mo from referrals alone without any paid tier.

**Option 3: Raise and grow**  
Raise $300–500K pre-seed on the strength of lead capture and demonstrated savings. Use capital to hire one sales/marketing person, run LinkedIn/X paid campaigns targeting ops leads, and 3–5× the acquisition rate. At that point the unit economics start to compound.

---

## CAC Estimation

At zero paid acquisition (community + content):
- Time cost: ~10 hours/week on community engagement
- Opportunity cost: ~$0 if this is a side project
- Estimated CAC: **$0 cash** (founder time)

At minimal paid acquisition (small X/Reddit ad budget):
- Budget: $500/month
- Expected signups: 200 (at $2.50 per click, 10% signup rate)
- Email leads: 40 (20% of signups)
- Paid conversions: 1.2 (3% of leads)
- Cash CAC: $500 / 1.2 = **~$417 per paid customer**

**LTV at $49/mo with 40% annual churn:**  
Average customer life = 1 / (40%/12) = 30 months  
LTV = $49 × 30 = **$1,470**

LTV:CAC = 1,470 / 417 = **3.5×** — acceptable for self-serve SaaS (3:1 is the benchmark).

---

## Lead Value Assumptions

Not every lead converts to a paid SaaS customer. But leads have independent value:

| Lead Source | Lead Value (conservative) |
|---|---|
| Email lead who completed an audit showing >$200/mo savings | $15–25 (referral bait, high intent) |
| Email lead showing $50–200/mo savings | $5–10 |
| Email lead showing <$50/mo savings | $1–3 |

If a SaaS management platform (like Torii or Productiv) wants to pay for warm leads of founders who have identified software cost waste, the referral value increases to $50–150 per lead.

At 100 email leads/month and $10 average lead value, that's **$1,000/month in lead value** regardless of paid conversion — which covers basic infrastructure costs immediately.

---

## Infrastructure Cost (Current)

| Service | Monthly Cost |
|---|---|
| Vercel Pro | $20/mo |
| Supabase Free Tier | $0 (up to 500MB storage, 2GB bandwidth) |
| Gemini API | ~$0.60/mo at current audit volume |
| Resend Free Tier | $0 (3,000 emails/month) |
| **Total** | **~$20/mo** |

The infrastructure cost is effectively zero at MVP scale. Supabase's free tier covers this product well into thousands of users. The first meaningful cost hit is if monthly email volume exceeds 3,000 (Resend Pro is $20/mo for higher volume) or if Supabase storage grows past the free limit.

---

## Key Assumptions That Could Be Wrong

1. **3% free→paid conversion** is an industry average. For a tool showing $300/mo in savings, it could be 8–10% — founders will pay $49/mo for a tool that saves them $300/mo. Or it could be 1% if users don't trust the estimates enough to pay.

2. **40% annual churn** might be optimistic (it could be higher). If founders run one audit, fix the obvious waste, and then don't see ongoing value, churn could hit 70%+. This is the biggest risk — the product needs scheduled audits and monitoring to retain users past month 3.

3. **Audit volume of 500/month** requires consistent community engagement or some amount of viral spreading via shareable reports. If neither works, audit volume stays at 50–100/month and the economics don't get to a fundable state.

4. **$49/mo price point** is assumed but untested. The actual price sensitivity of a cost-conscious founder who just found $300/mo in waste is unknown. They might pay $99/mo for automation, or they might not pay anything if the free audit already gave them everything they needed.
