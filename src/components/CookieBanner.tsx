import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Cookie } from "lucide-react";

const CookieBanner = () => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem("cookie-consent");
    if (!consent) {
      const timer = setTimeout(() => setVisible(true), 1000);
      return () => clearTimeout(timer);
    }
  }, []);

  const accept = () => {
    localStorage.setItem("cookie-consent", "accepted");
    setVisible(false);
  };

  const decline = () => {
    localStorage.setItem("cookie-consent", "declined");
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 p-4 md:p-6 animate-in slide-in-from-bottom duration-500">
      <div className="max-w-lg mx-auto bg-card border border-border rounded-2xl shadow-lg p-5 md:p-6">
        <div className="flex items-start gap-3 mb-4">
          <Cookie className="w-6 h-6 text-primary shrink-0 mt-0.5" />
          <div>
            <h3 className="font-heading font-semibold text-foreground text-sm mb-1">Wij gebruiken cookies</h3>
            <p className="text-xs text-muted-foreground font-body leading-relaxed">
              Wij gebruiken cookies om uw ervaring te verbeteren en ons websiteverkeer te analyseren.{" "}
              <Link to="/cookie-policy" className="underline hover:text-primary transition-colors">
                Meer info
              </Link>
            </p>
          </div>
        </div>
        <div className="flex gap-2 justify-end">
          <Button variant="outline" size="sm" onClick={decline} className="text-xs">
            Weigeren
          </Button>
          <Button size="sm" onClick={accept} className="text-xs">
            Accepteren
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CookieBanner;
