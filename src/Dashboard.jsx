import { useState } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend, RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis } from "recharts";
import { AlertTriangle, TrendingUp, Zap, Target, Shield, CloudLightning, ShoppingCart, Mail, MessageSquare, DollarSign, TreePine, Package, ChevronDown, ChevronUp, ExternalLink, Database, AlertOctagon } from "lucide-react";

// ─── DATA: BAKED IN FROM JULY 20 2026 RESEARCH + REAL STORE SALES (1,403 SKUs) ─

const SCAN_DATE = "July 20, 2026";
const SCAN_WEEK = "Week of July 20–26, 2026";
const TODAY_INDEX = 0; // Mon 7/20 — scan day
const STORE_DATA_SOURCE = "sales_forecasting_report — 1,403 SKUs, 7-day + 30-day order velocity";

const urgencyLevels = { CRITICAL: "🔴", HIGH: "🟠", MEDIUM: "🟡", WATCH: "🟢" };

const categories = [
  {
    id: "emergency",
    name: "Emergency Supplies",
    icon: "Shield",
    urgency: "CRITICAL",
    color: "#ef4444",
    heatScore: 92,
    summary: "50 days into hurricane season with the August–October climatological peak approaching. CSU's July update trimmed the forecast to 9 named / 4 hurricanes / 1 major (Tropical Storm Arthur already came and went — hit Galveston in mid-June). El Niño is expected to intensify to very strong by the peak. Your MRE inventory is in acute crisis: the GI MRE Case and A&B 2-Pack are BOTH at 0 on hand, and the Genuine 1-Meal Pack is at 0.5 days cover. Emerging pattern in the data: customers are buying MRE accessory 6-packs (crackers, drink mixes, PB variety) — full-assortment stockpiling behavior.",
    sellingNow: [
      "MREs & long-shelf-life food (your #1 category by 4×)",
      "MRE 6-pack accessories (crackers, drink mixes, PB variety) — new breakout",
      "P-38 / P-51 can openers (steady after restock — good work)",
      "NOAA weather radios, batteries & lanterns",
      "Water storage, filtration & purification tablets",
      "First-aid / trauma kits, IFAKs & tourniquet holders",
    ],
    sellingNext: [
      "Full hurricane-prep kits as August peak approaches",
      "Generators & fuel storage for coastal customers",
      "Long-term food storage buckets (3-6 month kits)",
      "N95 / smoke protection (western wildfire season)",
    ],
    whyNext: "August-October is the climatological peak — every named storm or NHC bulletin drives immediate demand. The MRE 6-pack accessory breakout indicates customers are progressing from single-meal purchases to full-assortment stockpiling; capitalize with bundled 'complete hurricane kit' SKUs.",
    marketingAngles: {
      email: "Subject: 'Peak hurricane season starts next week — build the kit now.' Lead with restocked MRE bundles, accessory 6-packs, and water/power kits.",
      social: "'From single MRE to full-assortment kit — here's how customers are prepping for August.' Reel showing a 30-day pantry build.",
      ppc: "Aggressive bids on 'mre case,' 'hurricane prep kit,' 'emergency food storage,' 'weather radio,' 'p-38 can opener.'",
      sms: "Peak hurricane season starts Aug 1. MRE cases, water & power kits shipping today → [link]. Restock incoming.",
    },
    storeData: {
      topSellers: [
        { name: "MRE Entree — Chicken Burrito Bowl", d30: 939, d7: 269 },
        { name: "2026 GI MRE Case A or B", d30: 444, d7: 112 },
        { name: "Genuine US Issue MRE — 1-Meal Pack", d30: 348, d7: 76 },
        { name: "P-38 Can Opener — U.S. Shelby Co.", d30: 330, d7: 61 },
        { name: "2026 GI MRE A&B 2-Pack", d30: 163, d7: 39 },
        { name: "MRE Entree — Mexican Beef w/ Vegetables", d30: 145, d7: 28 },
      ],
      trending: [
        { name: "6-Pack MRE Crackers & Breads", d7: 57, d30: 74, mult: 3.3 },
        { name: "6-Pack MRE Drink Mixes", d7: 21, d30: 49, mult: 1.8 },
        { name: "6-Pack MRE Peanut Butter & Spreads Variety", d7: 19, d30: 46, mult: 1.8 },
      ],
      cold: [
        { name: "MRE Military Peanut Butter Spread", d7: 0, d30: 123 },
        { name: "U.S. Military Issue Foliage Sandbags (Single)", d7: 0, d30: 50 },
      ],
      insight: "🚨 CRISIS: GI MRE Case (444 d30) and A&B 2-Pack (163 d30) both at 0 on hand. Genuine 1-Meal Pack at 0.5 days cover (6 oh, 348 d30). NEW BREAKOUT: MRE 6-Pack accessories (crackers 3.3×, drink mixes 1.8×, PB variety 1.8×) — customers building full-assortment kits. GOOD NEWS: P-38 Can Opener demand normalized after your restock (143 oh, 13 days cover). MRE PB Spread went cold — stocked out with 0 on hand, same demand-death pattern as the Flash Bang MOLLE Pouch in June.",
    },
  },
  {
    id: "surplus",
    name: "Military Surplus",
    icon: "Package",
    urgency: "HIGH",
    color: "#f97316",
    heatScore: 82,
    summary: "Tariff transition Friday July 24 is the industry event of the week: Section 122 expires by operation of law at 12:01 a.m. EDT Friday, and Section 301 tariffs (10% on 16 countries, 12.5% on 44 — same or slightly higher than Section 122) take effect with no sunset date. Your data validates the surplus value pitch: 50 CAL Ammo Can spiked to 374 d30 (up 86% from May) and 1-Qt GI Canteen accelerated 2.2× to 164 d30. Bug-out / storage / prep narrative is real.",
    sellingNow: [
      "50 CAL Ammo Cans (storage) — MAJOR breakout, restock priority",
      "1 Qt GI Canteens — 2.2× acceleration",
      "MOLLE II ACU / Multicam mag pouches",
      "FILBE / ALICE / MOLLE sustainment pouches",
      "GI canteen cup stand & stove combo",
      "BDU / OCP / Multicam apparel & cargo pants",
    ],
    sellingNext: [
      "Back-to-college surplus (cargo pants, BDUs, packs) — 4 weeks out",
      "Fall-weight camping & sleep systems",
      "Bulk / value bundles ahead of Section 301 clarity",
      "Boonie hats & warm-weather layers",
    ],
    whyNext: "The Section 122 → Section 301 handoff Friday is a marketing moment: 'lock in pre-transition pricing' works Wed-Thu, then pivot to 'authentic surplus insulated from the new regime' Friday onward. Back-to-college is a growing surplus channel starting mid-August.",
    marketingAngles: {
      email: "Subject: 'Tariff cap ends Friday — lock in pricing this week.' Feature the 50 CAL Ammo Can + Canteen breakout combo.",
      social: "'Section 122 expires Friday. Section 301 takes over — same rate, no sunset. Surplus is still your value play.' Explainer carousel.",
      ppc: "Bid up: 'ammo can 50 cal,' 'military canteen,' 'alice pack,' 'molle pouch,' 'surplus boots.'",
      sms: "Tariff regime shifts Friday. Ammo cans, canteens & MOLLE gear — pre-transition pricing → [link].",
    },
    storeData: {
      topSellers: [
        { name: "50 CAL Ammo Can (storage box)", d30: 374, d7: 173 },
        { name: "1 Qt. GI Military Plastic Canteen", d30: 164, d7: 84 },
        { name: "Used MOLLE II ACU M4 Magazine Pouch", d30: 142, d7: 9 },
        { name: "U.S. Issue Triple ACU Side-x-Side Mag Pouch", d30: 80, d7: 7 },
        { name: "Military Issue Hydration GP MOLLE Pouch", d30: 78, d7: 19 },
        { name: "Coyote FILBE Sustainment Pouch", d30: 70, d7: 15 },
      ],
      trending: [
        { name: "1 Qt. GI Military Plastic Canteen", d7: 84, d30: 164, mult: 2.2 },
        { name: "50 CAL Ammo Can (storage)", d7: 173, d30: 374, mult: 2.0 },
        { name: "U.S. Issue Canteen Cup Stand & Stove", d7: 12, d30: 31, mult: 1.7 },
      ],
      cold: [
        { name: "40MM PA120 Ammo Can (Used)", d7: 0, d30: 37 },
      ],
      insight: "🔥 TWO MAJOR BREAKOUTS: 50 CAL Ammo Can spiked to 374 d30 / 173 d7 (up from 201 in June — bug-out storage narrative). GI 1-Qt Canteen at 164 d30 / 84 d7 (2.2× pace, up from 90 in June). Both are on tight cover (3-9 days) — RESTOCK PRIORITY. Bundle them as 'water + storage starter kit' with MRE case. Coyote FILBE Sustainment Pouch is back in stock (32 oh) after last month's OOS.",
    },
  },
  {
    id: "weather",
    name: "Weather / Storm Events",
    icon: "CloudLightning",
    urgency: "HIGH",
    color: "#f97316",
    heatScore: 78,
    summary: "Dangerous heat wave and severe weather TODAY: heat index up to 110°F across the central/eastern US with overnight lows only in the upper 70s-mid 80s; severe thunderstorms from the Ohio Valley to Mid-Atlantic/Northeast with damaging winds and a conditional strong-tornado risk from NE Iowa across Wisconsin (dewpoints 70s, MLCAPE 3000+ J/kg). Peak hurricane season starts Aug 1.",
    sellingNow: [
      "Hydration packs, bladders & Camelbak-style gear (heat wave)",
      "Waterproof bags, dry sacks & wet-weather bags",
      "Cooling towels & shade gear",
      "NOAA weather radios & headlamps for storm outages",
      "Tarps, ponchos & rain shells (Northeast/OH Valley storms today)",
      "Battery banks & power stations",
    ],
    sellingNext: [
      "Full hurricane-prep kits (Aug-Oct climatological peak)",
      "Generators & fuel storage cans",
      "Sun/heat gear as heat dome persists",
      "Camping rain gear ahead of Labor Day weekend",
    ],
    whyNext: "The heat dome and today's severe outbreak drive immediate flash-buying (48-72 hr post-event cycles). Peak hurricane season starts next Friday — coastal prep demand steps up hard.",
    marketingAngles: {
      email: "Subject: '110°F heat index + severe storms today.' Lead with hydration, cooling gear, and weather radios; tease hurricane peak next month.",
      social: "Post the SPC outlook + heat map with a 3-item 'do you have these tonight?' checklist.",
      ppc: "Bid up: 'weather radio,' 'hydration pack,' 'cooling towel,' 'portable fan,' 'tarp heavy duty.' Boost OH Valley/Mid-Atlantic/Northeast.",
      sms: "Heat index 110°F today + severe storms in OH Valley → NE. Hydration, radios, tarps shipping today → [link].",
    },
    storeData: {
      topSellers: [
        { name: "USMC FILBE Coyote Hydration Pack", d30: 61, d7: 14 },
        { name: "USMC SealLine Medium Waterproof Stuff Sack", d30: 47, d7: 9 },
        { name: "Military SealLine Large Main Pack Stuff Sack", d30: 46, d7: 8 },
        { name: "Wide Mouth 100oz 3L Hydration Bladder", d30: 35, d7: 5 },
        { name: "USMC MAC Sacks Small SealLine Stuff Sack", d30: 32, d7: 8 },
        { name: "US Issue Waterproof Wet Weather Bag", d30: 30, d7: 6 },
      ],
      trending: [
        { name: "Camelbak Desert Thermobak 3L Hydration Backpack", d7: 5, d30: 9, mult: 2.4 },
      ],
      cold: [],
      insight: "Hydration + waterproofing dominates as the heat wave hits. FILBE Hydration Pack up to 61 d30 (from 46 last month). Camelbak Desert Thermobak accelerating 2.4× — heat-driven signal. Front-load hydration and cooling gear PPC for the 110°F index window this week.",
    },
  },
  {
    id: "tactical",
    name: "Tactical & EDC",
    icon: "Target",
    urgency: "MEDIUM",
    color: "#eab308",
    heatScore: 72,
    summary: "Post-Father's-Day lull — the seasonal EDC gift window closed 4 weeks ago and no immediate replacement holiday is in view. Next real driver is back-to-college in mid-August (4 weeks). Section 301 replacement tariffs kick in Friday keeping imported EDC (knives, lights, multi-tools) 10-12.5% more expensive than surplus alternatives — durable pricing pressure with no sunset. Data: Rothco Police Whistle broke out this week but is already OUT OF STOCK.",
    sellingNow: [
      "Streamlight Sidewinder & EDC flashlights (steady)",
      "Rothco G.I. Style Police Whistle — breakout but OOS",
      "UCO / Magnesium ferro rods & fire starters",
      "Gerber E-Tool & compact field tools",
      "Ontario Knife SP16 SPAX & fixed blades",
      "Sweetfire strikeable fire starters",
    ],
    sellingNext: [
      "Back-to-college EDC (Aug 15+) — knives, lights, multi-tools",
      "Fall-weight tactical apparel & belts",
      "Post-tariff-transition value bundles",
      "Preseason hunting/outdoor knives (Oct-Nov)",
    ],
    whyNext: "Back-to-college gift + self-purchase EDC window opens mid-August. New Section 301 baseline makes imported EDC durable-expensive — surplus and value-tier positioning wins the next 6 months.",
    marketingAngles: {
      email: "Subject: 'Restocked — Rothco Police Whistles are back' + preview back-to-college EDC bundles.",
      social: "'Post-Father's-Day EDC restocks + college dorm kit picks.' Reel of ferro rod / whistle / knife / light quartet.",
      ppc: "Bid up: 'edc flashlight,' 'ferro rod,' 'gerber e-tool,' 'best edc knife.' Prepare back-to-college keywords for Aug 1.",
      sms: "Restocked: EDC lights, ferro rods & Police Whistle → [link]. Back-to-college kits landing in August.",
    },
    storeData: {
      topSellers: [
        { name: "Rothco G.I. Style Police Whistle (OD)", d30: 21, d7: 14 },
        { name: "Streamlight Sidewinder Compact II Military Light Kit", d30: 19, d7: 6 },
        { name: "UCO Survival Firestriker Ferro Rod", d30: 7, d7: 1 },
        { name: "Gov Issue Gerber E-Tool Tri-fold Shovel", d30: 7, d7: 3 },
        { name: "Magnesium Firestarter", d30: 6, d7: 1 },
        { name: "Ontario Knife SP16 SPAX, ACU", d30: 6, d7: 1 },
      ],
      trending: [
        { name: "Rothco G.I. Style Police Whistle", d7: 14, d30: 21, mult: 2.9 },
      ],
      cold: [],
      insight: "Rothco Police Whistle exploded to 21 d30 / 14 d7 but is OUT OF STOCK (0 oh) — restock now, this is the third breakout-then-stockout cycle in 6 weeks. Streamlight Sidewinder stable at 19 d30 with 55 oh. Category still thin (31 SKUs, 114 d30) — expand assortment for the back-to-college window opening Aug 15.",
    },
  },
  {
    id: "hunting",
    name: "Hunting — Turkey / Fishing",
    icon: "TreePine",
    urgency: "MEDIUM",
    color: "#eab308",
    heatScore: 64,
    summary: "Deep summer fishing + pre-fall-hunting planning window. Not a category the store stocks.",
    sellingNow: [
      "Summer bass, walleye & catfish tackle",
      "Coolers, fillet knives & live wells",
      "UPF apparel, polarized sunglasses & bug repellent",
      "Kayak fishing accessories",
      "Trail cameras (fall scouting starts)",
      "Early bow hunting supplies",
    ],
    sellingNext: [
      "Trail cameras & bait stations (fall scouting)",
      "Bow-hunting accessories & broadheads",
      "Fall camo & scent-control gear",
      "Early-season waterfowl decoys",
    ],
    whyNext: "August is trail-camera + fall-scouting month — hunters prep before September archery seasons open.",
    marketingAngles: {
      email: "Subject: 'Summer fishing + fall scouting starts now.'",
      social: "Trail-camera and scouting-strategy reels for early archery.",
      ppc: "Bid up: 'trail camera,' 'summer bass lures,' 'polarized sunglasses.'",
      sms: "Fall scouting starts now — trail cams, bug spray & bow prep → [link].",
    },
    storeData: {
      notStocked: true,
      insight: "UNCHANGED FOR 6+ WEEKS: 0 hunting/turkey/fishing SKUs across all 1,403 active products. This tile still shows 'not stocked' — recommend pivoting to a real category. Based on current sales mix, best replacements would be 'MREs & Food Storage' (your #1 by volume) or 'Ammo Cans, Canteens & Storage' (capturing the July breakouts).",
    },
  },
];

// Derived data for charts
const heatData = categories.map((c) => ({ name: c.name.split(" —")[0].split(" /")[0], score: c.heatScore, fill: c.color }));

const channelPriorityData = [
  { channel: "Email", weather: 88, turkey: 60, emergency: 98, edc: 72, surplus: 92 },
  { channel: "Social", weather: 82, turkey: 65, emergency: 88, edc: 78, surplus: 90 },
  { channel: "PPC", weather: 92, turkey: 55, emergency: 97, edc: 75, surplus: 90 },
  { channel: "SMS", weather: 94, turkey: 50, emergency: 98, edc: 68, surplus: 85 },
];

const weeklyCalendar = [
  { day: "Mon 7/20", action: "🚨 INTERNAL: Restock MRE Case + 2-Pack (both 0 oh) and 50 CAL Ammo Can. Launch heat-wave / severe-storm alert email — 110°F index today; storms OH Valley → Northeast." },
  { day: "Tue 7/21", action: "Peak hurricane season prep email — Aug 1 climatological peak begins. Feature restocked MRE bundles + Ammo Can + Canteen 'starter kit.'" },
  { day: "Wed 7/22", action: "'Tariff cap ends Friday' awareness email — Section 122 expires 7/24, Section 301 takes over (10-12.5%, no sunset). Position surplus as value play." },
  { day: "Thu 7/23", action: "LAST FULL DAY of Section 122. 'Pre-transition pricing' urgency push on imported gear — boots, packs, EDC." },
  { day: "Fri 7/24", action: "Section 122 ENDS 12:01am EDT. Section 301 replacement announcement email. Weather-radio push (peak hurricane season starts next week)." },
  { day: "Sat 7/25", action: "Weekend back-to-college EDC preview — knives, lights, ferro rods, multi-tools. Restock notice for Rothco Police Whistle if it lands." },
  { day: "Sun 7/26", action: "Hurricane preparedness Sunday — long-form content on MRE + water + power bundle. Tease Aug 1 peak-season kickoff." },
];

const topKeywords = [
  { keyword: "hurricane prep kit", volume: "Very High", cpc: "$1.90", competition: "High", priority: "🔴" },
  { keyword: "mre case", volume: "High", cpc: "$1.20", competition: "Med", priority: "🔴" },
  { keyword: "50 cal ammo can", volume: "High", cpc: "$0.85", competition: "Med", priority: "🔴" },
  { keyword: "noaa weather radio", volume: "High", cpc: "$1.10", competition: "Med", priority: "🔴" },
  { keyword: "military canteen", volume: "Med", cpc: "$0.65", competition: "Low", priority: "🟠" },
  { keyword: "hydration pack heat wave", volume: "High", cpc: "$1.30", competition: "Med", priority: "🟠" },
  { keyword: "back to college edc", volume: "Med (rising)", cpc: "$0.75", competition: "Low", priority: "🟠" },
  { keyword: "military surplus boots", volume: "Med", cpc: "$0.95", competition: "Med", priority: "🟡" },
  { keyword: "p-38 can opener", volume: "Low (steady)", cpc: "$0.45", competition: "Low", priority: "🟡" },
  { keyword: "trail camera", volume: "High", cpc: "$1.20", competition: "High", priority: "🟡" },
];

const tariffImpact = [
  { item: "🚨 Section 122 → Section 301 TRANSITION (Fri 7/24)", tariff: "10% → 10-12.5%", priceImpact: "Same or slightly higher; NO SUNSET now", action: "Message customers Wed-Thu about pre-transition pricing; then reposition surplus as tariff-insulated" },
  { item: "Section 301 (60 countries: 16 @ 10%, 44 @ 12.5%)", tariff: "10-12.5%", priceImpact: "Durable — no statutory expiration", action: "Long-term surplus positioning as the tariff-insulated alternative" },
  { item: "Boots & Leather Goods (China & Vietnam)", tariff: "30-70% CN / stacked on Sec 301 base", priceImpact: "+10-25%; relief 'years away'", action: "Lean into genuine surplus boots as the value alternative" },
  { item: "Field / Cargo Apparel (China & Vietnam)", tariff: "Stacked Sec 301 + country-specific", priceImpact: "+10-20% on imported soft goods", action: "Promote surplus apparel margin advantage" },
  { item: "EDC Knives, Lights & Multi-Tools (China)", tariff: "~30-42% stacked", priceImpact: "+15-25% on import-dependent SKUs", action: "Position back-to-college surplus/value tier for Aug 15+" },
];

// ─── REAL STORE DATA: from the July 20, 2026 sales forecasting report ──────────

const overallTopMovers = [
  { name: "MRE Entree — Chicken Burrito Bowl", d30: 939, d7: 269, category: "Emergency" },
  { name: "2026 GI MRE Case A or B", d30: 444, d7: 112, category: "Emergency" },
  { name: "50 CAL Ammo Can (storage)", d30: 374, d7: 173, category: "Surplus" },
  { name: "Genuine US Issue MRE — 1-Meal Pack", d30: 348, d7: 76, category: "Emergency" },
  { name: "P-38 Can Opener — U.S. Shelby Co.", d30: 330, d7: 61, category: "Emergency" },
  { name: "1 Qt. GI Military Plastic Canteen", d30: 164, d7: 84, category: "Surplus" },
  { name: "2026 GI MRE A&B 2-Pack", d30: 163, d7: 39, category: "Emergency" },
  { name: "Route Package Protection", d30: 151, d7: 34, category: "Shipping (note: -34 oh)" },
  { name: "MRE Entree — Mexican Beef w/ Vegetables", d30: 145, d7: 28, category: "Emergency" },
  { name: "Spiced Apples, Special", d30: 144, d7: 27, category: "Emergency" },
];

const breakouts = [
  { name: "50 CAL Ammo Can (storage)", d7: 173, d30: 374, mult: 2.0, category: "Surplus" },
  { name: "1 Qt. GI Military Plastic Canteen", d7: 84, d30: 164, mult: 2.2, category: "Surplus" },
  { name: "6-Pack MRE Crackers & Breads", d7: 57, d30: 74, mult: 3.3, category: "Emergency" },
  { name: "6-Pack MRE Drink Mixes", d7: 21, d30: 49, mult: 1.8, category: "Emergency" },
  { name: "Rothco G.I. Style Police Whistle (OD)", d7: 14, d30: 21, mult: 2.9, category: "Tactical" },
  { name: "U.S. Issue Canteen Cup Stand & Stove", d7: 12, d30: 31, mult: 1.7, category: "Surplus" },
];

const outOfStockRisk = [
  { name: "2026 GI MRE Case A or B", oh: 0, d30: 444, cover: 0.0, status: "ALREADY OOS — hurricane peak in 12 days" },
  { name: "2026 GI MRE A&B 2-Pack", oh: 0, d30: 163, cover: 0.0, status: "ALREADY OOS — restock NOW" },
  { name: "Genuine US Issue MRE 1-Meal Pack", oh: 6, d30: 348, cover: 0.5, status: "CRITICAL — 0.5 days cover" },
  { name: "Rothco G.I. Style Police Whistle", oh: 0, d30: 21, cover: 0.0, status: "Breakout SKU already OOS — 3rd time this pattern" },
  { name: "50 CAL Ammo Can (storage)", oh: 39, d30: 374, cover: 3.1, status: "URGENT — new breakout, 3 days cover" },
  { name: "MRE Entree — Chicken Burrito Bowl", oh: 146, d30: 939, cover: 4.7, status: "Monitor — your #1 seller" },
  { name: "1 Qt. GI Military Plastic Canteen", oh: 38, d30: 164, cover: 6.9, status: "Watch — accelerating 2.2×" },
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
          <p className="text-sm font-bold text-red-300">CRITICAL — MRE Stockouts + Section 122→301 Tariff Flip Friday + Peak Hurricane Season Starts Aug 1</p>
          <p className="text-xs text-red-400 mt-1">Three converging events: <strong>(1) MRE crisis</strong> — GI MRE Case (444 d30) AND A&B 2-Pack (163 d30) at 0 on hand; Genuine 1-Meal Pack at 0.5 days cover with hurricane peak starting Aug 1. <strong>(2) Tariff regime flip Friday 7/24</strong> — Section 122 expires at 12:01am EDT; Section 301 replacement kicks in at 10-12.5% (same rate, no sunset). <strong>(3) TODAY</strong>: 110°F heat index + severe storms Ohio Valley → Northeast with strong tornado risk NE Iowa/Wisconsin. NEW BREAKOUTS: 50 CAL Ammo Can (374 d30 up 86%) and 1-Qt Canteen (2.2× pace) — restock both.</p>
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
                <p className="text-sm font-semibold text-red-300">1. 🚨 EMERGENCY RESTOCK — MREs + 50 CAL Ammo Can</p>
                <p className="text-xs text-gray-300 mt-1">GI MRE Case (444 d30) and A&B 2-Pack (163 d30) both at 0 on hand. Genuine 1-Meal Pack at 0.5 days (6 oh, 348 d30). NEW BREAKOUT: 50 CAL Ammo Can spiked to 374 d30 (up 86%, 39 oh = 3.1 days cover). Peak hurricane season starts Aug 1 — 12 days out. Restock ALL of these today.</p>
              </div>
              <div className="bg-red-950/50 border border-red-800/50 rounded-lg p-3">
                <p className="text-sm font-semibold text-red-300">2. 💰 Section 122 → 301 Tariff Flip This Friday (7/24)</p>
                <p className="text-xs text-gray-300 mt-1">Section 122 expires 12:01am EDT Fri 7/24. Section 301 replacement (10% on 16 countries, 12.5% on 44) takes effect the same day — same/slightly higher rate but NO SUNSET. Marketing play: Wed-Thu "lock in pre-transition pricing" on imported gear; Fri onward pivot to "surplus is the tariff-insulated value play."</p>
              </div>
              <div className="bg-orange-950/50 border border-orange-800/50 rounded-lg p-3">
                <p className="text-sm font-semibold text-orange-300">3. 🌡 Heat Wave + Severe Storms TODAY — Push Hydration & Radios</p>
                <p className="text-xs text-gray-300 mt-1">Heat index up to 110°F today with overnight lows in the 80s. Severe thunderstorms with damaging winds Ohio Valley → Mid-Atlantic/Northeast; conditional strong-tornado risk NE Iowa across Wisconsin. Boost hydration-pack, cooling-gear, weather-radio, and tarp PPC in affected geos tonight.</p>
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
              <strong className="text-cyan-300">Multi-week pattern:</strong> The demand-death-after-stockout cycle keeps repeating. Flash Bang MOLLE Pouch died in June after stockout; MRE PB Spread just went cold this week for the same reason (0 on hand, 0 d7 after 123 d30 previously); Rothco Police Whistle is queued up next (breakout THIS week, already OOS). GOOD NEWS: P-38 Can Opener demand normalized cleanly after your restock (143 oh, 13 days cover) — proof the restock-fast playbook works when you follow it. Also: <strong>Route Package Protection shows -34 on hand</strong> — likely oversell/accounting anomaly, worth investigating with your ops team.
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
              <div className="bg-red-950/30 rounded p-2"><strong className="text-red-400">Heat Wave / Storms (Today):</strong> <span className="text-gray-300">OH Valley → Mid-Atlantic → Northeast; NE IA + WI (tornado risk)</span></div>
              <div className="bg-red-950/30 rounded p-2"><strong className="text-red-400">Hurricane Peak (Aug 1+):</strong> <span className="text-gray-300">Gulf & Atlantic coast — TX, LA, FL, GA, SC, NC</span></div>
              <div className="bg-orange-950/30 rounded p-2"><strong className="text-orange-400">Section 301 Value Message:</strong> <span className="text-gray-300">Nationwide — surplus / value-tier positioning</span></div>
              <div className="bg-yellow-950/30 rounded p-2"><strong className="text-yellow-400">Back-to-College EDC (Aug 15+):</strong> <span className="text-gray-300">College-town metros nationwide</span></div>
            </div>
          </div>
        </div>
      )}

      {/* ─── TARIFF WATCH TAB ─── */}
      {activeTab === "tariffs" && (
        <div className="space-y-4">
          <h2 className="text-lg font-bold flex items-center gap-2"><AlertTriangle size={18} className="text-yellow-400" /> Tariff Impact Watch</h2>
          <div className="bg-red-950/40 border border-red-800/50 rounded-lg p-4 mb-2">
            <p className="text-sm font-bold text-red-300 mb-1">⚠ REGIME CHANGE THIS FRIDAY (July 24, 2026 · 12:01 a.m. EDT)</p>
            <p className="text-xs text-gray-300">Section 122's 10% global tariff expires by operation of law — extending it would require an Act of Congress and no legislation is pending. USTR's Section 301 replacement takes over: <strong>10% on 16 countries, 12.5% on 44 countries</strong> (covering ~99.4% of world). Same or slightly higher rate as Section 122, but with <strong>no statutory expiration and no rate ceiling</strong> — the pricing pressure is durable now.</p>
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
            <p className="text-sm text-gray-300">The Section 122 → 301 handoff removes the "the tariffs might sunset" hope from importer planning. Section 301 has no ceiling and no expiration — the 10-12.5% baseline is now durable, and stacked country-specific rates on China (30-70%) and Vietnam remain. Your real sales already validate the surplus value pitch: the 50 CAL Ammo Can spike to 374 d30 and 1-Qt Canteen breakout to 164 d30 both show customers choosing authentic surplus over imported gear. Position aggressively as "the tariff-insulated value alternative" from Friday onward.</p>
          </div>
        </div>
      )}

      {/* Footer */}
      <div className="mt-8 pt-4 border-t border-gray-800 text-center">
        <p className="text-xs text-gray-600">Army Navy Outdoors — Weekly Trend Intelligence | Generated {SCAN_DATE} | Sources: NOAA, NHC, SPC, CSU Tropical, USTR (Section 122/301), IndustrialSage, Sheppard Mullin + internal sales forecasting report (1,403 SKUs)</p>
      </div>
    </div>
  );
}
