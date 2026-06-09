import * as React from 'npm:react@18.3.1'
import { renderAsync } from 'npm:@react-email/components@0.0.22'
import { corsHeaders } from 'npm:@supabase/supabase-js@2/cors'
import { TEMPLATES } from '../_shared/transactional-email-templates/registry.ts'

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders })

  const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY')
  if (!RESEND_API_KEY) {
    return new Response(JSON.stringify({ error: 'RESEND_API_KEY missing' }), {
      status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }

  let body: any = {}
  try { body = await req.json() } catch (_) {}

  const templateName: string = body.templateName || 'afspraak-confirmation'
  const to: string = body.to || 'jasonbalongo@gmail.com'
  const templateData = body.templateData || { voornaam: 'Jason', dienst: 'Camera inspectie riool', urgent: false }

  const template = TEMPLATES[templateName]
  if (!template) {
    return new Response(JSON.stringify({
      error: `Template '${templateName}' not found`,
      available: Object.keys(TEMPLATES),
    }), { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } })
  }

  const html = await renderAsync(React.createElement(template.component, templateData))
  const text = await renderAsync(React.createElement(template.component, templateData), { plainText: true })
  const subject = typeof template.subject === 'function' ? template.subject(templateData) : template.subject

  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${RESEND_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: 'RIORY <noreply@riory.be>',
      reply_to: 'info@riory.be',
      to: [to],
      subject,
      html,
      text,
    }),
  })

  const data = await res.json()
  return new Response(JSON.stringify({ status: res.status, data }), {
    status: res.ok ? 200 : 500,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  })
})
