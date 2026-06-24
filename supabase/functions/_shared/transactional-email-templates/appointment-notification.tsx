import * as React from 'npm:react@18.3.1'
import {
  Body, Container, Head, Html, Preview, Text,
} from 'npm:@react-email/components@0.0.22'
import type { TemplateEntry } from './registry.ts'

interface Props {
  klantType?: string
  urgent?: boolean
  woningOuder?: boolean
  dienst?: string
  voornaam?: string
  naam?: string
  bedrijfsnaam?: string
  btwNummer?: string
  kboNummer?: string
  email?: string
  facturatieEmail?: string
  telefoon?: string
  straat?: string
  huisnummer?: string
  postcode?: string
  plaats?: string
  werfStraat?: string
  werfHuisnummer?: string
  werfPostcode?: string
  werfPlaats?: string
  werfTelefoon?: string
  werfContactpersoon?: string
  werfProjectnaam?: string
  syndicusNaam?: string
  syndicusVoornaam?: string
  syndicusKantoor?: string
  syndicusStraat?: string
  syndicusHuisnummer?: string
  syndicusPostcode?: string
  syndicusPlaats?: string
  syndicusTelefoon?: string
  syndicusEmail?: string
  syndicusFacturatieEmail?: string
  syndicusNaamVme?: string
  syndicusKboNummer?: string
  beschrijving?: string
  regenputGrootte?: string
  dakgootMeters?: { v1?: string; v2?: string; v3?: string }
  wiltOfferte?: 'offerte' | 'afspraak'
  gevondenVia?: string
  gevondenDetail?: string
}

const AppointmentNotificationEmail = (p: Props) => {
  const isParticulier = p.klantType === 'particulier'
  const isBedrijf = p.klantType === 'bedrijf' || p.klantType === 'vrij_beroep'
  const isSyndicus = p.klantType === 'syndicus'

  const klantLabel = p.klantType === 'particulier' ? 'Particulier'
    : p.klantType === 'bedrijf' ? 'Bedrijf'
    : p.klantType === 'vrij_beroep' ? 'Vrij beroep'
    : p.klantType === 'syndicus' ? 'Syndicus'
    : p.klantType || ''

  const urgentLine = p.urgent ? 'Hoge urgentie, indien mogelijk vandaag geholpen*.' : ''

  // Build particulier block
  const particulierLines: string[] = []
  if (isParticulier) {
    particulierLines.push(`Van: ${p.voornaam || ''} ${p.naam || ''}`.trim())
    if (p.woningOuder) particulierLines.push('Woning ouder dan 10 jaar')
    if (p.straat) particulierLines.push(`${p.straat} ${p.huisnummer || ''}`.trim())
    if (p.postcode) particulierLines.push(p.postcode)
    if (p.plaats) particulierLines.push(p.plaats)
    if (p.email) particulierLines.push(p.email)
    if (p.telefoon) particulierLines.push(p.telefoon)
    // Werfadres block (indien anders dan facturatieadres)
    if (p.werfStraat) {
      particulierLines.push('')
      particulierLines.push('Werfadres:')
      particulierLines.push(`${p.werfStraat} ${p.werfHuisnummer || ''}`.trim())
      if (p.werfPostcode) particulierLines.push(p.werfPostcode)
      if (p.werfPlaats) particulierLines.push(p.werfPlaats)
      if (p.werfContactpersoon) particulierLines.push(`Contactpersoon werf: ${p.werfContactpersoon}`)
      if (p.werfTelefoon) particulierLines.push(`Tel. contactpersoon werf: ${p.werfTelefoon}`)
    }
    particulierLines.push('')
    if (p.dienst) particulierLines.push(p.dienst)
    if (p.beschrijving) particulierLines.push(p.beschrijving)
    particulierLines.push('Ik ga akkoord met de algemene voorwaarden Riory BV')
  } else {
    particulierLines.push('Van: ')
    particulierLines.push('Septische put ledigen')
  }

  // Build bedrijf block
  const bedrijfLines: string[] = []
  if (isBedrijf) {
    bedrijfLines.push(`Van: ${p.voornaam || ''} ${p.naam || ''}`.trim())
    if (p.bedrijfsnaam) bedrijfLines.push(p.bedrijfsnaam)
    if (p.btwNummer) bedrijfLines.push(p.btwNummer)
    if (p.email) bedrijfLines.push(p.email)
    if (p.facturatieEmail) bedrijfLines.push(p.facturatieEmail)
    if (p.telefoon) bedrijfLines.push(`Tel. facturatie: ${p.telefoon}`)
    if (p.straat) bedrijfLines.push(`${p.straat} ${p.huisnummer || ''}`.trim())
    if (p.postcode) bedrijfLines.push(p.postcode)
    if (p.plaats) bedrijfLines.push(p.plaats)
    // Werf address block with empty line separator
    if (p.werfStraat) {
      bedrijfLines.push('')
      bedrijfLines.push('Werfadres:')
      if (p.werfProjectnaam) bedrijfLines.push(`Project: ${p.werfProjectnaam}`)
      bedrijfLines.push(`${p.werfStraat} ${p.werfHuisnummer || ''}`.trim())
      if (p.werfPostcode) bedrijfLines.push(p.werfPostcode)
      if (p.werfPlaats) bedrijfLines.push(p.werfPlaats)
      if (p.werfContactpersoon) bedrijfLines.push(`Contactpersoon werf: ${p.werfContactpersoon}`)
      if (p.werfTelefoon) bedrijfLines.push(`Tel. contactpersoon werf: ${p.werfTelefoon}`)
    }
    bedrijfLines.push('')
    if (p.dienst) bedrijfLines.push(p.dienst)
    if (p.beschrijving) bedrijfLines.push(p.beschrijving)
    bedrijfLines.push('Ik ga akkoord met de algemene voorwaarden Riory BV')
  } else {
    bedrijfLines.push('Van: ')
    bedrijfLines.push('Septische put ledigen')
  }

  // Build syndicus block
  const syndicusLines: string[] = []
  if (isSyndicus) {
    syndicusLines.push(`Van: ${p.syndicusVoornaam || ''} ${p.syndicusNaam || ''}`.trim())
    if (p.syndicusKantoor) syndicusLines.push(p.syndicusKantoor)
    if (p.syndicusNaamVme) syndicusLines.push(`VME: ${p.syndicusNaamVme}`)
    if (p.syndicusKboNummer) syndicusLines.push(p.syndicusKboNummer)
    if (p.syndicusEmail) syndicusLines.push(p.syndicusEmail)
    if (p.syndicusFacturatieEmail) syndicusLines.push(p.syndicusFacturatieEmail)
    if (p.syndicusStraat) syndicusLines.push(`${p.syndicusStraat} ${p.syndicusHuisnummer || ''}`.trim())
    if (p.syndicusPostcode) syndicusLines.push(p.syndicusPostcode)
    if (p.syndicusPlaats) syndicusLines.push(p.syndicusPlaats)
    if (p.syndicusTelefoon) syndicusLines.push(p.syndicusTelefoon)
    // Werf
    if (p.werfStraat) {
      syndicusLines.push('')
      syndicusLines.push('Werfadres:')
      if (p.werfProjectnaam) syndicusLines.push(`Project: ${p.werfProjectnaam}`)
      syndicusLines.push(`${p.werfStraat} ${p.werfHuisnummer || ''}`.trim())
      if (p.werfPostcode) syndicusLines.push(p.werfPostcode)
      if (p.werfPlaats) syndicusLines.push(p.werfPlaats)
      if (p.werfContactpersoon) syndicusLines.push(`Contactpersoon werf: ${p.werfContactpersoon}`)
      if (p.werfTelefoon) syndicusLines.push(`Tel. contactpersoon werf: ${p.werfTelefoon}`)
    }
    syndicusLines.push('')
    if (p.dienst) syndicusLines.push(p.dienst)
    if (p.beschrijving) syndicusLines.push(p.beschrijving)
    syndicusLines.push('Ik ga akkoord met de algemene voorwaarden Riory BV')
  } else {
    syndicusLines.push('Van: ')
    syndicusLines.push('Septische put ledigen')
  }

  const renderBlock = (label: string, lines: string[]) => (
    <Text style={block}>
      <strong>{label}</strong>
      <br />
      {lines.map((line, i) =>
        line === '' ? <br key={i} /> : <React.Fragment key={i}>{line}<br /></React.Fragment>
      )}
    </Text>
  )

  return (
    <Html lang="nl" dir="ltr">
      <Head />
      <Preview>{`${klantLabel}${p.urgent ? ' • URGENT' : ''}${p.dienst ? ' • ' + p.dienst : ''}${p.plaats || p.werfPlaats || p.syndicusPlaats ? ' • ' + (p.plaats || p.werfPlaats || p.syndicusPlaats) : ''}`}</Preview>
      <Body style={main}>
        <Container style={container}>
          <Text style={block}>
            {klantLabel}
            {urgentLine && <><br />{urgentLine}</>}
            {p.wiltOfferte && (
              <>
                <br />
                <strong>Voorkeur klant: </strong>
                {p.wiltOfferte === 'offerte' ? 'Wil eerst een offerte ontvangen' : 'Wil meteen een afspraak maken'}
              </>
            )}
            {p.regenputGrootte && (
              <>
                <br />
                <strong>Grootte regenput: </strong>{p.regenputGrootte}
              </>
            )}
            {p.dakgootMeters && (
              <>
                <br />
                <strong>Dakgoot meters — </strong>
                1 verdiep: {p.dakgootMeters.v1 || '0'}m, 2 verdiepen: {p.dakgootMeters.v2 || '0'}m, 3 verdiepen: {p.dakgootMeters.v3 || '0'}m
              </>
            )}
          </Text>

          {renderBlock('Particulier', particulierLines)}
          {renderBlock('Bedrijf', bedrijfLines)}
          {renderBlock('Syndicus', syndicusLines)}

          <Text style={footer}>-- Deze e-mail is verzonden vanuit het contactformulier op Riory https://riory.be</Text>
        </Container>
      </Body>
    </Html>
  )
}

const buildSubject = (d: Record<string, any>) => {
  const isSyndicus = d.klantType === 'syndicus'
  const isBedrijf = d.klantType === 'bedrijf' || d.klantType === 'vrij_beroep'
  const naam = isSyndicus
    ? `${d.syndicusVoornaam || ''} ${d.syndicusNaam || ''}`.trim()
    : `${d.voornaam || ''} ${d.naam || ''}`.trim()
  const bedrijf = isBedrijf && d.bedrijfsnaam ? ` (${d.bedrijfsnaam})` : ''
  const kantoor = isSyndicus && d.syndicusKantoor ? ` (${d.syndicusKantoor})` : ''
  const klantLabel = d.klantType === 'particulier' ? 'Particulier'
    : d.klantType === 'bedrijf' ? 'Bedrijf'
    : d.klantType === 'vrij_beroep' ? 'Vrij beroep'
    : d.klantType === 'syndicus' ? 'Syndicus'
    : 'Aanvraag'
  const urgent = d.urgent ? '[URGENT] ' : ''
  const offertePrefix = d.wiltOfferte === 'offerte' ? '[OFFERTE] ' : ''
  const dienst = d.dienst ? ` – ${d.dienst}` : ''
  const wie = naam || klantLabel
  return `${urgent}${offertePrefix}Afspraak ${klantLabel}: ${wie}${bedrijf}${kantoor}${dienst}`
}

export const template = {
  component: AppointmentNotificationEmail,
  subject: buildSubject,
  to: 'afspraak@riory.be',
  displayName: 'Afspraak notificatie',
  previewData: {
    klantType: 'particulier',
    urgent: false,
    voornaam: 'Liesbet',
    naam: 'Dutillieux',
    woningOuder: true,
    straat: 'Bergweidestraat',
    huisnummer: '11',
    postcode: '3730',
    plaats: 'Bilzen-Hoeselt',
    email: 'liesbet.dutillieux@telenet.be',
    telefoon: '0473508282',
    dienst: 'Ontstopping',
    beschrijving: 'Zoals zonet telefonisch besproken, zouden we graag een afspraak vastleggen.',
  },
} satisfies TemplateEntry

const main = { backgroundColor: '#ffffff', fontFamily: 'Arial, sans-serif' }
const container = { padding: '12px 20px', maxWidth: '600px' }
const block = { fontSize: '14px', color: '#333', lineHeight: '1.6', margin: '0 0 16px' }
const footer = { fontSize: '12px', color: '#999', margin: '24px 0 0' }
