# AI-Powered Job Matching Platform (JobHub)

A full-stack job matching platform combining an Express/MongoDB backend and a React + Vite frontend. The project implements user authentication (Google, Microsoft, email-based), job posting and applications, applicant tracking, AI-powered job matching, notifications via Socket.IO, and transactional emails via Brevo (Sendinblue) or Gmail SMTP.

---

## Table of Contents

- Project overview
- Architecture
- Features
- Getting started (local)
- Environment variables (.env)
- Running the project
- Testing email delivery (SMTP troubleshooting)
- Resolving GitHub push-protection secrets (GH013)
- Deployment
- Contributing
- License
- Contact

---

## Project overview

JobHub is an AI-assisted job matching web application aimed at connecting employers and job seekers. The backend is built with Node.js, Express, MongoDB and uses Socket.IO for real-time notifications; the frontend is built with React and Vite and styled using Tailwind CSS and Material UI.

JobHub bridges the gap between **job seekers** and **employers**, providing an intuitive space for both to achieve their career and hiring goals.  
It supports standard login/registration and **Google OAuth**, ensuring secure access for all users.

### 🎯 Objectives (Aligned with SDG 8)

- Promote **inclusive employment opportunities** for youth and professionals.  
- Enable **fair and transparent recruitment**.  
- Digitally empower communities through **accessible technology**.  


This repository contains two main folders:

- `Backend/` — Express server, MongoDB models, authentication, email utilities, routes and controllers.
- `frontend/` — React app (Vite) for the user interface.

## Architecture

- Backend: Node.js + Express, MongoDB (Mongoose), Passport for OAuth, Nodemailer / Brevo for transactional email, Socket.IO for real-time notifications.
- Frontend: React with Vite, Tailwind CSS, MUI components and client-side routing.

## Key features

### 👤 Job Seekers
- Register/Login (Email & Google Authentication)
- Create and update profiles with skills and resumes
- Search, filter, and apply for jobs
- Track job applications and statuses
- Get personalized notifications

### 🏢 Employers
- Post, edit, and delete job listings
- Manage candidate applications
- View analytics on job post performance
- Access advanced features with subscription plans

### 🧠 Admin (if implemented)
- Manage all users and jobs
- Review reports and analytics
- Maintain overall platform integrity

---
## 🧩 Tech Stack

**Frontend:** React.js, Axios, React Router, Tailwind CSS  
**Backend:** Node.js, Express.js  
**Database:** MongoDB (Mongoose ODM)  
**Authentication:** JWT & Google OAuth 2.0 (via Passport.js)  
**File Uploads:** Multer  
**Notifications:** Custom API and email (Nodemailer / Brevo)  
**Deployment:** Render (Backend), Vercel / Netlify (Frontend)

---




## Getting started (local development)

Prerequisites

- Node.js (v18+ recommended)
- npm or yarn
- MongoDB (local or Atlas)

Clone the repo and install dependencies:

```powershell
git clone https://github.com/Duncanmaina58/AI_Powered_Job_Matching_Platform.git
cd AI_Powered_Job_Matching_Platform
npm install --workspaces
``` 

Run backend and frontend in development:

```powershell
# Backend
cd Backend
npm install
npm run dev

# In a separate terminal: Frontend
cd frontend
npm install
npm run dev
```

Open the frontend at http://localhost:5173 and the backend at http://localhost:5000 by default.

---

## Environment variables (.env)

Important: Never commit your `.env` to version control. Add it to `.gitignore`.

Create a `.env` file in `Backend/` with the following variables (example):

```
# Server
PORT=5000
MONGO_URI=mongodb://localhost:27017

# JWT & Session
JWT_SECRET=supersecretkey123
SESSION_SECRET=sessionsecret

# OAuth (replace with your keys)
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
GOOGLE_CALLBACK_URL=http://localhost:5000/api/auth/google/callback

# Email (Brevo / Sendinblue SMTP key or Gmail App Password)
BREVO_SMTP_KEY=xsmtp-...  # transactional SMTP key from Brevo (regenerate if exposed)
EMAIL_FROM=you@yourdomain.com

# Optional Gmail App Password fallback
GMAIL_APP_PASSWORD=your_16_char_app_password

# Platform
PLATFORM_NAME=JobHub

```

Add a `.env.example` file (no secrets) to the repo listing only the variable names to help contributors.

---

## Running the project

Backend (development)

```powershell
cd Backend
npm run dev
```

Frontend (development)

```powershell
cd frontend
npm run dev
```

Production

- Build frontend: `npm run build` in `frontend/` (deployed to GitHub Pages in this project via `gh-pages` or to any static host)
- Start backend: `NODE_ENV=production npm start` in `Backend/` and point your frontend at the production backend URL.

---

## SMTP & Email troubleshooting (535 EAUTH)

If your server logs show `535 5.7.8 Authentication failed` (EAUTH) when sending email, follow these steps:

1. Verify credentials
   - Ensure the SMTP key or password in `Backend/.env` is correct.
   - If using Brevo (smtp-relay.brevo.com), ensure you use the SMTP key as credentials. Some relay setups may require key in both username and password fields.

2. Regenerate keys
   - If a key was accidentally exposed, regenerate it in the Brevo dashboard and replace it in `.env`.

3. Verify sender identity
   - Confirm `EMAIL_FROM` address is a verified sender in your Brevo (Sendinblue) account.

4. Fallback to Gmail
   - As a temporary workaround, use Gmail SMTP with an App Password (requires 2FA). Set `GMAIL_APP_PASSWORD` and change transporter settings.

5. Additional logging
   - Check server logs (we added explicit logging for error code and SMTP response in `Backend/utils/sendEmail.js`).

6. Test script
   - Create a small test script to directly call `nodemailer` and confirm SMTP connectivity.

---

## Resolving GitHub push-protection (GH013) — secrets found in commits

GitHub blocked your push because secrets were committed (e.g., OAuth client IDs/secrets, SMTP keys). Fix this safely:

1. Stop tracking the `.env` file and add to `.gitignore`:

```powershell
git rm --cached Backend/.env
echo "Backend/.env" >> .gitignore
git add .gitignore
git commit -m "Remove .env from repo and add to .gitignore"
git push origin main
```

2. If secrets exist in older commits, remove them from history:

- Use BFG Repo-Cleaner (easy):

```powershell
# Install BFG and run (example to remove 'Backend/.env')
bfg --delete-files Backend/.env
# Or to replace values:
bfg --replace-text replacements.txt
```

- Or `git filter-branch` (advanced):

```powershell
git filter-branch --force --index-filter \
  "git rm --cached --ignore-unmatch Backend/.env" \
  --prune-empty --tag-name-filter cat -- --all
git push origin --force --all
```

3. Regenerate any secrets that were exposed (Google OAuth client secret, SMTP keys, etc.).

4. For GitHub push protection block messages you can follow the provided unblock link in the remote error output to allow the current push temporarily (not recommended if secrets still present).

---

## Deployment

Frontend

- This repo uses Vercel for frontend hosting. To deploy:

```powershell
cd frontend
npm run deploy
```

Backend

- Deploy to your preferred host (Heroku, DigitalOcean, AWS, Vercel Serverless, etc.). Ensure environment variables are set in the host provider dashboard and that `.env` is not committed.

---

## Contributing

Please follow the typical GitHub workflow:

1. Fork the repo
2. Create a branch for your feature
3. Run lint & format before committing
4. Open a PR with an explanation and screenshots

Lint & format (backend):

```powershell
cd Backend
npm run lint
npm run format
```

---

## Notes & Troubleshooting (common issues)

- SMTP 535 EAUTH: See SMTP & Email troubleshooting above.
- GitHub blocked push: Remove secrets and follow GH013 guidance above.
- MongoDB connection errors: Verify `MONGO_URI` and that MongoDB is running or your Atlas cluster allows your IP.

---

🧾 API Endpoints (Sample)
Auth
Method	Endpoint	Description
POST	/api/auth/register	Register new user
POST	/api/auth/login	User login
GET	/api/auth/google	Google OAuth redirect
GET	/api/auth/google/callback	Google OAuth callback
Jobs
Method	Endpoint	Description
GET	/api/jobs	Fetch all jobs
POST	/api/jobs	Create a new job
GET	/api/jobs/:id	Get single job
PUT	/api/jobs/:id	Update job
DELETE	/api/jobs/:id	Delete job
Users
Method	Endpoint	Description
GET	/api/users/me	Get current user
PUT	/api/users/update	Update profile

🧠 System Architecture
Frontend (React)
     ↓
Backend API (Node + Express)
     ↓
MongoDB (Database)


Additional Services:

Google OAuth 2.0 for social login

Brevo/Nodemailer for email notifications

Cloud deployment via Render & Vercel

🌐 Deployment

Frontend: Vercel

Backend: Render

Database: MongoDB Atlas

Domain: (optional custom domain, e.g., jobhub.africa)

🧭 Roadmap

 AI-based job recommendations

 Resume scoring system

 Integrated skill development courses

 Mobile app (React Native)

📈 Impact (SDG 8 Alignment)

Promotes sustainable economic growth by reducing unemployment.

Bridges digital opportunity gaps in youth employment.

Encourages innovation in recruitment using technology.

🤝 Contributors
Name	Role	Responsibility
Duncan Nyaga Maina	Fullstack Developer	Project architecture, backend APIs, frontend integration
Team Members (if any)	—	—
📜 License

This project is licensed under the MIT License — feel free to use and modify responsibly.

🪄 Acknowledgements

Power Learn Project (PLP) – For mentorship and training.

UN SDG 8 – For inspiring the vision behind JobHub.

MERN Community – For open-source resources and guidance.

## Contact

If you need help, create an issue in this repo or reach out to the maintainer.


