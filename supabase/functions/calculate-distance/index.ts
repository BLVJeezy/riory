import { corsHeaders } from "@supabase/supabase-js/cors";

const RIORY_ADDRESS = "Tongersesteenweg 19, 3740 Bilzen, België";
const RATE_PER_KM = 1.45;

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const { straat, huisnummer, postcode, plaats, land } = await req.json();

    if (!straat || !huisnummer || !postcode || !plaats) {
      return new Response(
        JSON.stringify({ error: "Adres is onvolledig" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const destination = `${straat} ${huisnummer}, ${postcode} ${plaats}, ${land || "België"}`;
    const apiKey = Deno.env.get("GOOGLE_MAPS_API_KEY");

    if (!apiKey) {
      return new Response(
        JSON.stringify({ error: "Google Maps API key niet geconfigureerd" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const url = new URL("https://maps.googleapis.com/maps/api/distancematrix/json");
    url.searchParams.set("origins", RIORY_ADDRESS);
    url.searchParams.set("destinations", destination);
    url.searchParams.set("key", apiKey);
    url.searchParams.set("units", "metric");
    url.searchParams.set("language", "nl");

    const response = await fetch(url.toString());
    const data = await response.json();
    console.log("Google Maps response:", JSON.stringify(data));

    if (
      data.status !== "OK" ||
      !data.rows?.[0]?.elements?.[0] ||
      data.rows[0].elements[0].status !== "OK"
    ) {
      return new Response(
        JSON.stringify({
          error: "Kon afstand niet berekenen",
          details: data.rows?.[0]?.elements?.[0]?.status || data.status,
          error_message: data.error_message || null,
          full_response: data,
        }),
        { status: 422, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const element = data.rows[0].elements[0];
    const distanceMeters = element.distance.value;
    const distanceKm = Math.round(distanceMeters / 1000);
    const roundTripKm = distanceKm * 2;
    const travelCost = Math.round(roundTripKm * RATE_PER_KM * 100) / 100;
    const durationMinutes = Math.round(element.duration.value / 60);

    return new Response(
      JSON.stringify({
        distance_km: distanceKm,
        round_trip_km: roundTripKm,
        travel_cost: travelCost,
        duration_minutes: durationMinutes,
        origin: data.origin_addresses?.[0] || RIORY_ADDRESS,
        destination: data.destination_addresses?.[0] || destination,
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (err) {
    return new Response(
      JSON.stringify({ error: "Interne fout", details: String(err) }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
