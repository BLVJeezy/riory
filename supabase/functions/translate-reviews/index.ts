import { corsHeaders } from "https://esm.sh/@supabase/supabase-js@2.95.0/cors";

interface ReviewIn {
  id: string;
  text: string;
}

const LANG_NAMES: Record<string, string> = {
  en: "English",
  fr: "French",
  nl: "Dutch",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const { reviews, target } = (await req.json()) as {
      reviews: ReviewIn[];
      target: string;
    };

    if (!Array.isArray(reviews) || !target || !LANG_NAMES[target]) {
      return new Response(JSON.stringify({ error: "Invalid input" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (target === "nl" || reviews.length === 0) {
      return new Response(
        JSON.stringify({
          translations: reviews.map((r) => ({ id: r.id, text: r.text })),
        }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY not configured");

    const langName = LANG_NAMES[target];
    const numbered = reviews
      .map((r, i) => `${i + 1}. ${r.text.replace(/\n/g, " ")}`)
      .join("\n");

    const response = await fetch(
      "https://ai.gateway.lovable.dev/v1/chat/completions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${LOVABLE_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "google/gemini-3-flash-preview",
          messages: [
            {
              role: "system",
              content: `You translate customer reviews from Dutch to ${langName}. Keep tone natural and faithful. Do not add commentary.`,
            },
            { role: "user", content: numbered },
          ],
          tools: [
            {
              type: "function",
              function: {
                name: "return_translations",
                description: "Return the translated reviews in order.",
                parameters: {
                  type: "object",
                  properties: {
                    translations: {
                      type: "array",
                      items: {
                        type: "object",
                        properties: {
                          index: { type: "number" },
                          text: { type: "string" },
                        },
                        required: ["index", "text"],
                        additionalProperties: false,
                      },
                    },
                  },
                  required: ["translations"],
                  additionalProperties: false,
                },
              },
            },
          ],
          tool_choice: {
            type: "function",
            function: { name: "return_translations" },
          },
        }),
      }
    );

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Rate limit exceeded" }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "AI credits exhausted" }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      const errText = await response.text();
      console.error("AI gateway error", response.status, errText);
      return new Response(JSON.stringify({ error: "AI gateway error" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const data = await response.json();
    const toolCall = data.choices?.[0]?.message?.tool_calls?.[0];
    const args = toolCall?.function?.arguments
      ? JSON.parse(toolCall.function.arguments)
      : { translations: [] };

    const result = reviews.map((r, i) => {
      const match = (args.translations as Array<{ index: number; text: string }>).find(
        (t) => t.index === i + 1
      );
      return { id: r.id, text: match?.text ?? r.text };
    });

    return new Response(JSON.stringify({ translations: result }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("translate-reviews error", e);
    return new Response(
      JSON.stringify({ error: e instanceof Error ? e.message : "Unknown" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
