// ============================================================
// LeafTally — SUPERADMIN utilities
// ============================================================

// viewTenantDetail
function viewTenantDetail(id) {
  var t = window.SA_TENANTS.find(function(x){ return x.id===id; });
  if (!t) return;
  openDrawer(t.id + ' — ' + t.name,
    '<div class="detail-row"><span class="detail-label">Status</span><span class="detail-value"><span class="badge ' + (t.status==='Active'?'b-green':t.status==='Trial'?'b-blue':'b-red') + '">' + t.status + '</span></span></div>' +
    '<div class="detail-row"><span class="detail-label">Plan</span><span class="detail-value"><span class="badge ' + (t.plan==='Enterprise'?'b-amber':'b-blue') + '">' + t.plan + '</span></span></div>' +
    '<div class="detail-row"><span class="detail-label">Users</span><span class="detail-value">' + t.users + '</span></div>' +
    '<div class="detail-row"><span class="detail-label">Monthly revenue</span><span class="detail-value" style="color:var(--green-700);font-weight:700">₦' + t.revenue.toLocaleString() + '</span></div>' +
    '<div class="detail-row"><span class="detail-label">Joined</span><span class="detail-value">' + t.joined + '</span></div>' +
    '<div class="detail-row"><span class="detail-label">Last login</span><span class="detail-value">' + t.lastLogin + '</span></div>' +
    '<div class="detail-row"><span class="detail-label">Country</span><span class="detail-value">Nigeria (NG)</span></div>' +
    '<div style="margin-top:14px;display:flex;gap:8px;flex-wrap:wrap">' +
    '<button class="btn btn-primary btn-sm" onclick="impersonateTenant(\'' + id + '\',\'' + t.name + '\');closeDrawer()"><i class="ti ti-login"></i>Impersonate</button>' +
    '<button class="btn btn-sm" onclick="openChangePlan(\'' + id + '\',\'' + t.name + '\',\'' + t.plan + '\');closeDrawer()"><i class="ti ti-credit-card"></i>Change plan</button>' +
    '<button class="btn btn-sm" onclick="toast(\'Audit log for ' + t.name + '\')"><i class="ti ti-history"></i>Audit log</button>' +
    '</div>');
}

// impersonateTenant
function impersonateTenant(id, name) {
  openDrawer('Impersonate — ' + name,
    '<div class="alert alert-amber"><i class="ti ti-alert-triangle"></i>You are about to impersonate <strong>' + name + '</strong>. All actions will be logged. The tenant admin will be notified of this session.</div>' +
    '<div class="detail-row"><span class="detail-label">Tenant</span><span class="detail-value">' + name + '</span></div>' +
    '<div class="detail-row"><span class="detail-label">Your role during session</span><span class="detail-value">Tenant Admin (impersonated)</span></div>' +
    '<div style="margin-top:14px;display:flex;gap:8px">' +
    '<button class="btn btn-primary" onclick="toast(\'Entering ' + name + ' as impersonated admin...\');closeDrawer()"><i class="ti ti-login"></i>Start impersonation session</button>' +
    '<button class="btn" onclick="closeDrawer()">Cancel</button></div>');
}

// openChangePlan
function openChangePlan(id, name, currentPlan) {
  openDrawer('Change plan — ' + name,
    '<div class="form-group"><label class="form-label">Current plan</label><input class="form-input" value="' + currentPlan + '" readonly style="background:var(--zinc-50)"></div>' +
    '<div class="form-group"><label class="form-label">New plan</label>' +
    '<select class="form-input" id="new-plan-sel">' +
    ['Starter','Pro','Enterprise'].map(function(p){ return '<option ' + (p===currentPlan?'selected':'') + '>' + p + '</option>'; }).join('') +
    '</select></div>' +
    '<div class="form-group"><label class="form-label">Effective date</label>' +
    '<select class="form-input"><option>Immediately</option><option>Next billing cycle</option></select></div>' +
    '<div class="form-group"><label class="form-label">Notes (optional)</label>' +
    '<textarea class="form-input" rows="2" placeholder="Reason for change..."></textarea></div>' +
    '<div style="margin-top:12px;display:flex;gap:8px">' +
    '<button class="btn btn-primary" onclick="toast(\'' + name + ' plan updated\');closeDrawer()"><i class="ti ti-check"></i>Apply change</button>' +
    '<button class="btn" onclick="closeDrawer()">Cancel</button></div>');
}

// openProvisionTenant
function openProvisionTenant() {
  openDrawer('Provision new tenant',
    '<div class="form-row"><div class="form-group"><label class="form-label">Business name *</label><input class="form-input" id="pt-name" placeholder="e.g. Tech Corp Ltd"></div>' +
    '<div class="form-group"><label class="form-label">Plan</label>' +
    '<select class="form-input" id="pt-plan"><option>Starter</option><option>Pro</option><option>Enterprise</option></select></div></div>' +
    '<div class="form-row"><div class="form-group"><label class="form-label">Admin email *</label><input class="form-input" type="email" id="pt-email" placeholder="admin@company.ng"></div>' +
    '<div class="form-group"><label class="form-label">Admin name *</label><input class="form-input" id="pt-admin" placeholder="Full name"></div></div>' +
    '<div class="form-row"><div class="form-group"><label class="form-label">TIN</label><input class="form-input" id="pt-tin" placeholder="12345678-0001"></div>' +
    '<div class="form-group"><label class="form-label">Trial days</label><input class="form-input" type="number" id="pt-trial" value="14"></div></div>' +
    '<div style="margin-top:12px;display:flex;gap:8px">' +
    '<button class="btn btn-primary" onclick="saveNewTenant()"><i class="ti ti-check"></i>Provision tenant</button>' +
    '<button class="btn" onclick="closeDrawer()">Cancel</button></div>');
}

// saveNewTenant
function saveNewTenant() {
  var name  = document.getElementById('pt-name')?.value.trim();
  var email = document.getElementById('pt-email')?.value.trim();
  var admin = document.getElementById('pt-admin')?.value.trim();
  if (!name || !email || !admin) { toast('Business name, admin email and admin name required'); return; }
  window.SA_TENANTS.push({
    id:'T-'+String(window.SA_TENANTS.length+1).padStart(3,'0'),
    name, plan:document.getElementById('pt-plan')?.value||'Starter',
    users:1, status:'Trial', revenue:0,
    joined:new Date().toISOString().split('T')[0], country:'NG', lastLogin:'Never'
  });
  var panel = document.getElementById('p-superadmin');
  if (panel) { panel.dataset.built=''; BUILDERS.superadmin(panel); }
  closeDrawer();
  toast(name + ' provisioned successfully — welcome email sent to ' + email);
}

// saEditPlan
function saEditPlan(planId) {
  var plan = window.PLAN_DEFS[planId];
  if (!plan) return;
  openDrawer('Edit plan — ' + plan.name,
    '<div class="form-row">' +
    '<div class="form-group"><label class="form-label">Monthly price (₦) *</label><input class="form-input" type="number" id="ep-price" value="' + plan.price + '"></div>' +
    '<div class="form-group"><label class="form-label">Annual price (₦)</label><input class="form-input" type="number" id="ep-annual" value="' + plan.annualPrice + '"></div>' +
    '</div>' +
    '<div class="form-row">' +
    '<div class="form-group"><label class="form-label">Max users</label><input class="form-input" type="number" id="ep-users" value="' + plan.users + '"></div>' +
    '<div class="form-group"><label class="form-label">Storage</label><input class="form-input" id="ep-storage" value="' + plan.storage + '"></div>' +
    '</div>' +
    '<div class="form-group"><label class="form-label">Tagline</label><input class="form-input" id="ep-tagline" value="' + plan.tagline + '"></div>' +
    '<div class="form-row">' +
    '<div class="form-group"><label class="form-label">Max invoices/month</label><input class="form-input" type="number" id="ep-inv" value="' + plan.limits.invoices + '"></div>' +
    '<div class="form-group"><label class="form-label">Max customers</label><input class="form-input" type="number" id="ep-cust" value="' + plan.limits.customers + '"></div>' +
    '</div>' +
    '<div style="margin-top:12px;display:flex;gap:8px">' +
    '<button class="btn btn-primary" onclick="savePlanEdit(\'' + planId + '\')"><i class="ti ti-check"></i>Save plan changes</button>' +
    '<button class="btn" onclick="closeDrawer()">Cancel</button></div>');
}

// savePlanEdit
function savePlanEdit(planId) {
  var plan = window.PLAN_DEFS[planId];
  if (!plan) return;
  plan.price        = parseInt(document.getElementById('ep-price')?.value) || plan.price;
  plan.annualPrice  = parseInt(document.getElementById('ep-annual')?.value) || plan.annualPrice;
  plan.users        = parseInt(document.getElementById('ep-users')?.value) || plan.users;
  plan.storage      = document.getElementById('ep-storage')?.value || plan.storage;
  plan.tagline      = document.getElementById('ep-tagline')?.value || plan.tagline;
  plan.limits.invoices  = parseInt(document.getElementById('ep-inv')?.value) || plan.limits.invoices;
  plan.limits.customers = parseInt(document.getElementById('ep-cust')?.value) || plan.limits.customers;
  closeDrawer();
  toast(plan.name + ' plan updated — changes live immediately');
  renderSASubTab('plans');
}

// saOverridePlan
function saOverridePlan(tenantId, tenantName, currentPlan) {
  openDrawer('Override plan — ' + tenantName,
    '<div class="alert alert-amber"><i class="ti ti-alert-triangle"></i>Overriding a plan bypasses the normal payment flow. Use for corrections, migrations, or complimentary upgrades only.</div>' +
    '<div class="form-group" style="margin-top:12px"><label class="form-label">Current plan</label><input class="form-input" value="' + currentPlan + '" readonly style="background:var(--zinc-50)"></div>' +
    '<div class="form-group"><label class="form-label">Override to plan *</label>' +
    '<select class="form-input" id="override-plan">' +
    Object.values(window.PLAN_DEFS).map(function(p){ return '<option value="' + p.id + '"' + (p.name===currentPlan?' selected':'') + '>' + p.name + ' — ₦' + p.price.toLocaleString() + '/mo</option>'; }).join('') +
    '</select></div>' +
    '<div class="form-group"><label class="form-label">Valid until (leave blank = permanent)</label><input class="form-input" type="date" id="override-until"></div>' +
    '<div class="form-group"><label class="form-label">Override reason *</label><textarea class="form-input" id="override-reason" rows="2" placeholder="e.g. Complimentary upgrade, migration from legacy system..."></textarea></div>' +
    '<div style="margin-top:12px;display:flex;gap:8px">' +
    '<button class="btn btn-primary" onclick="applyPlanOverride(\'' + tenantId + '\',\'' + tenantName + '\')"><i class="ti ti-check"></i>Apply override</button>' +
    '<button class="btn" onclick="closeDrawer()">Cancel</button></div>');
}

// applyPlanOverride
function applyPlanOverride(tenantId, tenantName) {
  var plan   = document.getElementById('override-plan')?.value;
  var reason = document.getElementById('override-reason')?.value.trim();
  if (!plan || !reason) { toast('Plan and reason required'); return; }
  var tenant = window.SA_TENANTS.find(function(t){ return t.id===tenantId; });
  if (tenant) {
    var planName = window.PLAN_DEFS[plan]?.name || plan;
    tenant.plan = planName;
    tenant.status = 'Active';
  }
  closeDrawer();
  toast(tenantName + ' plan overridden to ' + (window.PLAN_DEFS[plan]?.name || plan) + ' ✓');
  renderSASubTab('tenants');
}

// renderSASubTab
function renderSASubTab(tab) {
  var body = document.getElementById('sa-sub-body');
  if (!body) return;

  if (tab === 'tenants') {
    renderSATenants(body);
  } else if (tab === 'plans') {
    renderSAPlans(body);
  } else if (tab === 'requests') {
    renderSARequests(body);
  } else if (tab === 'payouts') {
    renderSAPayouts(body);
  }
}

// renderSATenants
function renderSATenants(body) {
  var all    = window.SA_TENANTS;
  var active = all.filter(function(t){ return t.status==='Active'; }).length;
  var trial  = all.filter(function(t){ return t.status==='Trial';  }).length;
  var susp   = all.filter(function(t){ return t.status==='Suspended'; }).length;

  body.innerHTML =
    '<div class="kpi-strip">' +
    '<div class="kpi-card"><div class="kpi-label">Total tenants</div><div class="kpi-value" style="color:var(--green-700)">' + window.SA_PLATFORM.totalTenants + '</div></div>' +
    '<div class="kpi-card"><div class="kpi-label">Active</div><div class="kpi-value">' + active + '</div></div>' +
    '<div class="kpi-card"><div class="kpi-label">Trial</div><div class="kpi-value" style="color:var(--blue-700)">' + trial + '</div></div>' +
    '<div class="kpi-card"><div class="kpi-label">Suspended</div><div class="kpi-value" style="color:var(--red-600)">' + susp + '</div></div>' +
    '<div class="kpi-card"><div class="kpi-label">MRR</div><div class="kpi-value" style="font-size:14px">₦' + (window.SA_PLATFORM.mrr/1000000).toFixed(2) + 'M</div></div>' +
    '</div>' +
    '<div class="card">' +
    '<div class="card-hd"><span class="card-title">Tenant management</span>' +
    '<div style="display:flex;gap:6px">' +
    '<button class="btn btn-primary btn-sm" onclick="openProvisionTenant()"><i class="ti ti-plus"></i>Provision tenant</button>' +
    '<button class="btn btn-sm" onclick="downloadTableAsExcel(\'sa-tenant-tbl\',\'tenants\')"><i class="ti ti-download"></i>Export</button>' +
    '</div></div>' +
    '<div style="display:flex;gap:8px;flex-wrap:wrap;margin-bottom:10px;padding:10px 12px;background:var(--zinc-50);border:1px solid var(--border);border-radius:var(--r-md)">' +
    '<input class="tbl-search" placeholder="Search name, ID..." oninput="filterTable(this,\'sa-tenant-tbl\')" style="flex:1;min-width:160px">' +
    '<select class="tbl-filter" onchange="filterByCol(\'sa-tenant-tbl\',4,this.value)"><option value="">All plans</option><option>Starter</option><option>Business</option><option>Enterprise</option></select>' +
    '<select class="tbl-filter" onchange="filterByCol(\'sa-tenant-tbl\',5,this.value)"><option value="">All statuses</option><option>Active</option><option>Trial</option><option>Suspended</option></select>' +
    '<button class="btn btn-sm" onclick="clearTableFilters(\'sa-tenant-tbl\',\'p-superadmin\')">Clear</button>' +
    '</div>' +
    '<table id="sa-tenant-tbl"><tr>' +
    '<th class="sortable" onclick="sortTable(this)">ID</th>' +
    '<th class="sortable" onclick="sortTable(this)">Business</th>' +
    '<th class="sortable" onclick="sortTable(this)" style="text-align:right">Users</th>' +
    '<th class="sortable" onclick="sortTable(this)" style="text-align:right">MRR (₦)</th>' +
    '<th class="sortable" onclick="sortTable(this)">Plan</th>' +
    '<th class="sortable" onclick="sortTable(this)">Status</th>' +
    '<th class="sortable" onclick="sortTable(this)">Last login</th>' +
    '<th>Actions</th></tr>' +
    all.map(function(t) {
      return '<tr>' +
        '<td class="td-mono" style="font-size:11px;color:var(--text-tertiary)">' + t.id + '</td>' +
        '<td class="td-bold" style="cursor:pointer;color:var(--green-700)" onclick="viewTenantDetail(\'' + t.id + '\')">' + t.name + '</td>' +
        '<td style="text-align:right">' + t.users + '</td>' +
        '<td style="text-align:right;font-variant-numeric:tabular-nums">₦' + t.revenue.toLocaleString() + '</td>' +
        '<td><span class="badge ' + (t.plan==='Enterprise'?'b-amber':t.plan==='Business'||t.plan==='Pro'?'b-blue':'b-gray') + '">' + t.plan + '</span></td>' +
        '<td><span class="badge ' + (t.status==='Active'?'b-green':t.status==='Trial'?'b-blue':'b-red') + '">' + t.status + '</span></td>' +
        '<td style="font-size:12px;color:var(--text-tertiary)">' + t.lastLogin + '</td>' +
        '<td class="action-col"><div class="action-menu"><button class="action-btn" onclick="toggleAction(this)">Actions <i class="ti ti-chevron-down" style="font-size:10px"></i></button>' +
        '<div class="action-dropdown">' +
        '<a onclick="viewTenantDetail(\'' + t.id + '\');return false"><i class="ti ti-eye"></i>View detail</a>' +
        '<a onclick="impersonateTenant(\'' + t.id + '\',\'' + t.name + '\');return false"><i class="ti ti-login"></i>Impersonate</a>' +
        '<a onclick="saOverridePlan(\'' + t.id + '\',\'' + t.name + '\',\'' + t.plan + '\');return false"><i class="ti ti-credit-card"></i>Override plan</a>' +
        (t.status!=='Suspended'?'<a onclick="toast(\'Suspending ' + t.name + '\');return false"><i class="ti ti-ban"></i>Suspend</a>':'<a onclick="toast(\'Reactivating ' + t.name + '\');return false"><i class="ti ti-check"></i>Reactivate</a>') +
        '<div class="sep"></div><a class="danger" onclick="warnDelete(\'' + t.name + '\',\'account\',function(){toast(\'Tenant deleted\')});return false"><i class="ti ti-trash"></i>Delete</a>' +
        '</div></div></td></tr>';
    }).join('') +
    '</table></div>';
  setupTableDefaults('sa-tenant-tbl');
}

// renderSAPlans
function renderSAPlans(body) {
  var plans = Object.values(window.PLAN_DEFS);
  body.innerHTML =
    '<div class="kpi-strip">' +
    '<div class="kpi-card"><div class="kpi-label">Active plans</div><div class="kpi-value">' + plans.length + '</div></div>' +
    '<div class="kpi-card"><div class="kpi-label">Starter tenants</div><div class="kpi-value">104</div></div>' +
    '<div class="kpi-card"><div class="kpi-label">Business tenants</div><div class="kpi-value">19</div></div>' +
    '<div class="kpi-card"><div class="kpi-label">Enterprise tenants</div><div class="kpi-value">4</div></div>' +
    '</div>' +
    '<div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(300px,1fr));gap:16px">' +
    plans.map(function(plan) {
      var tenantCount = {starter:104,business:19,enterprise:4}[plan.id] || 0;
      return '<div class="card">' +
        '<div style="display:flex;align-items:flex-start;justify-content:space-between;margin-bottom:14px">' +
        '<div><div style="font-size:20px;font-weight:800;color:' + plan.color + '">' + plan.name + '</div>' +
        '<div style="font-size:12px;color:var(--text-secondary);margin-top:2px">' + plan.tagline + '</div></div>' +
        (plan.popular?'<span class="badge b-green" style="flex-shrink:0">Popular</span>':'') + '</div>' +
        '<div style="display:flex;gap:16px;margin-bottom:14px;padding:10px 12px;background:var(--zinc-50);border-radius:var(--r-md)">' +
        '<div style="flex:1;text-align:center"><div style="font-size:18px;font-weight:800;color:' + plan.color + '">₦' + plan.price.toLocaleString() + '</div><div style="font-size:10.5px;color:var(--text-tertiary)">monthly</div></div>' +
        '<div style="flex:1;text-align:center"><div style="font-size:18px;font-weight:800">₦' + plan.annualPrice.toLocaleString() + '</div><div style="font-size:10.5px;color:var(--text-tertiary)">annual</div></div>' +
        '<div style="flex:1;text-align:center"><div style="font-size:18px;font-weight:800">' + (plan.users===999?'∞':plan.users) + '</div><div style="font-size:10.5px;color:var(--text-tertiary)">users</div></div>' +
        '</div>' +
        '<div style="display:flex;justify-content:space-between;font-size:12px;margin-bottom:12px">' +
        '<span>Tenants on this plan</span><strong>' + tenantCount + '</strong></div>' +
        '<div style="display:flex;justify-content:space-between;font-size:12px;margin-bottom:12px">' +
        '<span>Storage</span><strong>' + plan.storage + '</strong></div>' +
        '<div style="display:flex;justify-content:space-between;font-size:12px;margin-bottom:12px">' +
        '<span>API calls/month</span><strong>' + (plan.apiCalls>0?plan.apiCalls.toLocaleString():'None') + '</strong></div>' +
        '<div style="display:flex;gap:6px">' +
        '<button class="btn btn-sm btn-primary" style="flex:1;justify-content:center" onclick="saEditPlan(\'' + plan.id + '\')"><i class="ti ti-pencil"></i>Edit plan</button>' +
        '<button class="btn btn-sm" onclick="toast(\'Viewing ' + tenantCount + ' tenants on ' + plan.name + '\')"><i class="ti ti-users"></i>' + tenantCount + ' tenants</button>' +
        '</div></div>';
    }).join('') +
    '</div>';
}

// renderSARequests
function renderSARequests(body) {
  var reqs = window.SUB_REQUESTS;
  var pending  = reqs.filter(function(r){ return r.status==='payment_uploaded'; }).length;
  var approved = reqs.filter(function(r){ return r.status==='approved'; }).length;
  var waiting  = reqs.filter(function(r){ return r.status==='awaiting_payment'; }).length;

  body.innerHTML =
    '<div class="kpi-strip">' +
    '<div class="kpi-card"><div class="kpi-label">Pending verification</div><div class="kpi-value" style="color:var(--amber-700)">' + pending + '</div></div>' +
    '<div class="kpi-card"><div class="kpi-label">Awaiting payment</div><div class="kpi-value" style="color:var(--blue-700)">' + waiting + '</div></div>' +
    '<div class="kpi-card"><div class="kpi-label">Approved this month</div><div class="kpi-value" style="color:var(--green-700)">' + approved + '</div></div>' +
    '<div class="kpi-card"><div class="kpi-label">Total requests</div><div class="kpi-value">' + reqs.length + '</div></div>' +
    '</div>' +
    '<div class="card">' +
    '<div class="card-hd"><span class="card-title">Subscription requests</span>' +
    '<div style="display:flex;gap:6px">' +
    '<button class="btn btn-sm" onclick="downloadTableAsExcel(\'sa-req-tbl\',\'subscription-requests\')"><i class="ti ti-download"></i>Export</button>' +
    '</div></div>' +
    '<div style="display:flex;gap:8px;flex-wrap:wrap;margin-bottom:10px;padding:10px 12px;background:var(--zinc-50);border:1px solid var(--border);border-radius:var(--r-md)">' +
    '<input class="tbl-search" placeholder="Search tenant, request ID..." oninput="filterTable(this,\'sa-req-tbl\')" style="flex:1;min-width:160px">' +
    '<select class="tbl-filter" onchange="filterByCol(\'sa-req-tbl\',4,this.value)">' +
    '<option value="">All statuses</option><option value="payment_uploaded">Payment uploaded</option><option value="awaiting_payment">Awaiting payment</option><option value="approved">Approved</option>' +
    '</select>' +
    '<select class="tbl-filter" onchange="filterByCol(\'sa-req-tbl\',3,this.value)">' +
    '<option value="">All plans</option><option>starter</option><option>business</option><option>enterprise</option>' +
    '</select>' +
    '<button class="btn btn-sm" onclick="clearTableFilters(\'sa-req-tbl\',\'p-superadmin\')">Clear</button>' +
    '</div>' +
    '<table id="sa-req-tbl"><tr>' +
    '<th class="sortable" onclick="sortTable(this)">Request ID</th>' +
    '<th class="sortable" onclick="sortTable(this)">Tenant</th>' +
    '<th class="sortable" onclick="sortTable(this)">From</th>' +
    '<th class="sortable" onclick="sortTable(this)">Requested plan</th>' +
    '<th class="sortable" onclick="sortTable(this)">Status</th>' +
    '<th class="sortable" onclick="sortTable(this)">Requested</th>' +
    '<th class="sortable" onclick="sortTable(this)" style="text-align:right">Amount (₦)</th>' +
    '<th>Actions</th>' +
    '</tr>' +
    reqs.map(function(r) {
      var statusBadge = {
        payment_uploaded:'<span class="badge b-amber">Payment uploaded</span>',
        awaiting_payment:'<span class="badge b-blue">Awaiting payment</span>',
        approved:'<span class="badge b-green">Approved</span>',
        rejected:'<span class="badge b-red">Rejected</span>',
      }[r.status] || '<span class="badge b-gray">' + r.status + '</span>';
      var planBadge = '<span class="badge ' + (r.plan==='enterprise'?'b-amber':r.plan==='business'?'b-blue':'b-gray') + '">' + r.plan.charAt(0).toUpperCase()+r.plan.slice(1) + '</span>';
      return '<tr>' +
        '<td class="td-mono" style="font-size:11px;color:var(--text-tertiary)">' + r.id + '</td>' +
        '<td class="td-bold">' + r.tenantName + '</td>' +
        '<td style="font-size:12px;color:var(--text-secondary)">' + (r.currentPlan||'trial') + '</td>' +
        '<td>' + planBadge + '</td>' +
        '<td>' + statusBadge + '</td>' +
        '<td style="font-size:12px">' + r.requested + '</td>' +
        '<td style="text-align:right;font-variant-numeric:tabular-nums;font-weight:600">₦' + r.amount.toLocaleString() + '</td>' +
        '<td class="action-col"><div class="action-menu"><button class="action-btn" onclick="toggleAction(this)">Actions <i class="ti ti-chevron-down" style="font-size:10px"></i></button>' +
        '<div class="action-dropdown">' +
        '<a onclick="viewSubRequest(\'' + r.id + '\');return false"><i class="ti ti-eye"></i>View details</a>' +
        (r.status==='payment_uploaded'?'<a onclick="approveSubRequest(\'' + r.id + '\');return false"><i class="ti ti-check"></i>Approve</a><a onclick="rejectSubRequest(\'' + r.id + '\');return false"><i class="ti ti-x"></i>Reject</a>':'') +
        '</div></div></td>' +
        '</tr>';
    }).join('') +
    '</table></div>';
  setupTableDefaults('sa-req-tbl');
}

// renderSAPayouts
function renderSAPayouts(body) {
  var uploaded = window.SUB_REQUESTS.filter(function(r){ return r.receipt; });
  body.innerHTML =
    '<div class="alert alert-blue" style="margin-bottom:14px"><i class="ti ti-info-circle"></i>' +
    'Tenant payment destination: <strong>GTBank · LeafTally Technologies Ltd · Account 0234567890</strong>. ' +
    'Verify each payment against your bank statement before approving.</div>' +
    '<div class="kpi-strip">' +
    '<div class="kpi-card"><div class="kpi-label">Receipts uploaded</div><div class="kpi-value">' + uploaded.length + '</div></div>' +
    '<div class="kpi-card"><div class="kpi-label">Awaiting verification</div><div class="kpi-value" style="color:var(--amber-700)">' + window.SUB_REQUESTS.filter(function(r){return r.status==='payment_uploaded';}).length + '</div></div>' +
    '<div class="kpi-card"><div class="kpi-label">Verified this month</div><div class="kpi-value" style="color:var(--green-700)">2</div></div>' +
    '<div class="kpi-card"><div class="kpi-label">Total verified (₦)</div><div class="kpi-value" style="font-size:14px">₦' + window.SUB_REQUESTS.filter(function(r){return r.status==='approved';}).reduce(function(s,r){return s+r.amount;},0).toLocaleString() + '</div></div>' +
    '</div>' +
    '<div class="card"><div class="card-hd"><span class="card-title">Payment receipts to verify</span></div>' +
    uploaded.map(function(r) {
      var isApproved = r.status === 'approved';
      return '<div style="display:flex;gap:12px;align-items:flex-start;padding:14px 0;border-bottom:1px solid var(--border)">' +
        '<div style="width:40px;height:40px;border-radius:10px;background:' + (isApproved?'var(--green-50)':'var(--amber-50)') + ';border:1px solid ' + (isApproved?'var(--green-200)':'var(--amber-200)') + ';display:flex;align-items:center;justify-content:center;flex-shrink:0">' +
        '<i class="ti ' + (isApproved?'ti-check':'ti-file-description') + '" style="font-size:20px;color:' + (isApproved?'var(--green-700)':'var(--amber-700)') + '"></i></div>' +
        '<div style="flex:1">' +
        '<div style="font-weight:700;font-size:13px">' + r.tenantName + ' — <span class="badge ' + (r.plan==='enterprise'?'b-amber':'b-blue') + '">' + r.plan.charAt(0).toUpperCase()+r.plan.slice(1) + '</span></div>' +
        '<div style="font-size:12px;color:var(--text-secondary);margin-top:3px">₦' + r.amount.toLocaleString() + ' · ' + (r.paymentDate||'—') + ' · ' + (r.bankFrom||'—') + '</div>' +
        '<div style="font-size:11.5px;color:var(--text-tertiary);margin-top:2px">Ref: ' + (r.ref||'—') + ' · Receipt: ' + (r.receipt||'—') + '</div>' +
        '</div>' +
        '<div style="display:flex;flex-direction:column;gap:6px;flex-shrink:0">' +
        '<span class="badge ' + (isApproved?'b-green':'b-amber') + '">' + (isApproved?'Approved':'Pending') + '</span>' +
        (!isApproved?'<button class="btn btn-primary btn-sm" onclick="approveSubRequest(\'' + r.id + '\')"><i class="ti ti-check"></i>Approve</button>':'') +
        '</div></div>';
    }).join('') +
    '</div>';
}

// viewSubRequest
function viewSubRequest(reqId) {
  var r = window.SUB_REQUESTS.find(function(x){ return x.id===reqId; });
  if (!r) return;
  var plan = window.PLAN_DEFS[r.plan];
  openDrawer(r.id + ' — ' + r.tenantName,
    '<div class="detail-row"><span class="detail-label">Tenant</span><span class="detail-value">' + r.tenantName + '</span></div>' +
    '<div class="detail-row"><span class="detail-label">Current plan</span><span class="detail-value">' + (r.currentPlan||'Trial') + '</span></div>' +
    '<div class="detail-row"><span class="detail-label">Requested plan</span><span class="detail-value"><span class="badge b-blue">' + (plan?plan.name:r.plan) + '</span></span></div>' +
    '<div class="detail-row"><span class="detail-label">Amount due</span><span class="detail-value" style="color:var(--green-700);font-weight:700">₦' + r.amount.toLocaleString() + '</span></div>' +
    '<div class="detail-row"><span class="detail-label">Requested on</span><span class="detail-value">' + r.requested + '</span></div>' +
    '<div class="detail-row"><span class="detail-label">Status</span><span class="detail-value">' + r.status.replace(/_/g,' ') + '</span></div>' +
    (r.paymentDate?'<div class="detail-row"><span class="detail-label">Payment date</span><span class="detail-value">' + r.paymentDate + '</span></div>':'') +
    (r.ref?'<div class="detail-row"><span class="detail-label">Payment ref</span><span class="detail-value td-mono">' + r.ref + '</span></div>':'') +
    (r.bankFrom?'<div class="detail-row"><span class="detail-label">Paid from</span><span class="detail-value">' + r.bankFrom + '</span></div>':'') +
    (r.receipt?'<div style="margin-top:12px;padding:12px;background:var(--zinc-50);border:1px solid var(--border);border-radius:var(--r-md);display:flex;align-items:center;gap:10px"><i class="ti ti-file-description" style="font-size:24px;color:var(--green-600)"></i><div><div style="font-weight:600;font-size:12.5px">' + r.receipt + '</div><div style="font-size:11px;color:var(--text-tertiary)">Payment receipt uploaded by tenant</div></div><button class="btn btn-sm" onclick="toast(\'Downloading receipt\')"><i class="ti ti-download"></i>Download</button></div>':'') +
    (r.notes?'<div class="detail-row" style="margin-top:8px"><span class="detail-label">Notes</span><span class="detail-value">' + r.notes + '</span></div>':'') +
    (r.status==='payment_uploaded'?
    '<div style="margin-top:14px;display:flex;gap:8px">' +
    '<button class="btn btn-primary" id="approve-btn-' + r.id + '" onclick="approveSubRequest(\'' + r.id + '\')"><i class="ti ti-check"></i>Approve & activate</button>' +
    '<button class="btn btn-sm btn-danger" onclick="rejectSubRequest(\'' + r.id + '\')"><i class="ti ti-x"></i>Reject</button>' +
    '</div>' : '') +
    (r.approvedBy?'<div style="margin-top:12px;font-size:11.5px;color:var(--text-tertiary)">Approved by ' + r.approvedBy + '</div>':''));
}

// approveSubRequest
function approveSubRequest(reqId) {
  var r = window.SUB_REQUESTS.find(function(x){ return x.id===reqId; });
  if (!r) return;
  r.status = 'approved';
  r.approvedBy = 'admin@leaftally.io';
  // Update tenant plan
  var tenant = window.SA_TENANTS.find(function(t){ return t.id===r.tenant; });
  if (tenant) {
    tenant.plan = window.PLAN_DEFS[r.plan]?.name || r.plan;
    tenant.status = 'Active';
  }
  closeDrawer();
  toast(r.tenantName + ' — ' + r.plan + ' plan approved and activated ✓');
  renderSASubTab('requests');
}

// rejectSubRequest
function rejectSubRequest(reqId) {
  var r = window.SUB_REQUESTS.find(function(x){ return x.id===reqId; });
  if (!r) return;
  openDrawer('Reject request — ' + r.tenantName,
    '<div class="form-group"><label class="form-label">Rejection reason *</label><textarea class="form-input" id="reject-reason" rows="3" placeholder="e.g. Payment amount incorrect, receipt illegible..."></textarea></div>' +
    '<div style="margin-top:12px;display:flex;gap:8px">' +
    '<button class="btn btn-danger" onclick="confirmRejectRequest(\'' + reqId + '\')"><i class="ti ti-x"></i>Reject request</button>' +
    '<button class="btn" onclick="closeDrawer()">Cancel</button></div>');
}

// confirmRejectRequest
function confirmRejectRequest(reqId) {
  var r = window.SUB_REQUESTS.find(function(x){ return x.id===reqId; });
  if (!r) return;
  var reason = document.getElementById('reject-reason')?.value.trim();
  if (!reason) { toast('Please provide a rejection reason'); return; }
  r.status = 'rejected';
  closeDrawer();
  toast(r.id + ' rejected — tenant notified');
  renderSASubTab('requests');
}

// openAddBanner
function openAddBanner() {
  openDrawer('New platform banner',
    '<div class="form-group"><label class="form-label">Title *</label><input class="form-input" id="bn-title" placeholder="e.g. Scheduled maintenance"></div>' +
    '<div class="form-group"><label class="form-label">Message *</label><textarea class="form-input" id="bn-msg" rows="3" placeholder="Banner message visible to all tenants..."></textarea></div>' +
    '<div class="form-row">' +
    '<div class="form-group"><label class="form-label">Type</label><select class="form-input" id="bn-type"><option>info</option><option>warning</option><option>alert</option></select></div>' +
    '<div class="form-group"><label class="form-label">Target</label><select class="form-input" id="bn-target"><option>All tenants</option><option>Pro tenants</option><option>Enterprise tenants</option><option>Nigeria tenants</option></select></div>' +
    '</div>' +
    '<div style="display:flex;align-items:center;gap:8px;margin-top:4px">' +
    '<input type="checkbox" id="bn-live" style="accent-color:var(--primary)">' +
    '<label for="bn-live" style="font-size:12.5px;cursor:pointer">Publish immediately</label></div>' +
    '<div style="margin-top:12px;display:flex;gap:8px">' +
    '<button class="btn btn-primary" onclick="saveBanner()"><i class="ti ti-check"></i>Save banner</button>' +
    '<button class="btn" onclick="closeDrawer()">Cancel</button></div>');
}

// saveBanner
function saveBanner() {
  var title = document.getElementById('bn-title')?.value.trim();
  var msg   = document.getElementById('bn-msg')?.value.trim();
  if (!title || !msg) { toast('Title and message required'); return; }
  var live = document.getElementById('bn-live')?.checked;
  window.BANNER_DATA.push({
    id:'BNR-'+String(window.BANNER_DATA.length+1).padStart(3,'0'),
    title, msg,
    type: document.getElementById('bn-type')?.value||'info',
    target: document.getElementById('bn-target')?.value||'All tenants',
    active: live,
    created: new Date().toLocaleDateString('en-NG')
  });
  var panel = document.getElementById('p-banners');
  if (panel) { panel.dataset.built=''; BUILDERS.banners(panel); }
  closeDrawer();
  toast(title + ' banner ' + (live?'published':'saved as draft'));
}

// openNewRelease
function openNewRelease() {
  openDrawer('New release note',
    '<div class="form-row"><div class="form-group"><label class="form-label">Version *</label><input class="form-input" id="rn-ver" placeholder="v2.5.0"></div>' +
    '<div class="form-group"><label class="form-label">Type</label><select class="form-input" id="rn-type"><option>patch</option><option>minor</option><option>major</option></select></div></div>' +
    '<div class="form-group"><label class="form-label">Summary *</label><input class="form-input" id="rn-summary" placeholder="Brief description of this release"></div>' +
    '<div class="form-group"><label class="form-label">What\'s new (one item per line)</label><textarea class="form-input" id="rn-items" rows="5" placeholder="New: Feature description\nFixed: Bug description\nImproved: Enhancement description"></textarea></div>' +
    '<div style="margin-top:12px;display:flex;gap:8px">' +
    '<button class="btn btn-primary" onclick="saveRelease()"><i class="ti ti-check"></i>Save release</button>' +
    '<button class="btn" onclick="closeDrawer()">Cancel</button></div>');
}

// saveRelease
function saveRelease() {
  var ver  = document.getElementById('rn-ver')?.value.trim();
  var sum  = document.getElementById('rn-summary')?.value.trim();
  var raw  = document.getElementById('rn-items')?.value.trim();
  if (!ver || !sum) { toast('Version and summary required'); return; }
  var items = raw ? raw.split('\n').filter(Boolean) : [];
  window.RELEASE_DATA.unshift({ver, date:new Date().toLocaleDateString('en-GB',{day:'numeric',month:'short',year:'numeric'}), type:document.getElementById('rn-type')?.value||'patch', summary:sum, items});
  var panel = document.getElementById('p-releasenotes');
  if (panel) { panel.dataset.built=''; BUILDERS.releasenotes(panel); }
  closeDrawer();
  toast(ver + ' release note saved');
}

// openNewDimensionType
function openNewDimensionType() {
  openDrawer('New dimension type',
    '<div class="form-row">' +
    '<div class="form-group"><label class="form-label">Type code *</label><input class="form-input" id="new-dim-code" placeholder="e.g. REG" maxlength="6"></div>' +
    '<div class="form-group"><label class="form-label">Type name *</label><input class="form-input" id="new-dim-name" placeholder="e.g. Region"></div></div>' +
    '<div class="form-group"><label class="form-label">Category</label>' +
    '<select class="form-input" id="new-dim-cat"><option>Department</option><option>Location</option><option>Project</option><option>Cost Centre</option><option>Custom</option></select></div>' +
    '<div class="form-group"><label class="form-label">Used in (select modules)</label>' +
    '<div style="display:flex;gap:6px;flex-wrap:wrap">' +
    ['Journal entries','Invoices','Bills','Expenses','Payroll'].map(function(m){ return '<label style="display:flex;align-items:center;gap:5px;font-size:12px;padding:4px 8px;border:1px solid var(--border);border-radius:4px;cursor:pointer"><input type="checkbox" style="accent-color:var(--primary)">' + m + '</label>'; }).join('') +
    '</div></div>' +
    '<div style="margin-top:12px;display:flex;gap:8px">' +
    '<button class="btn btn-primary" onclick="toast(\'Dimension type saved\');closeDrawer()"><i class="ti ti-check"></i>Create</button>' +
    '<button class="btn" onclick="closeDrawer()">Cancel</button></div>');
}

// openAddDimensionValue
function openAddDimensionValue(code) {
  openDrawer('Add value to ' + code,
    '<div class="form-group"><label class="form-label">Value / name *</label><input class="form-input" id="new-dim-val" placeholder="e.g. South-West"></div>' +
    '<div class="form-group"><label class="form-label">Description</label><input class="form-input" id="new-dim-desc" placeholder="Optional description"></div>' +
    '<div style="margin-top:12px;display:flex;gap:8px">' +
    '<button class="btn btn-primary" onclick="saveNewDimValue(\'' + code + '\')"><i class="ti ti-check"></i>Add value</button>' +
    '<button class="btn" onclick="closeDrawer()">Cancel</button></div>');
}

// saveNewDimValue
function saveNewDimValue(code) {
  var val = document.getElementById('new-dim-val')?.value.trim();
  if (!val) { toast('Value name required'); return; }
  var list = document.getElementById('dim-values-list');
  if (list) {
    var div = document.createElement('div');
    div.style.cssText = 'display:flex;align-items:center;gap:8px;padding:8px 0;border-bottom:1px solid var(--border)';
    div.innerHTML = '<i class="ti ti-grip-vertical" style="color:var(--text-tertiary)"></i><span style="flex:1;font-size:13px;font-weight:500">' + val + '</span><span style="font-size:11px;color:var(--text-tertiary);padding:2px 8px;background:var(--zinc-50);border-radius:4px">NEW</span>';
    list.appendChild(div);
  }
  closeDrawer();
  toast(val + ' added to ' + code);
}

// switchToClientTenant
function switchToClientTenant(id, name) {
  openDrawer('Accessing — ' + name,
    '<div class="alert alert-blue"><i class="ti ti-info-circle"></i>You are about to enter the accounting environment for <strong>' + name + '</strong>. All your actions will be logged in their audit trail.</div>' +
    '<div style="margin:14px 0">' +
    '<div class="detail-row"><span class="detail-label">Client</span><span class="detail-value">' + name + '</span></div>' +
    '<div class="detail-row"><span class="detail-label">Your access level</span><span class="detail-value"><span class="badge b-green">Full accountant</span></span></div>' +
    '<div class="detail-row"><span class="detail-label">Session will be logged</span><span class="detail-value">Yes — visible in client audit trail</span></div>' +
    '</div>' +
    '<div style="display:flex;gap:8px">' +
    '<button class="btn btn-primary" onclick="toast(\'Entering ' + name + ' accounting environment...\');closeDrawer()"><i class="ti ti-login"></i>Enter ' + name + '</button>' +
    '<button class="btn" onclick="closeDrawer()">Cancel</button></div>');
}

// openInviteClientBusiness
function openInviteClientBusiness() {
  openDrawer('Add client business',
    '<div class="form-group"><label class="form-label">Business name *</label><input class="form-input" id="inv-biz-name" placeholder="e.g. Sunshine Bakeries Ltd"></div>' +
    '<div class="form-group"><label class="form-label">Contact email *</label><input class="form-input" type="email" id="inv-biz-email" placeholder="admin@business.ng"></div>' +
    '<div class="form-group"><label class="form-label">Your access level</label>' +
    '<select class="form-input" id="inv-biz-role"><option>Full accountant</option><option>Read-only</option></select></div>' +
    '<div style="margin-top:12px;display:flex;gap:8px">' +
    '<button class="btn btn-primary" onclick="sendAccountantInvite()"><i class="ti ti-send"></i>Send invitation</button>' +
    '<button class="btn" onclick="closeDrawer()">Cancel</button></div>');
}

// sendAccountantInvite
function sendAccountantInvite() {
  var name  = document.getElementById('inv-biz-name')?.value.trim();
  var email = document.getElementById('inv-biz-email')?.value.trim();
  if (!name || !email) { toast('Business name and email required'); return; }
  ACCOUNTANT_CLIENTS.push({id:'T-00'+(ACCOUNTANT_CLIENTS.length+1),name,contact:'—',email,plan:'—',status:'Pending',lastAccess:'Never',role:document.getElementById('inv-biz-role')?.value||'Full accountant'});
  var panel = document.getElementById('p-accountant');
  if (panel) { panel.dataset.built=''; BUILDERS.accountant(panel); }
  closeDrawer();
  toast('Invitation sent to ' + email);
}

// openChangeAccountantRole
function openChangeAccountantRole(id, name, currentRole) {
  openDrawer('Change role for ' + name,
    '<div class="form-group"><label class="form-label">Access level</label>' +
    '<select class="form-input" id="change-role-sel">' +
    '<option ' + (currentRole==='Full accountant'?'selected':'') + '>Full accountant</option>' +
    '<option ' + (currentRole==='Read-only'?'selected':'') + '>Read-only</option>' +
    '</select></div>' +
    '<div class="alert alert-amber" style="margin-top:10px"><i class="ti ti-alert-circle"></i><strong>Full accountant</strong> can post journals, create invoices and run payroll. <strong>Read-only</strong> can view and export only.</div>' +
    '<div style="margin-top:12px;display:flex;gap:8px">' +
    '<button class="btn btn-primary" onclick="toast(\'Role updated for ' + name + '\');closeDrawer()"><i class="ti ti-check"></i>Save</button>' +
    '<button class="btn" onclick="closeDrawer()">Cancel</button></div>');
}

// openAddEntity
function openAddEntity() {
  openDrawer('Add entity',
    '<div class="form-row"><div class="form-group"><label class="form-label">Entity name *</label><input class="form-input" id="ent-name" placeholder="e.g. Acme Logistics Ltd"></div>' +
    '<div class="form-group"><label class="form-label">TIN</label><input class="form-input" id="ent-tin" placeholder="12345678-0001"></div></div>' +
    '<div class="form-row"><div class="form-group"><label class="form-label">Currency</label>' +
    '<select class="form-input" id="ent-currency"><option>NGN</option><option>USD</option><option>GBP</option><option>EUR</option></select></div>' +
    '<div class="form-group"><label class="form-label">Relationship</label>' +
    '<select class="form-input"><option>Subsidiary</option><option>Associate</option><option>Joint venture</option></select></div></div>' +
    '<div style="margin-top:12px;display:flex;gap:8px">' +
    '<button class="btn btn-primary" onclick="toast(\'Entity added\');closeDrawer()"><i class="ti ti-check"></i>Add entity</button>' +
    '<button class="btn" onclick="closeDrawer()">Cancel</button></div>');
}

// openImportWizard
function openImportWizard(id, name) {
  var steps = {
    quickbooks: 'In QuickBooks: go to Reports then Export to Excel, or use the QuickBooks migration tool to export a .QBB or .IIF file.',
    sage: 'In Sage: File then Import/Export then Export Data. Choose CSV or XML format.',
    xero: 'In Xero: go to Accounting then Advanced then Chart of Accounts then Export. For invoices go to Reports then Aged Receivables then Export.',
    zoho: 'In Zoho Books: go to Settings then Data Backup to export all modules as CSV.'
  };
  var step1 = steps[id] || ('Export your data from ' + name + ' as CSV or Excel.');
  var items = ['Chart of accounts (GL)','Customers and contacts','Suppliers','Open invoices (unpaid)','Open bills (unpaid)','Bank accounts and opening balances','Journal entries (last 12 months)','Products and services'];
  var listHtml = items.map(function(it){ return '<div style="display:flex;align-items:center;gap:8px;padding:4px 0;font-size:12.5px"><i class="ti ti-check" style="color:var(--green-600)"></i>' + it + '</div>'; }).join('');
  openDrawer('Import from ' + name, listHtml); // placeholder to open drawer first
  var body = document.getElementById('drawer-body');
  if (!body) return;
  var container = document.createElement('div');
  container.innerHTML =
    '<div class="alert alert-blue"><i class="ti ti-info-circle"></i>One-time migration from ' + name + '. Existing LeafTally data will not be overwritten.</div>' +
    '<div style="margin:12px 0"><div style="font-size:11px;font-weight:700;text-transform:uppercase;color:var(--text-secondary);margin-bottom:8px">What will be imported</div>' + listHtml + '</div>' +
    '<div style="font-size:11px;font-weight:700;text-transform:uppercase;color:var(--text-secondary);margin-bottom:6px">Step 1 — Export from ' + name + '</div>' +
    '<div style="font-size:12px;color:var(--text-secondary);margin-bottom:12px;padding:10px;background:var(--zinc-50);border-radius:var(--r-md)">' + step1 + '</div>' +
    '<div style="font-size:11px;font-weight:700;text-transform:uppercase;color:var(--text-secondary);margin-bottom:8px">Step 2 — Upload your export file</div>' +
    '<div class="upload-zone" style="margin-bottom:12px;cursor:pointer" id="import-drop-zone">' +
    '<i class="ti ti-file-import" style="font-size:28px;display:block;margin:0 auto 6px;color:var(--text-tertiary)"></i>' +
    '<div style="font-size:13px;font-weight:600">Drop your ' + name + ' export here</div>' +
    '<div style="font-size:12px;color:var(--text-tertiary);margin-top:4px">Accepts CSV, XLS, XLSX, XML, QBB, IIF</div></div>' +
    '<div style="display:flex;gap:8px">' +
    '<button class="btn btn-primary" id="import-go"><i class="ti ti-download"></i>Start import</button>' +
    '<button class="btn" onclick="closeDrawer()">Cancel</button></div>';
  body.innerHTML = '';
  body.appendChild(container);
  var goBtn = document.getElementById('import-go');
  if (goBtn) {
    goBtn.onclick = function() {
      toast('Import from ' + name + ' started — you will receive an email confirmation when complete');
      closeDrawer();
    };
  }
  var dropZone = document.getElementById('import-drop-zone');
  if (dropZone) dropZone.onclick = function() { toast('File picker: select your ' + name + ' export file'); };
}

// postCostGroup
function postCostGroup(id) {
  var g = window.COST_GROUPS.find(function(x){ return x.id === id; });
  if (!g) return;
  if (g.status === 'Posted') { toast(g.id + ' is already posted'); return; }
  calcGroupAllocations(g);
  // Update each product's unit cost in PRODUCTS array
  if (window.PRODUCTS) {
    g.products.forEach(function(p) {
      var prod = window.PRODUCTS.find(function(x){ return x.sku === p.sku; });
      if (prod) {
        var addedCost = Math.round(p.allocated / Math.max(p.qty,1));
        prod.cost = (prod.cost || 0) + addedCost;
        prod.costGroupId = id;
      }
    });
  }
  // Post a GL journal: DR Inventory (1500) CR Work-in-progress / COGS
  if (window.JOURNAL_LEDGER) {
    window.JOURNAL_LEDGER.push({
      ref: 'JNL-CG-' + id,
      date: new Date().toISOString().split('T')[0],
      narr: 'Shared cost allocation — ' + g.name,
      status: 'Posted',
      lines: [
        {account:'1500', dr: g.totalCost, cr: 0},
        {account:'5000', dr: 0,            cr: g.totalCost},
      ]
    });
    if (window.GL_ACCOUNTS && window.GL_ACCOUNTS['1500']) window.GL_ACCOUNTS['1500'].balance += g.totalCost;
    if (window.GL_ACCOUNTS && window.GL_ACCOUNTS['5000']) window.GL_ACCOUNTS['5000'].balance += g.totalCost;
  }
  g.status = 'Posted';
  toast(g.id + ' posted — unit costs updated for ' + g.products.length + ' products');
  var btn = document.getElementById('cg-post-' + id);
  if (btn) { btn.disabled = true; btn.innerHTML = '<i class="ti ti-check"></i>Already posted'; }
  // Refresh cost groups table if visible
  var cb = document.getElementById('inv-costgroups-body');
  if (cb && cb.style.display !== 'none') renderCostGroups(cb);
}

// openNewCostGroup
function openNewCostGroup() {
  var productOptions = (window.PRODUCTS || []).map(function(p){
    return '<option value="' + p.sku + '">' + p.sku + ' — ' + p.name + '</option>';
  }).join('');

  openDrawer('New shared cost group',
    '<div class="form-group"><label class="form-label">Group name *</label>' +
    '<input class="form-input" id="ncg-name" placeholder="e.g. Q3 server rack assembly batch"></div>' +
    '<div class="form-row">' +
    '<div class="form-group"><label class="form-label">Total pool cost (₦) *</label>' +
    '<input class="form-input" type="number" id="ncg-total" placeholder="0" oninput="previewCGSplit()"></div>' +
    '<div class="form-group"><label class="form-label">Split method</label>' +
    '<select class="form-input" id="ncg-method" onchange="previewCGSplit()">' +
    '<option value="equal">Equal split — same amount to each product</option>' +
    '<option value="weighted">Weighted split — by percentage weight you set</option>' +
    '<option value="quantity">Quantity split — proportional to units produced</option>' +
    '</select></div></div>' +
    '<div style="font-size:11px;font-weight:700;color:var(--text-secondary);text-transform:uppercase;letter-spacing:.05em;margin-bottom:8px">Products sharing this cost</div>' +
    '<div id="ncg-products" style="display:flex;flex-direction:column;gap:6px;margin-bottom:10px"></div>' +
    '<button class="btn btn-sm" onclick="addNCGProductRow()"><i class="ti ti-plus"></i>Add product</button>' +
    '<div id="ncg-preview" style="margin-top:12px;padding:10px;background:var(--zinc-50);border:1px solid var(--border);border-radius:var(--r-md);font-size:12px;display:none"></div>' +
    '<div style="margin-top:14px;display:flex;gap:8px">' +
    '<button class="btn btn-primary" onclick="saveNewCostGroup()"><i class="ti ti-check"></i>Create cost group</button>' +
    '<button class="btn" onclick="closeDrawer()">Cancel</button></div>');

  // Add 2 product rows by default
  addNCGProductRow(); addNCGProductRow();
}

// saveNewCostGroup
function saveNewCostGroup() {
  var name  = document.getElementById('ncg-name')?.value.trim();
  var total = parseFloat(document.getElementById('ncg-total')?.value) || 0;
  var method = document.getElementById('ncg-method')?.value || 'equal';
  if (!name || !total) { toast('Group name and total cost required'); return; }

  var rows = document.querySelectorAll('[id^="ncg-row-"]');
  var prods = [];
  rows.forEach(function(row) {
    var idx = row.id.replace('ncg-row-','');
    var sku = document.getElementById('ncg-sku-' + idx)?.value;
    var qty = parseFloat(document.getElementById('ncg-qty-' + idx)?.value) || 1;
    var wt  = parseFloat(document.getElementById('ncg-wt-' + idx)?.value) || 0;
    if (sku) {
      var prod = (window.PRODUCTS || []).find(function(p){ return p.sku === sku; });
      prods.push({sku, name: prod ? prod.name : sku, qty, weight: wt, allocated: 0});
    }
  });
  if (prods.length < 2) { toast('Add at least 2 products to share a cost'); return; }

  var newGroup = {
    id: 'CG-' + String(window.COST_GROUPS.length + 1).padStart(3,'0'),
    name, method, totalCost: total, products: prods,
    createdBy: window.currentUser ? window.currentUser.name : 'Admin',
    date: new Date().toISOString().split('T')[0],
    status: 'Draft'
  };
  calcGroupAllocations(newGroup);
  window.COST_GROUPS.push(newGroup);

  // Refresh cost-groups view if open
  var cb = document.getElementById('inv-costgroups-body');
  if (cb && cb.style.display !== 'none') renderCostGroups(cb);
  closeDrawer();
  toast(newGroup.id + ' created — ' + prods.length + ' products · ₦' + total.toLocaleString() + ' pooled');
}

// openAddProductToCG
function openAddProductToCG(id) {
  var g = window.COST_GROUPS.find(function(x){ return x.id === id; });
  if (!g) return;
  var productOptions = (window.PRODUCTS || []).map(function(p){
    return '<option value="' + p.sku + '">' + p.sku + ' — ' + p.name + '</option>';
  }).join('');
  openDrawer('Add product to ' + id,
    '<div class="form-group"><label class="form-label">Product *</label>' +
    '<select class="form-input" id="cg-add-sku"><option value="">— Select —</option>' + productOptions + '</select></div>' +
    '<div class="form-row">' +
    '<div class="form-group"><label class="form-label">Quantity</label>' +
    '<input class="form-input" type="number" id="cg-add-qty" value="1" min="1"></div>' +
    '<div class="form-group"><label class="form-label">Weight % (for weighted split)</label>' +
    '<input class="form-input" type="number" id="cg-add-wt" value="0" min="0" max="100"></div>' +
    '</div>' +
    '<div style="margin-top:12px;display:flex;gap:8px">' +
    '<button class="btn btn-primary" onclick="addProductToExistingCG(\'' + id + '\')"><i class="ti ti-check"></i>Add product</button>' +
    '<button class="btn" onclick="closeDrawer()">Cancel</button></div>');
}
