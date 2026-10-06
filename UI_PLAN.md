# UI Redesign Plan - "Aurora Bento" (Campus Connect)

## Architectural & Design Overview
Redesigning the frontend user interface for **Campus Connect** using the **Aurora Bento** design language (inspired by Linear, Vercel, Notion, Stripe, and Apple). The backend routes, controllers, Mongoose models, session handling, validation, EJS variables, form submission actions, and AJAX endpoints remain 100% intact.

---

## Allowed Files to Edit / Create

### 1. Global Stylesheets & Scripts
- [`public/css/style.css`](file:///d:/Campus%20Connect/public/css/style.css): Complete Design System with Light/Dark CSS variables, Aurora mesh backgrounds, glassmorphism, responsive bento grids, custom scrollbars, typography clamps, category badge tokens.
- [`public/css/animations.css`](file:///d:/Campus%20Connect/public/css/animations.css): Micro-interactions, spotlight effects, View Transitions, page load reveals, floating cards, pulse keyframes, skeleton shimmer.
- [`public/js/theme.js`](file:///d:/Campus%20Connect/public/js/theme.js): Instant theme switcher script (prevents theme flash on reload).
- [`public/js/main.js`](file:///d:/Campus%20Connect/public/js/main.js): Main client orchestration (command palette keyboard listener `Ctrl+K` & `/`, navbar sliding active pill, view transitions fallback, form enhancements).
- [`public/js/modules/`](file:///d:/Campus%20Connect/public/js/modules):
  - `spotlight.js`: Radial hover glow `--mx`/`--my` logic on bento cards.
  - `command-palette.js`: Centered modal with search filter, keyboard shortcuts, live search results.
  - `counters.js`: IntersectionObserver count-up numbers for stat tiles.
  - `tilt.js`: Subtle 3D tilt interaction for landing feature cards.
  - `toast.js`: Toast notification queue and animated dismissals.
  - `ripple.js`: Button click ripple & shine sweep micro-interactions.
  - `charts.js`: Hand-built SVG responsive charts (Line, Bar, Donut) with draw animations for Admin Panel.
  - `stepper.js`: Multi-step form animation for Signup page.
  - `onboarding.js`: Dismissible 3-step spotlight tour for first-time dashboard visitors.

---

## 2. Layouts & Shared Partials (`views/partials/`)
- [`views/partials/head.ejs`](file:///d:/Campus%20Connect/views/partials/head.ejs): Added preconnect fonts (Plus Jakarta Sans & Inter), Bootstrap Icons, Theme flash script.
- [`views/partials/layout.ejs`](file:///d:/Campus%20Connect/views/partials/layout.ejs): Shell container with floating navbar, announcement bar, toast container, footer, and bottom navigation.
- [`views/partials/navbar.ejs`](file:///d:/Campus%20Connect/views/partials/navbar.ejs): Floating glass navbar, sliding link indicator, search trigger, theme toggle (sun/moon), notification preview dropdown, user avatar.
- [`views/partials/command_palette.ejs`](file:///d:/Campus%20Connect/views/partials/command_palette.ejs): Global modal overlay with live AJAX search, search group tabs, keyboard nav.
- [`views/partials/bottom_nav.ejs`](file:///d:/Campus%20Connect/views/partials/bottom_nav.ejs): Mobile bottom navigation bar for small screens (<768px).
- [`views/partials/footer.ejs`](file:///d:/Campus%20Connect/views/partials/footer.ejs): Multi-column layout with hairline top border, social icons, system status badge.
- [`views/partials/flash.ejs`](file:///d:/Campus%20Connect/views/partials/flash.ejs): Upgraded glass alerts with animated icons.

---

## 3. Page Views

### Landing & Static Views (`views/public/`)
- [`views/public/landing.ejs`](file:///d:/Campus%20Connect/views/public/landing.ejs): State-aware hero section, product preview widget, 4 stat tiles with sparklines, 6-tile Bento Grid, scroll storytelling "How it works", marquee strip, FAQ accordion, final CTA banner.
- [`views/public/about.ejs`](file:///d:/Campus%20Connect/views/public/about.ejs): Platform mission, bento feature highlights.
- [`views/public/contact.ejs`](file:///d:/Campus%20Connect/views/public/contact.ejs): Support ticket form with styled floating inputs.
- [`views/public/styleguide.ejs`](file:///d:/Campus%20Connect/views/public/styleguide.ejs): Showcasing the design system tokens, typography, components.

### Authentication Views (`views/auth/`)
- [`views/auth/login.ejs`](file:///d:/Campus%20Connect/views/auth/login.ejs): Split layout with aurora gradient side panel & glass mock preview; floating input labels, soft error shake.
- [`views/auth/signup.ejs`](file:///d:/Campus%20Connect/views/auth/signup.ejs): 3-step interactive signup wizard with step progress line and password strength meter.
- [`views/auth/forgot.ejs`](file:///d:/Campus%20Connect/views/auth/forgot.ejs): Clean password reset request card.
- [`views/auth/reset.ejs`](file:///d:/Campus%20Connect/views/auth/reset.ejs): Clean new password form.

### Dashboard (`views/dashboard/`)
- [`views/dashboard/index.ejs`](file:///d:/Campus%20Connect/views/dashboard/index.ejs): 12-column Bento Grid student dashboard with time greeting, progress ring, today's schedule, notice stream, event cards, study hub rows, activity timeline, skeleton shimmers, and first-time onboarding spotlight tour.

### Content Lists & Details
- **Notices**: [`views/notices/index.ejs`](file:///d:/Campus%20Connect/views/notices/index.ejs), [`views/notices/detail.ejs`](file:///d:/Campus%20Connect/views/notices/detail.ejs)
- **Events**: [`views/events/index.ejs`](file:///d:/Campus%20Connect/views/events/index.ejs), [`views/events/detail.ejs`](file:///d:/Campus%20Connect/views/events/detail.ejs)
- **Study Hub**: [`views/resources/index.ejs`](file:///d:/Campus%20Connect/views/resources/index.ejs), [`views/resources/upload.ejs`](file:///d:/Campus%20Connect/views/resources/upload.ejs)
- **Community**: [`views/community/index.ejs`](file:///d:/Campus%20Connect/views/community/index.ejs), [`views/community/detail.ejs`](file:///d:/Campus%20Connect/views/community/detail.ejs), [`views/community/create.ejs`](file:///d:/Campus%20Connect/views/community/create.ejs)
- **Groups**: [`views/groups/index.ejs`](file:///d:/Campus%20Connect/views/groups/index.ejs), [`views/groups/detail.ejs`](file:///d:/Campus%20Connect/views/groups/detail.ejs)
- **Profile**: [`views/profile/index.ejs`](file:///d:/Campus%20Connect/views/profile/index.ejs), [`views/profile/view.ejs`](file:///d:/Campus%20Connect/views/profile/view.ejs)
- **Notifications**: [`views/notifications/index.ejs`](file:///d:/Campus%20Connect/views/notifications/index.ejs)
- **Search**: [`views/search/index.ejs`](file:///d:/Campus%20Connect/views/search/index.ejs)
- **Errors**: [`views/errors/404.ejs`](file:///d:/Campus%20Connect/views/errors/404.ejs), [`views/errors/500.ejs`](file:///d:/Campus%20Connect/views/errors/500.ejs)

### Admin Panel (`views/admin/`)
- [`views/admin/overview.ejs`](file:///d:/Campus%20Connect/views/admin/overview.ejs): Overview dashboard with animated hand-drawn SVG charts (Line, Donut, Bar) and stats bento grid.
- [`views/admin/events.ejs`](file:///d:/Campus%20Connect/views/admin/events.ejs), `notices.ejs`, `resources.ejs`, `community.ejs`, `groups.ejs`, `users.ejs`, `messages.ejs`, `logs.ejs`, `settings.ejs`: Polished table views with sticky headers, action pills, responsive horizontal scrolling, and filter bars.

---

## Build Plan Phases
1. **Phase 1**: Design System Tokens, CSS Variables (`style.css`), Keyframes & Utilities (`animations.css`), Theme Toggle logic (`theme.js`).
2. **Phase 2**: Global Layout, Glass Navbar with active sliding indicator, Announcement Bar, Command Palette modal (`command_palette.ejs`), Mobile Bottom Bar (`bottom_nav.ejs`), Footer (`footer.ejs`).
3. **Phase 3**: Landing Page (`landing.ejs`), About, Contact, Styleguide.
4. **Phase 4**: Auth Pages (`login.ejs`, `signup.ejs` stepper, `forgot.ejs`, `reset.ejs`).
5. **Phase 5**: Student Dashboard 12-column Bento Grid (`dashboard/index.ejs`) & Onboarding spotlight tour.
6. **Phase 6**: Content modules (Notices, Events, Study Hub, Community, Groups).
7. **Phase 7**: Profile, Notifications, Global Search view, Error pages.
8. **Phase 8**: Admin Panel overview with SVG animated charts & management tables.
9. **Phase 9**: Interactive JS Modules, micro-interactions, responsive & accessibility polish, browser verification.
