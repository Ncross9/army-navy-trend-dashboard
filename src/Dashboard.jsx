import { useState } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend, RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis } from "recharts";
import { AlertTriangle, TrendingUp, Zap, Target, Shield, CloudLightning, ShoppingCart, Mail, MessageSquare, DollarSign, HeartPulse, Package, ChevronDown, ChevronUp, ExternalLink, Database, AlertOctagon } from "lucide-react";

// ─── DATA: BAKED IN FROM AUG 10 2026 RESEARCH + REAL STORE SALES (4,833 SKUs) ──

const SCAN_DATE = "August 10, 2026";
const SCAN_WEEK = "Week of August 10–16, 2026";
const TODAY_INDEX = 0; // Mon 8/10 — scan day
const STORE_DATA_SOURCE = "30-Day Sales Forecasting Report — 4,833 SKUs, 30/90/180/365-day velocity";

const urgencyLevels = { CRITICAL: "🔴", HIGH: "🟠", MEDIUM: "🟡", WATCH: "🟢" };

const categories = [
  {
    id: "emergency",
    name: "Emergency Supplies",
    icon: "Shield",
    urgency: "CRITICAL",
    color: "#ef4444",
    heatScore: 92,
    summary: "Atlantic hurricane season is ramping up hard. NHC is tracking TWO systems today — one with a 60% chance of becoming a tropical depression within 7 days as it moves west across the central tropical Atlantic. Peak (climatological Sept 10) is ~30 days out. Two named storms so far this season. Your MRE inventory is in month-3 of acute crisis: Chicken Burrito Bowl at 1.6 days of cover, Genuine 1-Meal Pack at 1.4 days. MRE accessory bundles (Crackers 6-pack, Heater 6-pack, Drink Mixes) are the persistent breakout cluster.",
    sellingNow: [
      "MRE cases & entrees (your #1 category, chronically OOS)",
      "6-Pack MRE accessories (Crackers +2.2×, Heaters +1.9×, Drink Mixes +1.5×)",
      "P-38 / P-51 can openers (steady after restock)",
      "NOAA weather radios, batteries & lanterns",
      "Water storage, filtration & purification tablets",
      "MRE Entree GI Single-Pack (new top seller, 444 d30 healthy stock)",
    ],
    sellingNext: [
      "Full hurricane-prep kits as season peaks toward Sept 10",
      "Generators & fuel storage for Gulf/Atlantic coast",
      "Long-term food storage buckets (30/60/90-day kits)",
      "Emergency comms / ham radio gear (post-storm outages)",
    ],
    whyNext: "September 10 is the climatological peak — every NHC bulletin drives immediate hurricane-prep demand. The MRE 6-pack accessory pattern shows customers building full-assortment kits, not one-off purchases; bundle for higher AOV.",
    marketingAngles: {
      email: "Subject: 'Hurricane peak in 30 days — NHC is tracking two systems now.' Lead with restocked MRE cases, accessory 6-packs, and water/power kits.",
      social: "'NHC currents: 2 systems, 60% chance of the first tropical depression this week.' Live map + kit checklist reel.",
      ppc: "Aggressive bids on 'mre case,' 'hurricane prep kit,' 'weather radio,' 'emergency water storage,' 'p-38 can opener.' Gulf/Atlantic geo-boost.",
      sms: "NHC tracking 2 systems. Hurricane peak in 30 days — MRE cases, water & power kits shipping today → [link].",
    },
    storeData: {
      topSellers: [
        { name: "MRE Entree — Chicken Burrito Bowl", d30: 1199, d90: 3784 },
        { name: "2026 GI MRE Case A or B", d30: 600, d90: 2077 },
        { name: "MRE Entree GI Entree, Single Pack", d30: 444, d90: 1068 },
        { name: "Genuine US Issue MRE — 1-Meal Pack", d30: 377, d90: 880 },
        { name: "MRE Entree GI Entree, 2-Pack", d30: 370, d90: 890 },
        { name: "P-38 Can Opener — U.S. Shelby Co.", d30: 260, d90: 1240 },
      ],
      trending: [
        { name: "6-Pack MRE Crackers and Breads", d7: 178, d30: 238, mult: 2.2 },
        { name: "MRE Heater Pack of 6", d7: 75, d30: 117, mult: 1.9 },
        { name: "6-Pack MRE Drink Mixes", d7: 67, d30: 132, mult: 1.5 },
      ],
      cold: [
        { name: "MRE Military Peanut Butter Spread", d7: 14, d30: 198 },
        { name: "U.S. Military Foliage Sandbags (Single)", d7: 0, d30: 80 },
      ],
      insight: "🚨 CRISIS CONTINUES: Chicken Burrito Bowl at 1.6 days cover (62 oh, 1,199 d30); Genuine 1-Meal Pack at 1.4 days (18 oh, 377 d30). GOOD: MRE Entree GI Single/2-Pack are healthier (244 & 76 oh). BREAKOUT: MRE accessory 6-packs are the cleanest cluster — Crackers 2.2× (178 d30 vs 238 d90), Heaters 1.9×, Drink Mixes 1.5×. Customers building complete kits — bundle for higher AOV.",
    },
  },
  {
    id: "surplus",
    name: "Military Surplus",
    icon: "Package",
    urgency: "HIGH",
    color: "#f97316",
    heatScore: 88,
    summary: "MASSIVE new breakout: USMC Official PT Running Jacket — sold 300 units in 30 days after selling essentially none in the prior year (301 d90, 303 d365). Zero on hand now. Almost certainly a new SKU launch or discovery moment. 50 CAL Ammo Can still hot at 372 d30. Back-to-college spending on track to top $100B for the first time in 2026 — early signals in your data (Army Duffle Bag +1.9×, Multicam Assault 3-Day Pack +1.5×). Section 122 has expired; Section 301 (10–12.5%) is now the durable baseline.",
    sellingNow: [
      "🔥 USMC PT Running Jacket — 300 d30, 0 on hand (RESTOCK NOW)",
      "50 CAL Ammo Cans — 372 d30, tight stock",
      "1 Qt GI Canteens — 166 d30 steady",
      "MOLLE / FILBE sustainment pouches",
      "Military Issue Duffle Bags (back-to-college signal, 1.9× breakout)",
      "Multicam Assault 3-Day MOLLE Backpack (1.5× breakout)",
    ],
    sellingNext: [
      "College dorm surplus — duffle bags, ALICE packs, footlockers, ruck sacks",
      "Fall-weight camping & sleep systems",
      "Boonie hats & warm-weather layers (heat wave still active)",
      "Restocked USMC PT jacket + apparel breakouts",
    ],
    whyNext: "The PT Running Jacket sold its entire annual quantity in 30 days — restock and there's a market. Back-to-college move-in weekends start Aug 15–30; surplus duffle bags and packs are already accelerating. Section 301's durability makes 'authentic surplus vs. inflated imports' the value story of the season.",
    marketingAngles: {
      email: "Subject: 'RESTOCKED: USMC PT Running Jacket + college move-in surplus picks.' Feature the PT jacket restock alert; back-to-college duffle bag hero.",
      social: "'This jacket sold out in 30 days — here's why.' Restock announcement reel + BTS surplus for college dorm content.",
      ppc: "Bid up: 'usmc pt jacket,' 'military duffle bag,' '50 cal ammo can,' 'military canteen,' 'alice pack college.'",
      sms: "USMC PT Jacket RESTOCK dropping this week. Sold out last month — get on the waitlist → [link].",
    },
    storeData: {
      topSellers: [
        { name: "50 CAL Ammo Can (storage box)", d30: 372, d90: 799 },
        { name: "USMC Official PT Running Jacket (New)", d30: 300, d90: 301 },
        { name: "1 Qt. GI Military Plastic Canteen", d30: 166, d90: 528 },
        { name: "Military Issue Hydration GP MOLLE Pouch", d30: 86, d90: 212 },
        { name: "Used MOLLE II ACU M4 Magazine Pouch", d30: 73, d90: 326 },
        { name: "Coyote FILBE Sustainment Pouch", d30: 71, d90: 261 },
      ],
      trending: [
        { name: "USMC Official PT Running Jacket (New)", d7: 300, d30: 301, mult: 3.0 },
        { name: "U.S. Army Military Issue Duffle Bag (Used)", d7: 49, d30: 79, mult: 1.9 },
        { name: "Military Issue Multicam Assault 3-Day MOLLE Backpack", d7: 25, d30: 50, mult: 1.5 },
      ],
      cold: [
        { name: "U.S. Issue Flash Bang MOLLE Pouch (June's dead breakout)", d7: 12, d30: 346 },
        { name: "2-Pack Flash Bang MOLLE Pouch", d7: 6, d30: 173 },
      ],
      insight: "🔥 SINGLE-BIGGEST BREAKOUT OF THE YEAR: USMC PT Running Jacket went from ~0 sales to 300 in the last 30 days — 100% of annual volume this month. Zero on hand. Restock URGENTLY, feature front & center. Army Duffle Bag +1.9× and Multicam 3-Day Pack +1.5× — clear back-to-college signal. Flash Bang MOLLE Pouches (June's dead breakout) are the cautionary tale: never recovered from the stockout, now fading fast.",
    },
  },
  {
    id: "medical",
    name: "Medical & Trauma",
    icon: "HeartPulse",
    urgency: "HIGH",
    color: "#f97316",
    heatScore: 78,
    summary: "The trauma / IFAK cluster remains the store's most consistent multi-week breakout — 4 SKUs still accelerating 1.7–2.3× vs the 90-day baseline. LBT IFAK Combat First Aid Kit is the runaway leader (58 d30 vs 77 d90 = 2.3×). CAT Tourniquet at 51 d30 with 0 on hand. Pattern: this category shares buyers with your MRE / MOLLE customers who are building complete kits. Hurricane peak in 30 days and continued heat exposure keep injury-prep demand durable.",
    sellingNow: [
      "LBT IFAK Combat First Aid Kit (2.3× breakout — 58 d30)",
      "CAT Tourniquets — 51 d30, OUT of stock",
      "USMC Zipper IFAK First Aid Kit Pouch",
      "OCP Multicam IFAK II Medical Pouch (2.1× breakout, OOS)",
      "Maritime IFAK Combat First Aid Kit (2.0× breakout)",
      "NAR C-A-T Tourniquet Holder (Grade 2)",
    ],
    sellingNext: [
      "Complete IFAK builds bundled with MRE cases",
      "Burn dressings + gauze for continued heat/cookout",
      "Dorm first-aid kits (back-to-college crossover)",
      "Restocked CAT Tourniquets + Multicam IFAK",
    ],
    whyNext: "IFAK build-out demand is durable, not seasonal — customers keep coming back for consumables (gauze, blankets, tourniquets). Hurricane peak + back-to-college dorm safety kits stack the demand over the next 6 weeks.",
    marketingAngles: {
      email: "Subject: 'Build the IFAK before hurricane peak.' Tourniquet + gauze + blanket bundles; dorm first-aid crossover for back-to-college.",
      social: "'What's in a real IFAK' reel. Pair with 'college dorm first-aid essentials.'",
      ppc: "Bid up: 'cat tourniquet,' 'ifak kit,' 'trauma kit,' 'college first aid kit,' 'burn dressing.'",
      sms: "IFAK kits & CAT Tourniquets restocking this week. Hurricane peak in 30 days → [link].",
    },
    storeData: {
      topSellers: [
        { name: "Military Surplus IFAK Combat First Aid Kit (LBT — Expired)", d30: 58, d90: 77 },
        { name: "CAT Tourniquet, Previously Issued", d30: 51, d90: 91 },
        { name: "U.S. Issue OCP Multicam IFAK II Medical Pouch", d30: 30, d90: 43 },
        { name: "USMC Zipper IFAK First Aid Kit Pouch", d30: 29, d90: 85 },
        { name: "Maritime IFAK Combat First Aid Kit (Expired)", d30: 27, d90: 40 },
        { name: "NAR C-A-T Tourniquet Holder (Grade 2)", d30: 26, d90: 52 },
      ],
      trending: [
        { name: "Military Surplus IFAK Combat First Aid Kit (LBT)", d7: 58, d30: 77, mult: 2.3 },
        { name: "U.S. Issue OCP Multicam IFAK II Medical Pouch", d7: 30, d30: 43, mult: 2.1 },
        { name: "Maritime IFAK Combat First Aid Kit", d7: 27, d30: 40, mult: 2.0 },
        { name: "CAT Tourniquet, Previously Issued", d7: 51, d30: 91, mult: 1.7 },
      ],
      cold: [
        { name: "Military Issue MOLLE ACU Improved IFAK Pouch", d7: 11, d30: 83 },
      ],
      insight: "Trauma cluster still leading the store — 4 SKUs breaking out 1.7–2.3× vs 90-day baseline. LBT IFAK is at 2.3× with 14 oh (light cover). CAT Tourniquet at 51 d30 with ZERO on hand — restock priority. OCP Multicam IFAK II Medical Pouch stayed hot at 2.1× despite going OOS last week — real demand persists.",
    },
  },
  {
    id: "weather",
    name: "Weather / Storm Events",
    icon: "CloudLightning",
    urgency: "HIGH",
    color: "#f97316",
    heatScore: 74,
    summary: "Ongoing North American heat wave (70+ deaths attributed through Aug 5). Broad mid-level cyclonic flow across Great Lakes and Northeast Aug 10–14 keeps severe-storm risk elevated in that band. El Niño intensifying — heat and severe storms both expected to remain volatile through summer. Waterproofing SKUs are chronically stocked out — 4 of your 6 top weather sellers at 0 or 4 on hand.",
    sellingNow: [
      "USMC FILBE Coyote Hydration Pack (top seller, 2.3× breakout — OOS)",
      "SealLine Medium & Large Waterproof Stuff Sacks",
      "Hydration bladders (heat wave demand)",
      "USMC MARPAT Wet Weather Tarp",
      "New Poncho Liner Woodland (3.0× breakout)",
      "Rain gear & wet-weather bags",
    ],
    sellingNext: [
      "Restocked FILBE & SealLine (chronic stockout hurting sales)",
      "Hurricane-prep waterproofing bundles (Sept peak)",
      "Camping tarps & shelter halves (fall camping)",
      "Cold-weather layers as fall approaches",
    ],
    whyNext: "Great Lakes / Northeast storm belt is in cyclonic-flow pattern through Wed-Fri. Hurricane peak coming Sept 10 will pull coastal-prep waterproofing. The Poncho Liner Woodland breakout (3× pace) hints at fall/camping demand starting.",
    marketingAngles: {
      email: "Subject: 'Heat wave + storm belt hits the Great Lakes / Northeast this week.' Hydration + waterproofing + weather radio bundle.",
      social: "Split-screen: heat-wave map + severe-storm outlook. 'What to grab tonight' checklist.",
      ppc: "Bid up: 'hydration pack,' 'weather radio,' 'poncho liner,' 'tarp heavy duty,' 'cooling towel.' Boost Great Lakes / NE geos.",
      sms: "Heat wave + storms across GL/NE this week. Hydration & radios shipping today → [link].",
    },
    storeData: {
      topSellers: [
        { name: "USMC FILBE Coyote Hydration Pack", d30: 65, d90: 147 },
        { name: "USMC SealLine Medium Waterproof Stuff Sack", d30: 44, d90: 125 },
        { name: "Military SealLine Large Main Pack Stuff Sack", d30: 44, d90: 128 },
        { name: "Wide Mouth 100oz 3L Hydration Bladder", d30: 41, d90: 85 },
        { name: "USMC MAC Sacks Small SealLine Stuff Sack", d30: 40, d90: 102 },
        { name: "USMC MARPAT Wet Weather Tarp", d30: 33, d90: 90 },
      ],
      trending: [
        { name: "New U.S. Issue Poncho Liner Woodland", d7: 10, d30: 10, mult: 3.0 },
        { name: "USMC FILBE Coyote Hydration Pack (specific grade)", d7: 14, d30: 18, mult: 2.3 },
        { name: "New O.D. 3L Hydration Bladder", d7: 15, d30: 23, mult: 2.0 },
      ],
      cold: [
        { name: "USMC MARPAT Poncho Liner with Zipper", d7: 4, d30: 30 },
      ],
      insight: "Chronic waterproofing stockout: 3 of the top 4 SKUs (FILBE Hydration, SealLine Medium, Hydration Bladder) at 0 on hand; SealLine Large at 4 oh. New Poncho Liner Woodland 3× breakout is a fall-camping signal. Heat wave keeps hydration hot. Restock waterproofing — you're leaving sales on the table.",
    },
  },
  {
    id: "tactical",
    name: "Tactical & EDC",
    icon: "Target",
    urgency: "MEDIUM",
    color: "#eab308",
    heatScore: 66,
    summary: "Category is still thin (80 SKUs, 113 d30) but back-to-college is the window: back-to-college spending on track to top $100B for the first time in 2026, and EDC trend for 2026 is 'minimalist preparedness' — practical flashlights, ferro rods, multi-tools. Rothco Police Whistle is the only real breakout at 1.5× pace. GI Type D-Cell Flashlight (8 d30) is OOS at 0 on hand.",
    sellingNow: [
      "Rothco G.I. Style Police Whistle (1.5× breakout)",
      "Streamlight Sidewinder Compact II (steady)",
      "Gov Issue Gerber E-Tool Tri-fold shovel",
      "Ontario Knife SP16 SPAX",
      "GI Type D-Cell Flashlight (OOS at 0 oh)",
      "UCO Survival Firestriker Ferro Rod (OOS)",
    ],
    sellingNext: [
      "Back-to-college EDC (Aug 15–Sep 1 move-in weekends)",
      "Dorm-friendly ferro rods, whistles, small lights",
      "Restocked GI D-Cell Flashlight & UCO Ferro Rod",
      "Fall camping knives & fire-starting kits",
    ],
    whyNext: "College move-in weekends run Aug 15–Sep 1. Practical / minimalist EDC (whistles, small lights, ferro rods) is dorm-appropriate and low-price-point — good for the value-conscious 2026 shopper.",
    marketingAngles: {
      email: "Subject: 'College move-in EDC — practical picks under $30.' Dorm-safe whistles, small lights, ferro rods.",
      social: "'The 5 EDC items for college freshmen' reel. Tie to safety + preparedness (not tactical fantasy).",
      ppc: "Bid up: 'edc flashlight,' 'ferro rod,' 'college whistle,' 'dorm survival kit.' Prep back-to-college keyword sets.",
      sms: "College move-in EDC: whistles, lights, ferro rods — practical picks → [link].",
    },
    storeData: {
      topSellers: [
        { name: "Rothco G.I. Style Police Whistle (OD)", d30: 20, d90: 40 },
        { name: "Streamlight Sidewinder Compact II Military Light Kit", d30: 14, d90: 49 },
        { name: "Gov Issue Gerber E-Tool Tri-fold Shovel", d30: 9, d90: 22 },
        { name: "Ontario Knife SP16 SPAX, ACU", d30: 9, d90: 19 },
        { name: "G.I. Type D-Cell Flashlight (OD)", d30: 8, d90: 13 },
        { name: "UCO Survival Firestriker Ferro Rod", d30: 6, d90: 12 },
      ],
      trending: [
        { name: "Rothco G.I. Style Police Whistle", d7: 20, d30: 40, mult: 1.5 },
      ],
      cold: [],
      insight: "Category thin at 80 SKUs, 113 d30. Two OOS SKUs (D-Cell Flashlight, Ferro Rod) could be restock wins. Rothco Whistle finally landed at healthy 14 oh (past OOS cycles). Back-to-college window (Aug 15–Sep 1) is your best shot to grow this category — expand practical, low-cost EDC ($10–$30 price point).",
    },
  },
];

// Derived data for charts
const heatData = categories.map((c) => ({ name: c.name.split(" —")[0].split(" /")[0], score: c.heatScore, fill: c.color }));

const channelPriorityData = [
  { channel: "Email", weather: 88, medical: 82, emergency: 98, edc: 78, surplus: 95 },
  { channel: "Social", weather: 82, medical: 80, emergency: 88, edc: 80, surplus: 92 },
  { channel: "PPC", weather: 92, medical: 82, emergency: 97, edc: 80, surplus: 92 },
  { channel: "SMS", weather: 90, medical: 78, emergency: 98, edc: 72, surplus: 90 },
];

const weeklyCalendar = [
  { day: "Mon 8/10", action: "🚨 INTERNAL: Restock USMC PT Jacket (0 oh, 300 d30!), MRE Case, and 50 CAL Ammo Can. Launch heat-wave + hurricane-tracking email — NHC tracking 2 systems, 60% chance first develops this week." },
  { day: "Tue 8/11", action: "Hurricane peak countdown — 30 days to Sept 10 climatological peak. Feature MRE case + 6-Pack accessories bundle (Crackers + Heaters + Drink Mixes)." },
  { day: "Wed 8/12", action: "Back-to-college launch email — surplus duffle bag (1.9× breakout), Multicam 3-Day Pack (1.5× breakout), dorm IFAK. Move-in weekends start 8/15." },
  { day: "Thu 8/13", action: "NHC update email — track the two developing systems. Emergency-kit bundle push to Gulf/Atlantic coast geos." },
  { day: "Fri 8/14", action: "Weekend camping / hammock push — Lightweight Hammock Kit at 1.8× pace, 9 oh. New Poncho Liner Woodland restock announcement." },
  { day: "Sat 8/15", action: "College move-in weekend kickoff SMS. Medical/IFAK dorm safety kit feature. Restock notice for USMC PT Jacket if it lands." },
  { day: "Sun 8/16", action: "Pre-week hurricane prep long-form content. Tease college move-in wave for Aug 20+." },
];

const topKeywords = [
  { keyword: "hurricane prep kit", volume: "Very High", cpc: "$2.10", competition: "High", priority: "🔴" },
  { keyword: "mre case", volume: "High", cpc: "$1.30", competition: "Med", priority: "🔴" },
  { keyword: "usmc pt jacket", volume: "Low (surging)", cpc: "$0.75", competition: "Low", priority: "🔴" },
  { keyword: "noaa weather radio", volume: "High", cpc: "$1.15", competition: "Med", priority: "🔴" },
  { keyword: "cat tourniquet", volume: "Med", cpc: "$1.20", competition: "Med", priority: "🟠" },
  { keyword: "military duffle bag college", volume: "Med (rising)", cpc: "$0.85", competition: "Med", priority: "🟠" },
  { keyword: "50 cal ammo can", volume: "High", cpc: "$0.85", competition: "Med", priority: "🟠" },
  { keyword: "college dorm first aid kit", volume: "Med (rising)", cpc: "$1.10", competition: "Med", priority: "🟠" },
  { keyword: "hydration pack heat", volume: "High", cpc: "$1.30", competition: "Med", priority: "🟡" },
  { keyword: "hammock camping kit", volume: "Med", cpc: "$0.80", competition: "Med", priority: "🟡" },
];

const tariffImpact = [
  { item: "Section 301 baseline (60 countries, 10-12.5%)", tariff: "10-12.5%", priceImpact: "Durable — no sunset, no rate ceiling", action: "Long-term surplus positioning as tariff-insulated alternative" },
  { item: "Boots & Leather Goods (China & Vietnam)", tariff: "30-70% CN stacked on Sec 301", priceImpact: "+10-25%; relief 'years away'", action: "Lean into genuine surplus boots as the value alternative" },
  { item: "Field / Cargo Apparel (China & Vietnam)", tariff: "Stacked Sec 301 + country-specific", priceImpact: "+10-20% on imported soft goods", action: "Promote surplus apparel margin advantage — USMC PT Jacket breakout proof" },
  { item: "EDC Knives, Lights & Multi-Tools (China)", tariff: "~30-42% stacked", priceImpact: "+15-25% on import-dependent SKUs", action: "Back-to-college surplus/value tier — expand assortment for Aug 15+" },
  { item: "Medical / Trauma Consumables", tariff: "Country-specific stacked", priceImpact: "5-15% on gauze, bandages, tourniquets", action: "Bundle IFAK kits at higher AOV to absorb margin pressure" },
];

// ─── REAL STORE DATA: from the Aug 10, 2026 30-day sales forecasting report ────

const overallTopMovers = [
  { name: "MRE Entree — Chicken Burrito Bowl", d30: 1199, d90: 3784, category: "Emergency" },
  { name: "2026 GI MRE Case A or B", d30: 600, d90: 2077, category: "Emergency" },
  { name: "MRE Entree GI Entree, Single Pack", d30: 444, d90: 1068, category: "Emergency" },
  { name: "Genuine US Issue MRE — 1-Meal Pack", d30: 377, d90: 880, category: "Emergency" },
  { name: "50 CAL Ammo Can (storage)", d30: 372, d90: 799, category: "Surplus" },
  { name: "MRE Entree GI Entree, 2-Pack", d30: 370, d90: 890, category: "Emergency" },
  { name: "USMC Official PT Running Jacket (New)", d30: 300, d90: 301, category: "Surplus" },
  { name: "P-38 Can Opener — U.S. Shelby Co.", d30: 260, d90: 1240, category: "Emergency" },
  { name: "Spiced Apples, Special (MRE)", d30: 222, d90: 534, category: "Emergency" },
  { name: "2026 GI MRE A&B 2-Pack", d30: 188, d90: 590, category: "Emergency" },
];

const breakouts = [
  { name: "USMC Official PT Running Jacket (New)", d7: 300, d30: 301, mult: 3.0, category: "Surplus" },
  { name: "6-Pack MRE Crackers and Breads", d7: 178, d30: 238, mult: 2.2, category: "Emergency" },
  { name: "Hammock Lightweight Complete Kit (5ive Star)", d7: 121, d30: 201, mult: 1.8, category: "Other" },
  { name: "MRE Heater Pack of 6", d7: 75, d30: 117, mult: 1.9, category: "Emergency" },
  { name: "Military Surplus IFAK Combat First Aid Kit (LBT)", d7: 58, d30: 77, mult: 2.3, category: "Medical" },
  { name: "U.S. Army Military Issue Duffle Bag (Used)", d7: 49, d30: 79, mult: 1.9, category: "Surplus" },
];

const outOfStockRisk = [
  { name: "USMC Official PT Running Jacket (New)", oh: 0, d30: 300, cover: 0.0, status: "ALREADY OOS — massive breakout, restock ASAP" },
  { name: "MRE Entree — Chicken Burrito Bowl", oh: 62, d30: 1199, cover: 1.6, status: "URGENT — your #1 seller, 3rd month of tight cover" },
  { name: "Genuine US Issue MRE 1-Meal Pack", oh: 18, d30: 377, cover: 1.4, status: "URGENT — persistent OOS pattern" },
  { name: "50 CAL Ammo Can (storage)", oh: 25, d30: 372, cover: 2.0, status: "URGENT — 2 days cover, still hot" },
  { name: "2026 GI MRE Case A or B", oh: 88, d30: 600, cover: 4.4, status: "Improved but still tight — restock" },
  { name: "P-38 Can Opener — U.S. Shelby Co.", oh: 52, d30: 260, cover: 6.0, status: "Watch — was previously OOS" },
  { name: "MRE Entree GI Entree, 2-Pack", oh: 76, d30: 370, cover: 6.2, status: "Watch — accelerating category" },
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
              <Database size={14} /> YOUR STORE — REAL DATA (30-DAY + 90-DAY VELOCITY)
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
                    <p className="text-xs font-bold uppercase tracking-wide text-cyan-300 mb-2">Top sellers (30-day & 90-day orders)</p>
                    <div className="bg-gray-900 rounded overflow-hidden">
                      <table className="w-full text-xs">
                        <thead>
                          <tr className="border-b border-gray-700 text-gray-500">
                            <th className="text-left p-2 font-medium">Product</th>
                            <th className="text-right p-2 font-medium">30d</th>
                            <th className="text-right p-2 font-medium">90d</th>
                          </tr>
                        </thead>
                        <tbody>
                          {cat.storeData.topSellers.map((p, i) => (
                            <tr key={i} className="border-b border-gray-800/50">
                              <td className="p-2 text-gray-200">{p.name}</td>
                              <td className="p-2 text-right text-white font-mono font-bold">{p.d30.toLocaleString()}</td>
                              <td className="p-2 text-right text-gray-400 font-mono">{p.d90.toLocaleString()}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                  {cat.storeData.trending && cat.storeData.trending.length > 0 && (
                    <div>
                      <p className="text-xs font-bold uppercase tracking-wide text-green-400 mb-2">🔥 Accelerating (30-day pace &gt; 90-day quarterly average)</p>
                      <div className="space-y-1">
                        {cat.storeData.trending.map((p, i) => (
                          <div key={i} className="bg-green-950/30 border border-green-900/50 rounded p-2 flex items-center justify-between gap-2">
                            <span className="text-xs text-gray-200">{p.name}</span>
                            <span className="text-xs font-mono text-green-400 font-bold whitespace-nowrap">{p.mult.toFixed(1)}× pace · 30d:{p.d7}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  {cat.storeData.cold && cat.storeData.cold.length > 0 && (
                    <div>
                      <p className="text-xs font-bold uppercase tracking-wide text-gray-400 mb-2">❄ Fading (30-day pace well below 90-day)</p>
                      <div className="space-y-1">
                        {cat.storeData.cold.map((p, i) => (
                          <div key={i} className="bg-gray-900 border border-gray-700/50 rounded p-2 flex items-center justify-between gap-2">
                            <span className="text-xs text-gray-300">{p.name}</span>
                            <span className="text-xs font-mono text-gray-400 whitespace-nowrap">30d:{p.d7} · 90d:{p.d30}</span>
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
          <p className="text-sm font-bold text-red-300">CRITICAL — Massive PT Jacket Breakout + MRE Crisis Month 3 + NHC Tracking 2 Systems + Back-to-College Wave Starts 8/15</p>
          <p className="text-xs text-red-400 mt-1">Four converging events: <strong>(1) USMC PT Running Jacket sold 300 units in 30 days (100% of annual volume) — now 0 on hand.</strong> Restock URGENTLY. <strong>(2) MRE crisis month 3</strong> — Burrito Bowl 1.6 days cover, 1-Meal Pack 1.4 days, 50 CAL Ammo Can 2.0 days. <strong>(3) NHC tracking two Atlantic systems</strong>, one with 60% chance of tropical depression in 7 days; peak Sept 10 (30 days out). <strong>(4) Back-to-college move-in starts Friday 8/15</strong> — $100B market for the first time in 2026. Duffle bag and Multicam 3-Day Pack already breaking out.</p>
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
                <p className="text-sm font-semibold text-red-300">1. 🚨 RESTOCK USMC PT Jacket + MREs + 50 CAL Ammo Can</p>
                <p className="text-xs text-gray-300 mt-1">USMC PT Running Jacket sold 300 in 30 days (was near-zero all year), now 0 on hand — biggest breakout of the year. MRE Burrito Bowl 1.6d cover, 1-Meal Pack 1.4d, 50 CAL Ammo Can 2.0d. Hurricane peak in 30 days. If you don't restock this week, the demand disappears like Flash Bang MOLLE Pouch did in June.</p>
              </div>
              <div className="bg-orange-950/50 border border-orange-800/50 rounded-lg p-3">
                <p className="text-sm font-semibold text-orange-300">2. Back-to-College Launch (Move-in weekends start Fri 8/15)</p>
                <p className="text-xs text-gray-300 mt-1">Back-to-college on track for $100B for the first time in 2026. Your data already shows the signal: US Army Duffle Bag +1.9×, Multicam Assault 3-Day Pack +1.5×, Hammock Kit +1.8×. Launch a dorm-focused email + landing page this week: duffle + pack + IFAK + practical EDC (whistles, small lights, ferro rods, $10-$30 price point).</p>
              </div>
              <div className="bg-orange-950/50 border border-orange-800/50 rounded-lg p-3">
                <p className="text-sm font-semibold text-orange-300">3. Hurricane Peak Countdown + MRE Accessory Bundling</p>
                <p className="text-xs text-gray-300 mt-1">Sept 10 climatological peak is 30 days out; NHC tracking 2 systems, one with 60% chance of tropical depression in 7 days. Bundle MRE case + 6-Pack Crackers + Heaters + Drink Mixes as a single "hurricane pantry" SKU — accessory 6-packs are your persistent breakout cluster (2.2× / 1.9× / 1.5×).</p>
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
              <h3 className="text-sm font-bold text-green-400 mb-2">🔥 Breakouts (30-day pace running well above 90-day quarterly average)</h3>
              <div className="bg-gray-950 rounded overflow-hidden">
                <table className="w-full text-xs">
                  <thead>
                    <tr className="border-b border-gray-700 text-gray-500">
                      <th className="text-left p-2 font-medium">Product</th>
                      <th className="text-left p-2 font-medium">Category</th>
                      <th className="text-right p-2 font-medium">30d</th>
                      <th className="text-right p-2 font-medium">90d</th>
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
                      <th className="text-right p-2 font-medium">90d</th>
                    </tr>
                  </thead>
                  <tbody>
                    {overallTopMovers.map((p, i) => (
                      <tr key={i} className="border-b border-gray-800/50">
                        <td className="p-2 text-gray-500 font-mono">{i + 1}</td>
                        <td className="p-2 text-gray-200">{p.name}</td>
                        <td className="p-2 text-gray-400">{p.category}</td>
                        <td className="p-2 text-right text-white font-mono font-bold">{p.d30.toLocaleString()}</td>
                        <td className="p-2 text-right text-gray-400 font-mono">{p.d90.toLocaleString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="bg-cyan-950/30 border border-cyan-800/50 rounded p-3 text-xs text-gray-300 leading-relaxed">
              <strong className="text-cyan-300">Multi-week pattern (now 3+ months of data):</strong> Restock-fast-or-lose-demand is the store's single most consistent operational failure. Flash Bang MOLLE Pouches (June breakout → dead by August, now 12 d30 vs 346 d90). MRE Peanut Butter Spread (July breakout → cold now). The USMC PT Running Jacket at 300/301/303 (30d/90d/365d — all sales concentrated in the last month) is your NEW test case: restock or lose the market. On the positive side, P-38 Can Opener demand held after your restock (260 d30 vs 1,240 d90 — normalized). The pattern is clear: restock within 7 days of a breakout to preserve demand.
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
              <div className="bg-red-950/30 rounded p-2"><strong className="text-red-400">Hurricane Peak (Sept 10):</strong> <span className="text-gray-300">Gulf & Atlantic coast — TX, LA, FL, GA, SC, NC</span></div>
              <div className="bg-red-950/30 rounded p-2"><strong className="text-red-400">Heat + Storms (This Week):</strong> <span className="text-gray-300">Great Lakes + Northeast — MI, OH, PA, NY, NJ</span></div>
              <div className="bg-orange-950/30 rounded p-2"><strong className="text-orange-400">Back-to-College (Aug 15+):</strong> <span className="text-gray-300">College-town metros nationwide</span></div>
              <div className="bg-yellow-950/30 rounded p-2"><strong className="text-yellow-400">Section 301 Value Message:</strong> <span className="text-gray-300">Nationwide — surplus / value-tier positioning</span></div>
            </div>
          </div>
        </div>
      )}

      {/* ─── TARIFF WATCH TAB ─── */}
      {activeTab === "tariffs" && (
        <div className="space-y-4">
          <h2 className="text-lg font-bold flex items-center gap-2"><AlertTriangle size={18} className="text-yellow-400" /> Tariff Impact Watch</h2>
          <div className="bg-gray-900/60 border border-gray-700 rounded-lg p-4 mb-2">
            <p className="text-sm text-gray-300">Section 122 expired July 24. Section 301 (10% on 16 countries, 12.5% on 44) is now the durable baseline — <strong>no statutory expiration, no rate ceiling</strong>. The regime is settled; import pricing pressure is permanent.</p>
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
            <p className="text-sm text-gray-300">Your USMC PT Running Jacket breakout (300 d30 from ~0 baseline) is Exhibit A that the surplus-vs-import value story is working in real customer behavior. Section 301's permanence means this positioning holds indefinitely — no more "tariffs might sunset" hedging by importers. Aggressive back-to-college surplus positioning (duffle bags, packs, dorm essentials) capitalizes on both value pressure AND the growing $100B back-to-college market.</p>
          </div>
        </div>
      )}

      {/* Footer */}
      <div className="mt-8 pt-4 border-t border-gray-800 text-center">
        <p className="text-xs text-gray-600">Army Navy Outdoors — Weekly Trend Intelligence | Generated {SCAN_DATE} | Sources: NOAA, NHC, SPC, AccuWeather, USTR (Section 301), NRF, Capital One Shopping, MNTN Research + internal sales forecasting report (4,833 SKUs)</p>
      </div>
    </div>
  );
}
