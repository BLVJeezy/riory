import { useTranslation } from "react-i18next";
import { usePageView } from "@/hooks/usePageView";
import { useDocumentMeta } from "@/hooks/useDocumentMeta";
import Navbar from "@/components/Navbar";
import PriceCalculator from "@/components/PriceCalculator";
import Footer from "@/components/Footer";

const Prijscalculator = () => {
  const { t } = useTranslation();
  usePageView("/prijscalculator");
  useDocumentMeta(t("calculator.metaTitle"), t("calculator.metaDescription"));

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
