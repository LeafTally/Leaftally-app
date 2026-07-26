// ============================================================
// LeafTally — ACCOUNTING module
// ============================================================

/* global BUILDERS, PICKLISTS, GL_ACCOUNTS, PRODUCTS, */
/* global CUSTOMERS_DB, SUPPLIERS_DB, JOURNAL_LEDGER, */
/* global currentUser, openDrawer, closeDrawer, toast, */
/* global filterTable, filterByCol, sortTable, setupTableDefaults */

// ── coa ──────────────────────────────────────
BUILDERS.coa = function(panel) {
  panel.innerHTML = `
  <div class="card">
    <div class="card-hd">
      <span class="card-title">Chart of accounts</span>
      <div style="display:flex;gap:6px;flex-wrap:wrap;align-items:center">
        <input class="tbl-search" placeholder="Search accounts..." oninput="filterTable(this,'coa-tbl')">
        <select class="tbl-filter" onchange="filterByStatus(this,'coa-tbl',3)"><option value="">All types</option><option>Asset</option><option>Liability</option><option>Equity</option><option>Income</option><option>Expense</option></select>
        <button class="btn btn-primary btn-sm" onclick="toast('Add account — coming soon')"><i class="ti ti-plus"></i>Add account</button>
        <button class="btn btn-sm" onclick="exportCSV('coa-tbl','chart-of-accounts')"><i class="ti ti-download"></i>Export</button>
      </div>
    </div>
    <div class="bulk-bar" id="coa-bar"><span id="coa-cnt" class="badge b-gray">0 selected</span><button class="btn btn-sm" onclick="toast('Selected accounts archived')">Archive</button><button class="btn btn-sm" onclick="exportCSV('coa-tbl','coa-selected')">Export</button></div>
    <table id="coa-tbl">
      <tr><th class="col-check"><input type="checkbox" id="coa-all" style="accent-color:var(--g500)"></th><th class="sortable" onclick="sortTable(this)">Code</th><th class="sortable" onclick="sortTable(this)">Account name</th><th class="sortable" onclick="sortTable(this)">Type</th><th class="sortable" onclick="sortTable(this)">Sub-type</th><th class="sortable" onclick="sortTable(this)">Status</th><th>Actions</th></tr>
      ${[
        ['1000','Cash and cash equivalents','Asset','Current asset','Active'],
        ['1100','Bank accounts','Asset','Current asset','Active'],
        ['1200','Accounts receivable','Asset','Current asset','Active'],
        ['1300','VAT receivable','Asset','Current asset','Active'],
        ['1500','Inventory','Asset','Current asset','Active'],
        ['1800','Fixed assets — cost','Asset','Non-current asset','Active'],
        ['1810','Accumulated depreciation','Asset','Non-current asset','Active'],
        ['2000','Accounts payable','Liability','Current liability','Active'],
        ['2100','VAT payable','Liability','Current liability','Active'],
        ['2200','PAYE payable','Liability','Current liability','Active'],
        ['3000','Share capital','Equity','Equity','Active'],
        ['3100','Retained earnings','Equity','Equity','Active'],
        ['4000','Sales revenue','Income','Revenue','Active'],
        ['4100','Service revenue','Income','Revenue','Active'],
        ['5000','Cost of goods sold','Expense','COGS','Active'],
        ['6000','Salaries & wages','Expense','Operating expense','Active'],
        ['6100','Rent expense','Expense','Operating expense','Active'],
        ['6200','Depreciation expense','Expense','Operating expense','Active'],
        ['6400','Other operating expenses','Expense','Operating expense','Active'],
      ].map(([code,name,type,sub,status]) => `<tr>
        <td class="col-check"><input type="checkbox" class="coa-cb" style="accent-color:var(--g500)"></td>
        <td class="td-bold" style="cursor:pointer;color:var(--g600)" onclick="openDrawer('${code} — ${name}','<div class=detail-row><span class=detail-label>Code</span><span class=detail-value>${code}</span></div><div class=detail-row><span class=detail-label>Type</span><span class=detail-value>${type}</span></div><div class=detail-row><span class=detail-label>Sub-type</span><span class=detail-value>${sub}</span></div><div style=margin-top:14px><button class=btn onclick=toast(\\'Account edited\\') style=width:100%><i class=ti ti-pencil></i>Edit account</button></div>')">${code}</td>
        <td>${name}</td>
        <td><span class="badge ${type==='Asset'?'b-blue':type==='Liability'?'b-amber':type==='Equity'?'b-teal':type==='Income'?'b-green':'b-red'}">${type}</span></td>
        <td>${sub}</td>
        <td><span class="badge b-green">${status}</span></td>
        <td class="action-col"><div class="action-menu"><button class="action-btn" onclick="toggleAction(this)">Actions <i class="ti ti-chevron-down" style="font-size:10px"></i></button><div class="action-dropdown"><a onclick="toast('Editing ${code}');return false">Edit</a><a onclick="toast('Viewing ledger for ${code}');return false">View ledger</a><div class="sep"></div><a class="danger" onclick="warnDelete('${code}',()=>{this.closest('tr').remove();toast('Account deleted')});return false">Delete</a></div></div></td>
      </tr>`).join('')}
    </table>
  </div>`;
  setupBulk('coa-tbl','coa-bar','coa-cnt','coa-cb','coa-all');
}

// ── gl ──────────────────────────────────────
BUILDERS.gl = function(panel) {
  panel.dataset.built = '1';
  panel.innerHTML = `
  <div class="card">
    <div class="card-hd">
      <span class="card-title">Journal entries</span>
      <div style="display:flex;gap:6px;flex-wrap:wrap;align-items:center">
        <button class="btn btn-primary btn-sm" onclick="openModal('modal-journal');setTimeout(populateJournalAccountSelects,100)"><i class="ti ti-plus"></i>New entry</button>
        <button class="btn btn-sm" onclick="exportCSV('gl-tbl','journals')"><i class="ti ti-download"></i>Export</button>
      </div>
    </div>
    <div style="display:flex;gap:8px;flex-wrap:wrap;margin-bottom:10px;padding:10px 12px;background:var(--bg);border-radius:var(--radius)">
      <input class="tbl-search" placeholder="Search ref, narration, type..." oninput="filterTable(this,'gl-tbl')" style="flex:1;min-width:160px">
      <select class="tbl-filter" id="gl-f-status" onchange="filterByCol('gl-tbl',7,this.value)">
        <option value="">All statuses</option><option>Posted</option><option>Draft</option>
      </select>
      <select class="tbl-filter" id="gl-f-type" onchange="filterByCol('gl-tbl',3,this.value)">
        <option value="">All types</option><option>Sales</option><option>Purchase</option><option>Payroll</option><option>General</option><option>Depreciation</option>
      </select>
      <input type="date" class="tbl-filter" id="gl-f-from" title="From date">
      <input type="date" class="tbl-filter" id="gl-f-to" title="To date">
      <button class="btn btn-sm" onclick="applyGLDateFilter()"><i class="ti ti-filter"></i>Apply</button>
      <button class="btn btn-sm" onclick="clearGLFilters()">Clear</button>
    </div>
    <div class="bulk-bar" id="gl-bar">
      <span id="gl-cnt" class="badge b-gray">0 selected</span>
      <button class="btn btn-sm" onclick="exportCSV('gl-tbl','journals')"><i class="ti ti-download"></i>Export</button>
      <button class="btn btn-sm" onclick="bulkReverseJournals()"><i class="ti ti-rotate-2"></i>Reverse posted</button>
      <button class="btn btn-sm btn-danger" onclick="bulkDeleteDraftJournals()"><i class="ti ti-trash"></i>Delete drafts</button>
    </div>
    <table id="gl-tbl">
      <tr>
        <th class="col-check"><input type="checkbox" id="gl-all" style="accent-color:var(--g500)" onchange="selectAllInTbl(this,'gl-cb')"></th>
        <th class="sortable" onclick="sortTable(this)">Journal ref</th>
        <th class="sortable" onclick="sortTable(this)">Date</th>
        <th class="sortable" onclick="sortTable(this)">Type</th>
        <th class="sortable" onclick="sortTable(this)">Narration</th>
        <th class="sortable" onclick="sortTable(this)" style="text-align:right">Debit (₦)</th>
        <th class="sortable" onclick="sortTable(this)" style="text-align:right">Credit (₦)</th>
        <th class="sortable" onclick="sortTable(this)">Status</th>
        <th>Actions</th>
      </tr>
      ${JOURNAL_LEDGER.map(j => {
        const totDr = j.lines.reduce((a,l)=>a+l.dr,0);
        const totCr = j.lines.reduce((a,l)=>a+l.cr,0);
        const fmt = n => n ? '₦'+n.toLocaleString() : '—';
        return `<tr data-ref="${j.ref}" data-status="${j.status}">
          <td class="col-check"><input type="checkbox" class="gl-cb" style="accent-color:var(--g500)" onchange="updateBulkBar('gl-tbl','gl-bar','gl-cnt','gl-cb','gl-all')"></td>
          <td class="td-bold" style="cursor:pointer;color:var(--g600)" onclick="viewJournalDetail('${j.ref}')">${j.ref}</td>
          <td>${j.date}</td>
          <td><span class="badge b-gray">${j.type}</span></td>
          <td style="max-width:220px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap" title="${j.narr}">${j.narr}</td>
          <td style="text-align:right;color:var(--g600)">${fmt(totDr)}</td>
          <td style="text-align:right;color:var(--r400)">${fmt(totCr)}</td>
          <td><span class="badge ${j.status==='Posted'?'b-green':'b-amber'}">${j.status}</span></td>
          <td class="action-col"><div class="action-menu"><button class="action-btn" onclick="toggleAction(this)">Actions <i class="ti ti-chevron-down" style="font-size:10px"></i></button>
            <div class="action-dropdown">
              <a onclick="viewJournalDetail('${j.ref}');return false"><i class="ti ti-eye" style="font-size:11px"></i> View detail</a>
              ${j.status==='Draft' ? `<a onclick="editJournal('${j.ref}');return false"><i class="ti ti-pencil" style="font-size:11px"></i> Edit draft</a>` : ''}
              ${j.status==='Posted' ? `<a onclick="reverseJournal('${j.ref}');return false"><i class="ti ti-rotate-2" style="font-size:11px"></i> Reverse</a>` : ''}
              ${j.status==='Draft' ? `<div class="sep"></div><a class="danger" onclick="deleteJournal('${j.ref}',this);return false"><i class="ti ti-trash" style="font-size:11px"></i> Delete</a>` : ''}
            </div></div></td>
        </tr>`;
      }).join('')}
    </table>
  </div>`;
  setupBulk('gl-tbl','gl-bar','gl-cnt','gl-cb','gl-all');
}

// ── ledger ──────────────────────────────────────
BUILDERS.ledger = function(panel) {
  panel.innerHTML = `
  <div class="card">
    <div class="card-hd"><span class="card-title">Account ledger</span>
      <div style="display:flex;gap:6px;flex-wrap:wrap;align-items:center">
        <select class="form-input" id="ledger-acct" style="width:220px" onchange="loadLedger()">
          <option value="1100">1100 — Bank accounts</option>
          <option value="1200">1200 — Accounts receivable</option>
          <option value="4000">4000 — Sales revenue</option>
          <option value="6000">6000 — Salaries & wages</option>
          <option value="2000">2000 — Accounts payable</option>
          <option value="2100">2100 — VAT payable</option>
        </select>
        <select class="form-input" id="ledger-period" style="width:130px">
          <option>Jun 2026</option><option>May 2026</option><option>Apr 2026</option>
        </select>
        <button class="btn btn-primary btn-sm" onclick="loadLedger()"><i class="ti ti-refresh"></i>Load</button>
        <button class="btn btn-sm" onclick="downloadLedgerPDF()"><i class="ti ti-download"></i>PDF</button>
        <button class="btn btn-sm" onclick="downloadLedgerExcel()"><i class="ti ti-file-spreadsheet"></i>Excel</button>
      </div>
    </div>
    <div id="ledger-summary" style="display:flex;gap:16px;padding:10px 14px;background:var(--bg);border-radius:8px;margin-bottom:12px;font-size:12px">
      <span>Opening: <strong>₦4,660,000</strong></span>
      <span>Total debits: <strong style="color:var(--g600)">₦1,125,375</strong></span>
      <span>Total credits: <strong style="color:var(--r400)">₦544,000</strong></span>
      <span>Closing: <strong>₦5,241,375</strong></span>
    </div>
    <table id="ledger-tbl">
      <tr><th>Date</th><th class="sortable" onclick="sortTable(this)">Journal ref</th><th>Type</th><th>Narration</th><th style="text-align:right">Debit (₦)</th><th style="text-align:right">Credit (₦)</th><th style="text-align:right">Balance (₦)</th></tr>
      <tr><td>01 Jun</td><td class="td-bold" style="cursor:pointer;color:var(--g600)" onclick="jumpToJournal('JNL-2026-0091')">JNL-2026-0091</td><td><span class="badge b-gray">Opening</span></td><td>Opening balance</td><td style="text-align:right">—</td><td style="text-align:right">—</td><td style="text-align:right;font-weight:600">4,660,000</td></tr>
      <tr><td>10 Jun</td><td class="td-bold" style="cursor:pointer;color:var(--g600)" onclick="jumpToJournal('JNL-2026-0092')">JNL-2026-0092</td><td><span class="badge b-gray">Sales</span></td><td>Invoice INV-0039 — Lagos State</td><td style="text-align:right;color:var(--g600)">850,000</td><td style="text-align:right">—</td><td style="text-align:right;font-weight:600">5,510,000</td></tr>
      <tr><td>15 Jun</td><td class="td-bold" style="cursor:pointer;color:var(--g600)" onclick="jumpToJournal('JNL-2026-0093')">JNL-2026-0093</td><td><span class="badge b-gray">Payment</span></td><td>Bill payment — Conoil Nigeria</td><td style="text-align:right">—</td><td style="text-align:right;color:var(--r400)">245,000</td><td style="text-align:right;font-weight:600">5,265,000</td></tr>
      <tr><td>20 Jun</td><td class="td-bold" style="cursor:pointer;color:var(--g600)" onclick="jumpToJournal('JNL-2026-0094')">JNL-2026-0094</td><td><span class="badge b-gray">Sales</span></td><td>Invoice INV-0040 — MTN Nigeria</td><td style="text-align:right;color:var(--g600)">247,250</td><td style="text-align:right">—</td><td style="text-align:right;font-weight:600">5,512,250</td></tr>
      <tr><td>21 Jun</td><td class="td-bold" style="cursor:pointer;color:var(--g600)" onclick="jumpToJournal('JNL-2026-0091')">JNL-2026-0091</td><td><span class="badge b-gray">Payroll</span></td><td>June payroll disbursement</td><td style="text-align:right">—</td><td style="text-align:right;color:var(--r400)">299,000</td><td style="text-align:right;font-weight:600">5,213,250</td></tr>
      <tr><td>23 Jun</td><td class="td-bold" style="cursor:pointer;color:var(--g600)" onclick="jumpToJournal('JNL-2026-0094')">JNL-2026-0094</td><td><span class="badge b-gray">Sales</span></td><td>Invoice INV-0041 — Dangote Foods</td><td style="text-align:right;color:var(--g600)">28,125</td><td style="text-align:right">—</td><td style="text-align:right;font-weight:600">5,241,375</td></tr>
    </table>
  </div>`;
}

// ── trial ──────────────────────────────────────
BUILDERS.trial = function(panel) { rebuildTrialBalance(); }

// ── pnl ──────────────────────────────────────
BUILDERS.pnl   = function(panel) { rebuildPnL(); }

// ── balancesheet ──────────────────────────────────────
BUILDERS.balancesheet = function(panel) {
  rebuildBalanceSheet();
}

// ── cashflow ──────────────────────────────────────
BUILDERS.cashflow = function(panel) { rebuildCashFlow(); }

// ── budget ──────────────────────────────────────
BUILDERS.budget = function(panel) {
  const fmt = n => '₦' + n.toLocaleString();
  const totalBudget = BUDGET_DATA.reduce((a,r)=>a+r.h1, 0);
  const totalActual = BUDGET_DATA.reduce((a,r)=>a+r.actual, 0);
  const totalVar    = totalBudget - totalActual;

  panel.innerHTML = `
  <div class="kpi-strip">
    <div class="kpi-card"><div class="kpi-label">Total budget (H1)</div><div class="kpi-value">${fmt(totalBudget)}</div></div>
    <div class="kpi-card"><div class="kpi-label">Actual spend</div><div class="kpi-value" style="color:var(--amber-700)">${fmt(totalActual)}</div></div>
    <div class="kpi-card"><div class="kpi-label">Variance</div><div class="kpi-value" style="color:${totalVar>=0?'var(--green-700)':'var(--red-600)'}">${totalVar>=0?'+':''}${fmt(totalVar)}</div><div class="kpi-sub">${totalVar>=0?'Under budget':'Over budget'}</div></div>
    <div class="kpi-card"><div class="kpi-label">Budget utilisation</div><div class="kpi-value">${Math.round(totalActual/totalBudget*100)}%</div></div>
  </div>
  <div class="card">
    <div class="card-hd"><span class="card-title">Budget vs actual — H1 2026</span>
      <div style="display:flex;gap:6px">
        <button class="btn btn-primary btn-sm" onclick="openNewBudget()"><i class="ti ti-plus"></i>New budget</button>
        <button class="btn btn-sm" onclick="downloadTableAsExcel('budget-tbl','budget-variance')"><i class="ti ti-download"></i>Export</button>
      </div>
    </div>
    <table id="budget-tbl">
      <tr>
        <th class="sortable" onclick="sortTable(this)">Category</th>
        <th class="sortable" onclick="sortTable(this)">GL</th>
        <th class="sortable" onclick="sortTable(this)" style="text-align:right">Budget (₦)</th>
        <th class="sortable" onclick="sortTable(this)" style="text-align:right">Actual (₦)</th>
        <th class="sortable" onclick="sortTable(this)" style="text-align:right">Variance (₦)</th>
        <th class="sortable" onclick="sortTable(this)">Utilisation</th>
        <th class="sortable" onclick="sortTable(this)">Status</th>
        <th>Actions</th>
      </tr>
      ${BUDGET_DATA.map(r => {
        const variance = r.h1 - r.actual;
        const pct      = r.h1 > 0 ? Math.round(r.actual / r.h1 * 100) : 0;
        const over     = pct > 100;
        const warn     = pct > 85 && !over;
        return `<tr>
          <td class="td-bold">${r.cat}</td>
          <td class="td-mono" style="font-size:11px;color:var(--text-tertiary)">${r.gl}</td>
          <td style="text-align:right;font-variant-numeric:tabular-nums">${fmt(r.h1)}</td>
          <td style="text-align:right;font-variant-numeric:tabular-nums">${fmt(r.actual)}</td>
          <td style="text-align:right;font-weight:600;font-variant-numeric:tabular-nums;color:${variance<0?'var(--red-600)':'var(--green-700)'}">
            ${variance>=0?'+':''}${fmt(variance)}</td>
          <td style="min-width:120px">
            <div style="display:flex;align-items:center;gap:8px">
              <div style="flex:1;height:5px;background:var(--zinc-100);border-radius:3px">
                <div style="height:5px;border-radius:3px;width:${Math.min(pct,100)}%;background:${over?'var(--red-500)':warn?'var(--amber-500)':'var(--green-600)'}"></div>
              </div>
              <span style="font-size:11px;font-weight:600;min-width:32px">${pct}%</span>
            </div>
          </td>
          <td><span class="badge ${over?'b-red':warn?'b-amber':'b-green'}">${over?'Over budget':warn?'Near limit':'On track'}</span></td>
          <td class="action-col"><div class="action-menu"><button class="action-btn" onclick="toggleAction(this)">Actions <i class="ti ti-chevron-down" style="font-size:10px"></i></button>
            <div class="action-dropdown">
              <a onclick="toast('Editing budget for ${r.cat}');return false"><i class="ti ti-pencil"></i>Edit budget</a>
              <a onclick="toast('Drill-down for ${r.cat}');return false"><i class="ti ti-zoom-in"></i>View drill-down</a>
              <a onclick="nav(document.querySelector('[onclick*=\\'gl\\']'),\\'gl\\');return false"><i class="ti ti-notebook"></i>View journals</a>
            </div></div></td>
        </tr>`;
      }).join('')}
      <tr style="background:var(--zinc-50);border-top:2px solid var(--border);font-weight:700">
        <td colspan="2">TOTAL</td>
        <td style="text-align:right;font-variant-numeric:tabular-nums">${fmt(totalBudget)}</td>
        <td style="text-align:right;font-variant-numeric:tabular-nums">${fmt(totalActual)}</td>
        <td style="text-align:right;font-weight:700;font-variant-numeric:tabular-nums;color:${totalVar<0?'var(--red-600)':'var(--green-700)'}">
          ${totalVar>=0?'+':''}${fmt(totalVar)}</td>
        <td colspan="3"></td>
      </tr>
    </table>
  </div>`;
}

// ── revrec ──────────────────────────────────────
BUILDERS.revrec = function(panel) {
  panel.innerHTML = `
  <div class="card">
    <div class="card-hd"><span class="card-title">Revenue recognition schedules</span>
      <div style="display:flex;gap:6px;flex-wrap:wrap;align-items:center">
        <input class="tbl-search" placeholder="Search contracts..." oninput="filterTable(this,'rr-tbl')">
        <select class="tbl-filter" onchange="filterByStatus(this,'rr-tbl',5)"><option value="">All statuses</option><option>Active</option><option>Draft</option><option>Complete</option></select>
        <button class="btn btn-primary btn-sm" onclick="openModal('modal-revrec')"><i class="ti ti-plus"></i>New schedule</button>
        <button class="btn btn-sm" onclick="exportCSV('rr-tbl','revrec')"><i class="ti ti-download"></i>Export</button>
      </div>
    </div>
    <div class="bulk-bar" id="rr-bar"><span id="rr-cnt" class="badge b-gray">0 selected</span><button class="btn btn-sm btn-primary" onclick="toast('Schedules activated')">Activate</button><button class="btn btn-sm btn-danger" onclick="toast('Schedules deleted')">Delete</button></div>
    <table id="rr-tbl">
      <tr><th class="col-check"><input type="checkbox" id="rr-all" style="accent-color:var(--g500)"></th><th class="sortable" onclick="sortTable(this)">Contract name</th><th class="sortable" onclick="sortTable(this)">Client</th><th class="sortable" onclick="sortTable(this)" style="text-align:right">Total value (₦)</th><th class="sortable" onclick="sortTable(this)" style="text-align:right">Recognised (₦)</th><th class="sortable" onclick="sortTable(this)">End date</th><th class="sortable" onclick="sortTable(this)">Status</th><th>Actions</th></tr>
      <tr><td class="col-check"><input type="checkbox" class="rr-cb" style="accent-color:var(--g500)"></td><td class="td-bold">ERP Implementation</td><td>Nestlé Nigeria</td><td style="text-align:right">₦12,000,000</td><td style="text-align:right;color:var(--g600)">₦4,000,000</td><td>31 Dec 2026</td><td><span class="badge b-green">Active</span></td><td class="action-col"><div class="action-menu"><button class="action-btn" onclick="toggleAction(this)">Actions <i class="ti ti-chevron-down" style="font-size:10px"></i></button><div class="action-dropdown"><a onclick="toast('Viewing schedule');return false">View schedule</a><a onclick="toast('Editing contract');return false">Edit</a><a onclick="toast('Journals posted');return false">Post journals</a><div class="sep"></div><a class="danger" onclick="warnDelete('contract',()=>{this.closest('tr').remove()});return false">Delete</a></div></div></td></tr>
      <tr><td class="col-check"><input type="checkbox" class="rr-cb" style="accent-color:var(--g500)"></td><td class="td-bold">Annual support contract</td><td>Dangote Foods</td><td style="text-align:right">₦3,600,000</td><td style="text-align:right;color:var(--g600)">₦1,800,000</td><td>30 Jun 2026</td><td><span class="badge b-amber">Draft</span></td><td class="action-col"><div class="action-menu"><button class="action-btn" onclick="toggleAction(this)">Actions <i class="ti ti-chevron-down" style="font-size:10px"></i></button><div class="action-dropdown"><a onclick="toast('Viewing schedule');return false">View schedule</a><a onclick="toast('Activating schedule');return false">Activate</a><div class="sep"></div><a class="danger" onclick="warnDelete('contract',()=>{this.closest('tr').remove()});return false">Delete</a></div></div></td></tr>
    </table>
  </div>`;
  setupBulk('rr-tbl','rr-bar','rr-cnt','rr-cb','rr-all');
}

// ── yearend ──────────────────────────────────────
BUILDERS.yearend = function(panel) {
  panel.innerHTML = `
  <div class="grid-2">
    <div>
      <div class="card">
        <div class="card-hd">
          <span class="card-title">Financial years</span>
          <button class="btn btn-primary btn-sm" onclick="openCreateFinYear()"><i class="ti ti-plus"></i>Create financial year</button>
        </div>
        <div id="fin-years-list">
          ${[
            {yr:'FY 2026',period:'01 Jan 2026 – 31 Dec 2026',status:'Open',current:true},
            {yr:'FY 2025',period:'01 Jan 2025 – 31 Dec 2025',status:'Closed',current:false},
            {yr:'FY 2024',period:'01 Jan 2024 – 31 Dec 2024',status:'Closed',current:false},
          ].map(fy => `<div style="display:flex;align-items:center;justify-content:space-between;padding:12px 14px;background:${fy.current?'var(--g50)':'var(--bg)'};border-radius:8px;margin-bottom:8px;border:${fy.current?'1px solid var(--g200)':'1px solid transparent'}">
            <div>
              <div style="font-weight:700;font-size:13px">${fy.yr} ${fy.current?'<span style="color:var(--g600)">← Current</span>':''}</div>
              <div style="font-size:11px;color:var(--t400)">${fy.period}</div>
            </div>
            <div style="display:flex;align-items:center;gap:8px">
              <span class="badge ${fy.status==='Open'?'b-green':'b-gray'}">${fy.status}</span>
              ${fy.status==='Open'?`<button class="btn btn-sm" onclick="closeFinancialYear('${fy.yr}')"><i class="ti ti-lock"></i>Close year</button>`:''}
            </div>
          </div>`).join('')}
        </div>
      </div>
    </div>
    <div>
      <div class="card">
        <div class="card-hd"><span class="card-title">Year-end checklist — FY 2026</span></div>
        <div style="display:flex;flex-direction:column;gap:8px" id="yearend-checklist">
          ${[
            ['Bank reconciliation complete','Complete','b-green'],
            ['All invoices posted','Complete','b-green'],
            ['VAT return filed with FIRS','Complete','b-green'],
            ['Payroll reconciliation','Pending','b-amber'],
            ['Fixed asset depreciation run','Complete','b-green'],
            ['Management accounts reviewed','Pending','b-amber'],
            ['P&L signed off','Pending','b-amber'],
            ['Audit adjustments posted','Pending','b-gray'],
          ].map(([step,status,badge],i) => `<div style="display:flex;align-items:center;justify-content:space-between;padding:10px 14px;background:var(--bg);border-radius:8px">
            <div style="display:flex;align-items:center;gap:8px">
              <input type="checkbox" style="accent-color:var(--g500)" ${status==='Complete'?'checked':''} id="yec-${i}" onchange="checkYearEndProgress()">
              <label for="yec-${i}" style="font-size:13px;cursor:pointer">${step}</label>
            </div>
            <span class="badge ${badge}" id="yec-badge-${i}">${status}</span>
          </div>`).join('')}
        </div>
        <div style="margin-top:12px;padding:10px;background:var(--bg);border-radius:8px">
          <div style="font-size:12px;color:var(--t500);margin-bottom:6px">Progress</div>
          <div style="height:8px;background:var(--border);border-radius:4px"><div id="yearend-progress-bar" style="height:8px;background:var(--g400);border-radius:4px;width:37%;transition:width .4s"></div></div>
          <div style="font-size:11px;color:var(--t400);margin-top:4px" id="yearend-progress-text">3 of 8 steps complete</div>
        </div>
        <button class="btn btn-primary" style="width:100%;margin-top:12px;justify-content:center" onclick="closeFinancialYear('FY 2026')"><i class="ti ti-lock"></i>Close FY 2026</button>
      </div>
    </div>
  </div>`;
  checkYearEndProgress();
}

// ── health ──────────────────────────────────────
BUILDERS.health = function(panel) {
  const ca  = (GL_ACCOUNTS['1000']?.balance||0) + (GL_ACCOUNTS['1100']?.balance||0) +
              (GL_ACCOUNTS['1200']?.balance||0) + (GL_ACCOUNTS['1300']?.balance||0) + (GL_ACCOUNTS['1500']?.balance||0);
  const cl  = Math.abs((GL_ACCOUNTS['2000']?.balance||0)) + Math.abs((GL_ACCOUNTS['2100']?.balance||0)) +
              Math.abs((GL_ACCOUNTS['2200']?.balance||0)) + Math.abs((GL_ACCOUNTS['2300']?.balance||0));
  const rev = Math.abs(GL_ACCOUNTS['4000']?.balance||0) + Math.abs(GL_ACCOUNTS['4200']?.balance||0);
  const cogs= GL_ACCOUNTS['5000']?.balance||0;
  const totAssets = (GL_ACCOUNTS['1800']?.balance||0) + (GL_ACCOUNTS['1810']?.balance||0) + ca;
  const totLiab   = cl;
  const cash      = (GL_ACCOUNTS['1000']?.balance||0) + (GL_ACCOUNTS['1100']?.balance||0);
  const ar        = GL_ACCOUNTS['1200']?.balance||0;

  const currentRatio = cl > 0 ? (ca/cl).toFixed(2) : '∞';
  const grossMarginPct = rev > 0 ? ((rev-cogs)/rev*100).toFixed(1) : '0';
  const dso = rev > 0 ? Math.round(ar/(rev/180)) : 0;  // days sales outstanding (6-month)
  const debtToEquity = (totLiab / (totAssets - totLiab + 0.01)).toFixed(3);

  const metric = (label, value, sub, color, status) => `
    <div class="kpi-card">
      <div class="kpi-label">${label}</div>
      <div class="kpi-value" style="color:${color}">${value}</div>
      <div class="kpi-sub">${sub}</div>
      <span class="badge ${status==='good'?'b-green':status==='warn'?'b-amber':'b-red'}" style="margin-top:6px;font-size:10px">${status==='good'?'Healthy':status==='warn'?'Watch':'Risk'}</span>
    </div>`;

  panel.innerHTML = `
  <div class="kpi-strip">
    ${metric('Current ratio', currentRatio + 'x', 'Current assets ÷ current liabilities', parseFloat(currentRatio)>=2?'var(--green-700)':parseFloat(currentRatio)>=1?'var(--amber-700)':'var(--red-600)', parseFloat(currentRatio)>=2?'good':parseFloat(currentRatio)>=1?'warn':'bad')}
    ${metric('Gross margin', grossMarginPct + '%', 'Revenue − COGS ÷ Revenue', parseFloat(grossMarginPct)>=40?'var(--green-700)':parseFloat(grossMarginPct)>=20?'var(--amber-700)':'var(--red-600)', parseFloat(grossMarginPct)>=40?'good':parseFloat(grossMarginPct)>=20?'warn':'bad')}
    ${metric('DSO', dso + ' days', 'Days sales outstanding', dso<=30?'var(--green-700)':dso<=60?'var(--amber-700)':'var(--red-600)', dso<=30?'good':dso<=60?'warn':'bad')}
    ${metric('Debt to equity', debtToEquity, 'Total liabilities ÷ equity', parseFloat(debtToEquity)<=0.5?'var(--green-700)':parseFloat(debtToEquity)<=1?'var(--amber-700)':'var(--red-600)', parseFloat(debtToEquity)<=0.5?'good':parseFloat(debtToEquity)<=1?'warn':'bad')}
    ${metric('Cash & bank', '₦'+(cash/1000000).toFixed(2)+'M', 'Immediate liquidity', cash>2000000?'var(--green-700)':cash>500000?'var(--amber-700)':'var(--red-600)', cash>2000000?'good':cash>500000?'warn':'bad')}
  </div>
  <div class="grid-2">
    <div class="card">
      <div class="card-hd"><span class="card-title">Health insights</span></div>
      ${[
        ['Liquidity',     parseFloat(currentRatio)>=2, `Current ratio ${currentRatio}x — well above the 2x minimum threshold. Short-term obligations are covered.`],
        ['Profitability', false, `Operating at a net loss of ₦${(2037500/1000000).toFixed(2)}M YTD. Revenue growing 22% but expenses tracking ahead. Watch salary line.`],
        ['Collections',  dso<=30, `DSO ${dso} days${dso<=30?' — within target (<30 days). Collections are healthy.':' — above 30-day target. Follow up on overdue invoices.'}`],
        ['Leverage',     parseFloat(debtToEquity)<=0.5, `Debt-to-equity ${debtToEquity} — business is primarily equity-funded. Low financial risk.`],
        ['Cash runway',  cash>3000000, `Cash balance ₦${(cash/1000000).toFixed(2)}M. At current burn rate (~₦1.1M/month), runway is approximately ${Math.round(cash/1100000)} months.`],
      ].map(([cat, isGood, insight]) => `
      <div style="display:flex;gap:12px;align-items:flex-start;padding:10px 12px;background:var(--zinc-50);border-radius:var(--r-md);margin-bottom:8px">
        <div style="width:28px;height:28px;border-radius:6px;background:${isGood?'var(--green-50)':'var(--amber-50)'};border:1px solid ${isGood?'var(--green-200)':'var(--amber-200)'};display:flex;align-items:center;justify-content:center;flex-shrink:0">
          <i class="ti ${isGood?'ti-check':'ti-alert-circle'}" style="font-size:14px;color:${isGood?'var(--green-700)':'var(--amber-700)'}"></i>
        </div>
        <div>
          <div style="font-weight:600;font-size:12.5px;margin-bottom:2px">${cat}</div>
          <div style="font-size:12px;color:var(--text-secondary);line-height:1.5">${insight}</div>
        </div>
      </div>`).join('')}
    </div>
    <div class="card">
      <div class="card-hd"><span class="card-title">6-month trend (Jan–Jun 2026)</span></div>
      ${[
        ['Jan','₦3.2M','₦3.8M'],['Feb','₦3.5M','₦4.1M'],['Mar','₦3.8M','₦4.3M'],
        ['Apr','₦4.0M','₦4.2M'],['May','₦4.1M','₦4.4M'],['Jun','₦4.3M','₦4.8M']
      ].map(([month, rev, exp]) => `
      <div style="display:flex;align-items:center;gap:10px;padding:7px 0;border-bottom:1px solid var(--zinc-50);font-size:12.5px">
        <span style="width:30px;color:var(--text-tertiary);font-size:11px">${month}</span>
        <div style="flex:1">
          <div style="display:flex;justify-content:space-between;margin-bottom:3px">
            <span style="font-size:11px;color:var(--green-700)">Revenue ${rev}</span>
            <span style="font-size:11px;color:var(--red-600)">Expenses ${exp}</span>
          </div>
          <div style="height:4px;background:var(--zinc-100);border-radius:2px">
            <div style="height:4px;border-radius:2px;width:${parseInt(rev)/5*100}%;background:var(--green-500)"></div>
          </div>
        </div>
      </div>`).join('')}
    </div>
  </div>`;
}

// ── reports ──────────────────────────────────────
BUILDERS.reports = function(panel) {
  panel.innerHTML = `
  <div class="grid-3" style="margin-bottom:16px">
    ${[
      {icon:'ti-trending-up',  badge:'b-green', title:'Profit & Loss',          sub:'Jan–Jun 2026',  id:'pnl',         val:'₦(1.99M) net', nav_id:'pnl'},
      {icon:'ti-building-bank',badge:'b-blue',  title:'Balance Sheet',          sub:'30 Jun 2026',   id:'bs',          val:'₦38M assets',  nav_id:'balancesheet'},
      {icon:'ti-calculator',   badge:'b-gray',  title:'Trial Balance',          sub:'Jun 2026',      id:'tb',          val:'Balanced ✓',   nav_id:'trial'},
      {icon:'ti-cash',         badge:'b-teal',  title:'Cash Flow Statement',    sub:'Jan–Jun 2026',  id:'cf',          val:'₦5.2M closing',nav_id:'cashflow'},
      {icon:'ti-users',        badge:'b-amber', title:'Aged Receivables',       sub:'As at 23 Jun',  id:'aged',        val:'₦1.9M due',    nav_id:'reports'},
      {icon:'ti-receipt-tax',  badge:'b-red',   title:'VAT Return (FIRS)',      sub:'Jun 2026',      id:'vat',         val:'₦142K payable',nav_id:'reports'},
    ].map(r=>`
    <div class="card" style="cursor:pointer" onclick="nav(document.querySelector('[onclick*=\\'${r.nav_id}\\']'),'${r.nav_id}')">
      <div style="display:flex;align-items:center;gap:10px;margin-bottom:8px">
        <div style="width:42px;height:42px;border-radius:10px;background:var(--bg);display:flex;align-items:center;justify-content:center;flex-shrink:0">
          <i class="ti ${r.icon}" style="font-size:22px;color:var(--t400)"></i>
        </div>
        <div>
          <div style="font-weight:700;font-size:13px">${r.title}</div>
          <div style="font-size:11px;color:var(--t400)">${r.sub}</div>
        </div>
      </div>
      <div style="font-size:20px;font-weight:800;color:var(--t800);margin:8px 0">${r.val}</div>
      <div style="display:flex;gap:6px">
        <button class="btn btn-primary btn-sm" style="flex:1;justify-content:center" onclick="event.stopPropagation();nav(document.querySelector('[onclick*=\\'${r.nav_id}\\']'),'${r.nav_id}')"><i class="ti ti-eye"></i>Open</button>
        <button class="btn btn-sm" onclick="event.stopPropagation();toast('Downloading ${r.title} PDF')"><i class="ti ti-download"></i>PDF</button>
      </div>
    </div>`).join('')}
  </div>

  <div class="card">
    <div class="card-hd"><span class="card-title">Quick financial summary — June 2026 YTD</span><button class="btn btn-sm" onclick="toast('Exporting full management pack')"><i class="ti ti-file-spreadsheet"></i>Management pack</button></div>
    <div class="grid-3">
      ${[
        ['Revenue','₦24.3M','color:var(--g600)'],
        ['Gross profit','₦13.9M','color:var(--g600)'],
        ['Net loss','(₦1.99M)','color:var(--r400)'],
        ['Total assets','₦38M','color:var(--b600)'],
        ['Cash at bank','₦5.2M','color:var(--g600)'],
        ['Accounts receivable','₦2.2M','color:var(--a600)'],
      ].map(([label,val,style])=>`
      <div style="padding:12px;background:var(--bg);border-radius:8px;text-align:center">
        <div style="font-size:11px;color:var(--t400);margin-bottom:4px">${label}</div>
        <div style="font-size:18px;font-weight:800;${style}">${val}</div>
      </div>`).join('')}
    </div>
  </div>`;
}

// ── assets ──────────────────────────────────────
BUILDERS.assets = function(panel) {
  panel.innerHTML = `<div class="card"><div class="card-hd"><span class="card-title">Fixed assets register</span>
    <div style="display:flex;gap:6px;flex-wrap:wrap">
      <button class="btn btn-primary btn-sm" onclick="openNewAsset()"><i class="ti ti-plus"></i>Add asset</button>
      <button class="btn btn-sm" onclick="downloadTableAsExcel('ast-tbl','fixed-assets')"><i class="ti ti-download"></i>Export</button>
    </div></div>
    <div style="display:flex;gap:8px;flex-wrap:wrap;margin-bottom:10px;padding:10px 12px;background:var(--bg);border-radius:var(--radius)">
      <input class="tbl-search" placeholder="Search ref, name, category..." oninput="filterTable(this,'ast-tbl')" style="flex:1;min-width:160px">
      <select class="tbl-filter" onchange="filterByCol('ast-tbl',3,this.value)">
        <option value="">All categories</option>${PICKLISTS.assetCats.map(a=>`<option>${a.name}</option>`).join('')}
      </select>
      <select class="tbl-filter" onchange="filterByCol('ast-tbl',8,this.value)">
        <option value="">All statuses</option>${PICKLISTS.assetStatuses.map(s=>`<option>${s}</option>`).join('')}
      </select>
      <button class="btn btn-sm" onclick="clearTableFilters('ast-tbl','p-assets')">Clear</button>
    </div>
    <div class="bulk-bar" id="ast-bar"><span id="ast-cnt" class="badge b-gray">0 selected</span>
      <button class="btn btn-sm" onclick="toast('Depreciation run complete')">Run depreciation</button>
      <button class="btn btn-sm btn-danger" onclick="bulkDeleteChecked('ast-tbl','ast-cb','ast-bar',()=>toast('Assets disposed'))">Dispose</button>
    </div>
    <table id="ast-tbl">
      <tr><th class="col-check"><input type="checkbox" id="ast-all" style="accent-color:var(--g500)" onchange="selectAllInTbl(this,'ast-cb')"></th>
        <th class="sortable" onclick="sortTable(this)">Asset ref</th><th class="sortable" onclick="sortTable(this)">Name</th>
        <th class="sortable" onclick="sortTable(this)">Category</th>
        <th class="sortable" onclick="sortTable(this)" style="text-align:right">Cost (₦)</th>
        <th class="sortable" onclick="sortTable(this)" style="text-align:right">NBV (₦)</th>
        <th class="sortable" onclick="sortTable(this)">Dep. rate</th>
        <th class="sortable" onclick="sortTable(this)">Method</th>
        <th class="sortable" onclick="sortTable(this)">Status</th>
        <th>Actions</th></tr>
      ${[
        {ref:'AST-001',name:'Office servers x3',cat:'IT equipment',cost:'4,500,000',nbv:'3,375,000'},
        {ref:'AST-002',name:'Toyota Hilux (2023)',cat:'Motor vehicles',cost:'12,800,000',nbv:'9,600,000'},
        {ref:'AST-003',name:'Office furniture',cat:'Furniture & fittings',cost:'1,200,000',nbv:'960,000'},
        {ref:'AST-004',name:'Perkins generator',cat:'Plant & machinery',cost:'7,800,000',nbv:'6,825,000'},
      ].map(a => {
        const pl = PICKLISTS.assetCats.find(x=>x.name===a.cat)||{depRate:10,depMethod:'Straight-line'};
        return `<tr><td class="col-check"><input type="checkbox" class="ast-cb" style="accent-color:var(--g500)" onchange="updateBulkBar('ast-tbl','ast-bar','ast-cnt','ast-cb','ast-all')"></td>
          <td class="td-bold" style="cursor:pointer;color:var(--g600)">${a.ref}</td>
          <td style="font-weight:600">${a.name}</td><td><span class="badge b-gray">${a.cat}</span></td>
          <td style="text-align:right">₦${a.cost}</td>
          <td style="text-align:right;color:var(--g600);font-weight:600">₦${a.nbv}</td>
          <td style="text-align:center;font-weight:600;color:var(--b600)">${pl.depRate}%</td>
          <td style="font-size:11px">${pl.depMethod}</td>
          <td><span class="badge b-green">In use</span></td>
          <td class="action-col"><div class="action-menu"><button class="action-btn" onclick="toggleAction(this)">Actions <i class="ti ti-chevron-down" style="font-size:10px"></i></button>
            <div class="action-dropdown">
              <a onclick="toast('Viewing ${a.ref}');return false"><i class="ti ti-eye" style="font-size:11px"></i> View</a>
              <a onclick="toast('Running depreciation for ${a.ref}');return false"><i class="ti ti-trending-down" style="font-size:11px"></i> Run depreciation</a>
              <div class="sep"></div>
              <a class="danger" onclick="warnDelete('${a.ref}','account',()=>{this.closest('tr').remove()});return false"><i class="ti ti-trash" style="font-size:11px"></i> Dispose</a>
            </div></div></td>
        </tr>`;
      }).join('')}
    </table></div>`;
  setupBulk('ast-tbl','ast-bar','ast-cnt','ast-cb','ast-all');
}

// ── expenses ──────────────────────────────────────
BUILDERS.expenses = function(panel) {
  panel.innerHTML = `
  <div class="kpi-strip">
    <div class="kpi-card"><div class="kpi-label">Pending approval</div><div class="kpi-value" style="color:var(--a600)" id="exp-pending">2</div></div>
    <div class="kpi-card"><div class="kpi-label">Approved (Jun)</div><div class="kpi-value" style="color:var(--g600)">3</div></div>
    <div class="kpi-card"><div class="kpi-label">Paid (Jun)</div><div class="kpi-value" style="color:var(--b600)">2</div></div>
    <div class="kpi-card"><div class="kpi-label">Total value (Jun)</div><div class="kpi-value">₦214K</div></div>
  </div>
  <div class="card">
    <div class="card-hd">
      <span class="card-title">Expense claims</span>
      <div style="display:flex;gap:6px;flex-wrap:wrap;align-items:center">
        <input class="tbl-search" placeholder="Search claims..." oninput="filterTable(this,'exp-tbl')">
        <select class="tbl-filter" onchange="filterByStatus(this,'exp-tbl',4)"><option value="">All statuses</option><option>Pending</option><option>Approved</option><option>Paid</option><option>Rejected</option></select>
        <button class="btn btn-primary btn-sm" onclick="toast('New expense claim form')"><i class="ti ti-plus"></i>New claim</button>
        <button class="btn btn-sm" onclick="exportCSV('exp-tbl','expenses')"><i class="ti ti-download"></i>Export</button>
      </div>
    </div>
    <div class="bulk-bar" id="exp-bar"><span id="exp-cnt" class="badge b-gray">0 selected</span><button class="btn btn-sm btn-primary" onclick="bulkExpApprove()"><i class="ti ti-circle-check"></i>Approve all</button><button class="btn btn-sm" onclick="bulkExpPay()"><i class="ti ti-cash"></i>Mark paid</button><button class="btn btn-sm btn-danger" onclick="bulkExpReject()"><i class="ti ti-x"></i>Reject</button></div>
    <table id="exp-tbl">
      <tr><th class="col-check"><input type="checkbox" id="exp-all" style="accent-color:var(--g500)"></th><th class="sortable" onclick="sortTable(this)">Ref</th><th class="sortable" onclick="sortTable(this)">Employee</th><th class="sortable" onclick="sortTable(this)">Category</th><th class="sortable" onclick="sortTable(this)">Status</th><th class="sortable" onclick="sortTable(this)">Date</th><th class="sortable" onclick="sortTable(this)" style="text-align:right">Amount (₦)</th><th>Actions</th></tr>
      ${[
        ['EXP-0029','Babatunde Adeyemi','Travel','Pending','23 Jun 2026','45,000'],
        ['EXP-0028','Amaka Nwosu','Client entertainment','Pending','20 Jun 2026','32,500'],
        ['EXP-0027','Kelechi Okonkwo','IT & software','Approved','18 Jun 2026','18,200'],
        ['EXP-0026','Funmi Adeola','Training','Approved','15 Jun 2026','55,000'],
        ['EXP-0025','Chukwuemeka Obi','Travel','Paid','10 Jun 2026','38,000'],
        ['EXP-0024','Babatunde Adeyemi','Office supplies','Paid','05 Jun 2026','25,700'],
      ].map(([ref,emp,cat,status,date,amt]) => {
        const sc = {Pending:'b-amber',Approved:'b-green',Paid:'b-blue',Rejected:'b-red'}[status]||'b-gray';
        return `<tr data-status="${status}"><td class="col-check"><input type="checkbox" class="exp-cb" style="accent-color:var(--g500)"></td><td class="td-bold" style="cursor:pointer;color:var(--g600)" onclick="toast('Viewing ${ref}')">${ref}</td><td>${emp}</td><td><span class="badge b-gray">${cat}</span></td><td><span class="badge ${sc}">${status}</span></td><td>${date}</td><td style="text-align:right;font-weight:600">₦${amt}</td><td class="action-col"><div class="action-menu"><button class="action-btn" onclick="toggleAction(this)">Actions <i class="ti ti-chevron-down" style="font-size:10px"></i></button><div class="action-dropdown">${status==='Pending'?`<a onclick="approveExp(this);return false">Approve</a><a onclick="rejectExp(this);return false">Reject</a><div class=sep></div>`:''}${status==='Approved'?`<a onclick="payExp(this);return false">Mark paid</a><div class=sep></div>`:''}<a onclick="toast('Downloading receipt');return false">Download receipt</a><div class="sep"></div><a class="danger" onclick="warnDelete('${ref}',()=>{this.closest('tr').remove()});return false">Delete</a></div></div></td></tr>`;
      }).join('')}
    </table>
  </div>`;
  setupBulk('exp-tbl','exp-bar','exp-cnt','exp-cb','exp-all');
}
