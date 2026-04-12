import * as React from 'npm:react@18.3.1'
import {
  Body, Container, Head, Heading, Html, Preview, Text, Section, Hr,
} from 'npm:@react-email/components@0.0.22'
import type { TemplateEntry } from './registry.ts'

const SITE_NAME = "Riory"

interface AppointmentNotificationProps {
  dienst?: string
  urgent?: boolean
  klantType?: string
  naam?: string
  voornaam?: string
  bedrijfsnaam?: string
  email?: string
  telefoon?: string
  btwNummer?: string
  adres?: string
  werfAdres?: string
  syndicusInfo?: string
  beschrijving?: string
  gevondenVia?: string
}

const AppointmentNotificationEmail = (props: AppointmentNotificationProps) => (
  <Html lang="nl" dir="ltr">
    <Head />
    <Preview>Nieuwe afspraak aanvraag{props.urgent ? ' — URGENT' : ''} via {SITE_NAME}</Preview>
    <Body style={main}>
      <Container style={container}>
        <Heading style={h1}>
          {props.urgent ? '🔴 URGENTE ' : ''}Nieuwe Afspraak Aanvraag
        </Heading>

        <Section style={section}>
          <Text style={label}>Dienst</Text>
          <Text style={value}>{props.dienst || '—'}</Text>
        </Section>

        <Section style={section}>
          <Text style={label}>Klant type</Text>
          <Text style={value}>{props.klantType || '—'}</Text>
        </Section>

        <Hr style={hr} />

        <Heading style={h2}>Contactgegevens</Heading>
        <Text style={value}>
          {props.voornaam} {props.naam}
          {props.bedrijfsnaam ? ` — ${props.bedrijfsnaam}` : ''}
        </Text>
        {props.btwNummer && <Text style={value}>BTW: {props.btwNummer}</Text>}
        <Text style={value}>E-mail: {props.email || '—'}</Text>
        <Text style={value}>Telefoon: {props.telefoon || '—'}</Text>
        {props.adres && <Text style={value}>Adres: {props.adres}</Text>}

        {props.werfAdres && (
          <>
            <Hr style={hr} />
            <Heading style={h2}>Werfadres</Heading>
            <Text style={value}>{props.werfAdres}</Text>
          </>
        )}

        {props.syndicusInfo && (
          <>
            <Hr style={hr} />
            <Heading style={h2}>Syndicus</Heading>
            <Text style={value}>{props.syndicusInfo}</Text>
          </>
        )}

        {props.beschrijving && (
          <>
            <Hr style={hr} />
            <Heading style={h2}>Beschrijving</Heading>
            <Text style={value}>{props.beschrijving}</Text>
          </>
        )}

        {props.gevondenVia && (
          <>
            <Hr style={hr} />
            <Text style={label}>Gevonden via: {props.gevondenVia}</Text>
          </>
        )}

        <Hr style={hr} />
        <Text style={footer}>Dit bericht werd automatisch verstuurd door {SITE_NAME}.</Text>
      </Container>
    </Body>
  </Html>
)

export const template = {
  component: AppointmentNotificationEmail,
  subject: (data: Record<string, any>) =>
    `${data.urgent ? '🔴 URGENT — ' : ''}Nieuwe afspraak: ${data.dienst || 'Onbekend'} — ${data.voornaam || ''} ${data.naam || ''}`.trim(),
  to: 'jasonbalongo@gmail.com',
  displayName: 'Afspraak notificatie',
  previewData: {
    dienst: 'Rioleringswerken',
    urgent: true,
    klantType: 'Particulier',
    naam: 'Janssens',
    voornaam: 'Jan',
    email: 'jan@voorbeeld.be',
    telefoon: '0470 12 34 56',
    adres: 'Kerkstraat 1, 2000 Antwerpen',
    beschrijving: 'Verstopping in de keuken',
    gevondenVia: 'Google',
  },
} satisfies TemplateEntry

const main = { backgroundColor: '#ffffff', fontFamily: "'Rubik', Arial, sans-serif" }
const container = { padding: '24px 28px', maxWidth: '600px' }
const h1 = { fontSize: '22px', fontWeight: '700' as const, color: '#1a1a1a', margin: '0 0 24px' }
const h2 = { fontSize: '16px', fontWeight: '600' as const, color: '#1a1a1a', margin: '0 0 8px' }
const section = { marginBottom: '12px' }
const label = { fontSize: '12px', fontWeight: '600' as const, color: '#999', margin: '0 0 2px', textTransform: 'uppercase' as const }
const value = { fontSize: '14px', color: '#333', lineHeight: '1.5', margin: '0 0 4px' }
const hr = { borderColor: '#eee', margin: '20px 0' }
const footer = { fontSize: '12px', color: '#999', margin: '24px 0 0' }
