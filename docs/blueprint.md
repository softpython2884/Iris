# **App Name**: Orwell OS

## Core Features:

- Login Authentication: Secure authentication using tokens or keys with short, revocable sessions.
- TUI Dashboard: Responsive terminal user interface (TUI) with clickable buttons and modular zones, adapting to different terminal sizes.
- Contact/Entity Database: An 'Orwell-like' database to store information about entities (people, organizations, sites), with provenance tracking, relationships, tags, and access control levels.
- Lockdown System: Multi-level lockdown system (LV1, LV2, LV3) triggered manually or automatically based on security rules.
- Automated Enrichment: An AI-driven tool pipeline to process crawled pages, perform NER (Named Entity Recognition), link people/entities, and enrich the database with relevant information.
- Bot Management: Tools to launch and manage bots for crawling approved domains, extracting data, and creating entities. Store provenance and trust scores.
- Settings persistence: Enable storing the current selected TUI Theme.
- API Functionality: API endpoints for login, inbox, messages, images, bots, lockdown, admin, etc. All endpoints verify permissions and lockdown state.

## Style Guidelines:

- Primary color: Dark purple (#301934) to evoke a sense of mystery and security, reminiscent of classified systems.
- Background color: Very dark gray (#121212) to maintain a terminal-like, secure atmosphere.
- Accent color: Electric lime green (#32CD32) to highlight active elements and data streams, typical in terminal interfaces.
- Font: 'Source Code Pro' (monospace) for all text, providing a consistent terminal-style appearance and readability.
- Simple, geometric icons to represent different functions and statuses within the TUI, keeping the interface clean and efficient.
- Modular layout with distinct zones for status, main content, and side panels, ensuring a clear and organized display of information.
- Subtle animations for data updates and system alerts, using terminal-style effects like scrolling text and color changes to maintain user engagement.