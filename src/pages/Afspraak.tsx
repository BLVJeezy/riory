import { useTranslation } from "react-i18next";
import { usePageView } from "@/hooks/usePageView";
import { useDocumentMeta } from "@/hooks/useDocumentMeta";
import Navbar from "@/components/Navbar";
import AppointmentForm from "@/components/AppointmentForm";
import Footer from "@/components/Footer";

const Afspraak = () => {
  const { t } = useTranslation();
  usePageView("/afspraak");
  useDocumentMeta(t("afspraak.metaTitle"), t("afspraak.metaDescription"));

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
