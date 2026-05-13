import { useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

const VISITOR_KEY = "riory_visitor_id";

const getVisitorId = (): string => {
  try {
    let id = localStorage.getItem(VISITOR_KEY);
    if (!id) {
      id = crypto.randomUUID();
      localStorage.setItem(VISITOR_KEY, id);
    }
    return id;
  } catch {
    return "anon";
  }
};

export const usePageView = (page: string) => {
  useEffect(() => {
    supabase.from("page_views").insert({
      page,
      referrer: document.referrer || null,
      user_agent: navigator.userAgent || null,
      visitor_id: getVisitorId(),
    }).then(() => {});
  }, [page]);
};
