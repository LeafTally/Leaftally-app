// ============================================================
// LeafTally — ADMIN module
// ============================================================

/* global BUILDERS, PICKLISTS, GL_ACCOUNTS, PRODUCTS, */
/* global CUSTOMERS_DB, SUPPLIERS_DB, JOURNAL_LEDGER, */
/* global currentUser, openDrawer, closeDrawer, toast, */
/* global filterTable, filterByCol, sortTable, setupTableDefaults */

// ── users ──────────────────────────────────────
BUILDERS.users = function(panel) {
  const TENANT_USERS = [
    {id:'USR-001',name:'Amaka Adeyemi',   email:'amaka@acmetrading.ng',    role:'Tenant Admin', status:'Active',  last:'Today 09:41',  avatar:'AA'},
    {id:'USR-002',name:'Chukwuemeka Obi', email:'chukwu@acmetrading.ng',   role:'Accountant',   status:'Active',  last:'Today 08:15',  avatar:'CO'},
    {id:'USR-003',name:'Funmi Adeola',    email:'funmi@acmetrading.ng',     role:'HR Manager',   status:'Active',  last:'Yesterday',    avatar:'FA'},
    {id:'USR-004',name:'Babatunde Adeyemi',email:'babatunde@acmetrading.ng',role:'Cashier',      status:'Active',  last:'2 days ago',   avatar:'BA'},
    {id:'USR-005',name:'Kelechi Okonkwo', email:'viewer@acmetrading.ng',    role:'Viewer',       status:'Invited', last:'Never',        avatar:'KO'},
  ];
  const roleColors = {'Tenant Admin':'b-blue','Accountant':'b-teal','HR Manager':'b-purple','Cashier':'b-amber','Viewer':'b-gray'};

  panel.innerHTML = `
  <div class="kpi-strip">
    <div class="kpi-card"><div class="kpi-label">Total users</div><div class="kpi-value">${TENANT_USERS.length}</div><div class="kpi-sub">of 15 seats</div></div>
    <div class="kpi-card"><div class="kpi-label">Active</div><div class="kpi-value" style="color:var(--green-700)">${TENANT_USERS.filter(u=>u.status==='Active').length}</div></div>
    <div class="kpi-card"><div class="kpi-label">Pending invitation</div><div class="kpi-value" style="color:var(--amber-700)">${TENANT_USERS.filter(u=>u.status==='Invited').length}</div></div>
    <div class="kpi-card"><div class="kpi-label">Seats available</div><div class="kpi-value">${15 - TENANT_USERS.length}</div></div>
  </div>
  <div class="card">
    <div class="card-hd">
      <span class="card-title">Team members</span>
      <div style="display:flex;gap:8px;flex-wrap:wrap;align-items:center">
        <input class="tbl-search" placeholder="Search name, email, role..." oninput="filterTable(this,'usr-tbl')">
        <select class="tbl-filter" onchange="filterByCol('usr-tbl',3,this.value)">
          <option value="">All roles</option>
          ${Object.keys(ROLE_PERMISSIONS).filter(r=>r!=='Super Admin').map(r=>`<option>${r}</option>`).join('')}
        </select>
        <select class="tbl-filter" onchange="filterByCol('usr-tbl',4,this.value)">
          <option value="">All statuses</option><option>Active</option><option>Invited</option><option>Inactive</option>
        </select>
        <button class="btn btn-primary btn-sm" onclick="openInviteUser()"><i class="ti ti-user-plus"></i>Invite user</button>
      </div>
    </div>
    <div class="bulk-bar" id="usr-bar">
      <span id="usr-cnt" class="badge b-gray">0 selected</span>
      <button class="btn btn-sm" onclick="toast('Role change form opened')">Change role</button>
      <button class="btn btn-sm" onclick="toast('Resend invitations sent')">Resend invitation</button>
      <button class="btn btn-sm btn-danger" onclick="bulkDeleteChecked('usr-tbl','usr-cb','usr-bar',()=>toast('Users deactivated'))">Deactivate</button>
    </div>
    <table id="usr-tbl">
      <tr>
        <th class="col-check"><input type="checkbox" id="usr-all" style="accent-color:var(--primary)" onchange="selectAllInTbl(this,'usr-cb')"></th>
        <th class="sortable" onclick="sortTable(this)">User</th>
        <th class="sortable" onclick="sortTable(this)">Email</th>
        <th class="sortable" onclick="sortTable(this)">Role</th>
        <th class="sortable" onclick="sortTable(this)">Status</th>
        <th class="sortable" onclick="sortTable(this)">Last active</th>
        <th>Permissions</th>
        <th>Actions</th>
      </tr>
      ${TENANT_USERS.map(u => `<tr>
        <td class="col-check"><input type="checkbox" class="usr-cb" style="accent-color:var(--primary)" onchange="updateBulkBar('usr-tbl','usr-bar','usr-cnt','usr-cb','usr-all')"></td>
        <td>
          <div style="display:flex;align-items:center;gap:9px">
            <div style="width:28px;height:28px;border-radius:50%;background:var(--green-700);color:white;font-size:10px;font-weight:700;display:flex;align-items:center;justify-content:center;flex-shrink:0">${u.avatar}</div>
            <div>
              <div style="font-weight:600;font-size:12.5px">${u.name}</div>
              <div style="font-size:11px;color:var(--text-tertiary)">${u.id}</div>
            </div>
          </div>
        </td>
        <td style="font-size:12px;color:var(--text-secondary)">${u.email}</td>
        <td><span class="badge ${roleColors[u.role]||'b-gray'}">${u.role}</span></td>
        <td><span class="badge ${u.status==='Active'?'b-green':u.status==='Invited'?'b-amber':'b-gray'}">${u.status}</span></td>
        <td style="font-size:12px;color:var(--text-secondary)">${u.last}</td>
        <td>
          <button class="btn btn-ghost btn-xs" onclick="showUserPermissions('${u.name}','${u.role}')"><i class="ti ti-shield" style="font-size:12px"></i>View</button>
        </td>
        <td class="action-col"><div class="action-menu"><button class="action-btn" onclick="toggleAction(this)">Actions <i class="ti ti-chevron-down" style="font-size:10px"></i></button>
          <div class="action-dropdown">
            <a onclick="showUserPermissions('${u.name}','${u.role}');return false"><i class="ti ti-shield"></i>View permissions</a>
            <a onclick="openChangeRole('${u.name}','${u.role}');return false"><i class="ti ti-edit"></i>Change role</a>
            <a onclick="toast('Impersonating ${u.name}');return false"><i class="ti ti-login"></i>Impersonate</a>
            <a onclick="toast('Password reset sent to ${u.email}');return false"><i class="ti ti-key"></i>Reset password</a>
            <div class="sep"></div>
            <a class="danger" onclick="warnDelete('${u.name}','employee',()=>{this.closest('tr').remove();toast('${u.name} deactivated')});return false"><i class="ti ti-user-off"></i>Deactivate</a>
          </div></div></td>
      </tr>`).join('')}
    </table>
  </div>`;
  setupBulk('usr-tbl','usr-bar','usr-cnt','usr-cb','usr-all');
}

// ── roles ──────────────────────────────────────
BUILDERS.roles = function(panel) {
  const ROLE_META = {
    'Tenant Admin': { badge:'b-blue',   desc:'Full access to all tenant modules, settings, and user management.', system:true  },
    'Accountant':   { badge:'b-teal',   desc:'Accounting, invoicing, bills, and financial reports. No user or payroll access.', system:false },
    'HR Manager':   { badge:'b-purple', desc:'Employees, payroll, and expense approvals. No financial reports.', system:false },
    'Cashier':      { badge:'b-amber',  desc:'Invoices, POS, and receipts. No payroll, reports, or management access.', system:false },
    'Viewer':       { badge:'b-gray',   desc:'Read-only access to accounting and reports. Cannot create or edit anything.', system:false },
  };
  const MODULE_GROUPS = {
    'Accounting':  ['coa','gl','expenses','ledger','trial','pnl','reports','assets'],
    'Sales':       ['invoices','clients','pos','inventory'],
    'Purchases':   ['bills','suppliers','shipments'],
    'HR & Payroll':['employees','payroll'],
    'Settings':    ['settings','users','roles'],
  };
  const levelColor = {
    admin:'background:var(--green-50);color:var(--green-800)',
    write:'background:var(--blue-50);color:var(--blue-700)',
    read:'background:var(--zinc-100);color:var(--zinc-500)',
    none:'background:transparent;color:var(--zinc-300)',
    true:'background:var(--green-50);color:var(--green-800)',
  };
  const levelIcon = { admin:'✦', write:'✎', read:'◎', none:'–', true:'✦' };

  panel.innerHTML = `
  <div class="alert alert-blue"><i class="ti ti-shield"></i><strong>Role-based access control</strong> — Roles define what each team member can see and do. System roles cannot be deleted but custom roles can be fully configured.</div>

  <div class="grid-2" style="margin-bottom:14px">
    ${Object.entries(ROLE_META).map(([name, meta]) => `
    <div class="card" style="margin-bottom:0">
      <div style="display:flex;align-items:flex-start;gap:10px;margin-bottom:10px">
        <div style="flex:1">
          <div style="display:flex;align-items:center;gap:8px;margin-bottom:4px">
            <span style="font-size:13.5px;font-weight:600">${name}</span>
            <span class="badge ${meta.badge}">${meta.system?'System':'Custom'}</span>
          </div>
          <div style="font-size:12px;color:var(--text-secondary)">${meta.desc}</div>
        </div>
      </div>
      <div style="display:flex;flex-wrap:wrap;gap:4px;margin-bottom:10px">
        ${Object.entries(MODULE_GROUPS).map(([group, mods]) => {
          const perms = ROLE_PERMISSIONS[name] || {};
          const allNone = mods.every(m => !perms[m] || perms[m]==='none');
          const allAdmin = mods.every(m => perms[m]==='admin'||perms[m]===true);
          const style = allAdmin ? levelColor.admin : allNone ? levelColor.none : levelColor.read;
          return `<span style="font-size:10.5px;padding:2px 7px;border-radius:3px;font-weight:500;${style}">${group}</span>`;
        }).join('')}
      </div>
      <div style="display:flex;gap:6px">
        <button class="btn btn-sm" onclick="viewRoleMatrix('${name}')"><i class="ti ti-table"></i>Permission matrix</button>
        ${!meta.system ? `<button class="btn btn-sm btn-primary" onclick="toast('Editing ${name} role')"><i class="ti ti-pencil"></i>Edit</button>
        <button class="btn btn-sm btn-danger" onclick="warnDelete('${name} role',()=>{toast('Role deleted')})"><i class="ti ti-trash"></i></button>` : ''}
      </div>
    </div>`).join('')}
    <div class="card" style="margin-bottom:0;border:1.5px dashed var(--border);display:flex;align-items:center;justify-content:center;min-height:150px">
      <button class="btn btn-primary" onclick="toast('Custom role builder opened')"><i class="ti ti-plus"></i>Create custom role</button>
    </div>
  </div>

  <div class="card">
    <div class="card-hd"><span class="card-title">Permission matrix — all roles</span>
      <button class="btn btn-sm" onclick="downloadTableAsExcel('perm-matrix','permissions-matrix')"><i class="ti ti-download"></i>Export</button>
    </div>
    <div style="overflow-x:auto">
    <table id="perm-matrix" style="min-width:700px">
      <tr>
        <th style="min-width:140px">Module</th>
        ${Object.keys(ROLE_META).map(r=>`<th style="text-align:center">${r}</th>`).join('')}
      </tr>
      ${Object.entries(MODULE_GROUPS).flatMap(([group, mods]) => [
        `<tr><td colspan="${Object.keys(ROLE_META).length+1}" style="padding:8px 12px;background:var(--zinc-50);font-size:11px;font-weight:700;color:var(--text-secondary);text-transform:uppercase;letter-spacing:.05em">${group}</td></tr>`,
        ...mods.map(mod => {
          const modLabel = mod.charAt(0).toUpperCase()+mod.slice(1).replace(/([A-Z])/g,' $1');
          return `<tr>
            <td style="font-size:12.5px">${modLabel}</td>
            ${Object.keys(ROLE_META).map(role => {
              const lvl = (ROLE_PERMISSIONS[role]||{})[mod]||'none';
              const icon = lvl==='admin'||lvl===true?'✦':lvl==='write'?'✎':lvl==='read'?'◎':'–';
              const style = lvl==='admin'||lvl===true ? 'color:var(--green-700);font-weight:700' : lvl==='write' ? 'color:var(--blue-700);font-weight:600' : lvl==='read' ? 'color:var(--zinc-400)' : 'color:var(--zinc-200)';
              return `<td style="text-align:center;font-size:13px;${style}">${icon}</td>`;
            }).join('')}
          </tr>`;
        })
      ]).join('')}
    </table>
    </div>
    <div style="margin-top:8px;font-size:11px;color:var(--text-tertiary);display:flex;gap:16px">
      <span style="color:var(--green-700)">✦ Full admin</span>
      <span style="color:var(--blue-700)">✎ Can write</span>
      <span style="color:var(--zinc-400)">◎ Read only</span>
      <span style="color:var(--zinc-300)">– No access</span>
    </div>
  </div>`;
}

// ── subscription ──────────────────────────────────────
BUILDERS.subscription = function(panel) {
  var plans  = Object.values(window.PLAN_DEFS);
  var curPlan = window.PLAN_DEFS['business'];  // Acme is on business
  var myRequest = window.SUB_REQUESTS.find(function(r){ return r.tenant==='T-001' && r.status!=='approved'; });

  // Pending request banner
  var pendingBanner = '';
  if (myRequest) {
    var statusText = {
      awaiting_payment: 'Awaiting your payment — see instructions below.',
      payment_uploaded: 'Your payment receipt has been uploaded and is awaiting verification by our team. You will be notified once approved.',
    }[myRequest.status] || '';
    pendingBanner = '<div class="alert ' + (myRequest.status==='payment_uploaded'?'alert-amber':'alert-blue') + '" style="margin-bottom:16px">' +
      '<i class="ti ti-' + (myRequest.status==='payment_uploaded'?'clock':'info-circle') + '"></i>' +
      '<strong>Pending plan change (' + (window.PLAN_DEFS[myRequest.plan]?.name||myRequest.plan) + ')</strong> — ' + statusText + '</div>';
  }

  panel.innerHTML = pendingBanner +
    '<div class="kpi-strip">' +
    '<div class="kpi-card"><div class="kpi-label">Current plan</div><div class="kpi-value" style="color:' + curPlan.color + '">' + curPlan.name + '</div></div>' +
    '<div class="kpi-card"><div class="kpi-label">Monthly cost</div><div class="kpi-value">₦' + curPlan.price.toLocaleString() + '</div></div>' +
    '<div class="kpi-card"><div class="kpi-label">Seats used</div><div class="kpi-value">5 / ' + curPlan.users + '</div></div>' +
    '<div class="kpi-card"><div class="kpi-label">Next billing</div><div class="kpi-value" style="font-size:14px">01 Aug 2026</div></div>' +
    '</div>' +
    '<div style="display:grid;grid-template-columns:repeat(3,1fr);gap:16px;margin-bottom:20px">' +
    plans.map(function(plan) {
      var isCurrent = plan.id === curPlan.id;
      var isUpgrade = plan.price > curPlan.price;
      var isDowngrade = plan.price < curPlan.price;
      return '<div class="card" style="' + (isCurrent?'border:2px solid var(--primary);':'') + (plan.popular?'position:relative;':'') + '">' +
        (plan.popular&&!isCurrent?'<div style="position:absolute;top:-10px;left:50%;transform:translateX(-50%);background:var(--green-600);color:white;font-size:10px;font-weight:700;padding:2px 10px;border-radius:10px;white-space:nowrap">Most popular</div>':'') +
        '<div style="text-align:center;padding:14px 0 16px">' +
        '<div style="font-size:20px;font-weight:800;color:' + plan.color + '">' + plan.name + '</div>' +
        '<div style="font-size:26px;font-weight:800;margin:6px 0">₦' + plan.price.toLocaleString() + '<span style="font-size:11px;font-weight:400;color:var(--text-tertiary)">/mo</span></div>' +
        '<div style="font-size:11px;color:var(--text-tertiary)">' + plan.tagline + '</div>' +
        (isCurrent?'<div><span class="badge b-green" style="margin-top:8px">Current plan</span></div>':'') +
        '</div>' +
        '<div style="padding:0 4px;max-height:200px;overflow:hidden">' +
        Object.entries(plan.features).map(function(entry) {
          var cat = entry[0], items = entry[1];
          return '<div style="font-size:10px;font-weight:700;color:var(--text-tertiary);text-transform:uppercase;letter-spacing:.05em;margin:8px 0 4px">' + cat + '</div>' +
            (Array.isArray(items)?items.slice(0,4).map(function(item){ return '<div style="font-size:11.5px;padding:2px 0;display:flex;gap:5px"><span style="color:var(--green-600);flex-shrink:0">✓</span>' + item + '</div>'; }).join(''):'');
        }).join('') +
        '</div>' +
        '<div style="margin-top:14px">' +
        (isCurrent
          ? '<button class="btn" style="width:100%;justify-content:center" disabled>Your current plan</button>'
          : '<button class="btn ' + (isUpgrade?'btn-primary':'') + '" style="width:100%;justify-content:center" onclick="requestPlanChange(\'' + plan.id + '\',\'' + plan.name + '\',' + plan.price + ',' + (isUpgrade?'true':'false') + ')">' +
            (isUpgrade?'⬆ Upgrade':'⬇ Downgrade') + ' to ' + plan.name + '</button>'
        ) +
        '</div></div>';
    }).join('') +
    '</div>' +
    '<div class="card">' +
    '<div class="card-hd"><span class="card-title">Billing details</span>' +
    '<button class="btn btn-sm" onclick="nav(document.querySelector(\'[onclick*=\'billing\']\'),\'billing\')"><i class="ti ti-receipt"></i>View invoices</button>' +
    '</div>' +
    '<div class="detail-row"><span class="detail-label">Plan</span><span class="detail-value">' + curPlan.name + ' — ₦' + curPlan.price.toLocaleString() + '/month</span></div>' +
    '<div class="detail-row"><span class="detail-label">Next invoice</span><span class="detail-value">01 Aug 2026</span></div>' +
    '<div class="detail-row"><span class="detail-label">Payment method</span><span class="detail-value">Bank transfer to GTBank · LeafTally Technologies Ltd · 0234567890</span></div>' +
    '<div class="detail-row"><span class="detail-label">Billing contact</span><span class="detail-value">amaka@acmetrading.ng</span></div>' +
    '<div style="margin-top:10px;display:flex;gap:8px">' +
    '<button class="btn btn-sm btn-danger" onclick="warnDelete(\'subscription\',\'account\',function(){toast(\'Cancellation request submitted\')})"><i class="ti ti-x"></i>Cancel subscription</button>' +
    '</div></div>';
}

// ── billing ──────────────────────────────────────
BUILDERS.billing = function(panel) {
  panel.innerHTML = `
  <div class="card">
    <div class="card-hd"><span class="card-title">Billing history</span><button class="btn btn-sm" onclick="exportCSV('billing-tbl','billing-history')"><i class="ti ti-download"></i>Export</button></div>
    <table id="billing-tbl">
      <tr><th class="sortable" onclick="sortTable(this)">Invoice #</th><th class="sortable" onclick="sortTable(this)">Period</th><th class="sortable" onclick="sortTable(this)">Plan</th><th class="sortable" onclick="sortTable(this)" style="text-align:right">Amount (₦)</th><th class="sortable" onclick="sortTable(this)">Status</th><th>Actions</th></tr>
      ${[['LT-INV-0006','Jun 2026','Business','65,000','Paid'],['LT-INV-0005','May 2026','Business','65,000','Paid'],['LT-INV-0004','Apr 2026','Business','65,000','Paid'],['LT-INV-0003','Mar 2026','Business','65,000','Paid'],['LT-INV-0002','Feb 2026','Business','65,000','Paid'],['LT-INV-0001','Jan 2026','Starter','25,000','Paid']].map(([ref,period,plan,amt,status]) => `<tr>
        <td class="td-bold" style="color:var(--g600)">${ref}</td>
        <td>${period}</td>
        <td><span class="badge b-blue">${plan}</span></td>
        <td style="text-align:right;font-weight:600">₦${amt}</td>
        <td><span class="badge b-green">${status}</span></td>
        <td><button class="btn btn-sm" onclick="toast('Downloading ${ref} receipt')"><i class="ti ti-download"></i>Receipt</button></td>
      </tr>`).join('')}
    </table>
    <div style="margin-top:14px;padding:12px 14px;background:var(--bg);border-radius:8px;font-size:12px;color:var(--t500)">
      <strong>Payment method:</strong> Bank transfer to GTBank · 0123456789 · LeafTally Technologies Ltd &nbsp;|&nbsp;
      <strong>Next invoice:</strong> 01 Jul 2026 · ₦65,000
    </div>
  </div>`;
}

// ── migration ──────────────────────────────────────
BUILDERS.migration = function(panel) {
  const MIGRATIONS = [
    {
      id:'MIG-001', name:'Chart of accounts', source:'Excel import', date:'15 Jan 2026', status:'Complete',
      summary:{total:25, success:25, errors:0, warnings:0},
      detail:[
        {item:'1100 — Bank accounts','result':'Imported','note':'Matched existing account'},
        {item:'4000 — Sales revenue','result':'Imported','note':'New account created'},
        {item:'6500 — Utilities','result':'Imported','note':'New account created'},
      ]
    },
    {
      id:'MIG-002', name:'Customer list', source:'CSV upload', date:'15 Jan 2026', status:'Complete',
      summary:{total:47, success:45, errors:0, warnings:2},
      detail:[
        {item:'Dangote Foods Ltd','result':'Imported','note':''},
        {item:'MTN Nigeria Plc','result':'Imported','note':'Duplicate email — kept first'},
        {item:'BLANKROW_012','result':'Skipped','note':'Empty row in CSV'},
      ]
    },
    {
      id:'MIG-003', name:'Supplier list', source:'CSV upload', date:'15 Jan 2026', status:'Complete',
      summary:{total:18, success:18, errors:0, warnings:0},
      detail:[
        {item:'Conoil Nigeria Ltd','result':'Imported','note':''},
        {item:'MTN Business','result':'Imported','note':''},
      ]
    },
    {
      id:'MIG-004', name:'Opening balances', source:'Manual entry', date:'01 Jan 2026', status:'Complete',
      summary:{total:22, success:22, errors:0, warnings:0},
      detail:[
        {item:'1100 — Bank accounts','result':'Set',note:'Opening balance ₦4,660,000'},
        {item:'3100 — Retained earnings','result':'Set','note':'Opening balance ₦27,911,667'},
      ]
    },
    {
      id:'MIG-005', name:'Product catalogue', source:'Excel import', date:'16 Jan 2026', status:'Complete',
      summary:{total:8, success:8, errors:0, warnings:0},
      detail:[
        {item:'SKU-001 Office Chair','result':'Imported','note':''},
        {item:'SRV-001 IT Consulting','result':'Imported','note':'Service product — no stock'},
      ]
    },
    {
      id:'MIG-006', name:'Employee records', source:'CSV upload', date:'16 Jan 2026', status:'Partial',
      summary:{total:6, success:5, errors:1, warnings:0},
      detail:[
        {item:'Chukwuemeka Obi','result':'Imported','note':''},
        {item:'Funmi Adeola','result':'Imported','note':''},
        {item:'RECORD_005','result':'Error','note':'Missing bank account number — please add manually'},
      ]
    },
  ];

  const totalRecords  = MIGRATIONS.reduce((a,m)=>a+m.summary.total,0);
  const totalSuccess  = MIGRATIONS.reduce((a,m)=>a+m.summary.success,0);
  const totalErrors   = MIGRATIONS.reduce((a,m)=>a+m.summary.errors,0);
  const totalWarnings = MIGRATIONS.reduce((a,m)=>a+m.summary.warnings,0);

  panel.innerHTML = `
  <div class="kpi-strip">
    <div class="kpi-card"><div class="kpi-label">Migration batches</div><div class="kpi-value">${MIGRATIONS.length}</div></div>
    <div class="kpi-card"><div class="kpi-label">Total records</div><div class="kpi-value">${totalRecords}</div></div>
    <div class="kpi-card"><div class="kpi-label">Successful</div><div class="kpi-value" style="color:var(--g600)">${totalSuccess}</div></div>
    <div class="kpi-card"><div class="kpi-label">Errors</div><div class="kpi-value" style="color:${totalErrors?'var(--r400)':'var(--g600)'}">${totalErrors}</div></div>
    <div class="kpi-card"><div class="kpi-label">Warnings</div><div class="kpi-value" style="color:${totalWarnings?'var(--a600)':'var(--g600)'}">${totalWarnings}</div></div>
  </div>

  <div class="card" style="margin-bottom:14px">
    <div class="card-hd"><span class="card-title">Import new data</span></div>
    <div class="grid-3">
      ${[['Chart of accounts','Download template','ti-list-tree'],['Customers','Download template','ti-users'],['Suppliers','Download template','ti-truck'],['Products','Download template','ti-package'],['Employees','Download template','ti-id-badge'],['Opening balances','Download template','ti-calculator']].map(([label,btn,icon])=>`
      <div style="padding:12px;background:var(--bg);border-radius:8px;display:flex;align-items:center;gap:10px">
        <i class="ti ${icon}" style="font-size:20px;color:var(--g400);flex-shrink:0"></i>
        <div style="flex:1"><div style="font-size:12px;font-weight:600">${label}</div><div style="font-size:10px;color:var(--t400)">${btn}</div></div>
        <div style="display:flex;flex-direction:column;gap:4px">
          <button class="btn btn-sm" onclick="toast('Template downloaded for ${label}')"><i class="ti ti-download"></i></button>
          <button class="btn btn-sm btn-primary" onclick="toast('Upload for ${label} opened')"><i class="ti ti-upload"></i></button>
        </div>
      </div>`).join('')}
    </div>
  </div>

  <div class="card">
    <div class="card-hd"><span class="card-title">Migration history</span><button class="btn btn-sm" onclick="exportCSV('mig-tbl','migration-log')"><i class="ti ti-download"></i>Export log</button></div>
    <table id="mig-tbl">
      <tr><th>Batch ID</th><th>Dataset</th><th>Source</th><th>Date</th><th style="text-align:right">Total</th><th style="text-align:right">Success</th><th style="text-align:right">Errors</th><th style="text-align:right">Warnings</th><th>Status</th><th>Actions</th></tr>
      ${MIGRATIONS.map(m=>`
      <tr>
        <td class="td-bold" style="color:var(--g600)">${m.id}</td>
        <td style="font-weight:600">${m.name}</td>
        <td style="font-size:11px">${m.source}</td>
        <td style="font-size:11px">${m.date}</td>
        <td style="text-align:right">${m.summary.total}</td>
        <td style="text-align:right;color:var(--g600);font-weight:600">${m.summary.success}</td>
        <td style="text-align:right;color:${m.summary.errors?'var(--r400)':'var(--t400)'};font-weight:${m.summary.errors?600:400}">${m.summary.errors}</td>
        <td style="text-align:right;color:${m.summary.warnings?'var(--a600)':'var(--t400)'}">${m.summary.warnings}</td>
        <td><span class="badge ${m.status==='Complete'?'b-green':'b-amber'}">${m.status}</span></td>
        <td><button class="btn btn-sm" onclick="viewMigrationDetail(${JSON.stringify(m).replace(/"/g,'&quot;')})">View detail</button></td>
      </tr>`).join('')}
    </table>
  </div>`;
}

// ── doccenter ──────────────────────────────────────
BUILDERS.doccenter = function(panel) {
  const types = ['Legal','Tax','Compliance','Financial','Banking','HR','Other'];
  panel.innerHTML = `
  <div class="kpi-strip">
    <div class="kpi-card"><div class="kpi-label">Total documents</div><div class="kpi-value">${DOCS_DB.length}</div></div>
    <div class="kpi-card"><div class="kpi-label">Categories</div><div class="kpi-value">${types.length}</div></div>
    <div class="kpi-card"><div class="kpi-label">Total size</div><div class="kpi-value" style="font-size:16px">23.5 MB</div></div>
    <div class="kpi-card"><div class="kpi-label">Last uploaded</div><div class="kpi-value" style="font-size:14px">Today</div></div>
  </div>
  <div class="card">
    <div class="card-hd"><span class="card-title">Document centre</span>
      <div style="display:flex;gap:6px;flex-wrap:wrap">
        <button class="btn btn-primary btn-sm" onclick="openUploadDoc()"><i class="ti ti-upload"></i>Upload document</button>
        <button class="btn btn-sm" onclick="downloadTableAsExcel('doc-tbl','documents')"><i class="ti ti-download"></i>Export list</button>
      </div>
    </div>
    <div style="display:flex;gap:8px;flex-wrap:wrap;margin-bottom:10px;padding:10px 12px;background:var(--zinc-50);border:1px solid var(--border);border-radius:var(--r-md)">
      <input class="tbl-search" placeholder="Search document name, type, tags..." oninput="filterTable(this,'doc-tbl')" style="flex:1;min-width:160px">
      <select class="tbl-filter" onchange="filterByCol('doc-tbl',2,this.value)">
        <option value="">All types</option>${types.map(t=>`<option>${t}</option>`).join('')}
      </select>
      <button class="btn btn-sm" onclick="clearTableFilters('doc-tbl','p-doccenter')">Clear</button>
    </div>
    <div class="bulk-bar" id="doc-bar"><span id="doc-cnt" class="badge b-gray">0 selected</span>
      <button class="btn btn-sm" onclick="toast('Documents downloaded')"><i class="ti ti-download"></i>Download</button>
      <button class="btn btn-sm btn-danger" onclick="bulkDeleteChecked('doc-tbl','doc-cb','doc-bar',()=>toast('Documents deleted'))">Delete</button>
    </div>
    <table id="doc-tbl">
      <tr>
        <th class="col-check"><input type="checkbox" id="doc-all" style="accent-color:var(--primary)" onchange="selectAllInTbl(this,'doc-cb')"></th>
        <th class="sortable" onclick="sortTable(this)">Document name</th>
        <th class="sortable" onclick="sortTable(this)">Type</th>
        <th class="sortable" onclick="sortTable(this)">Size</th>
        <th class="sortable" onclick="sortTable(this)">Date</th>
        <th class="sortable" onclick="sortTable(this)">Tags</th>
        <th>Actions</th>
      </tr>
      ${DOCS_DB.map(d => `<tr data-date="${d.date}">
        <td class="col-check"><input type="checkbox" class="doc-cb" style="accent-color:var(--primary)" onchange="updateBulkBar('doc-tbl','doc-bar','doc-cnt','doc-cb','doc-all')"></td>
        <td>
          <div style="display:flex;align-items:center;gap:9px">
            <div style="width:30px;height:30px;background:var(--zinc-50);border:1px solid var(--border);border-radius:var(--r-sm);display:flex;align-items:center;justify-content:center;flex-shrink:0">
              <i class="ti ti-file-description" style="font-size:16px;color:var(--text-tertiary)"></i>
            </div>
            <span style="font-weight:600;cursor:pointer" onclick="toast('Opening ${d.name}')">${d.name}</span>
          </div>
        </td>
        <td><span class="badge b-gray">${d.type}</span></td>
        <td style="font-size:12px;color:var(--text-secondary)">${d.size}</td>
        <td style="font-size:12px">${d.date}</td>
        <td>${d.tags.map(t=>`<span class="badge b-blue" style="margin-right:3px;font-size:10px">${t}</span>`).join('')}</td>
        <td class="action-col"><div class="action-menu"><button class="action-btn" onclick="toggleAction(this)">Actions <i class="ti ti-chevron-down" style="font-size:10px"></i></button>
          <div class="action-dropdown">
            <a onclick="toast('Downloading ${d.name}');return false"><i class="ti ti-download"></i>Download</a>
            <a onclick="toast('Sharing ${d.name}');return false"><i class="ti ti-share"></i>Share</a>
            <a onclick="toast('Renaming ${d.name}');return false"><i class="ti ti-pencil"></i>Rename</a>
            <div class="sep"></div>
            <a class="danger" onclick="warnDelete('${d.name}','account',()=>{this.closest('tr').remove()});return false"><i class="ti ti-trash"></i>Delete</a>
          </div></div></td>
      </tr>`).join('')}
    </table>
  </div>`;
  setupBulk('doc-tbl','doc-bar','doc-cnt','doc-cb','doc-all');
  setupTableDefaults('doc-tbl');
}

// ── projects ──────────────────────────────────────
BUILDERS.projects = function(panel) {
  panel.innerHTML = `
  <div class="card">
    <div class="card-hd"><span class="card-title">Projects</span>
      <div style="display:flex;gap:6px">
        <button class="btn btn-primary btn-sm" onclick="toast('New project form')"><i class="ti ti-plus"></i>New project</button>
        <button class="btn btn-sm" onclick="exportCSV('proj-tbl','projects')"><i class="ti ti-download"></i>Export</button>
      </div>
    </div>
    <div class="bulk-bar" id="proj-bar"><span id="proj-cnt" class="badge b-gray">0 selected</span><button class="btn btn-sm" onclick="toast('Projects archived')">Archive</button></div>
    <table id="proj-tbl">
      <tr><th class="col-check"><input type="checkbox" id="proj-all" style="accent-color:var(--g500)"></th><th class="sortable" onclick="sortTable(this)">Project ref</th><th class="sortable" onclick="sortTable(this)">Name</th><th class="sortable" onclick="sortTable(this)">Client</th><th class="sortable" onclick="sortTable(this)" style="text-align:right">Budget (₦)</th><th class="sortable" onclick="sortTable(this)" style="text-align:right">Spent (₦)</th><th class="sortable" onclick="sortTable(this)">Status</th><th>Actions</th></tr>
      ${[['PRJ-001','ERP Implementation','Nestlé Nigeria Plc','12,000,000','4,200,000','Active'],['PRJ-002','Annual IT support','Dangote Foods','3,600,000','1,800,000','Active'],['PRJ-003','Website redesign','MTN Nigeria','2,400,000','2,400,000','Complete'],['PRJ-004','Inventory audit','Lagos State Govt','800,000','650,000','Active']].map(([ref,name,client,budget,spent,status]) => {
        const pct = Math.round(parseInt(spent.replace(/,/g,''))/parseInt(budget.replace(/,/g,''))*100);
        return `<tr>
          <td class="col-check"><input type="checkbox" class="proj-cb" style="accent-color:var(--g500)"></td>
          <td class="td-bold" style="color:var(--g600)">${ref}</td>
          <td style="cursor:pointer;font-weight:600" onclick="toast('Viewing ${name}')">${name}</td>
          <td>${client}</td>
          <td style="text-align:right">₦${budget}</td>
          <td style="text-align:right;color:${pct>=100?'var(--r400)':'var(--g600)'}">₦${spent}</td>
          <td><span class="badge ${status==='Active'?'b-green':'b-gray'}">${status}</span></td>
          <td class="action-col"><div class="action-menu"><button class="action-btn" onclick="toggleAction(this)">Actions <i class="ti ti-chevron-down" style="font-size:10px"></i></button><div class="action-dropdown"><a onclick="toast('Viewing ${ref}');return false">View details</a><a onclick="toast('Editing ${ref}');return false">Edit</a><a onclick="toast('Adding costs to ${ref}');return false">Add costs</a><div class="sep"></div><a class="danger" onclick="warnDelete('${name}',()=>{this.closest('tr').remove()});return false">Archive</a></div></div></td>
        </tr>`;
      }).join('')}
    </table>
  </div>`;
  setupBulk('proj-tbl','proj-bar','proj-cnt','proj-cb','proj-all');
}

// ── profile ──────────────────────────────────────
BUILDERS.profile = function(panel) {
  const u = currentUser || { name:'Amaka Adeyemi', initials:'AA', role:'Tenant Admin', org:'Acme Trading Ltd', sa:false };
  panel.innerHTML = `
  <div class="grid-2">
    <div>
      <div class="card">
        <div class="card-hd"><span class="card-title">My profile</span></div>
        <div style="display:flex;align-items:center;gap:16px;margin-bottom:20px;padding-bottom:16px;border-bottom:1px solid var(--border)">
          <div style="width:64px;height:64px;border-radius:50%;background:var(--g400);color:white;font-size:22px;font-weight:700;display:flex;align-items:center;justify-content:center;flex-shrink:0" id="profile-avatar">${u.initials}</div>
          <div>
            <div style="font-size:18px;font-weight:700" id="profile-name">${u.name}</div>
            <div style="font-size:12px;color:var(--t400);margin-top:2px">${u.role} · ${u.org}</div>
            <button class="btn btn-sm" style="margin-top:6px" onclick="toast('Photo upload opened')"><i class="ti ti-camera"></i>Change photo</button>
          </div>
        </div>
        <div class="form-group"><label class="form-label">Full name</label><input class="form-input" id="prof-name" value="${u.name}"></div>
        <div class="form-group"><label class="form-label">Email address</label><input class="form-input" id="prof-email" value="amaka@acmetrading.ng" type="email"></div>
        <div class="form-group"><label class="form-label">Job title</label><input class="form-input" id="prof-title" value="Finance Director" placeholder="Your job title"></div>
        <div class="form-group"><label class="form-label">Phone number</label><input class="form-input" id="prof-phone" value="+234 801 234 5678" type="tel"></div>
        <div class="form-group"><label class="form-label">Language</label>
          <select class="form-input"><option selected>English (Nigeria)</option><option>English (UK)</option></select>
        </div>
        <button class="btn btn-primary" onclick="saveProfile()"><i class="ti ti-device-floppy"></i>Save profile</button>
      </div>
    </div>
    <div>
      <div class="card" style="margin-bottom:14px">
        <div class="card-hd"><span class="card-title">Security</span></div>
        <div class="form-group"><label class="form-label">Current password</label><input class="form-input" type="password" placeholder="••••••••"></div>
        <div class="form-group"><label class="form-label">New password</label><input class="form-input" type="password" placeholder="Min 10 characters"></div>
        <div class="form-group"><label class="form-label">Confirm new password</label><input class="form-input" type="password" placeholder="Repeat new password"></div>
        <div style="display:flex;align-items:center;justify-content:space-between;padding:10px 0;border-top:1px solid var(--border);margin-top:4px">
          <div><div style="font-size:13px;font-weight:600">Two-factor authentication</div><div style="font-size:11px;color:var(--t400)">Add an extra layer of security to your account</div></div>
          <button class="toggle" onclick="this.classList.toggle('on');toast('2FA '+(this.classList.contains('on')?'enabled':'disabled'))"></button>
        </div>
        <button class="btn btn-primary" style="margin-top:10px" onclick="toast('Password updated successfully')"><i class="ti ti-key"></i>Update password</button>
      </div>
      <div class="card">
        <div class="card-hd"><span class="card-title">Notifications</span></div>
        ${[['Invoice payment received','on'],['Bill due reminder','on'],['Payroll processed','on'],['New support ticket reply','on'],['FIRS submission status','on'],['System announcements','']].map(([label, on]) => `
        <div style="display:flex;align-items:center;justify-content:space-between;padding:8px 0;border-bottom:1px solid var(--bg)">
          <span style="font-size:12px">${label}</span>
          <button class="toggle ${on}" onclick="this.classList.toggle('on')"></button>
        </div>`).join('')}
        <button class="btn btn-primary btn-sm" style="margin-top:10px" onclick="toast('Notification preferences saved')"><i class="ti ti-device-floppy"></i>Save preferences</button>
      </div>
    </div>
  </div>
  <div class="card" style="margin-top:4px">
    <div class="card-hd"><span class="card-title">Legal & privacy</span></div>
    <div style="display:flex;gap:10px;flex-wrap:wrap">
      <button class="btn" onclick="nav(document.querySelector('[onclick*=\\'legal\\']'),'legal')"><i class="ti ti-scale"></i>Terms of service</button>
      <button class="btn" onclick="showPrivacy()"><i class="ti ti-shield-lock"></i>Privacy policy</button>
      <button class="btn" onclick="toast('Cookie preferences opened')"><i class="ti ti-cookie"></i>Cookie preferences</button>
      <button class="btn btn-danger" style="margin-left:auto" onclick="warnDelete('your account',()=>{toast('Account deletion request submitted');doLogout()})"><i class="ti ti-trash"></i>Delete account</button>
    </div>
  </div>`;
}
