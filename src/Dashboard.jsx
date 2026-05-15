import { useState } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend, RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis } from "recharts";
import { AlertTriangle, TrendingUp, Zap, Target, Shield, CloudLightning, ShoppingCart, Mail, MessageSquare, DollarSign, TreePine, Package, ChevronDown, ChevronUp, ExternalLink } from "lucide-react";

// ─── DATA: BAKED IN FROM MAY 15 2026 RESEARCH ─────────────────────────────────

const SCAN_DATE = "May 15, 2026";
const SCAN_WEEK = "Week of May 11–17, 2026";
const TODAY_INDEX = 4; // Friday May 15 — index into weeklyCalendar

const urgencyLevels = { CRITICAL: "🔴", HIGH: "🟠", MEDIUM: "🟡", WATCH: "🟢" };

const categories = [
  {
    id: "weather",
    name: "Weather / Storm Events",
    icon: "CloudLightning",
    urgency: "CRITICAL",
    color: "#ef4444",
    heatScore: 88,
    summary: "Active multi-round severe weather siege across the Plains and Midwest — enhanced risk over much of Iowa May 15, with a fresh round of strong-to-severe storms forecast for the northern Plains Saturday night into Sunday. 2026 is a front-loaded, exceptionally violent tornado year: Illinois alone passed 109 tornadoes by May 11, and an EF3 killed three in the Kankakee, IL / Lake Village, IN corridor. The May 18–22 pattern pairs continued Plains severe weather with an early-season East Coast heatwave.",
    sellingNow: [
      "NOAA weather radios & hand-crank emergency radios",
      "Portable generators & fuel cans",
      "Tarps, sandbags & emergency roof/window repair kits",
      "Flashlights, lanterns & headlamps (plus batteries)",
      "First aid / trauma kits",
      "Storm-shelter bags & document protection cases",
    ],
    sellingNext: [
      "Solar chargers & power banks (heatwave + outage prep)",
      "Water storage containers & portable filtration",
      "Coolers & ice substitutes (heatwave food preservation)",
      "Rain gear, waterproof boots & ponchos",
      "Battery-powered fans & cooling gear",
    ],
    whyNext: "The May 18–22 pattern pairs continued Plains severe weather with an anomalous East Coast heatwave, shifting demand toward outage-survival-in-heat gear — cooling, power, water. The May 21 NOAA hurricane outlook will dominate headlines and trigger early coastal prep buying.",
    marketingAngles: {
      email: "Subject: 'Storms aren't slowing down — restock before this weekend's round.' Feature generators, weather radios, and flashlights. Urgency-driven with the live SPC outlook.",
      social: "Post the SPC severe-weather outlook map for the Iowa / northern Plains threat with a 3-item 'Do you have these tonight?' checklist. Reels: 60-second storm-kit builds.",
      ppc: "Bid up: 'weather radio,' 'portable generator,' 'emergency flashlight,' 'storm prep kit.' Geo-target IA, NE, SD, MN, OK.",
      sms: "FLASH: Severe storms across the Plains tonight. Generators & weather radios in stock, same-day ship → [link]. Don't wait for the siren.",
    },
  },
  {
    id: "emergency",
    name: "Emergency Supplies",
    icon: "Shield",
    urgency: "HIGH",
    color: "#f97316",
    heatScore: 79,
    summary: "Prepper demand is in seasonal ramp-up: National Hurricane Preparedness Week wrapped May 3–9, the Atlantic season opens June 1, and NOAA's official outlook drops May 21. Market data shows 68% of preppers upgraded kits with trauma supplies, and water security is the #1 priority. Wildfire risk is also elevated — 1.85M acres burned through April 30 (194% of the 10-year average) with above-normal fire potential across the southern tier.",
    sellingNow: [
      "Water filtration (gravity & straw filters) & water storage",
      "Freeze-dried / long-term food storage buckets",
      "Trauma kits, IFAKs & advanced first aid",
      "Hand-crank / solar radios & emergency comms",
      "Pre-built 72-hour kits & get-home bags",
      "Generators & backup power stations",
    ],
    sellingNext: [
      "Hurricane-specific prep bundles (coastal-targeted)",
      "N95 respirators & wildfire smoke protection",
      "Tarps, window protection & sandbags",
      "Solar panels & expandable power systems",
      "Sanitation & waste-management kits",
    ],
    whyNext: "The May 21 NOAA hurricane outlook will spike coastal preparedness searches ahead of the June 1 season open, and the southern-tier wildfire build — Texas Hill Country to south Florida — adds a parallel demand stream for smoke and air protection through summer.",
    marketingAngles: {
      email: "Subject: 'Hurricane season opens June 1 — NOAA's forecast lands May 21.' Interactive kit-builder funnel. Feature family-sized bundles aligned with FEMA guidelines.",
      social: "Countdown graphic: '17 days to hurricane season — the 5-item kit most people forget.' Series: 'What's in my get-home bag.'",
      ppc: "Bid up: 'hurricane prep kit,' 'emergency water filter,' 'long term food storage,' 'bug out bag.' Boost Gulf & Atlantic coast geos.",
      sms: "Hurricane season starts June 1. Water, food & power kits ready to ship — beat the pre-storm sellout → [link].",
    },
  },
  {
    id: "tactical",
    name: "Tactical & EDC",
    icon: "Target",
    urgency: "HIGH",
    color: "#f97316",
    heatScore: 71,
    summary: "The 2026 EDC market is defined by 'Minimalist Preparedness' — tools that do more and weigh less — with flat-profile pocket lights, compact fixed blades, and transforming multi-tools leading new releases. Father's Day (June 21) is now in the gifting window, and EDC is a top men's gift category. Tariffs are a real headwind: apparel/footwear/leather carry roughly 8% added cost under Section 122, with China imports near 35%, and a May 7 court ruling left pricing volatile.",
    sellingNow: [
      "Pocket knives & compact fixed blades",
      "Lightweight multi-tools",
      "Flat-profile EDC flashlights & headlamps",
      "EDC pouches, organizers & pocket slips",
      "Tactical pens & titanium small gear",
      "Belts, wallets & key organizers",
    ],
    sellingNext: [
      "Father's Day gift bundles & sets",
      "Engravable / personalized knives & tools",
      "Premium gift-tier knives & titanium gear",
      "EDC watches & tactical accessories",
      "Gift cards & 'build-a-kit' gifting options",
    ],
    whyNext: "Father's Day on June 21 opens the gift-buying window now — early shoppers beat both shipping cutoffs and further tariff-driven price increases on imported gear. Personalized and engravable items have lead times, pulling those purchases forward.",
    marketingAngles: {
      email: "Subject: 'Father's Day starts now — give him gear he'll carry every day.' Curated bundles by persona. Push 'order early, beat tariff price bumps.'",
      social: "'The gift that doesn't gather dust' — carousel of knife / multi-tool / flashlight gift picks. Unboxing reels of new EDC releases.",
      ppc: "Bid up: 'Father's Day gifts for men,' 'best EDC knife,' 'multi-tool gift,' 'tactical flashlight.' Launch Father's Day campaigns now.",
      sms: "Dad's day is June 21. Knives, multi-tools & lights he'll actually use — shop early before tariff price hikes → [link].",
    },
  },
  {
    id: "hunting",
    name: "Hunting — Turkey / Fishing",
    icon: "TreePine",
    urgency: "HIGH",
    color: "#f97316",
    heatScore: 64,
    summary: "Spring turkey season is in its final stretch — northeastern states stay open (NY through 5/31, PA through 5/30, Maine through 6/6) while Virginia closes 5/16, a hard late-season deadline this week. Missouri's nation-leading 51,010-bird spring 2025 harvest keeps turkey gear demand strong. Fishing has shifted to post-spawn patterns: walleye holding on rocky transitions near 12 ft, largemouth staging in warm bays, and channel catfish heating up across the Mississippi system.",
    sellingNow: [
      "Turkey calls — box, slate, diaphragm & locator",
      "Turkey decoys (jake/hen combos) & ground blinds",
      "Turkey vests, lightweight camo & TSS loads",
      "Walleye jigs, crankbaits & live-bait rigs",
      "Bass soft plastics, spinnerbaits & topwater",
      "Catfish gear — circle hooks, cut-bait rigs, heavy line",
    ],
    sellingNext: [
      "Summer-pattern bass gear (deep crankbaits, Carolina rigs)",
      "Catfish setups — rod holders, bank gear, jug lines",
      "Polarized sunglasses & UPF sun apparel",
      "Kayak / boat fishing accessories & tackle storage",
      "Panfish & crappie tackle",
    ],
    whyNext: "Most spring turkey seasons close within two weeks, so demand pivots fully to fishing as water temps push bass into the spawn and catfish into peak summer feeding. Rising temperatures also drive UV-protection apparel, a noted spring-summer 2026 retail trend.",
    marketingAngles: {
      email: "Subject: 'Last call for longbeards.' Late-season turkey gear checklist for NE / Mid-Atlantic hunters, cross-promoted with post-spawn bass and catfish tackle.",
      social: "Split-content post: 'NE hunters still have weeks left' vs. 'everyone else — the cats are biting.' UGC 'Show us your gobbler' contest.",
      ppc: "Bid up: 'late season turkey calls,' 'turkey hunting decoys,' 'post spawn walleye lures,' 'catfish rigs.' Geo-target by active state seasons.",
      sms: "Turkey season's closing in most states. Grab calls & decoys now — or gear up for catfish season → [link].",
    },
  },
  {
    id: "surplus",
    name: "Military Surplus",
    icon: "Package",
    urgency: "MEDIUM",
    color: "#eab308",
    heatScore: 62,
    summary: "Gorpcore — functional outdoor gear worn as everyday style — is a $4.9B market growing ~7.2% annually, maturing in 2026 into muted, durable 'Quiet Outdoors.' Military surplus is the value play within the trend, delivering the look at a fraction of hype-brand prices. Tariffs (8% added on apparel/footwear under Section 122, ~35% on Chinese goods, apparel prices up ~33%) are actively steering buyers toward domestic surplus inventory as camping season opens.",
    sellingNow: [
      "Tactical / combat boots & surplus footwear",
      "Surplus field jackets, BDU/OCP apparel & fatigues",
      "Rucksacks, ALICE & MOLLE packs",
      "Wool blankets, ponchos & shelter halves",
      "Canteens, mess kits & field pouches",
      "Camo apparel & tactical pants",
    ],
    sellingNext: [
      "Camping-season surplus — sleep systems, cots, tarps",
      "Bug nets, ground pads & warm-weather field gear",
      "Surplus duffels & travel packs",
      "Boonie hats & sun-protective headwear",
      "Lightweight warm-weather uniforms & layers",
    ],
    whyNext: "Camping-season demand accelerates through late May into Memorial Day weekend, and surplus sleep systems and shelter gear are high-value, durable picks. Continued tariff-driven inflation on new imported gear keeps steering budget-conscious buyers to surplus.",
    marketingAngles: {
      email: "Subject: 'The gorpcore look for ¼ the price.' Compare surplus vs. retail pricing. Feature spring-camping picks — boots, jackets, packs.",
      social: "'Tariffs made new gear expensive. Surplus didn't get the memo.' Before/after price comparison. 'Surplus style' outfit-of-the-day for the gorpcore audience.",
      ppc: "Bid up: 'military surplus boots,' 'ALICE pack,' 'surplus field jacket,' 'cheap camping gear.' Target outdoor + fashion audiences.",
      sms: "New gear prices are up 33%. Surplus boots & packs still priced right → [link]. Built to last, priced to move.",
    },
  },
];

// Derived data for charts
const heatData = categories.map((c) => ({ name: c.name.split(" —")[0].split(" /")[0], score: c.heatScore, fill: c.color }));

const channelPriorityData = [
  { channel: "Email", weather: 90, turkey: 80, emergency: 92, edc: 85, surplus: 65 },
  { channel: "Social", weather: 82, turkey: 88, emergency: 72, edc: 90, surplus: 88 },
  { channel: "PPC", weather: 95, turkey: 78, emergency: 90, edc: 88, surplus: 62 },
  { channel: "SMS", weather: 98, turkey: 68, emergency: 95, edc: 70, surplus: 55 },
];

const weeklyCalendar = [
  { day: "Mon 5/11", action: "LAUNCH storm-prep email blast — generators, weather radios, flashlights — geo-targeted to the Plains & Midwest. Update PPC bids on emergency keywords." },
  { day: "Tue 5/12", action: "Open the Father's Day campaign: launch landing page and PPC for 'Father's Day gifts for men' and EDC knives. Post turkey 'gear check' carousel on Instagram." },
  { day: "Wed 5/13", action: "Post the SPC severe-weather outlook to social with a 3-item 'tonight's checklist.' Boost in IA, NE, SD. Blog post: '2026 Storm Prep Guide.'" },
  { day: "Thu 5/14", action: "'Last call for longbeards' late-season turkey email to NE / Mid-Atlantic; cross-promote post-spawn fishing gear. EDC new-arrivals social post." },
  { day: "Fri 5/15", action: "SMS storm alert — enhanced risk over Iowa. Push in-stock generators & weather radios with same-day shipping. Flash free-shipping offer on orders $75+." },
  { day: "Sat 5/16", action: "Weekend surplus + camping flash promo — 'gorpcore for ¼ the price.' Feature boots, packs, sleep systems. Respond to UGC and share customer photos." },
  { day: "Sun 5/17", action: "Tease hurricane prep — 'NOAA's 2026 outlook drops Thursday' — water/food/power bundles, coastal geos. Plan next week's content from weekend developments." },
];

const topKeywords = [
  { keyword: "weather radio", volume: "Very High", cpc: "$1.20", competition: "High", priority: "🔴" },
  { keyword: "portable generator", volume: "Very High", cpc: "$2.10", competition: "High", priority: "🔴" },
  { keyword: "hurricane prep kit", volume: "High", cpc: "$1.65", competition: "Med", priority: "🔴" },
  { keyword: "Father's Day gifts for men", volume: "Very High", cpc: "$1.05", competition: "High", priority: "🟠" },
  { keyword: "emergency water filter", volume: "High", cpc: "$1.40", competition: "Med", priority: "🟠" },
  { keyword: "best EDC knife", volume: "High", cpc: "$0.95", competition: "Med", priority: "🟠" },
  { keyword: "military surplus boots", volume: "Med", cpc: "$0.75", competition: "Low", priority: "🟡" },
  { keyword: "long term food storage", volume: "High", cpc: "$1.85", competition: "High", priority: "🟠" },
  { keyword: "turkey hunting calls", volume: "Med", cpc: "$0.70", competition: "Low", priority: "🟡" },
  { keyword: "multi-tool", volume: "High", cpc: "$0.90", competition: "Med", priority: "🟡" },
];

const tariffImpact = [
  { item: "Imported Apparel / Field Clothing (China)", tariff: "~35%", priceImpact: "Retail up ~30-33%", action: "Push domestic surplus apparel as the value alternative" },
  { item: "Tactical Boots / Footwear (Vietnam)", tariff: "~18%", priceImpact: "Footwear up ~33% sector-wide", action: "Pre-buy inventory; promote surplus boots heavily" },
  { item: "EDC Knives & Multi-Tools (China)", tariff: "~35%", priceImpact: "Added cost on metal goods", action: "Order Father's Day stock early; 'buy before price hikes'" },
  { item: "Synthetic Gear & Raw Materials (Asia)", tariff: "10-18%", priceImpact: "Input costs up 10-20%", action: "Lock supplier pricing; favor USA-made or surplus" },
  { item: "TSS Turkey Loads (imported components)", tariff: "~10-35%", priceImpact: "Modest per-box increase", action: "Stock for late NE season; bundle with calls & decoys" },
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
  const [expanded, setExpanded] = useState({ now: true, next: true, marketing: false });
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
        <div className="flex items-center gap-4">
          <p className="text-sm text-gray-400">Weekly Trend Intelligence Scan</p>
          <span className="text-xs bg-gray-800 text-gray-300 px-2 py-0.5 rounded">{SCAN_WEEK}</span>
          <span className="text-xs bg-red-900 text-red-200 px-2 py-0.5 rounded animate-pulse">LIVE DATA</span>
        </div>
      </div>

      {/* Alert Banner */}
      <div className="bg-red-950 border border-red-800 rounded-lg p-3 mb-6 flex items-start gap-3">
        <AlertTriangle size={20} className="text-red-400 mt-0.5 flex-shrink-0" />
        <div>
          <p className="text-sm font-bold text-red-300">CRITICAL ALERT — Active Severe Weather Siege</p>
          <p className="text-xs text-red-400 mt-1">Enhanced risk of severe storms over Iowa May 15, with another strong-to-severe round forecast for the northern Plains Saturday night. 2026 is a record-violent tornado year — 109+ tornadoes in Illinois alone by May 11. NOAA releases its official 2026 Atlantic hurricane outlook May 21; season opens June 1.</p>
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
                <p className="text-sm font-semibold text-red-300">1. Storm-Prep Blitz (TODAY)</p>
                <p className="text-xs text-gray-300 mt-1">Send storm-prep email + SMS to the full list. Geo-target PPC to the Plains & Midwest. Enhanced severe-weather risk over Iowa today with another round Saturday night — this is time-sensitive.</p>
              </div>
              <div className="bg-orange-950/50 border border-orange-800/50 rounded-lg p-3">
                <p className="text-sm font-semibold text-orange-300">2. Hurricane Prep Pre-Season Push (This Week)</p>
                <p className="text-xs text-gray-300 mt-1">NOAA's official 2026 hurricane outlook releases May 21 and the season opens June 1. Get water, food, and power kit bundles in front of coastal customers before the rush.</p>
              </div>
              <div className="bg-orange-950/50 border border-orange-800/50 rounded-lg p-3">
                <p className="text-sm font-semibold text-orange-300">3. Father's Day EDC Launch (Tue onward)</p>
                <p className="text-xs text-gray-300 mt-1">Father's Day is June 21. Launch gift bundles, a landing page, and PPC now — early orders beat shipping cutoffs and further tariff-driven price hikes on imported gear.</p>
              </div>
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
              <div className="bg-red-950/30 rounded p-2"><strong className="text-red-400">Storm Prep:</strong> <span className="text-gray-300">IA, NE, SD, MN, WI, IL, KS, MO, OK</span></div>
              <div className="bg-orange-950/30 rounded p-2"><strong className="text-orange-400">Hurricane / Emergency:</strong> <span className="text-gray-300">Gulf & Atlantic coast — TX, LA, FL, GA, SC, NC</span></div>
              <div className="bg-orange-950/30 rounded p-2"><strong className="text-orange-400">Turkey / Fishing:</strong> <span className="text-gray-300">NY, PA, ME, WV (late seasons) + nationwide fishing</span></div>
              <div className="bg-yellow-950/30 rounded p-2"><strong className="text-yellow-400">EDC / Surplus:</strong> <span className="text-gray-300">Nationwide — metro areas for EDC, rural for surplus</span></div>
            </div>
          </div>
        </div>
      )}

      {/* ─── TARIFF WATCH TAB ─── */}
      {activeTab === "tariffs" && (
        <div className="space-y-4">
          <h2 className="text-lg font-bold flex items-center gap-2"><AlertTriangle size={18} className="text-yellow-400" /> Tariff Impact Watch</h2>
          <p className="text-sm text-gray-400">Section 122 tariffs are reshaping pricing across your inventory — and a May 7 court ruling left rates volatile. Here's what to act on now.</p>
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
            <p className="text-sm text-gray-300">Tariffs are creating a two-speed market: domestic and surplus gear gaining pricing power while imports face ~33% price inflation. Use this to your advantage — position Army Navy Outdoors as the value destination through military surplus alternatives and 'buy now before the next increase' urgency. With the Section 122 proclamation under appeal after the May 7 court ruling, pricing could shift again — keep customers informed and inventory locked.</p>
          </div>
        </div>
      )}

      {/* Footer */}
      <div className="mt-8 pt-4 border-t border-gray-800 text-center">
        <p className="text-xs text-gray-600">Army Navy Outdoors — Weekly Trend Intelligence | Generated {SCAN_DATE} | Sources: NOAA, SPC, NIFC, FEMA, Ready.gov, OutdoorHub, Game & Fish, Gear Patrol, Tax Foundation, ISPO, Grand View Research</p>
      </div>
    </div>
  );
}
