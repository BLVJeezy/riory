import { usePageView } from "@/hooks/usePageView";
import { useDocumentMeta } from "@/hooks/useDocumentMeta";
import Navbar from "@/components/Navbar";
import AppointmentForm from "@/components/AppointmentForm";
import Footer from "@/components/Footer";

const Afspraak = () => {
  usePageView("/afspraak");
  useDocumentMeta(
    "Afspraak Maken | Riory",
    "Plan snel een afspraak voor ontstopping, camera-inspectie of put-lediging bij Riory."
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
