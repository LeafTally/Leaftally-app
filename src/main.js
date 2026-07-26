// ============================================================
// LeafTally ERP — main entry point
// ============================================================

// 1. Seed data  (replace with API calls in production)
import './data/users.js';
import './data/accounting.js';
import './data/products.js';
import './data/crm.js';
import './data/banking.js';
import './data/config.js';
import './data/superadmin.js';

// 2. Core runtime & utilities
import './utils/ui.js';
import './utils/table.js';
import './utils/finance.js';
import './utils/superadmin.js';

// 3. Navigation & auth (must load before modules)
import './utils/nav.js';

// 4. Panel builders — each module registers into window.BUILDERS
import './modules/dashboard.js';
import './modules/accounting.js';
import './modules/sales.js';
import './modules/purchases.js';
import './modules/hr.js';
import './modules/banking.js';
import './modules/inventory.js';
import './modules/settings.js';
import './modules/corporate.js';
import './modules/admin.js';
import './modules/superadmin.js';
import './modules/support.js';

// 5. Bootstrap — render shell & initialise app
import { bootstrap } from './app.js';
bootstrap();
