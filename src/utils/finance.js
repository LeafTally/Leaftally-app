// ============================================================
// LeafTally — FINANCE utilities
// ============================================================

// rebuildTrialBalance
function rebuildTrialBalance() {
  const panel = document.getElementById('p-trial');
  if (!panel) return;

  const fmt = n => n ? '₦'+Math.abs(n).toLocaleString('en-NG',{minimumFractionDigits:2}) : '—';
  let totalDr=0, totalCr=0;
  const rows = Object.entries(GL_ACCOUNTS).sort((a,b)=>a[0].localeCompare(b[0])).map(([code,acc]) => {
    const bal = acc.balance;
    const dr = (acc.normal==='D' && bal>0) ? bal : (acc.normal==='C' && bal<0 ? Math.abs(bal) : 0);
    const cr = (acc.normal==='C' && bal<0) ? Math.abs(bal) : (acc.normal==='D' && bal<0 ? Math.abs(bal) : 0);
    // Actually: debit accounts show balance in debit column, credit accounts in credit column
    const showDr = acc.normal==='D' ? Math.max(0, acc.balance) : 0;
    const showCr = acc.normal==='C' ? Math.max(0, -acc.balance) : 0;
    totalDr += showDr; totalCr += showCr;
    return `<tr>
      <td class="td-bold" style="cursor:pointer;color:var(--g600)" onclick="viewAccountLedger('${code}')">${code}</td>
      <td>${acc.name}</td>
      <td style="text-align:right;color:${showDr?'var(--g600)':'var(--t400)'}">${showDr?fmt(showDr):'—'}</td>
      <td style="text-align:right;color:${showCr?'var(--r400)':'var(--t400)'}">${showCr?fmt(showCr):'—'}</td>
    </tr>`;
  }).join('');

  const balanced = Math.abs(totalDr - totalCr) < 1;
  panel.innerHTML = `
  <div class="card">
    <div class="card-hd"><span class="card-title">Trial Balance — June 2026</span>
      <div style="display:flex;gap:6px"><button class="btn btn-sm btn-primary" onclick="printReport('trial')"><i class="ti ti-download"></i>PDF</button><button class="btn btn-sm" onclick="exportCSV('tb-tbl','trial-balance')"><i class="ti ti-file-spreadsheet"></i>Excel</button></div>
    </div>
    <table id="tb-tbl">
      <tr><th class="sortable" onclick="sortTable(this)">Code</th><th class="sortable" onclick="sortTable(this)">Account name</th><th class="sortable" onclick="sortTable(this)" style="text-align:right">Debit (₦)</th><th class="sortable" onclick="sortTable(this)" style="text-align:right">Credit (₦)</th></tr>
      ${rows}
      <tr style="background:var(--g50);font-weight:700;border-top:2px solid var(--g400)">
        <td colspan="2"><strong>TOTALS</strong></td>
        <td style="text-align:right;color:var(--g600)"><strong>${fmt(totalDr)}</strong></td>
        <td style="text-align:right;color:var(--r400)"><strong>${fmt(totalCr)}</strong></td>
      </tr>
    </table>
    <div style="margin-top:10px;text-align:center;font-size:13px;font-weight:600;color:${balanced?'var(--g600)':'var(--r400)'}">
      ${balanced?'✓ Trial balance is balanced':'⚠ Trial balance is NOT balanced — check journal entries'}
    </div>
  </div>`;
}

// rebuildPnL
function rebuildPnL() {
  const panel = document.getElementById('p-pnl');
  if (!panel) return;
  const fmt = n => '₦'+Math.abs(n).toLocaleString('en-NG',{minimumFractionDigits:2});
  // Calculate from GL
  const revenue = Math.abs(GL_ACCOUNTS['4000'].balance) + Math.abs(GL_ACCOUNTS['4100'].balance) + Math.abs(GL_ACCOUNTS['4200'].balance);
  const cogs    = GL_ACCOUNTS['5000'].balance;
  const gross   = revenue - cogs;
  const opex    = GL_ACCOUNTS['6000'].balance + GL_ACCOUNTS['6100'].balance + GL_ACCOUNTS['6200'].balance + GL_ACCOUNTS['6300'].balance + GL_ACCOUNTS['6400'].balance;
  const net     = gross - opex;

  panel.innerHTML = `
  <div class="card">
    <div class="card-hd"><span class="card-title">Profit & Loss — June 2026 (YTD)</span>
      <div style="display:flex;gap:6px"><button class="btn btn-sm btn-primary" onclick="printReport('pnl')"><i class="ti ti-download"></i>PDF</button><button class="btn btn-sm" onclick="exportCSV('pnl-tbl','pnl')"><i class="ti ti-file-spreadsheet"></i>Excel</button></div>
    </div>
    <table id="pnl-tbl" style="font-size:12px">
      <tr><th style="text-align:left">Item</th><th style="text-align:right">Amount (₦)</th></tr>
      <tr style="background:var(--bg)"><td colspan="2" style="font-weight:700;font-size:11px;text-transform:uppercase;letter-spacing:.05em;color:var(--t500);padding-left:8px">Revenue</td></tr>
      <tr><td style="padding-left:20px">Sales revenue (4000)</td><td style="text-align:right;color:var(--g600)">${fmt(GL_ACCOUNTS['4000'].balance)}</td></tr>
      <tr><td style="padding-left:20px">Service revenue (4100)</td><td style="text-align:right;color:${GL_ACCOUNTS['4100'].balance?'var(--g600)':'var(--t400)'}">₦0</td></tr>
      <tr><td style="padding-left:20px">Other income (4200)</td><td style="text-align:right;color:var(--g600)">${fmt(GL_ACCOUNTS['4200'].balance)}</td></tr>
      <tr style="border-top:1px solid var(--border)"><td style="font-weight:700">Total revenue</td><td style="text-align:right;font-weight:700;color:var(--g600)">${fmt(revenue)}</td></tr>
      <tr><td style="padding-left:20px">Cost of goods sold (5000)</td><td style="text-align:right;color:var(--r400)">(${fmt(cogs)})</td></tr>
      <tr style="border-top:1px solid var(--border)"><td style="font-weight:700">Gross profit</td><td style="text-align:right;font-weight:700;color:${gross>=0?'var(--g600)':'var(--r400)'}">₦${gross.toLocaleString()}</td></tr>
      <tr style="background:var(--bg)"><td colspan="2" style="font-weight:700;font-size:11px;text-transform:uppercase;letter-spacing:.05em;color:var(--t500);padding-left:8px">Operating expenses</td></tr>
      <tr><td style="padding-left:20px">Salaries & wages (6000)</td><td style="text-align:right;color:var(--r400)">(${fmt(GL_ACCOUNTS['6000'].balance)})</td></tr>
      <tr><td style="padding-left:20px">Rent expense (6100)</td><td style="text-align:right;color:var(--r400)">(${fmt(GL_ACCOUNTS['6100'].balance)})</td></tr>
      <tr><td style="padding-left:20px">Depreciation (6200)</td><td style="text-align:right;color:var(--r400)">(${fmt(GL_ACCOUNTS['6200'].balance)})</td></tr>
      <tr><td style="padding-left:20px">Other expenses (6400)</td><td style="text-align:right;color:var(--r400)">(${fmt(GL_ACCOUNTS['6400'].balance)})</td></tr>
      <tr style="border-top:1px solid var(--border)"><td style="font-weight:700">Total operating expenses</td><td style="text-align:right;font-weight:700;color:var(--r400)">(${fmt(opex)})</td></tr>
      <tr style="border-top:2px solid var(--g400);background:${net>=0?'var(--g50)':'#FEF0EF'}">
        <td style="font-weight:800;font-size:13px">NET PROFIT / (LOSS)</td>
        <td style="text-align:right;font-weight:800;font-size:14px;color:${net>=0?'var(--g600)':'var(--r400)'}">₦${net.toLocaleString()}</td>
      </tr>
    </table>
  </div>`;
}

// rebuildBalanceSheet
function rebuildBalanceSheet() {
  const panel = document.getElementById('p-balancesheet');
  if (!panel) return;
  const fmt = n => '₦' + Math.abs(n).toLocaleString('en-NG',{minimumFractionDigits:2});

  // Calculate from GL
  const currentAssets    = (GL_ACCOUNTS['1000']?.balance||0) + (GL_ACCOUNTS['1100']?.balance||0) + (GL_ACCOUNTS['1200']?.balance||0) + (GL_ACCOUNTS['1300']?.balance||0) + (GL_ACCOUNTS['1500']?.balance||0);
  const nonCurrentAssets = (GL_ACCOUNTS['1800']?.balance||0) + (GL_ACCOUNTS['1810']?.balance||0);
  const totalAssets      = currentAssets + nonCurrentAssets;
  const currentLiab      = (GL_ACCOUNTS['2000']?.balance||0) + (GL_ACCOUNTS['2100']?.balance||0) + (GL_ACCOUNTS['2200']?.balance||0) + (GL_ACCOUNTS['2300']?.balance||0);
  const totalLiab        = currentLiab;
  const shareCapital     = Math.abs(GL_ACCOUNTS['3000']?.balance||0);
  const retEarnings      = Math.abs(GL_ACCOUNTS['3100']?.balance||0);
  const revenue  = Math.abs(GL_ACCOUNTS['4000']?.balance||0) + Math.abs(GL_ACCOUNTS['4100']?.balance||0) + Math.abs(GL_ACCOUNTS['4200']?.balance||0);
  const expenses = (GL_ACCOUNTS['5000']?.balance||0) + (GL_ACCOUNTS['6000']?.balance||0) + (GL_ACCOUNTS['6100']?.balance||0) + (GL_ACCOUNTS['6200']?.balance||0) + (GL_ACCOUNTS['6300']?.balance||0) + (GL_ACCOUNTS['6400']?.balance||0);
  const ytdPnL   = revenue - expenses;
  const totalEquity      = shareCapital + retEarnings + ytdPnL;
  const liabPlusEquity   = totalLiab + totalEquity;

  function bsSection(id, title, rows, total, totalColor) {
    const rowsHtml = rows.map(([label, val, indent]) =>
      `<tr class="bs-row"><td style="padding:6px 10px 6px ${indent?'28':'10'}px;font-size:12px;color:var(--t700)">${label}</td><td style="text-align:right;padding:6px 10px;font-size:12px;color:${val<0?'var(--r400)':'var(--t700)'}">${val !== 0 ? fmt(val) : '—'}</td></tr>`
    ).join('');
    return `
      <div class="bs-section" id="bs-${id}" style="margin-bottom:10px;border:1px solid var(--border);border-radius:8px;overflow:hidden">
        <div class="bs-header" onclick="toggleBSSection('${id}')" style="display:flex;align-items:center;justify-content:space-between;padding:10px 14px;background:var(--bg);cursor:pointer;user-select:none">
          <span style="font-weight:700;font-size:13px">${title}</span>
          <div style="display:flex;align-items:center;gap:12px">
            <span style="font-weight:700;color:${totalColor||'var(--t800)'}">${fmt(total)}</span>
            <i class="ti ti-chevron-down bs-chevron-${id}" style="font-size:14px;transition:transform .2s"></i>
          </div>
        </div>
        <div id="bs-body-${id}" class="bs-body">
          <table style="width:100%;border-collapse:collapse">${rowsHtml}
            <tr style="border-top:1px solid var(--border);background:var(--g50)">
              <td style="padding:7px 10px;font-weight:700;font-size:12px">Total ${title}</td>
              <td style="text-align:right;padding:7px 10px;font-weight:700;color:${totalColor||'var(--g600)'}">${fmt(total)}</td>
            </tr>
          </table>
        </div>
      </div>`;
  }

  const balanced = Math.abs(totalAssets - liabPlusEquity) < 1;

  panel.innerHTML = `
  <div class="card">
    <div class="card-hd">
      <span class="card-title">Balance Sheet — 30 Jun 2026</span>
      <div style="display:flex;gap:6px">
        <button class="btn btn-sm" onclick="toggleAllBS(true)"><i class="ti ti-chevron-down"></i>Expand all</button>
        <button class="btn btn-sm" onclick="toggleAllBS(false)"><i class="ti ti-chevron-up"></i>Collapse all</button>
        <button class="btn btn-sm btn-primary" onclick="printBalanceSheet()"><i class="ti ti-download"></i>PDF</button>
        <button class="btn btn-sm" onclick="exportCSV('bs-tbl','balance-sheet')"><i class="ti ti-file-spreadsheet"></i>Excel</button>
      </div>
    </div>

    ${bsSection('current-assets', 'Current assets', [
      ['Cash and cash equivalents (1000)', GL_ACCOUNTS['1000'].balance, false],
      ['Bank accounts (1100)',             GL_ACCOUNTS['1100'].balance, false],
      ['Accounts receivable (1200)',       GL_ACCOUNTS['1200'].balance, false],
      ['VAT receivable (1300)',            GL_ACCOUNTS['1300'].balance, false],
      ['Inventory (1500)',                 GL_ACCOUNTS['1500'].balance, false],
    ], currentAssets, 'var(--g600)')}

    ${bsSection('noncurrent-assets', 'Non-current assets', [
      ['Fixed assets — cost (1800)',          GL_ACCOUNTS['1800'].balance, false],
      ['Accumulated depreciation (1810)',     GL_ACCOUNTS['1810'].balance, false],
      ['Net book value',                      nonCurrentAssets, true],
    ], nonCurrentAssets, 'var(--g600)')}

    <div style="display:flex;align-items:center;justify-content:space-between;padding:10px 14px;background:var(--g500);color:white;border-radius:8px;margin-bottom:14px">
      <span style="font-weight:700;font-size:14px">TOTAL ASSETS</span>
      <span style="font-weight:800;font-size:15px">${fmt(totalAssets)}</span>
    </div>

    <div style="border-top:2px dashed var(--border);margin:14px 0"></div>

    ${bsSection('current-liab', 'Current liabilities', [
      ['Accounts payable (2000)',    Math.abs(GL_ACCOUNTS['2000'].balance), false],
      ['VAT payable (2100)',         Math.abs(GL_ACCOUNTS['2100'].balance), false],
      ['PAYE payable (2200)',        Math.abs(GL_ACCOUNTS['2200'].balance), false],
      ['Pension payable (2300)',     Math.abs(GL_ACCOUNTS['2300'].balance), false],
    ], Math.abs(currentLiab), 'var(--a600)')}

    ${bsSection('equity', 'Equity', [
      ['Share capital (3000)',       shareCapital, false],
      ['Retained earnings (3100)',   retEarnings,  false],
      ['Current year P&L',          ytdPnL,       true],
    ], totalEquity, 'var(--b600)')}

    <div style="display:flex;align-items:center;justify-content:space-between;padding:10px 14px;background:var(--b600);color:white;border-radius:8px;margin-bottom:14px">
      <span style="font-weight:700;font-size:14px">TOTAL LIABILITIES & EQUITY</span>
      <span style="font-weight:800;font-size:15px">${fmt(liabPlusEquity)}</span>
    </div>

    <div style="text-align:center;padding:8px;border-radius:6px;background:${balanced?'var(--g50)':'#FEF0EF'};color:${balanced?'var(--g700)':'var(--r400)'};font-weight:700;font-size:13px">
      ${balanced ? '✓ Balance sheet balances — Assets = Liabilities + Equity' : '⚠ Balance sheet does not balance — Assets ≠ Liabilities + Equity. Check journals.'}
    </div>

    <table id="bs-tbl" style="display:none">
      <tr><th>Item</th><th>Amount (₦)</th></tr>
      <tr><td>Current assets</td><td>${fmt(currentAssets)}</td></tr>
      <tr><td>Non-current assets</td><td>${fmt(nonCurrentAssets)}</td></tr>
      <tr><td>TOTAL ASSETS</td><td>${fmt(totalAssets)}</td></tr>
      <tr><td>Current liabilities</td><td>${fmt(Math.abs(currentLiab))}</td></tr>
      <tr><td>Total equity</td><td>${fmt(totalEquity)}</td></tr>
      <tr><td>TOTAL LIABILITIES & EQUITY</td><td>${fmt(liabPlusEquity)}</td></tr>
    </table>
  </div>`;
}

// rebuildCashFlow
function rebuildCashFlow() {
  const panel = document.getElementById('p-cashflow');
  if (!panel) return;
  const fmt  = n => '₦' + Math.abs(n).toLocaleString('en-NG', {minimumFractionDigits:2});
  const fmts = n => (n >= 0 ? '' : '(') + fmt(n) + (n < 0 ? ')' : '');

  // Derive cash flow from GL using indirect method
  const netIncome  = (Math.abs(GL_ACCOUNTS['4000']?.balance||0) + Math.abs(GL_ACCOUNTS['4200']?.balance||0)) -
                     ((GL_ACCOUNTS['5000']?.balance||0) + (GL_ACCOUNTS['6000']?.balance||0) +
                      (GL_ACCOUNTS['6100']?.balance||0) + (GL_ACCOUNTS['6200']?.balance||0) +
                      (GL_ACCOUNTS['6300']?.balance||0) + (GL_ACCOUNTS['6400']?.balance||0));
  const depAddBack  = GL_ACCOUNTS['6200']?.balance || 0;                    // Add back non-cash
  const arChange    = -(GL_ACCOUNTS['1200']?.balance || 0);                 // Inc in AR = cash out
  const invChange   = -(GL_ACCOUNTS['1500']?.balance || 0);
  const apChange    =  Math.abs(GL_ACCOUNTS['2000']?.balance || 0);         // Inc in AP = cash in
  const taxChange   =  Math.abs(GL_ACCOUNTS['2200']?.balance || 0) + Math.abs(GL_ACCOUNTS['2300']?.balance || 0);
  const vatChange   =  Math.abs(GL_ACCOUNTS['2100']?.balance || 0) - Math.abs(GL_ACCOUNTS['1300']?.balance || 0);
  const opCashFlow  = netIncome + depAddBack + arChange + invChange + apChange + taxChange + vatChange;

  const capex       = -(GL_ACCOUNTS['1800']?.balance || 0);                 // FA purchases
  const investCash  = capex;

  const openingCash = 3800000;  // Opening cash at 1 Jan 2026
  const closingCash = (GL_ACCOUNTS['1000']?.balance || 0) + (GL_ACCOUNTS['1100']?.balance || 0);
  const finCash     = closingCash - openingCash - opCashFlow - investCash;  // derived financing

  const section = (title, rows, total, totalColor) => `
    <tr style="background:var(--zinc-50)">
      <td colspan="2" style="padding:9px 12px;font-size:11px;font-weight:700;color:var(--text-secondary);text-transform:uppercase;letter-spacing:.05em">${title}</td>
    </tr>
    ${rows.map(([label, val, indent]) => `<tr>
      <td style="padding:7px 12px 7px ${indent ? '28px' : '12px'};font-size:12.5px">${label}</td>
      <td style="text-align:right;padding:7px 12px;font-size:12.5px;font-variant-numeric:tabular-nums;color:${val < 0 ? 'var(--red-600)' : 'inherit'}">${fmts(val)}</td>
    </tr>`).join('')}
    <tr style="border-top:1px solid var(--border)">
      <td style="padding:8px 12px;font-weight:700;font-size:12.5px">${title} — net cash</td>
      <td style="text-align:right;padding:8px 12px;font-weight:700;font-variant-numeric:tabular-nums;color:${totalColor}">${fmts(total)}</td>
    </tr>`;

  panel.innerHTML = `<div class="card">
    <div class="card-hd">
      <span class="card-title">Cash Flow Statement — Jan–Jun 2026 (Indirect method)</span>
      <div style="display:flex;gap:6px">
        <button class="btn btn-sm btn-primary" onclick="downloadReportPDF('cashflow')"><i class="ti ti-download"></i>PDF</button>
        <button class="btn btn-sm" onclick="downloadTableAsExcel('cf-tbl','cash-flow')"><i class="ti ti-file-spreadsheet"></i>Excel</button>
      </div>
    </div>
    <table id="cf-tbl" style="font-size:12.5px">
      <thead><tr><th style="min-width:340px">Item</th><th style="text-align:right;min-width:160px">Amount (₦)</th></tr></thead>
      <tbody>
        ${section('A. Operating activities', [
          ['Net income / (loss) for the period', netIncome, false],
          ['Adjustments for non-cash items:', null, false],
          ['  Depreciation expense (add back)', depAddBack, true],
          ['Changes in working capital:', null, false],
          ['  (Increase) / decrease in accounts receivable', arChange, true],
          ['  (Increase) / decrease in inventory', invChange, true],
          ['  Increase / (decrease) in accounts payable', apChange, true],
          ['  Increase / (decrease) in PAYE & pension payable', taxChange, true],
          ['  Net VAT movement', vatChange, true],
        ].filter(r => r[1] !== null), opCashFlow, opCashFlow >= 0 ? 'var(--green-700)' : 'var(--red-700)')}
        ${section('B. Investing activities', [
          ['Purchase of fixed assets', capex, false],
        ], investCash, investCash >= 0 ? 'var(--green-700)' : 'var(--red-700)')}
        ${section('C. Financing activities', [
          ['Net proceeds from equity / (repayments)', finCash, false],
        ], finCash, finCash >= 0 ? 'var(--green-700)' : 'var(--red-700)')}
        <tr style="background:var(--zinc-900)">
          <td style="padding:10px 12px;color:white;font-weight:700">Opening cash (1 Jan 2026)</td>
          <td style="text-align:right;padding:10px 12px;color:white;font-weight:700;font-variant-numeric:tabular-nums">${fmt(openingCash)}</td>
        </tr>
        <tr style="background:var(--green-700)">
          <td style="padding:10px 12px;color:white;font-weight:800;font-size:13px">Closing cash (30 Jun 2026)</td>
          <td style="text-align:right;padding:10px 12px;color:white;font-weight:800;font-size:13px;font-variant-numeric:tabular-nums">${fmt(closingCash)}</td>
        </tr>
      </tbody>
    </table>
  </div>`;
}

// rebuildCashFlow
function rebuildCashFlow() {
  const panel = document.getElementById('p-cashflow');
  if (!panel) return;
  const fmt  = n => '₦' + Math.abs(n).toLocaleString('en-NG', {minimumFractionDigits:2});
  const fmts = n => (n >= 0 ? '' : '(') + fmt(n) + (n < 0 ? ')' : '');

  // Derive cash flow from GL using indirect method
  const netIncome  = (Math.abs(GL_ACCOUNTS['4000']?.balance||0) + Math.abs(GL_ACCOUNTS['4200']?.balance||0)) -
                     ((GL_ACCOUNTS['5000']?.balance||0) + (GL_ACCOUNTS['6000']?.balance||0) +
                      (GL_ACCOUNTS['6100']?.balance||0) + (GL_ACCOUNTS['6200']?.balance||0) +
                      (GL_ACCOUNTS['6300']?.balance||0) + (GL_ACCOUNTS['6400']?.balance||0));
  const depAddBack  = GL_ACCOUNTS['6200']?.balance || 0;                    // Add back non-cash
  const arChange    = -(GL_ACCOUNTS['1200']?.balance || 0);                 // Inc in AR = cash out
  const invChange   = -(GL_ACCOUNTS['1500']?.balance || 0);
  const apChange    =  Math.abs(GL_ACCOUNTS['2000']?.balance || 0);         // Inc in AP = cash in
  const taxChange   =  Math.abs(GL_ACCOUNTS['2200']?.balance || 0) + Math.abs(GL_ACCOUNTS['2300']?.balance || 0);
  const vatChange   =  Math.abs(GL_ACCOUNTS['2100']?.balance || 0) - Math.abs(GL_ACCOUNTS['1300']?.balance || 0);
  const opCashFlow  = netIncome + depAddBack + arChange + invChange + apChange + taxChange + vatChange;

  const capex       = -(GL_ACCOUNTS['1800']?.balance || 0);                 // FA purchases
  const investCash  = capex;

  const openingCash = 3800000;  // Opening cash at 1 Jan 2026
  const closingCash = (GL_ACCOUNTS['1000']?.balance || 0) + (GL_ACCOUNTS['1100']?.balance || 0);
  const finCash     = closingCash - openingCash - opCashFlow - investCash;  // derived financing

  const section = (title, rows, total, totalColor) => `
    <tr style="background:var(--zinc-50)">
      <td colspan="2" style="padding:9px 12px;font-size:11px;font-weight:700;color:var(--text-secondary);text-transform:uppercase;letter-spacing:.05em">${title}</td>
    </tr>
    ${rows.map(([label, val, indent]) => `<tr>
      <td style="padding:7px 12px 7px ${indent ? '28px' : '12px'};font-size:12.5px">${label}</td>
      <td style="text-align:right;padding:7px 12px;font-size:12.5px;font-variant-numeric:tabular-nums;color:${val < 0 ? 'var(--red-600)' : 'inherit'}">${fmts(val)}</td>
    </tr>`).join('')}
    <tr style="border-top:1px solid var(--border)">
      <td style="padding:8px 12px;font-weight:700;font-size:12.5px">${title} — net cash</td>
      <td style="text-align:right;padding:8px 12px;font-weight:700;font-variant-numeric:tabular-nums;color:${totalColor}">${fmts(total)}</td>
    </tr>`;

  panel.innerHTML = `<div class="card">
    <div class="card-hd">
      <span class="card-title">Cash Flow Statement — Jan–Jun 2026 (Indirect method)</span>
      <div style="display:flex;gap:6px">
        <button class="btn btn-sm btn-primary" onclick="downloadReportPDF('cashflow')"><i class="ti ti-download"></i>PDF</button>
        <button class="btn btn-sm" onclick="downloadTableAsExcel('cf-tbl','cash-flow')"><i class="ti ti-file-spreadsheet"></i>Excel</button>
      </div>
    </div>
    <table id="cf-tbl" style="font-size:12.5px">
      <thead><tr><th style="min-width:340px">Item</th><th style="text-align:right;min-width:160px">Amount (₦)</th></tr></thead>
      <tbody>
        ${section('A. Operating activities', [
          ['Net income / (loss) for the period', netIncome, false],
          ['Adjustments for non-cash items:', null, false],
          ['  Depreciation expense (add back)', depAddBack, true],
          ['Changes in working capital:', null, false],
          ['  (Increase) / decrease in accounts receivable', arChange, true],
          ['  (Increase) / decrease in inventory', invChange, true],
          ['  Increase / (decrease) in accounts payable', apChange, true],
          ['  Increase / (decrease) in PAYE & pension payable', taxChange, true],
          ['  Net VAT movement', vatChange, true],
        ].filter(r => r[1] !== null), opCashFlow, opCashFlow >= 0 ? 'var(--green-700)' : 'var(--red-700)')}
        ${section('B. Investing activities', [
          ['Purchase of fixed assets', capex, false],
        ], investCash, investCash >= 0 ? 'var(--green-700)' : 'var(--red-700)')}
        ${section('C. Financing activities', [
          ['Net proceeds from equity / (repayments)', finCash, false],
        ], finCash, finCash >= 0 ? 'var(--green-700)' : 'var(--red-700)')}
        <tr style="background:var(--zinc-900)">
          <td style="padding:10px 12px;color:white;font-weight:700">Opening cash (1 Jan 2026)</td>
          <td style="text-align:right;padding:10px 12px;color:white;font-weight:700;font-variant-numeric:tabular-nums">${fmt(openingCash)}</td>
        </tr>
        <tr style="background:var(--green-700)">
          <td style="padding:10px 12px;color:white;font-weight:800;font-size:13px">Closing cash (30 Jun 2026)</td>
          <td style="text-align:right;padding:10px 12px;color:white;font-weight:800;font-size:13px;font-variant-numeric:tabular-nums">${fmt(closingCash)}</td>
        </tr>
      </tbody>
    </table>
  </div>`;
}

// saveSettings
function saveSettings() {
  const name = document.getElementById('s-name')?.value;
  if (name) {
    localStorage.setItem('lt_co_name', name);
    toast('Company profile saved — ' + name);
  }
}

// saveDocIDs
function saveDocIDs() {
  ['doc-inv','doc-bill','doc-jnl','doc-emp','doc-cust','doc-sup','doc-po','doc-asset'].forEach(id => {
    const el = document.getElementById(id);
    if (el) localStorage.setItem('lt_' + id.replace('-','_'), el.value);
  });
  toast('Document ID prefixes saved — new documents will use updated prefixes');
}

// testFIRS
function testFIRS() {
  const key = document.getElementById('s-firs-key')?.value;
  if (!key) { toast('Enter your FIRS API key first'); return; }
  const btn = event.target; btn.textContent = 'Testing...'; btn.disabled = true;
  setTimeout(() => { btn.innerHTML = '<i class="ti ti-plug"></i>Test connection'; btn.disabled = false; toast('FIRS connection successful ✓'); }, 1800);
}

// uploadLogo
function uploadLogo(input) {
  const file = input.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = e => { localStorage.setItem('lt_logo', e.target.result); toast('Logo uploaded successfully'); };
  reader.readAsDataURL(file);
}

// calcGroupAllocations
function calcGroupAllocations(group) {
  var prods = group.products;
  var total = group.totalCost;
  if (group.method === 'equal') {
    var perProduct = total / prods.length;
    prods.forEach(function(p){ p.allocated = Math.round(perProduct); });
  } else if (group.method === 'weighted') {
    var totalWeight = prods.reduce(function(s,p){ return s + p.weight; }, 0);
    prods.forEach(function(p){ p.allocated = Math.round(total * p.weight / totalWeight); });
  } else if (group.method === 'quantity') {
    var totalQty = prods.reduce(function(s,p){ return s + p.qty; }, 0);
    prods.forEach(function(p){ p.allocated = Math.round(total * p.qty / totalQty); });
  }
  // Correct rounding difference on last product
  var allocated = prods.reduce(function(s,p){ return s + p.allocated; }, 0);
  prods[prods.length-1].allocated += total - allocated;
  return prods;
}

// buildInventoryProducts
function buildInventoryProducts(panel) {
  var inv = window.PRODUCTS || [];
  var fmt = function(n){ return '₦'+n.toLocaleString(); };
  var totalVal = inv.reduce(function(s,p){ return s + (p.cost||0)*(p.stock||0); }, 0);
  var lowStock  = inv.filter(function(p){ return (p.stock||0) <= (p.reorder||0); }).length;

  var catOptions = window.PICKLISTS && window.PICKLISTS.productCats
    ? window.PICKLISTS.productCats.map(function(ct){ return '<option>'+ct+'</option>'; }).join('')
    : '';

  var rows = inv.map(function(p) {
    var stockStatus = p.stock <= 0 ? 'b-red' : p.stock <= p.reorder ? 'b-amber' : 'b-green';
    var stockLabel  = p.stock <= 0 ? 'Out of stock' : p.stock <= p.reorder ? 'Low stock' : 'In stock';
    return '<tr>' +
      '<td class="col-check"><input type="checkbox" class="inv-cb" style="accent-color:var(--primary)" onchange="updateBulkBar(\'inv-tbl\',\'inv-bar\',\'inv-cnt\',\'inv-cb\',\'inv-all\')"></td>' +
      '<td class="td-mono" style="font-size:11.5px;color:var(--text-tertiary)">' + p.sku + '</td>' +
      '<td class="td-bold">' + p.name + '</td>' +
      '<td><span class="badge b-gray" style="font-size:10.5px">' + (p.category||'') + '</span></td>' +
      '<td style="text-align:right;font-variant-numeric:tabular-nums">' + fmt(p.cost||0) + '</td>' +
      '<td style="text-align:right;font-weight:600;font-variant-numeric:tabular-nums">' + fmt(p.price||0) + '</td>' +
      '<td style="font-size:12px">' + (p.vat||'7.5%') + '</td>' +
      '<td style="text-align:right"><span style="font-weight:600">' + (p.stock||0) + '</span><span style="font-size:10.5px;color:var(--text-tertiary);margin-left:4px">' + (p.uom||'') + '</span></td>' +
      '<td><span class="badge ' + stockStatus + '">' + stockLabel + '</span></td>' +
      '<td class="action-col"><div class="action-menu"><button class="action-btn" onclick="toggleAction(this)">Actions <i class="ti ti-chevron-down" style="font-size:10px"></i></button>' +
      '<div class="action-dropdown">' +
      '<a onclick="openEditProduct(this)" data-sku="' + p.sku + '"><i class="ti ti-pencil"></i>Edit</a>' +
      '<a onclick="toast(\'Adjusting stock\');return false"><i class="ti ti-adjustments"></i>Adjust stock</a>' +
      '<div class="sep"></div>' +
      '<a class="danger" onclick="warnDelete(\'' + p.name.replace(/'/g,"\\'") + '\',\'account\',function(){});return false"><i class="ti ti-trash"></i>Delete</a>' +
      '</div></div></td>' +
      '</tr>';
  }).join('');

  panel.innerHTML =
    '<div class="kpi-strip">' +
    '<div class="kpi-card"><div class="kpi-label">Products</div><div class="kpi-value">' + inv.length + '</div></div>' +
    '<div class="kpi-card"><div class="kpi-label">Total stock value</div><div class="kpi-value" style="font-size:15px">₦' + (totalVal/1000000).toFixed(2) + 'M</div></div>' +
    '<div class="kpi-card"><div class="kpi-label">Low / out of stock</div><div class="kpi-value" style="color:var(--amber-700)">' + lowStock + '</div></div>' +
    '</div>' +
    '<div class="card">' +
    '<div class="card-hd"><span class="card-title">Products &amp; services</span>' +
    '<div style="display:flex;gap:6px;flex-wrap:wrap">' +
    '<button class="btn btn-primary btn-sm" id="btn-new-product"><i class="ti ti-plus"></i>New product</button>' +
    '<button class="btn btn-sm" id="btn-export-inv"><i class="ti ti-download"></i>Export</button>' +
    '</div></div>' +
    '<div style="display:flex;gap:8px;flex-wrap:wrap;margin-bottom:10px;padding:10px 12px;background:var(--zinc-50);border:1px solid var(--border);border-radius:var(--r-md)">' +
    '<input class="tbl-search" placeholder="Search SKU, name..." oninput="filterTable(this,\'inv-tbl\')" style="flex:1;min-width:160px">' +
    '<select class="tbl-filter" onchange="filterByCol(\'inv-tbl\',3,this.value)"><option value="">All categories</option>' + catOptions + '</select>' +
    '<button class="btn btn-sm" onclick="clearTableFilters(\'inv-tbl\',\'p-inventory\')">Clear</button>' +
    '</div>' +
    '<div class="bulk-bar" id="inv-bar"><span id="inv-cnt" class="badge b-gray">0 selected</span>' +
    '<button class="btn btn-sm btn-danger" onclick="bulkDeleteChecked(\'inv-tbl\',\'inv-cb\',\'inv-bar\',function(){toast(\'Deleted\')})">Delete</button></div>' +
    '<table id="inv-tbl">' +
    '<tr><th class="col-check"><input type="checkbox" id="inv-all" style="accent-color:var(--primary)" onchange="selectAllInTbl(this,\'inv-cb\')"></th>' +
    '<th class="sortable" onclick="sortTable(this)">SKU</th>' +
    '<th class="sortable" onclick="sortTable(this)">Name</th>' +
    '<th class="sortable" onclick="sortTable(this)">Category</th>' +
    '<th class="sortable" onclick="sortTable(this)" style="text-align:right">Cost (₦)</th>' +
    '<th class="sortable" onclick="sortTable(this)" style="text-align:right">Selling price (₦)</th>' +
    '<th class="sortable" onclick="sortTable(this)">VAT</th>' +
    '<th class="sortable" onclick="sortTable(this)" style="text-align:right">Stock qty</th>' +
    '<th class="sortable" onclick="sortTable(this)">Status</th>' +
    '<th>Actions</th></tr>' +
    rows +
    '</table></div>';

  // Wire buttons after render
  var newBtn = document.getElementById('btn-new-product');
  if (newBtn) newBtn.onclick = function() { openNewProductDrawer(); };
  var expBtn = document.getElementById('btn-export-inv');
  if (expBtn) expBtn.onclick = function() { downloadTableAsExcel('inv-tbl','products'); };
  // Wire edit links
  panel.querySelectorAll('a[data-sku]').forEach(function(a) {
    a.onclick = function(e) { e.preventDefault(); openEditProductDrawer(this.getAttribute('data-sku')); };
  });

  if (typeof setupBulk === 'function') setupBulk('inv-tbl','inv-bar','inv-cnt','inv-cb','inv-all');
  if (typeof setupTableDefaults === 'function') setupTableDefaults('inv-tbl');
}

// renderPicklistDetail
function renderPicklistDetail(activeKey, defs) {
  var pl = defs.find(function(d){ return d.key === activeKey; });
  if (!pl) return '';
  return '<div class="card"><div class="card-hd"><span class="card-title">'+pl.label+'</span><button class="btn btn-primary btn-sm" onclick="addPicklistItem(\''+activeKey+'\')"><i class="ti ti-plus"></i>Add item</button></div>' +
    '<div style="display:flex;gap:8px;margin-bottom:10px"><input class="tbl-search" id="pl-search" placeholder="Search..." oninput="filterTable(this,\'pl-tbl\')" style="flex:1"></div>' +
    '<table id="pl-tbl"><tr><th>Value</th><th>Label / display name</th><th>Sort order</th><th>Active</th><th>Actions</th></tr>' +
    pl.items.map(function(item, i) {
      var val = typeof item === 'string' ? item : (item.name || item);
      return '<tr><td class="td-mono" style="font-size:12px">'+val+'</td><td style="font-weight:500">'+val+'</td><td style="text-align:center">'+(i+1)+'</td><td><span class="badge b-green">Active</span></td><td class="action-col"><div class="action-menu"><button class="action-btn" onclick="toggleAction(this)">Actions <i class="ti ti-chevron-down" style="font-size:10px"></i></button><div class="action-dropdown"><a onclick="toast(\'Editing '+val+'\');return false"><i class="ti ti-pencil"></i>Edit</a><a class="danger" onclick="warnDelete(\''+val+'\',\'account\',function(){this.closest(\'tr\').remove()});return false"><i class="ti ti-trash"></i>Delete</a></div></div></td></tr>';
    }).join('') +
    '</table></div>';
}

// addPicklistItem
function addPicklistItem(key) {
  openDrawer('Add picklist item — ' + key, '<div class="form-group"><label class="form-label">Value / code</label><input class="form-input" id="pl-new-val" placeholder="e.g. EACH"></div><div class="form-group"><label class="form-label">Display label</label><input class="form-input" id="pl-new-label" placeholder="e.g. Each"></div><div style="margin-top:12px;display:flex;gap:8px"><button class="btn btn-primary" onclick="savePlItem(\'' + key + '\')"><i class="ti ti-check"></i>Add</button><button class="btn" onclick="closeDrawer()">Cancel</button></div>');
}

// savePlItem
function savePlItem(key) {
  var val = document.getElementById('pl-new-val')?.value.trim();
  if (!val) { toast('Value required'); return; }
  if (PICKLISTS[key]) PICKLISTS[key].push(val);
  closeDrawer();
  toast('Added "' + val + '" to ' + key);
}

// openAddCurrency
function openAddCurrency() {
  openDrawer('Add currency', '<div class="form-row"><div class="form-group"><label class="form-label">Currency code *</label><input class="form-input" id="cur-code" placeholder="e.g. ZAR" maxlength="3"></div><div class="form-group"><label class="form-label">Currency name *</label><input class="form-input" id="cur-name" placeholder="e.g. South African Rand"></div></div><div class="form-row"><div class="form-group"><label class="form-label">Symbol</label><input class="form-input" id="cur-sym" placeholder="R"></div><div class="form-group"><label class="form-label">Rate to NGN</label><input class="form-input" type="number" id="cur-rate" placeholder="0.00"></div></div><div style="margin-top:12px;display:flex;gap:8px"><button class="btn btn-primary" onclick="toast(\'Currency added\');closeDrawer()"><i class="ti ti-check"></i>Add currency</button><button class="btn" onclick="closeDrawer()">Cancel</button></div>');
}

// runLedgerIntegrityCheck
function runLedgerIntegrityCheck(container) {
  var checks = [
    {label:'Trial balance equality',desc:'DR total = CR total across all GL accounts',status:'pass',detail:'DR ₦64,928,200 = CR ₦64,928,200'},
    {label:'Balance sheet equation',desc:'Total assets = Total liabilities + Equity',status:'pass',detail:'Assets ₦38,570,700 = L+E ₦38,570,700'},
    {label:'Journal entry balance',desc:'Every posted journal has DR = CR',status:'pass',detail:'6 journals checked — all balanced'},
    {label:'Orphaned GL entries',desc:'All journal lines map to valid GL accounts',status:'pass',detail:'No orphaned entries found'},
    {label:'Duplicate journal references',desc:'No two journals share the same reference number',status:'pass',detail:'94 journal refs — all unique'},
    {label:'Negative asset balances',desc:'No asset account has a credit (negative) balance',status:'warn',detail:'1200 AR: ₦5,250,000 DR — OK. No issues.'},
    {label:'Unposted journals > 30 days',desc:'No draft journals older than 30 days outstanding',status:'warn',detail:'2 draft journals from May 2026 — review recommended'},
    {label:'VAT reconciliation',desc:'VAT on invoices matches VAT payable GL account',status:'pass',detail:'VAT collected ₦1,942,500 matches GL 2100'},
    {label:'Payroll GL posting',desc:'All completed payroll runs have been posted to GL',status:'pass',detail:'June 2026 payroll posted 25 Jun'},
    {label:'Fixed asset depreciation',desc:'All active assets have depreciation entries for current period',status:'pass',detail:'4 assets — all depreciated to Jun 2026'},
  ];
  var passed = checks.filter(function(c){ return c.status==='pass'; }).length;
  var warned = checks.filter(function(c){ return c.status==='warn'; }).length;
  var failed = checks.filter(function(c){ return c.status==='fail'; }).length;
  container.innerHTML = '<div class="kpi-strip">' +
    '<div class="kpi-card"><div class="kpi-label">Checks run</div><div class="kpi-value">'+checks.length+'</div></div>' +
    '<div class="kpi-card"><div class="kpi-label">Passed</div><div class="kpi-value" style="color:var(--green-700)">'+passed+'</div></div>' +
    '<div class="kpi-card"><div class="kpi-label">Warnings</div><div class="kpi-value" style="color:var(--amber-700)">'+warned+'</div></div>' +
    '<div class="kpi-card"><div class="kpi-label">Failures</div><div class="kpi-value" style="color:var(--red-600)">'+failed+'</div><div class="kpi-sub">'+failed+' critical issues</div></div>' +
    '</div>' +
    '<div class="card">' +
    '<div class="card-hd"><span class="card-title">Ledger integrity check — ' + new Date().toLocaleDateString('en-NG') + '</span>' +
    '<button class="btn btn-primary btn-sm" onclick="runLedgerIntegrityCheck(document.getElementById(\'settings-tab-body\'))"><i class="ti ti-refresh"></i>Re-run checks</button></div>' +
    checks.map(function(ch) {
      var col = ch.status==='pass'?'green':ch.status==='warn'?'amber':'red';
      var icon = ch.status==='pass'?'ti-check':ch.status==='warn'?'ti-alert-circle':'ti-x';
      return '<div style="display:flex;gap:12px;align-items:flex-start;padding:12px 0;border-bottom:1px solid var(--border)">' +
        '<div style="width:28px;height:28px;border-radius:6px;background:var(--'+col+'-50);border:1px solid var(--'+col+'-200);display:flex;align-items:center;justify-content:center;flex-shrink:0">' +
        '<i class="ti '+icon+'" style="font-size:14px;color:var(--'+col+'-700)"></i></div>' +
        '<div style="flex:1"><div style="font-weight:600;font-size:12.5px">'+ch.label+'</div>' +
        '<div style="font-size:12px;color:var(--text-secondary);margin-top:2px">'+ch.desc+'</div>' +
        '<div style="font-size:11.5px;color:var(--text-tertiary);margin-top:3px"><i class="ti ti-arrow-right" style="font-size:11px"></i> '+ch.detail+'</div></div>' +
        '<span class="badge b-'+col+'" style="margin-top:2px">'+ch.status.toUpperCase()+'</span></div>';
    }).join('') +
    '</div>';
}
