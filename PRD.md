# Poetry Hub — Product Requirements Document

**Version:** 3.0.0  
**Date:** 2026-03-12  
**Status:** Active Development

---

## 1. Product Overview

Poetry Hub is a dedicated poetry discovery and engagement platform that aggregates classic and contemporary poetry, providing AI-powered literary analysis, curated collections, and community interaction features. It addresses the declining readership problem by creating a central hub for poetry lovers.

---

## 2. Feature List & Completion Status

### Core Features (Shipped — v1.0)
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

### v2.0 Features (Shipped)
- ✅ **Mobile Navigation** — Hamburger menu with full nav, search, and account access on mobile
- ✅ **Poem of the Day** — Deterministic daily poem selection on homepage
- ✅ **Collections Page** — Full UI for browsing public collections and managing personal ones
- ✅ **Reading History Page** — Dedicated page to review recent reading activity
- ✅ **Dark Mode** — System-aware dark/light theme toggle with localStorage persistence
- ✅ **Enhanced Footer** — Updated with links to all new pages and features

### v3.0 Features (New — 2026-03-12)
- ✅ **Text-to-Speech** — Listen to poems read aloud using Web Speech API with play/pause/stop controls
- ✅ **Copy Poem to Clipboard** — One-click copy of full poem text with attribution
- ✅ **Font Size Controls** — Adjustable reading font size (Small/Medium/Large/XL) on poem detail
- ✅ **Add to Collection from Poem** — Quick-add poems to any personal collection via dropdown on poem detail
- ✅ **Pagination on Discover** — Load-more pagination (12 per page) for scalable poem browsing
- ✅ **Dynamic SEO Page Titles** — Per-page document titles for improved SEO and tab clarity
- ✅ **Error Boundary** — Global error boundary catches crashes and shows friendly recovery UI
- ✅ **Scroll to Top** — Automatic scroll-to-top on route navigation
- ✅ **404 Page Redesign** — Design-token-compliant, themed 404 page with navigation
- ✅ **SEO Meta Tags** — OG meta tags, Twitter cards, and meta descriptions in index.html
- ✅ **Google Fonts** — Crimson Text (serif) and Inter (sans) loaded from Google Fonts CDN

### Future Roadmap (P2/P3)
- 🔲 Social sharing with per-poem OG meta tags (dynamic server-side rendering)
- 🔲 Gamified feedback system (feedback tokens, quality scores)
- 🔲 AI-powered content moderation (human-authored verification badges)
- 🔲 Virtual workshop module with structured feedback sessions
- 🔲 Micro-payment/tip support for poets
- 🔲 User-submitted original poetry
- 🔲 Push notifications for daily poem
- 🔲 Password reset flow
- 🔲 Infinite scroll as alternative to load-more
- 🔲 Print-friendly poem view
- 🔲 Keyboard navigation and ARIA audit

---

## 3. User Stories

### Discovery
- As a reader, I can browse featured poems on the homepage so I can find popular works.
- As a reader, I can see a "Poem of the Day" that changes daily so I have a reason to return.
- As a reader, I can search poems by title, poet, or content to find specific works.
- As a reader, I can use AI search when standard search fails to discover new poems.
- As a reader, I can browse poems by theme to explore specific literary topics.
- As a reader, I can discover a random poem for serendipitous exploration.
- As a reader, I can load more poems on the Discover page without page reloads.

### Engagement
- As a reader, I can favorite poems to build my personal collection.
- As a reader, I can view my reading history to revisit poems I've read.
- As a reader, I can leave comments on poems to share my thoughts.
- As a reader, I can request AI analysis of any poem for deeper understanding.
- As a reader, I can listen to poems read aloud using text-to-speech.
- As a reader, I can copy the full poem text to my clipboard with one click.
- As a reader, I can adjust the font size for comfortable reading.

### Collections
- As a user, I can create named collections to organize poems by personal criteria.
- As a user, I can make collections public or private.
- As a user, I can add poems to my collections directly from the poem detail page.
- As a reader, I can browse public collections from the community.

### Account
- As a visitor, I can sign up with email and password.
- As a user, I can update my display name in my profile.
- As a user, I can sign out from any page via the header menu.

### Accessibility & UX
- As a mobile user, I can access all navigation via a hamburger menu.
- As a user, I can toggle between dark and light modes.
- As a user, I see descriptive page titles in my browser tab for each page.
- As a user, the page scrolls to the top when I navigate between pages.
- As a user, I see a friendly error page if something crashes instead of a blank screen.
- As a user, I see a well-designed 404 page if I visit a non-existent URL.

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
| TTS | Web Speech API (native browser) |
| Fonts | Google Fonts (Crimson Text, Inter) |
| Error Handling | React Error Boundary (class component) |

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
| `/discover` | Search & browse all poems (paginated) | No |
| `/poem/:id` | Poem detail with TTS, AI analysis, collections & comments | No |
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
- [x] SEO basics (semantic HTML, proper headings, meta tags)
- [x] Dynamic page titles
- [x] OG meta tags (base-level)
- [x] Error boundary component
- [x] Text-to-speech for poems
- [x] Copy poem to clipboard
- [x] Font size controls
- [x] Add to collection from poem detail
- [x] Pagination on Discover
- [x] Scroll to top on navigation
- [x] 404 page with design system
- [x] Google Fonts integration
- [ ] Per-poem OG meta tags (requires SSR)
- [ ] Performance audit (lazy loading, code splitting)
- [ ] Accessibility audit (ARIA labels, keyboard nav)
- [ ] Rate limiting on AI endpoints
- [ ] Password reset flow

---

## 9. Changelog

### v3.0.0 — 2026-03-12
- Added text-to-speech (Web Speech API) with play/pause/stop on poem detail
- Added copy-poem-to-clipboard with attribution
- Added adjustable font size (4 levels) on poem detail
- Added "Add to Collection" dropdown on poem detail page
- Added load-more pagination (12/page) to Discover page with result count
- Added dynamic document titles across all pages via usePageTitle hook
- Added global Error Boundary component wrapping entire app
- Added ScrollToTop component for auto-scroll on route changes
- Redesigned 404 page with proper design tokens and navigation
- Added base OG meta tags and Twitter cards to index.html
- Integrated Google Fonts (Crimson Text + Inter) via CDN

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
