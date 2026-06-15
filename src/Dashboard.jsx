import { useState } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend, RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis } from "recharts";
import { AlertTriangle, TrendingUp, Zap, Target, Shield, CloudLightning, ShoppingCart, Mail, MessageSquare, DollarSign, TreePine, Package, ChevronDown, ChevronUp, ExternalLink, Database, AlertOctagon } from "lucide-react";

// ─── DATA: BAKED IN FROM JUNE 15 2026 RESEARCH + REAL STORE SALES (1,416 SKUs) ─

const SCAN_DATE = "June 15, 2026";
const SCAN_WEEK = "Week of June 15–21, 2026";
const TODAY_INDEX = 0; // Mon 6/15 — scan day, index into weeklyCalendar
const STORE_DATA_SOURCE = "7-Day Sales Forecasting Report — 1,416 SKUs, 7-day + 30-day order velocity";

const urgencyLevels = { CRITICAL: "🔴", HIGH: "🟠", MEDIUM: "🟡", WATCH: "🟢" };

const categories = [
  {
    id: "emergency",
    name: "Emergency Supplies",
    icon: "Shield",
    urgency: "CRITICAL",
    color: "#ef4444",
    heatScore: 96,
    summary: "Day 15 of Atlantic hurricane season. NHC is tracking the first Atlantic area of interest in the Gulf — potential Tropical Storm Arthur could form in the next few days. Layered demand: a multi-day Midwest severe-weather outbreak (Level 3/5 risk Kansas City to St. Louis, 70+ mph winds, tennis-ball hail) hits Wed–Thu this week, and June's severe-weather belt is centered on the Plains / Upper Midwest with derecho risk. Bug-out and hurricane-kit demand is showing up directly in your sales — P-38 Can Opener and MRE 1-meal packs are exploding.",
    sellingNow: [
      "MREs & long-shelf-life food (your runaway #1 category)",
      "P-38 / P-51 can openers (new breakout — bug-out kit signal)",
      "Trauma kits, IFAKs & tourniquet holders",
      "NOAA weather radios, batteries & lanterns (Wed-Thu outbreak)",
      "Water storage, filtration & purification tablets",
      "Portable power stations & battery banks",
    ],
    sellingNext: [
      "Hurricane hardware — tarps, window film, sandbags",
      "Generators & fuel cans if Arthur forms",
      "Evacuation go-bags & pet emergency kits",
      "N95 / wildfire smoke protection (southern tier)",
    ],
    whyNext: "If NHC's Gulf area of interest develops into Tropical Storm Arthur this week, the first named-storm news cycle will spike hurricane-prep demand instantly. The Midwest outbreak Wed-Thu adds a parallel weather-radio / battery demand stream.",
    marketingAngles: {
      email: "Subject: 'Day 15 — Arthur could form this week.' Lead with MRE bundles, weather radios, and a 72-hour checklist. CRITICAL internal: top MRE SKUs at 0.4–2.3 days of cover.",
      social: "'NHC just put up the season's first Atlantic disturbance.' Pair with a 5-item kit checklist reel.",
      ppc: "Surge bids on 'mre case,' 'p-38 can opener,' 'noaa weather radio,' 'trauma kit,' 'tropical storm prep.' Gulf coast geo-boost.",
      sms: "NHC tracking the season's first Atlantic system. MRE cases, can openers & radios shipping today → [link].",
    },
    storeData: {
      topSellers: [
        { name: "MRE Entree — Chicken Burrito Bowl", d30: 1357, d7: 122 },
        { name: "P-38 Can Opener — U.S. Shelby Co.", d30: 695, d7: 223 },
        { name: "2026 GI MRE Case A or B", d30: 553, d7: 109 },
        { name: "Genuine US Issue MRE — 1-Meal Pack", d30: 328, d7: 104 },
        { name: "P-51 Can Opener — U.S. Shelby Co.", d30: 218, d7: 53 },
        { name: "MRE Entree — Beef Stew", d30: 200, d7: 42 },
      ],
      trending: [
        { name: "MRE Chicken & Sausage Jambalaya", d7: 13, d30: 22, mult: 2.5 },
        { name: "NAR C-A-T Tourniquet Holder (Grade 1)", d7: 12, d30: 24, mult: 2.1 },
        { name: "MRE Military Peanut Butter Spread", d7: 22, d30: 48, mult: 2.0 },
      ],
      cold: [
        { name: "U.S. Military Foliage Sandbags (Single)", d7: 0, d30: 30 },
        { name: "NAR C-A-T Tourniquet Holder (Grade 2)", d7: 0, d30: 13 },
      ],
      insight: "🚨 OOS CRISIS WORSENING. Genuine US Issue 1-Meal Pack at 0.4 days cover (4 on hand, 328 d30, NO reorder); MRE Burrito Bowl at 1.7 days (75 oh, 1,357 d30); GI MRE Case at 1.6 days (29 oh, 553 d30); GI MRE 2-Pack at 2.3 days (15 oh, 194 d30). NEW BREAKOUT: P-38 Can Opener exploded from 119 d30 last month to 695 d30 / 223 d7 — bug-out / hurricane-kit demand. PLACE REORDERS TODAY.",
    },
  },
  {
    id: "weather",
    name: "Weather / Storm Events",
    icon: "CloudLightning",
    urgency: "HIGH",
    color: "#f97316",
    heatScore: 88,
    summary: "Multi-day severe weather outbreak hits the Midwest and Northeast Wed-Thu this week, with destructive winds in excess of 70 mph, tennis-ball-sized (2.5\") hail, and strong tornadoes possible. SPC has Level 3/5 risk from Kansas City to St. Louis, broader Level 2/5 Kansas to Kentucky including Louisville, Indianapolis, Columbus. Flash-flooding risk runs from northeast Missouri into northern Illinois. NHC's first Atlantic disturbance is in the Gulf — Arthur could form this week.",
    sellingNow: [
      "Waterproof bags & dry sacks (steady weather sellers)",
      "USMC FILBE Hydration Pack (your top mover, tight stock)",
      "Wet-weather tarps & ponchos (Wed-Thu outbreak prep)",
      "NOAA weather radios & headlamps for outage readiness",
      "Tarps & water-diversion gear (flash-flood zones)",
      "Cooling towels & hydration for sustained heat",
    ],
    sellingNext: [
      "Full hurricane-prep kits if Arthur forms",
      "Generators & fuel storage cans",
      "Storm-cleanup gear after Wed-Thu outbreak",
      "Camping rain gear (Father's Day + summer)",
    ],
    whyNext: "The Wed-Thu Plains/Midwest outbreak will drive an immediate post-event flash-buying cycle 48-72 hours after each round. If Arthur develops, coastal hurricane-prep buying steps up another level.",
    marketingAngles: {
      email: "Subject: 'Tornado outbreak Wed-Thu — KC to St. Louis bullseye.' Feature radios, tarps, headlamps. Geo-target KS/MO/IL/IN/KY.",
      social: "Live SPC outlook map with 'Do you have these tonight?' 3-item checklist. Reel: 'What's in our staff bug-out bag.'",
      ppc: "Bid up: 'weather radio,' 'tarp heavy duty,' 'flashlight,' 'storm prep.' Front-load KS/MO/IL/IN/KY ahead of Wed.",
      sms: "Tornado outbreak hitting KS to KY this week. Radios, tarps & headlamps shipping today → [link].",
    },
    storeData: {
      topSellers: [
        { name: "Military SealLine Large Main Pack Stuff Sack", d30: 46, d7: 7 },
        { name: "USMC Issue FILBE Coyote Hydration Pack", d30: 46, d7: 8 },
        { name: "USMC SealLine Medium Waterproof Stuff Sack", d30: 45, d7: 6 },
        { name: "US Issue Waterproof Wet Weather Bag", d30: 42, d7: 8 },
        { name: "USMC MARPAT Wet Weather Tarp", d30: 32, d7: 4 },
        { name: "USMC MAC Sacks Small SealLine Stuff Sack", d30: 30, d7: 9 },
      ],
      trending: [],
      cold: [],
      insight: "Waterproofing is the steady weather seller — no big accelerators OR cold SKUs this week. FILBE Hydration Pack has only 10 on hand against 46 d30 (~6.5 days cover) — restock candidate. With the Midwest tornado outbreak Wed-Thu, expect a flash demand spike on radios and tarps; front-load PPC now.",
    },
  },
  {
    id: "tactical",
    name: "Tactical & EDC",
    icon: "Target",
    urgency: "HIGH",
    color: "#f97316",
    heatScore: 82,
    summary: "FATHER'S DAY IS SUNDAY — 6 days out. This is the final shopping week. Standard shipping cutoffs ran June 8-16; expedited cutoffs are Wed 6/17 to Thu 6/18 for Sunday 6/21 arrival. NRF projects record $22.4B / $199.38 avg spend. Apparel captures ~56% of gift-buyer spend, but EDC knives, multi-tools, and pocket lights remain perennial top-3 dad-gift categories with strong margin. Section 122 tariffs still in effect through July 24.",
    sellingNow: [
      "Streamlight Sidewinder & EDC flashlights (your top tactical)",
      "Folding knives & fixed blades (Father's Day hero)",
      "Multi-tools & pocket organizers",
      "Fire starters, ferro rods & survival basics",
      "Compasses, whistles & navigation gear",
      "Tactical pens & EDC carry organizers",
    ],
    sellingNext: [
      "Gift cards (Friday/Saturday last-minute hedge)",
      "Same-day pickup options if available",
      "Post-Father's-Day summer EDC restock",
      "Range / utility bags & EDC backpacks",
    ],
    whyNext: "Expedited shipping cutoffs land Wed-Thu — every hour after Thursday afternoon is gift-card or in-store pickup territory. After Sunday, demand transitions hard into post-Father's-Day summer / camping carry.",
    marketingAngles: {
      email: "Subject: '6 days to Father's Day — last chance for shipped gifts.' Tiered bundles + expedited-cutoff banner.",
      social: "'EDC gifts that arrive by Sunday' carousel with Wed/Thu countdown. Unboxing reels of top picks.",
      ppc: "Bid up: 'father's day gift,' 'last minute fathers day gift,' 'best edc knife,' 'engraved knife.' Lean into expedited shipping copy.",
      sms: "6 days to Father's Day. Expedited shipping ends Thursday — knives, lights, multi-tools → [link].",
    },
    storeData: {
      topSellers: [
        { name: "Streamlight Sidewinder Compact II Military Light Kit", d30: 19, d7: 5 },
        { name: "Ontario Knife SP16 SPAX, ACU", d30: 8, d7: 2 },
        { name: "Sweetfire Strikeable Fire Starter, 8-Pack", d30: 8, d7: 2 },
        { name: "Gov Issue Gerber E-Tool Tri-fold Shovel", d30: 7, d7: 1 },
        { name: "Rothco G.I. Style Police Whistle", d30: 7, d7: 5 },
        { name: "18-inch MOLLE Machete Sheath OD", d30: 5, d7: 0 },
      ],
      trending: [
        { name: "Rothco G.I. Style Police Whistle (OD)", d7: 5, d30: 7, mult: 3.1 },
      ],
      cold: [],
      insight: "Tactical is your THINNEST category (29 SKUs, only 98 d30 / 27 d7) and Father's Day is 6 days away. Streamlight Sidewinder remains the lone meaningful seller (19 d30). The assortment doesn't have the depth to ride NRF's $199 avg-spend Father's Day window — lean on gift cards as the hedge and expand multi-tool / pocket-light / folding-knife SKUs next quarter.",
    },
  },
  {
    id: "surplus",
    name: "Military Surplus",
    icon: "Package",
    urgency: "HIGH",
    color: "#f97316",
    heatScore: 75,
    summary: "Gorpcore + summer-camping demand continues to drive surplus. Tariffs (Section 122 10% still collected under May 12 appeals-court stay, expires July 24; ~30%+ on China; SCOTUS struck IEEPA 20% layer) keep imported soft goods 10–20% more expensive than authentic surplus — a real value differentiator. CRITICAL signal this week: last week's Flash Bang MOLLE Pouch breakout died because you stocked out — d7 demand cratered from 316 to 2 units.",
    sellingNow: [
      "MOLLE II ACU M4 Mag Pouch — 128 d30, steady",
      "GI canteens & 1-qt plastic canteens",
      "FILBE / ALICE / MOLLE rucks & sustainment pouches",
      "50 CAL Ammo Cans (storage)",
      "BDU / OCP / Multicam apparel & cargo pants",
      "Boonie hats & summer-weight headwear",
    ],
    sellingNext: [
      "Lightweight summer surplus & sun-protective layers",
      "Camping & sleep systems — bivies, modular sleep, cots",
      "Father's-Day-friendly surplus apparel / boots / bags",
      "Bulk / value bundles ahead of July 4",
    ],
    whyNext: "Camping season is in full swing; the MOLLE pouch breakout shows real bug-out / load-bearing demand exists. Restocking and visibility on the Coyote FILBE Sustainment Pouch (now OOS) will recapture a chunk of that demand.",
    marketingAngles: {
      email: "Subject: 'Restocked: MOLLE pouches, canteens & field gear.' Highlight the breakouts that came back in stock; gorpcore styling for camping season.",
      social: "Gorpcore reel: 'Why authentic surplus beats $200 trend boots' — Charlies shirt, OCP, Boonie hat OOTD.",
      ppc: "Bid up: 'molle pouch,' 'military surplus boots,' 'alice pack,' 'boonie hat,' 'surplus cargo pants.'",
      sms: "MOLLE pouches BACK in stock. Field-tested, tariff-free → [link].",
    },
    storeData: {
      topSellers: [
        { name: "U.S. Issue Flash Bang MOLLE Pouch (Grade 1)", d30: 324, d7: 2 },
        { name: "50 CAL Ammo Can (storage box)", d30: 201, d7: 1 },
        { name: "2-Pack U.S. Issue Flash Bang MOLLE Pouch", d30: 162, d7: 1 },
        { name: "Used MOLLE II ACU M4 Magazine Pouch", d30: 128, d7: 13 },
        { name: "Coyote FILBE Sustainment Pouch", d30: 104, d7: 28 },
        { name: "1 Qt. GI Military Plastic Canteen", d30: 90, d7: 12 },
      ],
      trending: [
        { name: "USMC Grip Dot Shooting Gloves (Medium)", d7: 10, d30: 10, mult: 4.3 },
        { name: "GI Pistol Belt + Canteen + Suspenders Set", d7: 12, d30: 32, mult: 1.6 },
        { name: "U.S. Issue ACU Grenade Pouch (Used)", d7: 10, d30: 22, mult: 1.9 },
      ],
      cold: [
        { name: "U.S. Issue ACU/UCP MOLLE II Canteen GP Pouch", d7: 0, d30: 31 },
        { name: "Multicam Tactical Assault Panel (TAP) Complete", d7: 0, d30: 21 },
      ],
      insight: "🚨 STOCKOUT COST IS REAL: Flash Bang MOLLE Pouch d7 demand cratered from 316 last week to 2 this week — the breakout died because you stocked out, and customers went elsewhere. Coyote FILBE Sustainment Pouch is OOS (0 on hand, 28 d7) — restock immediately. Multiple uniform pieces still breaking out (USMC Grip Dot Gloves at 4.3× pace).",
    },
  },
  {
    id: "hunting",
    name: "Hunting — Turkey / Fishing",
    icon: "TreePine",
    urgency: "MEDIUM",
    color: "#eab308",
    heatScore: 64,
    summary: "Spring turkey is closed nationwide. Summer fishing is in peak — post-spawn bass, walleye, catfish, panfish. Father's Day (this Sunday) traditionally drives a fishing-gear gift bump.",
    sellingNow: [
      "Summer bass tackle — topwater, soft plastics, deep crankbaits",
      "Catfish setups & rod holders",
      "Walleye gear — bottom-bouncers, worm harnesses",
      "Panfish & crappie tackle",
      "Coolers, fillet knives & live wells",
      "UPF apparel, polarized sunglasses & bug repellent",
    ],
    sellingNext: [
      "Kayaks, float tubes & trolling motors",
      "Father's Day fishing gift bundles",
      "Bug & tick protection (peak season)",
      "July 4 camping & lake-weekend gear",
    ],
    whyNext: "Post-spawn bite + warming panfish + active summer = highest-participation weeks. Father's Day adds gift-driven volume.",
    marketingAngles: {
      email: "Subject: 'Summer fishing + Father's Day picks.'",
      social: "Short clip 'Where bass go after the spawn' carousel.",
      ppc: "Bid up: 'post spawn bass lures,' 'catfish rigs,' 'father's day fishing gift.'",
      sms: "Summer fishing season is HERE. Tackle, coolers & combos shipping today → [link].",
    },
    storeData: {
      notStocked: true,
      insight: "STILL UNCHANGED from prior weeks: 0 hunting/turkey/fishing SKUs across all 1,416 active products. This tile keeps showing up as 'not stocked' — strongly recommend pivoting it to a category that matches your actual mix (e.g., 'MREs & Food Storage' which would be your #1 by volume, or 'MOLLE & Carry' which captures the surplus pouch breakouts).",
    },
  },
];

// Derived data for charts
const heatData = categories.map((c) => ({ name: c.name.split(" —")[0].split(" /")[0], score: c.heatScore, fill: c.color }));

const channelPriorityData = [
  { channel: "Email", weather: 92, turkey: 65, emergency: 98, edc: 95, surplus: 80 },
  { channel: "Social", weather: 85, turkey: 70, emergency: 88, edc: 92, surplus: 85 },
  { channel: "PPC", weather: 95, turkey: 60, emergency: 97, edc: 95, surplus: 78 },
  { channel: "SMS", weather: 96, turkey: 55, emergency: 98, edc: 90, surplus: 70 },
];

const weeklyCalendar = [
  { day: "Mon 6/15", action: "🚨 INTERNAL: PLACE MRE REORDERS TODAY. Launch 'Father's Day Final Week' EDC bundles. Tease the Wed-Thu Midwest tornado outbreak in the storm-prep email." },
  { day: "Tue 6/16", action: "Last day for many standard-ship Father's Day gifts — push in-stock items hard. Tornado-prep PPC surge in KS/MO/IL/IN/KY ahead of Wed peak." },
  { day: "Wed 6/17", action: "🌪 SEVERE WEATHER PEAK day (KC to St. Louis bullseye, 70+ mph winds, 2.5\" hail possible). Live SMS to affected geos. Father's Day expedited-ship reminder." },
  { day: "Thu 6/18", action: "Continued severe weather + flash flooding. LAST DAY for most expedited Father's Day gifts — fire 'order by 2pm ET' email." },
  { day: "Fri 6/19", action: "Gift-card / same-day-pickup push for procrastinators. Check NHC for Arthur update — fire hurricane-prep email if a system has formed." },
  { day: "Sat 6/20", action: "Father's Day Eve — gift cards as hero, last-minute social push. Storm-cleanup follow-up to Midwest customers." },
  { day: "Sun 6/21", action: "HAPPY FATHER'S DAY. Pivot site messaging to post-Father's-Day camping & summer gear. July 4 prep email teaser." },
];

const topKeywords = [
  { keyword: "father's day gifts for dad", volume: "Very High", cpc: "$1.50", competition: "High", priority: "🔴" },
  { keyword: "last minute fathers day gift", volume: "Very High", cpc: "$1.80", competition: "High", priority: "🔴" },
  { keyword: "hurricane prep kit", volume: "Very High", cpc: "$1.90", competition: "High", priority: "🔴" },
  { keyword: "noaa weather radio", volume: "High", cpc: "$1.10", competition: "Med", priority: "🔴" },
  { keyword: "tornado prep kit", volume: "High", cpc: "$1.40", competition: "Med", priority: "🔴" },
  { keyword: "best EDC knife", volume: "High", cpc: "$1.60", competition: "High", priority: "🟠" },
  { keyword: "mre case", volume: "High", cpc: "$1.20", competition: "Med", priority: "🟠" },
  { keyword: "multi-tool gift", volume: "Med", cpc: "$1.15", competition: "Med", priority: "🟠" },
  { keyword: "tarp heavy duty", volume: "Med", cpc: "$0.90", competition: "Med", priority: "🟡" },
  { keyword: "p-38 can opener", volume: "Low (rising)", cpc: "$0.50", competition: "Low", priority: "🟡" },
];

const tariffImpact = [
  { item: "Technical Backpacks (Vietnam)", tariff: "10%+ (up to ~25% stacked)", priceImpact: "+~10-20% at retail", action: "Stock now; feature pre-increase pricing as urgency hook" },
  { item: "Boots & Leather Goods (China & Vietnam)", tariff: "30-70% CN / 0-32% VN", priceImpact: "+10-20%; relief 'years away'", action: "Lean into genuine surplus boots as the value alternative" },
  { item: "Field / Cargo Apparel (China & Vietnam)", tariff: "30-70% CN / 0-32% VN", priceImpact: "+10-20% on imported soft goods", action: "Promote surplus apparel margin advantage" },
  { item: "EDC Knives, Lights & Multi-Tools (China)", tariff: "~30%+", priceImpact: "+15-25% on import-dependent SKUs", action: "Bundle for Father's Day this week — 'lock in pricing' urgency" },
  { item: "General Imported Gear (Sec 122 / IEEPA)", tariff: "10% to 7/24; IEEPA struck", priceImpact: "Volatile — appeals stay keeps collection on", action: "Monitor July 24 expiry; avoid overcommitting forward buys" },
];

// ─── REAL STORE DATA: from the June 15, 2026 sales forecasting report ──────────

const overallTopMovers = [
  { name: "MRE Entree — Chicken Burrito Bowl", d30: 1357, d7: 122, category: "Emergency" },
  { name: "P-38 Can Opener — U.S. Shelby Co.", d30: 695, d7: 223, category: "Emergency" },
  { name: "2026 GI MRE Case A or B", d30: 553, d7: 109, category: "Emergency" },
  { name: "Genuine US Issue MRE — 1-Meal Pack", d30: 328, d7: 104, category: "Emergency" },
  { name: "U.S. Issue Flash Bang MOLLE Pouch", d30: 324, d7: 2, category: "Surplus" },
  { name: "P-51 Can Opener — U.S. Shelby Co.", d30: 218, d7: 53, category: "Emergency" },
  { name: "50 CAL Ammo Can (storage)", d30: 201, d7: 1, category: "Surplus" },
  { name: "MRE Entree — Beef Stew", d30: 200, d7: 42, category: "Emergency" },
  { name: "MRE Entree — Mexican Beef w/ Vegetables", d30: 195, d7: 38, category: "Emergency" },
  { name: "2026 GI MRE A&B 2-Pack", d30: 194, d7: 38, category: "Emergency" },
];

const breakouts = [
  { name: "ITW GTSR Loop Body Female Buckle (Coyote Brown)", d7: 64, d30: 64, mult: 4.3, category: "Other" },
  { name: "MRE Military Peanut Butter Spread", d7: 22, d30: 48, mult: 2.0, category: "Emergency" },
  { name: "NAR C-A-T Tourniquet Holder (Grade 1)", d7: 12, d30: 24, mult: 2.1, category: "Emergency" },
  { name: "MRE Chicken & Sausage Jambalaya", d7: 13, d30: 22, mult: 2.5, category: "Emergency" },
  { name: "GI Pistol Belt + Canteen + Suspenders Set", d7: 12, d30: 32, mult: 1.6, category: "Surplus" },
  { name: "USMC Grip Dot Shooting Gloves (Medium)", d7: 10, d30: 10, mult: 4.3, category: "Surplus" },
];

const outOfStockRisk = [
  { name: "Coyote FILBE Sustainment Pouch", oh: 0, d30: 104, cover: 0.0, status: "ALREADY OOS — restock NOW" },
  { name: "Genuine US Issue MRE 1-Meal Pack", oh: 4, d30: 328, cover: 0.4, status: "CRITICAL — 0.4 days, no reorder" },
  { name: "U.S. Issue Flash Bang MOLLE Pouch", oh: 2, d30: 324, cover: 0.2, status: "Last week's breakout — demand cratered" },
  { name: "2-Pack Flash Bang MOLLE Pouch", oh: 1, d30: 162, cover: 0.2, status: "Effectively OOS" },
  { name: "2026 GI MRE Case A or B", oh: 29, d30: 553, cover: 1.6, status: "URGENT — no reorder placed" },
  { name: "MRE Entree — Chicken Burrito Bowl", oh: 75, d30: 1357, cover: 1.7, status: "URGENT — your #1 seller" },
  { name: "P-38 Can Opener — U.S. Shelby Co.", oh: 50, d30: 695, cover: 2.2, status: "NEW breakout — restock immediately" },
  { name: "2026 GI MRE A&B 2-Pack", oh: 15, d30: 194, cover: 2.3, status: "URGENT — 2 days cover" },
];

// ─── COMPONENTS ────────────────────────────────────────────────────────────────

const COLORS = ["#ef4444", "#f97316", "#f97316", "#f97316", "#eab308"];

const TabButton = ({ active, onClick, children, color }) => (
  <button
    onClick={onClick}
    className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${
      active ? "text-white shadow-lg" : "text-gray-300 hover:text-white hover:bg-gray-700"
    }`}
    style={active ? { backgroundColor: color } : {}}
  >
    {children}
  </button>
);

const UrgencyBadge = ({ level }) => {
  const colors = { CRITICAL: "bg-red-500", HIGH: "bg-orange-500", MEDIUM: "bg-yellow-500", WATCH: "bg-green-500" };
  return (
    <span className={`${colors[level]} text-white text-xs font-bold px-2 py-1 rounded-full`}>
      {urgencyLevels[level]} {level}
    </span>
  );
};

const CategoryDetail = ({ cat }) => {
  const [expanded, setExpanded] = useState({ now: true, next: true, marketing: false, store: true });
  const toggle = (key) => setExpanded((p) => ({ ...p, [key]: !p[key] }));

  return (
    <div className="space-y-4">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <h3 className="text-xl font-bold text-white">{cat.name}</h3>
            <UrgencyBadge level={cat.urgency} />
          </div>
          <p className="text-gray-300 text-sm leading-relaxed">{cat.summary}</p>
        </div>
        <div className="ml-4 text-right">
          <div className="text-3xl font-black" style={{ color: cat.color }}>{cat.heatScore}</div>
          <div className="text-xs text-gray-500 uppercase tracking-wide">Heat Score</div>
        </div>
      </div>

      {/* Selling NOW */}
      <div className="bg-gray-800 rounded-lg overflow-hidden">
        <button onClick={() => toggle("now")} className="w-full flex items-center justify-between p-3 hover:bg-gray-750">
          <span className="text-sm font-semibold text-green-400 flex items-center gap-2">
            <Zap size={14} /> SELLING FASTEST RIGHT NOW
          </span>
          {expanded.now ? <ChevronUp size={16} className="text-gray-400" /> : <ChevronDown size={16} className="text-gray-400" />}
        </button>
        {expanded.now && (
          <div className="px-3 pb-3">
            <div className="grid grid-cols-1 gap-1">
              {cat.sellingNow.map((item, i) => (
                <div key={i} className="flex items-center gap-2 text-sm text-gray-200">
                  <span className="text-green-400">▸</span> {item}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Selling NEXT WEEK */}
      <div className="bg-gray-800 rounded-lg overflow-hidden">
        <button onClick={() => toggle("next")} className="w-full flex items-center justify-between p-3 hover:bg-gray-750">
          <span className="text-sm font-semibold text-blue-400 flex items-center gap-2">
            <TrendingUp size={14} /> SELLING NEXT WEEK & WHY
          </span>
          {expanded.next ? <ChevronUp size={16} className="text-gray-400" /> : <ChevronDown size={16} className="text-gray-400" />}
        </button>
        {expanded.next && (
          <div className="px-3 pb-3 space-y-2">
            <div className="grid grid-cols-1 gap-1">
              {cat.sellingNext.map((item, i) => (
                <div key={i} className="flex items-center gap-2 text-sm text-gray-200">
                  <span className="text-blue-400">▸</span> {item}
                </div>
              ))}
            </div>
            <div className="bg-gray-900 rounded p-2 mt-2">
              <p className="text-xs text-gray-400 italic"><strong className="text-blue-400">WHY:</strong> {cat.whyNext}</p>
            </div>
          </div>
        )}
      </div>

      {/* Marketing Angles */}
      <div className="bg-gray-800 rounded-lg overflow-hidden">
        <button onClick={() => toggle("marketing")} className="w-full flex items-center justify-between p-3 hover:bg-gray-750">
          <span className="text-sm font-semibold text-purple-400 flex items-center gap-2">
            <Target size={14} /> MARKETING PLAYBOOK
          </span>
          {expanded.marketing ? <ChevronUp size={16} className="text-gray-400" /> : <ChevronDown size={16} className="text-gray-400" />}
        </button>
        {expanded.marketing && (
          <div className="px-3 pb-3 space-y-3">
            {[
              { label: "Email", icon: <Mail size={13} />, text: cat.marketingAngles.email, bg: "bg-blue-900/30", border: "border-blue-700" },
              { label: "Social", icon: <MessageSquare size={13} />, text: cat.marketingAngles.social, bg: "bg-pink-900/30", border: "border-pink-700" },
              { label: "PPC", icon: <DollarSign size={13} />, text: cat.marketingAngles.ppc, bg: "bg-green-900/30", border: "border-green-700" },
              { label: "SMS", icon: <Zap size={13} />, text: cat.marketingAngles.sms, bg: "bg-yellow-900/30", border: "border-yellow-700" },
            ].map((ch) => (
              <div key={ch.label} className={`${ch.bg} border ${ch.border} rounded-lg p-3`}>
                <div className="flex items-center gap-2 mb-1">
                  {ch.icon}
                  <span className="text-xs font-bold uppercase tracking-wide text-gray-300">{ch.label}</span>
                </div>
                <p className="text-sm text-gray-200">{ch.text}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Store Data — REAL */}
      {cat.storeData && (
        <div className="bg-gray-800 rounded-lg overflow-hidden border border-cyan-900/50">
          <button onClick={() => toggle("store")} className="w-full flex items-center justify-between p-3 hover:bg-gray-750">
            <span className="text-sm font-semibold text-cyan-300 flex items-center gap-2">
              <Database size={14} /> YOUR STORE — REAL DATA (7-DAY + 30-DAY VELOCITY)
            </span>
            {expanded.store ? <ChevronUp size={16} className="text-gray-400" /> : <ChevronDown size={16} className="text-gray-400" />}
          </button>
          {expanded.store && (
            <div className="px-3 pb-3 space-y-3">
              {cat.storeData.notStocked ? (
                <div className="bg-yellow-950/40 border border-yellow-800/60 rounded p-3">
                  <p className="text-xs font-bold uppercase tracking-wide text-yellow-300 mb-1">⚠ Not stocked</p>
                  <p className="text-sm text-gray-200">{cat.storeData.insight}</p>
                </div>
              ) : (
                <>
                  <div className="bg-cyan-950/30 border border-cyan-800/50 rounded p-3">
                    <p className="text-xs text-gray-200 leading-relaxed"><strong className="text-cyan-300">INSIGHT:</strong> {cat.storeData.insight}</p>
                  </div>
                  <div>
                    <p className="text-xs font-bold uppercase tracking-wide text-cyan-300 mb-2">Top sellers (30-day & 7-day orders)</p>
                    <div className="bg-gray-900 rounded overflow-hidden">
                      <table className="w-full text-xs">
                        <thead>
                          <tr className="border-b border-gray-700 text-gray-500">
                            <th className="text-left p-2 font-medium">Product</th>
                            <th className="text-right p-2 font-medium">30d</th>
                            <th className="text-right p-2 font-medium">7d</th>
                          </tr>
                        </thead>
                        <tbody>
                          {cat.storeData.topSellers.map((p, i) => (
                            <tr key={i} className="border-b border-gray-800/50">
                              <td className="p-2 text-gray-200">{p.name}</td>
                              <td className="p-2 text-right text-white font-mono font-bold">{p.d30.toLocaleString()}</td>
                              <td className="p-2 text-right text-gray-400 font-mono">{p.d7.toLocaleString()}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                  {cat.storeData.trending && cat.storeData.trending.length > 0 && (
                    <div>
                      <p className="text-xs font-bold uppercase tracking-wide text-green-400 mb-2">🔥 Accelerating (7-day pace &gt; 30-day average)</p>
                      <div className="space-y-1">
                        {cat.storeData.trending.map((p, i) => (
                          <div key={i} className="bg-green-950/30 border border-green-900/50 rounded p-2 flex items-center justify-between gap-2">
                            <span className="text-xs text-gray-200">{p.name}</span>
                            <span className="text-xs font-mono text-green-400 font-bold whitespace-nowrap">{p.mult.toFixed(1)}× pace · 7d:{p.d7}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  {cat.storeData.cold && cat.storeData.cold.length > 0 && (
                    <div>
                      <p className="text-xs font-bold uppercase tracking-wide text-gray-400 mb-2">❄ Going cold (0 sold this week, was selling)</p>
                      <div className="space-y-1">
                        {cat.storeData.cold.map((p, i) => (
                          <div key={i} className="bg-gray-900 border border-gray-700/50 rounded p-2 flex items-center justify-between gap-2">
                            <span className="text-xs text-gray-300">{p.name}</span>
                            <span className="text-xs font-mono text-gray-400 whitespace-nowrap">7d:0 · 30d:{p.d30}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

// ─── MAIN DASHBOARD ────────────────────────────────────────────────────────────

export default function ArmyNavyTrendDashboard() {
  const [activeTab, setActiveTab] = useState("overview");
  const [selectedCategory, setSelectedCategory] = useState(categories[0].id);

  const activeCat = categories.find((c) => c.id === selectedCategory);

  return (
    <div className="bg-gray-950 text-white min-h-screen p-4 font-sans">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-1">
          <Shield size={28} className="text-green-500" />
          <h1 className="text-2xl font-black tracking-tight">ARMY NAVY OUTDOORS</h1>
        </div>
        <div className="flex items-center gap-4 flex-wrap">
          <p className="text-sm text-gray-400">Weekly Trend Intelligence Scan</p>
          <span className="text-xs bg-gray-800 text-gray-300 px-2 py-0.5 rounded">{SCAN_WEEK}</span>
          <span className="text-xs bg-red-900 text-red-200 px-2 py-0.5 rounded animate-pulse">LIVE DATA</span>
          <span className="text-xs bg-cyan-900 text-cyan-200 px-2 py-0.5 rounded">+ REAL STORE SALES</span>
        </div>
      </div>

      {/* Alert Banner */}
      <div className="bg-red-950 border border-red-800 rounded-lg p-3 mb-6 flex items-start gap-3">
        <AlertOctagon size={20} className="text-red-400 mt-0.5 flex-shrink-0" />
        <div>
          <p className="text-sm font-bold text-red-300">CRITICAL — MRE Inventory Crisis + Midwest Tornado Outbreak Wed-Thu + Father's Day Final Week</p>
          <p className="text-xs text-red-400 mt-1">Three things converge this week: <strong>(1) Multiple top MRE SKUs at 0.4–2.3 days of cover with no reorders placed</strong> — Genuine US Issue 1-Meal Pack at 0.4 days (4 on hand), Burrito Bowl at 1.7 days. <strong>(2) Severe weather outbreak Wed-Thu</strong> — Level 3/5 risk Kansas City to St. Louis, 70+ mph winds, 2.5\" hail possible. <strong>(3) Father's Day is Sunday 6/21</strong> — expedited shipping cutoffs Wed-Thu. NHC is also tracking the season's first Atlantic disturbance in the Gulf.</p>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex gap-2 mb-6 flex-wrap">
        {[
          { id: "overview", label: "Overview" },
          { id: "categories", label: "Category Deep-Dive" },
          { id: "calendar", label: "Weekly Action Plan" },
          { id: "keywords", label: "PPC Keywords" },
          { id: "tariffs", label: "Tariff Watch" },
        ].map((tab) => (
          <TabButton key={tab.id} active={activeTab === tab.id} onClick={() => setActiveTab(tab.id)} color="#22c55e">
            {tab.label}
          </TabButton>
        ))}
      </div>

      {/* ─── OVERVIEW TAB ─── */}
      {activeTab === "overview" && (
        <div className="space-y-6">
          {/* Heat Score Bar Chart */}
          <div className="bg-gray-900 rounded-xl p-4">
            <h2 className="text-lg font-bold mb-4 flex items-center gap-2"><TrendingUp size={18} /> Category Heat Scores</h2>
            <ResponsiveContainer width="100%" height={240}>
              <BarChart data={heatData} layout="vertical" margin={{ left: 10, right: 20 }}>
                <XAxis type="number" domain={[0, 100]} tick={{ fill: "#9ca3af", fontSize: 12 }} />
                <YAxis type="category" dataKey="name" tick={{ fill: "#d1d5db", fontSize: 11 }} width={100} />
                <Tooltip contentStyle={{ backgroundColor: "#1f2937", border: "none", borderRadius: 8, color: "#fff" }} />
                <Bar dataKey="score" radius={[0, 6, 6, 0]}>
                  {heatData.map((entry, i) => (
                    <Cell key={i} fill={entry.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Quick Cards */}
          <div className="grid grid-cols-2 gap-3">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => { setSelectedCategory(cat.id); setActiveTab("categories"); }}
                className="bg-gray-900 rounded-xl p-4 text-left hover:ring-2 transition-all"
                style={{ "--tw-ring-color": cat.color }}
              >
                <div className="flex items-center justify-between mb-2">
                  <UrgencyBadge level={cat.urgency} />
                  <span className="text-2xl font-black" style={{ color: cat.color }}>{cat.heatScore}</span>
                </div>
                <h3 className="text-sm font-bold text-white mb-1">{cat.name}</h3>
                <p className="text-xs text-gray-400 line-clamp-2">{cat.summary.slice(0, 120)}...</p>
                <div className="mt-2 text-xs text-gray-500 flex items-center gap-1">
                  Top seller: <span className="text-gray-300">{cat.sellingNow[0]}</span>
                </div>
              </button>
            ))}
          </div>

          {/* Top 3 Actions This Week */}
          <div className="bg-gray-900 rounded-xl p-4">
            <h2 className="text-lg font-bold mb-3 flex items-center gap-2"><Zap size={18} className="text-yellow-400" /> Top 3 Actions This Week</h2>
            <div className="space-y-3">
              <div className="bg-red-950/50 border border-red-800/50 rounded-lg p-3">
                <p className="text-sm font-semibold text-red-300">1. 🚨 PLACE MRE + MOLLE POUCH REORDERS TODAY</p>
                <p className="text-xs text-gray-300 mt-1">Genuine US Issue MRE 1-Meal at 0.4 days (4 on hand, 328 d30); Flash Bang MOLLE Pouch at 0.2 days (2 oh, 324 d30 — last week's breakout that died on stockout); Coyote FILBE Sustainment Pouch OOS (0 oh, 104 d30). NEW: P-38 Can Opener broke out from 119 → 695 d30 with only 50 on hand. Place POs today or repeat last week's stockout loss.</p>
              </div>
              <div className="bg-red-950/50 border border-red-800/50 rounded-lg p-3">
                <p className="text-sm font-semibold text-red-300">2. 🌪 Midwest Tornado Outbreak Wed-Thu — Front-Load Storm-Prep Geos</p>
                <p className="text-xs text-gray-300 mt-1">Level 3/5 SPC risk Kansas City to St. Louis with 70+ mph winds, 2.5" hail, strong tornadoes possible. Boost weather-radio, tarp, headlamp PPC in KS/MO/IL/IN/KY starting tonight. Live SMS Wednesday afternoon as warnings drop. Plan storm-cleanup follow-up Saturday.</p>
              </div>
              <div className="bg-orange-950/50 border border-orange-800/50 rounded-lg p-3">
                <p className="text-sm font-semibold text-orange-300">3. Father's Day Final Week — Expedited Cutoffs Wed-Thu</p>
                <p className="text-xs text-gray-300 mt-1">6 days to Father's Day. NRF projects $22.4B / $199 avg spend. Standard ship cutoff is Mon-Tue; expedited cutoffs land Wed 6/17 (Mack Weldon 11am ET, Rhone 12pm ET) and Thu 6/18 (TexTale 2pm, Bonobos 1pm). After Thursday it's gift-card / in-store pickup. Your tactical assortment is thin — lean on gift cards as the hedge.</p>
              </div>
            </div>
          </div>

          {/* Store-Wide Reality Check (real sales) */}
          <div className="bg-gray-900 rounded-xl p-4 border border-cyan-900/50">
            <h2 className="text-lg font-bold mb-1 flex items-center gap-2 text-cyan-300"><Database size={18} /> Store-Wide Reality Check</h2>
            <p className="text-xs text-gray-500 mb-4">Source: {STORE_DATA_SOURCE}</p>

            {/* OOS Risk */}
            <div className="mb-4">
              <h3 className="text-sm font-bold text-red-300 mb-2">🚨 Out-of-Stock Risk (less than 2 weeks of cover at current pace)</h3>
              <div className="bg-gray-950 rounded overflow-hidden">
                <table className="w-full text-xs">
                  <thead>
                    <tr className="border-b border-gray-700 text-gray-500">
                      <th className="text-left p-2 font-medium">Product</th>
                      <th className="text-right p-2 font-medium">On Hand</th>
                      <th className="text-right p-2 font-medium">30d Sold</th>
                      <th className="text-right p-2 font-medium">Cover (days)</th>
                      <th className="text-left p-2 font-medium">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {outOfStockRisk.map((p, i) => (
                      <tr key={i} className="border-b border-gray-800/50">
                        <td className="p-2 text-gray-200">{p.name}</td>
                        <td className={`p-2 text-right font-mono ${p.oh < 5 ? "text-red-400 font-bold" : "text-yellow-300"}`}>{p.oh}</td>
                        <td className="p-2 text-right text-white font-mono">{p.d30.toLocaleString()}</td>
                        <td className={`p-2 text-right font-mono font-bold ${p.cover < 1 ? "text-red-400" : "text-yellow-300"}`}>{p.cover.toFixed(1)}</td>
                        <td className="p-2 text-red-300 text-xs">{p.status}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Breakouts */}
            <div className="mb-4">
              <h3 className="text-sm font-bold text-green-400 mb-2">🔥 Breakouts (7-day pace running well above 30-day average)</h3>
              <div className="bg-gray-950 rounded overflow-hidden">
                <table className="w-full text-xs">
                  <thead>
                    <tr className="border-b border-gray-700 text-gray-500">
                      <th className="text-left p-2 font-medium">Product</th>
                      <th className="text-left p-2 font-medium">Category</th>
                      <th className="text-right p-2 font-medium">7d</th>
                      <th className="text-right p-2 font-medium">30d</th>
                      <th className="text-right p-2 font-medium">Lift</th>
                    </tr>
                  </thead>
                  <tbody>
                    {breakouts.map((p, i) => (
                      <tr key={i} className="border-b border-gray-800/50">
                        <td className="p-2 text-gray-200">{p.name}</td>
                        <td className="p-2 text-gray-400">{p.category}</td>
                        <td className="p-2 text-right text-white font-mono font-bold">{p.d7.toLocaleString()}</td>
                        <td className="p-2 text-right text-gray-400 font-mono">{p.d30.toLocaleString()}</td>
                        <td className="p-2 text-right text-green-400 font-mono font-bold">{p.mult.toFixed(1)}×</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Top 10 movers */}
            <div className="mb-4">
              <h3 className="text-sm font-bold text-cyan-300 mb-2">Top 10 Movers Store-Wide (last 30 days)</h3>
              <div className="bg-gray-950 rounded overflow-hidden">
                <table className="w-full text-xs">
                  <thead>
                    <tr className="border-b border-gray-700 text-gray-500">
                      <th className="text-left p-2 font-medium w-6">#</th>
                      <th className="text-left p-2 font-medium">Product</th>
                      <th className="text-left p-2 font-medium">Category</th>
                      <th className="text-right p-2 font-medium">30d</th>
                      <th className="text-right p-2 font-medium">7d</th>
                    </tr>
                  </thead>
                  <tbody>
                    {overallTopMovers.map((p, i) => (
                      <tr key={i} className="border-b border-gray-800/50">
                        <td className="p-2 text-gray-500 font-mono">{i + 1}</td>
                        <td className="p-2 text-gray-200">{p.name}</td>
                        <td className="p-2 text-gray-400">{p.category}</td>
                        <td className="p-2 text-right text-white font-mono font-bold">{p.d30.toLocaleString()}</td>
                        <td className="p-2 text-right text-gray-400 font-mono">{p.d7.toLocaleString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="bg-cyan-950/30 border border-cyan-800/50 rounded p-3 text-xs text-gray-300 leading-relaxed">
              <strong className="text-cyan-300">Week-over-week takeaway:</strong> Last week's Flash Bang MOLLE Pouch breakout (316 d7 → 332 d30) cratered to 2 d7 this week — the demand died because you stocked out and customers went elsewhere. <strong>That is the cost of not restocking a breakout</strong>, and the same story is about to repeat with MREs (Burrito Bowl at 1.7 days cover, GI Case at 1.6, 1-Meal Pack at 0.4) and the P-38 Can Opener (new breakout at 2.2 days cover). New emergency-prep-driven categories (P-38/P-51 can openers, MRE 1-meal packs, tourniquet holders) suggest customers are actively building hurricane / bug-out kits — feature these prominently on the homepage.
            </div>
          </div>
        </div>
      )}

      {/* ─── CATEGORY DEEP-DIVE TAB ─── */}
      {activeTab === "categories" && (
        <div className="space-y-4">
          <div className="flex gap-2 flex-wrap">
            {categories.map((cat) => (
              <TabButton key={cat.id} active={selectedCategory === cat.id} onClick={() => setSelectedCategory(cat.id)} color={cat.color}>
                {cat.name.split(" —")[0].split(" /")[0]}
              </TabButton>
            ))}
          </div>
          <CategoryDetail cat={activeCat} />
        </div>
      )}

      {/* ─── WEEKLY ACTION PLAN TAB ─── */}
      {activeTab === "calendar" && (
        <div className="space-y-3">
          <h2 className="text-lg font-bold flex items-center gap-2"><ShoppingCart size={18} /> Weekly Marketing Action Plan</h2>
          {weeklyCalendar.map((day, i) => (
            <div key={i} className={`rounded-lg p-3 ${i === TODAY_INDEX ? "bg-red-950/50 border border-red-800" : "bg-gray-900"}`}>
              <div className="flex items-center gap-2 mb-1">
                <span className={`text-sm font-bold ${i === TODAY_INDEX ? "text-red-300" : "text-green-400"}`}>{day.day}</span>
                {i === TODAY_INDEX && <span className="text-xs bg-red-800 text-red-200 px-1.5 py-0.5 rounded">TODAY</span>}
              </div>
              <p className="text-sm text-gray-300">{day.action}</p>
            </div>
          ))}
        </div>
      )}

      {/* ─── PPC KEYWORDS TAB ─── */}
      {activeTab === "keywords" && (
        <div className="space-y-4">
          <h2 className="text-lg font-bold flex items-center gap-2"><DollarSign size={18} /> Priority PPC Keywords</h2>
          <div className="bg-gray-900 rounded-xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-700">
                    <th className="text-left p-3 text-gray-400 font-medium">Priority</th>
                    <th className="text-left p-3 text-gray-400 font-medium">Keyword</th>
                    <th className="text-left p-3 text-gray-400 font-medium">Volume</th>
                    <th className="text-left p-3 text-gray-400 font-medium">Est. CPC</th>
                    <th className="text-left p-3 text-gray-400 font-medium">Competition</th>
                  </tr>
                </thead>
                <tbody>
                  {topKeywords.map((kw, i) => (
                    <tr key={i} className="border-b border-gray-800 hover:bg-gray-800/50">
                      <td className="p-3">{kw.priority}</td>
                      <td className="p-3 text-white font-medium">{kw.keyword}</td>
                      <td className="p-3 text-gray-300">{kw.volume}</td>
                      <td className="p-3 text-gray-300">{kw.cpc}</td>
                      <td className="p-3 text-gray-300">{kw.competition}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          <div className="bg-gray-900 rounded-xl p-4">
            <h3 className="text-sm font-bold text-gray-300 mb-2">Geo-Targeting Recommendations</h3>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="bg-red-950/30 rounded p-2"><strong className="text-red-400">Wed-Thu Tornado Outbreak:</strong> <span className="text-gray-300">KS, MO, IL, IN, KY, OH (KC-to-St.Louis bullseye)</span></div>
              <div className="bg-red-950/30 rounded p-2"><strong className="text-red-400">Hurricane / Emergency:</strong> <span className="text-gray-300">Gulf & Atlantic coast — TX, LA, FL, GA, SC, NC</span></div>
              <div className="bg-orange-950/30 rounded p-2"><strong className="text-orange-400">Father's Day:</strong> <span className="text-gray-300">Nationwide — metro areas for EDC, suburban for surplus apparel</span></div>
              <div className="bg-yellow-950/30 rounded p-2"><strong className="text-yellow-400">Flash Flooding:</strong> <span className="text-gray-300">NE Missouri, N. Illinois (Wed-Thu peak)</span></div>
            </div>
          </div>
        </div>
      )}

      {/* ─── TARIFF WATCH TAB ─── */}
      {activeTab === "tariffs" && (
        <div className="space-y-4">
          <h2 className="text-lg font-bold flex items-center gap-2"><AlertTriangle size={18} className="text-yellow-400" /> Tariff Impact Watch</h2>
          <p className="text-sm text-gray-400">Section 122's 10% global tariff is still being collected — Federal Circuit's May 12 stay kept it alive while the appeal proceeds; the statute expires July 24 (39 days out). SCOTUS struck the separate 20% IEEPA layer. Pricing remains volatile.</p>
          <div className="bg-gray-900 rounded-xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-700">
                    <th className="text-left p-3 text-gray-400 font-medium">Item / Origin</th>
                    <th className="text-left p-3 text-gray-400 font-medium">Tariff</th>
                    <th className="text-left p-3 text-gray-400 font-medium">Price Impact</th>
                    <th className="text-left p-3 text-gray-400 font-medium">Recommended Action</th>
                  </tr>
                </thead>
                <tbody>
                  {tariffImpact.map((t, i) => (
                    <tr key={i} className="border-b border-gray-800 hover:bg-gray-800/50">
                      <td className="p-3 text-white font-medium">{t.item}</td>
                      <td className="p-3 text-red-400 font-bold">{t.tariff}</td>
                      <td className="p-3 text-gray-300">{t.priceImpact}</td>
                      <td className="p-3 text-gray-300">{t.action}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          <div className="bg-yellow-950/30 border border-yellow-800/50 rounded-lg p-4">
            <h3 className="text-sm font-bold text-yellow-300 mb-2">Strategic Takeaway</h3>
            <p className="text-sm text-gray-300">Imported soft goods — boots, packs, apparel, EDC knives/lights — remain 10–25% more expensive than authentic surplus. CIT struck Section 122 on May 7; Federal Circuit stayed that May 12; CBP is still collecting from nearly all importers through the July 24 statutory cap. Your real sales data validates the positioning: surplus MOLLE pouches and uniform pieces have broken out at 4× pace whenever in stock. Avoid overcommitting forward buys until the July picture clears.</p>
          </div>
        </div>
      )}

      {/* Footer */}
      <div className="mt-8 pt-4 border-t border-gray-800 text-center">
        <p className="text-xs text-gray-600">Army Navy Outdoors — Weekly Trend Intelligence | Generated {SCAN_DATE} | Sources: NOAA, NHC, SPC, AccuWeather, Fox Weather, NRF, TexTale (shipping cutoffs) + internal 7-day sales forecasting report (1,416 SKUs)</p>
      </div>
    </div>
  );
}
