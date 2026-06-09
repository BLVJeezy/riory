import { createClient } from 'npm:@supabase/supabase-js@2'
import { corsHeaders } from 'npm:@supabase/supabase-js@2/cors'

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders })

  try {
    const body = await req.json()
    const { voornaam, achternaam, email, telefoon, bericht, cvPath, cvNaam } = body || {}

    if (!voornaam || !achternaam || !email) {
      return new Response(JSON.stringify({ error: 'voornaam, achternaam en email zijn verplicht' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
    )

    let cvUrl: string | undefined
    if (cvPath) {
      const { data, error } = await supabase.storage
        .from('quote-attachments')
        .createSignedUrl(cvPath, 60 * 60 * 24 * 30) // 30 dagen
      if (error) console.error('signed url error', error)
      cvUrl = data?.signedUrl
    }

    const idempotencyKey = `sollicitatie-${email}-${Date.now()}`

    const { error: mailErr } = await supabase.functions.invoke('send-transactional-email', {
      body: {
        templateName: 'sollicitatie-notification',
        recipientEmail: 'info@riory.be',
        idempotencyKey,
        templateData: { voornaam, achternaam, email, telefoon, bericht, cvUrl, cvNaam },
      },
    })

    if (mailErr) {
      console.error('mail error', mailErr)
      return new Response(JSON.stringify({ error: 'Verzenden mislukt' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    return new Response(JSON.stringify({ ok: true }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  } catch (e) {
    console.error(e)
    return new Response(JSON.stringify({ error: String(e) }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }
})
