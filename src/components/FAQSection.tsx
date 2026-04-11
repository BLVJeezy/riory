import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
  {
    question: "Hoe snel kunnen jullie ter plaatse zijn bij een noodgeval?",
    answer:
      "Bij dringende situaties zoals verstoppingen of wateroverlast streven wij ernaar om binnen 1 à 2 uur ter plaatse te zijn. Wij zijn 24/7 bereikbaar voor spoedgevallen.",
  },
  {
    question: "Wat kost een ontstopping gemiddeld?",
    answer:
      "De prijs hangt af van de aard en ernst van de verstopping. Gebruik onze online schattingstool voor een indicatieve prijs, of vraag een gratis offerte aan voor een exacte berekening.",
  },
  {
    question: "Werken jullie ook in het weekend en op feestdagen?",
    answer:
      "Ja, wij zijn 24/7 beschikbaar — ook in het weekend en op feestdagen. Voor spoedgevallen kunt u ons altijd bereiken via telefoon of WhatsApp.",
  },
  {
    question: "Is een camera inspectie riool altijd nodig?",
    answer:
      "Niet altijd, maar het is wel aan te raden bij terugkerende verstoppingen of bij de aankoop van een woning. Zo krijgt u een duidelijk beeld van de staat van uw riolering.",
  },
  {
    question: "Hoe vaak moet een septische put geledigd worden?",
    answer:
      "Gemiddeld raden wij aan om uw septische put elke 2 tot 4 jaar te laten ledigen, afhankelijk van het gebruik en de grootte van de put.",
  },
  {
    question: "Bieden jullie ook preventief onderhoud aan?",
    answer:
      "Absoluut. Wij bieden contracten voor periodieke reiniging en inspectie aan, zodat problemen voorkomen worden voordat ze ontstaan.",
  },
];

const FAQSection = () => {
  return (
    <section id="faq" className="section-padding bg-muted/30">
      <div className="section-container max-w-3xl mx-auto">
        <div className="text-center mb-10">
          <h2 className="text-3xl md:text-4xl font-heading font-bold uppercase text-foreground mb-3">
            Veelgestelde vragen over rioleringswerken
          </h2>
          <div className="w-16 h-1 bg-primary mx-auto mb-4" />
          <p className="text-muted-foreground font-body">
            Heeft u een vraag? Bekijk hieronder de meest gestelde vragen of neem
            contact met ons op.
          </p>
        </div>
        <Accordion type="single" collapsible className="w-full">
          {faqs.map((faq, index) => (
            <AccordionItem key={index} value={`faq-${index}`}>
              <AccordionTrigger className="text-left font-heading font-semibold text-foreground text-base">
                <h3>{faq.question}</h3>
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground font-body">
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
};

export default FAQSection;
