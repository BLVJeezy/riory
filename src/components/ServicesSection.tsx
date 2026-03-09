import serviceSeptisch from "@/assets/service-septisch.jpg";
import serviceRegenput from "@/assets/service-regenput.jpg";
import serviceOnstopping from "@/assets/service-ontstopping.jpg";
import serviceDakgoot from "@/assets/service-dakgoot.jpg";
import serviceCamera from "@/assets/service-camera.jpg";
import serviceDrainage from "@/assets/service-drainage.jpg";
import serviceAfwatering from "@/assets/service-afwatering.jpg";
import serviceHerstelling from "@/assets/service-herstelling.jpg";
import serviceRiolering from "@/assets/service-riolering.jpg";
import serviceGrondwerk from "@/assets/service-grondwerk.jpg";

const services = [
  {
    title: "Septische put ledigen",
    description: "Professioneel ledigen en reinigen van septische putten met gespecialiseerde zuigwagens.",
    image: serviceSeptisch,
  },
  {
    title: "Regenput reinigen",
    description: "Grondig reinigen van regenputten zodat uw afwatering optimaal blijft functioneren.",
    image: serviceRegenput,
  },
  {
    title: "Ontstopping",
    description: "Snelle en efficiënte ontstopping van rioleringen, afvoeren en leidingen met hoge druk.",
    image: serviceOnstopping,
  },
  {
    title: "Dakgootreiniging",
    description: "Reiniging van dakgoten en afvoerbuizen om verstoppingen en waterschade te voorkomen.",
    image: serviceDakgoot,
  },
  {
    title: "Camera-inspectie",
    description: "Gedetailleerde camera-inspectie van rioleringen om problemen snel en nauwkeurig te lokaliseren.",
    image: serviceCamera,
  },
  {
    title: "Plaatsbepaling afvoeren",
    description: "Exacte lokalisatie van ondergrondse afvoerleidingen met professionele detectieapparatuur.",
    image: serviceDrainage,
  },
  {
    title: "Geurhinder",
    description: "Opsporing en verhelping van stankoverlast uit rioleringen en afvoersystemen.",
    image: serviceRiolering,
  },
  {
    title: "Rioolviiegjes",
    description: "Bestrijding van rioolviiegjes door de bron aan te pakken in uw afvoersysteem.",
    image: serviceHerstelling,
  },
  {
    title: "Periodieke reiniging",
    description: "Preventief onderhoud en periodieke reiniging van uw volledige rioleringssysteem.",
    image: serviceGrondwerk,
  },
  {
    title: "Wateroverlast",
    description: "Leegpompen en reinigen bij wateroverlast, snel ter plaatse voor noodgevallen.",
    image: serviceAfwatering,
  },
];

const ServicesSection = () => {
  return (
    <section id="diensten" className="section-padding bg-background">
      <div className="section-container">
        <div className="text-center mb-14">
          <h2 className="text-3xl md:text-4xl font-heading font-bold uppercase text-foreground mb-4">
            Onze Diensten
          </h2>
          <div className="w-16 h-1 bg-primary mx-auto mb-4" />
          <p className="text-muted-foreground font-body max-w-xl mx-auto">
            Van ontstoppingen tot camera-inspectie — wij bieden een compleet aanbod aan rioleringsdiensten, 24/7 beschikbaar.
          </p>
        </div>

        {/* Top row: 2 large featured cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
          {services.slice(0, 2).map((service) => (
            <div
              key={service.title}
              className="group relative h-64 md:h-72 rounded overflow-hidden cursor-pointer"
            >
              <img
                src={service.image}
                alt={service.title}
                className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-charcoal/90 via-charcoal/30 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-6">
                <h3 className="text-xl font-heading font-bold text-background mb-1">
                  {service.title}
                </h3>
                <p className="text-sm text-background/70 font-body leading-relaxed">
                  {service.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Remaining cards: compact grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {services.slice(2).map((service) => (
            <div
              key={service.title}
              className="group relative h-48 md:h-56 rounded overflow-hidden cursor-pointer"
            >
              <img
                src={service.image}
                alt={service.title}
                className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-charcoal/90 via-charcoal/20 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-4">
                <h3 className="text-sm md:text-base font-heading font-semibold text-background leading-tight">
                  {service.title}
                </h3>
                <p className="text-xs text-background/60 font-body mt-1 hidden md:block leading-relaxed line-clamp-2">
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
