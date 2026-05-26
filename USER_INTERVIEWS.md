# Auto Audit — User Interviews

Five conversations conducted before and during development to understand the problem space and validate (or challenge) the product assumptions. Summarized from notes.

---

## Interview 1: Aditya, ISE PRE- Final Year Student

**Context:** Friend who's a developer and has been freelancing since second year. Uses 3–4 AI tools regularly for coding projects and client work.

**The conversation:**

I asked him to walk me through what AI tools he's paying for. He listed: Cursor Pro ($20), ChatGPT Plus ($20), and "sometimes I add Claude Pro for a month when I need it."

When I asked if he ever felt like he was paying for the same thing twice, he paused. "Yeah, I've thought about this. Cursor already has Claude built in. But I like the ChatGPT interface for quick stuff. I keep them both because the UX is different."

I pushed — "But do you actually use both in the same workflow, or do you default to one?"

"If I'm being honest, I use Cursor 90% of the time. ChatGPT is just... habit. I've had it since GPT-3 and never thought about canceling it."

**Quote:** *"I know I'm probably overpaying but canceling things feels like more effort than just keeping them."*

**What he didn't like about the idea:** When I showed him a prototype of the audit form, he said the department field confused him. "I'm a solo developer. I don't have 'departments'. This feels like it's built for companies, not individuals."

**Impact on the product:** Added a "Solo Developer" option to the department dropdown and made it optional. Also added an explicit individual/freelancer use case pathway in the form wizard.

---

## Interview 2: Yasaswini, ISE PRE- Final Year Student

**Context:** College friend . Is currently working in a saas company as an intern.

**The conversation:**

She immediately got the product concept. "This is a SaaS rationalization problem."


When I walked her through the report output, she said the savings estimates looked plausible but she'd want to know where the numbers came from. "If I'm showing this to my CFO, she's going to ask how I know Claude Team bills a 5-seat minimum. I need a source."

**Quote:** *"The product is solving a real problem but you need to be credible on the numbers. Finance people will check your math."*

**Impact on the product:** Added the `PRICING_DATA.md` documentation with source URLs. Added the verification date to the pricing catalog. Added a note in the audit report UI showing the pricing data source.

**What surprised me:** She was the only person who asked about the data source unprompted. Developers didn't care about the methodology at all — they just wanted the output.

---

## Interview 3: Professor, Computer Science Department

**Context:** Faculty advisor I consulted briefly. He's run several academic research projects and manages a small lab with external funding.

**The conversation:**

He was skeptical from the start. "How do you know these tools are actually redundant? Cursor and GitHub Copilot serve different users in different parts of the workflow."

I explained the overlap detection: same department, same tool category, active seats for both. He pushed back: "A senior engineer might prefer Cursor for complex edits, and a junior might be fine with Copilot for basic autocomplete. That's not redundancy — that's different tool preferences."

This is a legitimate critique. The engine flags them as redundant, but in practice they might not be. I explained that the recommendations are surfaced as *potential* savings, not confirmed waste.

He seemed partially satisfied with that framing. "Okay, so it's a starting point for a conversation, not a definitive audit. That's fine. But you should make that clearer in the UI."

He also noted: "Academic institutions have site licenses and procurement processes. This tool isn't built for that context."

**Quote:** *"You're building a tool that generates hypotheses, not conclusions. Make sure the user understands the difference."*

**Impact on the product:** Updated recommendation cards to include the "reasoning" field prominently, so users see why the engine flagged something, not just what it flagged. Changed language from "eliminate" to "review" in several recommendation titles.

**Neutral/negative:** He didn't find the product personally useful and was clear that he wouldn't use it himself. "My lab purchases are committee decisions, not individual ones." Good signal that the target user is definitely a founder or ops person, not an academic.

---

