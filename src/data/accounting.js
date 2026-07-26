// ============================================================
// LeafTally — ACCOUNTING seed data
// Replace with real API calls in production
// ============================================================

// GL_ACCOUNTS
window.GL_ACCOUNTS = {
  '1000': {name:'Cash and cash equivalents', type:'Asset', normal:'D', balance:500000},
  '1100': {name:'Bank accounts',             type:'Asset', normal:'D', balance:5241375},
  '1200': {name:'Accounts receivable',       type:'Asset', normal:'D', balance:2227875},
  '1300': {name:'VAT receivable',            type:'Asset', normal:'D', balance:67200},
  '1500': {name:'Inventory',                 type:'Asset', normal:'D', balance:2793000},
  '1800': {name:'Fixed assets — cost',       type:'Asset', normal:'D', balance:35450000},
  '1810': {name:'Accumulated depreciation',  type:'Asset', normal:'C', balance:-7708750},
  '2000': {name:'Accounts payable',          type:'Liability', normal:'C', balance:-890000},
  '2100': {name:'VAT payable',               type:'Liability', normal:'C', balance:-142800},
  '2200': {name:'PAYE payable',              type:'Liability', normal:'C', balance:-592400},
  '2300': {name:'Pension payable',           type:'Liability', normal:'C', balance:-280000},
  '3000': {name:'Share capital',             type:'Equity',   normal:'C', balance:-5000000},
  '3100': {name:'Retained earnings',         type:'Equity',   normal:'C', balance:-33703000},
  '4000': {name:'Sales revenue',             type:'Income',   normal:'C', balance:-24200000},
  '4100': {name:'Service revenue',           type:'Income',   normal:'C', balance:0},
  '4200': {name:'Other income',              type:'Income',   normal:'C', balance:-120000},
  '5000': {name:'Cost of goods sold',        type:'Expense',  normal:'D', balance:10400000},
  '6000': {name:'Salaries & wages',          type:'Expense',  normal:'D', balance:10800000},
  '6100': {name:'Rent expense',              type:'Expense',  normal:'D', balance:2880000},
  '6200': {name:'Depreciation expense',      type:'Expense',  normal:'D', balance:1612500},
  '6300': {name:'Bank charges',              type:'Expense',  normal:'D', balance:45000},
  '6400': {name:'Other operating expenses',  type:'Expense',  normal:'D', balance:620000},
};

// JOURNAL_LEDGER
window.JOURNAL_LEDGER = [
  {ref:'JNL-2026-0094',date:'2026-06-23',type:'Sales',narr:'Invoice INV-0041 — Dangote Foods',status:'Posted',
   lines:[{acct:'1200',dr:483750,cr:0},{acct:'4000',dr:0,cr:483750}]},
  {ref:'JNL-2026-0093',date:'2026-06-22',type:'General',narr:'Month-end accruals — rent',status:'Posted',
   lines:[{acct:'6100',dr:240000,cr:0},{acct:'2000',dr:0,cr:240000}]},
  {ref:'JNL-2026-0092',date:'2026-06-21',type:'Purchase',narr:'Bill BILL-0045 — Conoil Nigeria',status:'Posted',
   lines:[{acct:'6400',dr:245000,cr:0},{acct:'2000',dr:0,cr:245000}]},
  {ref:'JNL-2026-0091',date:'2026-06-20',type:'Payroll',narr:'June payroll — 5 employees',status:'Posted',
   lines:[{acct:'6000',dr:1240000,cr:0},{acct:'1100',dr:0,cr:973400},{acct:'2200',dr:0,cr:167400},{acct:'2300',dr:0,cr:99200}]},
  {ref:'JNL-2026-0090',date:'2026-06-18',type:'General',narr:'Depreciation — June 2026',status:'Posted',
   lines:[{acct:'6200',dr:134375,cr:0},{acct:'1810',dr:0,cr:134375}]},
  {ref:'JNL-2026-0089',date:'2026-06-15',type:'Sales',narr:'Invoice INV-0040 — MTN Nigeria',status:'Draft',
   lines:[{acct:'1200',dr:247250,cr:0},{acct:'4000',dr:0,cr:247250}]},
];

// FINANCIAL_YEARS
window.FINANCIAL_YEARS = [
  {id:'FY2026', name:'FY 2026', start:'2026-01-01', end:'2026-12-31', status:'Open', current:true},
  {id:'FY2025', name:'FY 2025', start:'2025-01-01', end:'2025-12-31', status:'Closed', current:false},
];

// BUDGET_DATA
window.BUDGET_DATA = [
  {cat:'Salaries & wages',  gl:'6000', annual:14400000, h1:7200000,  actual:10800000, period:'H1'},
  {cat:'Rent expense',       gl:'6100', annual:3600000,  h1:1800000,  actual:2880000,  period:'H1'},
  {cat:'Cost of goods sold', gl:'5000', annual:22000000, h1:11000000, actual:10400000, period:'H1'},
  {cat:'IT & software',      gl:'6400', annual:840000,   h1:420000,   actual:650000,   period:'H1'},
  {cat:'Marketing & sales',  gl:'6400', annual:1200000,  h1:600000,   actual:350000,   period:'H1'},
  {cat:'Training',           gl:'6400', annual:480000,   h1:240000,   actual:0,        period:'H1'},
  {cat:'Bank charges',       gl:'6300', annual:90000,    h1:45000,    actual:45000,    period:'H1'},
  {cat:'Depreciation',       gl:'6200', annual:3225000,  h1:1612500,  actual:1612500,  period:'H1'},
];
