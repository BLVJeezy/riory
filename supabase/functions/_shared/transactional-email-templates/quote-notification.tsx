import * as React from 'npm:react@18.3.1'
import {
  Body, Container, Head, Html, Preview, Text,
} from 'npm:@react-email/components@0.0.22'
import type { TemplateEntry } from './registry.ts'

interface Props {
  naam?: string
  email?: string
  telefoon?: string
  locatie?: string
  dienst?: string
  beschrijving?: string
}

const QuoteNotificationEmail = (p: Props) => {
  const lines: string[] = []
  if (p.naam) lines.push(`Van: ${p.naam}`)
  if (p.email) lines.push(p.email)
  if (p.telefoon) lines.push(p.telefoon)
  if (p.locatie) lines.push(p.locatie)
  lines.push('')
  if (p.dienst) lines.push(p.dienst)
  if (p.beschrijving) lines.push(p.beschrijving)

  return (
    <Html lang="nl" dir="ltr">
      <Head />
      <Preview>Riory - Nieuwe offerte aanvraag</Preview>
      <Body style={main}>
        <Container style={container}>
          <Text style={block}>
            <strong>Offerte aanvraag</strong>
          </Text>

          <Text style={block}>
            {lines.map((line, i) =>
              line === '' ? <br key={i} /> : <React.Fragment key={i}>{line}<br /></React.Fragment>
            )}
          </Text>

          <Text style={footer}>-- Deze e-mail is verzonden vanuit het offerteformulier op Riory https://riory.be</Text>
        </Container>
      </Body>
    </Html>
  )
}

export const template = {
  component: QuoteNotificationEmail,
  subject: 'Riory - Nieuwe offerte aanvraag',
  to: 'jasonbalongo@gmail.com',
  displayName: 'Offerte notificatie',
  previewData: {
    naam: 'Jan Janssen',
    email: 'jan@voorbeeld.be',
    telefoon: '0471234567',
    locatie: 'Hasselt',
    dienst: 'Ontstopping',
    beschrijving: 'Graag een offerte voor ontstopping van het riool.',
  },
} satisfies TemplateEntry

const main = { backgroundColor: '#ffffff', fontFamily: 'Arial, sans-serif' }
const container = { padding: '12px 20px', maxWidth: '600px' }
const block = { fontSize: '14px', color: '#333', lineHeight: '1.6', margin: '0 0 16px' }
const footer = { fontSize: '12px', color: '#999', margin: '24px 0 0' }
