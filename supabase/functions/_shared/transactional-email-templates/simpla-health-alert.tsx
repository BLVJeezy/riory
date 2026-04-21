import * as React from 'npm:react@18.3.1'
import {
  Body, Container, Head, Html, Preview, Text,
} from 'npm:@react-email/components@0.0.22'
import type { TemplateEntry } from './registry.ts'

interface Props {
  alertType?: 'incident' | 'reminder'
  consecutiveFailures?: number
  errorMessage?: string
  httpStatus?: number | string
  latencyMs?: number
  attempts?: number
  firstFailedAt?: string
  lastCheckedAt?: string
}

const SimplaHealthAlertEmail = (p: Props) => {
  const isReminder = p.alertType === 'reminder'
  const title = isReminder
    ? '⚠️ Simpla outage duurt voort (24u herinnering)'
    : '🚨 Simpla callback URL faalt'

  return (
    <Html lang="nl" dir="ltr">
      <Head />
      <Preview>{title}</Preview>
      <Body style={main}>
        <Container style={container}>
          <Text style={titleStyle}>{title}</Text>

          <Text style={block}>
            De automatische health check naar de Simpla callback URL faalt
            {p.consecutiveFailures ? ` al ${p.consecutiveFailures} opeenvolgende keren` : ''}.
            {isReminder && ' Het incident is nog niet hersteld.'}
          </Text>

          <Text style={label}>Details laatste check</Text>
          <Text style={block}>
            <strong>Foutmelding:</strong> {p.errorMessage || 'onbekend'}<br />
            <strong>HTTP status:</strong> {p.httpStatus ?? 'geen respons'}<br />
            <strong>Pogingen (retries):</strong> {p.attempts ?? '?'}<br />
            <strong>Latency:</strong> {p.latencyMs ?? '?'} ms<br />
            {p.firstFailedAt && <><strong>Eerste fout:</strong> {p.firstFailedAt}<br /></>}
            {p.lastCheckedAt && <><strong>Laatste check:</strong> {p.lastCheckedAt}<br /></>}
          </Text>

          <Text style={block}>
            Endpoint: <code>http://app-02.simpla.be/callback.aspx?key=rioryV2</code>
          </Text>

          <Text style={footer}>
            -- Automatische waarschuwing van het Riory health check systeem.
            Een herstel-bevestiging volgt zodra de URL weer bereikbaar is.
          </Text>
        </Container>
      </Body>
    </Html>
  )
}

export const template = {
  component: SimplaHealthAlertEmail,
  subject: (d: Record<string, any>) =>
    d?.alertType === 'reminder'
      ? '⚠️ Simpla outage duurt voort (24u herinnering)'
      : '🚨 Simpla callback URL faalt — actie vereist',
  to: 'jasonbalongo@gmail.com',
  displayName: 'Simpla health alert',
  previewData: {
    alertType: 'incident',
    consecutiveFailures: 3,
    errorMessage: 'Timeout after 10000ms (after 3 attempts)',
    httpStatus: 'geen respons',
    latencyMs: 30421,
    attempts: 3,
    firstFailedAt: '2026-04-21 14:30:00',
    lastCheckedAt: '2026-04-21 15:00:00',
  },
} satisfies TemplateEntry

const main = { backgroundColor: '#ffffff', fontFamily: 'Arial, sans-serif' }
const container = { padding: '20px 24px', maxWidth: '600px' }
const titleStyle = { fontSize: '18px', color: '#b91c1c', fontWeight: 'bold' as const, margin: '0 0 16px' }
const label = { fontSize: '12px', color: '#666', textTransform: 'uppercase' as const, letterSpacing: '0.5px', margin: '20px 0 6px' }
const block = { fontSize: '14px', color: '#333', lineHeight: '1.6', margin: '0 0 12px' }
const footer = { fontSize: '12px', color: '#999', margin: '24px 0 0' }
