# Task 5 Report: Create Stub Routes for New Menu Items

## What Was Done

Added routes and created stub pages for Notifikasi, Settings, and Help menu items in the Laravel + React + Inertia.js application.

## Files Created/Changed

### Modified
- `routes/web.php` — Added 3 new routes (notifications, settings, help) inside the auth middleware group

### Created
- `resources/js/Pages/Notifications/Index.jsx` — Stub page for notifications
- `resources/js/Pages/Settings/Index.jsx` — Stub page for settings
- `resources/js/Pages/Help/Index.jsx` — Stub page for help with usage instructions

## Issues/Concerns

None. All routes and pages follow existing project conventions and use the `AuthenticatedLayout` component for consistent UI.

## Commit

```
140cc0b feat: add notifications, settings, and help pages
```

## Test Summary

Routes added and pages created successfully. All pages use consistent glassmorphism styling matching existing dashboard/transactions pages.
