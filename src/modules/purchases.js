// ============================================================
// LeafTally — PURCHASES module
// ============================================================

/* global BUILDERS, PICKLISTS, GL_ACCOUNTS, PRODUCTS, */
/* global CUSTOMERS_DB, SUPPLIERS_DB, JOURNAL_LEDGER, */
/* global currentUser, openDrawer, closeDrawer, toast, */
/* global filterTable, filterByCol, sortTable, setupTableDefaults */

// ── bills ──────────────────────────────────────
BUILDERS.bills = function(panel) {
  panel.innerHTML = `
  <div class="card">
    <div class="card-hd">
      <span class="card-title">Bills</span>
      <div style="display:flex;gap:6px;flex-wrap:wrap;align-items:center">
        <button class="btn btn-primary btn-sm" onclick="toast('New bill form opened')"><i class="ti ti-plus"></i>New bill</button>
        <button class="btn btn-sm" onclick="exportCSV('bill-tbl','bills')"><i class="ti ti-download"></i>Export</button>
      </div>
    </div>
    <div style="display:flex;gap:8px;flex-wrap:wrap;margin-bottom:10px;padding:10px 12px;background:var(--bg);border-radius:var(--radius)">
      <input class="tbl-search" placeholder="Search ref, supplier, amount..." oninput="filterTable(this,'bill-tbl')" style="flex:1;min-width:160px">
      <select class="tbl-filter" onchange="filterByCol('bill-tbl',5,this.value)">
        <option value="">All statuses</option><option>Draft</option><option>Pending</option><option>Paid</option><option>Overdue</option>
      </select>
      <select class="tbl-filter" onchange="filterByCol('bill-tbl',2,this.value)">
        <option value="">All suppliers</option>
        ${SUPPLIERS_DB.map(s=>`<option>${s.name}</option>`).join('')}
      </select>
      <input type="date" class="tbl-filter" id="bill-f-from" title="From date">
      <input type="date" class="tbl-filter" id="bill-f-to" title="To date">
      <button class="btn btn-sm" onclick="applyDateFilter('bill-tbl',3,'bill-f-from','bill-f-to')"><i class="ti ti-filter"></i>Apply</button>
      <button class="btn btn-sm" onclick="clearTableFilters('bill-tbl','p-bills')">Clear</button>
    </div>
    <div class="bulk-bar" id="bill-bar">
      <span id="bill-cnt" class="badge b-gray">0 selected</span>
      <button class="btn btn-sm btn-primary" onclick="toast('Bills approved')">Approve</button>
      <button class="btn btn-sm" onclick="toast('Payments scheduled')">Schedule payment</button>
      <button class="btn btn-sm btn-danger" onclick="bulkDeleteChecked('bill-tbl','bill-cb','bill-bar',()=>toast('Drafts deleted'))">Delete drafts</button>
    </div>
    <table id="bill-tbl">
      <tr>
        <th class="col-check"><input type="checkbox" id="bill-all" style="accent-color:var(--g500)" onchange="selectAllInTbl(this,'bill-cb')"></th>
        <th class="sortable" onclick="sortTable(this)">Bill #</th>
        <th class="sortable" onclick="sortTable(this)">Supplier</th>
        <th class="sortable" onclick="sortTable(this)">Date</th>
        <th class="sortable" onclick="sortTable(this)">Due date</th>
        <th class="sortable" onclick="sortTable(this)">Status</th>
        <th class="sortable" onclick="sortTable(this)" style="text-align:right">Amount (₦)</th>
        <th>Actions</th>
      </tr>
      ${[
        ['BILL-2026-0045','Conoil Nigeria Ltd','2026-06-20','2026-06-23','Overdue','245000'],
        ['BILL-2026-0044','MTN Business','2026-06-18','2026-06-28','Pending','45000'],
        ['BILL-2026-0043','Lagos Electricity Board','2026-06-15','2026-07-15','Draft','38500'],
        ['BILL-2026-0042','Perkins Nigeria Ltd','2026-06-10','2026-07-10','Paid','7800000'],
        ['BILL-2026-0041','Office Supplies Pro','2026-06-08','2026-07-08','Paid','92000'],
      ].map(([ref,sup,date,due,status,amt]) => {
        const sc={Draft:'b-gray',Pending:'b-amber',Paid:'b-green',Overdue:'b-red'}[status]||'b-gray';
        return `<tr data-status="${status}">
          <td class="col-check"><input type="checkbox" class="bill-cb" style="accent-color:var(--g500)" onchange="updateBulkBar('bill-tbl','bill-bar','bill-cnt','bill-cb','bill-all')"></td>
          <td class="td-bold" style="cursor:pointer;color:var(--a600)" onclick="toast('Viewing ${ref}')">${ref}</td>
          <td>${sup}</td><td>${date}</td>
          <td style="color:${status==='Overdue'?'var(--r400)':'inherit'}">${due}</td>
          <td><span class="badge ${sc}">${status}</span></td>
          <td style="text-align:right;font-weight:600">₦${parseInt(amt).toLocaleString()}</td>
          <td class="action-col"><div class="action-menu"><button class="action-btn" onclick="toggleAction(this)">Actions <i class="ti ti-chevron-down" style="font-size:10px"></i></button>
            <div class="action-dropdown">
              <a onclick="toast('Viewing ${ref}');return false"><i class="ti ti-eye" style="font-size:11px"></i> View</a>
              ${status==='Draft'||status==='Pending'?`<a onclick="toast('Approving ${ref}');return false"><i class="ti ti-check" style="font-size:11px"></i> Approve</a>`:''}
              <a onclick="toast('Payment scheduled for ${ref}');return false"><i class="ti ti-calendar" style="font-size:11px"></i> Schedule payment</a>
              <a onclick="toast('PDF downloaded');return false"><i class="ti ti-download" style="font-size:11px"></i> Download PDF</a>
              <div class="sep"></div>
              <a class="danger" onclick="warnDelete('${ref}','supplier',()=>{this.closest('tr').remove();toast('${ref} deleted')});return false"><i class="ti ti-trash" style="font-size:11px"></i> Delete</a>
            </div></div></td>
        </tr>`;
      }).join('')}
    </table>
  </div>`;
  setupBulk('bill-tbl','bill-bar','bill-cnt','bill-cb','bill-all');
}

// ── suppliers ──────────────────────────────────────
BUILDERS.suppliers = function(panel) {
  panel.innerHTML = `
  <div class="card">
    <div class="card-hd"><span class="card-title">Suppliers</span>
      <div style="display:flex;gap:6px;flex-wrap:wrap;align-items:center">
        <input class="tbl-search" placeholder="Search suppliers..." oninput="filterTable(this,'sup-tbl')">
        <button class="btn btn-primary btn-sm" onclick="toast('New supplier form')"><i class="ti ti-plus"></i>Add supplier</button>
        <button class="btn btn-sm" onclick="exportCSV('sup-tbl','suppliers')"><i class="ti ti-download"></i>Export</button>
      </div>
    </div>
    <div class="bulk-bar" id="sup-bar"><span id="sup-cnt" class="badge b-gray">0 selected</span><button class="btn btn-sm btn-danger" onclick="toast('Suppliers deactivated')">Deactivate</button></div>
    <table id="sup-tbl">
      <tr><th class="col-check"><input type="checkbox" id="sup-all" style="accent-color:var(--g500)"></th><th class="sortable" onclick="sortTable(this)">Code</th><th class="sortable" onclick="sortTable(this)">Name</th><th class="sortable" onclick="sortTable(this)">Email</th><th class="sortable" onclick="sortTable(this)">Phone</th><th class="sortable" onclick="sortTable(this)">Payment terms</th><th class="sortable" onclick="sortTable(this)">Status</th><th>Actions</th></tr>
      ${[['S-001','Conoil Nigeria Ltd','billing@conoil.ng','0801-111-0001','Net 30','Active'],['S-002','MTN Business','enterprise@mtn.ng','0802-111-0002','Net 15','Active'],['S-003','Lagos Electricity Board','supply@leb.gov.ng','0803-111-0003','Due on receipt','Active'],['S-004','Perkins Nigeria Ltd','orders@perkins.ng','0804-111-0004','Net 60','Active'],['S-005','Office Supplies Pro','info@officesupplies.ng','0805-111-0005','Net 30','Active']].map(([code,name,email,phone,terms,status])=>`<tr><td class="col-check"><input type="checkbox" class="sup-cb" style="accent-color:var(--g500)"></td><td class="td-bold">${code}</td><td style="cursor:pointer;color:var(--g600);font-weight:600" onclick="toast('Viewing ${name}')">${name}</td><td style="font-size:11px">${email}</td><td>${phone}</td><td>${terms}</td><td><span class="badge b-green">${status}</span></td><td class="action-col"><div class="action-menu"><button class="action-btn" onclick="toggleAction(this)">Actions <i class="ti ti-chevron-down" style="font-size:10px"></i></button><div class="action-dropdown"><a onclick="toast('Editing ${name}');return false">Edit</a><a onclick="toast('View ledger for ${name}');return false">View ledger</a><a onclick="toast('Creating PO for ${name}');return false">Create PO</a><div class="sep"></div><a class="danger" onclick="warnDelete('${name}',()=>{this.closest('tr').remove()});return false">Delete</a></div></div></td></tr>`).join('')}
    </table>
  </div>`;
  setupBulk('sup-tbl','sup-bar','sup-cnt','sup-cb','sup-all');
}

// ── shipments ──────────────────────────────────────
BUILDERS.shipments = function(panel) {
  panel.innerHTML = `
  <div class="card">
    <div class="card-hd"><span class="card-title">Shipments & landed costs</span>
      <div style="display:flex;gap:6px;flex-wrap:wrap">
        <button class="btn btn-primary btn-sm" onclick="openNewShipment()"><i class="ti ti-plus"></i>New shipment</button>
        <button class="btn btn-sm" onclick="downloadTableAsExcel('ship-tbl','shipments')"><i class="ti ti-download"></i>Export</button>
      </div>
    </div>
    <div style="display:flex;gap:8px;flex-wrap:wrap;margin-bottom:10px;padding:10px 12px;background:var(--zinc-50);border:1px solid var(--border);border-radius:var(--r-md)">
      <input class="tbl-search" placeholder="Search ref, supplier, PO..." oninput="filterTable(this,'ship-tbl')" style="flex:1;min-width:160px">
      <select class="tbl-filter" onchange="filterByCol('ship-tbl',8,this.value)">
        <option value="">All statuses</option>${PICKLISTS.shipmentStatuses.map(s=>`<option>${s}</option>`).join('')}
      </select>
      <select class="tbl-filter" onchange="filterByCol('ship-tbl',9,this.value)">
        <option value="">All incoterms</option>${PICKLISTS.incoterms.map(s=>`<option>${s}</option>`).join('')}
      </select>
      <button class="btn btn-sm" onclick="clearTableFilters('ship-tbl','p-shipments')">Clear</button>
    </div>
    <div class="bulk-bar" id="ship-bar"><span id="ship-cnt" class="badge b-gray">0 selected</span>
      <button class="btn btn-sm btn-primary" onclick="toast('Selected marked received')">Mark received</button>
      <button class="btn btn-sm" onclick="toast('Landed costs allocated')">Allocate costs</button>
      <button class="btn btn-sm btn-danger" onclick="bulkDeleteChecked('ship-tbl','ship-cb','ship-bar',()=>toast('Shipments deleted'))">Delete</button>
    </div>
    <table id="ship-tbl">
      <tr>
        <th class="col-check"><input type="checkbox" id="ship-all" style="accent-color:var(--primary)" onchange="selectAllInTbl(this,'ship-cb')"></th>
        <th class="sortable" onclick="sortTable(this)">Ref</th>
        <th class="sortable" onclick="sortTable(this)">Supplier</th>
        <th class="sortable" onclick="sortTable(this)">PO ref</th>
        <th class="sortable" onclick="sortTable(this)">ETA</th>
        <th class="sortable" onclick="sortTable(this)" style="text-align:right">Base cost (₦)</th>
        <th class="sortable" onclick="sortTable(this)" style="text-align:right">Freight (₦)</th>
        <th class="sortable" onclick="sortTable(this)" style="text-align:right">Duties (₦)</th>
        <th class="sortable" onclick="sortTable(this)" style="text-align:right">Landed cost (₦)</th>
        <th class="sortable" onclick="sortTable(this)">Status</th>
        <th class="sortable" onclick="sortTable(this)">Incoterm</th>
        <th>Actions</th>
      </tr>
      ${SHIPMENTS_DB.map(s => {
        const landed = s.baseCost + s.freight + s.duties + s.insurance;
        return `<tr data-date="${s.eta}">
          <td class="col-check"><input type="checkbox" class="ship-cb" style="accent-color:var(--primary)" onchange="updateBulkBar('ship-tbl','ship-bar','ship-cnt','ship-cb','ship-all')"></td>
          <td class="td-bold" style="cursor:pointer;color:var(--green-700)" onclick="viewShipmentDetail('${s.ref}')">${s.ref}</td>
          <td>${s.supplier}</td>
          <td style="color:var(--blue-700)">${s.po}</td>
          <td>${s.eta}</td>
          <td style="text-align:right;font-variant-numeric:tabular-nums">₦${s.baseCost.toLocaleString()}</td>
          <td style="text-align:right;font-variant-numeric:tabular-nums">₦${s.freight.toLocaleString()}</td>
          <td style="text-align:right;font-variant-numeric:tabular-nums">₦${s.duties.toLocaleString()}</td>
          <td style="text-align:right;font-weight:700;font-variant-numeric:tabular-nums;color:var(--green-700)">₦${landed.toLocaleString()}</td>
          <td><span class="badge ${s.status==='Received'?'b-green':'b-blue'}">${s.status}</span></td>
          <td><span class="badge b-gray">${s.incoterm}</span></td>
          <td class="action-col"><div class="action-menu"><button class="action-btn" onclick="toggleAction(this)">Actions <i class="ti ti-chevron-down" style="font-size:10px"></i></button>
            <div class="action-dropdown">
              <a onclick="viewShipmentDetail('${s.ref}');return false"><i class="ti ti-eye"></i>View detail</a>
              ${s.status!=='Received'?`<a onclick="toast('${s.ref} marked received');this.closest('tr').querySelector('.badge.b-blue').className='badge b-green';this.closest('tr').querySelector('.badge.b-blue').textContent='Received';return false"><i class="ti ti-check"></i>Mark received</a>`:''}
              <a onclick="toast('Landed costs posted to GL for ${s.ref}');return false"><i class="ti ti-notebook"></i>Post landed costs</a>
              <a onclick="toast('Costs allocated to inventory for ${s.ref}');return false"><i class="ti ti-package"></i>Allocate to inventory</a>
              <div class="sep"></div>
              <a class="danger" onclick="warnDelete('${s.ref}','supplier',()=>{this.closest('tr').remove()});return false"><i class="ti ti-trash"></i>Delete</a>
            </div></div></td>
        </tr>`;
      }).join('')}
    </table>
  </div>`;
  setupBulk('ship-tbl','ship-bar','ship-cnt','ship-cb','ship-all');
  setupTableDefaults('ship-tbl');
}
