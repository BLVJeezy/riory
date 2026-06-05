import * as React from 'npm:react@18.3.1'
import {
  Body, Container, Head, Heading, Html, Img, Preview, Section, Text, Hr, Link,
} from 'npm:@react-email/components@0.0.22'

const LOGO_URL = 'https://bqcxvvpawbwupornueww.supabase.co/storage/v1/object/public/email-assets/riory-logo.png'
import type { TemplateEntry } from './registry.ts'

interface Props {
  voornaam?: string
  dienst?: string
  beschrijving?: string
}

const OfferteConfirmation = ({ voornaam, dienst, beschrijving }: Props) => (
  <Html lang="nl" dir="ltr">
    <Head />
    <Preview>Je offerte-aanvraag bij Riory is goed ontvangen</Preview>
    <Body style={main}>
      <Container style={container}>
        <Section style={header}>
          <Img src={LOGO_URL} alt="Riory" width="180" style={logo} />
          <Text style={tagline}>Sterk in Rioleringswerk</Text>
        </Section>

        <Section style={content}>
          <Heading style={h1}>
            {voornaam ? `Bedankt, ${voornaam}!` : 'Bedankt voor je aanvraag!'}
          </Heading>
          <Text style={text}>
            We hebben je offerte-aanvraag goed ontvangen
            {dienst ? <> voor <strong>{dienst}</strong></> : null}.
          </Text>
          <Text style={text}>
            Onze offerte-medewerker bekijkt je aanvraag en stuurt je binnen 1 à 2 werkdagen een vrijblijvende offerte op maat. Heb je in tussentijd vragen? Antwoord gerust op deze e-mail.
          </Text>

          {beschrijving ? (
            <Section style={summaryBox}>
              <Text style={summaryTitle}>Samenvatting van je aanvraag</Text>
              <Text style={summaryText}>{beschrijving}</Text>
            </Section>
          ) : null}

          <Section style={infoBox}>
            <Text style={infoTitle}>Dringend hulp nodig?</Text>
            <Text style={infoText}>
              Bel onze 24/7 nooddienst:{' '}
              <Link href="tel:+32472502814" style={phoneLink}>
                +32 472 50 28 14
              </Link>
            </Text>
          </Section>

          <Hr style={hr} />

          <Text style={footerText}>
            Met vriendelijke groet,<br />
            Het Riory team
          </Text>
          <Text style={footerSmall}>
            <Link href="https://riory.be" style={footerLink}>riory.be</Link>
            {' · '}
            <Link href="mailto:afspraak@riory.be" style={footerLink}>afspraak@riory.be</Link>
          </Text>
        </Section>
      </Container>
    </Body>
  </Html>
)

export const template = {
  component: OfferteConfirmation,
  subject: 'Je offerte-aanvraag bij Riory is goed ontvangen',
  displayName: 'Offerte bevestiging (klant)',
  previewData: { voornaam: 'Jason', dienst: 'Rioolherstelling', beschrijving: 'Ingezakte riool aan de oprit.' },
} satisfies TemplateEntry

const main = { backgroundColor: '#ffffff', fontFamily: 'Arial, Helvetica, sans-serif', margin: 0, padding: 0 }
const container = { maxWidth: '600px', margin: '0 auto', padding: '0' }
const header = { backgroundColor: '#ffffff', padding: '32px 32px 16px', textAlign: 'center' as const }
const logo = { display: 'block', margin: '0 auto', maxWidth: '180px', height: 'auto' }
const tagline = { color: '#FF6B00', fontSize: '13px', fontWeight: 'bold' as const, letterSpacing: '2px', margin: '12px 0 0', textTransform: 'uppercase' as const }
const content = { padding: '32px 32px 24px' }
const h1 = { fontSize: '22px', fontWeight: 'bold' as const, color: '#000000', margin: '0 0 16px' }
const text = { fontSize: '15px', color: '#333333', lineHeight: '1.6', margin: '0 0 14px' }
const summaryBox = { backgroundColor: '#f7f7f7', padding: '16px 20px', margin: '20px 0', borderRadius: '4px' }
const summaryTitle = { fontSize: '13px', fontWeight: 'bold' as const, color: '#000000', textTransform: 'uppercase' as const, letterSpacing: '1px', margin: '0 0 6px' }
const summaryText = { fontSize: '14px', color: '#333333', margin: 0, whiteSpace: 'pre-wrap' as const }
const infoBox = { backgroundColor: '#FFF4EC', borderLeft: '4px solid #FF6B00', padding: '16px 20px', margin: '24px 0', borderRadius: '4px' }
const infoTitle = { fontSize: '14px', fontWeight: 'bold' as const, color: '#000000', margin: '0 0 4px' }
const infoText = { fontSize: '15px', color: '#333333', margin: 0 }
const phoneLink = { color: '#FF6B00', fontWeight: 'bold' as const, textDecoration: 'none' }
const hr = { borderColor: '#eaeaea', margin: '28px 0 20px' }
const footerText = { fontSize: '14px', color: '#333333', margin: '0 0 12px' }
const footerSmall = { fontSize: '12px', color: '#888888', margin: 0 }
const footerLink = { color: '#FF6B00', textDecoration: 'none' }
