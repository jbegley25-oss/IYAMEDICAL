"use client";

import { useState, useEffect, useCallback } from "react";
import {
  BarChart3,
  Eye,
  Users,
  Clock,
  ArrowDownUp,
  RefreshCw,
  LogOut,
  Download,
  Database,
  FileText,
  Monitor,
  Smartphone,
  Tablet,
  MousePointerClick,
  TrendingDown,
  Activity,
} from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { AnalyticsLogin } from "./login";

// ── Types ──────────────────────────────────────────────────────────────────

interface Overview {
  liveVisitors: number;
  visitors: number;
  pageViews: number;
  sessions: number;
  avgTime: number;
  bounceRate: number;
  newVisitors: number;
  returningVisitors: number;
}

interface TimelinePoint {
  time: string;
  hour: string;
  visitors: number;
  pageViews: number;
}

interface PageRow {
  page: string;
  title: string;
  views: number;
  uniqueViews: number;
}

interface SourceRow {
  source: string;
  visitors: number;
  percentage: number;
}

interface DeviceRow {
  device: string;
  visitors: number;
  percentage: number;
}

interface FunnelStep {
  step: string;
  count: number;
  percentage: number;
}

interface ClickRow {
  element: string;
  label: string;
  clicks: number;
}

type TimeRange = "today" | "7d" | "30d" | "all";

// ── Colors ─────────────────────────────────────────────────────────────────

const TEAL = "#14b8a6";
const CYAN = "#22d3ee";
const SLATE_700 = "#334155";
const PIE_COLORS = ["#14b8a6", "#22d3ee", "#6366f1", "#f59e0b"];
const VISITOR_COLORS = ["#14b8a6", "#6366f1"];

// ── Helpers ────────────────────────────────────────────────────────────────

function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${s.toString().padStart(2, "0")}`;
}

function formatNumber(n: number): string {
  if (n >= 10000) return `${(n / 1000).toFixed(1)}k`;
  return n.toLocaleString();
}

// ── Main component ─────────────────────────────────────────────────────────

export function AnalyticsDashboard() {
  const [token, setToken] = useState<string | null>(null);
  const [range, setRange] = useState<TimeRange>("7d");
  const [refreshing, setRefreshing] = useState(false);
  const [lastRefresh, setLastRefresh] = useState<Date>(new Date());

  const [overview, setOverview] = useState<Overview | null>(null);
  const [timeline, setTimeline] = useState<TimelinePoint[]>([]);
  const [pages, setPages] = useState<PageRow[]>([]);
  const [sources, setSources] = useState<SourceRow[]>([]);
  const [devices, setDevices] = useState<DeviceRow[]>([]);
  const [funnel, setFunnel] = useState<FunnelStep[]>([]);
  const [clicks, setClicks] = useState<ClickRow[]>([]);

  const fetchData = useCallback(
    async (currentRange: TimeRange) => {
      if (!token) return;
      setRefreshing(true);

      const headers = { Authorization: `Bearer ${token}` };
      const base = "/api/analytics/data";

      try {
        const [ovRes, tlRes, pgRes, srcRes, devRes, fnRes, clkRes] = await Promise.all([
          fetch(`${base}?metric=overview&range=${currentRange}`, { headers }),
          fetch(`${base}?metric=timeline&range=${currentRange}`, { headers }),
          fetch(`${base}?metric=pages&range=${currentRange}`, { headers }),
          fetch(`${base}?metric=sources&range=${currentRange}`, { headers }),
          fetch(`${base}?metric=devices&range=${currentRange}`, { headers }),
          fetch(`${base}?metric=funnel&range=${currentRange}`, { headers }),
          fetch(`${base}?metric=clicks&range=${currentRange}`, { headers }),
        ]);

        // If unauthorized, force re-login
        if (ovRes.status === 401) {
          localStorage.removeItem("iya_analytics_token");
          localStorage.removeItem("iya_analytics_expiry");
          setToken(null);
          return;
        }

        const [ov, tl, pg, src, dev, fn, clk] = await Promise.all([
          ovRes.json(),
          tlRes.json(),
          pgRes.json(),
          srcRes.json(),
          devRes.json(),
          fnRes.json(),
          clkRes.json(),
        ]);

        setOverview(ov.data);
        setTimeline(tl.data);
        setPages(pg.data);
        setSources(src.data);
        setDevices(dev.data);
        setFunnel(fn.data);
        setClicks(clk.data);
        setLastRefresh(new Date());
      } catch (err) {
        console.error("Failed to fetch analytics data:", err);
      } finally {
        setRefreshing(false);
      }
    },
    [token]
  );

  // Fetch on mount + range change
  useEffect(() => {
    if (token) fetchData(range);
  }, [token, range, fetchData]);

  // Auto-refresh every 30 seconds
  useEffect(() => {
    if (!token) return;
    const interval = setInterval(() => fetchData(range), 30000);
    return () => clearInterval(interval);
  }, [token, range, fetchData]);

  function handleLogout() {
    localStorage.removeItem("iya_analytics_token");
    localStorage.removeItem("iya_analytics_expiry");
    setToken(null);
  }

  if (!token) return <AnalyticsLogin onAuthenticated={setToken} />;

  const deviceIcons: Record<string, React.ReactNode> = {
    Mobile: <Smartphone className="h-4 w-4" />,
    Desktop: <Monitor className="h-4 w-4" />,
    Tablet: <Tablet className="h-4 w-4" />,
  };

  const visitorPieData = overview
    ? [
        { name: "New", value: overview.newVisitors },
        { name: "Returning", value: overview.returningVisitors },
      ]
    : [];

  return (
    <div suppressHydrationWarning className="min-h-screen bg-slate-900 text-slate-100">
      {/* ── Header ──────────────────────────────────────────────── */}
      <header className="sticky top-0 z-50 border-b border-slate-800 bg-slate-900/80 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6">
          <div className="flex items-center gap-3">
            <BarChart3 className="h-6 w-6 text-teal-400" />
            <h1 className="text-lg font-semibold">IYA Medical Analytics</h1>
          </div>

          <div className="flex items-center gap-2">
            {/* Range buttons */}
            <div className="mr-2 flex rounded-lg bg-slate-800 p-0.5">
              {(["today", "7d", "30d", "all"] as TimeRange[]).map((r) => (
                <button
                  key={r}
                  onClick={() => setRange(r)}
                  className={`rounded-md px-3 py-1.5 text-xs font-medium transition-all ${
                    range === r
                      ? "bg-teal-600 text-white shadow-sm"
                      : "text-slate-400 hover:text-white"
                  }`}
                >
                  {r === "today" ? "Today" : r === "all" ? "All" : r.toUpperCase()}
                </button>
              ))}
            </div>

            <button
              onClick={() => fetchData(range)}
              disabled={refreshing}
              className="rounded-lg p-2 text-slate-400 transition-colors hover:bg-slate-800 hover:text-white"
              title="Refresh data"
            >
              <RefreshCw className={`h-4 w-4 ${refreshing ? "animate-spin" : ""}`} />
            </button>

            <button
              onClick={handleLogout}
              className="rounded-lg p-2 text-slate-400 transition-colors hover:bg-slate-800 hover:text-red-400"
              title="Logout"
            >
              <LogOut className="h-4 w-4" />
            </button>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6">
        {/* ── Stats row ────────────────────────────────────────── */}
        <div className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
          <StatCard
            label="Live Visitors"
            value={overview?.liveVisitors ?? 0}
            icon={<Activity className="h-4 w-4" />}
            accent="green"
            pulse
          />
          <StatCard
            label="Page Views"
            value={formatNumber(overview?.pageViews ?? 0)}
            icon={<Eye className="h-4 w-4" />}
          />
          <StatCard
            label="Unique Visitors"
            value={formatNumber(overview?.visitors ?? 0)}
            icon={<Users className="h-4 w-4" />}
          />
          <StatCard
            label="Sessions"
            value={formatNumber(overview?.sessions ?? 0)}
            icon={<MousePointerClick className="h-4 w-4" />}
          />
          <StatCard
            label="Avg Time"
            value={formatTime(overview?.avgTime ?? 0)}
            icon={<Clock className="h-4 w-4" />}
          />
          <StatCard
            label="Bounce Rate"
            value={`${overview?.bounceRate ?? 0}%`}
            icon={<TrendingDown className="h-4 w-4" />}
          />
        </div>

        {/* ── Charts grid ──────────────────────────────────────── */}
        <div className="mb-6 grid gap-6 lg:grid-cols-2">
          {/* Timeline */}
          <Card title="Visitor Timeline" className="lg:col-span-2">
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={timeline}>
                  <defs>
                    <linearGradient id="tealGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor={TEAL} stopOpacity={0.3} />
                      <stop offset="100%" stopColor={TEAL} stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="cyanGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor={CYAN} stopOpacity={0.2} />
                      <stop offset="100%" stopColor={CYAN} stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke={SLATE_700} />
                  <XAxis
                    dataKey="hour"
                    tick={{ fill: "#94a3b8", fontSize: 11 }}
                    axisLine={{ stroke: SLATE_700 }}
                    tickLine={false}
                    interval="preserveStartEnd"
                  />
                  <YAxis
                    tick={{ fill: "#94a3b8", fontSize: 11 }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#1e293b",
                      border: "1px solid #334155",
                      borderRadius: 8,
                      color: "#f1f5f9",
                      fontSize: 12,
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="pageViews"
                    stroke={CYAN}
                    fill="url(#cyanGrad)"
                    strokeWidth={2}
                    name="Page Views"
                  />
                  <Area
                    type="monotone"
                    dataKey="visitors"
                    stroke={TEAL}
                    fill="url(#tealGrad)"
                    strokeWidth={2}
                    name="Visitors"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </Card>

          {/* Traffic Sources */}
          <Card title="Traffic Sources">
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={sources} layout="vertical" margin={{ left: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke={SLATE_700} horizontal={false} />
                  <XAxis
                    type="number"
                    tick={{ fill: "#94a3b8", fontSize: 11 }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis
                    type="category"
                    dataKey="source"
                    tick={{ fill: "#94a3b8", fontSize: 11 }}
                    axisLine={false}
                    tickLine={false}
                    width={100}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#1e293b",
                      border: "1px solid #334155",
                      borderRadius: 8,
                      color: "#f1f5f9",
                      fontSize: 12,
                    }}
                  />
                  <Bar dataKey="visitors" fill={TEAL} radius={[0, 4, 4, 0]} barSize={18} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>

          {/* Devices + New vs Returning */}
          <div className="grid gap-6 sm:grid-cols-2">
            <Card title="Devices">
              <div className="h-48">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={devices}
                      cx="50%"
                      cy="50%"
                      innerRadius={45}
                      outerRadius={70}
                      dataKey="visitors"
                      nameKey="device"
                      strokeWidth={0}
                    >
                      {devices.map((_, i) => (
                        <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#1e293b",
                        border: "1px solid #334155",
                        borderRadius: 8,
                        color: "#f1f5f9",
                        fontSize: 12,
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="flex justify-center gap-4">
                {devices.map((d, i) => (
                  <div key={d.device} className="flex items-center gap-1.5 text-xs text-slate-400">
                    <span
                      className="inline-block h-2.5 w-2.5 rounded-full"
                      style={{ backgroundColor: PIE_COLORS[i] }}
                    />
                    {deviceIcons[d.device]}
                    {d.device} {d.percentage}%
                  </div>
                ))}
              </div>
            </Card>

            <Card title="New vs Returning">
              <div className="h-48">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={visitorPieData}
                      cx="50%"
                      cy="50%"
                      innerRadius={45}
                      outerRadius={70}
                      dataKey="value"
                      nameKey="name"
                      strokeWidth={0}
                    >
                      {visitorPieData.map((_, i) => (
                        <Cell key={i} fill={VISITOR_COLORS[i % VISITOR_COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#1e293b",
                        border: "1px solid #334155",
                        borderRadius: 8,
                        color: "#f1f5f9",
                        fontSize: 12,
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="flex justify-center gap-4">
                {visitorPieData.map((d, i) => (
                  <div key={d.name} className="flex items-center gap-1.5 text-xs text-slate-400">
                    <span
                      className="inline-block h-2.5 w-2.5 rounded-full"
                      style={{ backgroundColor: VISITOR_COLORS[i] }}
                    />
                    {d.name}: {formatNumber(d.value)}
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </div>

        {/* ── Tables grid ──────────────────────────────────────── */}
        <div className="mb-6 grid gap-6 lg:grid-cols-2">
          {/* Top Pages */}
          <Card title="Top Pages">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-700 text-left text-xs text-slate-500">
                    <th className="pb-2 font-medium">Page</th>
                    <th className="pb-2 text-right font-medium">Views</th>
                    <th className="pb-2 text-right font-medium">Unique</th>
                  </tr>
                </thead>
                <tbody>
                  {pages.map((p) => (
                    <tr key={p.page} className="border-b border-slate-800/50">
                      <td className="py-2.5">
                        <div className="font-medium text-slate-200">{p.title}</div>
                        <div className="text-xs text-slate-500">{p.page}</div>
                      </td>
                      <td className="py-2.5 text-right text-slate-300">{p.views}</td>
                      <td className="py-2.5 text-right text-slate-400">{p.uniqueViews}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>

          {/* CTA Clicks */}
          <Card title="CTA Clicks">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-700 text-left text-xs text-slate-500">
                    <th className="pb-2 font-medium">Element</th>
                    <th className="pb-2 font-medium">Label</th>
                    <th className="pb-2 text-right font-medium">Clicks</th>
                  </tr>
                </thead>
                <tbody>
                  {clicks.map((c, i) => (
                    <tr key={i} className="border-b border-slate-800/50">
                      <td className="py-2.5 text-slate-400">{c.element}</td>
                      <td className="py-2.5 text-slate-200">{c.label}</td>
                      <td className="py-2.5 text-right font-medium text-teal-400">{c.clicks}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>

          {/* Top Referrers */}
          <Card title="Top Referrers">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-700 text-left text-xs text-slate-500">
                    <th className="pb-2 font-medium">Source</th>
                    <th className="pb-2 text-right font-medium">Visitors</th>
                    <th className="pb-2 text-right font-medium">Share</th>
                  </tr>
                </thead>
                <tbody>
                  {sources.map((s) => (
                    <tr key={s.source} className="border-b border-slate-800/50">
                      <td className="py-2.5 text-slate-200">{s.source}</td>
                      <td className="py-2.5 text-right text-slate-300">{s.visitors}</td>
                      <td className="py-2.5 text-right text-slate-400">{s.percentage}%</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>

          {/* Intake Funnel */}
          <Card title="Intake Funnel">
            <div className="space-y-3 py-2">
              {funnel.map((step, i) => {
                const width = step.percentage;
                const isLast = i === funnel.length - 1;
                return (
                  <div key={step.step}>
                    <div className="mb-1 flex items-center justify-between text-sm">
                      <span className="text-slate-300">{step.step}</span>
                      <span className="font-medium text-slate-200">
                        {formatNumber(step.count)}
                        <span className="ml-1 text-xs text-slate-500">({step.percentage}%)</span>
                      </span>
                    </div>
                    <div className="h-8 overflow-hidden rounded-lg bg-slate-800">
                      <div
                        className="flex h-full items-center justify-end rounded-lg px-3 text-xs font-medium text-white transition-all duration-700"
                        style={{
                          width: `${Math.max(width, 8)}%`,
                          backgroundColor: isLast ? TEAL : i === 0 ? "#475569" : "#3b82f6",
                        }}
                      >
                        {step.percentage}%
                      </div>
                    </div>
                    {i < funnel.length - 1 && (
                      <div className="flex justify-center py-1">
                        <ArrowDownUp className="h-3 w-3 text-slate-600" />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
            {funnel.length >= 3 && (
              <div className="mt-3 rounded-lg bg-teal-500/10 px-3 py-2 text-center text-sm">
                <span className="text-teal-400">Overall Conversion: </span>
                <span className="font-semibold text-teal-300">
                  {((funnel[funnel.length - 1].count / funnel[0].count) * 100).toFixed(1)}%
                </span>
              </div>
            )}
          </Card>
        </div>

        {/* ── Site Backups & Admin ──────────────────────────────── */}
        <Card title="Site Backups & Data Export">
          <p className="mb-4 text-sm text-slate-400">
            Full backups of the previous PHP site (CodeIgniter + MySQL). Download for safekeeping or data migration.
          </p>
          <div className="space-y-3">
            {[
              { id: 'db-full', icon: <Database className="h-4 w-4" />, name: 'Database Backup (Full SQL)', desc: '111 tables — all content, doctors, pages, analytics', size: '1.4 MB' },
              { id: 'content-extract', icon: <FileText className="h-4 w-4" />, name: 'Content Extraction (Markdown)', desc: 'Human-readable export — doctors, procedures, testimonials, locations', size: '15 KB' },
              { id: 'data-json', icon: <Database className="h-4 w-4" />, name: 'Raw Data Export (JSON)', desc: 'Full database tables as JSON objects', size: '279 KB' },
            ].map((backup) => (
              <div key={backup.id} className="flex items-center justify-between rounded-lg border border-slate-700 bg-slate-800/50 p-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-teal-500/10 text-teal-400">
                    {backup.icon}
                  </div>
                  <div>
                    <div className="text-sm font-medium text-slate-200">{backup.name}</div>
                    <div className="text-xs text-slate-500">{backup.desc}</div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-xs text-slate-500">{backup.size}</span>
                  <button
                    onClick={() => {
                      const a = document.createElement('a');
                      a.href = `/api/admin/backup?type=download&file=${backup.id}`;
                      a.download = '';
                      a.click();
                    }}
                    className="flex items-center gap-1.5 rounded-lg bg-teal-500/10 px-3 py-2 text-xs font-medium text-teal-400 transition-colors hover:bg-teal-500/20"
                  >
                    <Download className="h-3.5 w-3.5" />
                    Download
                  </button>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* ── Footer ───────────────────────────────────────────── */}
        <div className="pb-6 text-center text-xs text-slate-600">
          Last refreshed: {lastRefresh.toLocaleTimeString()} | Auto-refresh: 30s
        </div>
      </div>
    </div>
  );
}

// ── Sub-components ─────────────────────────────────────────────────────────

function StatCard({
  label,
  value,
  icon,
  accent,
  pulse,
}: {
  label: string;
  value: string | number;
  icon: React.ReactNode;
  accent?: string;
  pulse?: boolean;
}) {
  const isGreen = accent === "green";
  return (
    <div className="rounded-xl border border-slate-800 bg-slate-800/50 p-4 transition-colors hover:border-slate-700">
      <div className="mb-2 flex items-center gap-2 text-xs text-slate-400">
        {icon}
        {label}
        {pulse && (
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75" />
            <span className="inline-flex h-2 w-2 rounded-full bg-green-500" />
          </span>
        )}
      </div>
      <div className={`text-2xl font-bold ${isGreen ? "text-green-400" : "text-white"}`}>
        {value}
      </div>
    </div>
  );
}

function Card({
  title,
  children,
  className = "",
}: {
  title: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`rounded-xl border border-slate-800 bg-slate-800/30 p-5 transition-colors hover:border-slate-700 ${className}`}
    >
      <h3 className="mb-4 text-sm font-medium text-slate-300">{title}</h3>
      {children}
    </div>
  );
}
