# Poetry Hub — Product Requirements Document

**Version:** 2.0.0  
**Date:** 2026-03-11  
**Status:** Active Development

---

## 1. Product Overview

Poetry Hub is a dedicated poetry discovery and engagement platform that aggregates classic and contemporary poetry, providing AI-powered literary analysis, curated collections, and community interaction features. It addresses the declining readership problem by creating a central hub for poetry lovers.

---

## 2. Feature List & Completion Status

### Core Features (Shipped)
- ✅ **Poem Discovery** — Browse, search, and filter poems by theme, poet, or keyword
- ✅ **Poet Profiles** — Detailed poet bios with full poem listings
- ✅ **Theme Browsing** — Explore poems organized by universal themes (Love, Nature, Philosophy, etc.)
- ✅ **Random Poem** — Serendipitous poem discovery with one-click refresh
- ✅ **AI Literary Analysis** — On-demand AI-powered analysis of themes, devices, and meaning
- ✅ **AI Search** — Intelligent poem search when standard search yields no results
- ✅ **User Authentication** — Email/password sign-up and sign-in with email verification
- ✅ **Favorites** — Save poems to a personal favorites list
- ✅ **Reading History** — Automatic tracking of poems read by logged-in users
- ✅ **Comments** — Leave and manage comments on poem detail pages
- ✅ **Collections** — Create, manage, and share curated poetry anthologies
- ✅ **Poet Analytics** — Engagement metrics and visualizations per poet
- ✅ **User Profiles** — Manage display name and account settings
- ✅ **Data Loader** — Bulk import poems and poets via CSV/ZIP

### v2.0 Features (New)
- ✅ **Mobile Navigation** — Hamburger menu with full nav, search, and account access on mobile
- ✅ **Poem of the Day** — Deterministic daily poem selection on homepage
- ✅ **Collections Page** — Full UI for browsing public collections and managing personal ones
- ✅ **Reading History Page** — Dedicated page to review recent reading activity
- ✅ **Dark Mode** — System-aware dark/light theme toggle with localStorage persistence
- ✅ **Enhanced Footer** — Updated with links to all new pages and features

### Future Roadmap (P2/P3)
- 🔲 Text-to-speech for poems
- 🔲 Social sharing with OG meta tags per poem
- 🔲 Gamified feedback system (feedback tokens, quality scores)
- 🔲 AI-powered content moderation (human-authored verification badges)
- 🔲 Virtual workshop module with structured feedback sessions
- 🔲 Micro-payment/tip support for poets
- 🔲 User-submitted original poetry
- 🔲 Push notifications for daily poem
- 🔲 Infinite scroll / pagination on Discover

---

## 3. User Stories

### Discovery
- As a reader, I can browse featured poems on the homepage so I can find popular works.
- As a reader, I can see a "Poem of the Day" that changes daily so I have a reason to return.
- As a reader, I can search poems by title, poet, or content to find specific works.
- As a reader, I can use AI search when standard search fails to discover new poems.
- As a reader, I can browse poems by theme to explore specific literary topics.
- As a reader, I can discover a random poem for serendipitous exploration.

### Engagement
- As a reader, I can favorite poems to build my personal collection.
- As a reader, I can view my reading history to revisit poems I've read.
- As a reader, I can leave comments on poems to share my thoughts.
- As a reader, I can request AI analysis of any poem for deeper understanding.

### Collections
- As a user, I can create named collections to organize poems by personal criteria.
- As a user, I can make collections public or private.
- As a reader, I can browse public collections from the community.

### Account
- As a visitor, I can sign up with email and password.
- As a user, I can update my display name in my profile.
- As a user, I can sign out from any page via the header menu.

### Accessibility
- As a mobile user, I can access all navigation via a hamburger menu.
- As a user, I can toggle between dark and light modes.

---

## 4. Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | React 18 + TypeScript |
| Build | Vite |
| Styling | Tailwind CSS + shadcn/ui |
| State | TanStack React Query |
| Routing | React Router v6 |
| Backend | Lovable Cloud (Supabase) |
| Auth | Lovable Cloud Auth (email/password) |
| AI | Lovable AI (Gemini / GPT models) |
| Charts | Recharts |
| Icons | Lucide React |

---

## 5. Database Schema

| Table | Purpose |
|-------|---------|
| `poems` | Core poem content (title, body, views, favorites) |
| `poets` | Poet profiles (name, bio, birth/death year, nationality) |
| `themes` | Poetry themes/categories |
| `poem_themes` | Many-to-many poem↔theme mapping |
| `profiles` | User display names |
| `favorites` | User poem favorites |
| `reading_history` | User reading activity log |
| `comments` | User comments on poems |
| `collections` | User-created poem collections |
| `collection_poems` | Many-to-many collection↔poem mapping |

---

## 6. Pages & Routes

| Route | Page | Auth Required |
|-------|------|:---:|
| `/` | Homepage (Hero, POTD, Featured, Themes) | No |
| `/discover` | Search & browse all poems | No |
| `/poem/:id` | Poem detail with AI analysis & comments | No |
| `/poet/:id` | Poet profile with poem list | No |
| `/poet/:id/analytics` | Poet engagement analytics | No |
| `/poets` | Browse all poets | No |
| `/themes` | Browse all themes | No |
| `/collections` | Browse & manage collections | No (manage requires auth) |
| `/random` | Random poem discovery | No |
| `/favorites` | Personal favorites | Yes |
| `/reading-history` | Reading history | Yes |
| `/profile` | Account settings | Yes |
| `/auth` | Sign in / sign up | No |
| `/data-loader` | CSV/ZIP data import | No |

---

## 7. Monetization Strategy (Planned)

- **Freemium Model**: Core reading & discovery free; premium features gated
- **Premium Features** (future): Unlimited AI analysis, advanced collections, export, ad-free
- **Micro-tips** (future): Reader-to-poet micro-payments

---

## 8. Launch Checklist

- [x] Core poem CRUD and display
- [x] Search (standard + AI)
- [x] User authentication
- [x] Favorites & reading history
- [x] Comments system
- [x] Collections management
- [x] Poet profiles & analytics
- [x] Mobile-responsive navigation
- [x] Dark mode support
- [x] Poem of the Day
- [x] SEO basics (semantic HTML, proper headings)
- [ ] OG meta tags per poem page
- [ ] Error boundary components
- [ ] Performance audit (lazy loading, code splitting)
- [ ] Accessibility audit (ARIA labels, keyboard nav)
- [ ] Rate limiting on AI endpoints

---

## 9. Changelog

### v2.0.0 — 2026-03-11
- Added mobile hamburger menu navigation
- Added Poem of the Day to homepage
- Added Collections page with create/delete/browse
- Added Reading History page
- Added dark mode toggle with system preference detection
- Updated header with Collections and Reading History links
- Updated footer with all new page links
- Created PRD.md

### v1.0.0 — Initial Release
- Poem discovery, search, and browsing
- Poet profiles and theme browsing
- AI literary analysis and AI search
- User authentication, favorites, comments
- Collections (backend), reading history (backend)
- Poet analytics dashboard
- Data loader for bulk import
