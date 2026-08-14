# Jonathan Maier — Personal Website & Portfolio

[![GitHub Pages Deployment](https://img.shields.io/badge/GitHub%20Pages-Live%20Demo-brightgreen?style=flat&logo=github)](https://jonnycap.github.io/Personal-Website/)
[![Language](https://img.shields.io/badge/Language-Vanilla%20JS%20%7C%20HTML5%20%7C%20CSS3-yellow.svg)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
[![License](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

> A fast, interactive, and lightweight personal portfolio and project showcase built from scratch using pure Vanilla Web technologies.

---

## 🌟 Overview & Inspiration

This project represents my first official personal website. 

My primary motivation was to gain a deep understanding of the inner workings of the web. Rather than relying on modern UI frameworks or template site generators, I chose to build everything from scratch—including implementing a custom Single-Page Application (SPA) architecture in pure, vanilla JavaScript to explore state management, routing, and DOM manipulation under the hood.

### Reworked & Optimized
Originally created as a learning playground, the project has since been completely reworked and optimized:
- **Performance First**: Upgraded all visual assets to lightweight WebP format and optimized HTML5 Canvas render loops to minimize CPU and battery usage.
- **Modern Semantics & SEO**: Modernized HTML5 structure, enhanced accessibility, and added comprehensive Open Graph & Twitter meta tags.
- **Automated CI/CD**: Automated deployment pipeline using GitHub Actions to push directly to GitHub Pages.

---

## ⚙️ How It Works

The entire website is built without external frontend frameworks (no React, Angular, or jQuery), relying exclusively on native web standards:

- **Custom Single-Page Application (SPA) Engine** (`SPAScript.js`): Dynamic multi-section routing and fluid tab switching on the deep-dive page (`aboutMePage.html`) without full page reloads.
- **Interactive HTML5 Canvas Visuals** (`canvasScript.js`, `secondaryCanvasScript.js`, `journeyCanvasScript.js`): Custom particle animations, dynamic responsive backgrounds, and interactive timeline paths.
- **Custom UI Components** (`sliderScript.js`, `textAppearanceScript.js`, `navScript.js`): Handcrafted touch- and click-friendly project sliders, typewriter text transitions, and responsive mobile navigation.
- **Form Handling** (`handlerScript.js`): Contact and newsletter subscriptions powered asynchronously through FormSubmit.

---

## 📁 Project Structure

```text
Personal-Website/
├── .github/
│   └── workflows/
│       └── deploy.yml          # GitHub Actions deployment to Pages
├── Scripts/
│   ├── SPAScript.js            # SPA routing & section switcher
│   ├── canvasScript.js         # Landing page particle canvas
│   ├── handlerScript.js        # FormSubmit integration & handlers
│   ├── journeyCanvasScript.js  # Interactive milestone timeline canvas
│   ├── navScript.js            # Sticky navigation & responsive dropdown
│   ├── scrollDownButtonScript.js # Animated scroll-down trigger
│   ├── secondaryCanvasScript.js# Secondary page animated background
│   ├── sizeAdapterScript.js    # Canvas DPI & viewport resizing
│   ├── sliderScript.js         # Custom projects carousel
│   └── textAppearanceScript.js # Dynamic text fade & typewriter effects
├── Styles/
│   ├── NavAndFooterStyles.css  # Global navbar and footer styles
│   ├── mainPage.css            # Landing page layout & styling
│   └── secondaryPage.css       # SPA & sub-page styling
├── images/                     # Optimized WebP assets & icons
├── index.html                  # Landing page
├── aboutMePage.html            # Interactive deep-dive portfolio (SPA)
└── README.md
```

---

## 🛠️ Tech Stack

- **Core**: HTML5, Vanilla CSS3, Vanilla JavaScript (ES6+)
- **Graphics**: HTML5 Canvas API (Custom particle and vector rendering)
- **Forms**: [FormSubmit](https://formsubmit.co/) API
- **Deployment**: GitHub Pages via GitHub Actions

---

## 🚀 Getting Started

Since the project uses purely static web technologies, no build step or package manager is required.

### Local Preview

1. **Clone the repository:**
   ```bash
   git clone https://github.com/jonnyCap/Personal-Website.git
   cd Personal-Website
   ```

2. **Open in browser:**
   - Double-click [`index.html`](file:///home/jonathan-maier/Documents/Projects/Personal-Website/index.html) or run a simple local web server:
   ```bash
   # Using Python 3
   python3 -m http.server 8000
   
   # Or using Node.js / npx
   npx serve .
   ```
3. Visit `http://localhost:8000` in your web browser.

---

## 📬 Contact & Links

- **Author**: Jonathan Maier
- **Portfolio**: [jonnycap.github.io/Personal-Website](https://jonnycap.github.io/Personal-Website/)
- **GitHub**: [@jonnyCap](https://github.com/jonnyCap)
- **LinkedIn**: [Jonathan Maier](https://www.linkedin.com/in/jonathan-maier-179836263/)
