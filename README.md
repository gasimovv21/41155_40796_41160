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


## Key Features

- **🔐 User Registration and Authentication**: 
    - Secure user registration and login functionality.
    - Email and password validation with custom error handling.
    - Token refresh & blacklist for secure logout and session management.
- **🔁 Password Management**: 
    - Change password functionality for authenticated users.
    - Password reset via email with secure token-based links.
- **💰 Currency Account Management**:
  - Default PLN account creation upon registration.
  - Users can create, rename, or delete additional currency accounts.
  - Protection against deletion of default PLN accounts or accounts with non-zero balances.
- **💱 Currency Conversion**:
  - Live exchange rates fetched from the official NBP API.
  - Support for 10+ currencies (e.g., USD, EUR, GBP, etc.).
  - Real-time conversion updates both source and target balances automatically.
- **📊 Transaction and History Tracking**:
  - Detailed transaction logs: deposits, withdrawals, and conversions.
  - Filter transactions by date or specific user account.
  - Access full history for transparent account activity.
- **➕ Deposits**:
  - Deposit funds into any available currency account.
  - Deposit records are stored and available in the history view.
- **🧮 Currency Calculator**:
  - Public, simple exchange rate calculator available on the home page.
  - Doesn’t require authentication. Useful for quick lookups.

## 🛠 Tech Stack
- **Frontend:** Next.js, React, SCSS, React Bootstrap
- **Backend:** Python, Django REST Framework
- **Database:** PostgreSQL (in production), SQLite (dev fallback)
- **Authentication:** JWT
- **CI/CD & Containerization:** Docker, Docker Compose
- **Testing:** Pytest
- **API Communication:** RESTful, Axios
- **Real-Time API:** Integration with NBP API for live currency exchange rates

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
    EMAIL_BACKEND=django.core.mail.backends.smtp.EmailBackend
    EMAIL_HOST=smtp.gmail.com
    EMAIL_PORT=587
    EMAIL_USE_TLS=True
    DEFAULT_FROM_EMAIL=your_email@gmail.com

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

---

## 🚀 Usage

### 👤 User Management
- Register via `/api/register/`
- Log in to receive JWT access/refresh tokens
- Secure routes require Authorization headers
- Password reset links sent via email

### 💼 Currency Accounts
- Default PLN account created on registration
- Manage other accounts like USD, EUR, GBP etc.
- View transaction/deposit history

### 💸 Currency Conversion
- Use real-time exchange rates from NBP
- Convert using `/api/currency-accounts/convert/<id>/`

### 💳 Deposit Management
- Deposit into any account using `/deposit/<id>/`
- Track deposit records per account

---

## 📡 API Endpoints

### 🔐 User Management
| Method | Endpoint                  | Description               |
|--------|---------------------------|---------------------------|
| POST   | `/api/register/`          | Register new user         |
| POST   | `/api/login/`             | Login user                |
| POST   | `/api/logout/`            | Logout user               |
| POST   | `/api/forgot-password/` | Send password reset email |

### 💰 Currency Accounts
| Method | Endpoint                          | Description                     |
|--------|-----------------------------------|---------------------------------|
| GET    | `/api/currency-accounts/`         | List all accounts               |
| POST   | `/api/currency-accounts/`         | Create new account              |
| PUT    | `/api/currency-accounts/<id>/`    | Update account                  |
| DELETE | `/api/currency-accounts/<id>/`    | Delete account                  |
| GET    | `/api/currency-accounts/user/<id>/` | User’s accounts               |

### 💱 Currency Conversion
| Method | Endpoint                                | Description                   |
|--------|-----------------------------------------|-------------------------------|
| POST   | `/api/currency-accounts/convert/<id>/` | Convert currency              |
| GET    | `/api/currency-accounts/convert/<id>/` | View user transaction history |

### ➕ Deposits
| Method | Endpoint                                | Description                       |
|--------|-----------------------------------------|-----------------------------------|
| POST   | `/api/currency-accounts/deposit/<id>/` | Deposit money                     |
| GET    | `/api/currency-accounts/deposit/<id>/` | View deposit history              |

### 📈 Account History
| Method | Endpoint                                | Description                       |
|--------|-----------------------------------------|-----------------------------------|
| GET    | `/api/currency-accounts/history/<id>/` | View full account transaction log |

---

## 📝 Notes

- **Default Currency Account**: PLN account is mandatory for all users.
- **NBP API**: Ensures real-time exchange accuracy.
- **Security**: JWT-based auth, password hashing, and email reset flows.