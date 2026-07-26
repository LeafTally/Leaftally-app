// ============================================================
// LeafTally — SUPERADMIN module
// ============================================================

/* global BUILDERS, PICKLISTS, GL_ACCOUNTS, PRODUCTS, */
/* global CUSTOMERS_DB, SUPPLIERS_DB, JOURNAL_LEDGER, */
/* global currentUser, openDrawer, closeDrawer, toast, */
/* global filterTable, filterByCol, sortTable, setupTableDefaults */

// ── sadashboard ──────────────────────────────────────
BUILDERS.sadashboard = function(panel) {
  var p = window.SA_PLATFORM;
  panel.innerHTML =
    '<div class="alert alert-amber" style="margin-bottom:16px"><i class="ti ti-crown"></i><strong>Super Admin view</strong> — Platform-wide data across all tenants. Not visible to tenants.</div>' +
    '<div class="kpi-strip">' +
    '<div class="kpi-card"><div class="kpi-label">Total tenants</div><div class="kpi-value" style="color:var(--green-700)">' + p.totalTenants + '</div><div class="kpi-sub">' + p.activeTenants + ' active · ' + p.trialTenants + ' trial</div></div>' +
    '<div class="kpi-card"><div class="kpi-label">MRR</div><div class="kpi-value">₦' + (p.mrr/1000000).toFixed(2) + 'M</div><div class="kpi-sub stat-up">↑ ' + p.mrrGrowth + '% MoM</div></div>' +
    '<div class="kpi-card"><div class="kpi-label">Total users</div><div class="kpi-value">' + p.totalUsers + '</div><div class="kpi-sub">avg ' + p.avgUsersPerTenant + ' per tenant</div></div>' +
    '<div class="kpi-card"><div class="kpi-label">API calls today</div><div class="kpi-value" style="font-size:16px">' + (p.apiCallsToday/1000).toFixed(1) + 'K</div></div>' +
    '<div class="kpi-card"><div class="kpi-label">Storage used</div><div class="kpi-value">' + p.storageUsedGB + ' GB</div></div>' +
    '</div>' +
    '<div class="grid-2">' +
    '<div class="card">' +
    '<div class="card-hd"><span class="card-title">Recent tenant activity</span><button class="btn btn-sm" onclick="nav(null,\'superadmin\')"><i class="ti ti-arrow-right"></i>All tenants</button></div>' +
    window.SA_TENANTS.slice(0,5).map(function(t) {
      return '<div style="display:flex;align-items:center;gap:10px;padding:8px 0;border-bottom:1px solid var(--border)">' +
        '<div style="width:32px;height:32px;border-radius:8px;background:var(--green-50);border:1px solid var(--green-200);display:flex;align-items:center;justify-content:center;flex-shrink:0;font-size:11px;font-weight:700;color:var(--green-700)">' + t.name.charAt(0) + '</div>' +
        '<div style="flex:1;min-width:0"><div style="font-weight:600;font-size:12.5px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">' + t.name + '</div>' +
        '<div style="font-size:11px;color:var(--text-tertiary)">' + t.plan + ' · ' + t.users + ' users · ' + t.lastLogin + '</div></div>' +
        '<span class="badge ' + (t.status==='Active'?'b-green':t.status==='Trial'?'b-blue':'b-red') + '">' + t.status + '</span>' +
        '</div>';
    }).join('') +
    '</div>' +
    '<div class="card">' +
    '<div class="card-hd"><span class="card-title">Revenue by plan</span></div>' +
    [['Enterprise','2 tenants','₦730,000/mo','#166534'],['Pro','5 tenants','₦221,000/mo','#15803d'],['Starter','120 tenants','₦24,000/mo','#22c55e']].map(function(row) {
      return '<div style="display:flex;align-items:center;gap:10px;padding:9px 0;border-bottom:1px solid var(--border)">' +
        '<div style="width:10px;height:10px;border-radius:2px;background:' + row[3] + ';flex-shrink:0"></div>' +
        '<div style="flex:1"><div style="font-weight:600;font-size:13px">' + row[0] + '</div>' +
        '<div style="font-size:11.5px;color:var(--text-tertiary)">' + row[1] + '</div></div>' +
        '<div style="font-weight:700;color:var(--green-700)">' + row[2] + '</div></div>';
    }).join('') +
    '<div style="margin-top:14px;padding:12px;background:var(--zinc-50);border-radius:var(--r-md)">' +
    '<div style="font-size:11px;color:var(--text-tertiary);margin-bottom:6px">Platform health</div>' +
    [['API uptime','99.97%','var(--green-700)'],['Avg response time','124ms','var(--green-700)'],['Error rate','0.03%','var(--green-700)']].map(function(m) {
      return '<div style="display:flex;justify-content:space-between;font-size:12.5px;padding:3px 0"><span>' + m[0] + '</span><strong style="color:' + m[2] + '">' + m[1] + '</strong></div>';
    }).join('') +
    '</div>' +
    '</div>' +
    '</div>';
}

// ── superadmin ──────────────────────────────────────
BUILDERS.superadmin = function(panel) {
  var all    = window.SA_TENANTS;
  var active = all.filter(function(t){ return t.status==='Active'; }).length;
  var trial  = all.filter(function(t){ return t.status==='Trial';  }).length;
  var susp   = all.filter(function(t){ return t.status==='Suspended'; }).length;
  var pending = window.SUB_REQUESTS.filter(function(r){ return r.status==='payment_uploaded'; }).length;

  panel.innerHTML =
    '<div style="display:flex;gap:0;border-bottom:1px solid var(--border);margin-bottom:16px;overflow-x:auto">' +
    [['tenants','ti-building-store','Tenant management'],['plans','ti-credit-card','Plan definitions'],['requests','ti-file-check','Subscription requests' + (pending?(' <span class="badge b-red" style="font-size:10px">'+pending+'</span>'):'')],['payouts','ti-cash','Payment verification']].map(function(t) {
      var active2 = window.SA_SUB_ACTIVE_TAB === t[0];
      return '<button onclick="saSubTab(\'' + t[0] + '\',this)" id="sa-stab-' + t[0] + '" style="display:flex;align-items:center;gap:5px;padding:9px 14px;border:none;background:none;cursor:pointer;font-size:12.5px;font-weight:600;font-family:var(--font);white-space:nowrap;color:' + (active2?'var(--primary)':'var(--text-secondary)') + ';border-bottom:2px solid ' + (active2?'var(--primary)':'transparent') + '">' +
        '<i class="ti ' + t[1] + '" style="font-size:14px"></i>' + t[2] + '</button>';
    }).join('') +
    '</div>' +
    '<div id="sa-sub-body"></div>';

  window.saSubTab = function(tab, btn) {
    window.SA_SUB_ACTIVE_TAB = tab;
    document.querySelectorAll('[id^="sa-stab-"]').forEach(function(b) {
      b.style.color = 'var(--text-secondary)'; b.style.borderBottomColor = 'transparent';
    });
    if (btn) { btn.style.color = 'var(--primary)'; btn.style.borderBottomColor = 'var(--primary)'; }
    renderSASubTab(tab);
  };

  renderSASubTab(window.SA_SUB_ACTIVE_TAB);
}

// ── useranalytics ──────────────────────────────────────
BUILDERS.useranalytics = function(panel) {
  var usage = window.TENANT_USAGE;
  var totalInv  = usage.reduce(function(s,t){return s+t.invoices;},0);
  var totalBills= usage.reduce(function(s,t){return s+t.bills;},0);
  var totalJnl  = usage.reduce(function(s,t){return s+t.journals;},0);
  var totalDau  = usage.reduce(function(s,t){return s+t.dau;},0);

  panel.innerHTML =
    '<div class="kpi-strip">' +
    '<div class="kpi-card"><div class="kpi-label">Platform DAU</div><div class="kpi-value">' + totalDau + '</div><div class="kpi-sub stat-up">↑ 5% vs yesterday</div></div>' +
    '<div class="kpi-card"><div class="kpi-label">Total invoices (MTD)</div><div class="kpi-value">' + totalInv + '</div></div>' +
    '<div class="kpi-card"><div class="kpi-label">Total journals (MTD)</div><div class="kpi-value">' + totalJnl + '</div></div>' +
    '<div class="kpi-card"><div class="kpi-label">Total bills (MTD)</div><div class="kpi-value">' + totalBills + '</div></div>' +
    '<div class="kpi-card"><div class="kpi-label">Churn rate</div><div class="kpi-value" style="color:var(--amber-700)">1.2%</div></div>' +
    '</div>' +

    // Feature adoption summary
    '<div class="card" style="margin-bottom:16px">' +
    '<div class="card-hd"><span class="card-title">Feature adoption across all tenants</span></div>' +
    '<div style="display:grid;grid-template-columns:repeat(4,1fr);gap:12px">' +
    [['Invoicing',usage.filter(function(t){return t.invoices>0;}).length,'b-green'],
     ['Payroll',usage.filter(function(t){return t.payrollRuns>0;}).length,'b-blue'],
     ['POS',usage.filter(function(t){return t.posSales>0;}).length,'b-blue'],
     ['API',usage.filter(function(t){return t.apiCalls>0;}).length,'b-amber']].map(function(f) {
      var pct = Math.round(f[1]/usage.length*100);
      return '<div style="padding:10px;background:var(--zinc-50);border-radius:var(--r-md)">' +
        '<div style="font-size:11px;color:var(--text-tertiary);margin-bottom:5px">' + f[0] + '</div>' +
        '<div style="font-size:20px;font-weight:800">' + f[1] + '<span style="font-size:11px;font-weight:400;color:var(--text-tertiary)"> / ' + usage.length + ' tenants</span></div>' +
        '<div style="height:4px;background:var(--zinc-200);border-radius:2px;margin-top:6px"><div style="height:4px;border-radius:2px;width:' + pct + '%;background:var(--green-500)"></div></div>' +
        '<div style="font-size:10.5px;color:var(--text-tertiary);margin-top:3px">' + pct + '% adoption</div></div>';
    }).join('') +
    '</div></div>' +

    // Per-tenant usage table
    '<div class="card">' +
    '<div class="card-hd"><span class="card-title">Usage by tenant</span>' +
    '<div style="display:flex;gap:6px">' +
    '<button class="btn btn-sm" onclick="downloadTableAsExcel(\'ua-tbl\',\'tenant-usage\')"><i class="ti ti-download"></i>Export</button>' +
    '</div></div>' +
    '<div style="display:flex;gap:8px;flex-wrap:wrap;margin-bottom:10px;padding:10px 12px;background:var(--zinc-50);border:1px solid var(--border);border-radius:var(--r-md)">' +
    '<input class="tbl-search" placeholder="Search tenant name..." oninput="filterTable(this,\'ua-tbl\')" style="flex:1;min-width:160px">' +
    '<select class="tbl-filter" onchange="filterByCol(\'ua-tbl\',2,this.value)">' +
    '<option value="">All plans</option><option>Starter</option><option>Business</option><option>Enterprise</option><option>Trial</option>' +
    '</select>' +
    '<select class="tbl-filter" id="ua-sort-metric" onchange="sortUsageTable(this.value)">' +
    '<option value="">Sort by metric</option>' +
    '<option value="3">Invoices ↓</option><option value="4">Bills ↓</option><option value="5">Journals ↓</option><option value="6">Payroll runs ↓</option><option value="7">POS sales ↓</option><option value="8">API calls ↓</option><option value="9">Storage ↓</option>' +
    '</select>' +
    '<button class="btn btn-sm" onclick="clearTableFilters(\'ua-tbl\',\'p-useranalytics\')">Clear</button>' +
    '</div>' +
    '<div style="overflow-x:auto">' +
    '<table id="ua-tbl">' +
    '<tr>' +
    '<th class="sortable" onclick="sortTable(this)">Tenant</th>' +
    '<th class="sortable" onclick="sortTable(this)">Plan</th>' +
    '<th class="sortable" onclick="sortTable(this)" style="text-align:right">Users</th>' +
    '<th class="sortable" onclick="sortTable(this)" style="text-align:right">Invoices</th>' +
    '<th class="sortable" onclick="sortTable(this)" style="text-align:right">Bills</th>' +
    '<th class="sortable" onclick="sortTable(this)" style="text-align:right">Journals</th>' +
    '<th class="sortable" onclick="sortTable(this)" style="text-align:right">Payroll runs</th>' +
    '<th class="sortable" onclick="sortTable(this)" style="text-align:right">POS sales</th>' +
    '<th class="sortable" onclick="sortTable(this)" style="text-align:right">API calls</th>' +
    '<th class="sortable" onclick="sortTable(this)">Storage</th>' +
    '<th class="sortable" onclick="sortTable(this)" style="text-align:right">Login days</th>' +
    '<th class="sortable" onclick="sortTable(this)">Last active</th>' +
    '</tr>' +
    usage.map(function(t) {
      var planLimits = Object.values(window.PLAN_DEFS).find(function(p){ return p.name===t.plan; })?.limits || {};
      var invPct = planLimits.invoices && planLimits.invoices < 9999 ? Math.round(t.invoices/planLimits.invoices*100) : null;
      return '<tr>' +
        '<td><div style="font-weight:700;font-size:12.5px">' + t.name + '</div><div style="font-size:10.5px;color:var(--text-tertiary)">' + t.id + '</div></td>' +
        '<td><span class="badge ' + (t.plan==='Enterprise'?'b-amber':t.plan==='Business'?'b-blue':t.plan==='Trial'?'b-gray':'b-gray') + '">' + t.plan + '</span></td>' +
        '<td style="text-align:right">' + t.users + '</td>' +
        '<td style="text-align:right;font-variant-numeric:tabular-nums">' +
          t.invoices + (invPct!==null?'<span style="font-size:10px;color:' + (invPct>80?'var(--red-600)':invPct>60?'var(--amber-700)':'var(--text-tertiary)') + ';margin-left:3px">(' + invPct + '%)</span>':'') +
        '</td>' +
        '<td style="text-align:right;font-variant-numeric:tabular-nums">' + t.bills + '</td>' +
        '<td style="text-align:right;font-variant-numeric:tabular-nums">' + t.journals + '</td>' +
        '<td style="text-align:right">' + t.payrollRuns + '</td>' +
        '<td style="text-align:right;font-variant-numeric:tabular-nums">' + (t.posSales||'—') + '</td>' +
        '<td style="text-align:right;font-variant-numeric:tabular-nums">' + (t.apiCalls?t.apiCalls.toLocaleString():'—') + '</td>' +
        '<td>' + t.storage + '</td>' +
        '<td style="text-align:right">' + t.loginDays + '</td>' +
        '<td style="font-size:11.5px;color:var(--text-tertiary)">' + t.lastActive + '</td>' +
        '</tr>';
    }).join('') +
    '</table></div></div>';

  setupTableDefaults('ua-tbl');
}

// ── banners ──────────────────────────────────────
BUILDERS.banners = function(panel) {
  panel.innerHTML =
    '<div class="card"><div class="card-hd"><span class="card-title">Platform banners</span>' +
    '<button class="btn btn-primary btn-sm" onclick="openAddBanner()"><i class="ti ti-plus"></i>New banner</button></div>' +
    '<div class="alert alert-blue"><i class="ti ti-info-circle"></i>Banners appear at the top of the tenant dashboard. Use for maintenance notices, feature announcements, and compliance alerts.</div>' +
    '<table id="banner-tbl">' +
    '<tr><th>ID</th><th>Title</th><th>Message</th><th>Type</th><th>Target</th><th>Status</th><th>Created</th><th>Actions</th></tr>' +
    window.BANNER_DATA.map(function(b) {
      return '<tr>' +
        '<td class="td-mono" style="font-size:11px">' + b.id + '</td>' +
        '<td class="td-bold">' + b.title + '</td>' +
        '<td style="font-size:12px;color:var(--text-secondary);max-width:200px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">' + b.msg + '</td>' +
        '<td><span class="badge ' + (b.type==='warning'?'b-amber':b.type==='alert'?'b-red':'b-blue') + '">' + b.type + '</span></td>' +
        '<td style="font-size:12px">' + b.target + '</td>' +
        '<td><span class="badge ' + (b.active?'b-green':'b-gray') + '">' + (b.active?'Live':'Draft') + '</span></td>' +
        '<td style="font-size:12px">' + b.created + '</td>' +
        '<td class="action-col"><div class="action-menu"><button class="action-btn" onclick="toggleAction(this)">Actions <i class="ti ti-chevron-down" style="font-size:10px"></i></button>' +
        '<div class="action-dropdown">' +
        '<a onclick="toast(\'' + b.id + ' ' + (b.active?'unpublished':'published') + '\');return false"><i class="ti ti-toggle-left"></i>' + (b.active?'Unpublish':'Publish') + '</a>' +
        '<a onclick="toast(\'Editing banner\');return false"><i class="ti ti-pencil"></i>Edit</a>' +
        '<div class="sep"></div>' +
        '<a class="danger" onclick="warnDelete(\'' + b.title + '\',\'account\',function(){toast(\'Banner deleted\')});return false"><i class="ti ti-trash"></i>Delete</a>' +
        '</div></div></td>' +
        '</tr>';
    }).join('') +
    '</table></div>';
  setupTableDefaults('banner-tbl');
}

// ── releasenotes ──────────────────────────────────────
BUILDERS.releasenotes = function(panel) {
  panel.innerHTML =
    '<div class="card"><div class="card-hd"><span class="card-title">Release notes</span>' +
    '<button class="btn btn-primary btn-sm" onclick="openNewRelease()"><i class="ti ti-plus"></i>New release</button></div>' +
    window.RELEASE_DATA.map(function(r) {
      var badgeColor = r.type==='major'?'b-red':r.type==='minor'?'b-blue':'b-gray';
      return '<div style="padding:16px 0;border-bottom:1px solid var(--border)">' +
        '<div style="display:flex;align-items:center;gap:10px;margin-bottom:8px">' +
        '<span style="font-size:16px;font-weight:800;color:var(--text-primary)">' + r.ver + '</span>' +
        '<span class="badge ' + badgeColor + '">' + r.type + '</span>' +
        '<span style="font-size:12px;color:var(--text-tertiary)">' + r.date + '</span>' +
        '<span style="flex:1;font-weight:600;font-size:13px;color:var(--text-secondary)">' + r.summary + '</span>' +
        '<button class="btn btn-sm" onclick="toast(\'Publishing ' + r.ver + ' notes to tenants\')"><i class="ti ti-send"></i>Notify tenants</button>' +
        '</div>' +
        '<ul style="padding-left:18px;margin:0">' +
        r.items.map(function(item){ return '<li style="font-size:12.5px;color:var(--text-secondary);padding:2px 0">' + item + '</li>'; }).join('') +
        '</ul></div>';
    }).join('') +
    '</div>';
}

// ── training ──────────────────────────────────────
BUILDERS.training = function(panel) {
  var modules_training = [
    {icon:'ti-rocket',title:'Getting started',desc:'Company setup, inviting team members, onboarding checklist, and your first invoice.',chapters:5,level:'Beginner',duration:'25 min'},
    {icon:'ti-file-invoice',title:'Invoicing & sales',desc:'Create FIRS-compliant invoices, manage customers, record payments, issue credit notes, and track aged receivables.',chapters:6,level:'Beginner',duration:'30 min'},
    {icon:'ti-notebook',title:'Accounting & GL',desc:'Chart of accounts, double-entry journals, the 8-rule validation engine, and period close.',chapters:8,level:'Intermediate',duration:'45 min'},
    {icon:'ti-moneybag',title:'Payroll & HR',desc:'Employee records, PAYE graduated rates, pension (8%), NHF (2.5%), and payslip generation.',chapters:5,level:'Intermediate',duration:'35 min'},
    {icon:'ti-package',title:'Inventory & production',desc:'Products, bills of materials, production orders, inventory adjustments, and shared costing.',chapters:7,level:'Intermediate',duration:'40 min'},
    {icon:'ti-chart-bar',title:'Financial reports',desc:'Trial balance, P&L, balance sheet, cash flow, and financial health ratios.',chapters:4,level:'Intermediate',duration:'20 min'},
    {icon:'ti-buildings',title:'Multi-entity & consolidation',desc:'Setting up subsidiaries, intercompany elimination, and consolidated financial statements.',chapters:4,level:'Advanced',duration:'30 min'},
    {icon:'ti-shield-check',title:'Audit trail & compliance',desc:'Using the audit trail, FIRS e-invoicing submission, and ledger integrity checks.',chapters:3,level:'Advanced',duration:'20 min'},
  ];
  var levelColor = {Beginner:'b-green', Intermediate:'b-blue', Advanced:'b-amber'};
  panel.innerHTML =
    '<div class="kpi-strip">' +
    '<div class="kpi-card"><div class="kpi-label">Training modules</div><div class="kpi-value">' + modules_training.length + '</div></div>' +
    '<div class="kpi-card"><div class="kpi-label">Total chapters</div><div class="kpi-value">' + modules_training.reduce(function(s,m){return s+m.chapters;},0) + '</div></div>' +
    '<div class="kpi-card"><div class="kpi-label">Total duration</div><div class="kpi-value">4h 5min</div></div>' +
    '</div>' +
    '<div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(280px,1fr));gap:14px">' +
    modules_training.map(function(m) {
      return '<div style="border:1px solid var(--border);border-radius:var(--r-lg);padding:18px;background:var(--surface)">' +
        '<div style="display:flex;align-items:flex-start;gap:12px;margin-bottom:12px">' +
        '<div style="width:40px;height:40px;background:var(--green-50);border:1px solid var(--green-200);border-radius:10px;display:flex;align-items:center;justify-content:center;flex-shrink:0">' +
        '<i class="ti ' + m.icon + '" style="font-size:20px;color:var(--green-700)"></i></div>' +
        '<div><div style="font-weight:700;font-size:13px;margin-bottom:2px">' + m.title + '</div>' +
        '<div style="display:flex;gap:5px;flex-wrap:wrap">' +
        '<span class="badge ' + levelColor[m.level] + '" style="font-size:10px">' + m.level + '</span>' +
        '<span class="badge b-gray" style="font-size:10px">' + m.chapters + ' chapters</span>' +
        '<span class="badge b-gray" style="font-size:10px">' + m.duration + '</span>' +
        '</div></div></div>' +
        '<p style="font-size:12px;color:var(--text-secondary);line-height:1.5;margin-bottom:12px">' + m.desc + '</p>' +
        '<button class="btn btn-primary btn-sm" style="width:100%;justify-content:center" onclick="toast(\'Opening ' + m.title + ' training module\')"><i class="ti ti-player-play"></i>Start module</button>' +
        '</div>';
    }).join('') +
    '</div>';
}

// ── testguide ──────────────────────────────────────
BUILDERS.testguide = function(panel) {
  var tests = [
    {cat:'Authentication',items:['Login with Tenant Admin credentials','Login with each of the 5 roles','Verify RBAC blocks SA modules for Tenant Admin','Logout and re-login','First-login T&C modal fires once only']},
    {cat:'Accounting',items:['Create a journal entry with DR=CR','Try to post an unbalanced journal (should fail)','Navigate to Trial balance — verify DR=CR','Open Balance sheet — verify Assets=L+E','Run Cash flow — verify closing cash','Open Financial health — verify all 5 ratios']},
    {cat:'Sales',items:['Create an invoice with 2 line items','Verify VAT calculated at 7.5%','Download invoice PDF','Mark invoice as paid','Check AR GL account updated']},
    {cat:'Payroll',items:['Run payroll for June 2026','Verify PAYE deduction calculated','Verify pension 8% deducted','Verify NHF 2.5% deducted','Download payroll PDF']},
    {cat:'Settings',items:['Open each of 7 settings tabs','Add a new currency','Add a picklist item','Run ledger integrity check','Toggle a notification on/off']},
    {cat:'Super Admin (SA only)',items:['Login as admin@leaftally.io','Verify SA dashboard shows platform KPIs','Provision a new tenant','Change a tenant plan','Publish a banner','Add a release note']},
  ];
  panel.innerHTML =
    '<div class="alert alert-amber"><i class="ti ti-alert-circle"></i><strong>Super Admin only.</strong> This guide is for LeafTally internal QA testing.</div>' +
    '<div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(280px,1fr));gap:14px;margin-top:14px">' +
    tests.map(function(tc) {
      return '<div class="card">' +
        '<div class="card-hd"><span class="card-title">' + tc.cat + '</span><span class="badge b-gray">' + tc.items.length + ' checks</span></div>' +
        tc.items.map(function(item, i) {
          return '<div style="display:flex;align-items:flex-start;gap:8px;padding:6px 0;border-bottom:1px solid var(--border)">' +
            '<input type="checkbox" style="accent-color:var(--primary);margin-top:2px;flex-shrink:0">' +
            '<span style="font-size:12.5px">' + item + '</span></div>';
        }).join('') +
        '</div>';
    }).join('') +
    '</div>';
}
