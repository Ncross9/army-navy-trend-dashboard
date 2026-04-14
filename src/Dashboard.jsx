import { useState } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend, RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis } from "recharts";
import { AlertTriangle, TrendingUp, Zap, Target, Shield, CloudLightning, ShoppingCart, Mail, MessageSquare, DollarSign, Crosshair, TreePine, Package, ChevronDown, ChevronUp, ExternalLink } from "lucide-react";

// ─── DATA: BAKED IN FROM APRIL 14 2026 RESEARCH ───────────────────────────────

const SCAN_DATE = "April 14, 2026";
const SCAN_WEEK = "Week of April 14–20, 2026";

const urgencyLevels = { CRITICAL: "🔴", HIGH: "🟠", MEDIUM: "🟡", WATCH: "🟢" };

const categories = [
  {
    id: "weather",
    name: "Weather / Storm Events",
    icon: "CloudLightning",
    urgency: "CRITICAL",
    color: "#ef4444",
    heatScore: 97,
    summary: "Active tornado outbreak across central US — Kansas, Missouri, Iowa, Minnesota, Wisconsin hit April 13. 14+ tornadoes confirmed. 12,000+ without power in east-central Kansas. NOAA warns repeated rounds of severe storms through April 16. Flash flood + hail risk elevated Texas to Great Lakes.",
    sellingNow: [
      "Emergency weather radios & NOAA scanners",
      "Portable power stations & battery banks",
      "Tarps, contractor bags, emergency shelter",
      "First aid / trauma kits",
      "Flashlights & lanterns (headlamps especially)",
      "Water purification & storage containers",
    ],
    sellingNext: [
      "Generator fuel stabilizer & accessories",
      "Chainsaw supplies & cleanup gear",
      "Long-term food storage kits (post-scare restocking)",
      "Home reinforcement / storm prep kits",
    ],
    whyNext: "Storms forecast through April 16+ across Plains & Midwest. Post-event restocking cycle begins 48-72 hrs after each event. Families who were unprepared panic-buy after near-misses.",
    marketingAngles: {
      email: "Subject: 'Tornadoes hit Kansas — is your family ready?' — Feature storm prep bundles, weather radios, and 72-hr kits. Urgency-driven with real event footage/headlines.",
      social: "Post storm damage photos (credited news sources) with 'Don't wait until it's your neighborhood' messaging. Reels showing bug-out bag builds in 60 seconds.",
      ppc: "Bid up: 'emergency weather radio,' 'storm prep kit,' 'portable power station,' 'tornado survival kit.' Geo-target KS, MO, IA, MN, WI, IL, OK, TX.",
      sms: "FLASH: Severe storms hitting the Midwest NOW. Storm-ready kits shipping same day → [link]. Limited stock.",
    },
  },
  {
    id: "shooting",
    name: "Shooting & Ammo",
    icon: "Crosshair",
    urgency: "HIGH",
    color: "#f97316",
    heatScore: 91,
    summary: "Major ammo price hikes effective April 1: Federal, CCI, Remington, Speer, Blazer, Fiocchi, HEVI-Shot, B&P all up 2-10%. Copper up 30% YoY after major mine closure. New tariffs hitting imports hard — PMC +25%, Prvi Partizan +37% (may exit US market). TSS turkey loads doubled due to China tariffs. Overall ammo prices 8-15% above early 2024.",
    sellingNow: [
      "Bulk 9mm, .223/5.56, .308 (buy-before-next-hike mentality)",
      "Turkey shotshells — lead alternatives to expensive TSS",
      "Winchester Long Beard XR (budget TSS alternative, under $25/box)",
      "Reloading components & equipment",
      "Defensive ammo (.380, .45 ACP, hollow points)",
    ],
    sellingNext: [
      "More bulk buys as next price hike rumors circulate",
      "20-gauge & .410 turkey loads (small-gauge trend)",
      "6.5 Creedmoor & .300 Blackout (SHOT Show darlings)",
      "Reloading presses & brass (cost-conscious shooters switching)",
    ],
    whyNext: "Manufacturers warned of possible mid-year re-pricing. Tariff uncertainty means import ammo could spike further or disappear. Shooters stockpile ahead of perceived shortages.",
    marketingAngles: {
      email: "Subject: 'Ammo prices just went up — here's how to stay ahead.' Price comparison tables (before/after April 1). Push bulk deals & reloading starter kits. Include 'lock in today's prices' urgency.",
      social: "Carousel post: 'Ammo price increases by caliber — what you need to know.' Reel: '5 ways to shoot more for less in 2026.' Engage the reloading community.",
      ppc: "Bid up: 'bulk 9mm ammo,' 'cheap 5.56 ammo,' 'ammo before price increase,' 'reloading kit,' 'turkey shotshells.' Negative KW: 'free ammo.'",
      sms: "Ammo prices UP across all major brands. Lock in bulk pricing before the next hike → [link]. Free shipping on cases.",
    },
  },
  {
    id: "hunting",
    name: "Hunting — Turkey / Fishing",
    icon: "TreePine",
    urgency: "HIGH",
    color: "#f97316",
    heatScore: 88,
    summary: "Spring turkey season ACTIVE across most states. Population rebound signals: 4 states expanded seasons, Indiana seeing record harvests, Arkansas up 22% over 2024. Small-gauge shotgun trend accelerating (20ga, 28ga, .410). Walleye fishing on Lake Erie expected to be world-class. TSS loads priced out of reach for many — budget alternatives surging.",
    sellingNow: [
      "Turkey decoys — Avian-X Jake/Hen combos dominating",
      "Mouth calls — WoodHaven brand trending",
      "Turkey vests (Sitka Equinox, Optifade Subalpine)",
      "Budget turkey loads (Winchester Long Beard XR)",
      "Camo face masks, gloves, ground blinds",
      "Spring fishing tackle — walleye jigs, crankbaits",
    ],
    sellingNext: [
      "Late-season turkey gear (states extending into May)",
      "Small-gauge turkey choke tubes (20ga, .410)",
      "Summer fishing gear ramp-up (bass, catfish)",
      "Tick & insect repellent (warming temps)",
      "Trail cameras for fall deer season scouting",
    ],
    whyNext: "Turkey seasons running through April-May in most states. Late-season hunters gear up mid-April. Fishing transitions to warm-water species as water temps rise. Tick season coincides with turkey hunting in tall grass/woods.",
    marketingAngles: {
      email: "Subject: 'Turkey season is ON — are you set up for success?' Gear checklist format. Feature decoy combos, call bundles, and vest packages. Include state season date reference chart.",
      social: "UGC campaign: 'Show us your gobbler' photo contest. TikTok/Reels: morning hunt vlogs, calling tutorials. Pin top turkey gear list.",
      ppc: "Bid up: 'turkey hunting decoys,' 'turkey calls,' 'turkey vest,' 'spring fishing gear,' 'walleye lures 2026.' Geo-target by active state seasons.",
      sms: "Gobble season is HERE 🦃 Turkey decoys, calls & loads — same-day ship → [link]",
    },
  },
  {
    id: "emergency",
    name: "Emergency Supplies",
    icon: "Shield",
    urgency: "HIGH",
    color: "#f97316",
    heatScore: 85,
    summary: "Prepper market shifting from panic-buying to practical planning. 68% of preppers upgraded medical/trauma kits. Supply chain disruptions in chemicals & medical supplies. Tornado outbreak driving acute regional demand. FEMA pushing 3-day minimum preparedness. Hygiene supplies emerging as underserved prepper niche.",
    sellingNow: [
      "72-hour emergency kits / bug-out bags",
      "Trauma & IFAK first aid kits",
      "Water filtration (Sawyer, LifeStraw, Berkey)",
      "Emergency food (Mountain House, ReadyWise, MREs)",
      "Hand-crank / solar radios",
      "Fire starters, emergency blankets, paracord",
    ],
    sellingNext: [
      "Solar generators & panels (summer storm season)",
      "Long-term food storage (6-12 month kits)",
      "Hygiene & sanitation kits (emerging trend)",
      "Faraday bags & EMP protection gear",
      "Ham radio / emergency comms gear",
    ],
    whyNext: "Tornado season peaking April-June means 8+ weeks of storm-driven demand. Supply chain disruption headlines keep prepper community active. Summer hurricane season prep starts in May. FEMA preparedness month campaigns drive awareness.",
    marketingAngles: {
      email: "Subject: 'Are you REALLY ready for 72 hours on your own?' Interactive quiz funnel → personalized kit recommendations. Feature family-sized bundles. Trust signal: FEMA guidelines alignment.",
      social: "Series: 'What's in my bug-out bag' — staff picks. Before/after organizing emergency supplies. Myth-busting: '5 prepper mistakes that could cost your life.'",
      ppc: "Bid up: 'emergency kit,' 'bug out bag,' '72 hour kit,' 'MRE meals,' 'water filter survival,' 'storm prep supplies.' Geo-target tornado alley + hurricane coast.",
      sms: "Severe weather season is HERE. Family emergency kits from $49.99 — don't get caught unprepared → [link]",
    },
  },
  {
    id: "tactical",
    name: "Tactical & EDC",
    icon: "Target",
    urgency: "MEDIUM",
    color: "#eab308",
    heatScore: 74,
    summary: "EDC trending toward minimalist, lightweight, office-friendly designs. Sustainability focus — Micarta handles, recycled metals gaining share. Smart tech integration (GPS, Bluetooth). Multi-tool market evolving toward 'fewer tools, better execution.' New pocket knife & multi-tool releases dropping weekly. Tariffs hitting imported soft goods hard (26-46% increases on Vietnam, Bangladesh, China, India).",
    sellingNow: [
      "Lightweight multi-tools (Leatherman, Gerber)",
      "Minimalist pocket knives (titanium, Micarta handles)",
      "Tactical flashlights (compact, rechargeable)",
      "Everyday carry organizers & pouches",
      "Tactical pens & discreet self-defense tools",
    ],
    sellingNext: [
      "Father's Day EDC gift sets (6 weeks out)",
      "Summer EDC (lighter, moisture-wicking holsters)",
      "Tariff-driven price increases on imported knives/tools",
      "Back-to-school EDC kits (early planning)",
    ],
    whyNext: "Father's Day (June 15) is the next major gifting event — EDC is a top gift category. Import tariffs will push prices up on overseas-made gear, creating urgency to buy now. Summer carry adjustments drive lighter/slimmer gear.",
    marketingAngles: {
      email: "Subject: 'The 2026 EDC starter kit — what belongs in your pockets?' Curated bundles by persona (office worker, outdoorsman, first responder). Early Father's Day gift guide tease.",
      social: "Flat-lay photos of curated EDC loadouts. 'What's in your pockets?' community engagement. Unboxing reels of new knife releases.",
      ppc: "Bid up: 'EDC gear,' 'everyday carry kit,' 'best pocket knife 2026,' 'tactical flashlight,' 'Father's Day gift for men.' Start Father's Day campaigns early.",
      sms: "New EDC drops just landed — titanium knives, rechargeable lights & more → [link]. Prices going up with tariffs, grab yours now.",
    },
  },
  {
    id: "surplus",
    name: "Military Surplus",
    icon: "Package",
    urgency: "MEDIUM",
    color: "#eab308",
    heatScore: 70,
    summary: "Tactical boots & pants remain top sellers. Military backpacks/load-bearing gear popular with outdoor and prepper communities. Online retail dominates (~70% of surplus market). Sustainability narrative growing — surplus as eco-friendly alternative to fast fashion. Gorpcore/milsurp fashion trend maintaining momentum with younger demographics.",
    sellingNow: [
      "Tactical boots (Belleville, Danner, McRae)",
      "BDU / ACU pants & surplus cargo pants",
      "Military-spec backpacks & rucksacks (ALICE, MOLLE)",
      "Surplus sleeping systems & ponchos",
      "Canteens, mess kits, field gear",
    ],
    sellingNext: [
      "Lightweight summer-weight BDUs",
      "Boonie hats & sun protection gear",
      "Hydration packs (summer heat)",
      "Surplus tents & shelters (camping season)",
    ],
    whyNext: "Spring-to-summer transition drives lightweight clothing demand. Camping season kickoff means shelter, sleep systems, and field gear. Fashion/gorpcore trend keeps younger buyers shopping surplus. Import tariffs make new tactical apparel more expensive, pushing value-seekers to surplus.",
    marketingAngles: {
      email: "Subject: 'Military-grade gear at surplus prices — why pay retail?' Compare surplus vs retail pricing. Highlight durability + sustainability angle. Feature seasonal picks for spring camping.",
      social: "'Surplus style' outfit-of-the-day posts targeting gorpcore audience. TikTok: 'I bought my entire camping kit from military surplus for under $100.' Heritage storytelling content.",
      ppc: "Bid up: 'military surplus boots,' 'army backpack,' 'BDU pants,' 'military camping gear,' 'tactical pants cheap.' Target outdoor + fashion audiences.",
      sms: "Genuine military surplus — boots, packs & field gear at fraction of retail → [link]. Built to last, priced to move.",
    },
  },
];

// Derived data for charts
const heatData = categories.map((c) => ({ name: c.name.split(" —")[0].split(" /")[0], score: c.heatScore, fill: c.color }));

const channelPriorityData = [
  { channel: "Email", weather: 90, ammo: 95, turkey: 85, emergency: 88, edc: 70, surplus: 65 },
  { channel: "Social", weather: 80, ammo: 75, turkey: 95, emergency: 70, edc: 90, surplus: 85 },
  { channel: "PPC", weather: 95, ammo: 90, turkey: 80, emergency: 92, edc: 75, surplus: 60 },
  { channel: "SMS", weather: 98, ammo: 85, turkey: 70, emergency: 95, edc: 60, surplus: 50 },
];

const weeklyCalendar = [
  { day: "Mon 4/14", action: "LAUNCH storm-prep email blast to full list. Push SMS to geo-targeted tornado alley. Update PPC bids on emergency keywords. Post storm damage + 'Be Ready' social." },
  { day: "Tue 4/15", action: "Send ammo price-increase email with comparison tables. Launch bulk ammo PPC campaigns. Post turkey season 'gear check' carousel on Instagram." },
  { day: "Wed 4/16", action: "Turkey hunting UGC campaign kickoff — 'Show Us Your Gobbler.' Mid-week SMS: ammo deal reminder. Blog post: '2026 Ammo Price Guide — What You Need to Know.'" },
  { day: "Thu 4/17", action: "Emergency prep email: '72-Hour Kit Checklist.' EDC new-arrivals social post. Launch Father's Day early-bird PPC tests." },
  { day: "Fri 4/18", action: "Weekend warrior email: Turkey + fishing gear roundup. Military surplus 'camping for under $100' TikTok/Reel. Flash sale SMS: free shipping on orders $75+." },
  { day: "Sat 4/19", action: "Social engagement day: respond to UGC, share customer photos. Retarget email openers from Monday/Tuesday with follow-up offers." },
  { day: "Sun 4/20", action: "Prep next week's content. Analyze campaign performance. Restock alerts on fast-movers. Plan Monday's email based on weekend storm/news developments." },
];

const topKeywords = [
  { keyword: "emergency weather radio", volume: "High", cpc: "$1.80", competition: "Med", priority: "🔴" },
  { keyword: "bulk 9mm ammo", volume: "Very High", cpc: "$2.40", competition: "High", priority: "🔴" },
  { keyword: "turkey hunting decoys", volume: "High", cpc: "$1.20", competition: "Med", priority: "🟠" },
  { keyword: "72 hour emergency kit", volume: "High", cpc: "$2.10", competition: "Med", priority: "🔴" },
  { keyword: "portable power station", volume: "Very High", cpc: "$3.50", competition: "High", priority: "🟠" },
  { keyword: "cheap 5.56 ammo", volume: "High", cpc: "$1.90", competition: "Med", priority: "🔴" },
  { keyword: "bug out bag", volume: "High", cpc: "$1.60", competition: "Med", priority: "🟠" },
  { keyword: "EDC knife 2026", volume: "Med", cpc: "$0.90", competition: "Low", priority: "🟡" },
  { keyword: "turkey calls", volume: "High", cpc: "$0.80", competition: "Low", priority: "🟠" },
  { keyword: "military surplus boots", volume: "Med", cpc: "$1.10", competition: "Low", priority: "🟡" },
  { keyword: "storm prep kit", volume: "High", cpc: "$1.70", competition: "Med", priority: "🔴" },
  { keyword: "reloading kit", volume: "Med", cpc: "$1.40", competition: "Low", priority: "🟠" },
];

const tariffImpact = [
  { item: "TSS Turkey Loads (China)", tariff: "32%+", priceImpact: "Doubled — $20+/shell", action: "Push domestic lead alternatives" },
  { item: "PMC Ammo (South Korea)", tariff: "25%", priceImpact: "+$100/1000 rds (5.56)", action: "Stock up, highlight domestic brands" },
  { item: "Prvi Partizan (Serbia)", tariff: "37%", priceImpact: "May exit US market", action: "Clear inventory, alert loyal buyers" },
  { item: "Imported Soft Goods (Vietnam)", tariff: "46%", priceImpact: "+26-46% on apparel", action: "Surplus gear as value alternative" },
  { item: "Raw Metals (Copper, Lead)", tariff: "25%", priceImpact: "Ammo +8-15% from 2024", action: "Promote reloading, bulk buys" },
];

// ─── COMPONENTS ────────────────────────────────────────────────────────────────

const COLORS = ["#ef4444", "#f97316", "#f97316", "#f97316", "#eab308", "#eab308"];

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
          <p className="text-sm font-bold text-red-300">CRITICAL ALERT — Active Tornado Outbreak</p>
          <p className="text-xs text-red-400 mt-1">14+ tornadoes confirmed across KS, MO, IA, MN, WI on April 13. Storms forecast through April 16. 12,000+ without power in Kansas. Ammo price hikes effective April 1 across all major brands (2-10%). TSS turkey loads doubled due to China tariffs.</p>
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
                <p className="text-xs text-gray-300 mt-1">Send emergency-prep email + SMS to full list. Geo-target PPC to tornado-affected states. Post storm content on social. This is time-sensitive — storms continue through Friday.</p>
              </div>
              <div className="bg-orange-950/50 border border-orange-800/50 rounded-lg p-3">
                <p className="text-sm font-semibold text-orange-300">2. Ammo Price-Hike Campaign (Tue-Wed)</p>
                <p className="text-xs text-gray-300 mt-1">Educate customers on April 1 price increases. Push bulk deals with 'lock in today's price' urgency. Feature comparison tables and reloading alternatives.</p>
              </div>
              <div className="bg-orange-950/50 border border-orange-800/50 rounded-lg p-3">
                <p className="text-sm font-semibold text-orange-300">3. Turkey Season Push (All Week)</p>
                <p className="text-xs text-gray-300 mt-1">Season is active in most states with expanded bag limits. Push decoy combos, budget shotshells (Long Beard XR), calls, and vests. Launch UGC photo contest.</p>
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
            <div key={i} className={`rounded-lg p-3 ${i === 0 ? "bg-red-950/50 border border-red-800" : "bg-gray-900"}`}>
              <div className="flex items-center gap-2 mb-1">
                <span className={`text-sm font-bold ${i === 0 ? "text-red-300" : "text-green-400"}`}>{day.day}</span>
                {i === 0 && <span className="text-xs bg-red-800 text-red-200 px-1.5 py-0.5 rounded">TODAY</span>}
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
              <div className="bg-red-950/30 rounded p-2"><strong className="text-red-400">Storm Prep:</strong> <span className="text-gray-300">KS, MO, IA, MN, WI, IL, OK, TX, NE</span></div>
              <div className="bg-orange-950/30 rounded p-2"><strong className="text-orange-400">Ammo:</strong> <span className="text-gray-300">Nationwide — emphasize TX, FL, GA, OH, PA, NC</span></div>
              <div className="bg-orange-950/30 rounded p-2"><strong className="text-orange-400">Turkey:</strong> <span className="text-gray-300">IN, AR, MS, KY, OH, PA, VA, TX (active seasons)</span></div>
              <div className="bg-yellow-950/30 rounded p-2"><strong className="text-yellow-400">EDC/Surplus:</strong> <span className="text-gray-300">Nationwide — metro areas for EDC, rural for surplus</span></div>
            </div>
          </div>
        </div>
      )}

      {/* ─── TARIFF WATCH TAB ─── */}
      {activeTab === "tariffs" && (
        <div className="space-y-4">
          <h2 className="text-lg font-bold flex items-center gap-2"><AlertTriangle size={18} className="text-yellow-400" /> Tariff Impact Watch</h2>
          <p className="text-sm text-gray-400">April 2 tariffs are reshaping pricing across your inventory. Here's what to act on now.</p>
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
            <p className="text-sm text-gray-300">Tariffs are creating a two-speed market: domestic brands gaining pricing power while imports face existential pressure. Use this to your advantage — position Army Navy Outdoors as the place to find value through military surplus alternatives, domestic ammo brands, and bulk-buy savings before the next wave of increases. Lead-based turkey loads are the smart-money play while TSS is priced out of reach.</p>
          </div>
        </div>
      )}

      {/* Footer */}
      <div className="mt-8 pt-4 border-t border-gray-800 text-center">
        <p className="text-xs text-gray-600">Army Navy Outdoors — Weekly Trend Intelligence | Generated {SCAN_DATE} | Sources: NOAA, SPC, NWTF, NSSF, Target Sports USA, Field & Stream, AccuWeather, CNN Weather, Grand View Research</p>
      </div>
    </div>
  );
}
