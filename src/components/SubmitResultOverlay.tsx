import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { CheckCircle2, XCircle, RotateCcw } from "lucide-react";
import { useTranslation } from "react-i18next";

interface SubmitResultOverlayProps {
  status: "success" | "error" | null;
  retryCount?: number;
  onClose: () => void;
  onRetry?: () => void;
  onStartOver?: () => void;
  successTitle?: string;
  successMessage?: string;
  errorTitle?: string;
  errorMessage?: string;
}

const SubmitResultOverlay = ({
  status,
  retryCount = 0,
  onClose,
  onRetry,
  onStartOver,
  successTitle,
  successMessage,
  errorTitle,
  errorMessage,
}: SubmitResultOverlayProps) => {
  const [visible, setVisible] = useState(false);
  const { t } = useTranslation();

  const successTitleFinal = successTitle ?? t("submitOverlay.successTitle");
  const successMessageFinal = successMessage ?? t("submitOverlay.successMessage");
  const errorTitleFinal = errorTitle ?? t("submitOverlay.errorTitle");
  const errorMessageFinal = errorMessage ?? t("submitOverlay.errorMessage");

  useEffect(() => {
    if (status) {
      requestAnimationFrame(() => setVisible(true));
    } else {
      setVisible(false);
    }
  }, [status]);

  if (!status) return null;

  const handleClose = () => {
    setVisible(false);
    setTimeout(onClose, 400);
  };

  const handleRetry = () => {
    setVisible(false);
    setTimeout(() => {
      onClose();
      onRetry?.();
    }, 400);
  };

  const handleStartOver = () => {
    setVisible(false);
    setTimeout(() => {
      onClose();
      onStartOver?.();
    }, 400);
  };

  const showStartOver = retryCount >= 1;

  return (
    <div
      className={`fixed inset-0 z-[9999] flex items-center justify-center transition-all duration-500 ${
        visible ? "opacity-100" : "opacity-0"
      }`}
      style={{ backdropFilter: "blur(8px)" }}
    >
      <div
        className={`absolute inset-0 transition-opacity duration-500 ${
          visible ? "opacity-90" : "opacity-0"
        } bg-background`}
      />

      <div
        className={`relative flex flex-col items-center text-center px-8 py-12 max-w-md transition-all duration-700 ${
          visible ? "scale-100 translate-y-0 opacity-100" : "scale-75 translate-y-8 opacity-0"
        }`}
      >
        {status === "success" ? (
          <>
            <div className="relative mb-8">
              <div
                className={`w-28 h-28 rounded-full border-4 border-primary flex items-center justify-center transition-all duration-700 delay-200 ${
                  visible ? "scale-100 opacity-100" : "scale-0 opacity-0"
                }`}
              >
                <CheckCircle2
                  className={`w-14 h-14 text-primary transition-all duration-500 delay-500 ${
                    visible ? "scale-100 opacity-100" : "scale-0 opacity-0"
                  }`}
                />
              </div>
              <div className="absolute inset-0 w-28 h-28 rounded-full border-2 border-primary/30 animate-ping" />
              <div className="absolute -inset-3 w-34 h-34 rounded-full border border-primary/10 animate-pulse" />
            </div>

            <h2
              className={`text-3xl font-heading font-bold text-foreground mb-3 transition-all duration-500 delay-300 ${
                visible ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
              }`}
            >
              {successTitleFinal}
            </h2>
            <p
              className={`text-muted-foreground font-body text-lg mb-10 transition-all duration-500 delay-500 ${
                visible ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
              }`}
            >
              {successMessageFinal}
            </p>

            <Button
              variant="cta"
              size="lg"
              onClick={handleClose}
              className={`px-10 py-6 text-base transition-all duration-500 delay-700 ${
                visible ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
              }`}
            >
              {t("submitOverlay.close")}
            </Button>
          </>
        ) : (
          <>
            <div className="relative mb-8">
              <div
                className={`w-28 h-28 rounded-full border-4 border-destructive flex items-center justify-center transition-all duration-700 delay-200 ${
                  visible ? "scale-100 opacity-100" : "scale-0 opacity-0"
                }`}
              >
                <XCircle
                  className={`w-14 h-14 text-destructive transition-all duration-500 delay-500 ${
                    visible ? "scale-100 opacity-100" : "scale-0 opacity-0"
                  }`}
                />
              </div>
            </div>

            <h2
              className={`text-3xl font-heading font-bold text-foreground mb-3 transition-all duration-500 delay-300 ${
                visible ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
              }`}
            >
              {errorTitleFinal}
            </h2>
            <p
              className={`text-muted-foreground font-body text-lg mb-10 transition-all duration-500 delay-500 ${
                visible ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
              }`}
            >
              {showStartOver ? t("submitOverlay.errorRetry") : errorMessageFinal}
            </p>

            <div
              className={`flex gap-4 transition-all duration-500 delay-700 ${
                visible ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
              }`}
            >
              <Button variant="outline" size="lg" onClick={handleClose} className="px-8 py-6 text-base">
                {t("submitOverlay.close")}
              </Button>
              {showStartOver ? (
                onStartOver && (
                  <Button variant="cta" size="lg" onClick={handleStartOver} className="px-8 py-6 text-base gap-2">
                    <RotateCcw className="w-4 h-4" />
                    {t("submitOverlay.startOver")}
                  </Button>
                )
              ) : (
                onRetry && (
                  <Button variant="cta" size="lg" onClick={handleRetry} className="px-8 py-6 text-base gap-2">
                    <RotateCcw className="w-4 h-4" />
                    {t("submitOverlay.retry")}
                  </Button>
                )
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default SubmitResultOverlay;
