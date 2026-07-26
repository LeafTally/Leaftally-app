# LeafTally — Database layer

## Current state (v1 — single-file prototype)
All data lives in JavaScript objects in `src/data/*.js`.
These are in-memory seed files that reset on each page load.

## Production path
Replace each `window.X = [...]` in `src/data/*.js` with API calls:

```js
// Before (seed data)
window.CUSTOMERS_DB = [{id:'C-001', name:'Dangote Foods Ltd', ...}];

// After (production API)
fetch('/api/v1/customers')
  .then(r => r.json())
  .then(data => { window.CUSTOMERS_DB = data; });
```

## Suggested schema

### migrations/
SQL migration files for the production database (PostgreSQL recommended).

### seeds/
Seed data in SQL format matching the JS objects in src/data/.
