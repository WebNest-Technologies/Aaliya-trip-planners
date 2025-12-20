# Clean URLs Implementation Plan

## Goal
Serve files without `.html` extension (e.g., `/contact` instead of `/contact.html`) and update all internal links.

## Changes

### 1. Server Configuration
*   **File**: `server.js`
*   **Action**: Update the static file serving middleware to automatically append `.html` if a file is not found but exists with that extension.
*   **Action**: Redirect any requests containing `.html` to the clean version (optional, but good for SEO/consistency).

### 2. Frontend Links
*   **Files**: All `.html` files in `public/`.
*   **Action**: Find and replace all `href="page.html"` with `href="page"`.
    *   `index.html` -> `/` or `index`
    *   `couple.html` -> `couple`
    *   `common.html` -> `common`
    *   `vehicles.html` -> `vehicles`
    *   `details.html` -> `details`
    *   `admin/login.html` -> `admin/login`
    *   `admin/dashboard.html` -> `admin/dashboard`

### 3. Verification
*   Check if `localhost:5000/couple` loads the couple page.
*   Check if navigation links work correctly.
