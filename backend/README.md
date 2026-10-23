# CHRONOS Submission Portal — Backend Service

**Event:** "The 33rd Cycle" (NIE IEEE Student Branch)  
**Technology:** Java 17 | Spring Boot 3.3.4 | Spring Security 6 | PostgreSQL (NeonDB) | Swagger UI | Docker  

---

## 1. Quick Start (Local Run)

### Prerequisites:
* Java 17 or higher
* Maven 3.8+ (or run via Docker)

### Run with Maven:
```bash
mvn clean spring-boot:run
```

Once started:
* **API Health Check:** `http://localhost:8080/api/health`
* **Swagger UI (Admin Cockpit):** `http://localhost:8080/swagger-ui.html`

---

## 2. Admin Operations via Swagger UI (`/swagger-ui.html`)

1. Open `http://localhost:8080/swagger-ui.html` (or your Render URL).
2. Execute `POST /api/auth/admin/login` with:
   ```json
   {
     "username": "admin",
     "password": "admin123"
   }
   ```
3. Copy the returned `token`.
4. Click the green **Authorize 🔓** button at the top of Swagger UI.
5. Paste the token in the format: `Bearer YOUR_TOKEN_HERE` (or just the token).
6. Now you can:
   * View live team leaderboard: `GET /api/admin/leaderboard`
   * Stream live submissions: `GET /api/admin/live-submissions`
   * Freeze portal submissions at deadline: `POST /api/admin/portal/freeze`
   * Re-open portal submissions: `POST /api/admin/portal/unfreeze`
   * Register or delete teams: `POST /api/admin/teams`
   * Adjust team score (penalties/bonuses): `POST /api/admin/score/adjust`
   * Edit answers: `PUT /api/admin/checkpoints/{id}`

---

## 3. Team Endpoints (Used by React Frontend)

* `POST /api/auth/team/login` $\to$ Returns JWT token for team.
* `GET /api/portal/status` $\to$ Returns team progress and score across the 6 checkpoints.
* `POST /api/portal/submit` $\to$ Validates answer against ground truth.

---

## 4. Deploying to Render.com via Docker

1. Push this `backend/` folder to your GitHub repository.
2. In Render Dashboard (`dashboard.render.com`), click **New +** $\to$ **Web Service**.
3. Connect your GitHub repository.
4. Set:
   * **Runtime:** `Docker`
   * **Root Directory:** `backend` (if in subfolder) or `.` (if repo root)
   * **Instance Type:** `Free`
5. Add Environment Variables:
   * `SPRING_DATASOURCE_URL`: `jdbc:postgresql://ep-hidden-moon-b38lb8pk-pooler.c-4.ap-southeast-1.aws.neon.tech/neondb?sslmode=require`
   * `SPRING_DATASOURCE_USERNAME`: `neondb_owner`
   * `SPRING_DATASOURCE_PASSWORD`: `npg_jertLTf6AV2D`
   * `JWT_SECRET`: `c3VwZXJzZWNyZXRjaHJvbm9zcHJvamVjdGtleTIwMjZpZWVlbmlzYm5zb2M=`
6. Click **Deploy Web Service**.
7. Render will build the multi-stage Docker image and provide your live HTTPS URL!
