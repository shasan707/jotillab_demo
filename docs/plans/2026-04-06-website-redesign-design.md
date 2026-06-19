# Jotil Labs Website Redesign — Design Document

**Date**: 2026-04-06
**Status**: Approved
**Author**: Design session with user

---

## Overview

Full redesign of jotillabs.com from React+Vite SPA to Next.js 15 App Router static site. Consolidating 11 products into 5 branded products (JotilReceptionist, JotilMessenger, JotilOutreach, JotilSpace, JotilFlow). Adding individual product pages, blog (MDX), use cases page, interactive demos, and unified AI widget (Anam avatar + Vercel AI chat + Retell voice).

## Tech Stack

| Layer | Choice |
|---|---|
| Framework | Next.js 15 (App Router, static generation) |
| Styling | Tailwind CSS v4 + CSS variables |
| Fonts | Outfit (headings/brand) + Inter (body) + JetBrains Mono (accents) |
| Animation | Framer Motion + CSS keyframes |
| Icons | Lucide React |
| Blog | MDX + next-mdx-remote + gray-matter |
| Charts | Recharts |
| SEO | Next.js Metadata API + next-sitemap + JSON-LD |
| Analytics | Google Analytics 4 + Vercel Analytics |
| Avatar | Anam SDK |
| Chat | Vercel AI SDK |
| Voice | Retell SDK (placeholder) |
| CI/CD | GitHub Actions + Vercel auto-deploy |
| Deployment | Vercel |

## Product Structure

| Product | Badge | Contains | Value Prop |
|---|---|---|---|
| JotilReceptionist | Inbound Voice | AI Phone Receptionist + AI Web Voicebot | AI front desk — answers, qualifies, routes calls 24/7 |
| JotilMessenger | Inbound Text | AI Web Chatbot + SMS Texting Agent | Conversational AI across web chat, SMS, WhatsApp |
| JotilOutreach | Outbound | Automated Calls + Automated SMS | AI-powered outbound campaigns at scale |
| JotilSpace | Multi-AI Platform | AI CRM + Smart Ticketing + AI Calendar | Unified AI workspace for teams |
| JotilFlow | Automation | AI Automation + AI Consultancy | Custom workflow automation engine |

## Site Map

```
/                          Homepage
/products                  Products Overview
/products/receptionist     JotilReceptionist
/products/messenger        JotilMessenger
/products/outreach         JotilOutreach
/products/space            JotilSpace
/products/flow             JotilFlow
/use-cases                 Use Cases & Industry Solutions
/about                     About Jotil Labs
/blog                      Blog listing
/blog/[slug]               Individual blog post
/contact                   Contact & Demo Request
/terms                     Terms & Conditions
/privacy                   Privacy Policy
/opt-in                    Opt-In Consent
```

## Design System

- Primary Blue: #3B7BF2
- Dark Blue: #1B4FBA
- Accent Blue: #2D6AE0
- Light Blue BG: #F0F4FF
- Page BG: #FAFBFD to #FFFFFF
- Text: #111111 primary, #999999 secondary
- Cards: White, 1px border rgba(0,0,0,0.05), 20px radius
- Buttons: Solid blue primary, outlined secondary, 10-12px radius
- Animations: Scroll reveal 20px/500ms, hover lift -2px, stagger 80ms, page fade 200ms
- Logo hex animations carried from brand HTML into React SVG components

## Key Decisions

- Evolving existing repo (not clean start)
- MDX blog in repo (no external CMS)
- Unified widget: Anam avatar + Vercel AI chat + Retell voice in one panel
- Placeholder content for case studies, team bios, testimonials
- Keep existing company info: contact@jotillabs.com, Lehi Utah
- Favicon and OG images updated to new hex brand
- SEO-first: static generation, structured data, sitemap, meta tags

## Contact Info (preserved)
- Email: contact@jotillabs.com
- Location: Lehi, Utah
- Git remote: https://github.com/Jotil-Labs/jotil_labs_website.git
