import * as React from 'npm:react@18.3.1'

// Riory e-mailhandtekening (Planning · afspraak@riory.be), 600px breed.
// Opgesplitst in stukjes zodat elke link apart klikbaar is in elk mailprogramma.
// Afbeeldingen: public/mail/handtekening-55fc0406/email-600/planning/ (niet verwijderen,
// verzonden mails laden ze van daar).
type Slice = { src: string; w: number; h: number; href: string | null; alt: string }
type Cell = { w: number; imgs: Slice[] }

const ROWS: Cell[][] = [
  [
    {
      "w": 600,
      "imgs": [
        {
          "src": "https://www.riory.be/mail/handtekening-55fc0406/email-600/planning/0.jpg",
          "w": 600,
          "h": 72,
          "href": null,
          "alt": ""
        }
      ]
    }
  ],
  [
    {
      "w": 302,
      "imgs": [
        {
          "src": "https://www.riory.be/mail/handtekening-55fc0406/email-600/planning/1.jpg",
          "w": 302,
          "h": 61,
          "href": null,
          "alt": ""
        }
      ]
    },
    {
      "w": 129,
      "imgs": [
        {
          "src": "https://www.riory.be/mail/handtekening-55fc0406/email-600/planning/2.jpg",
          "w": 129,
          "h": 12,
          "href": "tel:+32472502814",
          "alt": "Bel Riory: +32 472 50 28 14"
        },
        {
          "src": "https://www.riory.be/mail/handtekening-55fc0406/email-600/planning/3.jpg",
          "w": 129,
          "h": 14,
          "href": "mailto:afspraak@riory.be",
          "alt": "afspraak@riory.be"
        },
        {
          "src": "https://www.riory.be/mail/handtekening-55fc0406/email-600/planning/4.jpg",
          "w": 129,
          "h": 15,
          "href": "https://www.riory.be/",
          "alt": "www.riory.be"
        },
        {
          "src": "https://www.riory.be/mail/handtekening-55fc0406/email-600/planning/5.jpg",
          "w": 129,
          "h": 20,
          "href": "https://kbopub.economie.fgov.be/kbopub/zoeknummerform.html?nummer=0840931404",
          "alt": "BTW BE0840.931.404"
        }
      ]
    },
    {
      "w": 169,
      "imgs": [
        {
          "src": "https://www.riory.be/mail/handtekening-55fc0406/email-600/planning/6.jpg",
          "w": 169,
          "h": 61,
          "href": null,
          "alt": ""
        }
      ]
    }
  ],
  [
    {
      "w": 305,
      "imgs": [
        {
          "src": "https://www.riory.be/mail/handtekening-55fc0406/email-600/planning/7.jpg",
          "w": 305,
          "h": 67,
          "href": null,
          "alt": ""
        }
      ]
    },
    {
      "w": 162,
      "imgs": [
        {
          "src": "https://www.riory.be/mail/handtekening-55fc0406/email-600/planning/8.jpg",
          "w": 162,
          "h": 67,
          "href": "https://www.riory.be/afspraak",
          "alt": "Afspraak maken"
        }
      ]
    },
    {
      "w": 133,
      "imgs": [
        {
          "src": "https://www.riory.be/mail/handtekening-55fc0406/email-600/planning/9.jpg",
          "w": 133,
          "h": 67,
          "href": null,
          "alt": ""
        }
      ]
    }
  ]
]

const td = { padding: 0, margin: 0, lineHeight: 0, fontSize: 0, verticalAlign: 'top' as const }
const tbl = { borderCollapse: 'collapse' as const }

export const RiorySignature = () => (
  <table role="presentation" cellPadding={0} cellSpacing={0} border={0} width={600}
    style={{ ...tbl, width: '600px', backgroundColor: '#050505' }}>
    <tbody>
      {ROWS.map((row, r) => (
        <tr key={r}>
          <td style={td}>
            <table role="presentation" cellPadding={0} cellSpacing={0} border={0} style={tbl}>
              <tbody>
                <tr>
                  {row.map((cell, c) => (
                    <td key={c} width={cell.w} valign="top" style={td}>
                      {cell.imgs.map((s, i) => {
                        const img = (
                          <img src={s.src} width={s.w} height={s.h} alt={s.alt}
                            style={{ display: 'block', border: 0, outline: 'none', width: `${s.w}px`, height: `${s.h}px` }} />
                        )
                        return s.href
                          ? <a key={i} href={s.href} target="_blank" style={{ display: 'block', textDecoration: 'none' }}>{img}</a>
                          : <React.Fragment key={i}>{img}</React.Fragment>
                      })}
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </td>
        </tr>
      ))}
    </tbody>
  </table>
)
