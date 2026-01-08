# 🍅 TomatoTasks — Gamified Task Manager

🚀 **Live App:** https://d2wqd79662c6xg.cloudfront.net

TomatoTasks is a **full-stack productivity web application** that turns everyday task completion into a **tomato-growing game**.  
Complete tasks to grow tomatoes 🌱, miss deadlines and your garden suffers 🌫️🌿 — making productivity both visual and motivating.

Built with **Spring Boot 3**, **React**, and **MySQL**, and deployed on **AWS (EC2 + S3 + Nginx)** with JWT-based authentication and real-time UI feedback.

---

## ✨ Features

### 🔐 Authentication & Security
- JWT-based authentication (login & registration)
- Secure password hashing with BCrypt
- Role-aware, protected API routes
- Environment-specific security configs (local vs prod)

### ✅ Task Management
- Create, edit, delete, and complete tasks
- Task priorities & optional due times
- Overdue tasks automatically trigger punishments
- RESTful backend API with validation

### 🌱 Gamified Garden System
- Completing tasks grows tomatoes 🍅
- Missing deadlines triggers visual punishments:
  - 🌫️ Fog layers
  - 🌿 Weeds
  - 🍂 Wilted leaves
- Completing tasks resolves punishments dynamically
- Toast animations and real-time garden updates

### 🎨 Frontend UX
- Responsive garden layout (desktop & mobile)
- Animated tomato gain & punishment resolution
- Fog-level warning overlay when visibility is too low
- Clean, modern UI with React hooks (`useState`, `useEffect`)

---

## 🧱 Tech Stack

### Backend
- **Java 21**
- **Spring Boot 3**
- Spring Security + JWT
- MySQL (JPA / Hibernate)
- Maven

### Frontend
- **React**
- TypeScript
- Vite
- CSS animations & responsive layout

### Infrastructure & Deployment
- **AWS EC2** — backend hosting
- **AWS S3** — frontend static hosting
- **Nginx** — reverse proxy & HTTPS
- GitHub Actions — CI/CD
- MySQL running in Docker on EC2

---

## 🏗️ Architecture Overview

```text
React (S3)
   |
   | HTTPS
   v
Nginx (EC2)
   |
   v
Spring Boot API (EC2)
   |
   v
MySQL (Docker)
