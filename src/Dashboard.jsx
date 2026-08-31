import { useState } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend, RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis } from "recharts";
import { AlertTriangle, TrendingUp, Zap, Target, Shield, CloudLightning, ShoppingCart, Mail, MessageSquare, DollarSign, HeartPulse, Package, ChevronDown, ChevronUp, ExternalLink, Database, AlertOctagon } from "lucide-react";

// ─── DATA: BAKED IN FROM AUG 31 2026 RESEARCH + REAL STORE SALES (1,445 SKUs) ──

const SCAN_DATE = "August 31, 2026";
const SCAN_WEEK = "Week of Aug 31 – Sept 6, 2026 (Labor Day week)";
const TODAY_INDEX = 0; // Mon 8/31 — scan day
const STORE_DATA_SOURCE = "7-Day Sales Forecasting Report — 1,445 SKUs, 7-day + 30-day order velocity";

const urgencyLevels = { CRITICAL: "🔴", HIGH: "🟠", MEDIUM: "🟡", WATCH: "🟢" };

const categories = [
  {
    id: "emergency",
    name: "Emergency Supplies",
    icon: "Shield",
    urgency: "CRITICAL",
    color: "#ef4444",
    heatScore: 94,
    summary: "Hurricane season climatological peak is Sept 10 (10 days out). Season is quiet so far — 4 named storms (Arthur, Bertha, Cristobal, Dolly), NO hurricanes yet, behind typical pace — but NHC is monitoring TWO disturbances now at 50% development odds (Invest 95L SE of Bermuda + tropical wave off Africa). Your MRE Chicken Burrito Bowl demand nearly doubled month-over-month (1,199 → 2,196 d30) with only 60 on hand — 0.8 days of cover.",
    sellingNow: [
      "MRE Chicken Burrito Bowl (2,196 d30 — your monster SKU, 0.8d cover)",
      "GI MRE Case (505 d30, 1.4d cover — chronic OOS)",
      "MRE Entree line (Beef Stew, Jambalaya, Pasta, Mexican Beef — all 260-280 d30, healthy stock)",
      "Genuine US Issue MRE 1-Meal Pack (249 d30, 0.7d cover)",
      "GI MRE A&B 2-Pack (158 d30, 2.3d cover)",
      "P-51 Can Opener (steady)",
    ],
    sellingNext: [
      "Hurricane-prep bundles ahead of Sept 10 peak",
      "Restocked MRE 6-Pack accessories (Crackers, Snack Pack — both went cold at 0 oh)",
      "Fall/Labor Day camping food kits",
      "Long-term food storage buckets (3-6 month kits)",
    ],
    whyNext: "September 10 climatological peak is 10 days out. If either NHC disturbance develops, demand spikes immediately. Labor Day weekend also drives fall camping / hunting-camp food purchases. MRE 6-Pack Crackers and Snack Pack going cold isn't fading demand — it's stockout (both at 0 oh, 150 & 118 d30). Restock to recapture.",
    marketingAngles: {
      email: "Subject: 'Hurricane peak in 10 days — 2 NHC systems at 50%.' MRE case + accessory + water bundle. Feature the restocked Beef Stew / Jambalaya / Pasta line.",
      social: "'Season's been quiet — but 2 systems at 50% and peak in 10 days.' Live NHC map + kit reel.",
      ppc: "Aggressive: 'mre case,' 'hurricane prep kit,' 'weather radio,' 'emergency water storage,' 'labor day camping food.'",
      sms: "Hurricane peak in 10 days. 2 systems at 50% — MRE cases & water shipping today → [link].",
    },
    storeData: {
      topSellers: [
        { name: "MRE Entree — Chicken Burrito Bowl", d30: 2196, d7: 513 },
        { name: "2026 GI MRE Case A or B", d30: 505, d7: 83 },
        { name: "MRE Entree — Beef Stew", d30: 277, d7: 36 },
        { name: "MRE Chicken and Sausage Jambalaya", d30: 272, d7: 35 },
        { name: "MRE Pasta w/ Marinara + Veggie Crumbles (Veg)", d30: 261, d7: 35 },
        { name: "MRE Mexican Beef with Vegetables", d30: 260, d7: 34 },
      ],
      trending: [],
      cold: [
        { name: "6-Pack MRE Crackers and Breads", d7: 0, d30: 150 },
        { name: "6-Pack MRE Snack Pack", d7: 0, d30: 118 },
        { name: "U.S. Military Issue Sandbags (Olive)", d7: 0, d30: 210 },
      ],
      insight: "🚨 CRISIS INTENSIFIES: MRE Burrito Bowl demand nearly doubled month-over-month (1,199→2,196 d30) with cover at 0.8 days (60 oh). GI MRE Case at 1.4d, Genuine 1-Meal Pack at 0.7d. GOOD NEWS: MRE Entree line (Beef Stew, Jambalaya, Pasta, Mexican Beef) all restocked at healthy 235-323 oh — bundle these as the 'hurricane pantry' assortment. STOCKOUT KILLS: MRE Crackers 6-Pack (150 d30) and Snack Pack (118 d30) both went cold with 0 oh — 6-Pack accessory momentum from July is dead unless restocked.",
    },
  },
  {
    id: "surplus",
    name: "Military Surplus",
    icon: "Package",
    urgency: "HIGH",
    color: "#f97316",
    heatScore: 82,
    summary: "Back-to-college move-in wave + fall gear signal both showing up in real data. USN Black Wool Watch Cap exploded: 101 units in 7 days vs 104 in 30 (4.16× pace, 39 oh) — clear fall/cold-weather demand. GI Army Laundry Barracks Bag broke out at 3.67× and is ALREADY OUT OF STOCK — pure back-to-college signal. University Bunkable Bed 1.9× (also OOS). Meanwhile: USMC PT Running Jacket (last month's 300-unit breakout) never got restocked and has DROPPED OFF the top 10 — the classic Flash Bang MOLLE Pouch failure pattern.",
    sellingNow: [
      "50 CAL Ammo Can (391 d30, well-stocked at 138 oh — good work)",
      "USN Black Wool Watch Cap (104 d30, 4.16× breakout — restock priority)",
      "GI Army Laundry Barracks Bag (56 d30, OOS — dorm move-in)",
      "Coyote FILBE Sustainment Pouch (95 d30, 24 oh)",
      "US Issue ACU Army Pants (144 d30, 10 oh — tight)",
      "40MM PA120 Ammo Can (18 d30, 3.8× breakout)",
    ],
    sellingNext: [
      "Fall gear ramp — wool watch caps, shemaghs, patrol caps, cold-weather layers",
      "Back-to-college restock — laundry bags, duffle bags, dorm-friendly packs",
      "Fall hunting camp gear (Labor Day → October rifle season)",
      "Value bundles to compete with REI Labor Day sale (up to 40% off)",
    ],
    whyNext: "Meteorological fall starts tomorrow (Sept 1). Fall gear demand is real and early — the Wool Watch Cap 4.2× spike + Shemagh 2.8× spike are your leading indicators. REI/Cascade/Dometic are running 20-40% off Labor Day weekend — position surplus as durable value that doesn't need to be discounted.",
    marketingAngles: {
      email: "Subject: 'Fall is landing early — Wool Watch Cap, Shemagh & laundry bag restocks.' Highlight back-to-college dorm essentials for late move-ins.",
      social: "'What surplus customers are buying for fall (data from this week).' 4.2× breakout reel — Wool Watch Cap OOTD.",
      ppc: "Bid up: 'wool watch cap,' 'military duffle bag,' 'shemagh scarf,' '50 cal ammo can,' 'military canteen college.'",
      sms: "Fall gear breaking out — Wool Watch Caps, Shemaghs, laundry bags restocking → [link].",
    },
    storeData: {
      topSellers: [
        { name: "50 CAL Ammo Box Can 12×6×7.5in", d30: 391, d7: 7 },
        { name: "U.S. Issue ACU Army Pant (Used) — M Reg", d30: 144, d7: 6 },
        { name: "Used MOLLE II ACU M4 Magazine Pouch", d30: 97, d7: 9 },
        { name: "Coyote FILBE Sustainment Pouch (Grade 2)", d30: 95, d7: 24 },
        { name: "Assorted BDU Pant (Large)", d30: 80, d7: 0 },
        { name: "Assorted BDU Jacket (Large)", d30: 80, d7: 0 },
      ],
      trending: [
        { name: "40MM PA120 Ammo Can (Used, 1-Pack)", d7: 16, d30: 18, mult: 3.8 },
        { name: "US Issue Military LC-II Y Suspenders (Used)", d7: 8, d30: 11, mult: 3.1 },
        { name: "2-Pack FILBE Sustainment Pouch", d7: 11, d30: 30, mult: 1.6 },
      ],
      cold: [
        { name: "Assorted BDU Pant (Large) — OOS", d7: 0, d30: 80 },
        { name: "Assorted BDU Jacket (Large) — OOS", d7: 0, d30: 80 },
      ],
      insight: "50 CAL Ammo Can restocked to 138 oh — great work, demand held at 391 d30. Coyote FILBE Sustainment Pouch is quietly breaking out (24 d7 with only 24 oh — 3-day cover). BDU Pant + Jacket (Large) both at 80 d30 / 0 oh — restock both immediately, matched-set stockout. USN Wool Watch Cap and GI Laundry Bag are the two big signals of the week (see Breakouts panel).",
    },
  },
  {
    id: "weather",
    name: "Weather / Storm Events",
    icon: "CloudLightning",
    urgency: "HIGH",
    color: "#f97316",
    heatScore: 70,
    summary: "Hurricane season peak Sept 10 (10 days out); 2 NHC disturbances at 50% development odds. Fall shoulder-season demand is emerging: Shemagh Desert Keffiyeh at 2.8× pace, ACU Poncho Liner steady. Waterproofing SKUs are chronically thin — Wet Weather Bag at 0 oh, Medium SealLine at 8 oh, FILBE Hydration at 12 oh (accelerating 3.6×). Labor Day weekend camping drives tarps, rain gear, hydration.",
    sellingNow: [
      "USMC FILBE Coyote Hydration Pack (51 d30, 3.6× breakout on Grade 2 variant)",
      "MAC Sacks Small SealLine Stuff Sack (36 d30)",
      "US Issue Waterproof Wet Weather Bag (34 d30, OOS)",
      "USMC MARPAT Wet Weather Tarp (steady)",
      "Shemagh Desert Keffiyeh (2.8× breakout — fall signal)",
      "ACU Poncho Liner (32 d30, restocked at 12 oh)",
    ],
    sellingNext: [
      "Hurricane-prep waterproofing (Sept 10 peak)",
      "Labor Day camping — tarps, ponchos, rain gear",
      "Fall/cold-weather shell layers as temps drop",
      "Restocked Wet Weather Bag + SealLine stuff sacks",
    ],
    whyNext: "Hurricane peak is 10 days out — waterproofing demand will spike on any named-storm bulletin. Meteorological fall (Sept 1) drives Shemagh + poncho-liner + shell-jacket demand as customers layer up.",
    marketingAngles: {
      email: "Subject: 'Hurricane peak next week + fall gear landing.' Feature restocked ACU Poncho Liner, Shemagh, FILBE Hydration.",
      social: "Split-screen: NHC map + fall-gear OOTD. 'Prep for both.'",
      ppc: "Bid up: 'hydration pack,' 'poncho liner,' 'shemagh,' 'rain gear,' 'weather radio,' 'tarp heavy duty.'",
      sms: "Hurricane peak in 10 days. Hydration, tarps, shell layers shipping today → [link].",
    },
    storeData: {
      topSellers: [
        { name: "USMC FILBE Coyote Hydration Pack", d30: 51, d7: 5 },
        { name: "USMC MAC Sacks Small SealLine Stuff Sack", d30: 36, d7: 4 },
        { name: "US Issue Waterproof Wet Weather Bag (OOS)", d30: 34, d7: 6 },
        { name: "U.S. Army ACU Poncho Liner (Used)", d30: 32, d7: 6 },
        { name: "USMC SealLine Medium Waterproof Stuff Sack", d30: 32, d7: 6 },
        { name: "Military SealLine Large Main Pack Stuff Sack", d30: 32, d7: 6 },
      ],
      trending: [
        { name: "USMC FILBE Coyote Hydration Pack (Grade 2)", d7: 5, d30: 6, mult: 3.6 },
        { name: "Lightweight Shemagh Desert Keffiyeh Scarf (Olive)", d7: 9, d30: 14, mult: 2.8 },
      ],
      cold: [],
      insight: "Fall-shoulder signal is real — Shemagh at 2.8× pace, FILBE Grade 2 variant at 3.6×. Waterproofing is chronically undersupplied: Wet Weather Bag at 0 oh, SealLine Medium at 8 oh. With hurricane peak in 10 days and Labor Day camping this weekend, restock waterproofing NOW.",
    },
  },
  {
    id: "medical",
    name: "Medical & Trauma",
    icon: "HeartPulse",
    urgency: "MEDIUM",
    color: "#eab308",
    heatScore: 66,
    summary: "Trauma cluster cooled significantly week-over-week — the 2-month breakout streak has paused. Most top medical SKUs show 0 orders in the last 7 days (Burn Dressing, USMC Zipper IFAK, IFAK Trauma Insert, Combat IFAK, Water-Jel Burn Dressing — all 0 d7 despite 69-74 d30). Multiple IFAK build-out SKUs at 0 on hand (IFAK Trauma Insert Advanced, Combat IFAK Advanced CLS) — likely stockout is what killed the pulse, not customer disinterest.",
    sellingNow: [
      "NAR C-A-T Tourniquet Holder (145 d30, 5 oh — tight)",
      "NAR Dry Sterile Burn Dressing Combat Cravat (74 d30, 23 oh)",
      "USMC Zipper IFAK First Aid Kit Pouch (70 d30, 35 oh)",
      "IFAK Trauma Insert Kit — Advanced Build (69 d30, OOS)",
      "Combat IFAK Trauma First Aid Kit — Advanced CLS (69 d30, OOS)",
      "Military Tactical Burn Dressing 4×16 Water-Jel (69 d30, 12 oh)",
    ],
    sellingNext: [
      "Restocked IFAK build-out kits (Advanced Build & CLS Build)",
      "Fall hunting-camp trauma & first-aid kits",
      "Hurricane-response trauma kits (Sept 10 peak)",
      "Dorm first-aid kits (BTC crossover)",
    ],
    whyNext: "The IFAK build kits at 0 oh are your pressure points — customers building complete kits stopped mid-build. Restock the Advanced Build + CLS Build inserts. Hurricane peak + fall hunting season both drive trauma-kit demand in the next 4 weeks.",
    marketingAngles: {
      email: "Subject: 'IFAK build kits back in stock — hurricane & hunting season.' Bundle CAT Tourniquet + Holder + gauze + burn dressing.",
      social: "'What's actually in a real IFAK' reel — feature the Advanced Build kit.",
      ppc: "Bid up: 'ifak trauma kit,' 'cat tourniquet,' 'burn dressing,' 'hunting first aid.'",
      sms: "IFAK build kits restocking. Advanced + CLS builds shipping → [link].",
    },
    storeData: {
      topSellers: [
        { name: "NAR C-A-T Tourniquet Holder (Grade 1)", d30: 145, d7: 1 },
        { name: "NAR Dry Sterile Burn Dressing (Combat Cravat)", d30: 74, d7: 0 },
        { name: "USMC Zipper IFAK First Aid Kit Pouch (Grade 1)", d30: 70, d7: 0 },
        { name: "IFAK Trauma Insert Kit — Advanced Build", d30: 69, d7: 0 },
        { name: "Combat IFAK Trauma First Aid Kit — Advanced CLS Build", d30: 69, d7: 0 },
        { name: "Military Tactical Burn Dressing 4×16 Water-Jel", d30: 69, d7: 0 },
      ],
      trending: [
        { name: "U.S. Issue Tan IFAK Pouch Insert (Used)", d7: 5, d30: 5, mult: 4.3 },
      ],
      cold: [
        { name: "NAR Dry Sterile Burn Dressing (with stock)", d7: 0, d30: 74 },
        { name: "USMC Zipper IFAK First Aid Kit Pouch (with stock)", d7: 0, d30: 70 },
      ],
      insight: "Trauma cluster paused this week — 5 top SKUs at 0 d7 despite ~70 d30 each. Two of the 5 (IFAK Advanced Build, Combat IFAK CLS) are OOS at 0 oh — stockout explains those. Other 3 have stock so demand is genuinely quieter this week (post-August-spike normalization). NAR C-A-T Tourniquet Holder at 145 d30 with only 5 oh — restock priority as hurricane peak approaches.",
    },
  },
  {
    id: "tactical",
    name: "Tactical & EDC",
    icon: "Target",
    urgency: "MEDIUM",
    color: "#eab308",
    heatScore: 60,
    summary: "Category still thin at 33 SKUs / 119 d30 / 24 d7. Back-to-college window peaked last week; assortment couldn't capitalize meaningfully. Rothco Police Whistle still leading (11 d30, 4 d7, restocked to 3 oh from prior 0). Ontario Knife SP16 SPAX went OOS. Streamlight Sidewinder went cold at 0 d7 despite 39 oh (post-August normalization).",
    sellingNow: [
      "Streamlight Sidewinder Compact II (13 d30, 39 oh — went cold this week)",
      "US Issue ALICE Compass Pouch (12 d30, 6 oh)",
      "Rothco G.I. Style Police Whistle (11 d30, 3 oh — tight)",
      "18-inch MOLLE Machete Sheath (9 d30, 2 oh)",
      "Classic Military Metal Compass (8 d30)",
      "Ontario Knife SP16 SPAX (7 d30, OOS)",
    ],
    sellingNext: [
      "Fall camping & hunting knives (September rifle prep)",
      "Restocked Ontario SP16 & Machete Sheath",
      "Labor Day weekend EDC picks",
      "Fire starters / ferro rods as camp season peaks",
    ],
    whyNext: "Fall camping season starts this weekend (Labor Day). Hunting knife / EDC light / fire-starter demand ramps into September–October. Category is genuinely under-assorted — expanding depth is the multi-week play.",
    marketingAngles: {
      email: "Subject: 'Labor Day EDC — fall camping picks.' Feature restocked whistle, machete sheath, compass.",
      social: "'What EDC goes in your Labor Day camp kit' reel.",
      ppc: "Bid up: 'edc knife,' 'camping knife,' 'edc flashlight,' 'ferro rod fall.'",
      sms: "Labor Day camping EDC — knives, lights, ferro rods → [link].",
    },
    storeData: {
      topSellers: [
        { name: "Streamlight Sidewinder Compact II (Used)", d30: 13, d7: 0 },
        { name: "U.S. Issue ALICE Compass Pouch (Used)", d30: 12, d7: 2 },
        { name: "Rothco G.I. Style Police Whistle (OD)", d30: 11, d7: 4 },
        { name: "18-inch MOLLE Machete Sheath (OD)", d30: 9, d7: 3 },
        { name: "Classic Military Style Metal Compass (OD)", d30: 8, d7: 0 },
        { name: "Ontario Knife SP16 SPAX, ACU (OOS)", d30: 7, d7: 0 },
      ],
      trending: [],
      cold: [],
      insight: "Category volume dropped further vs August (98→119 d30 total, but 24 d7 — lightest week in months). Streamlight Sidewinder went completely cold despite 39 oh — post-August EDC gift window fully closed. Ontario SP16 OOS. Category is under-assorted for fall — expand hunting knives, ferro rods, headlamps for the September–October camp/hunt window.",
    },
  },
];

// Derived data for charts
const heatData = categories.map((c) => ({ name: c.name.split(" —")[0].split(" /")[0], score: c.heatScore, fill: c.color }));

const channelPriorityData = [
  { channel: "Email", weather: 82, medical: 68, emergency: 98, edc: 68, surplus: 92 },
  { channel: "Social", weather: 78, medical: 70, emergency: 85, edc: 72, surplus: 92 },
  { channel: "PPC", weather: 88, medical: 72, emergency: 97, edc: 70, surplus: 90 },
  { channel: "SMS", weather: 90, medical: 68, emergency: 98, edc: 62, surplus: 88 },
];

const weeklyCalendar = [
  { day: "Mon 8/31", action: "🚨 INTERNAL: Restock MRE Burrito Bowl (0.8d cover, 2196 d30!), USN Wool Watch Cap, GI Laundry Bag, Coyote FILBE Sustainment Pouch. Launch fall-signal email (Wool Cap 4.2× breakout, Shemagh 2.8×)." },
  { day: "Tue 9/1", action: "Meteorological fall Day 1 — fall gear campaign kickoff: Wool caps, shemaghs, poncho liners, ACU pants. Restocked MRE Entree line bundle push." },
  { day: "Wed 9/2", action: "Hurricane peak countdown email — 8 days to Sept 10. NHC status update on 2 disturbances. MRE case + water bundle to Gulf/Atlantic geos." },
  { day: "Thu 9/3", action: "Back-to-college late-wave: dorm laundry bags, IFAK first-aid kits, whistles for freshmen still moving in. Restock announcement for GI Laundry Bag." },
  { day: "Fri 9/4", action: "🎯 Labor Day Sale KICKOFF — compete with REI's 40% off with surplus value story. Feature 50 CAL Ammo Can, MOLLE pouches, canteens, tarps at value pricing." },
  { day: "Sat 9/5", action: "Labor Day Saturday peak — SMS to full list. Camping + hurricane-prep double promo. Fall shell layers." },
  { day: "Sun 9/6", action: "Labor Day Sunday — last-day flash on Labor Day sale. Tease Sept 10 hurricane-peak content for the following week." },
];

const topKeywords = [
  { keyword: "hurricane prep kit", volume: "Very High", cpc: "$2.10", competition: "High", priority: "🔴" },
  { keyword: "mre case", volume: "High", cpc: "$1.30", competition: "Med", priority: "🔴" },
  { keyword: "labor day camping sale", volume: "Very High", cpc: "$1.50", competition: "High", priority: "🔴" },
  { keyword: "usn wool watch cap", volume: "Med (surging)", cpc: "$0.75", competition: "Low", priority: "🔴" },
  { keyword: "military laundry bag", volume: "Med (rising)", cpc: "$0.65", competition: "Low", priority: "🟠" },
  { keyword: "noaa weather radio", volume: "High", cpc: "$1.15", competition: "Med", priority: "🟠" },
  { keyword: "cat tourniquet", volume: "Med", cpc: "$1.20", competition: "Med", priority: "🟠" },
  { keyword: "50 cal ammo can", volume: "High", cpc: "$0.85", competition: "Med", priority: "🟠" },
  { keyword: "shemagh scarf", volume: "Med (rising)", cpc: "$0.70", competition: "Low", priority: "🟡" },
  { keyword: "fall camping gear", volume: "High", cpc: "$1.30", competition: "High", priority: "🟡" },
];

const tariffImpact = [
  { item: "Section 301 baseline (60 countries, 10-12.5%)", tariff: "10-12.5%", priceImpact: "Durable — no sunset, no rate ceiling", action: "Position surplus as tariff-insulated value; Labor Day counter-messaging vs REI/Cascade" },
  { item: "Boots & Leather Goods (China & Vietnam)", tariff: "30-70% CN stacked on Sec 301", priceImpact: "+10-25%; relief 'years away'", action: "Lean into surplus boots for fall/hunting season" },
  { item: "Field / Cargo Apparel (China & Vietnam)", tariff: "Stacked Sec 301 + country-specific", priceImpact: "+10-20% on imported soft goods", action: "Push USN Wool Watch Cap, Shemagh, ACU pants as durable surplus alternatives" },
  { item: "EDC Knives, Lights & Multi-Tools (China)", tariff: "~30-42% stacked", priceImpact: "+15-25% on import-dependent SKUs", action: "Expand tactical assortment for fall camp/hunt — under-assorted vs demand" },
  { item: "Medical / Trauma Consumables", tariff: "Country-specific stacked", priceImpact: "5-15% on gauze, bandages, tourniquets", action: "Bundle IFAK Advanced + CLS builds at higher AOV; restock the 0-oh ones" },
];

// ─── REAL STORE DATA: from the Aug 31, 2026 sales forecasting report ────

const overallTopMovers = [
  { name: "MRE Entree — Chicken Burrito Bowl", d30: 2196, d7: 513, category: "Emergency" },
  { name: "Spiced Apples, Special (MRE)", d30: 508, d7: 56, category: "Emergency" },
  { name: "2026 GI MRE Case A or B", d30: 505, d7: 83, category: "Emergency" },
  { name: "50 CAL Ammo Can (storage)", d30: 391, d7: 7, category: "Surplus" },
  { name: "MISC (SKU catch-all)", d30: 358, d7: 0, category: "Other" },
  { name: "MRE Entree — Beef Stew", d30: 277, d7: 36, category: "Emergency" },
  { name: "MRE Chicken and Sausage Jambalaya", d30: 272, d7: 35, category: "Emergency" },
  { name: "MRE Pasta w/ Marinara + Veggie Crumbles (Veg)", d30: 261, d7: 35, category: "Emergency" },
  { name: "MRE Mexican Beef with Vegetables", d30: 260, d7: 34, category: "Emergency" },
  { name: "MRE Entree Vegetarian Chili", d30: 254, d7: 28, category: "Emergency" },
];

const breakouts = [
  { name: "U.S. made Genuine USN Black Wool Watch Cap", d7: 101, d30: 104, mult: 4.2, category: "Surplus (Fall)" },
  { name: "GI Army Issue Laundry Barracks Bag", d7: 48, d30: 56, mult: 3.7, category: "Surplus (BTC)" },
  { name: "Used GI Army Laundry Barracks Bag — 2 Pack", d7: 24, d30: 28, mult: 3.7, category: "Surplus (BTC)" },
  { name: "40MM PA120 Ammo Can (Used, 1-Pack)", d7: 16, d30: 18, mult: 3.8, category: "Surplus" },
  { name: "Mini Cyalume Chemlight 1.5″, 4-Hour", d7: 15, d30: 15, mult: 4.3, category: "Other" },
  { name: "University Bunkable Bed 39×80″", d7: 16, d30: 36, mult: 1.9, category: "Other (BTC)" },
];

const outOfStockRisk = [
  { name: "MRE Entree — Chicken Burrito Bowl", oh: 60, d30: 2196, cover: 0.8, status: "SEVERE — 2× demand vs last month, no reorder" },
  { name: "Genuine US Issue MRE 1-Meal Pack", oh: 6, d30: 249, cover: 0.7, status: "CRITICAL — chronic OOS pattern" },
  { name: "2026 GI MRE Case A or B", oh: 24, d30: 505, cover: 1.4, status: "CRITICAL — hurricane peak in 10 days" },
  { name: "Spiced Apples, Special (MRE)", oh: 35, d30: 508, cover: 2.1, status: "URGENT — new top-3 seller, no reorder" },
  { name: "GI Army Laundry Barracks Bag", oh: 0, d30: 56, cover: 0.0, status: "ALREADY OOS — 3.7× BTC breakout" },
  { name: "2026 GI MRE A&B 2-Pack", oh: 12, d30: 158, cover: 2.3, status: "URGENT — 2-3 days cover" },
  { name: "NAR C-A-T Tourniquet Holder (Grade 1)", oh: 5, d30: 145, cover: 1.0, status: "CRITICAL — trauma restock priority" },
];

// ─── COMPONENTS ────────────────────────────────────────────────────────────────

const COLORS = ["#ef4444", "#f97316", "#f97316", "#eab308", "#eab308"];

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
                            <span className="text-xs font-mono text-gray-400 whitespace-nowrap">7d:{p.d7} · 30d:{p.d30}</span>
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
          <p className="text-sm font-bold text-red-300">CRITICAL — MRE Burrito Bowl at 0.8 Days Cover + Fall Signal Breaks Out + Labor Day Weekend + Hurricane Peak in 10 Days</p>
          <p className="text-xs text-red-400 mt-1">Four converging events: <strong>(1) MRE Burrito Bowl demand DOUBLED month-over-month</strong> (1,199 → 2,196 d30) with 60 on hand — 0.8 days of cover, still no reorder. <strong>(2) Fall signal broke out</strong>: USN Black Wool Watch Cap 4.2× pace (101 units in 7 days), GI Army Laundry Bag 3.7× and already OOS (back-to-college), Shemagh 2.8×. <strong>(3) Labor Day weekend</strong> — REI/Cascade/Dometic running 20-40% off; compete with surplus value story. <strong>(4) Hurricane peak Sept 10</strong> — NHC watching 2 disturbances at 50% (Invest 95L + African tropical wave). USMC PT Jacket confirmed dead — the classic stockout-kills-demand pattern struck again.</p>
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
                <p className="text-sm font-semibold text-red-300">1. 🚨 RESTOCK MRE Burrito Bowl + Genuine 1-Meal Pack + GI MRE Case + Wool Watch Cap</p>
                <p className="text-xs text-gray-300 mt-1">Burrito Bowl demand DOUBLED to 2,196 d30 — you have 60 on hand (0.8 days cover) and no reorder placed. This is the biggest single OOS risk in store history. Also: Genuine 1-Meal 0.7d, GI MRE Case 1.4d, USN Wool Watch Cap 39 oh vs 4.2× breakout pace. Hurricane peak is 10 days away — if you don't restock this week, you lose the entire Sept 10 demand cycle.</p>
              </div>
              <div className="bg-red-950/50 border border-red-800/50 rounded-lg p-3">
                <p className="text-sm font-semibold text-red-300">2. 🍂 Fall Signal + Back-to-College Wave — 3 New Breakouts</p>
                <p className="text-xs text-gray-300 mt-1">USN Black Wool Watch Cap 4.2× (101 d7, 39 oh). GI Army Laundry Barracks Bag 3.7× (48 d7) — ALREADY OOS. Shemagh Desert Keffiyeh 2.8×. Fall gear demand is here early. Launch a fall-signal email TODAY featuring these SKUs; restock the Laundry Bag urgently for the tail end of college move-in.</p>
              </div>
              <div className="bg-orange-950/50 border border-orange-800/50 rounded-lg p-3">
                <p className="text-sm font-semibold text-orange-300">3. Labor Day Sale (Fri 9/4 – Mon 9/7) — Counter REI's 40% Off</p>
                <p className="text-xs text-gray-300 mt-1">REI Labor Day sale runs 8/28–9/7 with up to 40% off; Cascade Designs 25% off camping; Dometic 20-40% off. Your play: don't discount, tell the "authentic surplus, tariff-insulated, no gimmicks" story. Feature 50 CAL Ammo Can (restocked), MOLLE pouches, canteens, MRE bundles at everyday prices — the value hook is durability + tariff-free.</p>
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
              <strong className="text-cyan-300">Pattern update (4 months of data):</strong> The stockout-kills-demand cycle just claimed another victim — USMC PT Running Jacket (August's 300-unit breakout) is off the top 10 entirely, having never been restocked. Same fate as Flash Bang MOLLE Pouch (June), MRE PB Spread (July), MRE Crackers 6-Pack (this week). GOOD: the fall gear signal (USN Wool Watch Cap, Shemagh, Laundry Bag) is fresh and hasn't been broken by stockout yet — restock this week to preserve momentum. The MRE Entree line (Beef Stew, Jambalaya, Pasta, Mexican Beef, Vegetarian Chili) all restocked to healthy 235-323 oh — bundle these 5 as a "Hurricane Pantry Assortment" SKU for higher AOV. <strong>Note anomaly: Route Package Protection at -247 on hand</strong> — inventory system issue worth escalating.
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
              <div className="bg-red-950/30 rounded p-2"><strong className="text-red-400">Hurricane Peak Sept 10:</strong> <span className="text-gray-300">Gulf & Atlantic coast — TX, LA, FL, GA, SC, NC</span></div>
              <div className="bg-red-950/30 rounded p-2"><strong className="text-red-400">Fall Gear Signal:</strong> <span className="text-gray-300">Northern-tier states — MN, WI, MI, NY, PA, ME, VT, NH</span></div>
              <div className="bg-orange-950/30 rounded p-2"><strong className="text-orange-400">Labor Day Camping:</strong> <span className="text-gray-300">Nationwide, boost mountain-west + Great Lakes</span></div>
              <div className="bg-yellow-950/30 rounded p-2"><strong className="text-yellow-400">Back-to-College (Late Wave):</strong> <span className="text-gray-300">Late-start college towns (many still moving in)</span></div>
            </div>
          </div>
        </div>
      )}

      {/* ─── TARIFF WATCH TAB ─── */}
      {activeTab === "tariffs" && (
        <div className="space-y-4">
          <h2 className="text-lg font-bold flex items-center gap-2"><AlertTriangle size={18} className="text-yellow-400" /> Tariff Impact Watch</h2>
          <div className="bg-gray-900/60 border border-gray-700 rounded-lg p-4 mb-2">
            <p className="text-sm text-gray-300">Section 122 expired July 24. Section 301 (10% on 16 countries, 12.5% on 44) is now the durable baseline — <strong>no statutory expiration, no rate ceiling</strong>. Regime is settled; import pricing pressure is permanent. Labor Day competitor discounting (REI up to 40% off, Cascade 25%, Dometic 20-40%) is the narrower 2-week fight this week.</p>
          </div>
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
            <p className="text-sm text-gray-300">Labor Day is your chance to counter the discount wars with a story: authentic surplus is already 10-25% cheaper than imported equivalents once tariffs are applied, and the price is stable — no sale gimmicks needed. The USN Wool Watch Cap breakout (4.2× pace) is proof: customers are choosing surplus fall gear over imported. Feature the Fall Gear + MOLLE + Ammo Can + MRE assortment as the "no-gimmick value" alternative all weekend.</p>
          </div>
        </div>
      )}

      {/* Footer */}
      <div className="mt-8 pt-4 border-t border-gray-800 text-center">
        <p className="text-xs text-gray-600">Army Navy Outdoors — Weekly Trend Intelligence | Generated {SCAN_DATE} | Sources: NOAA, NHC, Yale Climate Connections, REI / Cascade Designs / Dometic (Labor Day sales), USTR (Section 301) + internal sales forecasting report (1,445 SKUs)</p>
      </div>
    </div>
  );
}
