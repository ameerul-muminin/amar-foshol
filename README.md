# 🌾 আমার ফসল (Amar Foshol) - HarvestGuard

> **HackFest 2025** | Team SteveJobs

A tech-based solution to reduce food loss in Bangladesh, addressing SDG 12.3 - Responsible Consumption and Production.

---

## 🚨 The Problem

Bangladesh loses **4.5 million metric tonnes** of food grains annually due to:

- Inadequate storage facilities
- Poor handling practices
- Inefficient transportation

This results in **$1.5 billion USD** in economic losses and worsens food insecurity for vulnerable communities.

---

## 💡 Our Solution

**আমার ফসল (Amar Foshol)** is a mobile-first web application that helps Bangladeshi farmers:

- 📊 Track and manage crop batches
- 🌦️ Get hyper-local weather forecasts in Bangla
- ⚠️ Receive actionable advisories to prevent food loss
- 🏆 Earn badges for successful interventions

---

## ✨ Features (Part A)

### A1: Storytelling Landing Page

- Bilingual support (বাংলা / English)
- Visual storytelling: Data → Warning → Action → Saved Food
- CSS animations & mobile-first design
- Large, intuitive UI for low-literacy users

### A2: Farmer & Crop Management

- Farmer registration with secure authentication
- Crop batch registration (Paddy/Rice)
- Profile page with achievement badges
- Offline mode with LocalStorage sync
- CSV/JSON data export

### A3: Hyper-Local Weather Integration

- Live weather data by Upazila (Open-Meteo API - no key required)
- 5-day forecast: Temperature, Humidity, Rain probability
- **Full Bangla UI**
- Smart advisories based on weather + crop data

---

## 🛠️ Tech Stack

| Category        | Technology                         |
| --------------- | ---------------------------------- |
| Framework       | Next.js 16 (App Router)            |
| Language        | TypeScript                         |
| Styling         | Tailwind CSS                       |
| Icons           | Phosphor Icons                     |
| Offline Storage | localforage                        |
| Weather API     | Open-Meteo (free, no key required) |
| Deployment      | Vercel                             |

---

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/your-username/amar-foshol.git

# Navigate to project
cd amar-foshol

# Install dependencies
npm install

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🌿 Git Workflow & Branching

### Branch Structure

| Branch                           | Owner     | Task                       |
| -------------------------------- | --------- | -------------------------- |
| `main`                           | Protected | Production-ready code only |
| `dev`                            | Team      | Integration branch         |
| `feature/A1-landing-page`        | Alif      | Landing page & UI          |
| `feature/A2-farmer-management`   | Yasin     | Farmer & crop management   |
| `feature/A3-weather-integration` | Joydeep   | Weather API integration    |

### Initial Setup (Team Lead - do once)

```bash
# After cloning, create dev branch
git checkout -b dev
git push -u origin dev

# Create feature branches
git checkout -b feature/A1-landing-page
git push -u origin feature/A1-landing-page

git checkout dev
git checkout -b feature/A2-farmer-management
git push -u origin feature/A2-farmer-management

git checkout dev
git checkout -b feature/A3-weather-integration
git push -u origin feature/A3-weather-integration
```

### For Teammates (First Time Setup)

```bash
# Clone the repo
git clone https://github.com/your-username/amar-foshol.git
cd amar-foshol

# Install dependencies
npm install

# Switch to your feature branch
git checkout feature/A2-farmer-management   # Yasin
# OR
git checkout feature/A3-weather-integration  # Joydeep
```

### Daily Workflow

```bash
# 1. Make sure you're on your branch
git checkout feature/A2-farmer-management

# 2. Pull latest changes
git pull origin feature/A2-farmer-management

# 3. Make your changes, then stage & commit
git add .
git commit -m "feat: add farmer registration form"

# 4. Push your changes
git push origin feature/A2-farmer-management
```

### Merging to Dev (When feature is complete)

```bash
# 1. Switch to dev
git checkout dev

# 2. Pull latest dev
git pull origin dev

# 3. Merge your feature branch
git merge feature/A2-farmer-management

# 4. Resolve conflicts if any, then push
git push origin dev
```

### Commit Message Convention

```
feat: add new feature
fix: bug fix
style: UI/CSS changes
docs: documentation updates
refactor: code refactoring
```

### Useful Commands

```bash
# Check current branch
git branch

# See all branches
git branch -a

# Check status
git status

# View commit history
git log --oneline

# Discard local changes
git checkout -- .

# Stash changes temporarily
git stash
git stash pop
```

---

## 📁 Project Structure

```
amar-foshol/
├── src/
│   ├── app/              # Next.js app router pages
│   ├── components/       # Reusable UI components
│   ├── lib/              # Utilities & API clients
│   ├── hooks/            # Custom React hooks
│   └── locales/          # Bangla/English translations
├── public/               # Static assets
└── README.md
```

---

## 🌐 Live Demo

🔗 **Deployed URL:** [Coming Soon]

📹 **Video Demo:** [Coming Soon]

---

## 👥 Team SteveJobs

| Member  | Role      |
| ------- | --------- |
| Alif    | Developer |
| Yasin   | Developer |
| Joydeep | Developer |

---

## 📄 License

This project is built for **EDU HackFest 2025**.

---

## 🙏 Acknowledgments

- EDU Computer Club & EDU Foundry
- Open-Meteo API (free weather data)
- Bangladesh Agricultural Weather Information Service (BAMIS)

---

<div align="center">

**আমার ফসল** - বাংলাদেশের কৃষকদের জন্য 🇧🇩

_Reducing food loss, one harvest at a time._

</div>
