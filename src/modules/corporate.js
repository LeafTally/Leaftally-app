// ============================================================
// LeafTally — CORPORATE module
// ============================================================

/* global BUILDERS, PICKLISTS, GL_ACCOUNTS, PRODUCTS, */
/* global CUSTOMERS_DB, SUPPLIERS_DB, JOURNAL_LEDGER, */
/* global currentUser, openDrawer, closeDrawer, toast, */
/* global filterTable, filterByCol, sortTable, setupTableDefaults */

// ── dimensions ──────────────────────────────────────
BUILDERS.dimensions = function(panel) {
  var DIMS = [
    {code:'DEPT',name:'Department',type:'Department',values:['Finance','Sales','Operations','IT','HR','Management'],active:true,useIn:['Journal entries','Invoices','Bills','Expenses','Payroll']},
    {code:'LOC',name:'Location',type:'Location',values:['Lagos','Abuja','Port Harcourt','Kano'],active:true,useIn:['Journal entries','Invoices','Bills']},
    {code:'PRJ',name:'Project',type:'Project',values:['ERP Implementation','Office Renovation','Marketing Campaign Q3 2026'],active:true,useIn:['Journal entries','Expenses','Bills']},
    {code:'CC',name:'Cost centre',type:'Cost Centre',values:['CC-Finance','CC-Sales','CC-Operations','CC-IT'],active:true,useIn:['Journal entries','Expenses','Payroll']},
    {code:'CUST_SEG',name:'Customer segment',type:'Custom',values:['Enterprise','SME','Government','NGO'],active:false,useIn:['Invoices']},
  ];

  var totalValues = DIMS.reduce(function(sum, d){ return sum + d.values.length; }, 0);

  panel.innerHTML = '<div class="alert alert-blue"><i class="ti ti-info-circle"></i>Dimensions let you categorise transactions by Department, Location, Project, Cost Centre, or any custom type. Configure types and values here, then assign them to transactions for detailed reporting.</div>' +
    '<div class="kpi-strip">' +
    '<div class="kpi-card"><div class="kpi-label">Dimension types</div><div class="kpi-value">' + DIMS.length + '</div></div>' +
    '<div class="kpi-card"><div class="kpi-label">Total values</div><div class="kpi-value">' + totalValues + '</div></div>' +
    '<div class="kpi-card"><div class="kpi-label">Active types</div><div class="kpi-value" style="color:var(--green-700)">' + DIMS.filter(function(d){return d.active;}).length + '</div></div>' +
    '</div>' +
    '<div style="display:grid;grid-template-columns:280px 1fr;gap:16px">' +
    '<div>' +
    '<div class="card">' +
    '<div class="card-hd" style="padding:10px 12px"><span class="card-title">Dimension types</span>' +
    '<button class="btn btn-primary btn-sm" onclick="openNewDimensionType()"><i class="ti ti-plus"></i>New type</button></div>' +
    DIMS.map(function(d, i) {
      return '<div id="dim-type-row-' + d.code + '" onclick="showDimensionDetail(\'' + d.code + '\')" style="display:flex;align-items:center;gap:8px;padding:9px 12px;cursor:pointer;border-left:3px solid var(--border);transition:all .1s" onmouseover="this.style.background=\'var(--zinc-50)\'" onmouseout="this.style.background=\'transparent\'">' +
        '<div style="flex:1"><div style="font-weight:600;font-size:13px">' + d.name + '</div>' +
        '<div style="font-size:11px;color:var(--text-tertiary)">' + d.values.length + ' values · ' + d.type + '</div></div>' +
        '<span class="badge ' + (d.active?'b-green':'b-gray') + '" style="font-size:10px">' + (d.active?'Active':'Off') + '</span></div>';
    }).join('') +
    '</div></div>' +
    '<div id="dim-detail-pane">' +
    '<div class="card">' +
    '<div style="text-align:center;padding:40px;color:var(--text-tertiary)">' +
    '<i class="ti ti-chart-dots" style="font-size:40px;display:block;margin:0 auto 10px"></i>' +
    '<div style="font-size:14px;font-weight:600">Select a dimension type</div>' +
    '<div style="font-size:12px;margin-top:6px">Click any type on the left to view and edit its values</div>' +
    '</div></div></div>' +
    '</div>';

  window.showDimensionDetail = function(code) {
    var dim = DIMS.find(function(d){ return d.code === code; });
    if (!dim) return;
    // Highlight active row
    DIMS.forEach(function(d) {
      var row = document.getElementById('dim-type-row-' + d.code);
      if (row) row.style.borderLeftColor = d.code===code ? 'var(--primary)' : 'var(--border)';
    });
    var pane = document.getElementById('dim-detail-pane');
    if (!pane) return;
    pane.innerHTML = '<div class="card">' +
      '<div class="card-hd"><span class="card-title">' + dim.name + ' — values</span>' +
      '<div style="display:flex;gap:6px">' +
      '<button class="btn btn-primary btn-sm" onclick="openAddDimensionValue(\'' + code + '\')"><i class="ti ti-plus"></i>Add value</button>' +
      '<button class="btn btn-sm" onclick="toggleDimensionActive(\'' + code + '\')">' + (dim.active?'Deactivate':'Activate') + ' type</button>' +
      '</div></div>' +
      '<div class="form-row" style="padding:10px 12px;background:var(--zinc-50);border-radius:var(--r-md);margin-bottom:12px">' +
      '<div class="form-group"><label class="form-label">Type label</label><input class="form-input" value="' + dim.name + '" id="dim-type-label"></div>' +
      '<div class="form-group"><label class="form-label">Category</label><select class="form-input"><option>' + dim.type + '</option><option>Department</option><option>Location</option><option>Project</option><option>Cost Centre</option><option>Custom</option></select></div>' +
      '</div>' +
      '<div style="font-size:11px;font-weight:700;color:var(--text-secondary);text-transform:uppercase;margin-bottom:8px">Values (' + dim.values.length + ')</div>' +
      '<div id="dim-values-list">' +
      dim.values.map(function(v, i) {
        return '<div style="display:flex;align-items:center;gap:8px;padding:8px 0;border-bottom:1px solid var(--border)">' +
          '<i class="ti ti-grip-vertical" style="color:var(--text-tertiary);cursor:grab"></i>' +
          '<span style="flex:1;font-size:13px;font-weight:500">' + v + '</span>' +
          '<span style="font-size:11px;color:var(--text-tertiary);padding:2px 8px;background:var(--zinc-50);border-radius:4px">' + dim.code + '-' + String(i+1).padStart(3,'0') + '</span>' +
          '<button class="btn btn-sm" style="padding:2px 8px;font-size:11px" onclick="toast(\'Editing '+v+'\')"><i class="ti ti-pencil"></i></button>' +
          '<button class="btn btn-sm btn-danger" style="padding:2px 8px;font-size:11px" onclick="this.closest(\'div\').remove();toast(\''+v+' removed\')"><i class="ti ti-trash"></i></button>' +
          '</div>';
      }).join('') +
      '</div>' +
      '<div style="margin-top:12px">' +
      '<div style="font-size:11px;font-weight:700;color:var(--text-secondary);text-transform:uppercase;margin-bottom:8px">Used in</div>' +
      dim.useIn.map(function(m){ return '<span class="badge b-blue" style="margin-right:4px;margin-bottom:4px">' + m + '</span>'; }).join('') +
      '</div>' +
      '<button class="btn btn-primary btn-sm" style="margin-top:12px" onclick="toast(\'' + dim.name + ' type saved\')"><i class="ti ti-device-floppy"></i>Save changes</button>' +
      '</div>';
  };
}

// ── audittrail ──────────────────────────────────────
BUILDERS.audittrail = function(panel) {
  var actionColors = {Created:'b-green',Posted:'b-blue',Updated:'b-amber',Deleted:'b-red',Approved:'b-green',Exported:'b-gray',Viewed:'b-gray',Scheduled:'b-gray','Logged in':'b-blue'};
  panel.innerHTML = '<div class="kpi-strip">' +
    '<div class="kpi-card"><div class="kpi-label">Events today</div><div class="kpi-value">4</div></div>' +
    '<div class="kpi-card"><div class="kpi-label">Events this week</div><div class="kpi-value">' + AUDIT_LOG.length + '</div></div>' +
    '<div class="kpi-card"><div class="kpi-label">Users active</div><div class="kpi-value">4</div></div>' +
    '<div class="kpi-card"><div class="kpi-label">Critical actions</div><div class="kpi-value" style="color:var(--amber-700)">1</div><div class="kpi-sub">1 deletion</div></div>' +
    '</div>' +
    '<div class="card">' +
    '<div class="card-hd"><span class="card-title">Audit trail</span>' +
    '<div style="display:flex;gap:6px">' +
    '<button class="btn btn-sm" onclick="downloadTableAsExcel(\'audit-tbl\',\'audit-trail\')"><i class="ti ti-download"></i>Export CSV</button>' +
    '</div></div>' +
    '<div style="display:flex;gap:8px;flex-wrap:wrap;margin-bottom:10px;padding:10px 12px;background:var(--zinc-50);border:1px solid var(--border);border-radius:var(--r-md)">' +
    '<input class="tbl-search" placeholder="Search user, module, action..." oninput="filterTable(this,\'audit-tbl\')" style="flex:1;min-width:160px">' +
    '<select class="tbl-filter" onchange="filterByCol(\'audit-tbl\',3,this.value)">' +
    '<option value="">All actions</option>' +
    ['Created','Posted','Updated','Deleted','Approved','Exported','Viewed'].map(function(a){ return '<option>'+a+'</option>'; }).join('') +
    '</select>' +
    '<select class="tbl-filter" onchange="filterByCol(\'audit-tbl\',2,this.value)">' +
    '<option value="">All users</option>' +
    ['Amaka Adeyemi','Chukwuemeka Obi','Funmi Adeola','Babatunde Adeyemi','System'].map(function(u){ return '<option>'+u+'</option>'; }).join('') +
    '</select>' +
    '<input type="date" class="tbl-filter" id="audit-f-from">' +
    '<input type="date" class="tbl-filter" id="audit-f-to">' +
    '<button class="btn btn-sm" onclick="applyDateFilter(\'audit-tbl\',0,\'audit-f-from\',\'audit-f-to\')"><i class="ti ti-filter"></i>Filter</button>' +
    '<button class="btn btn-sm" onclick="clearTableFilters(\'audit-tbl\',\'p-audittrail\')">Clear</button>' +
    '</div>' +
    '<table id="audit-tbl">' +
    '<tr><th class="sortable" onclick="sortTable(this)">Timestamp</th><th class="sortable" onclick="sortTable(this)">User</th><th class="sortable" onclick="sortTable(this)">Role</th><th class="sortable" onclick="sortTable(this)">Action</th><th class="sortable" onclick="sortTable(this)">Module</th><th class="sortable" onclick="sortTable(this)">Record</th><th class="sortable" onclick="sortTable(this)">IP address</th><th>Detail</th></tr>' +
    AUDIT_LOG.map(function(entry) {
      var badgeClass = actionColors[entry.action] || 'b-gray';
      return '<tr>' +
        '<td style="font-size:11.5px;white-space:nowrap">' + entry.ts + '</td>' +
        '<td style="font-weight:600;font-size:12.5px">' + entry.user + '</td>' +
        '<td style="font-size:12px;color:var(--text-tertiary)">' + entry.role + '</td>' +
        '<td><span class="badge ' + badgeClass + '">' + entry.action + '</span></td>' +
        '<td style="font-size:12.5px">' + entry.module + '</td>' +
        '<td class="td-mono" style="font-size:11.5px;color:var(--green-700)">' + entry.record + '</td>' +
        '<td class="td-mono" style="font-size:11px;color:var(--text-tertiary)">' + entry.ip + '</td>' +
        '<td style="font-size:11.5px;color:var(--text-secondary);max-width:220px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap" title="' + entry.detail + '">' + entry.detail + '</td>' +
        '</tr>';
    }).join('') +
    '</table></div>';
  setupTableDefaults('audit-tbl');
}

// ── multientity ──────────────────────────────────────
BUILDERS.multientity = function(panel) {
  panel.innerHTML = '<div class="alert alert-blue"><i class="ti ti-info-circle"></i>Multi-entity consolidation allows you to manage multiple legal entities and produce consolidated financial statements. Available on the Enterprise plan.</div>' +
    '<div class="kpi-strip">' +
    '<div class="kpi-card"><div class="kpi-label">Entities</div><div class="kpi-value">' + ENTITIES.length + '</div></div>' +
    '<div class="kpi-card"><div class="kpi-label">Currencies</div><div class="kpi-value">2</div><div class="kpi-sub">NGN, USD</div></div>' +
    '<div class="kpi-card"><div class="kpi-label">Last consolidation</div><div class="kpi-value" style="font-size:14px">30 Jun 2026</div></div>' +
    '</div>' +
    '<div class="card">' +
    '<div class="card-hd"><span class="card-title">Entities</span>' +
    '<div style="display:flex;gap:6px">' +
    '<button class="btn btn-primary btn-sm" onclick="openAddEntity()"><i class="ti ti-plus"></i>Add entity</button>' +
    '<button class="btn btn-sm" onclick="toast(\'Running consolidation...\')"><i class="ti ti-refresh"></i>Run consolidation</button>' +
    '</div></div>' +
    '<table id="entity-tbl">' +
    '<tr><th>Entity ID</th><th>Name</th><th>TIN</th><th>Currency</th><th>FX rate to NGN</th><th>Status</th><th>Last sync</th><th>Actions</th></tr>' +
    ENTITIES.map(function(e) {
      return '<tr>' +
        '<td class="td-mono" style="font-size:11px">' + e.id + '</td>' +
        '<td class="td-bold">' + e.name + '</td>' +
        '<td class="td-mono" style="font-size:11.5px">' + e.tin + '</td>' +
        '<td><span class="badge b-gray">' + e.currency + '</span></td>' +
        '<td style="font-variant-numeric:tabular-nums">' + (e.fx===1?'Base currency':'₦'+e.fx.toLocaleString()) + '</td>' +
        '<td><span class="badge ' + (e.status==='Parent'?'b-green':'b-blue') + '">' + e.status + '</span></td>' +
        '<td style="font-size:12px;color:var(--text-tertiary)">' + e.lastSync + '</td>' +
        '<td class="action-col"><div class="action-menu"><button class="action-btn" onclick="toggleAction(this)">Actions <i class="ti ti-chevron-down" style="font-size:10px"></i></button>' +
        '<div class="action-dropdown">' +
        '<a onclick="toast(\'Opening '+e.name+'\');return false"><i class="ti ti-login"></i>Access entity</a>' +
        '<a onclick="toast(\'Syncing '+e.name+'\');return false"><i class="ti ti-refresh"></i>Sync now</a>' +
        '<a onclick="toast(\'Elimination entries for '+e.name+'\');return false"><i class="ti ti-circle-minus"></i>Elimination entries</a>' +
        (e.status!=='Parent'?'<div class="sep"></div><a class="danger" onclick="warnDelete(\''+e.name+'\',\'account\',function(){toast(\'Entity removed\')});return false"><i class="ti ti-trash"></i>Remove</a>':'') +
        '</div></div></td>' +
        '</tr>';
    }).join('') +
    '</table></div>' +
    '<div class="card" style="margin-top:14px">' +
    '<div class="card-hd"><span class="card-title">Consolidated trial balance — Jun 2026</span>' +
    '<button class="btn btn-sm" onclick="toast(\'Consolidated TB exported\')"><i class="ti ti-download"></i>Export</button>' +
    '</div>' +
    '<div class="alert alert-blue"><i class="ti ti-info-circle"></i>Intercompany transactions between Acme Trading Ltd and Acme Properties Ltd are automatically eliminated on consolidation.</div>' +
    '<table><tr><th>Account</th><th style="text-align:right">Acme Trading</th><th style="text-align:right">Acme Properties</th><th style="text-align:right">Eliminations</th><th style="text-align:right">Consolidated</th></tr>' +
    [['Revenue','24,320,000','8,400,000','(2,100,000)','30,620,000'],['Expenses','26,357,500','7,200,000','(2,100,000)','31,457,500'],['Net (loss)/profit','(2,037,500)','1,200,000','—','(837,500)'],['Total assets','38,570,700','14,200,000','(3,500,000)','49,270,700']].map(function(row) {
      return '<tr><td class="td-bold">' + row[0] + '</td>' +
        row.slice(1).map(function(v){ return '<td style="text-align:right;font-variant-numeric:tabular-nums">₦' + v + '</td>'; }).join('') + '</tr>';
    }).join('') +
    '</table></div>';
}

// ── accountant ──────────────────────────────────────
BUILDERS.accountant = function(panel) {
  var total   = ACCOUNTANT_CLIENTS.length;
  var active  = ACCOUNTANT_CLIENTS.filter(function(c){return c.status==='Active';}).length;
  var pending = ACCOUNTANT_CLIENTS.filter(function(c){return c.status==='Pending';}).length;

  panel.innerHTML = '<div class="kpi-strip">' +
    '<div class="kpi-card"><div class="kpi-label">Client businesses</div><div class="kpi-value">' + total + '</div></div>' +
    '<div class="kpi-card"><div class="kpi-label">Active access</div><div class="kpi-value" style="color:var(--green-700)">' + active + '</div></div>' +
    '<div class="kpi-card"><div class="kpi-label">Pending invites</div><div class="kpi-value" style="color:var(--amber-700)">' + pending + '</div></div>' +
    '<div class="kpi-card"><div class="kpi-label">My partner code</div><div class="kpi-value" style="font-size:14px">LT-ACC-4829</div><div class="kpi-sub">Share with clients</div></div>' +
    '</div>' +
    '<div class="card">' +
    '<div class="card-hd"><span class="card-title">Client businesses</span>' +
    '<div style="display:flex;gap:6px">' +
    '<button class="btn btn-primary btn-sm" onclick="openInviteClientBusiness()"><i class="ti ti-user-plus"></i>Add client</button>' +
    '<button class="btn btn-sm" onclick="downloadTableAsExcel(\'acct-clients-tbl\',\'accountant-clients\')"><i class="ti ti-download"></i>Export</button>' +
    '</div></div>' +
    '<div style="display:flex;gap:8px;margin-bottom:10px">' +
    '<input class="tbl-search" placeholder="Search clients..." oninput="filterTable(this,\'acct-clients-tbl\')" style="flex:1">' +
    '</div>' +
    '<table id="acct-clients-tbl">' +
    '<tr><th>Client ID</th><th>Business name</th><th>Primary contact</th><th>Plan</th><th>Your role</th><th>Last accessed</th><th>Status</th><th>Actions</th></tr>' +
    ACCOUNTANT_CLIENTS.map(function(cl) {
      return '<tr>' +
        '<td class="td-mono" style="font-size:11px;color:var(--text-tertiary)">' + cl.id + '</td>' +
        '<td class="td-bold" style="cursor:pointer;color:var(--green-700)" onclick="switchToClientTenant(\'' + cl.id + '\',\'' + cl.name + '\')">' + cl.name + '</td>' +
        '<td><div style="font-size:12.5px">' + cl.contact + '</div><div style="font-size:11px;color:var(--text-tertiary)">' + cl.email + '</div></td>' +
        '<td><span class="badge b-gray">' + cl.plan + '</span></td>' +
        '<td><span class="badge ' + (cl.role==='Full accountant'?'b-green':'b-blue') + '">' + cl.role + '</span></td>' +
        '<td style="font-size:12px;color:var(--text-tertiary)">' + cl.lastAccess + '</td>' +
        '<td><span class="badge ' + (cl.status==='Active'?'b-green':cl.status==='Pending'?'b-amber':'b-gray') + '">' + cl.status + '</span></td>' +
        '<td class="action-col"><div class="action-menu"><button class="action-btn" onclick="toggleAction(this)">Actions <i class="ti ti-chevron-down" style="font-size:10px"></i></button>' +
        '<div class="action-dropdown">' +
        '<a onclick="switchToClientTenant(\'' + cl.id + '\',\'' + cl.name + '\');return false"><i class="ti ti-login"></i>Access this client</a>' +
        '<a onclick="openChangeAccountantRole(\'' + cl.id + '\',\'' + cl.name + '\',\'' + cl.role + '\');return false"><i class="ti ti-pencil"></i>Change my role</a>' +
        '<a onclick="toast(\'Activity log for ' + cl.name + '\');return false"><i class="ti ti-history"></i>View activity log</a>' +
        '<div class="sep"></div>' +
        '<a class="danger" onclick="warnDelete(\'' + cl.name + '\',\'account\',function(){toast(\'Access removed for ' + cl.name + '\')});return false"><i class="ti ti-logout"></i>Remove access</a>' +
        '</div></div></td>' +
        '</tr>';
    }).join('') +
    '</table></div>' +
    '<div class="card" style="margin-top:14px">' +
    '<div class="card-hd"><span class="card-title">How accountant access works</span></div>' +
    '<div style="display:grid;grid-template-columns:repeat(3,1fr);gap:16px;padding:4px 0">' +
    [['ti-mail','1. Invite client','Share your partner code LT-ACC-4829 with the client, or send them an invitation directly from this page.'],
     ['ti-check','2. Client approves','The client tenant admin accepts the invitation and grants you your chosen access level (full or read-only).'],
     ['ti-layout-dashboard','3. Switch between clients','Use the client list above to switch into any business. All your work is logged in their audit trail.']].map(function(row) {
      return '<div style="text-align:center;padding:16px 12px;background:var(--zinc-50);border-radius:var(--r-lg)">' +
        '<i class="ti ' + row[0] + '" style="font-size:32px;color:var(--green-600);display:block;margin:0 auto 10px"></i>' +
        '<div style="font-weight:700;font-size:13px;margin-bottom:6px">' + row[1] + '</div>' +
        '<div style="font-size:12px;color:var(--text-secondary);line-height:1.5">' + row[2] + '</div></div>';
    }).join('') +
    '</div></div>';
}

// ── clientsubmission ──────────────────────────────────────
BUILDERS.clientsubmission = function(panel) {
  var submissions = [
    {id:'SUB-041',tenant:'Acme Trading Ltd',type:'FIRS e-Invoice',ref:'INV-2026-0041',status:'Submitted',date:'24 Jul 09:41',response:'Accepted — Ref: FIRS-2026-7841'},
    {id:'SUB-040',tenant:'Acme Trading Ltd',type:'FIRS e-Invoice',ref:'INV-2026-0040',status:'Submitted',date:'23 Jul 14:20',response:'Accepted — Ref: FIRS-2026-7802'},
    {id:'SUB-039',tenant:'Lagos Bakeries Ltd',type:'VAT return',ref:'VAT-Q2-2026',status:'Pending',date:'22 Jul 11:00',response:'Queued for processing'},
    {id:'SUB-038',tenant:'VicTech Solutions',type:'FIRS e-Invoice',ref:'INV-2026-0087',status:'Failed',date:'21 Jul 09:30',response:'Error: TIN mismatch — verify FIRS TIN in Settings'},
  ];
  panel.innerHTML =
    '<div class="kpi-strip">' +
    '<div class="kpi-card"><div class="kpi-label">Total submissions</div><div class="kpi-value">' + submissions.length + '</div></div>' +
    '<div class="kpi-card"><div class="kpi-label">Accepted</div><div class="kpi-value" style="color:var(--green-700)">' + submissions.filter(function(s){return s.status==='Submitted';}).length + '</div></div>' +
    '<div class="kpi-card"><div class="kpi-label">Pending</div><div class="kpi-value" style="color:var(--amber-700)">' + submissions.filter(function(s){return s.status==='Pending';}).length + '</div></div>' +
    '<div class="kpi-card"><div class="kpi-label">Failed</div><div class="kpi-value" style="color:var(--red-600)">' + submissions.filter(function(s){return s.status==='Failed';}).length + '</div></div>' +
    '</div>' +
    '<div class="card"><div class="card-hd"><span class="card-title">FIRS & regulatory submissions</span>' +
    '<button class="btn btn-sm" onclick="downloadTableAsExcel(\'sub-tbl\',\'submissions\')"><i class="ti ti-download"></i>Export</button></div>' +
    '<table id="sub-tbl">' +
    '<tr><th>Sub ID</th><th>Tenant</th><th>Type</th><th>Ref</th><th>Date</th><th>Status</th><th>FIRS response</th><th>Actions</th></tr>' +
    submissions.map(function(s) {
      return '<tr>' +
        '<td class="td-mono" style="font-size:11px">' + s.id + '</td>' +
        '<td style="font-weight:600;font-size:12.5px">' + s.tenant + '</td>' +
        '<td><span class="badge b-gray" style="font-size:10.5px">' + s.type + '</span></td>' +
        '<td class="td-mono" style="font-size:11.5px;color:var(--green-700)">' + s.ref + '</td>' +
        '<td style="font-size:12px">' + s.date + '</td>' +
        '<td><span class="badge ' + (s.status==='Submitted'?'b-green':s.status==='Pending'?'b-amber':'b-red') + '">' + s.status + '</span></td>' +
        '<td style="font-size:11.5px;color:var(--text-secondary);max-width:180px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap" title="' + s.response + '">' + s.response + '</td>' +
        '<td class="action-col"><div class="action-menu"><button class="action-btn" onclick="toggleAction(this)">Actions <i class="ti ti-chevron-down" style="font-size:10px"></i></button>' +
        '<div class="action-dropdown">' +
        (s.status==='Failed'?'<a onclick="toast(\'Retrying ' + s.id + '\');return false"><i class="ti ti-refresh"></i>Retry submission</a>':'') +
        '<a onclick="toast(\'Viewing ' + s.id + '\');return false"><i class="ti ti-eye"></i>View details</a>' +
        '</div></div></td>' +
        '</tr>';
    }).join('') +
    '</table></div>';
  setupTableDefaults('sub-tbl');
}

// ── referral ──────────────────────────────────────
BUILDERS.referral = function(panel) {
  var total = window.REFERRALS.reduce(function(s,r){return s+r.commission;},0);
  var converted = window.REFERRALS.filter(function(r){return r.status==='Converted';}).length;
  panel.innerHTML =
    '<div class="kpi-strip">' +
    '<div class="kpi-card"><div class="kpi-label">Total referrals</div><div class="kpi-value">' + window.REFERRALS.length + '</div></div>' +
    '<div class="kpi-card"><div class="kpi-label">Converted</div><div class="kpi-value" style="color:var(--green-700)">' + converted + '</div></div>' +
    '<div class="kpi-card"><div class="kpi-label">Total commissions paid</div><div class="kpi-value" style="font-size:15px">₦' + total.toLocaleString() + '</div></div>' +
    '<div class="kpi-card"><div class="kpi-label">Conversion rate</div><div class="kpi-value">' + Math.round(converted/window.REFERRALS.length*100) + '%</div></div>' +
    '</div>' +
    '<div class="card"><div class="card-hd"><span class="card-title">Referral programme</span>' +
    '<button class="btn btn-sm" onclick="downloadTableAsExcel(\'ref-tbl\',\'referrals\')"><i class="ti ti-download"></i>Export</button></div>' +
    '<table id="ref-tbl"><tr><th>Ref ID</th><th>Referrer</th><th>Referred business</th><th>Date</th><th>Status</th><th style="text-align:right">Commission (₦)</th><th>Actions</th></tr>' +
    window.REFERRALS.map(function(r) {
      return '<tr>' +
        '<td class="td-mono" style="font-size:11px">' + r.id + '</td>' +
        '<td><div style="font-weight:600;font-size:12.5px">' + r.referrer + '</div><div style="font-size:11px;color:var(--text-tertiary)">' + r.tenant + '</div></td>' +
        '<td style="font-weight:600">' + r.referred + '</td>' +
        '<td style="font-size:12px">' + r.date + '</td>' +
        '<td><span class="badge ' + (r.status==='Converted'?'b-green':'b-amber') + '">' + r.status + '</span></td>' +
        '<td style="text-align:right;font-variant-numeric:tabular-nums;font-weight:' + (r.commission>0?'700':'400') + ';color:' + (r.commission>0?'var(--green-700)':'var(--text-tertiary)') + '">' + (r.commission>0?'₦'+r.commission.toLocaleString():'—') + '</td>' +
        '<td class="action-col"><div class="action-menu"><button class="action-btn" onclick="toggleAction(this)">Actions <i class="ti ti-chevron-down" style="font-size:10px"></i></button>' +
        '<div class="action-dropdown">' +
        (r.status!=='Converted'?'<a onclick="toast(\'Marking as converted\');return false"><i class="ti ti-check"></i>Mark converted</a>':'') +
        '<a onclick="toast(\'Paying commission for ' + r.id + '\');return false"><i class="ti ti-credit-card"></i>Pay commission</a>' +
        '</div></div></td>' +
        '</tr>';
    }).join('') +
    '</table></div>';
  setupTableDefaults('ref-tbl');
}
