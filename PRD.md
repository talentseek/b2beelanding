> Project Description (from initializer):
> A landing page for b2bee.ai an ai automation agency that creates automations (called bees) that assist small businesses with various tasks for instance automating social media or automating sales outreach. EOF\
# Product Requirements Document (PRD)
> Fill this out before sprint planning. Keep it concise but actionable.

## 1) Working Title
<Your project/product name>
## 2) Executive Summary
## 3) Problem Statement
## 4) Goals & Non-Goals
## 5) Users & Personas
## 6) Core Use Cases / User Journeys
## 7) Scope & Feature List (MVP)
## 8) Architecture Overview (Tech Stack)
- Frontend: Next.js (App Router, TS, Tailwind, shadcn/ui)
- Auth: Clerk
- Backend: Route Handlers
- DB/ORM: PostgreSQL + Prisma
- Infra: Vercel (or similar)
## 9) Data Model (first pass)
```prisma
model User {
  id        String   @id @default(cuid())
  email     String   @unique
  createdAt DateTime @default(now())
}
```
## 10) Pages & Routes
## 11) API Contracts
## 12) Security / Privacy
## 13) Analytics
## 14) Milestones
## 15) Acceptance Criteria
