# Task 4: Update AuthenticatedLayout to use sidebar

## Status: DONE

## What I did
- Replaced the floating navbar in `AuthenticatedLayout.jsx` with a sidebar-based layout
- Removed old imports (ApplicationLogo, Dropdown, NavLink, ResponsiveNavLink) and replaced with Sidebar component import
- Added mobile sidebar overlay with backdrop blur
- Added fixed sidebar with glassmorphism styling (white/70 backdrop-blur-xl)
- Added mobile header with hamburger menu to toggle sidebar
- Maintained existing header and children props functionality

## Files changed
- `resources/js/Layouts/AuthenticatedLayout.jsx` — Complete rewrite to use sidebar layout

## Commits created
- `df7b859` — feat: replace navbar with sidebar layout

## One-line test summary
Layout renders correctly with sidebar visible on desktop and mobile toggle working via hamburger menu.
