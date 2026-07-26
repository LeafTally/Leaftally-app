// ============================================================
// LeafTally — INVENTORY module
// ============================================================

/* global BUILDERS, PICKLISTS, GL_ACCOUNTS, PRODUCTS, */
/* global CUSTOMERS_DB, SUPPLIERS_DB, JOURNAL_LEDGER, */
/* global currentUser, openDrawer, closeDrawer, toast, */
/* global filterTable, filterByCol, sortTable, setupTableDefaults */

// ── materials ──────────────────────────────────────
BUILDERS.materials = function(panel) {
  panel.innerHTML = `
  <div class="card">
    <div class="card-hd"><span class="card-title">Materials register</span>
      <div style="display:flex;gap:6px;flex-wrap:wrap;align-items:center">
        <input class="tbl-search" placeholder="Search materials..." oninput="filterTable(this,'mat-tbl')">
        <select class="tbl-filter" onchange="filterByStatus(this,'mat-tbl',2)"><option value="">All categories</option>${PICKLISTS.productCats.map(c=>`<option>${c}</option>`).join('')}</select>
        <button class="btn btn-primary btn-sm" onclick="openAddMaterial()"><i class="ti ti-plus"></i>Add material</button>
        <button class="btn btn-sm" onclick="exportCSV('mat-tbl','materials')"><i class="ti ti-download"></i>Export</button>
      </div>
    </div>
    <div class="bulk-bar" id="mat-bar"><span id="mat-cnt" class="badge b-gray">0 selected</span><button class="btn btn-sm" onclick="toast('Requisition raised')">Raise requisition</button><button class="btn btn-sm btn-danger" onclick="toast('Materials deleted')">Delete</button></div>
    <table id="mat-tbl">
      <tr><th class="col-check"><input type="checkbox" id="mat-all" style="accent-color:var(--g500)"></th><th class="sortable" onclick="sortTable(this)">Code</th><th class="sortable" onclick="sortTable(this)">Name</th><th class="sortable" onclick="sortTable(this)">Category</th><th class="sortable" onclick="sortTable(this)">UoM</th><th class="sortable" onclick="sortTable(this)" style="text-align:right">Unit cost (₦)</th><th class="sortable" onclick="sortTable(this)" style="text-align:right">Stock qty</th><th class="sortable" onclick="sortTable(this)">Reorder point</th><th>Actions</th></tr>
      ${[['MAT-001','Steel sheet 2mm','Materials','Sqm',12500,45,10],['MAT-002','Aluminium bar 50mm','Materials','Metre',8750,23,5],['MAT-003','Engine oil (5L)','Consumables','Each',18000,3,10],['MAT-004','Welding rod (kg)','Materials','Kg',4500,2,15],['MAT-005','Safety gloves (pair)','Consumables','Each',3500,30,20]].map(([code,name,cat,uom,cost,qty,reorder])=>`<tr><td class="col-check"><input type="checkbox" class="mat-cb" style="accent-color:var(--g500)"></td><td class="td-bold">${code}</td><td style="font-weight:600">${name}</td><td>${cat}</td><td>${uom}</td><td style="text-align:right;font-weight:600">₦${cost.toLocaleString()}</td><td style="text-align:right;${qty<=reorder?'color:var(--r400);font-weight:600':''};">${qty}</td><td style="text-align:right;color:var(--t400)">${reorder}</td><td class="action-col"><div class="action-menu"><button class="action-btn" onclick="toggleAction(this)">Actions <i class="ti ti-chevron-down" style="font-size:10px"></i></button><div class="action-dropdown"><a onclick="toast('Editing ${name}');return false">Edit</a><a onclick="toast('Adjusting qty for ${name}');return false">Adjust qty</a><a onclick="toast('Reorder raised for ${name}');return false">Raise reorder</a><div class="sep"></div><a class="danger" onclick="warnDelete('${name}',()=>{this.closest('tr').remove()});return false">Delete</a></div></div></td></tr>`).join('')}
    </table>
  </div>`;
  setupBulk('mat-tbl','mat-bar','mat-cnt','mat-cb','mat-all');
}

// ── bom ──────────────────────────────────────
BUILDERS.bom = function(panel) {
  panel.innerHTML = `
  <div class="card">
    <div class="card-hd"><span class="card-title">Bill of materials</span>
      <div style="display:flex;gap:6px;flex-wrap:wrap">
        <button class="btn btn-primary btn-sm" onclick="openBOMForm()"><i class="ti ti-plus"></i>New BOM</button>
        <button class="btn btn-sm" onclick="downloadTableAsExcel('bom-tbl','bill-of-materials')"><i class="ti ti-download"></i>Export</button>
      </div>
    </div>
    <div style="display:flex;gap:8px;flex-wrap:wrap;margin-bottom:10px;padding:10px 12px;background:var(--zinc-50);border:1px solid var(--border);border-radius:var(--r-md)">
      <input class="tbl-search" placeholder="Search BOM ref, product..." oninput="filterTable(this,'bom-tbl')" style="flex:1;min-width:160px">
      <select class="tbl-filter" onchange="filterByCol('bom-tbl',5,this.value)">
        <option value="">All statuses</option>${PICKLISTS.bomStatuses.map(s=>`<option>${s}</option>`).join('')}
      </select>
      <button class="btn btn-sm" onclick="clearTableFilters('bom-tbl','p-bom')">Clear</button>
    </div>
    <div class="bulk-bar" id="bom-bar"><span id="bom-cnt" class="badge b-gray">0 selected</span>
      <button class="btn btn-sm" onclick="toast('BOMs activated')">Activate</button>
      <button class="btn btn-sm btn-danger" onclick="bulkDeleteChecked('bom-tbl','bom-cb','bom-bar',()=>toast('BOMs deleted'))">Delete</button>
    </div>
    <table id="bom-tbl">
      <tr>
        <th class="col-check"><input type="checkbox" id="bom-all" style="accent-color:var(--primary)" onchange="selectAllInTbl(this,'bom-cb')"></th>
        <th class="sortable" onclick="sortTable(this)">BOM ref</th>
        <th class="sortable" onclick="sortTable(this)">Product</th>
        <th class="sortable" onclick="sortTable(this)">Revision</th>
        <th class="sortable" onclick="sortTable(this)" style="text-align:right">Components</th>
        <th class="sortable" onclick="sortTable(this)" style="text-align:right">BOM cost (₦)</th>
        <th class="sortable" onclick="sortTable(this)">Status</th>
        <th>Actions</th>
      </tr>
      ${BOM_DB.map(b=>`<tr>
        <td class="col-check"><input type="checkbox" class="bom-cb" style="accent-color:var(--primary)" onchange="updateBulkBar('bom-tbl','bom-bar','bom-cnt','bom-cb','bom-all')"></td>
        <td class="td-bold" style="cursor:pointer;color:var(--green-700)" onclick="viewBOMDetail('${b.ref}')">${b.ref}</td>
        <td style="font-weight:600">${b.product}</td>
        <td>${b.rev}</td>
        <td style="text-align:right">${b.components.length}</td>
        <td style="text-align:right;font-weight:600;font-variant-numeric:tabular-nums">₦${b.cost.toLocaleString()}</td>
        <td><span class="badge ${b.status==='Active'?'b-green':'b-amber'}">${b.status}</span></td>
        <td class="action-col"><div class="action-menu"><button class="action-btn" onclick="toggleAction(this)">Actions <i class="ti ti-chevron-down" style="font-size:10px"></i></button>
          <div class="action-dropdown">
            <a onclick="viewBOMDetail('${b.ref}');return false"><i class="ti ti-eye"></i>View components</a>
            <a onclick="toast('Editing ${b.ref}');return false"><i class="ti ti-pencil"></i>Edit</a>
            <a onclick="createProdOrderFromBOM('${b.ref}');return false"><i class="ti ti-settings-automation"></i>Create production order</a>
            <a onclick="toast('Duplicating ${b.ref}');return false"><i class="ti ti-copy"></i>Duplicate</a>
            <div class="sep"></div>
            <a class="danger" onclick="warnDelete('${b.ref}','account',()=>{this.closest('tr').remove()});return false"><i class="ti ti-trash"></i>Delete</a>
          </div></div></td>
      </tr>`).join('')}
    </table>
  </div>`;
  setupBulk('bom-tbl','bom-bar','bom-cnt','bom-cb','bom-all');
}

// ── prodorders ──────────────────────────────────────
BUILDERS.prodorders = function(panel) {
  const total = PROD_ORDERS_DB.length;
  const inProg = PROD_ORDERS_DB.filter(o=>o.status==='In progress').length;
  const complete = PROD_ORDERS_DB.filter(o=>o.status==='Complete').length;
  panel.innerHTML = `
  <div class="kpi-strip">
    <div class="kpi-card"><div class="kpi-label">Total orders</div><div class="kpi-value">${total}</div></div>
    <div class="kpi-card"><div class="kpi-label">In progress</div><div class="kpi-value" style="color:var(--blue-700)">${inProg}</div></div>
    <div class="kpi-card"><div class="kpi-label">Complete</div><div class="kpi-value" style="color:var(--green-700)">${complete}</div></div>
    <div class="kpi-card"><div class="kpi-label">Total production cost</div><div class="kpi-value" style="font-size:16px">₦${PROD_ORDERS_DB.reduce((a,o)=>a+o.cost,0).toLocaleString()}</div></div>
  </div>
  <div class="card">
    <div class="card-hd"><span class="card-title">Production orders</span>
      <div style="display:flex;gap:6px;flex-wrap:wrap">
        <button class="btn btn-primary btn-sm" onclick="openNewProdOrder()"><i class="ti ti-plus"></i>New order</button>
        <button class="btn btn-sm" onclick="downloadTableAsExcel('prod-tbl','production-orders')"><i class="ti ti-download"></i>Export</button>
      </div>
    </div>
    <div style="display:flex;gap:8px;flex-wrap:wrap;margin-bottom:10px;padding:10px 12px;background:var(--zinc-50);border:1px solid var(--border);border-radius:var(--r-md)">
      <input class="tbl-search" placeholder="Search order, product..." oninput="filterTable(this,'prod-tbl')" style="flex:1;min-width:160px">
      <select class="tbl-filter" onchange="filterByCol('prod-tbl',6,this.value)">
        <option value="">All statuses</option>${PICKLISTS.productionStatuses.map(s=>`<option>${s}</option>`).join('')}
      </select>
      <input type="date" class="tbl-filter" id="prod-f-from">
      <input type="date" class="tbl-filter" id="prod-f-to">
      <button class="btn btn-sm" onclick="applyDateFilter('prod-tbl',4,'prod-f-from','prod-f-to')"><i class="ti ti-filter"></i>Apply</button>
      <button class="btn btn-sm" onclick="clearTableFilters('prod-tbl','p-prodorders')">Clear</button>
    </div>
    <div class="bulk-bar" id="prod-bar"><span id="prod-cnt" class="badge b-gray">0 selected</span>
      <button class="btn btn-sm btn-primary" onclick="bulkCompleteProdOrders()">Mark complete</button>
      <button class="btn btn-sm" onclick="toast('GL posted for selected orders')">Post GL</button>
      <button class="btn btn-sm btn-danger" onclick="bulkDeleteChecked('prod-tbl','prod-cb','prod-bar',()=>toast('Orders cancelled'))">Cancel</button>
    </div>
    <table id="prod-tbl">
      <tr>
        <th class="col-check"><input type="checkbox" id="prod-all" style="accent-color:var(--primary)" onchange="selectAllInTbl(this,'prod-cb')"></th>
        <th class="sortable" onclick="sortTable(this)">Order ref</th>
        <th class="sortable" onclick="sortTable(this)">Product</th>
        <th class="sortable" onclick="sortTable(this)">BOM</th>
        <th class="sortable" onclick="sortTable(this)" style="text-align:right">Qty</th>
        <th class="sortable" onclick="sortTable(this)">Start date</th>
        <th class="sortable" onclick="sortTable(this)">Due date</th>
        <th class="sortable" onclick="sortTable(this)" style="text-align:right">Cost (₦)</th>
        <th class="sortable" onclick="sortTable(this)">Status</th>
        <th>Actions</th>
      </tr>
      ${PROD_ORDERS_DB.map(o=>`<tr data-date="${o.start}" data-ref="${o.ref}">
        <td class="col-check"><input type="checkbox" class="prod-cb" style="accent-color:var(--primary)" onchange="updateBulkBar('prod-tbl','prod-bar','prod-cnt','prod-cb','prod-all')"></td>
        <td class="td-bold" style="cursor:pointer;color:var(--green-700)" onclick="viewProdOrderDetail('${o.ref}')">${o.ref}</td>
        <td style="font-weight:600">${o.product}</td>
        <td style="color:var(--blue-700)">${o.bom}</td>
        <td style="text-align:right">${o.qty}</td>
        <td>${o.start}</td>
        <td style="color:${new Date(o.due)<new Date()&&o.status!=='Complete'?'var(--red-600)':'inherit'}">${o.due}</td>
        <td style="text-align:right;font-variant-numeric:tabular-nums">₦${o.cost.toLocaleString()}</td>
        <td><span class="badge ${o.status==='Complete'?'b-green':o.status==='In progress'?'b-blue':'b-amber'}">${o.status}</span></td>
        <td class="action-col"><div class="action-menu"><button class="action-btn" onclick="toggleAction(this)">Actions <i class="ti ti-chevron-down" style="font-size:10px"></i></button>
          <div class="action-dropdown">
            <a onclick="viewProdOrderDetail('${o.ref}');return false"><i class="ti ti-eye"></i>View detail</a>
            ${o.status!=='Complete'?`<a onclick="completeProdOrder('${o.ref}',this);return false"><i class="ti ti-check"></i>Mark complete</a>`:''}
            <a onclick="toast('GL posted for ${o.ref}');return false"><i class="ti ti-notebook"></i>Post to GL</a>
            <a onclick="toast('Materials issued for ${o.ref}');return false"><i class="ti ti-package"></i>Issue materials</a>
            <div class="sep"></div>
            <a class="danger" onclick="warnDelete('${o.ref}','account',()=>{this.closest('tr').remove()});return false"><i class="ti ti-trash"></i>Cancel order</a>
          </div></div></td>
      </tr>`).join('')}
    </table>
  </div>`;
  setupBulk('prod-tbl','prod-bar','prod-cnt','prod-cb','prod-all');
  setupTableDefaults('prod-tbl');
}

// ── invadjust ──────────────────────────────────────
BUILDERS.invadjust = function(panel) {
  panel.innerHTML = `
  <div class="card">
    <div class="card-hd"><span class="card-title">Inventory adjustments</span>
      <div style="display:flex;gap:6px"><button class="btn btn-primary btn-sm" onclick="toast('New adjustment form')"><i class="ti ti-plus"></i>New adjustment</button><button class="btn btn-sm" onclick="exportCSV('iadj-tbl','inv-adjustments')"><i class="ti ti-download"></i>Export</button></div>
    </div>
    <div class="bulk-bar" id="iadj-bar"><span id="iadj-cnt" class="badge b-gray">0 selected</span><button class="btn btn-sm" onclick="toast('Adjustments reversed')">Reverse</button></div>
    <table id="iadj-tbl">
      <tr><th class="col-check"><input type="checkbox" id="iadj-all" style="accent-color:var(--g500)"></th><th class="sortable" onclick="sortTable(this)">Ref</th><th class="sortable" onclick="sortTable(this)">Date</th><th class="sortable" onclick="sortTable(this)">Product</th><th class="sortable" onclick="sortTable(this)">Type</th><th class="sortable" onclick="sortTable(this)" style="text-align:right">Qty change</th><th class="sortable" onclick="sortTable(this)" style="text-align:right">Value (₦)</th><th class="sortable" onclick="sortTable(this)">Reason</th><th>Actions</th></tr>
      ${[['ADJ-029','20 Jun 2026','Printer paper (ream)','Write-down','-5','22,500','Damaged in storage'],['ADJ-028','18 Jun 2026','Steel sheet 2mm','Recount','+3','37,500','Stock count variance'],['ADJ-027','15 Jun 2026','Engine oil (5L)','Consumption','-8','144,000','Production usage'],['ADJ-026','10 Jun 2026','Safety gloves','Write-off','-10','35,000','End of life']].map(([ref,date,prod,type,qty,val,reason]) => `<tr>
        <td class="col-check"><input type="checkbox" class="iadj-cb" style="accent-color:var(--g500)"></td>
        <td class="td-bold" style="color:var(--g600)">${ref}</td><td>${date}</td><td>${prod}</td>
        <td><span class="badge ${type==='Recount'?'b-blue':type==='Consumption'?'b-gray':'b-amber'}">${type}</span></td>
        <td style="text-align:right;font-weight:600;color:${qty.startsWith('-')?'var(--r400)':'var(--g600)'}">${qty}</td>
        <td style="text-align:right">₦${val}</td><td style="font-size:11px;color:var(--t500)">${reason}</td>
        <td class="action-col"><div class="action-menu"><button class="action-btn" onclick="toggleAction(this)">Actions <i class="ti ti-chevron-down" style="font-size:10px"></i></button><div class="action-dropdown"><a onclick="toast('Viewing ${ref}');return false">View</a><a onclick="toast('Reversing ${ref}');return false">Reverse</a><div class="sep"></div><a class="danger" onclick="warnDelete('${ref}',()=>{this.closest('tr').remove()});return false">Delete</a></div></div></td>
      </tr>`).join('')}
    </table>
  </div>`;
  setupBulk('iadj-tbl','iadj-bar','iadj-cnt','iadj-cb','iadj-all');
}

// ── invlayers ──────────────────────────────────────
BUILDERS.invlayers = function(panel) {
  panel.innerHTML = `
  <div class="card">
    <div class="card-hd"><span class="card-title">Inventory layers (FIFO)</span><button class="btn btn-sm" onclick="exportCSV('fifo-tbl','fifo-layers')"><i class="ti ti-download"></i>Export</button></div>
    <div class="alert alert-blue"><i class="ti ti-info-circle"></i>Inventory is valued using the <strong>FIFO (First In, First Out)</strong> method. Oldest batches are consumed first.</div>
    <table id="fifo-tbl">
      <tr><th class="sortable" onclick="sortTable(this)">Product</th><th class="sortable" onclick="sortTable(this)">Layer date</th><th class="sortable" onclick="sortTable(this)">PO/source ref</th><th class="sortable" onclick="sortTable(this)" style="text-align:right">Qty received</th><th class="sortable" onclick="sortTable(this)" style="text-align:right">Qty remaining</th><th class="sortable" onclick="sortTable(this)" style="text-align:right">Unit cost (₦)</th><th class="sortable" onclick="sortTable(this)" style="text-align:right">Layer value (₦)</th></tr>
      ${[['Steel sheet 2mm','01 Apr 2026','PO-018',20,8,12000],['Steel sheet 2mm','01 May 2026','PO-020',30,22,12500],['Steel sheet 2mm','01 Jun 2026','PO-022',25,25,13000],['Engine oil (5L)','15 May 2026','PO-019',20,3,17500],['Safety gloves','01 Jun 2026','PO-021',40,30,3500]].map(([prod,date,po,recv,remain,cost]) => `<tr>
        <td class="td-bold">${prod}</td><td>${date}</td><td style="color:var(--g600)">${po}</td>
        <td style="text-align:right">${recv}</td>
        <td style="text-align:right;font-weight:600;color:${remain<5?'var(--r400)':'inherit'}">${remain}</td>
        <td style="text-align:right">₦${cost.toLocaleString()}</td>
        <td style="text-align:right;font-weight:600;color:var(--g600)">₦${(remain*cost).toLocaleString()}</td>
      </tr>`).join('')}
    </table>
  </div>`;
}
