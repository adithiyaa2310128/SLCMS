# 🎓 SLCMS — Student Lifecycle Management System

> A full-stack web application for managing the complete student lifecycle — from lead capture to alumni connect — built with **Angular 21**, **Node.js / Express 5**, and **MongoDB**.

---

## 📋 Table of Contents

- [Overview](#-overview)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Modules](#-modules)
- [Prerequisites](#-prerequisites)
- [Installation](#-installation)
  - [1. Clone the Repository](#1-clone-the-repository)
  - [2. Backend Setup](#2-backend-setup)
  - [3. Frontend Setup](#3-frontend-setup)
- [Environment Variables](#-environment-variables)
- [Running the Application](#-running-the-application)
- [Seeding the Database](#-seeding-the-database)
- [API Reference](#-api-reference)
- [Troubleshooting](#-troubleshooting)

---

## 🧭 Overview

SLCMS is an administrative platform designed for educational institutions to manage all phases of a student's journey — from initial lead inquiry through admission, academics, finance, hostel, placements, and alumni engagement — in a single unified dashboard.

---

## 🛠 Tech Stack

| Layer      | Technology                                      |
|------------|-------------------------------------------------|
| Frontend   | Angular 21, TypeScript, Chart.js, Socket.IO     |
| Backend    | Node.js, Express 5, Socket.IO                   |
| Database   | MongoDB (via Mongoose 9)                        |
| Auth       | JWT (JSON Web Tokens), bcryptjs                 |
| Dev Tools  | Nodemon, Angular CLI 21, Vite (via Angular build)|

---

## 📁 Project Structure

```
SLCMS/
├── backend/                    # Node.js + Express API server
│   ├── controllers/            # Route handler logic
│   ├── middleware/             # Auth & other middleware
│   ├── models/                 # Mongoose data models
│   ├── routes/                 # Express route definitions
│   ├── services/               # Business logic / helpers
│   ├── seedAll.js              # Master database seeder
│   ├── seedAdmin.js            # Admin user seeder
│   ├── server.js               # Application entry point
│   ├── .env                    # Environment variables (do not commit)
│   └── package.json
│
└── frontend/
    └── frontend-app/           # Angular 21 SPA
        ├── src/
        │   ├── app/
        │   │   ├── layout/     # Sidebar, shell layout components
        │   │   ├── pages/      # Feature page components (17 modules)
        │   │   ├── services/   # Angular HTTP/data services
        │   │   ├── app.routes.ts
        │   │   └── app.config.ts
        │   ├── index.html
        │   ├── main.ts
        │   └── styles.css
        └── package.json
```

---

## 📦 Modules

| Module          | Description                                              |
|-----------------|----------------------------------------------------------|
| **Dashboard**   | Real-time stats, charts, and system health summary       |
| **Students**    | Student records, profiles, and lifecycle tracking        |
| **Leads**       | Prospective student lead capture and follow-up           |
| **Admissions**  | Admission application review and status management       |
| **Attendance**  | Daily attendance marking and report generation           |
| **Marks**       | Exam marks entry and academic performance tracking       |
| **Academics**   | Course management, syllabus, and timetable               |
| **Exams**       | Exam scheduling, seating, and result management          |
| **Finance**     | Fee collection, dues tracking, and receipts              |
| **Campus**      | Hostel room allocation and facility management           |
| **Placements**  | Placement drives, company visits, and offer tracking     |
| **Alumni**      | Alumni directory, events, and engagement                 |
| **Analytics**   | Reports, visual analytics, and data insights             |
| **Announcements**| Institution-wide notices and communications             |
| **Login / Register** | JWT-based authentication                           |

---

## ✅ Prerequisites

Make sure the following are installed on your machine before proceeding:

| Tool            | Version (Minimum) | Download                                        |
|-----------------|-------------------|-------------------------------------------------|
| **Node.js**     | 18.x or higher    | https://nodejs.org/                             |
| **npm**         | 9.x or higher     | Bundled with Node.js                            |
| **MongoDB**     | 6.x or higher     | https://www.mongodb.com/try/download/community  |
| **Angular CLI** | 21.x              | `npm install -g @angular/cli`                   |
| **Git**         | Any               | https://git-scm.com/                            |

> **Windows users:** It is recommended to use **PowerShell** or **Windows Terminal** for running the commands below.

---

## 🚀 Installation

### 1. Clone the Repository

```bash
git clone https://github.com/<your-username>/SLCMS.git
cd SLCMS
```

---

### 2. Backend Setup

```bash
# Navigate to the backend directory
cd backend

# Install all Node.js dependencies
npm install

# Create your environment file (see Environment Variables section)
copy .env.example .env      # Windows
# cp .env.example .env      # macOS / Linux

# Edit .env with your MongoDB URI and JWT secret (see below)
```

---

### 3. Frontend Setup

```bash
# Navigate to the frontend directory
cd ../frontend/frontend-app

# Install all Angular dependencies
npm install
```

> **Note:** If you encounter a `zone.js` Vite resolution error, run:
> ```bash
> npm install zone.js
> ```

---

## 🔐 Environment Variables

Create a `.env` file in the `backend/` directory with the following variables:

```env
# Server
PORT=3000

# MongoDB connection string
# For local MongoDB:
MONGO_URI=mongodb://localhost:27017/slcms
# For MongoDB Atlas (cloud), replace with your Atlas URI:
# MONGO_URI=mongodb+srv://<user>:<password>@cluster.mongodb.net/slcms

# JWT secret key (change this to a long, random string in production)
JWT_SECRET=your_super_secret_key_here
```

> ⚠️ **Never commit your `.env` file.** It is already listed in `.gitignore`.

---

## ▶️ Running the Application

You need **two terminal sessions** running simultaneously — one for the backend, one for the frontend.

### Terminal 1 — Start the Backend

```bash
cd backend

# Production start
npm start

# Development start (with auto-reload via nodemon)
npm run dev
```

The API server will start at: **http://localhost:3000**

Health check: `GET http://localhost:3000/` → `SLCMS Backend 🚀 — All systems operational`

---

### Terminal 2 — Start the Frontend

```bash
cd frontend/frontend-app

npm start
# or equivalently:
npx ng serve
```

The Angular app will be available at: **http://localhost:4200**

---

## 🌱 Seeding the Database

To populate the database with sample data for all modules (students, leads, admissions, exams, fees, placements, hostel, alumni, announcements, etc.):

```bash
cd backend

# Seed everything (recommended for first-time setup)
node seedAll.js

# Seed admin user only
node seedAdmin.js

# Seed alumni records only
node seedAlumni.js
```

> Make sure your MongoDB instance is running and `MONGO_URI` is set correctly before seeding.

---

## 🔌 API Reference

All API routes are prefixed with `/api`.

| Endpoint               | Description               |
|------------------------|---------------------------|
| `GET  /`               | Health check              |
| `/api/auth`            | Login / Register          |
| `/api/students`        | Student CRUD              |
| `/api/attendance`      | Attendance records        |
| `/api/marks`           | Marks management          |
| `/api/risk`            | At-risk student reports   |
| `/api/leads`           | Lead management           |
| `/api/admissions`      | Admission applications    |
| `/api/courses`         | Course management         |
| `/api/exams`           | Exam scheduling           |
| `/api/fees`            | Fee and finance           |
| `/api/placements`      | Placement drives          |
| `/api/hostel`          | Hostel / campus           |
| `/api/announcements`   | Announcements             |
| `/api/alumni`          | Alumni directory          |
| `/api/analytics`       | Analytics and reports     |
| `/api/dashboard`       | Dashboard stats           |

---

## 🛠 Troubleshooting

### MongoDB connection fails
- Ensure MongoDB is running: `mongod` (or start via MongoDB Compass / Atlas)
- Verify `MONGO_URI` in your `.env` file is correct

### `zone.js` Vite resolution error
```bash
cd frontend/frontend-app
npm install zone.js
```

### Angular CLI not found
```bash
npm install -g @angular/cli
```

### Port already in use
- Backend (3000): kill the process using `npx kill-port 3000`
- Frontend (4200): kill the process using `npx kill-port 4200`

### JWT errors on login
- Make sure `JWT_SECRET` in `.env` matches the value used when tokens were issued
- Clear browser `localStorage` and try logging in again

---

## 📄 License

This project is for academic and internal institutional use. All rights reserved.
