import { NextRequest, NextResponse } from "next/server";
import { getCorsHeaders, corsPreflightResponse } from "@/lib/api-utils";

export async function OPTIONS(request: NextRequest) {
  return corsPreflightResponse(request);
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const {
      visitor_id,
      session_id,
      event,
      page_url,
      referrer,
      device_type,
      browser,
      os,
      utm_source,
      utm_medium,
      utm_campaign,
      scroll_depth,
      time_on_page,
      click_type,
      click_label,
    } = body;

    // Log for now — wire up DB later
    console.log("[analytics:track]", {
      timestamp: new Date().toISOString(),
      visitor_id,
      session_id,
      event,
      page_url,
      referrer,
      device_type,
      browser,
      os,
      utm_source,
      utm_medium,
      utm_campaign,
      scroll_depth,
      time_on_page,
      click_type,
      click_label,
    });

    return NextResponse.json({ success: true }, { headers: getCorsHeaders(request) });
  } catch {
    return NextResponse.json({ success: false, error: "Invalid payload" }, { status: 400 });
  }
}
