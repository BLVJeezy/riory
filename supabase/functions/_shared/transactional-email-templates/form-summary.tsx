import * as React from 'npm:react@18.3.1'
import { Section, Text, Row, Column } from 'npm:@react-email/components@0.0.22'

// Toont ALLE door de klant ingevulde gegevens, zodat de klant zelf kan
// controleren wat er precies is doorgegeven.
type Any = Record<string, any>

const clean = (v: any): string | null => {
  if (v === undefined || v === null || v === '') return null
  if (typeof v === 'boolean') return v ? 'Ja' : 'Nee'
  return String(v).trim() || null
}

const klantLabel = (t?: string) =>
  t === 'particulier' ? 'Particulier'
    : t === 'bedrijf' ? 'Bedrijf'
    : t === 'vrij_beroep' ? 'Vrij beroep'
    : t === 'syndicus' ? 'Syndicus'
    : clean(t)

export const buildSummary = (p: Any): Array<{ label: string; value: string }> => {
  const rows: Array<{ label: string; value: string }> = []
  const add = (label: string, value: any) => {
    const v = clean(value)
    if (v) rows.push({ label, value: v })
  }

  const isSyndicus = p.klantType === 'syndicus'

  add('Type klant', klantLabel(p.klantType))
  add('Dienst', p.dienst)
  if (p.urgent) add('Urgentie', 'Hoge urgentie (indien mogelijk vandaag)')
  if (p.wiltOfferte) add('Voorkeur', p.wiltOfferte === 'offerte' ? 'Eerst een offerte ontvangen' : 'Meteen een afspraak maken')
  if (p.woningOuder) add('Woning ouder dan 10 jaar', true)

  if (isSyndicus) {
    add('Naam', `${clean(p.syndicusVoornaam) || ''} ${clean(p.syndicusNaam) || ''}`.trim())
    add('Kantoor', p.syndicusKantoor)
    add('VME', p.syndicusNaamVme)
    add('KBO-nummer', p.syndicusKboNummer)
    add('E-mail', p.syndicusEmail)
    add('Facturatie e-mail', p.syndicusFacturatieEmail)
    add('Telefoon', p.syndicusTelefoon)
    add('Adres', `${clean(p.syndicusStraat) || ''} ${clean(p.syndicusHuisnummer) || ''}`.trim())
    add('Postcode', p.syndicusPostcode)
    add('Gemeente', p.syndicusPlaats)
  } else {
    add('Naam', `${clean(p.voornaam) || ''} ${clean(p.naam) || ''}`.trim())
    add('Bedrijfsnaam', p.bedrijfsnaam)
    add('BTW-nummer', p.btwNummer)
    add('KBO-nummer', p.kboNummer)
    add('E-mail', p.email)
    add('Facturatie e-mail', p.facturatieEmail)
    add('Telefoon', p.telefoon)
    add('Adres', `${clean(p.straat) || ''} ${clean(p.huisnummer) || ''}`.trim())
    add('Postcode', p.postcode)
    add('Gemeente', p.plaats || p.locatie)
  }

  add('Werf — project', p.werfProjectnaam)
  add('Werf — adres', `${clean(p.werfStraat) || ''} ${clean(p.werfHuisnummer) || ''}`.trim())
  add('Werf — postcode', p.werfPostcode)
  add('Werf — gemeente', p.werfPlaats)
  add('Werf — contactpersoon', p.werfContactpersoon)
  add('Werf — telefoon', p.werfTelefoon)

  add('Grootte regenput', p.regenputGrootte)
  if (p.dakgootMeters) {
    const d = p.dakgootMeters
    add('Dakgoot meters', `1 verdiep: ${d.v1 || '0'}m · 2 verdiepen: ${d.v2 || '0'}m · 3 verdiepen: ${d.v3 || '0'}m`)
  }
  add('Hoe gevonden', p.gevondenVia)
  add('Toelichting vindplaats', p.gevondenDetail)
  add('Omschrijving', p.beschrijving)

  return rows
}

export const FormSummary = (p: Any) => {
  const rows = buildSummary(p)
  if (rows.length === 0) return null
  return (
    <Section style={box}>
      <Text style={title}>Jouw ingevulde gegevens</Text>
      {rows.map((r, i) => (
        <Row key={i} style={row}>
          <Column style={labelCol}>
            <Text style={labelText}>{r.label}</Text>
          </Column>
          <Column style={valueCol}>
            <Text style={valueText}>{r.value}</Text>
          </Column>
        </Row>
      ))}
      <Text style={note}>
        Staat hier iets verkeerd? Antwoord op deze e-mail met de juiste gegevens, dan passen we het aan.
      </Text>
    </Section>
  )
}

const box = { backgroundColor: '#f7f7f7', padding: '18px 20px', margin: '24px 0', borderRadius: '4px' }
const title = { fontSize: '13px', fontWeight: 'bold' as const, color: '#000000', textTransform: 'uppercase' as const, letterSpacing: '1px', margin: '0 0 12px' }
const row = { borderBottom: '1px solid #e6e6e6' }
const labelCol = { width: '42%', verticalAlign: 'top' as const, paddingRight: '10px' }
const valueCol = { width: '58%', verticalAlign: 'top' as const }
const labelText = { fontSize: '13px', color: '#777777', margin: '6px 0' }
const valueText = { fontSize: '13px', color: '#222222', margin: '6px 0', whiteSpace: 'pre-wrap' as const }
const note = { fontSize: '12px', color: '#888888', margin: '14px 0 0' }
