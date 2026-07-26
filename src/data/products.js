// ============================================================
// LeafTally — PRODUCTS seed data
// Replace with real API calls in production
// ============================================================

// PRODUCTS
window.PRODUCTS = [
  {sku:'SKU-001',name:'Office Chair',price:85000,vat:7.5,wht:0,cat:'Furniture'},
  {sku:'SKU-002',name:'HP ProBook Laptop',price:650000,vat:7.5,wht:0,cat:'Electronics'},
  {sku:'SKU-003',name:'Generator diesel (20L)',price:28000,vat:7.5,wht:0,cat:'Consumables'},
  {sku:'SRV-001',name:'IT Consulting (hr)',price:150000,vat:7.5,wht:5,cat:'Services'},
  {sku:'SRV-002',name:'Accounting services',price:200000,vat:7.5,wht:5,cat:'Services'},
  {sku:'SKU-004',name:'Printer paper (ream)',price:4500,vat:7.5,wht:0,cat:'Consumables'},
  {sku:'SKU-005',name:'USB Hub 7-port',price:8500,vat:7.5,wht:0,cat:'Electronics'},
  {sku:'MAT-001',name:'Steel sheet 2mm (sqm)',price:12500,vat:7.5,wht:0,cat:'Materials'},
];

// BOM_DB
window.BOM_DB = [
  {ref:'BOM-001', product:'Custom Server Rack', rev:'v2', status:'Active', cost:285000,
   components:[
     {code:'MAT-001', name:'Steel sheet 2mm', qty:4, uom:'Sqm',   cost:12500},
     {code:'MAT-002', name:'Aluminium bar 50mm', qty:2, uom:'Metre', cost:8750},
     {code:'SKU-006', name:'Ventilation fans', qty:6, uom:'Each',  cost:12000},
     {code:'SKU-007', name:'Mounting rails', qty:8, uom:'Each',   cost:8500},
   ]},
  {ref:'BOM-002', product:'Industrial Generator', rev:'v1', status:'Active', cost:1240000,
   components:[
     {code:'SKU-004', name:'Engine assembly', qty:1, uom:'Each', cost:850000},
     {code:'MAT-003', name:'Engine oil (5L)', qty:4, uom:'Each', cost:18000},
     {code:'SKU-008', name:'Fuel tank 50L', qty:1, uom:'Each', cost:45000},
   ]},
  {ref:'BOM-003', product:'Network Cabinet', rev:'v1', status:'Draft', cost:95000,
   components:[
     {code:'MAT-001', name:'Steel sheet 2mm', qty:2, uom:'Sqm', cost:12500},
     {code:'SKU-009', name:'Cable management rails', qty:4, uom:'Each', cost:5500},
   ]},
];

// PROD_ORDERS_DB
window.PROD_ORDERS_DB = [
  {ref:'PRD-019', product:'Custom Server Rack', bom:'BOM-001', qty:2, start:'2026-06-15', due:'2026-06-30', status:'In progress', cost:570000},
  {ref:'PRD-018', product:'Industrial Generator', bom:'BOM-002', qty:1, start:'2026-06-01', due:'2026-06-20', status:'Complete', cost:1240000},
  {ref:'PRD-017', product:'Network Cabinet', bom:'BOM-003', qty:5, start:'2026-06-10', due:'2026-06-25', status:'In progress', cost:475000},
  {ref:'PRD-016', product:'Custom Server Rack', bom:'BOM-001', qty:1, start:'2026-05-20', due:'2026-06-05', status:'Complete', cost:285000},
];

// COST_GROUPS
window.COST_GROUPS = [
  {
    id: 'CG-001',
    name: 'Server rack assembly — June batch',
    method: 'equal',          // equal | weighted | quantity
    totalCost: 855000,
    products: [
      {sku:'SKU-001', name:'Custom Server Rack 12U', qty:3, weight:40, allocated:0},
      {sku:'SKU-002', name:'Network Cabinet 9U',     qty:2, weight:35, allocated:0},
      {sku:'SKU-003', name:'Cable Management Panel', qty:5, weight:25, allocated:0},
    ],
    createdBy: 'Amaka Adeyemi',
    date: '2026-06-15',
    status: 'Posted'
  },
  {
    id: 'CG-002',
    name: 'Generator components — Q2 import',
    method: 'weighted',
    totalCost: 1240000,
    products: [
      {sku:'SKU-004', name:'Industrial Generator 50kVA', qty:1, weight:70, allocated:0},
      {sku:'SKU-005', name:'Generator Control Panel',    qty:1, weight:20, allocated:0},
      {sku:'SKU-006', name:'Fuel Management Unit',       qty:2, weight:10, allocated:0},
    ],
    createdBy: 'Chukwuemeka Obi',
    date: '2026-06-20',
    status: 'Draft'
  }
];
