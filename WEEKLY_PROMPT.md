# Weekly Update Prompt

Paste the block below into Claude Code on Mondays. Claude will do the research, rewrite `src/Dashboard.jsx`, commit, and push — GitHub Actions redeploys https://ncross9.github.io/army-navy-trend-dashboard/ automatically.

---

**Run the weekly trend update for Army Navy Outdoors.**

We're a military surplus, emergency supplies, outdoor gear, shooting, and hunting retailer. Do a full fresh scan using WebSearch/WebFetch for current news, weather events, political/tariff developments, seasonal factors, and retail trends across these 6 categories: **Weather/Storm Events, Shooting & Ammo, Hunting (Turkey/Fishing), Emergency Supplies, Tactical & EDC, Military Surplus**.

For each category identify: what's selling fastest RIGHT NOW, what will sell next week and why, and marketing angles for email / social / PPC / SMS.

Then update the live dashboard in one shot:

1. Read the current `src/Dashboard.jsx` in `/Users/nat/DevProject/Snake/.claude/worktrees/naughty-cray` to match its exact structure — do not restructure, just refresh data.
2. Rewrite `src/Dashboard.jsx` with this week's data. Update:
   - `SCAN_DATE` and `SCAN_WEEK` constants
   - The 6 `categories` entries (summary, sellingNow, sellingNext, whyNext, marketingAngles, heatScore, urgency)
   - The top alert banner
   - `weeklyCalendar` (Mon–Sun for this week)
   - `topKeywords` table
   - `tariffImpact` table
   - "Top 3 Actions This Week" in the Overview tab
3. Keep all imports limited to `react`, `recharts`, `lucide-react`. If you add a new dep, also update `package.json`.
4. Commit to `main` with message `Weekly update: week of <DATE>` and push. GitHub Actions redeploys to https://ncross9.github.io/army-navy-trend-dashboard/ automatically.

Report back with: (a) the top 3 most important findings this week, (b) the commit SHA, and (c) confirmation the Action succeeded.
