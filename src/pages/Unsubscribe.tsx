import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { CheckCircle, XCircle, Loader2 } from "lucide-react";
import { useTranslation } from "react-i18next";

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;

type Status = "loading" | "valid" | "already" | "invalid" | "success" | "error";

const Unsubscribe = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const [status, setStatus] = useState<Status>("loading");
  const { t } = useTranslation();

  useEffect(() => {
    if (!token) { setStatus("invalid"); return; }
    fetch(`${SUPABASE_URL}/functions/v1/handle-email-unsubscribe?token=${token}`, {
      headers: { apikey: SUPABASE_ANON_KEY },
    })
      .then(r => r.json())
      .then(data => {
        if (data.valid === false && data.reason === "already_unsubscribed") setStatus("already");
        else if (data.valid) setStatus("valid");
        else setStatus("invalid");
      })
      .catch(() => setStatus("invalid"));
  }, [token]);

  const handleUnsubscribe = async () => {
    setStatus("loading");
    try {
      const { data } = await supabase.functions.invoke("handle-email-unsubscribe", { body: { token } });
      if (data?.success) setStatus("success");
      else if (data?.reason === "already_unsubscribed") setStatus("already");
      else setStatus("error");
    } catch { setStatus("error"); }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-6">
      <div className="max-w-md w-full text-center space-y-6">
        {status === "loading" && <Loader2 className="h-8 w-8 animate-spin mx-auto text-muted-foreground" />}
        {status === "valid" && (
          <>
            <h1 className="text-2xl font-bold text-foreground">{t("unsubscribe.title")}</h1>
            <p className="text-muted-foreground">{t("unsubscribe.question")}</p>
            <Button onClick={handleUnsubscribe} variant="destructive">{t("unsubscribe.confirm")}</Button>
          </>
        )}
        {status === "success" && (
          <>
            <CheckCircle className="h-12 w-12 text-green-500 mx-auto" />
            <h1 className="text-2xl font-bold text-foreground">{t("unsubscribe.successTitle")}</h1>
            <p className="text-muted-foreground">{t("unsubscribe.successMessage")}</p>
          </>
        )}
        {status === "already" && (
          <>
            <CheckCircle className="h-12 w-12 text-muted-foreground mx-auto" />
            <h1 className="text-2xl font-bold text-foreground">{t("unsubscribe.alreadyTitle")}</h1>
            <p className="text-muted-foreground">{t("unsubscribe.alreadyMessage")}</p>
          </>
        )}
        {(status === "invalid" || status === "error") && (
          <>
            <XCircle className="h-12 w-12 text-destructive mx-auto" />
            <h1 className="text-2xl font-bold text-foreground">{t("unsubscribe.invalidTitle")}</h1>
            <p className="text-muted-foreground">{t("unsubscribe.invalidMessage")}</p>
          </>
        )}
      </div>
    </div>
  );
};

export default Unsubscribe;
