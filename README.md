# 🪄 PDFWizzard

PDFWizzard is a modern full-stack web application that generates ready-to-download PDF documents such as cover letters, CVs, and invoices.  
It uses AI (via Grok API) to produce LaTeX code automatically, compiles it into a polished PDF, and previews the result instantly in the browser.

---

## 🚀 Current Stack

| Layer | Technology | Purpose |
|--------|-------------|----------|
| **Frontend** | [Next.js 16](https://nextjs.org/) + [React 19](https://react.dev/) | Core framework and rendering engine |
| **Styling** | [Tailwind CSS](https://tailwindcss.com/) + [shadcn/ui](https://ui.shadcn.com/) | Futuristic, responsive UI components |
| **Animations** | [Framer Motion](https://www.framer.com/motion/) | Smooth transitions and modern effects |
| **Icons** | [Lucide React](https://lucide.dev/) | Clean and consistent vector icons |
| **Backend (API)** | Next.js API Routes | Handles AI requests and PDF generation |
| **AI Model** | [Grok API](https://x.ai) | Generates LaTeX source from user prompts |
| **PDF Preview** | Native `<iframe>` renderer | Displays the compiled document in real-time |

---

## 🧠 Planned / Upcoming Technologies

| Feature | Planned Technology |
|----------|--------------------|
| Local LaTeX compilation | [Tectonic](https://tectonic-typesetting.github.io/) or TeX Live |
| Persistent data storage | PostgreSQL or SQLite |
| Authentication | NextAuth.js (Google / Apple Sign-in) |
| Hosting | VPS (Hetzner / OVH / Scaleway) with NGINX + SSL |
| Process manager | [PM2](https://pm2.keymetrics.io/) |
| Payment support | Stripe API (for Pro subscription) |
| PDF history storage | S3-compatible object storage |

---

## ⚙️ Development Setup

Clone and run locally:

```bash
git clone https://github.com/AdilHamidii/PdfWizzard.git
cd PdfWizzard
npm install
npm run dev


