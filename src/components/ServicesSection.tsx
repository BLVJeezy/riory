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
