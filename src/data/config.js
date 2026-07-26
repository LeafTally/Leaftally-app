// ============================================================
// LeafTally — CONFIG seed data
// Replace with real API calls in production
// ============================================================

// PICKLISTS
window.PICKLISTS = {
  uom:['Each','Kg','Litre','Metre','Sqm','Box','Carton','Set','Hour','Day','Month'],
  productCats:['Electronics','Furniture','Consumables','Services','Materials','Software','Other'],
  deptList:['Finance','Sales','HR','Operations','IT','Management','Production'],
  paymentTerms:['Net 30','Net 60','Net 15','Due on receipt','50% upfront'],
  currencies:['NGN','USD','GBP','EUR','GHS','ZAR'],
  bankNames:['GTBank','Zenith Bank','First Bank','UBA','Access Bank','FCMB','Stanbic IBTC','Keystone Bank','Polaris Bank','Sterling Bank'],
  taxTypes:['VAT 7.5%','VAT 0% (Exempt)','WHT 5%','WHT 10%','None'],
  journalTypes:['General','Sales','Purchase','Payroll','Depreciation','Tax','Reversal','Opening balance'],
  expenseCategories:['Travel & accommodation','Client entertainment','IT & software','Training','Office supplies','Medical','Other'],
  invoiceStatuses:['Draft','Sent','Paid','Overdue','Cancelled'],
  billStatuses:['Draft','Pending','Approved','Paid','Overdue'],
  employeeStatuses:['Active','On leave','Suspended','Inactive'],
  assetStatuses:['In use','Idle','Disposed','Under maintenance'],
  shipmentStatuses:['Pending','In transit','Received','Cancelled'],
  incoterms:['EXW','FOB','CIF','DDP','DAP','FCA'],
  dimensionTypes:['Department','Project','Region','Cost centre','Business unit'],
  bomStatuses:['Active','Draft','Archived'],
  productionStatuses:['Draft','In progress','Complete','Cancelled'],
  adjustmentTypes:['Write-down','Write-off','Recount','Consumption','Donation','Return'],
  assetCats:[
    {name:"Plant & machinery",       depRate:10, depMethod:"Straight-line"},
    {name:"Motor vehicles",          depRate:20, depMethod:"Straight-line"},
    {name:"IT equipment",            depRate:25, depMethod:"Declining balance"},
    {name:"Furniture & fittings",    depRate:10, depMethod:"Straight-line"},
    {name:"Land & buildings",        depRate:2,  depMethod:"Straight-line"},
    {name:"Office equipment",        depRate:15, depMethod:"Straight-line"},
    {name:"Leasehold improvements",  depRate:10, depMethod:"Straight-line"},
    {name:"Intangible assets",       depRate:20, depMethod:"Straight-line"},
  ],
};

// PAGES
window.PAGES = {
  dashboard:'Dashboard', sadashboard:'SA Dashboard', coa:'Chart of accounts', gl:'Journal entries',
  ledger:'Account ledger', reports:'Financial reports', invoices:'Invoices', clients:'Customers',
  bills:'Bills', suppliers:'Suppliers', employees:'Employees', payroll:'Payroll',
  expenses:'Expense claims', inventory:'Products & services', materials:'Materials',
  pos:'POS / Retail', users:'Users', roles:'Role management', settings:'Settings',
  tickets:'Support tickets', profile:'My profile', subscription:'My subscription',
  billing:'Billing history', yearend:'Year-end close', trial:'Trial balance',
  pnl:'P&L', cashflow:'Cash flow', balancesheet:'Balance sheet', health:'Financial health',
  banking:'Banking', budget:'Budget planner', revrec:'Revenue recognition',
  assets:'Fixed assets', projects:'Projects', bom:'Bill of materials',
  prodorders:'Production orders', invadjust:'Inventory adjustments',
  invlayers:'Inventory layers', shipments:'Shipments & landed costs',
  dimensions:'Dimensions', audittrail:'Audit trail', multientity:'Multi-entity',
  clientsubmission:'Client submission', accountant:'Accountant partner', referral:'Referral program',
  doccenter:'Document centre', testguide:'Testing guide', superadmin:'Super admin',
  useranalytics:'User analytics', migration:'Data migration', integrations:'Integrations',
  banners:'Banner messages', chat:'Live chat', releasenotes:'Release notes',
  training:'Training manual', legal:'Legal',
};

// DIMENSIONS_DB
window.DIMENSIONS_DB = [
  {code:'CC-001', name:'Finance',             type:'Department',  budget:8000000,  actual:7680000,  manager:'Chukwuemeka Obi'},
  {code:'CC-002', name:'Sales',               type:'Department',  budget:6000000,  actual:5240000,  manager:'Babatunde Adeyemi'},
  {code:'CC-003', name:'Operations',          type:'Department',  budget:12000000, actual:11050000, manager:'Amaka Adeyemi'},
  {code:'CC-004', name:'IT',                  type:'Department',  budget:3000000,  actual:2850000,  manager:'Kelechi Okonkwo'},
  {code:'PRJ-001', name:'ERP Implementation', type:'Project',     budget:12000000, actual:4200000,  manager:'Amaka Adeyemi'},
  {code:'RGN-001', name:'Lagos',              type:'Region',      budget:18000000, actual:15440000, manager:'Amaka Adeyemi'},
];

// DOCS_DB
window.DOCS_DB = [
  {id:'DOC-001', name:'Incorporation Certificate', type:'Legal', size:'2.4 MB', date:'2019-03-15', tags:['Legal','Company']},
  {id:'DOC-002', name:'FIRS TIN Certificate', type:'Tax', size:'1.1 MB', date:'2020-06-01', tags:['Tax','FIRS']},
  {id:'DOC-003', name:'CAC Annual Returns 2025', type:'Compliance', size:'3.8 MB', date:'2025-12-01', tags:['CAC','Annual']},
  {id:'DOC-004', name:'Audited Accounts FY 2025', type:'Financial', size:'8.2 MB', date:'2026-03-30', tags:['Audit','FY2025']},
  {id:'DOC-005', name:'Bank Mandate — GTBank', type:'Banking', size:'0.8 MB', date:'2023-01-10', tags:['Bank','Mandate']},
  {id:'DOC-006', name:'Office Lease Agreement', type:'Legal', size:'5.1 MB', date:'2024-01-01', tags:['Lease','Legal']},
  {id:'DOC-007', name:'VAT Registration Certificate', type:'Tax', size:'0.9 MB', date:'2020-07-15', tags:['VAT','FIRS']},
  {id:'DOC-008', name:'Payroll PAYE Schedule Jun 2026', type:'HR', size:'1.2 MB', date:'2026-06-25', tags:['Payroll','PAYE']},
];
