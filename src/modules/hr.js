// ============================================================
// LeafTally — HR module
// ============================================================

/* global BUILDERS, PICKLISTS, GL_ACCOUNTS, PRODUCTS, */
/* global CUSTOMERS_DB, SUPPLIERS_DB, JOURNAL_LEDGER, */
/* global currentUser, openDrawer, closeDrawer, toast, */
/* global filterTable, filterByCol, sortTable, setupTableDefaults */

// ── employees ──────────────────────────────────────
BUILDERS.employees = function(panel) {
  panel.innerHTML = `
  <div class="card">
    <div class="card-hd"><span class="card-title">Employees</span>
      <div style="display:flex;gap:6px;flex-wrap:wrap;align-items:center">
        <input class="tbl-search" placeholder="Search employees..." oninput="filterTable(this,'emp-tbl')">
        <select class="tbl-filter" onchange="filterByStatus(this,'emp-tbl',5)"><option value="">All</option><option>Active</option><option>On leave</option><option>Inactive</option></select>
        <button class="btn btn-primary btn-sm" onclick="openModal('modal-employee')"><i class="ti ti-plus"></i>Add employee</button>
        <button class="btn btn-sm" onclick="exportCSV('emp-tbl','employees')"><i class="ti ti-download"></i>Export</button>
      </div>
    </div>
    <div class="bulk-bar" id="emp-bar"><span id="emp-cnt" class="badge b-gray">0 selected</span><button class="btn btn-sm" onclick="toast('Payslips generated')">Generate payslips</button><button class="btn btn-sm btn-danger" onclick="toast('Employees deactivated')">Deactivate</button></div>
    <table id="emp-tbl">
      <tr><th class="col-check"><input type="checkbox" id="emp-all" style="accent-color:var(--g500)"></th><th class="sortable" onclick="sortTable(this)">ID</th><th class="sortable" onclick="sortTable(this)">Name</th><th class="sortable" onclick="sortTable(this)">Department</th><th class="sortable" onclick="sortTable(this)">Job title</th><th class="sortable" onclick="sortTable(this)">Status</th><th class="sortable" onclick="sortTable(this)" style="text-align:right">Gross salary (₦)</th><th>Actions</th></tr>
      ${[['EMP-001','Chukwuemeka Obi','Finance','Senior Accountant','Active','350,000'],['EMP-002','Funmi Adeola','HR','HR Manager','Active','280,000'],['EMP-003','Babatunde Adeyemi','Sales','Sales Rep','Active','220,000'],['EMP-004','Kelechi Okonkwo','IT','IT Manager','Active','180,000'],['EMP-005','Amaka Nwosu','Finance','Finance Analyst','On leave','210,000']].map(([id,name,dept,title,status,salary])=>`<tr><td class="col-check"><input type="checkbox" class="emp-cb" style="accent-color:var(--g500)"></td><td class="td-bold">${id}</td><td style="cursor:pointer;color:var(--g600);font-weight:600" onclick="openEmpDrawer('${name}','${id}','${dept}','${title}','${status}','${salary}')">${name}</td><td>${dept}</td><td>${title}</td><td><span class="badge ${status==='Active'?'b-green':status==='On leave'?'b-amber':'b-gray'}">${status}</span></td><td style="text-align:right;font-weight:600">₦${salary}</td><td class="action-col"><div class="action-menu"><button class="action-btn" onclick="toggleAction(this)">Actions <i class="ti ti-chevron-down" style="font-size:10px"></i></button><div class="action-dropdown"><a onclick="openEmpDrawer('${name}','${id}','${dept}','${title}','${status}','${salary}');return false">View profile</a><a onclick="toast('Editing ${name}');return false">Edit</a><a onclick="toast('Payslip for ${name} downloaded');return false">Download payslip</a><div class="sep"></div><a class="danger" onclick="warnDelete('${name}',()=>{this.closest('tr').remove()});return false">Deactivate</a></div></div></td></tr>`).join('')}
    </table>
  </div>`;
  setupBulk('emp-tbl','emp-bar','emp-cnt','emp-cb','emp-all');
}

// ── payroll ──────────────────────────────────────
BUILDERS.payroll = function(panel) {
  panel.innerHTML = `
  <div class="kpi-strip">
    <div class="kpi-card"><div class="kpi-label">Gross payroll (Jun)</div><div class="kpi-value">₦1.24M</div></div>
    <div class="kpi-card"><div class="kpi-label">Net pay</div><div class="kpi-value" style="color:var(--g600)">₦987K</div></div>
    <div class="kpi-card"><div class="kpi-label">PAYE deducted</div><div class="kpi-value" style="color:var(--b600)">₦167K</div></div>
    <div class="kpi-card"><div class="kpi-label">Pension (total)</div><div class="kpi-value">₦99K</div></div>
  </div>
  <div class="card">
    <div class="card-hd"><span class="card-title">Payroll runs</span>
      <div style="display:flex;gap:6px"><button class="btn btn-primary btn-sm" onclick="runPayroll()"><i class="ti ti-play"></i>Run payroll</button><button class="btn btn-sm" onclick="exportCSV('pay-tbl','payroll')"><i class="ti ti-download"></i>Export</button></div>
    </div>
    <div class="bulk-bar" id="pay-bar"><span id="pay-cnt" class="badge b-gray">0 selected</span><button class="btn btn-sm" onclick="toast('Payslips downloaded')">Download payslips</button><button class="btn btn-sm" onclick="toast('Bank file generated')">Bank transfer file</button></div>
    <table id="pay-tbl">
      <tr><th class="col-check"><input type="checkbox" id="pay-all" style="accent-color:var(--g500)"></th><th class="sortable" onclick="sortTable(this)">Period</th><th class="sortable" onclick="sortTable(this)">Employees</th><th class="sortable" onclick="sortTable(this)" style="text-align:right">Gross (₦)</th><th class="sortable" onclick="sortTable(this)" style="text-align:right">PAYE (₦)</th><th class="sortable" onclick="sortTable(this)" style="text-align:right">Pension (₦)</th><th class="sortable" onclick="sortTable(this)" style="text-align:right">Net pay (₦)</th><th class="sortable" onclick="sortTable(this)">Status</th><th>Actions</th></tr>
      ${[['Jun 2026','5','1,240,000','167,400','99,200','973,400','Processed'],['May 2026','5','1,240,000','167,400','99,200','973,400','Processed'],['Apr 2026','4','1,030,000','133,200','82,400','814,400','Processed']].map(([period,emps,gross,paye,pension,net,status])=>`<tr><td class="col-check"><input type="checkbox" class="pay-cb" style="accent-color:var(--g500)"></td><td class="td-bold">${period}</td><td>${emps} employees</td><td style="text-align:right">₦${gross}</td><td style="text-align:right">₦${paye}</td><td style="text-align:right">₦${pension}</td><td style="text-align:right;font-weight:600;color:var(--g600)">₦${net}</td><td><span class="badge b-green">${status}</span></td><td class="action-col"><div class="action-menu"><button class="action-btn" onclick="toggleAction(this)">Actions <i class="ti ti-chevron-down" style="font-size:10px"></i></button><div class="action-dropdown"><a onclick="toast('Viewing ${period} payroll details');return false">View details</a><a onclick="toast('Payslips downloaded for ${period}');return false">Download payslips</a><a onclick="toast('Bank file for ${period} downloaded');return false">Bank transfer file</a><a onclick="toast('${period} payroll reversed');return false">Reverse</a></div></div></td></tr>`).join('')}
    </table>
  </div>`;
  setupBulk('pay-tbl','pay-bar','pay-cnt','pay-cb','pay-all');
}
