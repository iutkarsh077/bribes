import { NextRequest, NextResponse } from "next/server";
import { findBestMatchingState, findBestMatchingDistrict } from "@/lib/locations";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const lat = searchParams.get("lat");
    const lon = searchParams.get("lon");

    if (!lat || !lon) {
      return NextResponse.json(
        { error: "Latitude and longitude are required" },
        { status: 400 }
      );
    }

    const locationApiUrl = process.env.LOCATION_API_URL;

    if (!locationApiUrl) {
      throw new Error("LOCATION_API_URL is missing");
    }

    const nominatimUrl = `${locationApiUrl}?format=jsonv2&lat=${encodeURIComponent(
      lat
    )}&lon=${encodeURIComponent(lon)}&addressdetails=1`;

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 6000);

    const response = await fetch(nominatimUrl, {
      headers: {
        "User-Agent": "BribeReportingCivicApp/1.0 (civic-transparency-initiative)",
        "Accept-Language": "en",
      },
      signal: controller.signal,
    });
    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error(`Nominatim responded with ${response.status}`);
    }

    const data = await response.json();
    const address = data.address || {};

    const rawState = address.state || address.province || address.state_district || "";
    const matchedState = findBestMatchingState(rawState);

    const rawDistrict =
      address.state_district ||
      address.county ||
      address.city_district ||
      address.city ||
      address.town ||
      "";

    const matchedDistrict = matchedState ? findBestMatchingDistrict(matchedState, rawDistrict) : null;

    const area =
      address.suburb ||
      address.neighbourhood ||
      address.residential ||
      address.road ||
      address.village ||
      address.hamlet ||
      rawDistrict ||
      "";

    return NextResponse.json({
      success: true,
      state: matchedState || rawState || "",
      district: matchedDistrict || rawDistrict || "",
      area: area.trim(),
      raw: address,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    console.warn("Reverse geocode failed or timed out:", message);
    return NextResponse.json(
      {
        success: false,
        error: "Unable to detect precise location from coordinates",
      },
      { status: 200 } // return 200 with success: false so client can prompt manual entry without crashing
    );
  }
}
