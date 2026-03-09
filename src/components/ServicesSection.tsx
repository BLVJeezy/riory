import serviceRiolering from "@/assets/service-riolering.jpg";
import serviceGrondwerk from "@/assets/service-grondwerk.jpg";
import serviceDrainage from "@/assets/service-drainage.jpg";
import serviceAfwatering from "@/assets/service-afwatering.jpg";
import serviceHerstelling from "@/assets/service-herstelling.jpg";

const services = [
  {
    title: "Rioleringswerken",
    description: "Aanleg, vernieuwing en aansluiting van rioleringssystemen voor particulieren, bedrijven en overheden.",
    image: serviceRiolering,
  },
  {
    title: "Grondwerken",
    description: "Professionele grondverzet, nivellering en uitgraving voor bouw- en infrastructuurprojecten.",
    image: serviceGrondwerk,
  },
  {
    title: "Drainage systemen",
    description: "Ontwerp en installatie van drainage om wateroverlast te voorkomen en grondwater te beheersen.",
    image: serviceDrainage,
  },
  {
    title: "Afwateringssystemen",
    description: "Aanleg van afvoersystemen voor regenwater en oppervlaktewater, afgestemd op uw situatie.",
    image: serviceAfwatering,
  },
  {
    title: "Herstellingen & onderhoud",
    description: "Snelle en vakkundige herstellingen van bestaande rioleringen en infrastructuur.",
    image: serviceHerstelling,
  },
];

const ServicesSection = () => {
  return (
    <section id="diensten" className="section-padding bg-background">
      <div className="section-container">
        <h2 className="text-3xl md:text-4xl font-heading font-bold uppercase text-foreground mb-4">
          Onze Diensten
        </h2>
        <div className="w-16 h-1 bg-primary mb-12" />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service) => (
            <div
              key={service.title}
              className="group bg-card rounded overflow-hidden border border-border hover:shadow-lg transition-shadow"
            >
              <div className="h-48 overflow-hidden">
                <img
                  src={service.image}
                  alt={service.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <div className="p-6">
                <h3 className="text-lg font-heading font-semibold text-foreground mb-2">
                  {service.title}
                </h3>
                <p className="text-sm text-muted-foreground font-body leading-relaxed">
                  {service.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;
