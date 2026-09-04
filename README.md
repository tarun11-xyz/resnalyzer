<div align="center">
  <img src="./assets/logo.svg" alt="Resnalyzer logo" width="96" height="96" />

# Resnalyzer

### Next-Gen AI Resume Analyzer

*Turn resume guesswork into data-driven decisions — instantly.*

[![Status](https://img.shields.io/badge/Status-Active-success.svg)](#)
[![Frontend](https://img.shields.io/badge/Frontend-React%20%2B%20Vite-blue)](#)
[![Backend](https://img.shields.io/badge/Backend-Node.js%20%2B%20Express-green)](#)
[![AI](https://img.shields.io/badge/AI-Google%20Gemini-orange)](#)
[![License](https://img.shields.io/badge/License-MIT-lightgrey)](#-license)

</div>

---

Resnalyzer is a powerful, beautifully designed full-stack application that leverages advanced AI (**Google Gemini 3.5 Flash**) to dissect, evaluate, and compare resumes against industry standards. It acts as both a critical analysis tool for job seekers and a secure vault for career documents.

<br>

## 📑 Table of Contents

- [The Problem it Solves](#-the-problem-it-solves)
- [Why Clone This Repo](#-why-you-should-clone-this-repo)
- [Tech Stack](#️-tech-stack)
- [Local Development Setup](#-local-development-setup)
- [Deployment Guide](#-deployment-guide-decoupled-split-method)
- [License](#-license)

<br>

## 💡 The Problem it Solves

**For Job Seekers**
Sending a resume often feels like shouting into a black hole. Modern Applicant Tracking Systems (ATS) are ruthless, and candidates rarely receive feedback on *why* they were rejected. Resnalyzer bridges this gap by providing an instant, objective, and detailed critique of your resume — highlighting missing keywords, structural flaws, and actionable improvements.

**For Hiring Managers & Recruiters**
Manually comparing dozens of resumes is tedious and prone to unconscious bias. Resnalyzer's **Compare** feature pits two resumes against each other, offering a structured breakdown of strengths, weaknesses, and a final verdict on the better fit.

<br>

## 🌟 Why You Should Clone This Repo

Whether you're building your own AI SaaS, learning modern web development, or just want a personal resume assistant, this repository is a goldmine:

| | |
|---|---|
| 🧠 **Production-Ready AI Integration** | Learn how to seamlessly integrate Google's Gemini API with strict JSON schema enforcement to ensure structured, predictable outputs. |
| 🏗️ **Decoupled Architecture** | Discover how to split a full-stack Vite app into a separate Frontend (Vercel/Netlify) and Backend (Render) for maximum performance and scalability. |
| 🎨 **Beautiful UI/UX** | Built with Tailwind CSS and Framer Motion, the codebase is a masterclass in clean, warm-neutral, highly responsive interfaces. |
| 🧭 **Custom Routing & Fallbacks** | Includes custom 404 handling, protected routing (e.g., redirecting users if they try to compare without uploading), and SEO-ready assets. |

<br>

## 🛠️ Tech Stack

<table>
<tr>
<td valign="top"><b>Frontend</b></td>
<td>React 18 · Vite · Tailwind CSS · Framer Motion · React Router · Lucide React Icons</td>
</tr>
<tr>
<td valign="top"><b>Backend</b></td>
<td>Node.js · Express · CORS</td>
</tr>
<tr>
<td valign="top"><b>AI Model</b></td>
<td>Google Gemini API (<code>gemini-3.5-flash</code>)</td>
</tr>
<tr>
<td valign="top"><b>Deployment</b></td>
<td>Decoupled — Frontend on Vercel/Netlify, Backend on Render</td>
</tr>
</table>

<br>

## 🚀 Local Development Setup

### 1. Clone the repository

```bash
git clone https://github.com/yourusername/resnalyzer.git
cd resnalyzer
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

Create a `.env` file in the root directory based on `.env.example`:

```env
GEMINI_API_KEY="your_google_gemini_api_key_here"

# Leave VITE_API_URL blank for local development
VITE_API_URL=""
```

### 4. Start the development server

```bash
npm run dev
```

The app will launch, running both the Vite frontend and the Express backend simultaneously at **http://localhost:3000**.

<br>

## 🌍 Deployment Guide (Decoupled Split Method)

This project is optimized for a **split deployment** — hosting the lightning-fast static frontend on Vercel/Netlify, and the heavy-duty API backend on Render.

### Part 1 — Deploy the Backend to Render

1. Create a new **Web Service** on [Render](https://render.com) connected to this repository.
2. Set the **Build Command** to:
   ```bash
   npm run build
   ```
3. Set the **Start Command** to:
   ```bash
   npm run start
   # or: node dist/server.cjs
   ```
4. Add your environment variable:

   | Key | Value |
   |---|---|
   | `GEMINI_API_KEY` | `your_actual_key` |

5. **Anti-sleep keep-alive:** Render's free tier sleeps after 15 minutes of inactivity. An endpoint is included at `/api/keep-alive`. Set up a free pinging service (like [cron-job.org](https://cron-job.org)) to hit `https://your-render-app.onrender.com/api/keep-alive` every 5–10 minutes to eliminate cold-start delays.

### Part 2 — Deploy the Frontend to Vercel or Netlify

1. Connect the **exact same repository** to [Vercel](https://vercel.com) or [Netlify](https://netlify.com).
2. The platform auto-detects Vite and sets:
   - Build command → `npm run build`
   - Output directory → `dist`
3. Add your environment variable:

   | Key | Value |
   |---|---|
   | `VITE_API_URL` | `https://your-render-app.onrender.com` *(no trailing slash)* |

4. **Deploy!** 🎉

> **Note for Netlify users:** the repository already includes a `public/_redirects` file to handle React Router fallbacks flawlessly.

<br>

## 📜 License

This project is licensed under the **MIT License**. Feel free to use, modify, and distribute it as you see fit.

<br>

<div align="center">

Made with ❤️ — contributions and stars are always welcome.

</div>
