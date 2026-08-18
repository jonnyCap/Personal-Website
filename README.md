# Jonathan Maier — Personal Website & Portfolio

[![GitHub Pages Deployment](https://img.shields.io/badge/GitHub%20Pages-Live%20Demo-brightgreen?style=flat&logo=github)](https://jonnycap.github.io/Personal-Website/)
[![Language](https://img.shields.io/badge/Language-Vanilla%20JS%20%7C%20HTML5%20%7C%20CSS3-yellow.svg)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
[![License](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

> A fast, interactive, and lightweight personal portfolio and project showcase built from scratch using pure Vanilla Web technologies.

---

## 🌟 Overview

This project is a personal portfolio built without external UI frameworks or static site generators. It demonstrates core web engineering principles through a custom vanilla JavaScript Single-Page Application (SPA) architecture, interactive HTML5 Canvas visualizers, modular JSON-driven content rendering, and automated GitHub Actions workflows.

---

## 🔄 What's Changed Since v1 (2022 → August 15, 2026)

Since its original release in 2022, the website has been significantly overhauled:

- **GitHub Actions Integration & Automated Sync**: Added an automated GitHub Actions cron workflow that queries the GitHub API to dynamically update public repositories into `data/projects.json`.
- **JSON-Driven CV & Project Loading**: Replaced hardcoded HTML markup with structured data (`data/cv.json`, `data/projects.json`), dynamically parsed and rendered client-side (`cvRenderer.js`, `projectsRenderer.js`).
- **Animation & Canvas Optimization**: Refactored particle loops, render cycles, and DPI scaling across all canvas scripts (`sizeAdapterScript.js`) for lower CPU/GPU usage and smoother frame rates.
- **Frontend & Mobile Layout Fixes**: Fixed responsive layout bugs, viewport height clipping on mobile devices, navbar animations, and touch-friendly interaction states.
- **Automated CI/CD Pipeline**: Streamlined GitHub Pages deployment via GitHub Actions on every push to `main`.

---

## 🔄 GitHub Actions & Data Flow

```mermaid
flowchart LR
    subgraph Automation [GitHub Actions]
        A[Weekly Cron / Dispatch] -->|Fetch API| B[fetchGitHubRepos.js]
        B -->|Auto-commit| C[(data/projects.json)]
        D[Git Push to main] -->|deploy.yml| E[GitHub Pages]
    end

    subgraph Client [Browser Runtime]
        C -.->|fetch| F[projectsRenderer.js]
        G[(data/cv.json)] -.->|fetch| H[cvRenderer.js]
        F & H --> I[Dynamic DOM Injection]
    end
```

---

## ⚙️ Core Architecture & Features

- **Custom SPA Engine** (`SPAScript.js`): Dynamic multi-section routing and fluid tab navigation on the deep-dive page (`aboutMePage.html`) without page reloads.
- **Dynamic Content Modules** (`cvRenderer.js`, `projectsRenderer.js`): Client-side async rendering from structured JSON data.
- **Interactive HTML5 Canvases** (`canvasScript.js`, `secondaryCanvasScript.js`, `journeyCanvasScript.js`): 3-Stage atmospheric & technical simulation (Cloud Vapor & Isobars, Digital Rain Matrix & Umbrella Shield, Procedural Fractal Lightning), interactive trajectory milestones, and DPI-responsive backgrounds.
- **Custom UI Components** (`sliderScript.js`, `navScript.js`, `textAppearanceScript.js`): Touch-enabled carousel, sticky responsive navigation, and typewriter text transitions.
- **Form Handling** (`handlerScript.js`): Asynchronous contact and newsletter submission powered by FormSubmit.

---

## 📁 Project Structure

```text
Personal-Website/
├── .github/
│   └── workflows/
│       ├── deploy.yml            # Automated deployment to GitHub Pages
│       └── fetch-repos.yml       # Weekly sync for public GitHub repositories
├── data/
│   ├── cv.json                   # Structured resume/CV data
│   ├── projectConfig.json        # Repository blacklist & custom project metadata
│   └── projects.json             # Cached repository data fetched from GitHub
├── Scripts/
│   ├── SPAScript.js              # SPA routing & section switcher
│   ├── canvasScript.js           # 3-Stage atmospheric & digital weather canvas
│   ├── cvRenderer.js             # Client-side CV renderer
│   ├── fetchGitHubRepos.js       # Node.js GitHub API sync script
│   ├── handlerScript.js          # FormSubmit integration & handlers
│   ├── journeyCanvasScript.js    # Interactive milestone timeline canvas
│   ├── navScript.js              # Sticky navigation & responsive dropdown
│   ├── projectsRenderer.js       # Projects grid renderer
│   ├── scrollDownButtonScript.js # Animated scroll trigger
│   ├── secondaryCanvasScript.js  # Secondary page animated background
│   ├── sizeAdapterScript.js      # Canvas DPI & viewport resizing
│   ├── sliderScript.js           # Touch/click project slider
│   └── textAppearanceScript.js   # Dynamic text fade & typewriter effects
├── Styles/
│   ├── NavAndFooterStyles.css    # Global navbar and footer styles
│   ├── mainPage.css              # Landing page layout & styling
│   └── secondaryPage.css         # SPA & sub-page styling
├── images/                       # Optimized WebP assets & icons
├── index.html                    # Landing page
├── aboutMePage.html              # Interactive deep-dive portfolio (SPA)
└── README.md
```

---

## 🛠️ Tech Stack

- **Frontend**: HTML5, Vanilla CSS3, Vanilla JavaScript (ES6+)
- **Data & Rendering**: JSON-driven async DOM rendering
- **Graphics**: HTML5 Canvas API (Custom particle & vector engines)
- **Automation / CI/CD**: GitHub Actions (repo sync cron + Pages deployment)
- **Forms**: [FormSubmit](https://formsubmit.co/) API

---

## 🚀 Getting Started

No build step or package manager is required for local preview.

### Local Preview

1. **Clone the repository:**
   ```bash
   git clone https://github.com/jonnyCap/Personal-Website.git
   cd Personal-Website
   ```

2. **Run a local web server:**
   ```bash
   # Using Python 3
   python3 -m http.server 8000

   # Or using Node.js
   npx serve .
   ```
3. Open `http://localhost:8000` in your browser.

---

## 📬 Contact & Links

- **Author**: Jonathan Maier
- **Portfolio**: [jonnycap.github.io/Personal-Website](https://jonnycap.github.io/Personal-Website/)
- **GitHub**: [@jonnyCap](https://github.com/jonnyCap)
- **LinkedIn**: [Jonathan Maier](https://www.linkedin.com/in/jonathan-maier-179836263/)

