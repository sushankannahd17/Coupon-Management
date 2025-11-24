# Coupon Management API

## 1) Project Overview
A Node.js + Express backend that stores coupons in MongoDB and computes the **best applicable coupon** for a given user and cart. It validates date windows, user/cart eligibility, and calculates discounts (FLAT or PERCENT with optional max cap). Returns the single best coupon by **highest discount**, then **earliest endDate**, then **lexicographically smaller code** if still tied.

---

## 2) Tech Stack
- **Language:** JavaScript (Node.js)
- **Framework:** Express.js
- **Database:** MongoDB Atlas (via Mongoose)
- **Key Libraries:** `mongoose`, `express`, `express-validator`, `dotenv`, `cors`, `nodemon` (dev)

---

## 3) How to Run

### Prerequisites
- Node.js **v18+**
- A MongoDB Atlas cluster & connection string
- Git & npm

### Setup
1. **Clone & install**
   ```bash
   git clone <your-repo-url>
   cd <your-project-folder>
   npm install
   ```

2. **Environment variables** — create a `.env` in the project root:
   ```env
   PORT=3000
   MONGO_URI=mongodb+srv://<user>:<password>@<cluster>/<db>?retryWrites=true&w=majority&appName=Cluster0
   ```

3. **Start**
   ```bash
   npm start
   ```

Service will run on `http://localhost:3000` (or the port set by the host).

> **Note:** Ensure your `server.js` uses `process.env.PORT` and calls `require("dotenv").config()` at the top.

---

## 4) API Endpoints

### Create Coupon
**POST** `api/coupons/create_coupon`  
Create a coupon document in MongoDB.

**Body example**
```json
{
  "code": "WELCOME60",
  "description": "60% OFF for new users",
  "discountType": "PERCENT",
  "discountValue": 60,
  "maxDiscountAmount": 300,
  "startDate": "2025-01-01T00:00:00.000Z",
  "endDate": "2025-12-31T00:00:00.000Z",
  "usageLimitPerUser": 2,
  "eligibility": {
    "user": {
      "allowedUserTiers": ["NEW"],
      "minLifetimeSpend": 0,
      "minOrdersPlaced": 0,
      "firstOrderOnly": true,
      "allowedCountries": ["IN"]
    },
    "cart": {
      "minCartValue": 500,
      "applicableCategories": ["ELECTRONICS", "BOOKS"],
      "excludedCategories": [],
      "minItemsCount": 1
    }
  }
}
```

### Best Coupon
**POST** `api/coupon/bestCoupon`  
Computes the best coupon for the user + cart.

**Body example**
```json
{
  "user": {
    "userId": "u123",
    "userTier": "NEW",
    "country": "IN",
    "lifetimeSpend": 2000,
    "ordersPlaced": 0
  },
  "cart": {
    "items": [
      { "productId": "p1", "category": "ELECTRONICS", "unitPrice": 1500, "quantity": 1 },
      { "productId": "p2", "category": "BOOKS", "unitPrice": 800, "quantity": 1 }
    ]
  }
}
```

**Response example**
```json
{
  "bestCoupon": {
    "code": "WELCOME60",
    "discount": 300
  }
}
```
If none apply:
```json
{ "bestCoupon": null }
```

---

## 5) How to Run Tests (optional)
If you add tests (e.g., Jest), include scripts in `package.json`:
```json
"scripts": {
  "test": "jest"
}
```
Run:
```bash
npm test
```

---

## 6) Demo Login (Required by Assignment)
Seed a demo user in your hosted DB so reviewers can log in without registering:

```
Email:    hire-me@anshumat.org
Password: HireMe@2025!
```

> If your auth hashes passwords, be sure to store a **bcrypt hash** of the password in the database.

---

## 7) Deployment (Render.com)
- Push your repo to GitHub.
- On Render: **New → Web Service → Connect repo**.
- **Build command:** `npm install`
- **Start command:** `npm start`
- Set environment variables in Render dashboard (e.g., `MONGO_URI`, `PORT`).
- Ensure CORS is enabled if calling from a frontend:
  ```js
  const cors = require("cors");
  app.use(cors());
  ```

---

## 8) Folder Structure (suggested)
```
/
├─ server.js
├─ app.js
├─ src/
│  ├─ models/
│  ├─ service/
│  ├─ controller/
│  ├─ router/
│  └─ middleware/
├─ package.json
└─ README.md
```

---

## 9) Notes
- `usageLimitPerUser` usually requires tracking per-user coupon usage; if not provided by inputs, it can be omitted from validation.
- `applicableCategories` is an **ALL-match** in this implementation: every cart category must appear in the coupon’s allowed list.
- PERCENT discounts are capped by `maxDiscountAmount` when provided.

---
