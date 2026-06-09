import * as React from 'npm:react@18.3.1'
import {
  Body, Container, Head, Html, Link, Preview, Text,
} from 'npm:@react-email/components@0.0.22'
import type { TemplateEntry } from './registry.ts'

interface Props {
  voornaam?: string
  achternaam?: string
  email?: string
  telefoon?: string
  bericht?: string
  cvUrl?: string
  cvNaam?: string
}

const SollicitatieNotificationEmail = (p: Props) => {
  const fullName = [p.voornaam, p.achternaam].filter(Boolean).join(' ')
  const lines: string[] = []
  if (fullName) lines.push(`Van: ${fullName}`)
  if (p.email) lines.push(p.email)
  if (p.telefoon) lines.push(p.telefoon)

  return (
    <Html lang="nl" dir="ltr">
      <Head />
      <Preview>{`Nieuwe sollicitatie${fullName ? ' • ' + fullName : ''}`}</Preview>
      <Body style={main}>
        <Container style={container}>
          <Text style={block}><strong>Nieuwe sollicitatie</strong></Text>

          <Text style={block}>
            {lines.map((line, i) => (
              <React.Fragment key={i}>{line}<br /></React.Fragment>
            ))}
          </Text>

          {p.bericht ? (
            <Text style={block}>
              <strong>Motivatie:</strong><br />
              {p.bericht}
            </Text>
          ) : null}

          {p.cvUrl ? (
            <Text style={block}>
              <strong>CV:</strong>{' '}
              <Link href={p.cvUrl}>{p.cvNaam || 'Download CV'}</Link>
            </Text>
          ) : (
            <Text style={block}>Geen CV bijgevoegd.</Text>
          )}

          <Text style={footer}>-- Verzonden vanuit het sollicitatieformulier op https://riory.be</Text>
        </Container>
      </Body>
    </Html>
  )
}

export const template = {
  component: SollicitatieNotificationEmail,
  subject: (d: Record<string, any>) => {
    const naam = [d.voornaam, d.achternaam].filter(Boolean).join(' ') || 'Onbekend'
    return `Nieuwe sollicitatie: ${naam}`
  },
  to: 'info@riory.be',
  displayName: 'Sollicitatie notificatie',
  previewData: {
    voornaam: 'Jan',
    achternaam: 'Janssen',
    email: 'jan@voorbeeld.be',
    telefoon: '0471234567',
    bericht: 'Ik zou graag bij Riory komen werken als techniekers.',
    cvUrl: 'https://example.com/cv.pdf',
    cvNaam: 'cv-jan-janssen.pdf',
  },
} satisfies TemplateEntry

const main = { backgroundColor: '#ffffff', fontFamily: 'Arial, sans-serif' }
const container = { padding: '12px 20px', maxWidth: '600px' }
const block = { fontSize: '14px', color: '#333', lineHeight: '1.6', margin: '0 0 16px' }
const footer = { fontSize: '12px', color: '#999', margin: '24px 0 0' }
