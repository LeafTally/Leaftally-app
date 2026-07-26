// ============================================================
// LeafTally — TABLE utilities
// ============================================================

// sortTable
function sortTable(th) {
  const tbl = th.closest('table');
  const idx = Array.from(th.parentNode.cells).indexOf(th);
  const asc = th.dataset.asc !== '1';
  th.dataset.asc = asc ? '1' : '0';
  const rows = Array.from(tbl.querySelectorAll('tr:not(:first-child)')).filter(r => r.style.display !== 'none');
  rows.sort((a, b) => {
    const av = a.cells[idx]?.textContent?.trim() || '';
    const bv = b.cells[idx]?.textContent?.trim() || '';
    return asc ? av.localeCompare(bv, undefined, {numeric:true}) : bv.localeCompare(av, undefined, {numeric:true});
  });
  rows.forEach(r => tbl.appendChild(r));
}

// filterTable
function filterTable(inp, tblId) {
  const q = inp.value.toLowerCase();
  document.querySelectorAll('#' + tblId + ' tr:not(:first-child)').forEach(r => {
    r.style.display = r.textContent.toLowerCase().includes(q) ? '' : 'none';
  });
}

// filterByCol
function filterByCol(tblId, colIndex, value) {
  const q = value.toLowerCase().trim();
  document.querySelectorAll('#' + tblId + ' tr:not(:first-child)').forEach(row => {
    const cell = row.cells[colIndex];
    const text = cell ? cell.textContent.toLowerCase() : '';
    row.style.display = (!q || text.includes(q)) ? '' : 'none';
  });
}

// setupTableDefaults
function setupTableDefaults(tblId) {
  const tbl = document.getElementById(tblId);
  if (!tbl || tbl.dataset.sorted) return;
  tbl.dataset.sorted = '1';
  const headers = Array.from(tbl.querySelectorAll('th'));
  let dateCol = -1;
  headers.forEach((th,i) => { const t=th.textContent.toLowerCase(); if((t.includes('date')||t.includes('period'))&&dateCol<0) dateCol=i; });
  if (dateCol >= 0) {
    const rows = Array.from(tbl.querySelectorAll('tr:not(:first-child)'));
    rows.sort((a,b) => { const av=a.cells[dateCol]?.textContent?.trim()||''; const bv=b.cells[dateCol]?.textContent?.trim()||''; return bv.localeCompare(av); });
    rows.forEach(r => tbl.appendChild(r));
  }
}

// clearTableFilters
function clearTableFilters(tblId, panelId) {
  document.querySelectorAll('#' + tblId + ' tr:not(:first-child)').forEach(r => r.style.display = '');
  const panel = panelId ? document.getElementById(panelId) : document;
  panel.querySelectorAll('.tbl-search').forEach(el => el.value = '');
  panel.querySelectorAll('.tbl-filter').forEach(el => { if (el.tagName === 'SELECT') el.selectedIndex = 0; else el.value = ''; });
  toast('Filters cleared');
}

// setupBulk
function setupBulk(tblId, barId, countId, cbClass, allCbId) {
  const update = () => {
    const n = document.querySelectorAll('.' + cbClass + ':checked').length;
    const bar = document.getElementById(barId);
    const cnt = document.getElementById(countId);
    if (bar) bar.classList.toggle('show', n > 0);
    if (cnt) cnt.textContent = n + ' selected';
    const all = document.getElementById(allCbId);
    const total = document.querySelectorAll('.' + cbClass).length;
    if (all) { all.indeterminate = n > 0 && n < total; all.checked = n === total && total > 0; }
  };
  const selectAll = e => {
    document.querySelectorAll('.' + cbClass).forEach(cb => { cb.checked = e.target.checked; cb.closest('tr').classList.toggle('row-selected', e.target.checked); });
    update();
  };
  const allCb = document.getElementById(allCbId);
  if (allCb) allCb.onchange = selectAll;
  document.querySelectorAll('.' + cbClass).forEach(cb => {
    cb.onchange = () => { cb.closest('tr').classList.toggle('row-selected', cb.checked); update(); };
  });
  return { update, clear: () => {
    document.querySelectorAll('.' + cbClass).forEach(cb => { cb.checked = false; cb.closest('tr').classList.remove('row-selected'); });
    const allCb = document.getElementById(allCbId); if (allCb) { allCb.checked = false; allCb.indeterminate = false; }
    const bar = document.getElementById(barId); if (bar) bar.classList.remove('show');
  }};
}

// updateBulkBar
function updateBulkBar(tblId, barId, countId, cbClass, allCbId) {
  const n = document.querySelectorAll('.' + cbClass + ':checked').length;
  const bar = document.getElementById(barId);
  const cnt = document.getElementById(countId);
  if (bar) bar.classList.toggle('show', n > 0);
  if (cnt) cnt.textContent = n + ' selected';
  const allCb = document.getElementById(allCbId);
  const total = document.querySelectorAll('.' + cbClass).length;
  if (allCb) { allCb.indeterminate = n > 0 && n < total; allCb.checked = n === total && total > 0; }
}

// selectAllInTbl
function selectAllInTbl(allCb, cbClass) {
  document.querySelectorAll('.' + cbClass).forEach(cb => {
    cb.checked = allCb.checked;
    cb.closest('tr')?.classList.toggle('row-selected', allCb.checked);
  });
}

// bulkDeleteChecked
function bulkDeleteChecked(tblId, cbClass, barId, onDone) {
  const rows = Array.from(document.querySelectorAll('#' + tblId + ' .' + cbClass + ':checked')).map(cb => cb.closest('tr'));
  if (!rows.length) { toast('No items selected'); return; }
  warnDelete(rows.length + ' items', () => {
    rows.forEach(r => r.remove());
    const bar = document.getElementById(barId); if (bar) bar.classList.remove('show');
    if (onDone) onDone();
  });
}

// downloadTableAsExcel
function downloadTableAsExcel(tblId, filename) {
  const tbl = document.getElementById(tblId);
  if (!tbl) { toast('Table not found'); return; }
  const rows = Array.from(tbl.querySelectorAll('tr')).map(r =>
    Array.from(r.cells).filter((_,i)=>!r.cells[i].classList.contains('col-check')&&!r.cells[i].classList.contains('action-col'))
      .map(td=>'"'+td.textContent.trim().replace(/"/g,'""')+'"').join(',')
  );
  const coName = localStorage.getItem('lt_co_name')||'Acme Trading Ltd';
  const hdr = `"# LeafTally Export — ${filename}"\n"# ${coName}"\n"# Generated: ${new Date().toLocaleDateString('en-GB')}"\n\n`;
  const blob = new Blob([hdr+rows.join('\n')],{type:'text/csv'});
  const a = document.createElement('a'); a.href=URL.createObjectURL(blob);
  a.download='leaftally-'+filename+'-'+new Date().toISOString().split('T')[0]+'.csv'; a.click();
  toast('Downloaded: '+a.download);
}

// exportCSV
function exportCSV(tblId, filename) {
  const rows = [];
  document.querySelectorAll('#' + tblId + ' tr').forEach(r => {
    rows.push(Array.from(r.cells).map(c => '"' + c.textContent.replace(/"/g, '""') + '"').join(','));
  });
  const blob = new Blob([rows.join('\n')], {type:'text/csv'});
  const a = document.createElement('a'); a.href = URL.createObjectURL(blob);
  a.download = (filename || tblId) + '.csv'; a.click();
  toast('Exported to CSV');
}

// downloadExcelTemplate
function downloadExcelTemplate(type) {
  const T = {
    customers:{headers:['Customer code','Company name','Email','Phone','Address','TIN','Payment terms','Credit limit (NGN)','VAT registered (Yes/No)'],sample:['C-006','Sample Ltd','email@sample.ng','0801 000 0000','Lagos','12345678-0001','Net 30','1000000','Yes']},
    suppliers:{headers:['Supplier code','Supplier name','Email','Phone','Address','TIN','Payment terms','Default GL code','Currency'],sample:['S-006','Sample Supplier','billing@sample.ng','0802 000 0000','Abuja','87654321-0001','Net 30','2000','NGN']},
    employees:{headers:['Employee ID','First name','Last name','Email','Phone','Job title','Department','Gross salary (NGN/month)','Bank name','Account number','Start date (DD/MM/YYYY)'],sample:['EMP-007','John','Doe','john@company.ng','0803 000 0000','Accountant','Finance','250000','GTBank','0123456789','01/01/2026']},
    products:{headers:['SKU','Product name','Category','Cost price (NGN)','Selling price (NGN)','VAT rate (%)','WHT rate (%)','Revenue GL code','COGS GL code','UoM','Stock qty','Reorder point'],sample:['SKU-009','New Product','Electronics','50000','85000','7.5','0','4000','5000','Each','20','5']},
    coa:{headers:['Account code','Account name','Type','Sub-type','Normal balance (Debit/Credit)','Description'],sample:['6700','New expense','Expense','Operating expense','Debit','Description']},
    'opening-balances':{headers:['Account code','Account name','Opening balance (NGN)','Debit or Credit (D/C)','As at date (DD/MM/YYYY)'],sample:['1100','Bank accounts','5000000','D','01/01/2026']},
    materials:{headers:['Material code','Material name','Category','Unit of measure','Unit cost (NGN)','Reorder point','Notes'],sample:['MAT-010','New Material','Materials','Each','15000','10','']},
    journals:{headers:['Date (YYYY-MM-DD)','Journal type','Narration','Account code (DR)','DR amount (NGN)','Account code (CR)','CR amount (NGN)'],sample:['2026-01-01','General','Opening balance','1100','1000000','3100','1000000']},
  };
  const tmpl = T[type];
  if (!tmpl) { toast('Template not available for: '+type); return; }
  const rows = [
    ['# LeafTally Import Template — '+type.charAt(0).toUpperCase()+type.slice(1)],
    ['# Company: '+(localStorage.getItem('lt_co_name')||'Acme Trading Ltd')],
    ['# Generated: '+new Date().toLocaleDateString('en-GB')],
    ['# Do not change column headers. Fill data from row 6. Save as CSV before uploading.'],
    [''],
    tmpl.headers,
    tmpl.sample,
  ];
  const csv = rows.map(r=>r.map(c=>'"'+String(c).replace(/"/g,'""')+'"').join(',')).join('\n');
  const blob = new Blob([csv],{type:'text/csv'});
  const a = document.createElement('a'); a.href=URL.createObjectURL(blob);
  a.download='leaftally-import-'+type+'-template.csv'; a.click();
  toast('Template downloaded: '+a.download);
}
