# 🎯 target‑achiever

A responsive, frontend‑only **Savings Planner** web app built with React and TypeScript.  
Track multiple goals in INR or USD, log contributions, visualize savings over time, and export PDF statements.

---

![Image](https://github.com/user-attachments/assets/e7898155-1dae-4839-bfd2-679cb93e4564)
![Image](https://github.com/user-attachments/assets/1d0ccbc0-d61a-4582-8a49-67aff75fc1c3)

## 📌 Table of Contents

- [Demo](#demo)  
- [Features](#features)  
- [Tech Stack](#tech-stack)  
- [Project Structure](#project-structure)  
- [Getting Started](#getting-started)  
- [Scripts](#scripts)  
- [Configuration](#configuration)  
- [Screenshots](#screenshots)  
- [Roadmap](#roadmap)  
- [License](#license)  

---

## 📺 Demo

> Include a live link or GIF here once deployed  
> _e.g._: https://username.github.io/target-achiever

---

## ✨ Features

### 1. Goal Management
- **Add / Edit / Delete** Savings Goals  
- Name, Target Amount, Currency (INR / USD)  
- Real‑time validation (no negatives, max digits, required fields)

### 2. Contributions
- Add dated contributions per goal  
- **Form validation**: non‑future dates, max decimal places, cannot exceed remaining amount  
- **Delete** contributions if needed

### 3. Dashboard Overview
- **Totals Banner**  
  - Sum of all targets & saved amounts, separately for INR and USD  
  - Overall progress (%) averaged across goals  
  - “Refresh Rates” button to re‑fetch live INR↔USD rate  
  - Last‑updated timestamp

### 4. Savings Over Time
- **Time‑series chart** (Recharts) showing cumulative savings per goal  
- **Projections**: “At this rate you’ll hit your trip in ~X months/days”

### 5. PDF Export
- **Download Monthly Statement** (jsPDF + autotable)  
- Lists all this month’s contributions, plus totals

### 6. UX & Accessibility
- Responsive design (mobile ↔ desktop)  
- Keyboard‑accessible forms & buttons  
- ARIA labels on modals & interactive elements  
- Light/dark‑friendly gradients, hover states, loading spinners

---

## 🛠️ Tech Stack

| Layer            | Technology                |
| ---------------- | ------------------------- |
| Framework        | React 18 + TypeScript     |
| Build Tool       | Vite                       |
| Styling          | Tailwind CSS               |
| Charts           | Recharts                   |
| Date Utilities   | date‑fns                   |
| PDF Export       | jsPDF + jspdf‑autotable    |
| Icons            | lucide‑react               |
| UUID Generation  | uuid                       |
| State Persist    | localStorage               |

---

## 📁 Project Structure

```bash
target-achiever/
├── node_modules/
├── public/
│   └── index.html
├── src/
│   ├── components/
│   │   ├── overlays/            # Modals & confirmation dialogs
│   │   ├── AddGoalForm.tsx
│   │   ├── ContributionModal.tsx
│   │   ├── DashboardHeader.tsx
│   │   ├── GoalCard.tsx
│   │   └── GoalProgressChart.tsx
│   ├── hooks/
│   │   ├── useExchangeRate.ts   # Exchange‑rate fetch & caching
│   │   └── use-toast.ts         # Custom hook for notifications
│   ├── lib/
│   │   └── utils.ts             # Shared helpers (e.g. date formatting)
│   ├── pages/
│   │   ├── Index.tsx            # Main entrypoint
│   │   └── NotFound.tsx
│   ├── types/
│   │   └── index.ts             # Interfaces: Goal, Contribution, DashboardStats, ExchangeRate
│   ├── utils/
│   │   └── currency.ts          # formatCurrency, convertCurrency
│   ├── App.tsx
│   ├── main.tsx
│   └── index.css
├── .gitignore
├── package.json
├── tailwind.config.js
├── tsconfig.json
└── README.md
