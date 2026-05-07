import * as React from 'npm:react@18.3.1'
import {
  Body, Container, Head, Html, Preview, Text,
} from 'npm:@react-email/components@0.0.22'
import type { TemplateEntry } from './registry.ts'

interface Props {
  httpStatus?: number | string
  latencyMs?: number
  recoveredAt?: string
  note?: string
}

const SimplaHealthRecoveryEmail = (p: Props) => (
  <Html lang="nl" dir="ltr">
    <Head />
    <Preview>✅ Simpla callback URL is hersteld</Preview>
    <Body style={main}>
      <Container style={container}>
        <Text style={titleStyle}>✅ Simpla callback URL is hersteld</Text>

        <Text style={block}>
          De Simpla callback URL is opnieuw bereikbaar en de health check
          komt weer succesvol door.
        </Text>

        <Text style={label}>Details laatste check</Text>
        <Text style={block}>
          <strong>HTTP status:</strong> {p.httpStatus ?? 200}<br />
          <strong>Latency:</strong> {p.latencyMs ?? '?'} ms<br />
          {p.recoveredAt && <><strong>Hersteld op:</strong> {p.recoveredAt}<br /></>}
        </Text>

        {p.note && <Text style={block}>{p.note}</Text>}

        <Text style={block}>
          Endpoint: <code>https://app-02.simpla.be/callback.aspx?key=rioryV2</code>
        </Text>

        <Text style={footer}>
          -- Automatische herstel-bevestiging van het Riory health check systeem.
        </Text>
      </Container>
    </Body>
  </Html>
)

export const template = {
  component: SimplaHealthRecoveryEmail,
  subject: '✅ Simpla callback URL is hersteld',
  to: 'jasonbalongo@gmail.com',
  displayName: 'Simpla health recovery',
  previewData: {
    httpStatus: 200,
    latencyMs: 141,
    recoveredAt: '2026-05-07 21:45:00',
  },
} satisfies TemplateEntry

const main = { backgroundColor: '#ffffff', fontFamily: 'Arial, sans-serif' }
const container = { padding: '20px 24px', maxWidth: '600px' }
const titleStyle = { fontSize: '18px', color: '#15803d', fontWeight: 'bold' as const, margin: '0 0 16px' }
const label = { fontSize: '12px', color: '#666', textTransform: 'uppercase' as const, letterSpacing: '0.5px', margin: '20px 0 6px' }
const block = { fontSize: '14px', color: '#333', lineHeight: '1.6', margin: '0 0 12px' }
const footer = { fontSize: '12px', color: '#999', margin: '24px 0 0' }
