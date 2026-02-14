<div align="center">

# 🧮 Calculator Ultra

### The Most Powerful Scientific Calculator for the Modern Web

[![Live Demo](https://img.shields.io/badge/demo-live-brightgreen?style=for-the-badge)](https://calculator-ultra.pages.dev)
[![Tests](https://img.shields.io/badge/tests-386%20passed-success?style=for-the-badge)](https://github.com)
[![License](https://img.shields.io/badge/license-MIT-blue?style=for-the-badge)](LICENSE)
[![PWA](https://img.shields.io/badge/PWA-ready-blueviolet?style=for-the-badge)](https://calculator-ultra.pages.dev)

[🇺🇸 English](README.md) | [🇨🇳 中文](README.zh-CN.md) | [🇻🇳 Tiếng Việt](README.vi.md)

<img src="https://img.shields.io/badge/React-18.3-61DAFB?logo=react&logoColor=white" alt="React" />
<img src="https://img.shields.io/badge/TypeScript-5.3-3178C6?logo=typescript&logoColor=white" alt="TypeScript" />
<img src="https://img.shields.io/badge/TailwindCSS-3.4-06B6D4?logo=tailwindcss&logoColor=white" alt="TailwindCSS" />
<img src="https://img.shields.io/badge/Vite-5.1-646CFF?logo=vite&logoColor=white" alt="Vite" />

</div>

---

## ✨ Features

### 🔢 Calculator Modes

| Mode | Description |
|------|-------------|
| **Basic** | Standard arithmetic operations with memory functions |
| **Scientific** | Trigonometry, logarithms, exponents, factorials, and more |
| **Advanced** | Calculus (derivatives, integrals, limits), matrices, vectors, complex numbers |
| **Graphing** | Plot mathematical functions with interactive zoom and pan |
| **Statistics** | Statistical analysis, regression, probability distributions |
| **Programming** | Binary, octal, hexadecimal conversions with bitwise operations |
| **Financial** | Compound interest, loan amortization, TVM calculations |
| **Unit Converter** | Convert between 100+ units across 10 categories |
| **Equation Solver** | Solve linear, quadratic, and polynomial equations |

### 🎨 Themes & Customization

- **6 Beautiful Themes**: Light, Dark, AMOLED Black, Solarized, High Contrast, Retro
- **Responsive Design**: Works perfectly on desktop, tablet, and mobile
- **Landscape Optimization**: Special layout for horizontal screens

### ⚡ Performance & Accessibility

- **PWA Support**: Install as a native app, works offline
- **Keyboard Shortcuts**: Full keyboard navigation support
- **ARIA Labels**: Screen reader friendly
- **Haptic Feedback**: Vibration feedback on mobile devices
- **Swipe Gestures**: Switch modes with touch gestures

### 📊 Advanced Mathematics

- **Derivatives**: Compute derivatives symbolically and numerically
- **Integrals**: Definite and indefinite integration
- **Limits**: One-sided and two-sided limits
- **Taylor Series**: Expand functions as power series
- **Matrix Operations**: Determinant, inverse, eigenvalues
- **Vector Calculus**: Dot product, cross product, magnitude
- **Complex Numbers**: Full complex arithmetic support

---

## 🚀 Quick Start

### Try Online

**👉 [Live Demo](https://calculator-ultra.pages.dev)**

### Install as PWA

1. Visit the website on Chrome/Edge/Safari
2. Click "Install" or "Add to Home Screen"
3. Enjoy offline access!

### Run Locally

```bash
# Clone the repository
git clone https://github.com/yourusername/calculator-ultra.git
cd calculator-ultra

# Install dependencies
npm install

# Start development server
npm run dev

# Run tests
npm test

# Build for production
npm run build
```

---

## ⌨️ Keyboard Shortcuts

| Key | Action |
|-----|--------|
| `0-9` | Enter digits |
| `+ - * / ^` | Operators |
| `Enter` / `=` | Calculate |
| `Backspace` | Delete |
| `Escape` | Clear |
| `s` / `c` / `t` | sin / cos / tan |
| `l` / `n` / `r` | log / ln / sqrt |
| `p` / `e` | π / e |
| `Ctrl+D` | Toggle DEG/RAD |
| `Ctrl+M` | Memory Add |
| `Ctrl+R` | Memory Recall |

---

## 🏗️ Tech Stack

- **Frontend**: React 18 with TypeScript
- **Styling**: TailwindCSS 3.4
- **Math Engine**: Math.js 12.4
- **Build**: Vite 5.1
- **Testing**: Vitest 4.0
- **PWA**: Vite PWA Plugin
- **Hosting**: Cloudflare Pages

---

## 📁 Project Structure

```
calculator-ultra/
├── src/
│   ├── components/     # React components
│   │   ├── Calculator/ # Main calculator
│   │   ├── Keypad/     # Button keypads
│   │   ├── Display/    # Expression display
│   │   └── ...         # Other UI components
│   ├── contexts/       # React contexts
│   ├── hooks/          # Custom hooks
│   ├── utils/          # Utility functions
│   │   ├── mathOperations.ts
│   │   ├── derivatives.ts
│   │   ├── integrals.ts
│   │   └── ...
│   └── types/          # TypeScript types
├── public/             # Static assets
└── scripts/            # Build scripts
```

---

## 🧪 Testing

```bash
# Run all tests
npm test

# Watch mode
npm run test:watch

# Coverage report
npm run test:coverage
```

**Test Statistics:**
- ✅ 386 tests passing
- ✅ 21 test suites
- ✅ Full coverage for utils and hooks

---

## 🚀 Deployment

### Deploy to Cloudflare Pages

```bash
# Full deployment (with tests)
npm run deploy

# Quick deploy
npm run pages:deploy
```

---

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- [Math.js](https://mathjs.org/) - Extensive math library
- [Lucide React](https://lucide.dev/) - Beautiful icons
- [Headless UI](https://headlessui.com/) - Accessible UI components
- [TailwindCSS](https://tailwindcss.com/) - Utility-first CSS

---

<div align="center">

**Made with ❤️ for mathematicians, students, and professionals**

[⬆ Back to top](#-calculator-ultra)

</div>
