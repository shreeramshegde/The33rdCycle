# CHRONOS Submission Portal — "The 33rd Cycle"

> **Event:** The 33rd Cycle — Technical Investigation Competition  
> **Organized by:** NIE IEEE Student Branch (NISB)  
> **Date:** 28 October 2026 | Sir M V Hall, NIE South Campus  
> **Architecture:** Distributed Monorepo (`backend/` + `frontend/`)  

---

## 1. Project Overview

The **CHRONOS Submission Portal** is a high-speed, secure answer verification and scoring platform built for "The 33rd Cycle" campus investigation event.

* **Physical + Digital Hybrid:** Physical clue envelopes and forensic case files are distributed in-person to teams across campus checkpoints.
* **Instant Verification:** The web portal replaces manual Google Forms with an automated, instant pattern-matching engine.
* **Zero-Leak Design:** The team-facing web interface contains zero questions, zero answer keys, and zero administrative panels.
* **Headless Admin via Swagger:** IEEE Core organizers manage live scoring, checkpoints, leaderboard rankings, and portal freeze states directly through **Swagger UI (`/swagger-ui.html`)**.

---

## 2. Monorepo Architecture & Branch Strategy

```
Website/
├── ReadMe.md              # Global Project Documentation
├── backend/               # Spring Boot 3.3.4 REST API (Java 17, NeonDB, Docker, Swagger)
└── frontend/              # React 18 + Tailwind CSS Team Portal (Coming in feature/frontend)
```

### Git Branching Model:
* **`main`**: Production-ready, stable releases.
* **`feature/backend`**: Spring Boot 3.3 microservice, JPA entities, tolerant normalizer, Docker multi-stage build, and NeonDB integration.
* **`feature/frontend`**: React 18 + Vite + Tailwind CSS mobile-first client.

---

## 3. Technology Stack

| Layer | Technology | Deployment Target |
| :--- | :--- | :--- |
| **Backend API** | Java 17, Spring Boot 3.3.4, Spring Security 6, JJWT | Docker Container on **Render.com** |
| **Database** | PostgreSQL 16 (Serverless with Connection Pooling) | **NeonDB** (Singapore Region) |
| **Admin Cockpit** | SpringDoc OpenAPI 2.6.0 (Interactive Swagger UI) | Hosted at `/swagger-ui.html` |
| **Frontend Client**| React 18, Vite, Tailwind CSS, Lucide React | **Vercel** / Render Static |

---

## 4. Key Investigation Checkpoints & Answers

| Stage Code | Title | Concept | Target Answer |
| :--- | :--- | :--- | :--- |
| `ROUND_0` | Incident Log Calibration | Clock Drift Offset | `11:59:33` |
| `CP_1` | The Last Transmission | Hamming (7,4) Code | `2056` |
| `CP_2` | The Unreliable Witness | RSA Digital Signature | `RECORD3` |
| `CP_3` | The CHRONOS Terminal | Finite State Machine (FSM) | `1101` |
| `CP_4` | The Secondary Override | Logic Gates + RC Timing | `CH-0-33` |
| `CP_5` | The Archival Grid | Sudoku Proof-of-Work | `1984` |

---

## 5. Getting Started

### Local Backend Development:
```bash
cd backend
mvn clean spring-boot:run
```
* **API Healthcheck:** `http://localhost:8080/api/health`
* **Swagger Admin UI:** `http://localhost:8080/swagger-ui.html`

---

## 6. License & Credits
Developed for **NIE IEEE Student Branch (NISB)**. All rights reserved.
