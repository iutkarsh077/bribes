import { NextRequest, NextResponse } from "next/server";
import { getDistrictsForState } from "@/lib/locations";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const state = searchParams.get("state");

  if (!state) {
    return NextResponse.json(
      { error: "State parameter is required" },
      { status: 400 }
    );
  }

  const districts = getDistrictsForState(state);
  return NextResponse.json({ state, districts });
}
