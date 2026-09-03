import { NextResponse } from "next/server";
import { getAllStates } from "@/lib/locations";

export async function GET() {
  const states = getAllStates();
  return NextResponse.json({ states });
}
