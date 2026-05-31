import React, { useState, useEffect, useRef } from "react";

// ── CONSTANTS ────────────────────────────────────────────────────────────────
const SERVICES = [
  { id:1, icon:"🧹", name:"Bersih-Bersih", desc:"Rumah, kantor, kos",     basePrice:75000,  cat:"Rumah",      dur:"2-3 jam",    surge:1.0 },
  { id:2, icon:"🛒", name:"Belanja",        desc:"Kebutuhan harian",       basePrice:30000,  cat:"Belanja",    dur:"1-2 jam",    surge:1.0 },
  { id:3, icon:"📦", name:"Antar Barang",   desc:"Dalam kota, cepat",     basePrice:25000,  cat:"Pengiriman", dur:"30-60 mnt",  surge:1.2 },
  { id:4, icon:"🔧", name:"Perbaikan",      desc:"Listrik, pipa, AC",     basePrice:120000, cat:"Teknik",     dur:"1-3 jam",    surge:1.0 },
  { id:5, icon:"🍳", name:"Masak",          desc:"Masakan rumahan",        basePrice:90000,  cat:"Rumah",      dur:"2-3 jam",    surge:1.0 },
  { id:6, icon:"🚗", name:"Cuci Kendaraan", desc:"Mobil & motor",          basePrice:50000,  cat:"Kendaraan",  dur:"30-45 mnt",  surge:1.0 },
  { id:7, icon:"👶", name:"Jaga Anak",      desc:"Babysitter terpercaya",  basePrice:100000, cat:"Perawatan",  dur:"per jam",    surge:1.0 },
  { id:8, icon:"🌿", name:"Taman",          desc:"Potong rumput, tanam",   basePrice:80000,  cat:"Rumah",      dur:"2-4 jam",    surge:1.0 },
];

const TIERS = { bronze:"🥉", silver:"🥈", gold:"🥇", platinum:"💎" };
const getTier = jobs => jobs >= 300 ? "platinum" : jobs >= 200 ? "gold" : jobs >= 100 ? "silver" : "bronze";

const WORKERS = [
  { id:1, name:"Ahmad Fauzi",    rating:4.9, jobs:234, avatar:"👨‍🔧", specialty:"Perbaikan & Teknik", status:"online",  dist:1.2, verified:true,  joined:"Jan 2023", nextSlot:"Sekarang",
    skills:["Listrik","Pipa","AC","Elektronik"], portfolio:["🏠 Renovasi dapur","⚡ Instalasi listrik","🚿 Perbaikan pipa"],
    reviews:[{user:"Rina S.",text:"Cepat dan rapi!",rating:5,date:"15 Mei"},{user:"Budi T.",text:"Profesional!",rating:5,date:"12 Mei"}],
    weeklyStats:[3,5,4,6,5,7,4], otpCode:"4821" },
  { id:2, name:"Sari Wulandari", rating:4.8, jobs:189, avatar:"👩‍🍳", specialty:"Masak & Bersih",    status:"online",  dist:2.1, verified:true,  joined:"Mar 2023", nextSlot:"13:00",
    skills:["Memasak","Bersih","Setrika","Belanja"], portfolio:["🍳 Catering 50 porsi","🧹 Deep cleaning","🌿 Taman kecil"],
    reviews:[{user:"Dewi P.",text:"Masakan enak!",rating:5,date:"17 Mei"},{user:"Andi R.",text:"Sangat teliti.",rating:4,date:"10 Mei"}],
    weeklyStats:[4,3,5,4,6,5,3], otpCode:"7263" },
  { id:3, name:"Doni Prasetyo",  rating:4.7, jobs:156, avatar:"🧑‍💼", specialty:"Antar & Belanja",  status:"busy",    dist:3.4, verified:true,  joined:"Jun 2023", nextSlot:"15:30",
    skills:["Pengiriman","Belanja","Antar jemput","Logistik"], portfolio:["📦 Kirim dokumen","🛒 Belanja bulanan","🚗 Antar jemput"],
    reviews:[{user:"Citra M.",text:"Cepat sampai!",rating:5,date:"16 Mei"}],
    weeklyStats:[2,4,3,5,4,6,3], otpCode:"5519" },
];

const PAYMENT_METHODS = [
  {id:"wallet",icon:"⚡",name:"TaskKu Wallet",desc:"Saldo Anda"},
  {id:"dana",  icon:"💙",name:"DANA",         desc:"Dompet digital"},
  {id:"gopay", icon:"💚",name:"GoPay",        desc:"Dompet digital"},
  {id:"ovo",   icon:"💜",name:"OVO",          desc:"Dompet digital"},
  {id:"bca",   icon:"🏦",name:"BCA Virtual",  desc:"Transfer bank"},
  {id:"cod",   icon:"💵",name:"COD",          desc:"Bayar di tempat"},
];

const SAVED_ADDR_INIT = [
  {id:1,label:"🏠 Rumah",  address:"Jl. Sudirman No.12, Jakarta Pusat"},
  {id:2,label:"🏢 Kantor", address:"Jl. Thamrin No.5, Jakarta Pusat"},
  {id:3,label:"👨‍👩‍👧 Orang Tua", address:"Jl. Gatot Subroto No.8, Jakarta Selatan"},
];

const INIT_ORDERS = [
  {id:"ORD-001",service:"Bersih-Bersih",icon:"🧹",customer:"Anda",workerId:1,status:"done",        date:"17 Mei",time:"10:30",price:75000, address:"Jl. Sudirman No.12",   rated:true, recurring:null,   photos:["before","after"]},
  {id:"ORD-002",service:"Antar Barang", icon:"📦",customer:"Anda",workerId:3,status:"in_progress",date:"18 Mei",time:"11:00",price:30000, address:"Jl. Thamrin No.5",     rated:false,recurring:null,   photos:["before"]},
  {id:"ORD-003",service:"Masak",        icon:"🍳",customer:"Anda",workerId:2,status:"waiting",     date:"18 Mei",time:"12:00",price:90000, address:"Jl. Gatot Subroto No.8",rated:false,recurring:"weekly",photos:[]},
  {id:"ORD-004",service:"Bersih-Bersih",icon:"🧹",customer:"Anda",workerId:1,status:"done",        date:"10 Mei",time:"09:00",price:75000, address:"Jl. Sudirman No.12",   rated:true, recurring:null,   photos:["before","after"]},
  {id:"ORD-005",service:"Perbaikan",    icon:"🔧",customer:"Anda",workerId:1,status:"done",        date:"5 Mei", time:"14:00",price:120000,address:"Jl. Sudirman No.12",   rated:true, recurring:null,   photos:["before","after"]},
];

const INIT_NOTIFS = [
  {id:1,icon:"✅",title:"Pesanan Diterima!",     body:"Ahmad Fauzi menerima pesananmu.",         time:"2 mnt lalu",read:false},
  {id:2,icon:"🔑",title:"OTP Konfirmasi",         body:"Kode OTP untuk ORD-002: 5519",           time:"5 mnt lalu",read:false},
  {id:3,icon:"📸",title:"Foto Progress Dikirim", body:"Doni kirim foto progress ORD-002.",       time:"8 mnt lalu",read:false},
  {id:4,icon:"💎",title:"Upgrade ke Pro!",        body:"Hemat biaya layanan dengan TaskKu Pro.", time:"1 jam lalu",read:true },
];

const INIT_CHATS = {
  "ORD-002":[{from:"worker",text:"Barang sudah saya ambil, dalam perjalanan 🚗",time:"11:05"}],
  "ORD-003":[{from:"worker",text:"Halo! Saya Sari, siap masak hari ini 🍳",time:"11:55"},{from:"customer",text:"Menu ada di meja dapur ya!",time:"11:57"}],
};

const SPENDING_DATA = [
  {month:"Jan",amount:195000},{month:"Feb",amount:320000},{month:"Mar",amount:165000},
  {month:"Apr",amount:425000},{month:"Mei",amount:345000},
];

const WEEKLY_EARN = [
  {day:"Sen",amt:125000},{day:"Sel",amt:230000},{day:"Rab",amt:95000},
  {day:"Kam",amt:310000},{day:"Jum",amt:180000},{day:"Sab",amt:450000},{day:"Min",amt:215000},
];

const ANALYTICS = {
  revenueBycat: [{cat:"Rumah",val:820000},{cat:"Teknik",val:540000},{cat:"Belanja",val:310000},{cat:"Pengiriman",val:275000},{cat:"Lainnya",val:155000}],
  conversionRate: 68,
  churnRate: 12,
  avgResponseTime: "4.2 mnt",
  heatmap: [3,7,9,5,8,12,15,18,14,10,7,5,9,13,17,20,16,11,8,6,4,7,10,6],
};

const MEMBERSHIP_PLANS = [
  {id:"free",   name:"Gratis",       price:0,      color:"#7799BB", features:["Akses semua layanan","Biaya layanan 5%","Support reguler"]},
  {id:"pro",    name:"TaskKu Pro",   price:50000,  color:"#FF5722", features:["Biaya layanan 0%","Prioritas antrian","Diskon 10% semua layanan","Support prioritas 24/7","Badge Pro ⚡"], popular:true},
  {id:"bisnis", name:"Bisnis",       price:150000, color:"#FFC107", features:["Semua fitur Pro","5 akun pekerja tetap","Laporan bulanan","Invoice otomatis","Account manager"]},
];

const fmt  = n => "Rp "+Number(n).toLocaleString("id-ID");
const tick = () => new Date().toLocaleTimeString("id-ID",{hour:"2-digit",minute:"2-digit"});

// ── CSS ───────────────────────────────────────────────────────────────────────
const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:wght@300;400;500&display=swap');
*{box-sizing:border-box;margin:0;padding:0}
body{background:#0C0C14;color:#F0F0F0;font-family:'DM Sans',sans-serif}
::-webkit-scrollbar{width:5px}::-webkit-scrollbar-track{background:#111}::-webkit-scrollbar-thumb{background:#FF5722;border-radius:3px}

.nav{background:rgba(12,12,20,.97);backdrop-filter:blur(24px);padding:0 18px;height:58px;display:flex;align-items:center;justify-content:space-between;border-bottom:1px solid rgba(255,87,34,.11);position:sticky;top:0;z-index:300}
.logo{font-family:'Syne',sans-serif;font-weight:800;font-size:19px;background:linear-gradient(135deg,#FF5722,#FFC107);-webkit-background-clip:text;-webkit-text-fill-color:transparent;cursor:pointer;flex-shrink:0}
.ntabs{display:flex;gap:1px;overflow-x:auto;-webkit-overflow-scrolling:touch}
.ntabs::-webkit-scrollbar{display:none}
.nt{padding:5px 10px;border-radius:6px;border:none;cursor:pointer;font-family:'DM Sans',sans-serif;font-size:11px;font-weight:500;background:transparent;color:#7799BB;transition:all .18s;white-space:nowrap;flex-shrink:0}
.nt:hover{color:#F0F0F0;background:rgba(255,255,255,.05)}
.nt.on{background:#FF5722;color:#fff}
.navr{display:flex;align-items:center;gap:6px;flex-shrink:0}
.nbtn{position:relative;width:32px;height:32px;border-radius:8px;background:rgba(255,255,255,.06);border:none;cursor:pointer;font-size:14px;display:flex;align-items:center;justify-content:center}
.nbadge{position:absolute;top:-2px;right:-2px;width:14px;height:14px;background:#FF5722;border-radius:50%;font-size:8px;color:#fff;display:flex;align-items:center;justify-content:center;font-weight:700}
.bsm{padding:6px 12px;border-radius:7px;border:none;cursor:pointer;font-family:'DM Sans',sans-serif;font-size:11px;font-weight:600;transition:all .18s}
.borg{background:linear-gradient(135deg,#FF5722,#E64A19);color:#fff;box-shadow:0 3px 10px rgba(255,87,34,.27)}
.borg:hover{transform:translateY(-1px);box-shadow:0 5px 15px rgba(255,87,34,.37)}
.bgh{background:rgba(255,255,255,.07);color:#bbb;border:1px solid rgba(255,255,255,.09)}
.bgh:hover{background:rgba(255,255,255,.11);color:#fff}

/* HERO */
.hero{padding:44px 18px 28px;text-align:center;background:radial-gradient(ellipse at 20% 60%,rgba(255,87,34,.11) 0%,transparent 55%),radial-gradient(ellipse at 80% 20%,rgba(255,193,7,.07) 0%,transparent 50%);position:relative;overflow:hidden}
.hero::before{content:'';position:absolute;inset:0;background-image:radial-gradient(rgba(255,255,255,.02) 1px,transparent 1px);background-size:26px 26px;pointer-events:none}
.hero h1{font-family:'Syne',sans-serif;font-size:clamp(22px,4.5vw,48px);font-weight:800;line-height:1.08;margin-bottom:9px;background:linear-gradient(135deg,#fff 0%,#FF8A65 45%,#FFC107 100%);-webkit-background-clip:text;-webkit-text-fill-color:transparent}
.hero p{color:#7799BB;font-size:13px;max-width:400px;margin:0 auto 22px;line-height:1.6}
.hbtns{display:flex;gap:7px;justify-content:center;flex-wrap:wrap}
.blg{padding:11px 22px;border-radius:10px;border:none;cursor:pointer;font-family:'DM Sans',sans-serif;font-weight:600;font-size:12px;transition:all .18s}
.blg.org{background:linear-gradient(135deg,#FF5722,#E64A19);color:#fff;box-shadow:0 5px 18px rgba(255,87,34,.32)}
.blg.org:hover{transform:translateY(-2px);box-shadow:0 9px 22px rgba(255,87,34,.42)}
.blg.out{background:transparent;color:#F0F0F0;border:1.5px solid rgba(255,255,255,.13)}
.blg.out:hover{border-color:#FF5722;color:#FF5722}
.blg.grn{background:linear-gradient(135deg,#4CAF50,#388E3C);color:#fff}
.blg.gold{background:linear-gradient(135deg,#FFC107,#F57F17);color:#000}

/* TRUST */
.trust{display:flex;gap:6px;justify-content:center;flex-wrap:wrap;padding:0 18px 20px;max-width:1060px;margin:0 auto}
.tbadge{display:flex;align-items:center;gap:5px;background:rgba(255,255,255,.04);border:1px solid rgba(255,255,255,.07);border-radius:28px;padding:5px 12px;font-size:10px;color:#aaa}
.tbadge.g{border-color:rgba(76,175,80,.22);color:#4CAF50;background:rgba(76,175,80,.05)}
.tbadge.o{border-color:rgba(255,87,34,.22);color:#FF8A65;background:rgba(255,87,34,.05)}

/* PRO BADGE */
.pro-badge{background:linear-gradient(135deg,#FF5722,#FFC107);border-radius:4px;padding:1px 5px;font-size:9px;font-weight:700;color:#fff;margin-left:4px}

/* STATS */
.stats{display:flex;justify-content:center;flex-wrap:wrap;padding:0 18px 28px}
.stat{text-align:center;padding:10px 18px;border-right:1px solid rgba(255,255,255,.05)}
.stat:last-child{border-right:none}
.sn{font-family:'Syne',sans-serif;font-size:20px;font-weight:800;background:linear-gradient(135deg,#FF5722,#FFC107);-webkit-background-clip:text;-webkit-text-fill-color:transparent}
.sl{color:#7799BB;font-size:9px;margin-top:2px;text-transform:uppercase;letter-spacing:.5px}

/* WALLET */
.wbanner{margin:0 18px 16px;background:linear-gradient(135deg,#1A0F05,#2D1506);border:1px solid rgba(255,87,34,.25);border-radius:13px;padding:14px 18px;display:flex;align-items:center;justify-content:space-between;gap:10px;flex-wrap:wrap;max-width:1060px}
.wbico{width:40px;height:40px;background:linear-gradient(135deg,#FF5722,#FFC107);border-radius:10px;display:flex;align-items:center;justify-content:center;font-size:18px;flex-shrink:0}
.wblbl{color:#7799BB;font-size:9px;text-transform:uppercase;letter-spacing:.5px;margin-bottom:2px}
.wbamt{font-family:'Syne',sans-serif;font-size:17px;font-weight:800;color:#FF5722}

/* PROMO */
.promo{margin:0 18px 16px;background:linear-gradient(135deg,#0A1F0A,#0F2D0A);border:1px solid rgba(76,175,80,.18);border-radius:10px;padding:10px 13px;display:flex;align-items:center;gap:8px;max-width:1060px}
.pcode{margin-left:auto;background:rgba(76,175,80,.1);border:1px dashed rgba(76,175,80,.3);border-radius:6px;padding:3px 9px;font-size:10px;font-weight:700;color:#4CAF50;cursor:pointer;white-space:nowrap;flex-shrink:0}

/* SURGE */
.surge{background:rgba(255,152,0,.13);border:1px solid rgba(255,152,0,.28);border-radius:5px;padding:1px 6px;font-size:9px;font-weight:700;color:#FF9800;display:inline-block;margin-left:4px}

/* SEC */
.sec{padding:0 18px 32px;max-width:1060px;margin:0 auto}
.sechd{display:flex;align-items:center;justify-content:space-between;margin-bottom:12px}
.sectitle{font-family:'Syne',sans-serif;font-size:15px;font-weight:700;display:flex;align-items:center;gap:7px}
.sectitle::before{content:'';width:3px;height:17px;background:#FF5722;border-radius:2px;flex-shrink:0}
.seclink{font-size:10px;color:#FF5722;cursor:pointer;opacity:.75}
.seclink:hover{opacity:1}

/* FILTER BAR */
.filter-bar{display:flex;gap:6px;margin-bottom:14px;flex-wrap:wrap;align-items:center}
.fchip{padding:5px 11px;border-radius:20px;border:1px solid rgba(255,255,255,.08);background:rgba(255,255,255,.04);cursor:pointer;font-size:10px;color:#7799BB;transition:all .18s;white-space:nowrap}
.fchip:hover{border-color:rgba(255,87,34,.3);color:#F0F0F0}
.fchip.on{border-color:#FF5722;background:rgba(255,87,34,.1);color:#FF5722}
.sort-sel{padding:5px 10px;border-radius:8px;background:rgba(255,255,255,.05);border:1px solid rgba(255,255,255,.08);color:#F0F0F0;font-size:10px;font-family:'DM Sans',sans-serif;outline:none;cursor:pointer}
.sort-sel option{background:#111120}

/* SERVICES */
.sgrid{display:grid;grid-template-columns:repeat(auto-fill,minmax(155px,1fr));gap:10px}
.scard{background:#111120;border-radius:11px;padding:14px;border:1px solid rgba(255,255,255,.05);cursor:pointer;transition:all .2s;position:relative;overflow:hidden}
.scard::after{content:'';position:absolute;inset:0;background:linear-gradient(135deg,rgba(255,87,34,.09),transparent);opacity:0;transition:opacity .2s}
.scard:hover{transform:translateY(-3px);border-color:rgba(255,87,34,.3);box-shadow:0 10px 28px rgba(0,0,0,.3)}
.scard:hover::after{opacity:1}
.sfav{position:absolute;top:7px;right:7px;background:none;border:none;font-size:12px;cursor:pointer;opacity:.4;transition:all .18s;z-index:2}
.sfav:hover,.sfav.act{opacity:1;transform:scale(1.15)}
.sico{font-size:22px;margin-bottom:7px}
.sname{font-family:'Syne',sans-serif;font-weight:700;font-size:12px;margin-bottom:2px}
.sdesc{color:#7799BB;font-size:10px;margin-bottom:2px}
.sdur{color:#5588AA;font-size:9px;margin-bottom:7px}
.sprice{color:#FF5722;font-weight:600;font-size:10px;background:rgba(255,87,34,.1);padding:2px 7px;border-radius:20px;display:inline-block}

/* WORKERS */
.wgrid{display:grid;grid-template-columns:repeat(auto-fill,minmax(230px,1fr));gap:10px}
.wcard{background:#111120;border-radius:11px;padding:13px;border:1px solid rgba(255,255,255,.05);display:flex;align-items:center;gap:9px;cursor:pointer;transition:all .18s}
.wcard:hover{border-color:rgba(255,87,34,.25);transform:translateY(-2px)}
.wav{width:42px;height:42px;background:rgba(255,87,34,.1);border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:22px;flex-shrink:0;position:relative}
.fstar{position:absolute;top:-2px;right:-2px;font-size:10px}
.tierbadge{position:absolute;bottom:-2px;right:-2px;font-size:11px}
.wname{font-weight:600;font-size:12px;margin-bottom:2px;display:flex;align-items:center;gap:4px}
.wspec{color:#7799BB;font-size:10px;margin-bottom:4px}
.wmeta{display:flex;gap:5px;align-items:center;font-size:9px;flex-wrap:wrap}
.wrat{color:#FFC107;font-weight:600}
.wjob{color:#7799BB}
.wdist{color:#4CAF50;font-weight:500}
.wslot{color:#9C27B0;font-size:9px;font-weight:500}
.vbadge{font-size:8px;background:rgba(76,175,80,.11);border:1px solid rgba(76,175,80,.2);color:#4CAF50;padding:1px 5px;border-radius:20px}
.dot{width:6px;height:6px;border-radius:50%;flex-shrink:0}
.don{background:#4CAF50;box-shadow:0 0 5px #4CAF50}
.dbusy{background:#FF9800;box-shadow:0 0 5px #FF9800}
.favbtn{background:rgba(255,193,7,.08);border:1px solid rgba(255,193,7,.15);border-radius:7px;padding:3px 7px;cursor:pointer;font-size:10px;color:#FFC107;flex-shrink:0;transition:all .18s;font-family:'DM Sans',sans-serif}
.favbtn.act{background:rgba(255,193,7,.18);border-color:rgba(255,193,7,.4)}

/* MAP */
.mapwrap{border-radius:13px;overflow:hidden;border:1px solid rgba(255,87,34,.12);background:#0D1B2A;position:relative;height:270px}
.mleg{position:absolute;top:10px;right:10px;background:rgba(10,12,20,.9);backdrop-filter:blur(12px);border-radius:8px;padding:8px 11px;border:1px solid rgba(255,255,255,.06);font-size:9px}
.mrow{display:flex;align-items:center;gap:5px;margin-bottom:3px;color:#bbb}
.mrow:last-child{margin:0}

/* TABLE */
.tblwrap{background:#111120;border-radius:11px;overflow:hidden;border:1px solid rgba(255,255,255,.05)}
.tbl{width:100%;border-collapse:collapse}
.tbl th{text-align:left;padding:8px 12px;color:#7799BB;font-size:9px;font-weight:500;text-transform:uppercase;letter-spacing:.7px;border-bottom:1px solid rgba(255,255,255,.05)}
.tbl td{padding:10px 12px;border-bottom:1px solid rgba(255,255,255,.03);font-size:11px}
.tbl tr:last-child td{border-bottom:none}
.tbl tr:hover td{background:rgba(255,255,255,.014)}
.badge{padding:2px 7px;border-radius:20px;font-size:9px;font-weight:600;display:inline-block}
.bw{background:rgba(255,152,0,.13);color:#FF9800}
.bp{background:rgba(33,150,243,.13);color:#2196F3}
.bd{background:rgba(76,175,80,.13);color:#4CAF50}

/* TABS */
.tabs{display:flex;margin-bottom:14px;border-bottom:1px solid rgba(255,255,255,.05)}
.tab{padding:7px 13px;border:none;background:transparent;color:#7799BB;cursor:pointer;font-size:11px;font-weight:500;font-family:'DM Sans',sans-serif;border-bottom:2px solid transparent;margin-bottom:-1px;transition:all .18s}
.tab.on{color:#FF5722;border-bottom-color:#FF5722}
.tab:hover:not(.on){color:#F0F0F0}

/* DASH */
.dgrid{display:grid;grid-template-columns:repeat(auto-fill,minmax(148px,1fr));gap:9px;margin-bottom:18px}
.dcard{background:#111120;border-radius:11px;padding:15px;border:1px solid rgba(255,255,255,.05)}
.dico{font-size:17px;margin-bottom:5px}
.dnum{font-family:'Syne',sans-serif;font-size:19px;font-weight:800;color:#FF5722}
.dlbl{color:#7799BB;font-size:9px;margin-top:2px}

/* CHART */
.chart{background:#111120;border-radius:11px;padding:15px;border:1px solid rgba(255,255,255,.05);margin-bottom:18px}
.chartttl{font-family:'Syne',sans-serif;font-weight:700;font-size:12px;margin-bottom:11px;display:flex;justify-content:space-between;align-items:center}
.bars{display:flex;align-items:flex-end;gap:4px;height:70px}
.bcol{flex:1;display:flex;flex-direction:column;align-items:center;gap:3px}
.bar{border-radius:3px 3px 0 0;width:100%;min-height:3px;transition:all .25s;cursor:pointer}
.bar.org{background:linear-gradient(to top,#FF5722,#FF8A65)}
.bar.blu{background:linear-gradient(to top,#2196F3,#64B5F6)}
.bar.ppl{background:linear-gradient(to top,#9C27B0,#CE93D8)}
.bar:hover{filter:brightness(1.2)}
.barlbl{font-size:8px;color:#7799BB;text-align:center}

/* HEATMAP */
.heatmap{display:grid;grid-template-columns:repeat(24,1fr);gap:3px}
.hcell{height:22px;border-radius:3px;cursor:pointer;transition:all .18s}
.hcell:hover{transform:scale(1.2)}

/* ORDER CARD */
.ocard{background:#111120;border-radius:11px;padding:14px;border:1px solid rgba(255,255,255,.05);margin-bottom:8px;transition:border-color .18s}
.ocard:hover{border-color:rgba(255,87,34,.16)}
.ocdhd{display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:8px}
.ocsvc{font-family:'Syne',sans-serif;font-weight:700;font-size:12px}
.ocid{color:#7799BB;font-size:10px;margin-top:2px}
.ocprice{font-weight:700;color:#FF5722;font-size:12px}
.ocdate{color:#7799BB;font-size:9px;margin-top:1px;text-align:right}
.ocbtns{display:flex;gap:4px;flex-wrap:wrap;margin-top:8px}
.obtn{padding:4px 10px;border-radius:6px;border:none;cursor:pointer;font-size:10px;font-weight:500;font-family:'DM Sans',sans-serif;transition:all .18s}
.ob-org{background:linear-gradient(135deg,#FF5722,#E64A19);color:#fff}
.ob-gh{background:rgba(255,255,255,.05);color:#bbb;border:1px solid rgba(255,255,255,.07)}
.ob-gh:hover{background:rgba(255,255,255,.08);color:#fff}
.ob-g{background:rgba(76,175,80,.11);color:#4CAF50;border:1px solid rgba(76,175,80,.16)}
.ob-y{background:rgba(255,193,7,.09);color:#FFC107;border:1px solid rgba(255,193,7,.16)}
.ob-r{background:rgba(244,67,54,.09);color:#F44336;border:1px solid rgba(244,67,54,.18)}
.ob-b{background:rgba(33,150,243,.09);color:#2196F3;border:1px solid rgba(33,150,243,.18)}
.ob-p{background:rgba(156,39,176,.09);color:#CE93D8;border:1px solid rgba(156,39,176,.18)}
.rec-tag{font-size:9px;background:rgba(156,39,176,.1);color:#CE93D8;border:1px solid rgba(156,39,176,.18);border-radius:20px;padding:1px 6px;display:inline-flex;align-items:center;gap:2px}

/* TRACKING */
.track{background:rgba(255,255,255,.022);border-radius:8px;padding:10px;margin-bottom:8px}
.tsteps{display:flex;align-items:center}
.tstep{flex:1;text-align:center;position:relative}
.tstep::after{content:'';position:absolute;top:9px;left:50%;width:100%;height:2px;background:rgba(255,255,255,.06);z-index:0}
.tstep:last-child::after{display:none}
.tdot{width:18px;height:18px;border-radius:50%;border:2px solid rgba(255,255,255,.1);background:#0C0C14;margin:0 auto 4px;display:flex;align-items:center;justify-content:center;font-size:7px;position:relative;z-index:1;transition:all .25s}
.tdn{background:#4CAF50;border-color:#4CAF50}
.tac{background:#FF5722;border-color:#FF5722;box-shadow:0 0 7px rgba(255,87,34,.4)}
.tlbl{font-size:8px;color:#7799BB}
.tlac{color:#FF5722;font-weight:600}
.tldn{color:#4CAF50}

/* PHOTO PROGRESS */
.photo-row{display:flex;gap:7px;margin-top:8px;flex-wrap:wrap}
.photo-card{border-radius:9px;overflow:hidden;border:1px solid rgba(255,255,255,.06);flex:1;min-width:120px;background:rgba(255,255,255,.03)}
.photo-label{font-size:9px;color:#7799BB;padding:5px 8px;border-bottom:1px solid rgba(255,255,255,.05);text-transform:uppercase;letter-spacing:.4px}
.photo-preview{height:70px;display:flex;align-items:center;justify-content:center;font-size:28px;background:linear-gradient(135deg,rgba(255,87,34,.05),rgba(255,193,7,.05))}
.photo-upload{height:70px;display:flex;align-items:center;justify-content:center;flex-direction:column;gap:4px;cursor:pointer;color:#7799BB;font-size:10px;border:1px dashed rgba(255,255,255,.1);border-radius:0 0 9px 9px}

/* OTP */
.otp-display{background:rgba(255,87,34,.08);border:1.5px solid rgba(255,87,34,.25);border-radius:11px;padding:16px;text-align:center;margin:12px 0}
.otp-code{font-family:'Syne',sans-serif;font-size:36px;font-weight:800;letter-spacing:10px;color:#FF5722;margin-bottom:5px}
.otp-hint{font-size:11px;color:#7799BB;line-height:1.5}
.otp-boxes{display:flex;gap:8px;justify-content:center;margin:14px 0}
.otp-box{width:44px;height:52px;border-radius:9px;background:rgba(255,255,255,.05);border:1.5px solid rgba(255,255,255,.1);color:#F0F0F0;font-size:20px;font-weight:700;text-align:center;font-family:'Syne',sans-serif;outline:none;transition:border-color .18s}
.otp-box:focus{border-color:#FF5722;background:rgba(255,87,34,.07)}

/* PRICE BREAKDOWN */
.price-breakdown{background:rgba(255,255,255,.03);border-radius:10px;padding:13px;margin-bottom:12px;border:1px solid rgba(255,255,255,.06)}
.pb-row{display:flex;justify-content:space-between;font-size:11px;margin-bottom:6px;color:#aaa}
.pb-row.total{font-weight:700;color:#F0F0F0;font-size:12px;padding-top:7px;border-top:1px solid rgba(255,255,255,.06);margin-bottom:0}
.pb-row.disc{color:#4CAF50}
.pb-row.surge{color:#FF9800}

/* SAVED ADDRESSES */
.addr-list{display:flex;flex-direction:column;gap:7px;margin-bottom:12px}
.addr-item{background:rgba(255,255,255,.04);border:1px solid rgba(255,255,255,.07);border-radius:9px;padding:10px 13px;cursor:pointer;display:flex;align-items:center;gap:9px;transition:all .18s}
.addr-item:hover{border-color:rgba(255,87,34,.3)}
.addr-item.sel{border-color:#FF5722;background:rgba(255,87,34,.06)}
.addr-label{font-size:12px;font-weight:600}
.addr-text{font-size:10px;color:#7799BB;margin-top:1px}

/* MEMBERSHIP */
.mem-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(200px,1fr));gap:12px;margin-bottom:18px}
.mem-card{background:#111120;border-radius:13px;padding:18px;border:1.5px solid rgba(255,255,255,.07);position:relative;transition:all .22s}
.mem-card:hover{transform:translateY(-3px);box-shadow:0 12px 32px rgba(0,0,0,.3)}
.mem-card.popular{border-color:rgba(255,87,34,.45);box-shadow:0 0 24px rgba(255,87,34,.12)}
.mem-popular-tag{position:absolute;top:-10px;left:50%;transform:translateX(-50%);background:linear-gradient(135deg,#FF5722,#E64A19);color:#fff;font-size:9px;font-weight:700;padding:3px 10px;border-radius:20px;white-space:nowrap}
.mem-name{font-family:'Syne',sans-serif;font-size:15px;font-weight:700;margin-bottom:3px}
.mem-price{font-family:'Syne',sans-serif;font-size:20px;font-weight:800;margin-bottom:12px}
.mem-feature{font-size:11px;color:#aaa;margin-bottom:6px;display:flex;align-items:flex-start;gap:6px;line-height:1.4}
.mem-feature::before{content:'✓';color:#4CAF50;font-weight:700;flex-shrink:0}

/* TIER */
.tier-progress{background:#111120;border-radius:11px;padding:16px;border:1px solid rgba(255,255,255,.05);margin-bottom:18px}
.tier-bar-wrap{background:rgba(255,255,255,.06);border-radius:20px;height:8px;margin:10px 0;overflow:hidden}
.tier-bar{height:100%;border-radius:20px;transition:width .5s ease;background:linear-gradient(to right,#FF5722,#FFC107)}

/* REFERRAL */
.ref-card{background:linear-gradient(135deg,#0D1F1D,#0F2D28);border:1px solid rgba(76,175,80,.2);border-radius:13px;padding:18px;margin-bottom:18px}
.ref-code{font-family:'Syne',sans-serif;font-size:19px;font-weight:800;color:#4CAF50;letter-spacing:2px;text-align:center;background:rgba(76,175,80,.09);border:1px dashed rgba(76,175,80,.28);border-radius:9px;padding:11px;margin:10px 0;cursor:pointer}

/* MODAL */
.overlay{position:fixed;inset:0;background:rgba(0,0,0,.8);z-index:500;display:flex;align-items:center;justify-content:center;padding:12px;backdrop-filter:blur(6px)}
.modal{background:#111120;border-radius:16px;padding:20px;max-width:430px;width:100%;border:1px solid rgba(255,87,34,.14);max-height:90vh;overflow-y:auto;animation:mIn .22s ease}
.modlg{max-width:560px}
@keyframes mIn{from{opacity:0;transform:scale(.94) translateY(8px)}to{opacity:1;transform:scale(1) translateY(0)}}
.mhd{display:flex;align-items:flex-start;justify-content:space-between;margin-bottom:15px}
.mtitle{font-family:'Syne',sans-serif;font-weight:700;font-size:15px}
.mclose{background:rgba(255,255,255,.07);border:none;color:#aaa;cursor:pointer;width:25px;height:25px;border-radius:7px;font-size:14px;flex-shrink:0;transition:all .18s}
.mclose:hover{background:rgba(255,87,34,.18);color:#FF5722}
.fg{margin-bottom:10px}
.flbl{font-size:9px;color:#7799BB;margin-bottom:3px;display:block;text-transform:uppercase;letter-spacing:.5px}
.fi{width:100%;padding:9px 11px;border-radius:8px;background:rgba(255,255,255,.05);border:1px solid rgba(255,255,255,.08);color:#F0F0F0;font-size:12px;font-family:'DM Sans',sans-serif;outline:none;transition:border-color .18s}
.fi:focus{border-color:#FF5722;background:rgba(255,87,34,.04)}
.fsel{width:100%;padding:9px 11px;border-radius:8px;background:rgba(255,255,255,.05);border:1px solid rgba(255,255,255,.08);color:#F0F0F0;font-size:12px;font-family:'DM Sans',sans-serif;outline:none}
.fsel option{background:#111120}
.g2{display:grid;grid-template-columns:1fr 1fr;gap:8px}

/* PAYMENT */
.pmethods{display:grid;grid-template-columns:1fr 1fr;gap:6px;margin-bottom:12px}
.pm{background:rgba(255,255,255,.04);border:1.5px solid rgba(255,255,255,.07);border-radius:8px;padding:8px 10px;cursor:pointer;display:flex;align-items:center;gap:7px;transition:all .18s}
.pm:hover{border-color:rgba(255,87,34,.3)}
.pm.sel{border-color:#FF5722;background:rgba(255,87,34,.07)}
.pmico{font-size:16px}
.pmname{font-size:11px;font-weight:600}
.pmdesc{font-size:9px;color:#7799BB}

/* CHAT */
.chatwrap{display:flex;flex-direction:column;height:320px}
.chathd{display:flex;align-items:center;gap:8px;padding-bottom:10px;border-bottom:1px solid rgba(255,255,255,.06);margin-bottom:9px}
.chatav{width:32px;height:32px;border-radius:50%;background:rgba(255,87,34,.11);display:flex;align-items:center;justify-content:center;font-size:16px}
.chatname{font-weight:600;font-size:12px}
.chatst{font-size:9px;color:#4CAF50}
.chatmsgs{flex:1;overflow-y:auto;display:flex;flex-direction:column;gap:6px;padding-right:2px}
.msg{max-width:70%;padding:7px 10px;border-radius:10px;font-size:11px;line-height:1.5;animation:mIn .18s ease}
.msg.worker{background:#1C2D44;border-bottom-left-radius:3px;align-self:flex-start}
.msg.customer{background:linear-gradient(135deg,#FF5722,#E64A19);border-bottom-right-radius:3px;align-self:flex-end}
.msgt{font-size:9px;color:rgba(255,255,255,.35);margin-top:2px;text-align:right}
.chatinprow{display:flex;gap:5px;margin-top:9px;padding-top:9px;border-top:1px solid rgba(255,255,255,.06)}
.chatinp{flex:1;padding:7px 10px;border-radius:8px;background:rgba(255,255,255,.05);border:1px solid rgba(255,255,255,.08);color:#F0F0F0;font-family:'DM Sans',sans-serif;font-size:11px;outline:none}
.chatinp:focus{border-color:#FF5722}
.csend{width:30px;height:30px;border-radius:7px;background:#FF5722;border:none;cursor:pointer;font-size:12px;flex-shrink:0}
.csend:hover{background:#E64A19}

/* NOTIF PANEL */
.npanel{position:absolute;top:61px;right:10px;width:280px;background:#111120;border:1px solid rgba(255,87,34,.16);border-radius:12px;box-shadow:0 14px 42px rgba(0,0,0,.54);z-index:400;overflow:hidden;animation:mIn .18s ease}
.nphd{padding:10px 13px;border-bottom:1px solid rgba(255,255,255,.05);display:flex;justify-content:space-between;align-items:center}
.nptitle{font-family:'Syne',sans-serif;font-weight:700;font-size:12px}
.npclr{font-size:9px;color:#FF5722;cursor:pointer}
.nitem{padding:9px 13px;border-bottom:1px solid rgba(255,255,255,.03);display:flex;gap:7px;cursor:pointer;transition:background .15s}
.nitem:hover{background:rgba(255,255,255,.02)}
.nitem.unrd{background:rgba(255,87,34,.03)}
.nitem:last-child{border-bottom:none}
.nico{font-size:15px;width:30px;height:30px;background:rgba(255,255,255,.05);border-radius:7px;display:flex;align-items:center;justify-content:center;flex-shrink:0}
.ntit{font-size:10px;font-weight:600;margin-bottom:1px}
.nbody{font-size:9px;color:#7799BB;line-height:1.4}
.ntime{font-size:8px;color:#5566AA;margin-top:1px}
.nunrd{width:6px;height:6px;background:#FF5722;border-radius:50%;flex-shrink:0;margin-top:3px}

/* RATING */
.stars{display:flex;gap:4px;justify-content:center;margin-bottom:12px}
.sbtn{font-size:24px;cursor:pointer;transition:transform .13s;background:none;border:none}
.sbtn:hover{transform:scale(1.18)}

/* REVIEW */
.revitem{background:rgba(255,255,255,.03);border-radius:8px;padding:9px;margin-bottom:5px}
.rvhd{display:flex;justify-content:space-between;margin-bottom:3px;font-size:10px}
.rvuser{font-weight:600}
.rvstars{color:#FFC107;font-size:9px}
.rvtext{color:#aaa;font-size:10px;line-height:1.5}
.rvdate{font-size:9px;color:#5566AA;margin-top:2px}

/* TOPUP */
.topupopts{display:grid;grid-template-columns:repeat(3,1fr);gap:5px;margin-bottom:10px}
.topupopt{background:rgba(255,255,255,.04);border:1.5px solid rgba(255,255,255,.07);border-radius:7px;padding:7px 4px;text-align:center;cursor:pointer;font-size:10px;font-weight:600;color:#bbb;transition:all .18s}
.topupopt:hover,.topupopt.sel{border-color:#FF5722;background:rgba(255,87,34,.07);color:#FF5722}

/* EMERGENCY */
.sos{position:fixed;bottom:22px;left:22px;z-index:999;width:48px;height:48px;border-radius:50%;background:linear-gradient(135deg,#F44336,#C62828);border:none;cursor:pointer;font-size:20px;box-shadow:0 4px 18px rgba(244,67,54,.48);transition:all .2s;animation:pulse 2.2s infinite}
@keyframes pulse{0%,100%{box-shadow:0 4px 18px rgba(244,67,54,.48)}50%{box-shadow:0 4px 28px rgba(244,67,54,.75)}}
.sos:hover{transform:scale(1.1)}

/* DISPUTE */
.dispute-info{background:rgba(244,67,54,.05);border:1px solid rgba(244,67,54,.16);border-radius:9px;padding:12px;margin-bottom:11px}

/* SKILL TAG */
.skill-tag{display:inline-block;background:rgba(255,87,34,.09);border:1px solid rgba(255,87,34,.16);border-radius:20px;padding:2px 7px;font-size:9px;color:#FF8A65;margin:2px}

/* SPENDING */
.ss-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:8px;margin-bottom:16px}
.ss-card{background:#111120;border-radius:10px;padding:13px;border:1px solid rgba(255,255,255,.05);text-align:center}
.ss-num{font-family:'Syne',sans-serif;font-size:15px;font-weight:800;color:#FF5722}
.ss-lbl{color:#7799BB;font-size:9px;margin-top:2px}

/* VERIFY */
.verify-section{background:rgba(76,175,80,.05);border:1px solid rgba(76,175,80,.18);border-radius:10px;padding:12px;margin-bottom:13px}
.verify-row{display:flex;align-items:center;gap:8px;font-size:11px;margin-bottom:7px}
.verify-row:last-child{margin:0}

/* TOAST */
.toast{position:fixed;bottom:18px;right:18px;z-index:9999;background:#111120;border:1px solid rgba(76,175,80,.3);border-radius:9px;padding:9px 13px;display:flex;align-items:center;gap:6px;box-shadow:0 5px 22px rgba(0,0,0,.46);animation:tIn .25s ease,tOut .25s ease 2.7s forwards;font-size:11px;max-width:250px}
@keyframes tIn{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:translateY(0)}}
@keyframes tOut{from{opacity:1}to{opacity:0}}

.sbar{display:flex;align-items:center;gap:6px;background:#111120;border:1px solid rgba(255,255,255,.07);border-radius:8px;padding:7px 11px;margin-bottom:13px}
.sbar input{background:none;border:none;color:#F0F0F0;font-size:12px;font-family:'DM Sans',sans-serif;outline:none;flex:1}
.sbar input::placeholder{color:#7799BB}
.divider{height:1px;background:rgba(255,255,255,.05);margin:13px 0}
.port-item{background:rgba(255,255,255,.03);border-radius:7px;padding:9px 11px;margin-bottom:5px;font-size:11px;border-left:2px solid #FF5722}

@media(max-width:640px){.ntabs{display:none!important}.sec{padding:0 12px 26px}.wbanner{flex-direction:column}.pmethods,.g2{grid-template-columns:1fr}.mem-grid{grid-template-columns:1fr}.ss-grid{grid-template-columns:1fr 1fr}.topupopts{grid-template-columns:repeat(2,1fr)}}
`;

// ── HELPERS ───────────────────────────────────────────────────────────────────
const dynPrice = (svc, isPro) => {
  const h = new Date().getHours();
  const surge = (h >= 18 || h < 7) ? 1.3 : svc.surge;
  const base = Math.round(svc.basePrice * surge);
  return isPro ? Math.round(base * 0.9) : base;
};

// ── SUBCOMPONENTS ─────────────────────────────────────────────────────────────
function MapView() {
  return (
    <div className="mapwrap">
      <svg width="100%" height="100%" viewBox="0 0 500 270" xmlns="http://www.w3.org/2000/svg">
        <rect width="500" height="270" fill="#0D1B2A"/>
        {[50,100,150,200,250,300,350,400,450].map(x=><line key={x} x1={x} y1="0" x2={x} y2="270" stroke="#0F2535" strokeWidth="1"/>)}
        {[50,100,150,200,220].map(y=><line key={y} x1="0" y1={y} x2="500" y2={y} stroke="#0F2535" strokeWidth="1"/>)}
        <line x1="0" y1="135" x2="500" y2="135" stroke="#132538" strokeWidth="9"/>
        <line x1="250" y1="0" x2="250" y2="270" stroke="#132538" strokeWidth="9"/>
        {[[10,10,78,46],[108,10,78,46],[208,10,78,46],[308,10,78,46],[408,10,78,46],[10,84,78,30],[108,84,78,30],[308,84,78,30],[408,84,78,30],[10,165,78,40],[108,165,78,40],[208,165,78,40],[308,165,78,40],[408,165,78,40],[10,220,78,35],[108,220,78,35],[208,220,78,35],[308,220,78,35],[408,220,78,35]].map(([x,y,w,h],i)=><rect key={i} x={x} y={y} width={w} height={h} rx="3" fill="#0A1520" opacity=".85"/>)}
        <polyline points="250,140 296,123 306,117" stroke="#FF5722" strokeWidth="2.5" strokeDasharray="6,3" fill="none" opacity=".75"/>
        <circle cx="250" cy="140" r="12" fill="rgba(255,87,34,0.14)"/>
        <circle cx="250" cy="140" r="7.5" fill="#FF5722"/>
        <circle cx="250" cy="140" r="3" fill="#fff"/>
        {[{cx:306,cy:98,c:"#4CAF50",l:"A"},{cx:163,cy:115,c:"#2196F3",l:"S"},{cx:340,cy:186,c:"#9C27B0",l:"D"}].map((p,i)=>(
          <g key={i}><circle cx={p.cx} cy={p.cy} r="10" fill={p.c+"22"}/><circle cx={p.cx} cy={p.cy} r="7" fill={p.c}/><text x={p.cx} y={p.cy+3} textAnchor="middle" fill="#fff" fontSize="6.5" fontWeight="bold">{p.l}</text></g>
        ))}
        <rect x="228" y="152" width="44" height="11" rx="3" fill="rgba(255,87,34,.88)"/>
        <text x="250" y="161" textAnchor="middle" fill="#fff" fontSize="7.5" fontWeight="bold">📍 Anda</text>
      </svg>
      <div className="mleg">
        {[["#FF5722","📍 Anda"],["#4CAF50","Ahmad · 1.2km"],["#2196F3","Sari · 2.1km"],["#9C27B0","Doni · 3.4km"]].map(([c,l])=>(
          <div className="mrow" key={l}><span style={{width:7,height:7,borderRadius:"50%",background:c,display:"inline-block",flexShrink:0}}/>{l}</div>
        ))}
      </div>
    </div>
  );
}

function Tracking({ status }) {
  const steps=[{k:"waiting",l:"Menunggu",i:"⏳"},{k:"in_progress",l:"Dikerjakan",i:"🔧"},{k:"arriving",l:"Tiba",i:"🚶"},{k:"done",l:"Selesai",i:"🎉"}];
  const idx=status==="waiting"?0:status==="in_progress"?1:status==="arriving"?2:3;
  return (
    <div className="track">
      <div className="tsteps">
        {steps.map((s,i)=>(
          <div className="tstep" key={s.k}>
            <div className={`tdot ${i<idx?"tdn":i===idx?"tac":""}`}>{i<idx?"✓":s.i}</div>
            <div className={`tlbl ${i<idx?"tldn":i===idx?"tlac":""}`}>{s.l}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

function ChatModal({ orderId, orders, chats, setChats, onClose, role }) {
  const order=orders.find(o=>o.id===orderId);
  const worker=WORKERS.find(w=>w.id===order?.workerId)||WORKERS[0];
  const msgs=chats[orderId]||[];
  const [input,setInput]=useState("");
  const ref=useRef<HTMLDivElement>(null);
  useEffect(()=>{ref.current?.scrollIntoView({behavior:"smooth"});},[msgs]);
  const send=()=>{
    if(!input.trim()) return;
    setChats(p=>({...p,[orderId]:[...(p[orderId]||[]),{from:role==="worker"?"worker":"customer",text:input.trim(),time:tick()}]}));
    setInput("");
  };
  return (
    <div className="overlay" onClick={onClose}>
      <div className="modal modlg" onClick={e=>e.stopPropagation()}>
        <div className="mhd">
          <div><div className="mtitle">💬 Chat — {order?.service}</div><div style={{fontSize:9,color:"#7799BB",marginTop:1}}>{orderId}</div></div>
          <button className="mclose" onClick={onClose}>×</button>
        </div>
        <div className="chatwrap">
          <div className="chathd">
            <div className="chatav">{worker.avatar}</div>
            <div style={{flex:1}}><div className="chatname">{role==="worker"?order?.customer||"Pelanggan":worker.name}{worker.verified&&" ✅"}</div><div className="chatst">● Online</div></div>
            <div style={{textAlign:"right",fontSize:9}}><div style={{color:"#7799BB"}}>{order?.service}</div><div style={{color:"#FF5722",fontWeight:600}}>{fmt(order?.price||0)}</div></div>
          </div>
          <div className="chatmsgs">
            {msgs.length===0&&<div style={{textAlign:"center",color:"#7799BB",fontSize:11,marginTop:28}}>Mulai percakapan...</div>}
            {msgs.map((m,i)=>(
              <div key={i} style={{display:"flex",flexDirection:"column",alignItems:m.from==="customer"?"flex-end":"flex-start"}}>
                <div className={`msg ${m.from}`}>{m.text}</div>
                <div className="msgt">{m.time}</div>
              </div>
            ))}
            <div ref={ref}/>
          </div>
          <div className="chatinprow">
            <input className="chatinp" placeholder="Tulis pesan..." value={input} onChange={e=>setInput(e.target.value)} onKeyDown={e=>e.key==="Enter"&&send()}/>
            <button className="csend" onClick={send}>➤</button>
          </div>
        </div>
      </div>
    </div>
  );
}

function OTPModal({ order, onClose, onVerified, isWorker }) {
  const worker=WORKERS.find(w=>w.id===order?.workerId)||WORKERS[0];
  const [otp,setOtp]=useState(["","","",""]);
  const [error,setError]=useState(false);
  const [verified,setVerified]=useState(false);
  const refs=[useRef<HTMLInputElement>(null),useRef<HTMLInputElement>(null),useRef<HTMLInputElement>(null),useRef<HTMLInputElement>(null)];
  const handleInput=(i:number,v:string)=>{
    if(!/^\d?$/.test(v)) return;
    const n=[...otp]; n[i]=v; setOtp(n); setError(false);
    if(v&&i<3) refs[i+1].current?.focus();
  };
  const check=()=>{
    const code=otp.join("");
    if(code===worker.otpCode){ setVerified(true); setTimeout(()=>{onVerified();onClose();},1500); }
    else { setError(true); setOtp(["","","",""]); refs[0].current?.focus(); }
  };
  return (
    <div className="overlay" onClick={onClose}>
      <div className="modal" onClick={e=>e.stopPropagation()}>
        <div className="mhd"><div className="mtitle">🔑 Konfirmasi OTP</div><button className="mclose" onClick={onClose}>×</button></div>
        {verified ? (
          <div style={{textAlign:"center",padding:"20px 0"}}>
            <div style={{fontSize:48,marginBottom:10}}>✅</div>
            <div style={{fontFamily:"'Syne',sans-serif",fontWeight:700,fontSize:16}}>Terverifikasi!</div>
            <div style={{color:"#7799BB",fontSize:12,marginTop:6}}>Pekerjaan dapat dimulai</div>
          </div>
        ) : (
          <>
            {isWorker ? (
              <>
                <div style={{textAlign:"center",color:"#aaa",fontSize:12,marginBottom:6}}>Tunjukkan kode ini ke pelanggan:</div>
                <div className="otp-display">
                  <div className="otp-code">{worker.otpCode}</div>
                  <div className="otp-hint">Kode berlaku 10 menit · Jangan bagikan ke siapapun selain pelanggan</div>
                </div>
              </>
            ) : (
              <>
                <div style={{textAlign:"center",color:"#aaa",fontSize:12,marginBottom:4}}>Masukkan kode 4 digit dari pekerja:</div>
                <div style={{textAlign:"center",fontSize:11,color:"#7799BB",marginBottom:14}}>{worker.avatar} {worker.name}</div>
                <div className="otp-boxes">
                  {otp.map((v,i)=>(
                    <input key={i} ref={refs[i]} className="otp-box" maxLength={1} value={v}
                      onChange={e=>handleInput(i,e.target.value)}
                      onKeyDown={e=>{if(e.key==="Backspace"&&!v&&i>0) refs[i-1].current?.focus();}}
                      style={{borderColor:error?"#F44336":v?"#FF5722":"rgba(255,255,255,.1)"}}/>
                  ))}
                </div>
                {error&&<div style={{textAlign:"center",color:"#F44336",fontSize:11,marginBottom:10}}>Kode salah. Coba lagi.</div>}
                <button style={{width:"100%",padding:"10px",borderRadius:"9px",border:"none",cursor:otp.every(v=>v)?"pointer":"not-allowed",background:otp.every(v=>v)?"linear-gradient(135deg,#FF5722,#E64A19)":"#1e1e2e",color:"#fff",fontFamily:"'DM Sans',sans-serif",fontWeight:600,fontSize:13}} onClick={check}>Verifikasi →</button>
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
}

function PhotoProgressModal({ order, onClose, onUpload, isWorker }) {
  const photos = order?.photos || [];
  const stages = ["before","progress","after"];
  const labels = { before:"📷 Sebelum", progress:"⚙️ Proses", after:"✅ Sesudah" };
  const emojis = { before:"🏠", progress:"🔧", after:"✨" };
  return (
    <div className="overlay" onClick={onClose}>
      <div className="modal modlg" onClick={e=>e.stopPropagation()}>
        <div className="mhd"><div className="mtitle">📸 Foto Progress</div><button className="mclose" onClick={onClose}>×</button></div>
        <div style={{fontSize:11,color:"#7799BB",marginBottom:14}}>{order?.service} · {order?.id}</div>
        <div className="photo-row">
          {stages.map(s=>(
            <div key={s} className="photo-card">
              <div className="photo-label">{labels[s]}</div>
              {photos.includes(s) ? (
                <div className="photo-preview">{emojis[s]}</div>
              ) : (
                <div className="photo-upload" onClick={()=>isWorker&&onUpload(s)}>
                  <span style={{fontSize:18}}>📷</span>
                  <span>{isWorker?"Unggah":"Belum ada"}</span>
                </div>
              )}
            </div>
          ))}
        </div>
        {!isWorker&&<div style={{background:"rgba(255,87,34,.05)",border:"1px solid rgba(255,87,34,.12)",borderRadius:8,padding:10,marginTop:12,fontSize:11,color:"#aaa",lineHeight:1.6}}>
          📸 Foto dikirim oleh pekerja sebagai bukti pekerjaan. Kamu bisa komplain dalam 24 jam jika hasil tidak sesuai.
        </div>}
      </div>
    </div>
  );
}


function WorkerDetail({ worker, isFav, onFav, onBook, onClose }) {
  const [ptab,setPtab]=useState("info");
  const maxS=Math.max(...worker.weeklyStats);
  return (
    <div className="overlay" onClick={onClose}>
      <div className="modal modlg" onClick={e=>e.stopPropagation()}>
        <div className="mhd"><div className="mtitle">Profil Pekerja</div><button className="mclose" onClick={onClose}>×</button></div>
        <div style={{display:"flex",gap:11,alignItems:"center",marginBottom:14}}>
          <div style={{width:50,height:50,background:"rgba(255,87,34,.11)",borderRadius:"50%",display:"flex",alignItems:"center",justifyContent:"center",fontSize:28,flexShrink:0,position:"relative"}}>
            {worker.avatar}
            <span style={{position:"absolute",bottom:-2,right:-2,fontSize:14}}>{TIERS[getTier(worker.jobs)]}</span>
          </div>
          <div style={{flex:1}}>
            <div style={{fontFamily:"'Syne',sans-serif",fontSize:16,fontWeight:700,display:"flex",alignItems:"center",gap:5}}>{worker.name}<span className="vbadge">✅ Verified</span></div>
            <div style={{color:"#7799BB",fontSize:10,margin:"2px 0"}}>{worker.specialty}</div>
            <div style={{display:"flex",gap:7,fontSize:9,flexWrap:"wrap",marginTop:3}}>
              <span style={{color:"#FFC107"}}>⭐ {worker.rating}</span>
              <span style={{color:"#7799BB"}}>{worker.jobs} pekerjaan</span>
              <span style={{color:"#4CAF50"}}>📍 {worker.dist} km</span>
              <span style={{color:worker.status==="online"?"#4CAF50":"#FF9800"}}>{worker.status==="online"?"🟢 Online":"🟠 Sibuk"}</span>
              <span style={{color:"#9C27B0"}}>🕐 Slot: {worker.nextSlot}</span>
            </div>
          </div>
        </div>
        <div className="verify-section">
          {[["✅","KTP Terverifikasi","Identitas sudah dicek"],["🛡️","Latar Belakang Bersih","Bebas catatan kriminal"],["📅",`Bergabung ${worker.joined}`,"Pekerja berpengalaman"]].map(([ic,t,d])=>(
            <div className="verify-row" key={t}><span style={{fontSize:15}}>{ic}</span><div><div style={{fontWeight:600,fontSize:11}}>{t}</div><div style={{color:"#7799BB",fontSize:9}}>{d}</div></div></div>
          ))}
        </div>
        <div className="tabs" style={{marginBottom:12}}>
          {[["info","Info"],["portfolio","Portofolio"],["reviews","Ulasan"]].map(([t,l])=>(
            <button key={t} className={`tab ${ptab===t?"on":""}`} onClick={()=>setPtab(t)}>{l}</button>
          ))}
        </div>
        {ptab==="info"&&<>
          <div style={{fontSize:9,color:"#7799BB",marginBottom:6,textTransform:"uppercase",letterSpacing:".5px"}}>Keahlian</div>
          <div style={{marginBottom:12}}>{worker.skills.map(s=><span key={s} className="skill-tag">{s}</span>)}</div>
          <div style={{fontSize:9,color:"#7799BB",marginBottom:6,textTransform:"uppercase",letterSpacing:".5px"}}>Aktivitas Minggu Ini</div>
          <div className="chart" style={{padding:"10px",marginBottom:0}}>
            <div className="bars" style={{height:50}}>
              {worker.weeklyStats.map((v,i)=>(
                <div key={i} className="bcol"><div className="bar blu" style={{height:`${(v/maxS)*100}%`}}/><div className="barlbl">{["S","S","R","K","J","S","M"][i]}</div></div>
              ))}
            </div>
          </div>
          <div className="tier-progress" style={{marginTop:12}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
              <div><div style={{fontWeight:600,fontSize:12}}>{TIERS[getTier(worker.jobs)]} Level {getTier(worker.jobs).charAt(0).toUpperCase()+getTier(worker.jobs).slice(1)}</div><div style={{color:"#7799BB",fontSize:10,marginTop:1}}>{worker.jobs} / {getTier(worker.jobs)==="platinum"?300:getTier(worker.jobs)==="gold"?300:getTier(worker.jobs)==="silver"?200:100} order</div></div>
              <div style={{fontSize:9,color:"#7799BB"}}>Tier pekerja</div>
            </div>
            <div className="tier-bar-wrap"><div className="tier-bar" style={{width:`${Math.min((worker.jobs/(getTier(worker.jobs)==="platinum"?300:getTier(worker.jobs)==="gold"?300:getTier(worker.jobs)==="silver"?200:100))*100,100)}%`}}/></div>
          </div>
        </>}
        {ptab==="portfolio"&&<div>{worker.portfolio.map((p,i)=><div key={i} className="port-item">{p}</div>)}<div style={{textAlign:"center",color:"#7799BB",fontSize:10,marginTop:9}}>📸 Foto dokumentasi tersedia setelah order</div></div>}
        {ptab==="reviews"&&worker.reviews.map((r,i)=>(
          <div key={i} className="revitem"><div className="rvhd"><span className="rvuser">{r.user}</span><span className="rvstars">{"⭐".repeat(r.rating)}</span></div><div className="rvtext">{r.text}</div><div className="rvdate">{r.date}</div></div>
        ))}
        <div className="divider"/>
        <div style={{display:"flex",gap:7}}>
          <button className={`favbtn ${isFav?"act":""}`} style={{flex:1,padding:"9px",borderRadius:8}} onClick={onFav}>{isFav?"💛 Favorit":"🤍 Favoritkan"}</button>
          <button className="blg org" style={{flex:2}} onClick={onBook}>📋 Pesan Sekarang</button>
        </div>
      </div>
    </div>
  );
}

function PayModal({ order, wallet, setWallet, isPro, onClose, onSuccess }) {
  const [method,setMethod]=useState("wallet");
  const [step,setStep]=useState(1);
  const fee=isPro?0:Math.round(order.price*.05);
  const total=order.price+fee;
  if(step===3) return (
    <div className="overlay"><div className="modal" style={{textAlign:"center"}}>
      <div style={{fontSize:48,marginBottom:10}}>🎉</div>
      <div className="mtitle" style={{marginBottom:5,textAlign:"center"}}>Pembayaran Berhasil!</div>
      <div style={{color:"#7799BB",fontSize:11,marginBottom:4}}>{fmt(total)} via {PAYMENT_METHODS.find(p=>p.id===method)?.name}</div>
      <div style={{background:"rgba(76,175,80,.07)",border:"1px solid rgba(76,175,80,.18)",borderRadius:8,padding:9,margin:"9px 0 16px",fontSize:10,color:"#4CAF50"}}>🛡️ Dana aman dalam escrow — diteruskan setelah konfirmasi selesai</div>
      <button className="blg org" style={{width:"100%"}} onClick={onSuccess}>Lihat Pesanan</button>
    </div></div>
  );
  return (
    <div className="overlay" onClick={onClose}>
      <div className="modal modlg" onClick={e=>e.stopPropagation()}>
        <div className="mhd"><div className="mtitle">{step===1?"💳 Pilih Pembayaran":"✅ Konfirmasi"}</div><button className="mclose" onClick={onClose}>×</button></div>
        <div className="price-breakdown">
          <div className="pb-row"><span>{order.service}</span><span>{fmt(order.price)}</span></div>
          <div className="pb-row"><span>Biaya layanan {isPro?"(Pro: 0%)":"(5%)"}</span><span>{fmt(fee)}</span></div>
          <div className="pb-row total"><span>Total</span><span style={{color:"#FF5722"}}>{fmt(total)}</span></div>
        </div>
        {step===1&&<>
          {method==="wallet"&&<div style={{background:"rgba(255,87,34,.05)",border:"1px solid rgba(255,87,34,.15)",borderRadius:8,padding:"7px 11px",marginBottom:9,display:"flex",justifyContent:"space-between",fontSize:11}}><span>⚡ Saldo Wallet</span><span style={{fontWeight:700,color:wallet>=total?"#4CAF50":"#F44336"}}>{fmt(wallet)}</span></div>}
          <div className="pmethods">
            {PAYMENT_METHODS.map(p=>(
              <div key={p.id} className={`pm ${method===p.id?"sel":""}`} onClick={()=>setMethod(p.id)}>
                <span className="pmico">{p.icon}</span><div><div className="pmname">{p.name}</div><div className="pmdesc">{p.desc}</div></div>
                {method===p.id&&<span style={{marginLeft:"auto",color:"#FF5722",fontSize:10}}>✓</span>}
              </div>
            ))}
          </div>
          <div style={{fontSize:9,color:"#7799BB",textAlign:"center",marginBottom:9}}>🔒 Dana dijamin aman dengan sistem escrow TaskKu</div>
          <button style={{width:"100%",padding:"9px",borderRadius:"8px",border:"none",cursor:"pointer",background:"linear-gradient(135deg,#FF5722,#E64A19)",color:"#fff",fontFamily:"'DM Sans',sans-serif",fontWeight:600,fontSize:12}} onClick={()=>setStep(2)}>Lanjutkan →</button>
        </>}
        {step===2&&<>
          <div style={{background:"rgba(255,87,34,.04)",border:"1px solid rgba(255,87,34,.11)",borderRadius:8,padding:11,marginBottom:12,fontSize:10}}>
            <div style={{marginBottom:4,fontWeight:600}}>Ringkasan</div>
            <div style={{color:"#aaa",lineHeight:1.9}}>Layanan: <b style={{color:"#fff"}}>{order.service}</b><br/>Alamat: <b style={{color:"#fff"}}>{order.address}</b><br/>Metode: <b style={{color:"#FF5722"}}>{PAYMENT_METHODS.find(p=>p.id===method)?.name}</b><br/>Total: <b style={{color:"#FF5722",fontSize:12}}>{fmt(total)}</b></div>
          </div>
          <div style={{display:"flex",gap:7}}>
            <button className="blg out" style={{flex:1}} onClick={()=>setStep(1)}>← Kembali</button>
            <button className="blg org" style={{flex:2}} onClick={()=>{if(method==="wallet")setWallet(w=>w-total);setStep(3);}}>🔒 Bayar Sekarang</button>
          </div>
        </>}
      </div>
    </div>
  );
}

function TopupModal({ onClose, onTopup }) {
  const amounts=[50000,100000,200000,500000,1000000,2000000];
  const [sel,setSel]=useState(null);
  const [custom,setCustom]=useState("");
  const final=sel||(parseInt(custom.replace(/\D/g,""))||0);
  return (
    <div className="overlay" onClick={onClose}>
      <div className="modal" onClick={e=>e.stopPropagation()}>
        <div className="mhd"><div className="mtitle">⚡ Top Up Wallet</div><button className="mclose" onClick={onClose}>×</button></div>
        <div className="topupopts">{amounts.map(a=><div key={a} className={`topupopt ${sel===a?"sel":""}`} onClick={()=>{setSel(a);setCustom("");}}>{fmt(a)}</div>)}</div>
        <div className="fg"><label className="flbl">Nominal Lain</label><input className="fi" placeholder="Rp 0" value={custom} onChange={e=>{setCustom(e.target.value);setSel(null);}}/></div>
        <div className="fg"><label className="flbl">Metode</label><select className="fsel"><option>BCA Transfer</option><option>Mandiri</option><option>GoPay</option><option>OVO</option><option>DANA</option></select></div>
        {final>0&&<div style={{background:"rgba(76,175,80,.05)",border:"1px solid rgba(76,175,80,.15)",borderRadius:7,padding:7,marginBottom:9,fontSize:10,color:"#4CAF50",textAlign:"center"}}>Top up <b>{fmt(final)}</b> ke Wallet</div>}
        <button style={{width:"100%",padding:"9px",borderRadius:"8px",border:"none",cursor:final>0?"pointer":"not-allowed",background:final>0?"linear-gradient(135deg,#4CAF50,#388E3C)":"#1e1e2e",color:"#fff",fontFamily:"'DM Sans',sans-serif",fontWeight:600,fontSize:12}} onClick={()=>{if(final>0){onTopup(final);onClose();}}}>Top Up Sekarang</button>
      </div>
    </div>
  );
}

function RatingModal({ order, onClose, onSubmit }) {
  const [stars,setStars]=useState(0);
  const [hover,setHover]=useState(0);
  const [comment,setComment]=useState("");
  const worker=WORKERS.find(w=>w.id===order?.workerId)||WORKERS[0];
  const labels=["","Kurang 😕","Cukup 😐","Bagus 👍","Sangat Bagus 😊","Luar Biasa! 🌟"];
  return (
    <div className="overlay" onClick={onClose}>
      <div className="modal" onClick={e=>e.stopPropagation()}>
        <div className="mhd"><div className="mtitle">⭐ Beri Rating</div><button className="mclose" onClick={onClose}>×</button></div>
        <div style={{textAlign:"center",marginBottom:14}}>
          <div style={{fontSize:34,marginBottom:5}}>{worker.avatar}</div>
          <div style={{fontWeight:600,marginBottom:2}}>{worker.name}</div>
          <div style={{fontSize:10,color:"#7799BB"}}>{order?.service} · {fmt(order?.price||0)}</div>
        </div>
        <div style={{textAlign:"center",marginBottom:4,fontSize:10,color:"#7799BB"}}>Bagaimana pengalamanmu?</div>
        <div className="stars">{[1,2,3,4,5].map(n=><button key={n} className="sbtn" onMouseEnter={()=>setHover(n)} onMouseLeave={()=>setHover(0)} onClick={()=>setStars(n)}>{n<=(hover||stars)?"⭐":"☆"}</button>)}</div>
        {stars>0&&<div style={{textAlign:"center",fontSize:11,color:"#FFC107",marginBottom:10,fontWeight:600}}>{labels[stars]}</div>}
        <div className="fg"><label className="flbl">Komentar</label><textarea className="fi" rows={3} placeholder="Ceritakan pengalamanmu..." value={comment} onChange={e=>setComment(e.target.value)} style={{resize:"none"}}/></div>
        <button style={{width:"100%",padding:"9px",borderRadius:"8px",border:"none",cursor:stars?"pointer":"not-allowed",background:stars?"linear-gradient(135deg,#FF5722,#E64A19)":"#1e1e2e",color:"#fff",fontFamily:"'DM Sans',sans-serif",fontWeight:600,fontSize:12}} onClick={()=>stars&&onSubmit(stars,comment)}>
          Kirim Rating {stars>0&&"⭐".repeat(stars)}
        </button>
      </div>
    </div>
  );
}

// ── MAIN ─────────────────────────────────────────────────────────────────────
export default function TaskKuV5() {
  const [page,setPage]       = useState<"home"|"services"|"map"|"myorders"|"favorites"|"spending"|"membership"|"referral"|"worker"|"admin">("home");
  const [role,setRole]       = useState<"customer"|"worker"|"admin"|null>(null);
  const [modal,setModal]     = useState<"login"|"register"|null>(null);
  const [selSvc,setSelSvc]   = useState<(typeof SERVICES)[number] | null>(null);
  const [selW,setSelW]       = useState<(typeof WORKERS)[number] | null>(null);
  const [chatId,setChatId]   = useState<string | null>(null);
  const [payId,setPayId]     = useState<string | null>(null);
  const [rateId,setRateId]   = useState<string | null>(null);
  const [otpId,setOtpId]     = useState<string | null>(null);
  const [photoId,setPhotoId] = useState<string | null>(null);
  const [priceBreakId,setPriceBreakId] = useState<number | null>(null);
  const [toast,setToast]     = useState<string | null>(null);
  const [orders,setOrders]   = useState<typeof INIT_ORDERS>(INIT_ORDERS);
  const [chats,setChats]     = useState<typeof INIT_CHATS>(INIT_CHATS);
  const [notifs,setNotifs]   = useState<typeof INIT_NOTIFS>(INIT_NOTIFS);
  const [showNP,setShowNP]   = useState(false);
  const [wtab,setWtab]       = useState<"available"|"active"|"history">("available");
  const [sq,setSq]           = useState("");
  const [sortW,setSortW]     = useState<"rating"|"dist"|"jobs">("rating");
  const [filterCat,setFilterCat] = useState<string>("Semua");
  const [favW,setFavW]       = useState<number[]>([1]);
  const [favS,setFavS]       = useState<number[]>([1,4]);
  const [wallet,setWallet]   = useState(250000);
  const [topup,setTopup]     = useState(false);
  const [isPro,setIsPro]     = useState(false);
  const [savedAddrs,setSavedAddrs] = useState<typeof SAVED_ADDR_INIT>(SAVED_ADDR_INIT);
  const [selAddr,setSelAddr] = useState<(typeof SAVED_ADDR_INIT)[number] | null>(null);
  const [lf,setLf]           = useState<{email:string;password:string;roleSelect:"customer"|"worker"|"admin"}>({email:"",password:"",roleSelect:"customer"});
  const [of,setOf]           = useState<{address:string;note:string;date:string;time:string;promo:string;recurring:"none"|"daily"|"weekly"|"monthly"}>({address:"",note:"",date:"",time:"",promo:"",recurring:"none"});

  const unread = notifs.filter(n=>!n.read).length;
  const shT = msg => { setToast(msg); setTimeout(()=>setToast(null),3000); };
  const addN = (icon,title,body) => setNotifs(p=>[{id:Date.now(),icon,title,body,time:"baru saja",read:false},...p]);

  const handleLogin=()=>{
    setRole(lf.roleSelect);setModal(null);
    setPage(lf.roleSelect==="admin"?"admin":lf.roleSelect==="worker"?"worker":"home");
    shT(`✅ Masuk sebagai ${lf.roleSelect==="admin"?"Admin":lf.roleSelect==="worker"?"Pekerja":"Pelanggan"}`);
  };

  const handleOrder=(finalPrice)=>{
    const id="ORD-"+String(orders.length+6).padStart(3,"0");
    const newOrd={id,service:selSvc.name,icon:selSvc.icon,customer:"Anda",workerId:1,status:"waiting",date:"18 Mei",time:of.time||"Segera",price:finalPrice||dynPrice(selSvc,isPro),address:of.address||selAddr?.address||"Alamat Anda",rated:false,recurring:of.recurring==="none"?null:of.recurring,photos:[]};
    setOrders(p=>[newOrd,...p]);
    setPriceBreakId(null);setModal(null);setPayId(id);
    if(of.address&&!savedAddrs.find(a=>a.address===of.address)){
      setSavedAddrs(p=>[...p,{id:Date.now(),label:"📍 Baru",address:of.address}]);
    }
    addN("📝","Pesanan Dibuat",`${selSvc.name} menunggu pembayaran.`);
    shT("📝 Pesanan dibuat! Silakan bayar.");
  };

  const totalSpend=orders.filter(o=>o.status==="done").reduce((a,o)=>a+o.price,0);
  const maxSpend=Math.max(...SPENDING_DATA.map(s=>s.amount));
  const maxEarn=Math.max(...WEEKLY_EARN.map(e=>e.amt));
  const maxAnl=Math.max(...ANALYTICS.revenueBycat.map(r=>r.val));

  const cats=["Semua",...new Set(SERVICES.map(s=>s.cat))];
  const filtS=SERVICES.filter(s=>(filterCat==="Semua"||s.cat===filterCat)&&(s.name.toLowerCase().includes(sq.toLowerCase())||s.cat.toLowerCase().includes(sq.toLowerCase())));

  const sortedW=[...WORKERS].sort((a,b)=>sortW==="rating"?b.rating-a.rating:sortW==="dist"?a.dist-b.dist:b.jobs-a.jobs);

  const sLabel={waiting:"Menunggu",in_progress:"Dikerjakan",arriving:"Tiba",done:"Selesai"};
  const sCls  ={waiting:"bw",in_progress:"bp",arriving:"bp",done:"bd"};

  return (
    <>
      <style>{CSS}</style>
      <div style={{minHeight:"100vh",background:"#0C0C14"}}>

        {/* NAV */}
        <nav className="nav">
          <div className="logo" onClick={()=>setPage("home")}>⚡ TaskKu{isPro&&<span className="pro-badge">PRO</span>}</div>
          <div className="ntabs">
            {[["home","Beranda"],["services","Layanan"],["map","🗺 Peta"]].map(([p,l])=>(
              <button key={p} className={`nt ${page===p?"on":""}`} onClick={()=>setPage(p)}>{l}</button>
            ))}
            {role==="customer"&&[["myorders","Pesanan"],["favorites","❤️"],["spending","💰"],["membership","⚡ Pro"],["referral","🎁"]].map(([p,l])=>(
              <button key={p} className={`nt ${page===p?"on":""}`} onClick={()=>setPage(p)}>{l}</button>
            ))}
            {role==="worker"&&<button className={`nt ${page==="worker"?"on":""}`} onClick={()=>setPage("worker")}>Dashboard</button>}
            {role==="admin"&&<button className={`nt ${page==="admin"?"on":""}`} onClick={()=>setPage("admin")}>Admin</button>}
          </div>
          <div className="navr">
            {role&&(
              <div style={{position:"relative"}}>
                <button className="nbtn" onClick={()=>setShowNP(p=>!p)}>🔔{unread>0&&<span className="nbadge">{unread}</span>}</button>
                {showNP&&(
                  <div className="npanel">
                    <div className="nphd"><div className="nptitle">Notifikasi</div><span className="npclr" onClick={()=>{setNotifs(p=>p.map(n=>({...n,read:true})));setShowNP(false);}}>Baca semua</span></div>
                    {notifs.slice(0,6).map(n=>(
                      <div key={n.id} className={`nitem ${n.read?"":"unrd"}`} onClick={()=>setNotifs(p=>p.map(x=>x.id===n.id?{...x,read:true}:x))}>
                        <div className="nico">{n.icon}</div>
                        <div style={{flex:1}}><div className="ntit">{n.title}</div><div className="nbody">{n.body}</div><div className="ntime">{n.time}</div></div>
                        {!n.read&&<div className="nunrd"/>}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
            {!role?<button className="bsm borg" onClick={()=>setModal("login")}>Masuk</button>:(
              <>
                {role==="customer"&&<button style={{background:"rgba(255,87,34,.1)",color:"#FF5722",border:"1px solid rgba(255,87,34,.17)",padding:"5px 9px",fontSize:10,borderRadius:7,cursor:"pointer",fontFamily:"'DM Sans',sans-serif",fontWeight:600}} onClick={()=>setTopup(true)}>⚡{fmt(wallet)}</button>}
                <button className="bsm bgh" style={{fontSize:10}} onClick={()=>{setRole(null);setPage("home");shT("👋 Keluar");}}>Keluar</button>
              </>
            )}
          </div>
        </nav>

        {/* ── HOME ── */}
        {page==="home"&&<>
          <div className="hero">
            <h1>Bantu Apa Saja,<br/>Kapan Saja</h1>
            <p>Pekerja terverifikasi KTP. Bayar escrow. Dilindungi asuransi.</p>
            <div className="hbtns">
              <button className="blg org" onClick={()=>role?setPage("services"):setModal("login")}>🔍 Cari Layanan</button>
              <button className="blg out" onClick={()=>{setLf(f=>({...f,roleSelect:"worker"}));setModal("login");}}>💼 Jadi Pekerja</button>
            </div>
          </div>
          <div className="trust">
            {[["✅","Semua pekerja KTP terverifikasi","g"],["🛡️","Asuransi hingga Rp 5 juta","g"],["🔒","Pembayaran escrow aman","o"],["⚡","Respon dalam 5 menit","o"]].map(([ic,t,cls])=>(
              <div key={t} className={`tbadge ${cls}`}><span>{ic}</span><span>{t}</span></div>
            ))}
          </div>
          {role==="customer"&&<div className="wbanner" style={{maxWidth:1060,margin:"0 auto 14px",marginLeft:18,marginRight:18}}>
            <div style={{display:"flex",alignItems:"center",gap:10}}>
              <div className="wbico">⚡</div>
              <div><div className="wblbl">TaskKu Wallet</div><div className="wbamt">{fmt(wallet)}</div></div>
              {isPro&&<span className="pro-badge" style={{fontSize:10,padding:"2px 7px"}}>PRO</span>}
            </div>
            <div style={{display:"flex",gap:5,flexWrap:"wrap"}}>
              <button style={{background:"linear-gradient(135deg,#4CAF50,#388E3C)",color:"#fff",border:"none",padding:"5px 11px",borderRadius:7,cursor:"pointer",fontSize:10,fontFamily:"'DM Sans',sans-serif",fontWeight:600}} onClick={()=>setTopup(true)}>+ Top Up</button>
              <button className="bsm bgh" style={{fontSize:10}} onClick={()=>setPage("spending")}>📊 Pengeluaran</button>
              {!isPro&&<button className="bsm" style={{background:"rgba(255,87,34,.1)",color:"#FF5722",border:"1px solid rgba(255,87,34,.18)",fontSize:10}} onClick={()=>setPage("membership")}>⚡ Upgrade Pro</button>}
            </div>
          </div>}
          <div className="promo" style={{maxWidth:1060,margin:"0 auto 14px",marginLeft:18,marginRight:18}}>
            <span style={{fontSize:17}}>🎁</span>
            <div style={{fontSize:11,color:"#aaa",lineHeight:1.5}}><b style={{color:"#4CAF50"}}>Promo!</b> Diskon 20% Masak & Bersih.</div>
            <div className="pcode" onClick={()=>shT("✅ Kode HEMAT20 disalin!")}>HEMAT20</div>
          </div>
          <div className="stats">
            {[["12K+","Pekerja"],["98%","Kepuasan"],["50+","Layanan"],["24/7","Support"]].map(([n,l])=>(
              <div className="stat" key={l}><div className="sn">{n}</div><div className="sl">{l}</div></div>
            ))}
          </div>
          <div className="sec">
            <div className="sechd"><div className="sectitle">Layanan Populer</div><span className="seclink" onClick={()=>setPage("services")}>Lihat semua →</span></div>
            <div className="sgrid">
              {SERVICES.slice(0,4).map(s=>{const dp=dynPrice(s,isPro);const surge=dp>s.basePrice;return(
                <div key={s.id} className="scard" onClick={()=>{setSelSvc(s);role?setPriceBreakId(s.id):setModal("login");}}>
                  <button className={`sfav ${favS.includes(s.id)?"act":""}`} onClick={e=>{e.stopPropagation();setFavS(p=>p.includes(s.id)?p.filter(x=>x!==s.id):[...p,s.id]);}}>{favS.includes(s.id)?"❤️":"🤍"}</button>
                  <div className="sico">{s.icon}</div><div className="sname">{s.name}</div><div className="sdesc">{s.desc}</div><div className="sdur">⏱ {s.dur}</div>
                  <div><span className="sprice">ab {fmt(dp)}</span>{surge&&<span className="surge">🔥 Ramai</span>}</div>
                </div>
              );})}
            </div>
          </div>
          <div className="sec">
            <div className="sechd"><div className="sectitle">Pekerja Terdekat</div><span className="seclink" onClick={()=>setPage("map")}>Peta →</span></div>
            <div className="wgrid">
              {sortedW.map(w=>(
                <div key={w.id} className="wcard" onClick={()=>setSelW(w)}>
                  <div className="wav">{w.avatar}{favW.includes(w.id)&&<span className="fstar">⭐</span>}<span className="tierbadge">{TIERS[getTier(w.jobs)]}</span></div>
                  <div style={{flex:1}}>
                    <div className="wname">{w.name}<span className="vbadge">✅</span></div>
                    <div className="wspec">{w.specialty}</div>
                    <div className="wmeta"><span className="wrat">⭐ {w.rating}</span><span className="wjob">{w.jobs}</span><span className="wdist">📍 {w.dist}km</span><span className="wslot">🕐 {w.nextSlot}</span></div>
                  </div>
                  <div className={`dot ${w.status==="online"?"don":"dbusy"}`}/>
                </div>
              ))}
            </div>
          </div>
        </>}

        {/* ── SERVICES ── */}
        {page==="services"&&<div className="sec" style={{paddingTop:22}}>
          <div className="sectitle" style={{marginBottom:12}}>Semua Layanan</div>
          <div className="sbar"><span>🔍</span><input placeholder="Cari layanan..." value={sq} onChange={e=>setSq(e.target.value)}/></div>
          <div className="filter-bar">
            {cats.map(c=><div key={c} className={`fchip ${filterCat===c?"on":""}`} onClick={()=>setFilterCat(c)}>{c}</div>)}
            <select className="sort-sel" value={sortW} onChange={e=>setSortW(e.target.value)}>
              <option value="rating">Sort: Rating</option>
              <option value="dist">Sort: Terdekat</option>
              <option value="jobs">Sort: Terpopuler</option>
            </select>
          </div>
          <div className="sgrid">
            {filtS.map(s=>{const dp=dynPrice(s,isPro);const surge=dp>s.basePrice;return(
              <div key={s.id} className="scard" onClick={()=>{setSelSvc(s);role?setPriceBreakId(s.id):setModal("login");}}>
                <button className={`sfav ${favS.includes(s.id)?"act":""}`} onClick={e=>{e.stopPropagation();setFavS(p=>p.includes(s.id)?p.filter(x=>x!==s.id):[...p,s.id]);}}>{favS.includes(s.id)?"❤️":"🤍"}</button>
                <div className="sico">{s.icon}</div><div className="sname">{s.name}</div><div className="sdesc">{s.desc}</div><div className="sdur">⏱ {s.dur}</div>
                <div style={{marginBottom:6}}><span style={{fontSize:9,color:"#7799BB",background:"rgba(255,255,255,.04)",padding:"1px 6px",borderRadius:20}}>{s.cat}</span></div>
                <div><span className="sprice">ab {fmt(dp)}</span>{surge&&<span className="surge">🔥</span>}</div>
              </div>
            );})}
          </div>
          <div className="divider"/>
          <div className="sectitle" style={{marginBottom:12}}>Filter Pekerja</div>
          <div className="filter-bar">
            <select className="sort-sel" value={sortW} onChange={e=>setSortW(e.target.value)}>
              <option value="rating">Rating Tertinggi</option>
              <option value="dist">Jarak Terdekat</option>
              <option value="jobs">Paling Berpengalaman</option>
            </select>
          </div>
          <div className="wgrid">
            {sortedW.map(w=>(
              <div key={w.id} className="wcard" onClick={()=>setSelW(w)}>
                <div className="wav">{w.avatar}<span className="tierbadge">{TIERS[getTier(w.jobs)]}</span></div>
                <div style={{flex:1}}><div className="wname">{w.name}<span className="vbadge">✅</span></div><div className="wspec">{w.specialty}</div><div className="wmeta"><span className="wrat">⭐ {w.rating}</span><span className="wjob">{w.jobs} kerja</span><span className="wdist">📍 {w.dist}km</span><span className="wslot">🕐 {w.nextSlot}</span></div></div>
                <div className={`dot ${w.status==="online"?"don":"dbusy"}`}/>
              </div>
            ))}
          </div>
        </div>}

        {/* ── MAP ── */}
        {page==="map"&&<div className="sec" style={{paddingTop:22}}>
          <div className="sectitle" style={{marginBottom:12}}>🗺 Peta Pekerja Terdekat</div>
          <MapView/>
          <div className="wgrid" style={{marginTop:12}}>
            {sortedW.map(w=>(
              <div key={w.id} className="wcard">
                <div className="wav">{w.avatar}<span className="tierbadge">{TIERS[getTier(w.jobs)]}</span></div>
                <div style={{flex:1}}><div className="wname">{w.name}<span className="vbadge">✅</span></div><div className="wspec">{w.specialty}</div><div className="wmeta"><span className="wrat">⭐ {w.rating}</span><span className="wdist">📍 {w.dist}km</span><span className="wslot">🕐 {w.nextSlot}</span></div></div>
                <button className={`favbtn ${favW.includes(w.id)?"act":""}`} onClick={()=>{setFavW(p=>p.includes(w.id)?p.filter(x=>x!==w.id):[...p,w.id]);shT(favW.includes(w.id)?"💔 Dihapus":"💛 Ditambah!");}}>{favW.includes(w.id)?"💛":"🤍"}</button>
              </div>
            ))}
          </div>
        </div>}

        {/* ── FAVORITES ── */}
        {page==="favorites"&&<div className="sec" style={{paddingTop:22}}>
          <div className="sectitle" style={{marginBottom:14}}>❤️ Favorit Saya</div>
          {favW.length>0&&<><div style={{fontSize:9,color:"#7799BB",marginBottom:8,textTransform:"uppercase",letterSpacing:".5px"}}>Pekerja Favorit</div>
            <div className="wgrid" style={{marginBottom:20}}>
              {WORKERS.filter(w=>favW.includes(w.id)).map(w=>(
                <div key={w.id} className="wcard" onClick={()=>setSelW(w)}>
                  <div className="wav">{w.avatar}<span className="fstar">⭐</span><span className="tierbadge">{TIERS[getTier(w.jobs)]}</span></div>
                  <div style={{flex:1}}><div className="wname">{w.name}</div><div className="wspec">{w.specialty}</div><div className="wmeta"><span className="wrat">⭐ {w.rating}</span><span className="wdist">📍 {w.dist}km</span></div></div>
                  <button className="favbtn act" onClick={e=>{e.stopPropagation();setFavW(p=>p.filter(x=>x!==w.id));shT("💔 Dihapus");}}>Hapus</button>
                </div>
              ))}
            </div>
          </>}
          {favS.length>0&&<><div style={{fontSize:9,color:"#7799BB",marginBottom:8,textTransform:"uppercase",letterSpacing:".5px"}}>Layanan Favorit</div>
            <div className="sgrid">{SERVICES.filter(s=>favS.includes(s.id)).map(s=>(
              <div key={s.id} className="scard" onClick={()=>{setSelSvc(s);setPriceBreakId(s.id);}}>
                <button className="sfav act" onClick={e=>{e.stopPropagation();setFavS(p=>p.filter(x=>x!==s.id));}}>❤️</button>
                <div className="sico">{s.icon}</div><div className="sname">{s.name}</div><div className="sdesc">{s.desc}</div><div className="sdur">⏱ {s.dur}</div><div className="sprice">ab {fmt(dynPrice(s,isPro))}</div>
              </div>
            ))}</div>
          </>}
          {favW.length===0&&favS.length===0&&<div style={{textAlign:"center",color:"#7799BB",padding:44,fontSize:12}}>Belum ada favorit.<br/>Tap 🤍 untuk menambahkan!</div>}
        </div>}

        {/* ── MY ORDERS ── */}
        {page==="myorders"&&<div className="sec" style={{paddingTop:22}}>
          <div className="sectitle" style={{marginBottom:12}}>Pesanan Saya</div>
          {orders.map(o=>(
            <div key={o.id} className="ocard">
              <div className="ocdhd">
                <div><div className="ocsvc">{o.icon} {o.service} {o.recurring&&<span style={{fontSize:9,background:"rgba(156,39,176,.1)",color:"#CE93D8",border:"1px solid rgba(156,39,176,.18)",borderRadius:20,padding:"1px 6px",marginLeft:4}}>🔁 {o.recurring==="daily"?"Harian":o.recurring==="weekly"?"Mingguan":"Bulanan"}</span>}</div><div className="ocid">{o.id} · {o.address}</div></div>
                <div style={{textAlign:"right"}}><div className="ocprice">{fmt(o.price)}</div><div className="ocdate">{o.date} {o.time}</div><span className={`badge ${sCls[o.status]}`} style={{marginTop:3,display:"inline-block"}}>{sLabel[o.status]}</span></div>
              </div>
              <Tracking status={o.status}/>
              {(o.photos?.length>0||(o.status==="in_progress"))&&(
                <div className="photo-row">
                  {["before","progress","after"].map(s=>(
                    <div key={s} style={{flex:1,background:o.photos?.includes(s)?"rgba(76,175,80,.07)":"rgba(255,255,255,.03)",border:`1px solid ${o.photos?.includes(s)?"rgba(76,175,80,.2)":"rgba(255,255,255,.06)"}`,borderRadius:8,padding:8,textAlign:"center",fontSize:10,color:o.photos?.includes(s)?"#4CAF50":"#7799BB",cursor:"pointer"}} onClick={()=>setPhotoId(o.id)}>
                      <div style={{fontSize:16,marginBottom:3}}>{o.photos?.includes(s)?"📸":"📷"}</div>
                      <div>{s==="before"?"Sebelum":s==="progress"?"Proses":"Sesudah"}</div>
                    </div>
                  ))}
                </div>
              )}
              <div className="ocbtns">
                <button className="obtn ob-gh" onClick={()=>setChatId(o.id)}>💬 Chat</button>
                {o.status==="waiting"&&<button className="obtn ob-org" onClick={()=>setPayId(o.id)}>💳 Bayar</button>}
                {o.status==="in_progress"&&<button className="obtn ob-p" onClick={()=>setOtpId(o.id)}>🔑 OTP</button>}
                {o.status==="done"&&!o.rated&&<button className="obtn ob-y" onClick={()=>setRateId(o.id)}>⭐ Rating</button>}
                {o.status==="done"&&o.rated&&<span style={{fontSize:9,color:"#4CAF50",padding:"4px 0"}}>✅ Rated</span>}
                {(o.photos?.length>0||o.status==="in_progress")&&<button className="obtn ob-b" onClick={()=>setPhotoId(o.id)}>📸 Foto</button>}
                <button className="obtn ob-gh" onClick={()=>{setSelSvc(SERVICES.find(s=>s.name===o.service)||SERVICES[0]);setPriceBreakId(1);}}>🔄 Pesan Lagi</button>
              </div>
            </div>
          ))}
        </div>}

        {/* ── SPENDING ── */}
        {page==="spending"&&<div className="sec" style={{paddingTop:22}}>
          <div className="sectitle" style={{marginBottom:14}}>💰 Riwayat Pengeluaran</div>
          <div className="ss-grid">
            <div className="ss-card"><div className="ss-num">{fmt(totalSpend)}</div><div className="ss-lbl">Total</div></div>
            <div className="ss-card"><div className="ss-num">{orders.filter(o=>o.status==="done").length}</div><div className="ss-lbl">Pesanan Selesai</div></div>
            <div className="ss-card"><div className="ss-num">{fmt(Math.round(totalSpend/(orders.filter(o=>o.status==="done").length||1)))}</div><div className="ss-lbl">Rata-rata</div></div>
          </div>
          <div className="chart">
            <div className="chartttl"><span>Pengeluaran 5 Bulan</span><span style={{fontSize:10,color:"#FF5722",fontWeight:600}}>{fmt(SPENDING_DATA.reduce((a,s)=>a+s.amount,0))}</span></div>
            <div className="bars">{SPENDING_DATA.map(s=><div key={s.month} className="bcol"><div className="bar org" style={{height:`${(s.amount/maxSpend)*100}%`}}/><div className="barlbl">{s.month}</div></div>)}</div>
          </div>
          <div className="tblwrap">
            <table className="tbl">
              <thead><tr><th>Tanggal</th><th>Layanan</th><th>Status</th><th>Jumlah</th></tr></thead>
              <tbody>{orders.map(o=>(
                <tr key={o.id}><td style={{color:"#7799BB"}}>{o.date}</td><td>{o.icon} {o.service}</td><td><span className={`badge ${sCls[o.status]}`}>{sLabel[o.status]}</span></td><td style={{fontWeight:600,color:"#FF5722"}}>{fmt(o.price)}</td></tr>
              ))}</tbody>
            </table>
          </div>
        </div>}

        {/* ── MEMBERSHIP ── */}
        {page==="membership"&&<div className="sec" style={{paddingTop:22}}>
          <div className="sectitle" style={{marginBottom:14}}>⚡ Pilih Paket</div>
          <div className="mem-grid">
            {MEMBERSHIP_PLANS.map(plan=>(
              <div key={plan.id} className={`mem-card ${plan.popular?"popular":""}`} style={{borderColor:plan.popular?"rgba(255,87,34,.4)":undefined}}>
                {plan.popular&&<div className="mem-popular-tag">⭐ Paling Populer</div>}
                <div className="mem-name" style={{color:plan.color}}>{plan.name}</div>
                <div className="mem-price" style={{color:plan.color}}>{plan.price===0?"Gratis":fmt(plan.price)+"/bln"}</div>
                {plan.features.map(f=><div key={f} className="mem-feature">{f}</div>)}
                <button className={`blg ${plan.id==="free"?"out":plan.id==="bisnis"?"gold":"org"}`} style={{width:"100%",marginTop:12}}
                  onClick={()=>{if(plan.id!=="free"){setIsPro(plan.id==="pro"||plan.id==="bisnis");addN("⚡","Upgrade Berhasil!",`Kamu sekarang menggunakan ${plan.name}.`);shT(`🎉 Selamat! Kamu sudah jadi ${plan.name}!`);}else{setIsPro(false);shT("Plan diubah ke Gratis.");}}}>
                  {isPro&&(plan.id==="pro"||plan.id==="bisnis")?"✅ Aktif":"Pilih Paket"}
                </button>
              </div>
            ))}
          </div>
          <div style={{background:"rgba(255,255,255,.03)",border:"1px solid rgba(255,255,255,.06)",borderRadius:11,padding:16}}>
            <div style={{fontFamily:"'Syne',sans-serif",fontWeight:700,fontSize:13,marginBottom:10}}>Perbandingan Fitur</div>
            {[["Biaya layanan","5%","0%","0%"],["Prioritas antrian","❌","✅","✅"],["Diskon semua layanan","❌","10%","10%"],["Akun pekerja tetap","❌","❌","5 akun"],["Laporan bulanan","❌","❌","✅"]].map(([f,...vals])=>(
              <div key={f} style={{display:"grid",gridTemplateColumns:"2fr 1fr 1fr 1fr",gap:8,padding:"7px 0",borderBottom:"1px solid rgba(255,255,255,.04)",fontSize:10}}>
                <span style={{color:"#aaa"}}>{f}</span>
                {vals.map((v,i)=><span key={i} style={{textAlign:"center",color:v==="❌"?"#5566AA":v==="✅"?"#4CAF50":"#FFC107",fontWeight:v!=="❌"?"600":"400"}}>{v}</span>)}
              </div>
            ))}
          </div>
        </div>}

        {/* ── REFERRAL ── */}
        {page==="referral"&&<div className="sec" style={{paddingTop:22}}>
          <div className="sectitle" style={{marginBottom:14}}>🎁 Program Referral</div>
          <div className="ref-card">
            <div style={{textAlign:"center",marginBottom:10}}>
              <div style={{fontSize:36,marginBottom:6}}>🎉</div>
              <div style={{fontFamily:"'Syne',sans-serif",fontSize:16,fontWeight:700,marginBottom:4}}>Ajak Teman, Dapat Reward!</div>
              <div style={{color:"#aaa",fontSize:11,lineHeight:1.6}}>Kamu <b style={{color:"#4CAF50"}}>+Rp50.000</b> · Teman <b style={{color:"#4CAF50"}}>+Rp25.000</b></div>
            </div>
            <div style={{fontSize:9,color:"#7799BB",textAlign:"center",marginBottom:4,textTransform:"uppercase",letterSpacing:".5px"}}>Kode Referralmu</div>
            <div className="ref-code" onClick={()=>shT("✅ Disalin!")}>TASKKU-ANDA123</div>
            <div style={{display:"flex",gap:7}}><button className="blg grn" style={{flex:1}} onClick={()=>shT("🔗 Link dibagikan!")}>📤 Bagikan</button><button className="blg out" style={{flex:1}} onClick={()=>shT("✅ Disalin!")}>📋 Salin</button></div>
          </div>
          <div className="dgrid">
            {[["👥","3","Teman Diajak"],["✅","2","Berhasil Order"],["💰","Rp 100K","Total Reward"],["⏳","1","Menunggu"]].map(([ico,num,lbl])=>(
              <div key={lbl} className="dcard"><div className="dico">{ico}</div><div className="dnum">{num}</div><div className="dlbl">{lbl}</div></div>
            ))}
          </div>
        </div>}

        {/* ── WORKER DASHBOARD ── */}
        {page==="worker"&&<div className="sec" style={{paddingTop:22}}>
          <div className="sectitle" style={{marginBottom:14}}>Dashboard Pekerja</div>
          <div className="tier-progress">
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
              <div><div style={{fontWeight:600,fontSize:13}}>🥇 Level Gold</div><div style={{color:"#7799BB",fontSize:10,marginTop:1}}>234 / 300 order menuju Platinum 💎</div></div>
              <div style={{fontSize:11,color:"#FFC107",fontWeight:600}}>78%</div>
            </div>
            <div className="tier-bar-wrap"><div className="tier-bar" style={{width:"78%"}}/></div>
          </div>
          <div className="dgrid">
            {[["📋","5","Pesanan Baru"],["✅","23","Selesai"],["⭐","4.9","Rating"],["💰","Rp 575K","Hari Ini"]].map(([ico,num,lbl])=>(
              <div key={lbl} className="dcard"><div className="dico">{ico}</div><div className="dnum">{num}</div><div className="dlbl">{lbl}</div></div>
            ))}
          </div>
          <div className="chart">
            <div className="chartttl"><span>📈 Penghasilan Minggu Ini</span><span style={{fontSize:10,color:"#FF5722",fontWeight:600}}>{fmt(WEEKLY_EARN.reduce((a,e)=>a+e.amt,0))}</span></div>
            <div className="bars">{WEEKLY_EARN.map(e=><div key={e.day} className="bcol"><div className="bar org" style={{height:`${(e.amt/maxEarn)*100}%`}}/><div className="barlbl">{e.day}</div></div>)}</div>
          </div>
          <div className="tabs">
            {[["available","Baru"],["active","Dikerjakan"],["history","Riwayat"]].map(([t,l])=>(
              <button key={t} className={`tab ${wtab===t?"on":""}`} onClick={()=>setWtab(t)}>{l}</button>
            ))}
          </div>
          <div className="tblwrap">
            <table className="tbl">
              <thead><tr><th>ID</th><th>Layanan</th><th>Pelanggan</th><th>Harga</th><th>Aksi</th></tr></thead>
              <tbody>
                {orders.filter(o=>wtab==="available"?o.status==="waiting":wtab==="active"?o.status==="in_progress":o.status==="done").map(o=>(
                  <tr key={o.id}>
                    <td style={{color:"#FF5722",fontWeight:600,fontSize:10}}>{o.id}</td>
                    <td>{o.service}</td><td>{o.customer}</td><td style={{fontWeight:600}}>{fmt(o.price)}</td>
                    <td><div style={{display:"flex",gap:4}}>
                      <button className="obtn ob-gh" style={{fontSize:9,padding:"3px 6px"}} onClick={()=>setChatId(o.id)}>💬</button>
                      {wtab==="available"&&<><button className="obtn ob-org" style={{fontSize:9,padding:"3px 7px"}} onClick={()=>{setOrders(p=>p.map(x=>x.id===o.id?{...x,status:"in_progress"}:x));addN("✅","Pesanan Diterima","Pekerja menerima pesananmu.");shT("✅ Diterima!");}}>Terima</button>
                      <button className="obtn ob-p" style={{fontSize:9,padding:"3px 6px"}} onClick={()=>setOtpId(o.id)}>🔑</button></>}
                      {wtab==="active"&&<><button className="obtn ob-b" style={{fontSize:9,padding:"3px 6px"}} onClick={()=>setPhotoId(o.id)}>📸</button>
                      <button className="obtn ob-g" style={{fontSize:9,padding:"3px 7px"}} onClick={()=>{setOrders(p=>p.map(x=>x.id===o.id?{...x,status:"done"}:x));addN("🎉","Pesanan Selesai","Beri rating untuk pekerja!");shT("🎉 Selesai!");}}>Selesai</button></>}
                      {wtab==="history"&&<span className="badge bd">Selesai</span>}
                    </div></td>
                  </tr>
                ))}
                {orders.filter(o=>wtab==="available"?o.status==="waiting":wtab==="active"?o.status==="in_progress":o.status==="done").length===0&&(
                  <tr><td colSpan={5} style={{textAlign:"center",color:"#7799BB",padding:22}}>Tidak ada pesanan</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>}

        {/* ── ADMIN ── */}
        {page==="admin"&&<div className="sec" style={{paddingTop:22}}>
          <div className="sectitle" style={{marginBottom:14}}>Admin Panel</div>
          <div className="dgrid">
            {[["👥","12,430","Pengguna"],["📦",String(orders.length),"Pesanan"],["🔧","3","Pekerja Aktif"],["💵","Rp 2.1M","Pendapatan"]].map(([ico,num,lbl])=>(
              <div key={lbl} className="dcard"><div className="dico">{ico}</div><div className="dnum">{num}</div><div className="dlbl">{lbl}</div></div>
            ))}
          </div>

          <div className="chart" style={{marginBottom:16}}>
            <div className="chartttl"><span>Revenue per Kategori</span><span style={{fontSize:10,color:"#FF5722",fontWeight:600}}>{fmt(ANALYTICS.revenueBycat.reduce((a,r)=>a+r.val,0))}</span></div>
            <div className="bars">
              {ANALYTICS.revenueBycat.map(r=>(
                <div key={r.cat} className="bcol"><div className="bar org" style={{height:`${(r.val/maxAnl)*100}%`}}/><div className="barlbl">{r.cat}</div></div>
              ))}
            </div>
          </div>

          <div className="dgrid" style={{marginBottom:16}}>
            {[["🎯",`${ANALYTICS.conversionRate}%`,"Conversion Rate"],["📉",`${ANALYTICS.churnRate}%`,"Churn Rate"],["⚡",ANALYTICS.avgResponseTime,"Avg Response"]].map(([ico,num,lbl])=>(
              <div key={lbl} className="dcard"><div className="dico">{ico}</div><div className="dnum" style={{fontSize:16}}>{num}</div><div className="dlbl">{lbl}</div></div>
            ))}
          </div>

          <div className="chart" style={{marginBottom:16}}>
            <div className="chartttl"><span>🔥 Peta Panas Permintaan (24 jam)</span></div>
            <div className="heatmap">
              {ANALYTICS.heatmap.map((v,i)=>{
                const max=Math.max(...ANALYTICS.heatmap);
                const intensity=v/max;
                const bg=`rgba(255,${Math.round(87+(1-intensity)*100)},34,${0.15+intensity*0.7})`;
                return <div key={i} className="hcell" style={{background:bg}} title={`Jam ${i}:00 — ${v} permintaan`}/>;
              })}
            </div>
            <div style={{display:"flex",justifyContent:"space-between",marginTop:5,fontSize:9,color:"#7799BB"}}>
              {["00","06","12","18","23"].map(h=><span key={h}>{h}:00</span>)}
            </div>
          </div>

          <div className="tblwrap" style={{marginBottom:16}}>
            <table className="tbl">
              <thead><tr><th>ID</th><th>Layanan</th><th>Pelanggan</th><th>Harga</th><th>Status</th><th>Aksi</th></tr></thead>
              <tbody>{orders.map(o=>(
                <tr key={o.id}>
                  <td style={{color:"#FF5722",fontWeight:600,fontSize:9}}>{o.id}</td>
                  <td>{o.service}</td><td>{o.customer}</td>
                  <td style={{fontWeight:600}}>{fmt(o.price)}</td>
                  <td><span className={`badge ${sCls[o.status]}`}>{sLabel[o.status]}</span></td>
                  <td><button style={{background:"rgba(244,67,54,.07)",border:"1px solid rgba(244,67,54,.18)",color:"#F44336",padding:"3px 7px",borderRadius:5,cursor:"pointer",fontSize:9,fontFamily:"'DM Sans',sans-serif"}} onClick={()=>{setOrders(p=>p.filter(x=>x.id!==o.id));shT("🗑️ Dihapus");}}>Hapus</button></td>
                </tr>
              ))}</tbody>
            </table>
          </div>

          <div className="sectitle" style={{marginBottom:10}}>Tier Pekerja</div>
          <div className="wgrid">
            {WORKERS.map(w=>(
              <div key={w.id} className="wcard">
                <div className="wav">{w.avatar}<span className="tierbadge">{TIERS[getTier(w.jobs)]}</span></div>
                <div style={{flex:1}}><div className="wname">{w.name}<span className="vbadge">✅</span></div><div className="wspec">{w.specialty}</div><div className="wmeta"><span className="wrat">⭐ {w.rating}</span><span className="wjob">{w.jobs} order</span><span style={{color:getTier(w.jobs)==="platinum"?"#9C27B0":getTier(w.jobs)==="gold"?"#FFC107":"#aaa",fontSize:9}}>{getTier(w.jobs).toUpperCase()}</span></div></div>
                <div className={`dot ${w.status==="online"?"don":"dbusy"}`}/>
              </div>
            ))}
          </div>
        </div>}

        {/* ── MODALS ── */}
        {modal==="login"&&(
          <div className="overlay" onClick={()=>setModal(null)}>
            <div className="modal" onClick={e=>e.stopPropagation()}>
              <div className="mhd"><div className="mtitle">Masuk ke TaskKu ⚡</div><button className="mclose" onClick={()=>setModal(null)}>×</button></div>
              <div className="fg"><label className="flbl">Email</label><input className="fi" type="email" placeholder="email@kamu.com" value={lf.email} onChange={e=>setLf({...lf,email:e.target.value})}/></div>
              <div className="fg"><label className="flbl">Password</label><input className="fi" type="password" placeholder="••••••••" value={lf.password} onChange={e=>setLf({...lf,password:e.target.value})}/></div>
              <div className="fg"><label className="flbl">Masuk Sebagai</label>
                <select className="fsel" value={lf.roleSelect} onChange={e=>setLf({...lf,roleSelect:e.target.value})}>
                  <option value="customer">👤 Pelanggan</option><option value="worker">🔧 Pekerja</option><option value="admin">👑 Admin</option>
                </select>
              </div>
              <button className="blg org" style={{width:"100%",marginTop:5}} onClick={handleLogin}>Masuk Sekarang</button>
              <div style={{textAlign:"center",marginTop:9,color:"#7799BB",fontSize:10}}>Belum punya akun? <span style={{color:"#FF5722",cursor:"pointer"}} onClick={()=>setModal("register")}>Daftar gratis</span></div>
            </div>
          </div>
        )}

        {modal==="register"&&(
          <div className="overlay" onClick={()=>setModal(null)}>
            <div className="modal" onClick={e=>e.stopPropagation()}>
              <div className="mhd"><div className="mtitle">Daftar TaskKu 🚀</div><button className="mclose" onClick={()=>setModal(null)}>×</button></div>
              {["Nama Lengkap","Email","No. HP","Password"].map(f=><div className="fg" key={f}><label className="flbl">{f}</label><input className="fi" type={f==="Password"?"password":"text"} placeholder={f}/></div>)}
              <div className="fg"><label className="flbl">Daftar Sebagai</label><select className="fsel"><option value="customer">👤 Pelanggan</option><option value="worker">🔧 Pekerja</option></select></div>
              <button className="blg org" style={{width:"100%",marginTop:5}} onClick={()=>{setModal("login");shT("✅ Akun berhasil dibuat!");}}>Buat Akun</button>
            </div>
          </div>
        )}

        {/* ORDER FORM */}
        {priceBreakId&&selSvc&&(
          <div className="overlay" onClick={()=>setPriceBreakId(null)}>
            <div className="modal modlg" onClick={e=>e.stopPropagation()}>
              <div className="mhd">
                <div><div style={{fontSize:22,marginBottom:2}}>{selSvc.icon}</div><div className="mtitle">{selSvc.name}</div><div style={{color:"#7799BB",fontSize:10,marginTop:1}}>⏱ {selSvc.dur}</div></div>
                <button className="mclose" onClick={()=>setPriceBreakId(null)}>×</button>
              </div>

              {savedAddrs.length>0&&<>
                <div className="flbl" style={{marginBottom:6}}>📍 Alamat Tersimpan</div>
                <div className="addr-list">
                  {savedAddrs.map(a=>(
                    <div key={a.id} className={`addr-item ${selAddr?.id===a.id?"sel":""}`} onClick={()=>{setSelAddr(a);setOf(f=>({...f,address:a.address}));}}>
                      <span style={{fontSize:16}}>{a.label.split(" ")[0]}</span>
                      <div><div className="addr-label">{a.label}</div><div className="addr-text">{a.address}</div></div>
                      {selAddr?.id===a.id&&<span style={{color:"#FF5722",fontSize:12,marginLeft:"auto"}}>✓</span>}
                    </div>
                  ))}
                </div>
                <div className="flbl" style={{marginBottom:4}}>Atau ketik alamat baru:</div>
              </>}
              <div className="fg"><input className="fi" placeholder="Jl. Contoh No.1, Jakarta" value={of.address} onChange={e=>{setOf({...of,address:e.target.value});setSelAddr(null);}}/></div>
              <div className="g2">
                <div className="fg"><label className="flbl">Tanggal</label><input className="fi" type="date" value={of.date} onChange={e=>setOf({...of,date:e.target.value})}/></div>
                <div className="fg"><label className="flbl">Jam</label><input className="fi" type="time" value={of.time} onChange={e=>setOf({...of,time:e.target.value})}/></div>
              </div>
              <div className="fg">
                <label className="flbl">🔁 Jadwal Berulang</label>
                <div style={{display:"flex",gap:5,flexWrap:"wrap"}}>
                  {[["none","Sekali"],["daily","Tiap Hari"],["weekly","Tiap Minggu"],["monthly","Tiap Bulan"]].map(([v,l])=>(
                    <div key={v} className={`fchip ${of.recurring===v?"on":""}`} onClick={()=>setOf({...of,recurring:v})}>{l}</div>
                  ))}
                </div>
              </div>
              <div className="fg"><label className="flbl">Kode Promo</label><input className="fi" placeholder="Coba HEMAT20" value={of.promo} onChange={e=>setOf({...of,promo:e.target.value.toUpperCase()})}/></div>
              {of.promo==="HEMAT20"&&<div style={{background:"rgba(76,175,80,.05)",border:"1px solid rgba(76,175,80,.14)",borderRadius:7,padding:7,marginBottom:9,fontSize:10,color:"#4CAF50",textAlign:"center"}}>🎉 Diskon 20% diterapkan!</div>}
              <div className="fg"><label className="flbl">Catatan</label><textarea className="fi" rows={2} placeholder="Detail tambahan..." value={of.note} onChange={e=>setOf({...of,note:e.target.value})} style={{resize:"none"}}/></div>
              <div style={{background:"rgba(255,87,34,.04)",border:"1px solid rgba(255,87,34,.1)",borderRadius:7,padding:8,marginBottom:10,fontSize:10,color:"#aaa"}}>
                💡 <b style={{color:"#fff"}}>Ahmad Fauzi ⭐4.9 ✅</b> — 1.2km · Slot <b style={{color:"#4CAF50"}}>Sekarang</b>
              </div>
              {(()=>{
                const h=new Date().getHours();
                const isSurge=(h>=18||h<7)||selSvc.surge>1;
                const surgeAmt=isSurge?Math.round(selSvc.basePrice*(selSvc.surge>1?selSvc.surge-1:0.3)):0;
                const proDisc=isPro?Math.round(selSvc.basePrice*0.1):0;
                const promoDisc=of.promo==="HEMAT20"?Math.round(selSvc.basePrice*0.2):0;
                const subtotal=selSvc.basePrice+surgeAmt-proDisc-promoDisc;
                const fee=isPro?0:Math.round(subtotal*0.05);
                const grand=subtotal+fee;
                return (
                  <>
                    <div className="price-breakdown">
                      <div style={{fontWeight:600,fontSize:11,marginBottom:8}}>💡 Rincian Biaya</div>
                      <div className="pb-row"><span>Biaya dasar</span><span>{fmt(selSvc.basePrice)}</span></div>
                      {isSurge&&<div className="pb-row surge"><span>🔥 Tarif ramai/malam</span><span>+{fmt(surgeAmt)}</span></div>}
                      {proDisc>0&&<div className="pb-row disc"><span>⚡ Diskon Pro (10%)</span><span>-{fmt(proDisc)}</span></div>}
                      {promoDisc>0&&<div className="pb-row disc"><span>🎁 Promo HEMAT20</span><span>-{fmt(promoDisc)}</span></div>}
                      <div className="pb-row"><span>Biaya layanan {isPro?"(Pro: 0%)":"(5%)"}</span><span>{fmt(fee)}</span></div>
                      <div className="pb-row total"><span>Total</span><span style={{color:"#FF5722"}}>{fmt(grand)}</span></div>
                    </div>
                    <button className="blg org" style={{width:"100%"}} onClick={()=>handleOrder(grand)}>
                      🚀 Pesan Sekarang — {fmt(grand)}
                    </button>
                  </>
                );
              })()}
            </div>
          </div>
        )}

        {selW&&<WorkerDetail worker={selW} isFav={favW.includes(selW.id)} onFav={()=>{setFavW(p=>p.includes(selW.id)?p.filter(x=>x!==selW.id):[...p,selW.id]);shT(favW.includes(selW.id)?"💔 Dihapus":"💛 Ditambah!");}} onBook={()=>{setSelW(null);setSelSvc(SERVICES[0]);setPriceBreakId(1);}} onClose={()=>setSelW(null)}/>}
        {chatId&&<ChatModal orderId={chatId} orders={orders} chats={chats} setChats={setChats} onClose={()=>setChatId(null)} role={role||"customer"}/>}
        {payId&&(()=>{const o=orders.find(x=>x.id===payId);if(!o)return null;return <PayModal order={o} wallet={wallet} setWallet={setWallet} isPro={isPro} onClose={()=>setPayId(null)} onSuccess={()=>{setPayId(null);setOrders(p=>p.map(x=>x.id===payId?{...x,status:"in_progress"}:x));addN("✅","Bayar Berhasil","Pekerja menuju lokasi.");setPage("myorders");shT("🎉 Bayar berhasil!");}}/>;})()}
        {rateId&&(()=>{const o=orders.find(x=>x.id===rateId);if(!o)return null;return <RatingModal order={o} onClose={()=>setRateId(null)} onSubmit={(s,c)=>{setOrders(p=>p.map(x=>x.id===rateId?{...x,rated:true}:x));setRateId(null);addN("⭐","Rating Terkirim","Terima kasih!");shT(`⭐ Rating ${s} bintang terkirim!`);}}/>;})()}
        {otpId&&(()=>{const o=orders.find(x=>x.id===otpId);if(!o)return null;return <OTPModal order={o} onClose={()=>setOtpId(null)} onVerified={()=>{addN("🔑","OTP Terverifikasi","Pekerjaan dapat dimulai.");shT("✅ OTP valid! Pekerjaan dapat dimulai.");}} isWorker={role==="worker"}/>;})()}
        {photoId&&(()=>{const o=orders.find(x=>x.id===photoId);if(!o)return null;return <PhotoProgressModal order={o} onClose={()=>setPhotoId(null)} isWorker={role==="worker"} onUpload={stage=>{setOrders(p=>p.map(x=>x.id===photoId?{...x,photos:[...(x.photos||[]),stage]}:x));addN("📸","Foto Dikirim",`Foto ${stage} untuk ${o.service} berhasil diunggah.`);shT(`📸 Foto ${stage} berhasil dikirim!`);}}/>;})()}
        {topup&&<TopupModal onClose={()=>setTopup(false)} onTopup={amt=>{setWallet(w=>w+amt);addN("⚡","Top Up Berhasil",`Saldo ${fmt(amt)} ditambahkan.`);shT(`✅ Top up ${fmt(amt)} berhasil!`);}}/>}

        {/* EMERGENCY */}
        {role==="customer"&&<button className="sos" onClick={()=>{addN("🆘","Tombol Darurat","Tim keamanan dihubungi!");shT("🆘 Tim keamanan dihubungi! Tetap tenang.");}} title="Darurat">🛡️</button>}

        {toast&&<div className="toast">✨ {toast}</div>}
      </div>
    </>
  );
}
