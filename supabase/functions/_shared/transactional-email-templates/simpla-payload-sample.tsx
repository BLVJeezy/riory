import * as React from 'npm:react@18.3.1'
import { Body, Container, Head, Html, Preview, Text } from 'npm:@react-email/components@0.0.22'
import type { TemplateEntry } from './registry.ts'

interface Props {
  endpoint?: string
  payload?: Record<string, unknown>
}

const SimplaPayloadSampleEmail = (p: Props) => {
  const json = JSON.stringify(p.payload ?? {}, null, 2)
  return (
    <Html lang="nl" dir="ltr">
      <Head />
      <Preview>Voorbeeld Simpla payload</Preview>
      <Body style={main}>
        <Container style={container}>
          <Text style={title}>Voorbeeld payload naar Simpla</Text>
          <Text style={block}>
            Dit is een voorbeeld van de exacte JSON die via <code>POST</code> naar de Simpla callback URL wordt gestuurd
            wanneer een afspraak wordt aangemaakt.
          </Text>
          <Text style={label}>Endpoint</Text>
          <Text style={code}>{p.endpoint || 'http://app-02.simpla.be/callback.aspx?key=rioryV2'}</Text>
          <Text style={label}>Body (JSON)</Text>
          <pre style={pre}>{json}</pre>
          <Text style={footer}>
            Velden met waarde <code>undefined</code> worden niet meegestuurd. Telefoonnummers die enkel uit een
            landcode (bv. <code>+32</code>) bestaan worden als leeg beschouwd en weggelaten.
          </Text>
        </Container>
      </Body>
    </Html>
  )
}

export const template = {
  component: SimplaPayloadSampleEmail,
  subject: 'Voorbeeld Simpla payload — Riory afspraakformulier',
  to: 'jasonbalongo@gmail.com',
  displayName: 'Simpla payload sample',
  previewData: { endpoint: 'http://app-02.simpla.be/callback.aspx?key=rioryV2', payload: {} },
} satisfies TemplateEntry

const main = { backgroundColor: '#ffffff', fontFamily: 'Arial, sans-serif' }
const container = { padding: '20px 24px', maxWidth: '680px' }
const title = { fontSize: '18px', fontWeight: 'bold' as const, margin: '0 0 16px', color: '#111' }
const label = { fontSize: '12px', color: '#666', textTransform: 'uppercase' as const, letterSpacing: '0.5px', margin: '20px 0 6px' }
const block = { fontSize: '14px', color: '#333', lineHeight: '1.6', margin: '0 0 12px' }
const code = { fontSize: '13px', color: '#0f172a', backgroundColor: '#f1f5f9', padding: '8px 10px', borderRadius: '4px', fontFamily: 'monospace' }
const pre = { fontSize: '12px', color: '#0f172a', backgroundColor: '#f1f5f9', padding: '12px', borderRadius: '6px', fontFamily: 'monospace', whiteSpace: 'pre-wrap' as const, overflowX: 'auto' as const }
const footer = { fontSize: '12px', color: '#999', margin: '24px 0 0' }
