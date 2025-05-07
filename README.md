# 💱 Virtual Currency Exchange

## 📌 Project Description
Virtual Currency Exchange is a full-stack web application that allows users to:

- Convert between 10 different currencies using live exchange rates.
- Manage multiple currency accounts.
- Deposit/withdraw funds and track transaction history.
- Authenticate securely using JWT.

## 👨‍💻 Team
| Name                  | ID     | Role(s)                                                        |
|-----------------------|--------|----------------------------------------------------------------|
| Ahmet Artam           | 41155  | Frontend Developer                                             |
| Recep Enes Karatekin  | 40796  | Frontend Developer                                             |
| Eltun Gasimov         | 41160  | Backend Developer, Database Specialist, QA, Docs, PM          |

## 🛠 Tech Stack
- **Frontend:** Next.js, React, SCSS, React Bootstrap
- **Backend:** Python, Django REST Framework
- **Database:** PostgreSQL (in production), SQLite (dev fallback)
- **Authentication:** JWT
- **CI/CD & Containerization:** Docker, Docker Compose
- **Testing:** Pytest
- **API Communication:** RESTful, Axios

---

## 🚀 How to Run the Project Locally

### ✅ Prerequisites
- Docker
- Docker Compose
- Node.js (for running frontend manually)
- Python 3.11+ (only if you want to run backend outside Docker)

---

### ⚙️ Backend (Django + PostgreSQL)

1. **Clone the repository**
   ```bash
   git clone https://github.com/gasimovv21/41155_40796_41160.git
   cd 41155_40796_41160

2. **Create a .env file in the root directory**
   ```bash
    # Django
    SECRET_KEY=your_django_secret_key
    DEBUG=False
    ALLOWED_HOSTS=localhost,127.0.0.1

    # Email config
    EMAIL_HOST_USER=your_email@gmail.com
    EMAIL_HOST_PASSWORD=your_app_password

    # PostgreSQL
    POSTGRES_DB=currencydb
    POSTGRES_USER=currencyuser
    POSTGRES_PASSWORD=currencypass
    POSTGRES_HOST=db
    POSTGRES_PORT=5432

    # Frontend API URLs
    NEXT_PUBLIC_BASE_URL=http://localhost/api
    NEXT_PUBLIC_BANK_API_BASE_URL=https://api.nbp.pl/api
    AUTH_SECRET=your_auth_secret

3. **Start backend & database with Docker**
   ```bash
   docker-compose up --build

This will:

- Run DB migrations

- Collect static files

- Serve Django via Gunicorn on port 8000

- Serve static files via nginx on port 80


### 🌐 Frontend (Next.js)
- 🔧 The frontend is now run manually (not containerized).

1. **Navigate to project root**
   ```bash
   cd 41155_40796_41160


2. **Install dependencies**
   ```bash
   npm install

3. **Start development server**
   ```bash
   npm run dev

- The app will be available at: http://localhost:3000

### 🧪 Testing (Optional)

1. **To run unit tests for Django backend:**
   ```bash
   docker-compose exec backend pytest
