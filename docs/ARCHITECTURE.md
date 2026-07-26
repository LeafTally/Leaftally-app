# LeafTally — Architecture overview

## Single-file build strategy

The application ships as `src/leaftally.html` — one self-contained file with all HTML, CSS, and JavaScript inlined. This was chosen for:
- **Zero server dependency** — works from file:// or any static host
- **Easy Hostinger / cPanel deployment** — upload one file
- **No build step required** for the demo/prototype phase

## Module system

All 55 panel builders are registered on `window.BUILDERS`:

```js
window.BUILDERS = {};
window.BUILDERS.coa = function(panel) { panel.innerHTML = '...'; };
```

The `nav(el, id)` function:
1. Checks RBAC via `canAccess(id)`
2. Shows the target `<div id="p-{id}">` panel
3. Calls `BUILDERS[id](panel)` once (lazy — cached via `panel.dataset.built`)

## RBAC model

```
ROLE_PERMISSIONS = {
  'Tenant Admin': { coa:'admin', payroll:'admin', superadmin:'none', ... },
  'Accountant':   { coa:'read',  payroll:'read',  ... },
  ...
}
```

`canAccess()` is fail-open: unlisted panels return `true`. Only explicit `'none'` values block access.

## Data layer

All data lives in `window.X` globals, populated by `src/data/*.js` seed files.
Production migration path: replace seeds with `fetch()` calls.

## Subscription workflow

```
Tenant requests plan
       ↓
SUB_REQUESTS entry created (status: awaiting_payment)
       ↓
Tenant uploads receipt (status: payment_uploaded)
       ↓
SA verifies receipt + approves (status: approved)
       ↓
Tenant plan updated + activated
```
