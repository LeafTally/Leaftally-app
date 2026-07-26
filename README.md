# 🌿 LeafTally ERP

> Nigeria's enterprise accounting platform — FIRS-compliant e-invoicing, double-entry GL, PAYE payroll, multi-entity consolidation, and inventory management.

[![Deploy](https://github.com/your-org/leaftally/actions/workflows/deploy.yml/badge.svg)](https://github.com/your-org/leaftally/actions/workflows/deploy.yml)

---

## Quick start

```bash
# 1. Clone
git clone https://github.com/your-org/leaftally.git
cd leaftally

# 2. Install
npm install

# 3. Develop (hot-reload at http://localhost:5173)
npm run dev

# 4. Build single-file for Hostinger / static hosting
npm run build:standalone
# → dist/LeafTally_ERP.html
```

---

## Project structure

```
leaftally/
│
├── .github/
│   └── workflows/
│       ├── deploy.yml          # Build + deploy to GitHub Pages on push to main
│       └── pr-check.yml        # Validate every pull request
│
├── src/
│   ├── leaftally.html          # Source-of-truth single-file build (660 KB)
│   ├── main.js                 # ES module entry point
│   ├── app.js                  # Bootstrap / initialise
│   │
│   ├── components/             # UI components
│   │   ├── Login.js            # Login screen
│   │   ├── Shell.js            # App shell (sidebar + topbar + panels)
│   │   ├── Drawer.js           # Slide-in drawer
│   │   ├── Toast.js            # Toast notifications
│   │   └── Modal.js            # Confirm / alert modals
│   │
│   ├── modules/                # Panel builders (one file per feature group)
│   │   ├── dashboard.js        # Main dashboard
│   │   ├── accounting.js       # COA, GL, trial balance, P&L, balance sheet, cash flow ...
│   │   ├── sales.js            # Invoices, POS, clients
│   │   ├── purchases.js        # Bills, suppliers, shipments
│   │   ├── hr.js               # Employees, payroll (PAYE / pension / NHF)
│   │   ├── banking.js          # Bank accounts, reconciliation
│   │   ├── inventory.js        # Products, BOM, production orders, shared costing
│   │   ├── settings.js         # Company profile, accounting setup, currencies, picklists
│   │   ├── corporate.js        # Dimensions, audit trail, multi-entity, accountant partner
│   │   ├── admin.js            # Users, roles, subscription, billing
│   │   ├── superadmin.js       # SA dashboard, tenant management, subscription management
│   │   └── support.js          # Chat, tickets, training, legal
│   │
│   ├── data/                   # In-memory seed data (replace with API calls in production)
│   │   ├── users.js            # USERS_DB, ROLE_PERMISSIONS
│   │   ├── accounting.js       # GL_ACCOUNTS, JOURNAL_LEDGER, FINANCIAL_YEARS, BUDGET_DATA
│   │   ├── products.js         # PRODUCTS, BOM_DB, PROD_ORDERS_DB, COST_GROUPS
│   │   ├── crm.js              # CUSTOMERS_DB, SUPPLIERS_DB, SHIPMENTS_DB
│   │   ├── banking.js          # BANK_ACCOUNTS, BANK_TRANSACTIONS
│   │   ├── config.js           # PICKLISTS, PAGES, DIMENSIONS_DB, DOCS_DB
│   │   └── superadmin.js       # SA_TENANTS, PLAN_DEFS, SUB_REQUESTS, TENANT_USAGE ...
│   │
│   ├── utils/                  # Shared utility functions
│   │   ├── nav.js              # nav(), canAccess(), RBAC, login/logout, tour
│   │   ├── ui.js               # openDrawer(), closeDrawer(), toast(), openModal()
│   │   ├── table.js            # sortTable(), filterTable(), exportCSV(), bulk actions
│   │   ├── finance.js          # rebuildTrialBalance(), rebuildPnL(), rebuildBalanceSheet()
│   │   └── superadmin.js       # SA helpers: tenant CRUD, plan overrides, approval flow
│   │
│   └── styles/
│       ├── variables.css       # CSS custom properties (colours, spacing, typography)
│       └── components.css      # All UI components (cards, tables, forms, badges ...)
│
├── public/
│   └── index.html              # HTML shell for Vite build
│
├── database/
│   ├── migrations/             # SQL table definitions (PostgreSQL)
│   └── seeds/                  # Demo data in SQL format
│
├── docs/
│   └── ...                     # Architecture notes, API docs
│
├── scripts/
│   ├── build-standalone.js     # Bundles everything to one HTML file
│   └── validate.js             # Pre-build validation checks
│
├── package.json
├── vite.config.js
├── netlify.toml                # Netlify deployment config
├── vercel.json                 # Vercel deployment config
├── .env.example
└── .gitignore
```

---

## Demo accounts

| Role         | Email                       | Password      |
|--------------|-----------------------------|---------------|
| Tenant Admin | amaka@acmetrading.ng        | password123   |
| Accountant   | chukwu@acmetrading.ng       | password123   |
| HR Manager   | funmi@acmetrading.ng        | password123   |
| Cashier      | babatunde@acmetrading.ng    | password123   |
| Viewer       | viewer@acmetrading.ng       | password123   |
| Super Admin  | admin@leaftally.io          | password123   |

---

## Modules

| Module              | Features |
|---------------------|----------|
| **Accounting**      | Chart of accounts (50+ GL codes), double-entry journals with 8-rule validation, trial balance, P&L, balance sheet, cash flow, budget planner, revenue recognition (IFRS 15), year-end close, financial health ratios |
| **Sales**           | FIRS-compliant e-invoices, POS / retail sales, customer management, aged receivables |
| **Purchases**       | Supplier bills, purchase orders, landed costs, shipment tracking |
| **HR & Payroll**    | Employee register, PAYE (FIRS graduated), pension 8%, NHF 2.5%, payslip PDFs, bank payment files |
| **Inventory**       | Products & BOM, production orders, FIFO layers, shared / joint costing |
| **Banking**         | Bank accounts, statement import, reconciliation |
| **Settings**        | Company profile, accounting defaults, GL mapping, inventory costing method, currency management, picklists, notifications, ledger integrity check |
| **Corporate**       | Dimensions (dept / location / project / cost centre), audit trail, multi-entity consolidation, accountant partner portal |
| **Integrations**    | QuickBooks, Sage, Xero, Zoho Books import; Paystack, NIBSS, SendGrid, REST API |
| **Super Admin**     | Tenant management, plan definitions, subscription request approval, payment verification, user analytics, banners, release notes |

---

## Deployment

### GitHub Pages (automatic)
Push to `main` — the GitHub Actions workflow builds and deploys automatically.

### Hostinger / cPanel
```bash
npm run build:standalone
# Upload dist/LeafTally_ERP.html to public_html/index.html
```

### Netlify
Connect your repo → Netlify reads `netlify.toml` and deploys automatically.

### Vercel
```bash
vercel --prod
```

---

## Architecture notes

The application is a **single-page application (SPA)** built as a self-contained HTML file for maximum portability. All 55 panel builders are registered in `window.BUILDERS` and rendered lazily on first navigation. RBAC is enforced in the `nav()` function before any builder runs.

**Data layer** — all data is currently in-memory JavaScript objects. The `src/data/` files are the bridge to a future REST API; replace each `window.X = [...]` with a `fetch('/api/v1/X')` call.

**Authentication** — demo credentials are hard-coded in `USERS_DB`. In production, replace `doLogin()` in `src/utils/nav.js` with a call to your auth API (JWT / session cookie).

---

## Licence
Proprietary — © 2026 LeafTally Technologies Ltd. All rights reserved.
