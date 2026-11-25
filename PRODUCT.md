# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Stack

Static HTML/CSS/JS, no build step. Published from `main` (site: https://nimrodv10-arch.github.io/nimrod-showcase/). Shared effects live in `assets/sc-fx.css`, `assets/sc-fx.js` and `assets/funnel-field.js`.

## Users

Primary: recruiters and hiring managers in Israel who reach the site from Nimrod's LinkedIn profile or CV, usually on a phone, with about a minute to spare. Secondary: small-business owners who might hire him for AI-built tools. (Priority delegated by Nimrod on 25.11.2026: "apply what fits me best".)

## Product Purpose

Prove that Nimrod (performance marketing, data analytics, business operations; ex-Ryze Beyond Growth Manager) builds real, working systems with Claude, not just prompts or simple landing pages. Success: a visitor understands this within a minute, then messages him on LinkedIn or downloads the CV.

## Positioning

A marketer who owned revenue and profitability who designs and ships his own data tools and AI agents. Each tool comes from a real problem he had at work or at home, and the Interview OS case study shows scheduled agents, Skills, connectors and a scoring model he uses daily.

## Operating Context

Visitors arrive from LinkedIn Featured, the CV, or a link sent before an interview. In interviews Nimrod walks through the case study page section by section. Pages are opened on phones first, desktops second.

## Capabilities and Constraints

- Hebrew, RTL, is the main language; no English page (removed 25.11.2026; `tools/nimrod-vassal/` redirects home).
- All tools run on sample or synthetic data. Real personal data (job pipeline, contacts, company names) never appears.
- Every career fact must match the official CV (v9, 24.11.2026). No partner or employer-client names, no "comparison-site" framing, no P&L Manager title.
- Departure from Ryze is never framed as a layoff.
- CV download: `assets/Nimrod_Vassal_CV.pdf` = official CV without the phone number. Tailored CVs are sent only with applications.
- Motion must respect `prefers-reduced-motion`; nothing animates on repeat views beyond one-time entrances.

## Brand Commitments

Font Rubik; navy ink (not black); Nimrod design system tokens (artifact "Nimrod"). No emoji icons, no gamification, no invented numbers or testimonials.

## Evidence on Hand

- Interview OS real usage as of 25.11.2026: 96 jobs, 66 filtered with a reason, 3 scheduled agents (Job Radar, daily mail scan, next-day interview prep), scoring model v3.
- CV v9 facts: $1.5M+ monthly paid budget (gaming), websites grown 2–4x, SaaS vertical tripled revenue in 3 months, tier-based partner deal ~4x volume in a quarter, A/B tests across up to 7 websites, 30+ Google Ads accounts at Albert AI.
- Screenshots in `assets/*.webp`; demos in `tools/*/` with sample data.
- Absent, must not be fabricated: testimonials, client logos, user counts for the public tools.

## Product Principles

1. Show the working thing before describing it.
2. Every number is real and dated; anything else is labelled sample data.
3. One clear next step per screen: talk to me, or take the CV.
4. Specific over generic: if another candidate could write the sentence, rewrite it.
5. Privacy first: the public site never exposes the real pipeline or contacts.

## Accessibility & Inclusion

Phone-first: text at least 14px, tap targets at least 44px, no horizontal scroll at 375px. Mixed Hebrew/English and numbers wrapped for correct bidi order.
