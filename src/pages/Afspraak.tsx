import { usePageView } from "@/hooks/usePageView";
import { useDocumentMeta } from "@/hooks/useDocumentMeta";
import Navbar from "@/components/Navbar";
import AppointmentForm from "@/components/AppointmentForm";
import Footer from "@/components/Footer";

const Afspraak = () => {
  usePageView("/afspraak");
  useDocumentMeta(
    "Afspraak Maken | 24/7 Ontstoppingsdienst Limburg | Riory",
    "Plan direct uw afspraak bij Riory. ✓ 24/7 bereikbaar ✓ Binnen 1-2u ter plaatse ✓ Vaste prijzen in Bilzen, Hasselt, Genk & Tongeren. Boek nu!"
  );

  return (
    <>
      <Navbar />
      <div className="pt-20">
        <AppointmentForm />
      </div>
      <Footer />
    </>
  );
};

export default Afspraak;
