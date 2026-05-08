import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const GOOGLE_MAPS_API_KEY = Deno.env.get("GOOGLE_MAPS_API_KEY");
    if (!GOOGLE_MAPS_API_KEY) {
      throw new Error("GOOGLE_MAPS_API_KEY is not configured");
    }

    const SUPABASE_URL = Deno.env.get("SUPABASE_URL");
    const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
    if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
      throw new Error("Supabase environment variables not configured");
    }

    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

    // Step 1: Find the Place ID dynamically via Text Search
    const searchRes = await fetch("https://places.googleapis.com/v1/places:searchText", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Goog-Api-Key": GOOGLE_MAPS_API_KEY,
        "X-Goog-FieldMask": "places.id,places.displayName",
      },
      body: JSON.stringify({ textQuery: "Riory riolering Bilzen" }),
    });

    if (!searchRes.ok) {
      const errText = await searchRes.text();
      throw new Error(`Text Search API error [${searchRes.status}]: ${errText}`);
    }

    const searchData = await searchRes.json();
    const placeId = searchData.places?.[0]?.id;
    if (!placeId) {
      throw new Error("Could not find Place ID for Riory via Text Search");
    }

    console.log("Found Place ID:", placeId, "Name:", searchData.places[0]?.displayName?.text);

    // Step 2: Fetch reviews from Google Places API
    const url = `https://places.googleapis.com/v1/places/${placeId}?fields=reviews,rating,userRatingCount&languageCode=nl`;
    
    const response = await fetch(url, {
      headers: {
        "X-Goog-Api-Key": GOOGLE_MAPS_API_KEY,
        "X-Goog-FieldMask": "reviews,rating,userRatingCount",
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Google Places API error [${response.status}]: ${errorText}`);
    }

    const data = await response.json();
    const reviews = data.reviews || [];
    
    let upsertedCount = 0;

    for (const review of reviews) {
      const reviewData = {
        reviewer_name: review.authorAttribution?.displayName || "Anoniem",
        rating: review.rating || 5,
        review_text: review.text?.text || "",
        review_date: review.relativePublishTimeDescription || "",
        source: "api",
        google_review_id: review.name || null,
        updated_at: new Date().toISOString(),
      };

      const { error } = await supabase
        .from("google_reviews")
        .upsert(reviewData, { onConflict: "google_review_id" });

      if (!error) upsertedCount++;
    }

    // Update the total rating info (store as a simple review entry or log)
    const result = {
      success: true,
      reviews_processed: reviews.length,
      reviews_upserted: upsertedCount,
      overall_rating: data.rating,
      total_reviews: data.userRatingCount,
    };

    console.log("Fetch Google Reviews result:", result);

    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    console.error("Error fetching Google reviews:", error);
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500,
      }
    );
  }
});
