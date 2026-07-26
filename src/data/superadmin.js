// ============================================================
// LeafTally — SUPERADMIN seed data
// Replace with real API calls in production
// ============================================================

// SA_TENANTS
window.SA_TENANTS = [
  {id:'T-001',name:'Acme Trading Ltd',plan:'Pro',users:5,status:'Active',revenue:85000,joined:'2024-03-15',country:'NG',lastLogin:'Today'},
  {id:'T-002',name:'Lagos Bakeries Ltd',plan:'Starter',users:2,status:'Active',revenue:12000,joined:'2024-08-20',country:'NG',lastLogin:'Yesterday'},
  {id:'T-003',name:'VicTech Solutions',plan:'Pro',users:8,status:'Active',revenue:102000,joined:'2023-11-01',country:'NG',lastLogin:'2 days ago'},
  {id:'T-004',name:'Conoil Nigeria (Demo)',plan:'Enterprise',users:24,status:'Active',revenue:450000,joined:'2023-06-10',country:'NG',lastLogin:'Today'},
  {id:'T-005',name:'Northern Agro Ltd',plan:'Starter',users:1,status:'Trial',revenue:0,joined:'2026-07-01',country:'NG',lastLogin:'Today'},
  {id:'T-006',name:'Sunshine Events Co.',plan:'Pro',users:4,status:'Suspended',revenue:34000,joined:'2024-01-15',country:'NG',lastLogin:'14 days ago'},
  {id:'T-007',name:'BlueLine Logistics',plan:'Enterprise',users:15,status:'Active',revenue:280000,joined:'2023-09-01',country:'NG',lastLogin:'3 days ago'},
];

// SA_PLATFORM
window.SA_PLATFORM = {
  totalTenants: 127,
  activeTenants: 119,
  trialTenants: 8,
  mrr: 4850000,
  mrrGrowth: 18,
  totalUsers: 847,
  avgUsersPerTenant: 6.7,
  storageUsedGB: 234,
  apiCallsToday: 128400,
};

// BANNER_DATA
window.BANNER_DATA = [
  {id:'BNR-001',title:'System maintenance window',msg:'Scheduled maintenance on 28 Jul 2026 02:00–04:00 WAT. Read-only mode during this period.',type:'warning',target:'All tenants',active:true,created:'24 Jul 2026'},
  {id:'BNR-002',title:'New feature: Shared costing',msg:'You can now pool costs across multiple products using our new Shared Costing feature. Try it in Products & Services.',type:'info',target:'All tenants',active:true,created:'20 Jul 2026'},
  {id:'BNR-003',title:'FIRS e-Invoicing deadline',msg:'Mandatory FIRS e-Invoicing starts 1 September 2026. Ensure your API key is configured in Settings.',type:'alert',target:'Nigeria tenants',active:false,created:'15 Jul 2026'},
];

// RELEASE_DATA
window.RELEASE_DATA = [
  {ver:'v2.4.1',date:'20 Jun 2026',type:'patch',summary:'Bug fixes & performance improvements',items:['Fixed FIRS submission retry logic on timeout errors','Improved payroll PDF generation speed by 40%','Corrected VAT rounding on multi-currency invoices','Fixed dashboard widget drag-and-drop on Firefox']},
  {ver:'v2.4.0',date:'05 Jun 2026',type:'minor',summary:'Shared costing, enhanced dimensions, and tour',items:['New: Shared / joint product costing with equal, weighted, and quantity split methods','Improved: Dimensions now support custom types with module assignment','New: Enhanced onboarding tour accessible from help button','Improved: Settings now has 7 tabs including currency management and ledger integrity check','Fixed: Dashboard panel closing tag issue causing blank modules']},
  {ver:'v2.3.0',date:'12 May 2026',type:'minor',summary:'Accountant Partner, Audit trail, Multi-entity',items:['New: Accountant Partner portal for managing multiple client tenants','New: Full audit trail with 12-entry log and CSV export','New: Multi-entity with consolidation and elimination entries','New: QuickBooks, Sage, Xero, Zoho import wizards','Improved: Navigation — unified nav() function, no more panel-not-found errors']},
];

// REFERRALS
window.REFERRALS = [
  {id:'REF-019',referrer:'Amaka Adeyemi',tenant:'Acme Trading Ltd',referred:'Sunshine Events Co.',status:'Converted',commission:8500,date:'2024-01-15'},
  {id:'REF-018',referrer:'Chidi Okafor',tenant:'Lagos Bakeries Ltd',referred:'Northern Agro Ltd',status:'Trial',commission:0,date:'2026-07-01'},
  {id:'REF-017',referrer:'Amaka Adeyemi',tenant:'Acme Trading Ltd',referred:'BlueLine Logistics',status:'Converted',commission:24000,date:'2023-09-01'},
];

// PLAN_DEFS
window.PLAN_DEFS = {
  starter: {
    id:'starter', name:'Starter', price:25000, annualPrice:250000,
    users:5, storage:'5 GB', apiCalls:0, color:'#6B7280',
    tagline:'Perfect for solo traders and micro businesses',
    features:{
      Accounting:['Chart of accounts (50 accounts)','Journal entries','Basic P&L and balance sheet','Bank reconciliation (1 account)'],
      Sales:['Invoices (50/month)','Customers (up to 100)','Basic invoice PDF'],
      Purchases:['Bills (30/month)','Suppliers (up to 50)'],
      Support:['Email support (48h)','Training manual'],
    },
    limits:{invoices:50,bills:30,customers:100,suppliers:50,users:5,bankAccounts:1},
    excluded:['Payroll','Fixed assets','FIRS e-invoicing','Multi-entity','API access','Audit trail','Budget planner','Inventory & production'],
  },
  business: {
    id:'business', name:'Business', price:65000, annualPrice:650000,
    users:15, storage:'25 GB', apiCalls:0, color:'#16a34a',
    tagline:'For growing Nigerian SMEs needing full accounting',
    popular: true,
    features:{
      'Accounting (full)':['Unlimited GL accounts','Full P&L, balance sheet, cash flow','Trial balance & budget planner','Revenue recognition (IFRS 15)','Year-end close','Expense claims'],
      'Sales & Invoicing':['Unlimited invoices','FIRS e-invoicing','Credit notes','Aged receivables'],
      'Purchases':['Unlimited bills','Purchase orders','Landed costs'],
      'HR & Payroll':['Employee register','PAYE payroll (FIRS graduated)','Pension 8% & NHF 2.5%','Payslip PDFs'],
      'Inventory':['Products & BOM','Production orders','FIFO layers','Shared costing'],
      'Support':['Priority email (8h)','Live chat','Onboarding session'],
    },
    limits:{invoices:9999,bills:9999,customers:9999,suppliers:9999,users:15,bankAccounts:10},
    excluded:['Multi-entity consolidation','API & webhooks','Dedicated account manager'],
  },
  enterprise: {
    id:'enterprise', name:'Enterprise', price:150000, annualPrice:1500000,
    users:999, storage:'Unlimited', apiCalls:100000, color:'#1d4ed8',
    tagline:'For large organisations and multi-entity groups',
    features:{
      'Everything in Business, plus':'',
      'Platform':['Unlimited users','Multi-entity consolidation','Consolidated financials','Intercompany eliminations'],
      'Integration':['REST API (100K calls/month)','Webhooks (30+ event types)','SSO / SAML','NIBSS bulk payments'],
      'Analytics':['Advanced usage analytics','Custom report builder','Full audit trail'],
      'Support':['Dedicated account manager','4-hour SLA','Quarterly business reviews'],
    },
    limits:{invoices:9999999,bills:9999999,customers:9999999,suppliers:9999999,users:999,bankAccounts:999},
    excluded:[],
  },
};

// SUB_REQUESTS
window.SUB_REQUESTS = [
  {id:'SR-007',tenant:'T-005',tenantName:'Northern Agro Ltd',plan:'business',status:'payment_uploaded',currentPlan:'trial',
   requested:'2026-07-20',paymentDate:'2026-07-22',amount:65000,ref:'BANK-TXN-77421',
   bankFrom:'Zenith Bank · ACC 4455667788',receipt:'receipt_SR007.pdf',notes:'Upgrading from trial to Business plan',approvedBy:null},
  {id:'SR-006',tenant:'T-002',tenantName:'Lagos Bakeries Ltd',plan:'business',status:'approved',currentPlan:'starter',
   requested:'2026-07-15',paymentDate:'2026-07-16',amount:65000,ref:'BANK-TXN-71204',
   bankFrom:'GTBank · ACC 0123456789',receipt:'receipt_SR006.pdf',notes:'Upgrade from Starter to Business',approvedBy:'admin@leaftally.io'},
  {id:'SR-005',tenant:'T-006',tenantName:'Sunshine Events Co.',plan:'business',status:'awaiting_payment',currentPlan:'starter',
   requested:'2026-07-10',paymentDate:null,amount:65000,ref:null,
   bankFrom:null,receipt:null,notes:'',approvedBy:null},
  {id:'SR-004',tenant:'T-003',tenantName:'VicTech Solutions',plan:'enterprise',status:'approved',currentPlan:'business',
   requested:'2026-06-25',paymentDate:'2026-06-26',amount:150000,ref:'BANK-TXN-65012',
   bankFrom:'First Bank · ACC 9988776655',receipt:'receipt_SR004.pdf',notes:'Enterprise upgrade',approvedBy:'admin@leaftally.io'},
];

// TENANT_USAGE
window.TENANT_USAGE = [
  {id:'T-001',name:'Acme Trading Ltd',plan:'Business',users:5,invoices:41,bills:45,journals:94,payrollRuns:6,posSales:219,employees:5,lastActive:'Today',dau:5,storage:'4.2 GB',apiCalls:0,loginDays:24},
  {id:'T-002',name:'Lagos Bakeries Ltd',plan:'Starter',users:2,invoices:28,bills:18,journals:34,payrollRuns:3,posSales:88,employees:3,lastActive:'Yesterday',dau:2,storage:'0.8 GB',apiCalls:0,loginDays:18},
  {id:'T-003',name:'VicTech Solutions',plan:'Enterprise',users:8,invoices:87,bills:62,journals:201,payrollRuns:6,posSales:0,employees:14,lastActive:'2 days ago',dau:6,storage:'12.1 GB',apiCalls:8420,loginDays:26},
  {id:'T-004',name:'Conoil Nigeria (Demo)',plan:'Enterprise',users:24,invoices:214,bills:189,journals:542,payrollRuns:6,posSales:1240,employees:67,lastActive:'Today',dau:18,storage:'34.8 GB',apiCalls:42100,loginDays:30},
  {id:'T-005',name:'Northern Agro Ltd',plan:'Trial',users:1,invoices:4,bills:2,journals:8,payrollRuns:0,posSales:0,employees:2,lastActive:'Today',dau:1,storage:'0.1 GB',apiCalls:0,loginDays:3},
  {id:'T-006',name:'Sunshine Events Co.',plan:'Starter',users:4,invoices:12,bills:8,journals:22,payrollRuns:2,posSales:34,employees:4,lastActive:'14 days ago',dau:0,storage:'0.6 GB',apiCalls:0,loginDays:4},
  {id:'T-007',name:'BlueLine Logistics',plan:'Enterprise',users:15,invoices:156,bills:134,journals:389,payrollRuns:6,posSales:0,employees:42,lastActive:'3 days ago',dau:11,storage:'22.4 GB',apiCalls:21300,loginDays:28},
];

// ACCOUNTANT_CLIENTS: not found in source
