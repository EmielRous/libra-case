# Project README (Node.js + React + Nest + Prisma)

## 🚀 Overview

This project is a full-stack application built with:

* **NestJS** — backend API
* **React (Vite)** — frontend UI
* **Prisma** — ORM
* **PostgreSQL** — database

The repository is structured so that:

* The **backend** lives in `/backend` (its own Yarn project)
* The **frontend** lives in `/src` (its own Yarn project)
* Environment variables live in `/backend/.env`

---

## 🛠 Prerequisites

Install:

* **Node.js (LTS)**
* **Yarn**
* **PostgreSQL**

---

## 🔐 Environment Variables (Backend)

Create `/backend/.env`:

```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/libra-case?schema=public"
OPENAI_API_KEY=your-openai-key
```

---

## 📦 Install Dependencies

### Backend

```bash
cd backend
yarn
```

### Frontend

```bash
cd src
yarn
```

---

## 🗃 Setting Up Prisma (IMPORTANT)

Make sure to create an empty database called `libra-case` before doing this!

Then Run from **/backend**:

```bash
cd backend

# Apply migrations
yarn prisma migrate dev

# Generate Prisma client
yarn prisma generate
```

Re-run both whenever you change `schema.prisma`.

---

## ▶️ Running the Project

### Backend (NestJS)

```bash
cd backend
yarn start:dev
```

### Frontend (Vite + React)

```bash
cd src
yarn dev
```

Typical URLs:

* API → `http://localhost:3000`
* Frontend → (Vite will print it, usually `http://localhost:5173`)

---

## 📝 Notes & Troubleshooting

* Ensure PostgreSQL is running and matches the `DATABASE_URL`.
* If migrations fail, verify DB permissions and database existence.
* After Prisma schema updates:

```
yarn prisma migrate dev
yarn prisma generate
```