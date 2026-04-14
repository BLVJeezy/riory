import { usePageView } from "@/hooks/usePageView";
import { useDocumentMeta } from "@/hooks/useDocumentMeta";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PriceCalculator from "@/components/PriceCalculator";

const Prijscalculator = () => {
  usePageView("/prijscalculator");
  useDocumentMeta(
    "Prijscalculator | Riory",
    "Bereken een indicatieve prijs voor uw ontstopping, camera-inspectie, pompwerken, dakgootreiniging of septische put. Louter informatief."
  );

  return (
    <>
      <Navbar />
      <main className="pt-20">
        <PriceCalculator />
      </main>
      <Footer />
    </>
  );
};

export default Prijscalculator;
