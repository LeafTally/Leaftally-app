// ============================================================
// LeafTally — DASHBOARD module
// ============================================================

/* global BUILDERS, PICKLISTS, GL_ACCOUNTS, PRODUCTS, */
/* global CUSTOMERS_DB, SUPPLIERS_DB, JOURNAL_LEDGER, */
/* global currentUser, openDrawer, closeDrawer, toast, */
/* global filterTable, filterByCol, sortTable, setupTableDefaults */

// ── dashboard ──────────────────────────────────────
BUILDERS.dashboard = function(panel) { renderDashboard(panel); }
