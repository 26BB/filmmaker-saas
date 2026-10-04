# 🧠 AGENTS_MEMORY.md — FilmDrop Continuous Learning & Memory Log

> **Evolving Knowledge Base & System Memory**: Records operational heuristics, lessons learned, architectural decisions, and subagent collaboration rules across all development sessions.

---

## 🏛️ System Operational Rules & Memory

### 1. The "Agent Hub Office" Architecture (`docs/AGENTS_HUB.md`)
- **Requirement**: Every session involving multiple subagents (e.g. builders, QA testers, backend testers, code bug fixers) **MUST** maintain and update `docs/AGENTS_HUB.md`.
- **Function**:
  - Acts as the persistent shared blackboard across subagents to overcome isolated context amnesia.
  - Maintains real-time subagent rosters, conversation IDs, domain ownership, and live task boards.
  - Houses the timestamped **Inter-Agent Message Log & Protocol** to record decisions, test pass/fails, and bug handoffs.
- **Workflow Loop**:
  `Builders generate code` ➡️ `Notify Hub & Testers` ➡️ `QA & Backend Testers audit & log defects` ➡️ `Code Bug Fixer patches issues` ➡️ `Testers re-verify & sign off` ➡️ `Coordinator commits & records in Hub`.

---

## 🛠️ Hard-Learned Lessons & Heuristics (Session History)

### Session: 2026-10-04 (Initial Architecture & Backend/Frontend Scaffolding)
1. **Cloudflare Stream JWT Signing**:
   - **Do NOT** use `jsonwebtoken` in the Next.js runtime if uninstalled; use native `jose` (`SignJWT` and `importJWK`).
   - Cloudflare Stream signed tokens **require** the Key ID (`kid`) in the protected header: `.setProtectedHeader({ alg: 'RS256', kid: SIGNING_KEY_ID })`.
   - Always `await generateSignedStreamToken()` because `jose` operates via async Web Crypto APIs.

2. **Database Migrations & OAuth Idempotency**:
   - Supabase user creation triggers (`handle_new_user()`) must always include `ON CONFLICT (id) DO NOTHING` to prevent fatal trigger crashes on OAuth re-signups or webhook duplicate events.
   - All financial split calculations must maintain zero-cent leakage (`Math.round(amount * 0.15)` and `payout = amount - platform_fee`).

3. **Next.js 15 App Router Best Practices**:
   - Configure `outputFileTracingRoot` in `next.config.ts` when operating in monorepos or nested workspaces to silence workspace root inference warnings.
   - Keep client vs server component boundaries strict (`'use client'`).

4. **Frontend & Accessibility (WCAG)**:
   - For movie card grids, never wrap both the poster container and title in duplicate accessible links. Use `aria-hidden="true"` and `tabIndex={-1}` on decorative/artwork image wrappers.
   - Always supply fallback badges for unpriced / free-tier media.

5. **Windows / PowerShell Tool Execution**:
   - On Windows shells, avoid Bash `&&` operators. Use `;` or separate sequential command executions.

---

## 📈 Continuous Evolution Protocol
- After every feature, bug fix, or testing cycle, agents must append new learnings, solved edge cases, and architectural constraints to this memory log.
