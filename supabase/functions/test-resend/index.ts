import { corsHeaders } from 'npm:@supabase/supabase-js@2/cors'

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders })

  const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY')
  if (!RESEND_API_KEY) {
    return new Response(JSON.stringify({ error: 'RESEND_API_KEY missing' }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }

  let to = 'jasonbalongo@gmail.com'
  try {
    const body = await req.json().catch(() => ({}))
    if (body?.to) to = body.to
  } catch (_) {}

  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${RESEND_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: 'RIORY <onboarding@resend.dev>',
      to: [to],
      subject: 'Testmail van RIORY via Resend',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 560px; margin: 0 auto; padding: 24px;">
          <h1 style="color: #0f172a;">Hallo vanuit RIORY 👋</h1>
          <p style="color: #334155; line-height: 1.6;">
            Dit is een test-email verzonden via <strong>Resend</strong> vanuit jouw RIORY project.
          </p>
          <p style="color: #334155;">Als je dit ziet, werkt de Resend integratie correct.</p>
          <hr style="border:none;border-top:1px solid #e2e8f0;margin:24px 0;" />
          <p style="color:#64748b;font-size:12px;">RIORY BV — Sterk in Rioleringswerk</p>
        </div>
      `,
    }),
  })

  const data = await res.json()
  return new Response(JSON.stringify({ status: res.status, data }), {
    status: res.ok ? 200 : 500,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  })
})
