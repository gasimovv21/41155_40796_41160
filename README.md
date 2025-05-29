# 💱 Virtual Currency Exchange

## 📌 Project Description
Virtual Currency Exchange is a full-stack web application that allows users to:

- Convert between 9 currencies using live exchange rates.
- Manage multiple currency accounts and linked credit cards.
- Deposit, withdraw (including to credit cards), and track full transaction history.
- Register securely with a secret key, accept terms, and manage sessions with JWT.

## 👨‍💻 Team
| Name                  | ID     | Role(s)                                                        |
|-----------------------|--------|----------------------------------------------------------------|
| Ahmet Artam           | 41155  | Frontend Developer                                             |
| Recep Enes Karatekin  | 40796  | Frontend Developer                                             |
| Eltun Gasimov         | 41160  | Backend Developer, Database Specialist, QA, Docs, PM          |

---

## ✨ Key Features

- **🔐 User Registration and Authentication**: 
  - Secure signup/login with JWT.
  - Terms acceptance and secret key required at registration.
  - Token refresh, blacklist, and secure logout supported.

- **🛡️ Secret Key Management**:
  - Secret key is required for sensitive operations (e.g. account updates).

- **🔁 Password & Session Management**: 
  - Password change and reset via email token.
  - Email/password validation and custom error feedback.

- **💼 Currency Account Management**:
  - PLN account created by default.
  - Create, rename, or delete other accounts (except default or non-empty ones).

- **💳 Credit Card Integration**:
  - Add up to **3 credit cards** per user.
  - Toggle visibility, delete, and manage cards via a modal interface.
  - Withdraw directly to linked cards (PLN or other currencies supported).

- **💱 Currency Conversion**:
  - Real-time exchange via NBP API.
  - Automatically updates both source and target accounts.

- **💸 Withdrawals**:
  - Withdraw to same-currency accounts or linked cards (multi-currency supported).
  - UI/logic enhancements to prevent invalid actions.

- **➕ Deposits**:
  - Add funds to any currency account.
  - Deposits logged with timestamps in history.

- **📊 Transaction History**:
  - Track all operations: deposits, conversions, withdrawals.
  - Filter by date or account.

- **🧮 Currency Calculator**:
  - Public rate calculator available on the homepage.
  - Improved UX and input behavior.
  - No login required.

---

## 🛠 Tech Stack
- **Frontend:** Next.js, React, SCSS, React Bootstrap
- **Backend:** Python, Django REST Framework
- **Database:** PostgreSQL (prod), SQLite (dev)
- **Authentication:** JWT + secret key
- **Containerization:** Docker, Docker Compose
- **Testing:** Pytest
- **API:** RESTful, fetch()
- **Live Rates:** NBP API

---

## 🚀 How to Run the Project Locally

### ✅ Prerequisites
- Docker, Docker Compose
- Node.js (for frontend)
- Python 3.11+ (if running backend outside Docker)

---

### ⚙️ Backend (Django + PostgreSQL)

1. **Clone repo**
   ```bash
   git clone https://github.com/gasimovv21/41155_40796_41160.git
   cd 41155_40796_41160
   ```

2. **Create `.env`**
   ```bash
   # Django
   SECRET_KEY=your_django_secret_key
   DEBUG=False
   ALLOWED_HOSTS=localhost,127.0.0.1

   # Email
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

   # Frontend
   NEXT_PUBLIC_BASE_URL=http://localhost/api
   NEXT_PUBLIC_BANK_API_BASE_URL=https://api.nbp.pl/api
   AUTH_SECRET=your_auth_secret
   ```

3. **Start Backend**
   ```bash
   docker-compose up --build
   ```

### 🌐 Frontend (Next.js)

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Run app**
   ```bash
   npm run dev
   ```

> Frontend: http://localhost:3000

---

### 🧪 Testing (Backend)
```bash
docker-compose exec backend pytest
```

---

## 🚀 Usage

### 👤 User Management
- Register via `/api/register/` using email, password, secret key, and accept terms.
- Log in to receive JWT access and refresh tokens.
- Use Authorization headers for protected endpoints.
- Reset password using the email token flow via `/api/forgot-password/`.

### 💼 Currency Accounts
- Default PLN account is automatically created.
- Users can add accounts in supported currencies (e.g., USD, EUR).
- Rename or delete non-default and empty accounts.

### 💱 Currency Conversion
- Convert between supported currencies using live NBP exchange rates.
- Update balances instantly via `/api/currency-accounts/convert/<id>/`.

### 💳 Card Management & Withdrawals
- Add up to 3 credit cards per user via `/api/cards/`.
- Withdraw to linked cards or other accounts.
- Withdrawals available in PLN and other currencies.

### ➕ Deposits
- Deposit funds into any active account via `/api/currency-accounts/deposit/<id>/`.

### 📈 History & Tracking
- All transactions (deposits, conversions, withdrawals) are logged.
- Use `/api/currency-accounts/history/<id>/` to view full history per account.

---

## 📡 API Endpoints

### 🔐 Auth & User
| Method | Endpoint                    | Description               |
|--------|-----------------------------|---------------------------|
| POST   | `/api/register/`            | Register with secret key |
| POST   | `/api/login/`               | JWT Login                 |
| POST   | `/api/logout/`              | Invalidate tokens         |
| POST   | `/api/forgot-password/`     | Request password reset    |

---

### 💼 Currency Accounts
| Method | Endpoint                                 | Description                |
|--------|------------------------------------------|----------------------------|
| GET    | `/api/currency-accounts/`                | List user accounts         |
| POST   | `/api/currency-accounts/`                | Create account             |
| PUT    | `/api/currency-accounts/<id>/`           | Rename account             |
| DELETE | `/api/currency-accounts/<id>/`           | Delete account             |
| GET    | `/api/currency-accounts/user/<id>/`      | List accounts by user ID   |

---

### 💱 Currency Conversion
| Method | Endpoint                                     | Description               |
|--------|----------------------------------------------|---------------------------|
| POST   | `/api/currency-accounts/convert/<id>/`       | Convert between currencies|
| GET    | `/api/currency-accounts/convert/<id>/`       | View conversion history   |

---

### 💳 Credit Cards
| Method | Endpoint                            | Description                   |
|--------|-------------------------------------|-------------------------------|
| GET    | `/api/cards/`                       | List user cards               |
| POST   | `/api/cards/`                       | Add a new card (max 3)        |
| DELETE | `/api/cards/<id>/`                  | Delete card                   |

---

### 💸 Withdrawals & Deposits
| Method | Endpoint                                      | Description                     |
|--------|-----------------------------------------------|---------------------------------|
| POST   | `/api/currency-accounts/withdraw/<id>/`       | Withdraw to card/account        |
| GET    | `/api/currency-accounts/withdraw/<id>/`       | View withdrawal history         |
| POST   | `/api/currency-accounts/deposit/<id>/`        | Deposit funds                   |
| GET    | `/api/currency-accounts/deposit/<id>/`        | View deposit history            |

---

### 📈 Account History
| Method | Endpoint                                       | Description                    |
|--------|------------------------------------------------|--------------------------------|
| GET    | `/api/currency-accounts/history/<id>/`         | Full account activity log      |

---

## 📝 Notes

- **Secret Key**: Mandatory for registration and account updates.
- **PLN Account**: Cannot be deleted; auto-created for all users.
- **NBP Integration**: Ensures up-to-date, real-time exchange rates.
- **Card Limit**: Max 3 active cards per user.
