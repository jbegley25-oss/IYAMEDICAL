import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "@/lib/analytics-auth";

// ── Mock data generators ───────────────────────────────────────────────────

function mockOverview(range: string) {
  const multiplier = range === "today" ? 1 : range === "7d" ? 7 : range === "30d" ? 30 : 90;
  const base = { visitors: 47, pageViews: 132, sessions: 58, avgTime: 185, bounceRate: 34.2 };
  return {
    liveVisitors: Math.floor(Math.random() * 5) + 1,
    visitors: base.visitors * multiplier + Math.floor(Math.random() * 20),
    pageViews: base.pageViews * multiplier + Math.floor(Math.random() * 50),
    sessions: base.sessions * multiplier + Math.floor(Math.random() * 30),
    avgTime: base.avgTime + Math.floor(Math.random() * 40) - 20,
    bounceRate: +(base.bounceRate + (Math.random() * 6 - 3)).toFixed(1),
    newVisitors: Math.floor(base.visitors * multiplier * 0.62),
    returningVisitors: Math.floor(base.visitors * multiplier * 0.38),
  };
}

function mockTimeline(range: string) {
  const hours = range === "today" ? 24 : 48;
  const now = new Date();
  const points = [];
  for (let i = hours; i >= 0; i--) {
    const t = new Date(now.getTime() - i * 3600000);
    const hour = t.getHours();
    // Realistic traffic curve: low at night, peaks at 10am and 2pm
    const curve = Math.max(0, Math.sin((hour - 6) * Math.PI / 12)) * 8 + 1;
    const visitors = Math.floor(curve + Math.random() * 4);
    const views = visitors + Math.floor(Math.random() * visitors * 0.8);
    points.push({
      time: t.toISOString(),
      hour: `${hour.toString().padStart(2, "0")}:00`,
      visitors,
      pageViews: views,
    });
  }
  return points;
}

function mockPages() {
  return [
    { page: "/", title: "Home", views: 487, uniqueViews: 312 },
    { page: "/services/uterine-fibroid-embolization", title: "UFE", views: 156, uniqueViews: 123 },
    { page: "/services/prostate-artery-embolization", title: "PAE", views: 134, uniqueViews: 98 },
    { page: "/intake", title: "Patient Intake", views: 112, uniqueViews: 89 },
    { page: "/services/peripheral-arterial-disease", title: "PAD", views: 97, uniqueViews: 71 },
    { page: "/about", title: "About Us", views: 89, uniqueViews: 64 },
    { page: "/services/varicose-vein-treatment", title: "Varicose Veins", views: 78, uniqueViews: 56 },
    { page: "/locations", title: "Locations", views: 67, uniqueViews: 52 },
    { page: "/contact", title: "Contact", views: 45, uniqueViews: 38 },
    { page: "/services/kyphoplasty", title: "Kyphoplasty", views: 34, uniqueViews: 28 },
  ];
}

function mockSources() {
  return [
    { source: "Google Organic", visitors: 245, percentage: 41.2 },
    { source: "Direct", visitors: 148, percentage: 24.9 },
    { source: "Facebook", visitors: 72, percentage: 12.1 },
    { source: "Google Ads", visitors: 56, percentage: 9.4 },
    { source: "Instagram", visitors: 34, percentage: 5.7 },
    { source: "Yelp", visitors: 21, percentage: 3.5 },
    { source: "Healthgrades", visitors: 12, percentage: 2.0 },
    { source: "Other", visitors: 7, percentage: 1.2 },
  ];
}

function mockDevices() {
  return [
    { device: "Mobile", visitors: 312, percentage: 52.4 },
    { device: "Desktop", visitors: 234, percentage: 39.3 },
    { device: "Tablet", visitors: 49, percentage: 8.3 },
  ];
}

function mockFunnel() {
  return [
    { step: "Page Visitors", count: 595, percentage: 100 },
    { step: "Started Intake", count: 112, percentage: 18.8 },
    { step: "Completed Intake", count: 47, percentage: 7.9 },
  ];
}

function mockClicks() {
  return [
    { element: "CTA Button", label: "Schedule Consultation", clicks: 89 },
    { element: "CTA Button", label: "Call Now", clicks: 67 },
    { element: "Phone Link", label: "(480) 750-8694", clicks: 54 },
    { element: "Nav Link", label: "Services Dropdown", clicks: 43 },
    { element: "CTA Button", label: "Start Intake Form", clicks: 38 },
    { element: "CTA Button", label: "Get Directions", clicks: 27 },
    { element: "Footer Link", label: "Patient Portal", clicks: 19 },
    { element: "CTA Button", label: "Learn More - UFE", clicks: 16 },
  ];
}

function mockSubmissions() {
  return [
    { date: "2026-03-30", name: "J. Smith", form: "Intake", status: "complete", page: "/intake" },
    { date: "2026-03-29", name: "M. Johnson", form: "Intake", status: "complete", page: "/intake" },
    { date: "2026-03-29", name: "R. Davis", form: "Contact", status: "complete", page: "/contact" },
    { date: "2026-03-28", name: "L. Martinez", form: "Intake", status: "partial", page: "/intake" },
    { date: "2026-03-28", name: "K. Williams", form: "Intake", status: "complete", page: "/intake" },
  ];
}

// ── GET handler ────────────────────────────────────────────────────────────

export async function GET(request: NextRequest) {
  const auth = request.headers.get("Authorization");
  const token = auth?.replace("Bearer ", "");

  if (!token || !verifyToken(token)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const metric = searchParams.get("metric") || "overview";
  const range = searchParams.get("range") || "7d";

  const dataMap: Record<string, () => unknown> = {
    overview: () => mockOverview(range),
    pages: mockPages,
    sources: mockSources,
    devices: mockDevices,
    timeline: () => mockTimeline(range),
    funnel: mockFunnel,
    clicks: mockClicks,
    submissions: mockSubmissions,
  };

  const generator = dataMap[metric];
  if (!generator) {
    return NextResponse.json({ error: "Unknown metric" }, { status: 400 });
  }

  return NextResponse.json({ data: generator(), range, metric });
}
