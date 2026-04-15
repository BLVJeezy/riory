import { usePageView } from "@/hooks/usePageView";
import { useDocumentMeta } from "@/hooks/useDocumentMeta";
import Navbar from "@/components/Navbar";
import PriceCalculator from "@/components/PriceCalculator";
import Footer from "@/components/Footer";

const Prijscalculator = () => {
  usePageView("/prijscalculator");
  useDocumentMeta();

  return (
    <>
      <Navbar />
      <div className="pt-20">
        <PriceCalculator />
      </div>
      <Footer />
    </>
  );
};

export default Prijscalculator;
