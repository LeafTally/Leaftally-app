// ============================================================
// LeafTally — SALES module
// ============================================================

/* global BUILDERS, PICKLISTS, GL_ACCOUNTS, PRODUCTS, */
/* global CUSTOMERS_DB, SUPPLIERS_DB, JOURNAL_LEDGER, */
/* global currentUser, openDrawer, closeDrawer, toast, */
/* global filterTable, filterByCol, sortTable, setupTableDefaults */

// ── invoices ──────────────────────────────────────
BUILDERS.invoices = function(panel) {
  panel.innerHTML = `
  <div class="kpi-strip">
    <div class="kpi-card"><div class="kpi-label">Outstanding</div><div class="kpi-value" style="color:var(--a600)">₦1.9M</div></div>
    <div class="kpi-card"><div class="kpi-label">Paid (Jun)</div><div class="kpi-value" style="color:var(--g600)">₦2.3M</div></div>
    <div class="kpi-card"><div class="kpi-label">Overdue</div><div class="kpi-value" style="color:var(--r400)">4</div></div>
    <div class="kpi-card"><div class="kpi-label">Draft</div><div class="kpi-value">2</div></div>
  </div>
  <div class="card">
    <div class="card-hd">
      <span class="card-title">Invoices</span>
      <div style="display:flex;gap:6px;flex-wrap:wrap;align-items:center">
        <button class="btn btn-primary btn-sm" onclick="openModal('modal-invoice');setTimeout(()=>{refreshCustomerDropdowns();upgradeInvLineInputs();},100)"><i class="ti ti-plus"></i>New invoice</button>
        <button class="btn btn-sm" onclick="exportCSV('inv-tbl','invoices')"><i class="ti ti-download"></i>Export</button>
      </div>
    </div>
    <div style="display:flex;gap:8px;flex-wrap:wrap;margin-bottom:10px;padding:10px 12px;background:var(--bg);border-radius:var(--radius)">
      <input class="tbl-search" placeholder="Search ref, customer, amount..." oninput="filterTable(this,'inv-tbl')" style="flex:1;min-width:160px">
      <select class="tbl-filter" onchange="filterByCol('inv-tbl',5,this.value)">
        <option value="">All statuses</option><option>Draft</option><option>Sent</option><option>Paid</option><option>Overdue</option>
      </select>
      <select class="tbl-filter" id="inv-f-cust" onchange="filterByCol('inv-tbl',2,this.value)">
        <option value="">All customers</option>
        ${CUSTOMERS_DB.map(cu=>`<option>${cu.name}</option>`).join('')}
      </select>
      <input type="date" class="tbl-filter" id="inv-f-from" title="From date">
      <input type="date" class="tbl-filter" id="inv-f-to" title="To date">
      <button class="btn btn-sm" onclick="applyDateFilter('inv-tbl',3,'inv-f-from','inv-f-to')"><i class="ti ti-filter"></i>Apply</button>
      <button class="btn btn-sm" onclick="clearTableFilters('inv-tbl','p-invoices')">Clear</button>
    </div>
    <div class="bulk-bar" id="inv-bar">
      <span id="inv-cnt" class="badge b-gray">0 selected</span>
      <button class="btn btn-sm btn-primary" onclick="toast('Selected invoices approved')">Approve</button>
      <button class="btn btn-sm" onclick="toast('Sending emails...')">Send email</button>
      <button class="btn btn-sm btn-danger" onclick="bulkDeleteChecked('inv-tbl','inv-cb','inv-bar',()=>toast('Draft invoices deleted'))">Delete drafts</button>
    </div>
    <table id="inv-tbl">
      <tr>
        <th class="col-check"><input type="checkbox" id="inv-all" style="accent-color:var(--g500)" onchange="selectAllInTbl(this,'inv-cb')"></th>
        <th class="sortable" onclick="sortTable(this)">Invoice #</th>
        <th class="sortable" onclick="sortTable(this)">Customer</th>
        <th class="sortable" onclick="sortTable(this)">Date</th>
        <th class="sortable" onclick="sortTable(this)">Due date</th>
        <th class="sortable" onclick="sortTable(this)">Status</th>
        <th class="sortable" onclick="sortTable(this)" style="text-align:right">Amount (₦)</th>
        <th>Actions</th>
      </tr>
      ${[
        ['INV-2026-0041','Dangote Foods Ltd','2026-06-23','2026-07-23','Sent','483750'],
        ['INV-2026-0040','MTN Nigeria Plc','2026-06-20','2026-07-20','Paid','247250'],
        ['INV-2026-0039','Lagos State Govt','2026-06-10','2026-07-10','Overdue','850000'],
        ['INV-2026-0038','Nestlé Nigeria Plc','2026-06-05','2026-07-05','Paid','320000'],
        ['INV-2026-0037','Dangote Foods Ltd','2026-06-01','2026-07-01','Paid','196500'],
        ['INV-2026-0036','MTN Nigeria Plc','2026-05-28','2026-06-28','Draft','125000'],
      ].map(([ref,cust,date,due,status,amt]) => {
        const sc={Draft:'b-gray',Sent:'b-amber',Paid:'b-green',Overdue:'b-red'}[status]||'b-gray';
        const famt = parseInt(amt).toLocaleString();
        return `<tr data-status="${status}">
          <td class="col-check"><input type="checkbox" class="inv-cb" style="accent-color:var(--g500)" onchange="updateBulkBar('inv-tbl','inv-bar','inv-cnt','inv-cb','inv-all')"></td>
          <td class="td-bold" style="cursor:pointer;color:var(--g600)" onclick="viewInvoice('${ref}')">${ref}</td>
          <td>${cust}</td><td>${date}</td>
          <td style="color:${status==='Overdue'?'var(--r400)':'inherit'}">${due}</td>
          <td><span class="badge ${sc}">${status}</span></td>
          <td style="text-align:right;font-weight:600">₦${famt}</td>
          <td class="action-col"><div class="action-menu"><button class="action-btn" onclick="toggleAction(this)">Actions <i class="ti ti-chevron-down" style="font-size:10px"></i></button>
            <div class="action-dropdown">
              <a onclick="viewInvoice('${ref}');return false"><i class="ti ti-eye" style="font-size:11px"></i> View</a>
              ${status==='Draft'?`<a onclick="toast('Editing ${ref}');return false"><i class="ti ti-pencil" style="font-size:11px"></i> Edit</a>`:''}
              <a onclick="toast('Payment recorded for ${ref}');return false"><i class="ti ti-cash" style="font-size:11px"></i> Record payment</a>
              <a onclick="toast('Email sent for ${ref}');return false"><i class="ti ti-mail" style="font-size:11px"></i> Send email</a>
              <a onclick="toast('PDF downloaded');return false"><i class="ti ti-download" style="font-size:11px"></i> Download PDF</a>
              <div class="sep"></div>
              <a class="danger" onclick="warnDelete('${ref}','invoice',()=>{this.closest('tr').remove();toast('${ref} deleted')});return false"><i class="ti ti-trash" style="font-size:11px"></i> Delete</a>
            </div></div></td>
        </tr>`;
      }).join('')}
    </table>
  </div>`;
  setupBulk('inv-tbl','inv-bar','inv-cnt','inv-cb','inv-all');
}

// ── pos ──────────────────────────────────────
BUILDERS.pos = function(panel) {
  panel.innerHTML = `
  <div class="grid-2" style="height:calc(100vh - 140px)">
    <div>
      <div class="card" style="margin-bottom:12px">
        <div class="card-hd"><span class="card-title">Products</span><input class="tbl-search" placeholder="Search products..." oninput="filterPOS(this.value)"></div>
        <div id="pos-grid" style="display:grid;grid-template-columns:repeat(auto-fill,minmax(140px,1fr));gap:10px"></div>
      </div>
    </div>
    <div class="card" style="display:flex;flex-direction:column">
      <div class="card-hd"><span class="card-title">Cart</span><span class="badge b-green" id="pos-item-count">0 items</span></div>
      <div id="pos-cart" style="flex:1;overflow-y:auto;min-height:200px"></div>
      <div id="pos-totals" style="display:none;border-top:1px solid var(--border);padding-top:10px;margin-top:10px">
        <div style="display:flex;justify-content:space-between;font-size:12px;padding:3px 0"><span>Subtotal</span><span id="pos-sub">₦0</span></div>
        <div style="display:flex;justify-content:space-between;font-size:12px;padding:3px 0;color:var(--t400)"><span>VAT 7.5%</span><span id="pos-vat">₦0</span></div>
        <div style="display:flex;justify-content:space-between;font-size:15px;font-weight:700;padding:6px 0;border-top:1px solid var(--border);margin-top:4px"><span>Total</span><span id="pos-total" style="color:var(--g600)">₦0</span></div>
        <select class="form-input" id="pos-payment" style="margin:8px 0"><option>Cash</option><option>Card (POS)</option><option>Bank transfer</option></select>
        <button class="btn btn-primary" style="width:100%;justify-content:center" onclick="completeSale()"><i class="ti ti-check"></i>Process payment</button>
        <button class="btn" style="width:100%;justify-content:center;margin-top:6px" onclick="clearCart()">Clear cart</button>
      </div>
      <div id="pos-empty" style="text-align:center;color:var(--t400);padding:30px;font-size:12px"><i class="ti ti-shopping-cart" style="font-size:32px;display:block;margin:0 auto 8px"></i>Add products to cart</div>
    </div>
  </div>`;
  buildPOSGrid(PRODUCTS);
}

// ── clients ──────────────────────────────────────
BUILDERS.clients = function(panel) {
  panel.innerHTML = `
  <div class="card">
    <div class="card-hd">
      <span class="card-title">Customers</span>
      <div style="display:flex;gap:6px;flex-wrap:wrap;align-items:center">
        <button class="btn btn-primary btn-sm" onclick="openNewCustomer()"><i class="ti ti-plus"></i>Add customer</button>
        <button class="btn btn-sm" onclick="exportCSV('cli-tbl','customers')"><i class="ti ti-download"></i>Export</button>
      </div>
    </div>
    <div style="display:flex;gap:8px;flex-wrap:wrap;margin-bottom:10px;padding:10px 12px;background:var(--bg);border-radius:var(--radius)">
      <input class="tbl-search" placeholder="Search name, code, email..." oninput="filterTable(this,'cli-tbl')" style="flex:1;min-width:160px">
      <select class="tbl-filter" onchange="filterByCol('cli-tbl',6,this.value)">
        <option value="">All statuses</option><option>Active</option><option>Inactive</option>
      </select>
      <button class="btn btn-sm" onclick="clearTableFilters('cli-tbl','p-clients')">Clear</button>
    </div>
    <div class="bulk-bar" id="cli-bar">
      <span id="cli-cnt" class="badge b-gray">0 selected</span>
      <button class="btn btn-sm" onclick="toast('Statements sent')">Send statement</button>
      <button class="btn btn-sm btn-danger" onclick="bulkDeleteChecked('cli-tbl','cli-cb','cli-bar',()=>toast('Customers deactivated'))">Deactivate</button>
    </div>
    <table id="cli-tbl">
      <tr>
        <th class="col-check"><input type="checkbox" id="cli-all" style="accent-color:var(--g500)" onchange="selectAllInTbl(this,'cli-cb')"></th>
        <th class="sortable" onclick="sortTable(this)">Code</th>
        <th class="sortable" onclick="sortTable(this)">Name</th>
        <th class="sortable" onclick="sortTable(this)">Email</th>
        <th class="sortable" onclick="sortTable(this)">Phone</th>
        <th class="sortable" onclick="sortTable(this)" style="text-align:right">Outstanding (₦)</th>
        <th class="sortable" onclick="sortTable(this)">Status</th>
        <th>Actions</th>
      </tr>
      ${CUSTOMERS_DB.map(cu => `<tr data-cust-id="${cu.id}">
        <td class="col-check"><input type="checkbox" class="cli-cb" style="accent-color:var(--g500)" onchange="updateBulkBar('cli-tbl','cli-bar','cli-cnt','cli-cb','cli-all')"></td>
        <td class="td-bold">${cu.id}</td>
        <td style="cursor:pointer;color:var(--g600);font-weight:600" onclick="openEditCustomer('${cu.id}')">${cu.name}</td>
        <td style="font-size:11px">${cu.email}</td>
        <td>${cu.phone}</td>
        <td style="text-align:right;font-weight:600;color:${cu.balance!=='0'?'var(--a600)':'var(--t400)'}">₦${cu.balance}</td>
        <td><span class="badge b-green">${cu.status}</span></td>
        <td class="action-col"><div class="action-menu"><button class="action-btn" onclick="toggleAction(this)">Actions <i class="ti ti-chevron-down" style="font-size:10px"></i></button>
          <div class="action-dropdown">
            <a onclick="openEditCustomer('${cu.id}');return false"><i class="ti ti-pencil" style="font-size:11px"></i> Edit</a>
            <a onclick="toast('Statement sent to ${cu.name}');return false"><i class="ti ti-mail" style="font-size:11px"></i> Send statement</a>
            <a onclick="openNewInvoiceForCustomer('${cu.name}');return false"><i class="ti ti-file-invoice" style="font-size:11px"></i> Create invoice</a>
            <a onclick="toast('Viewing ledger for ${cu.name}');return false"><i class="ti ti-book-2" style="font-size:11px"></i> View ledger</a>
            <div class="sep"></div>
            <a class="danger" onclick="warnDelete('${cu.name}','customer',()=>{this.closest('tr').remove();toast('${cu.name} deleted')});return false"><i class="ti ti-trash" style="font-size:11px"></i> Delete</a>
          </div></div></td>
      </tr>`).join('')}
    </table>
  </div>`;
  setupBulk('cli-tbl','cli-bar','cli-cnt','cli-cb','cli-all');
}
