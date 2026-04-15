import { Shield, Clock, Users, Award, Zap, CheckCircle } from "lucide-react";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

const TrustBadges = () => {
  const [reviewCount, setReviewCount] = useState<number | null>(null);

  useEffect(() => {
    const fetchCount = async () => {
      const { count } = await supabase
        .from("google_reviews")
        .select("id", { count: "exact", head: true });
      if (count !== null) setReviewCount(count);
    };
    fetchCount();
  }, []);

  const badges = [
    {
      icon: Clock,
      label: "24/7 beschikbaar",
      sub: "voor noodgevallen",
    },
    {
      icon: Zap,
      label: "Snelle interventie",
      sub: "binnen het uur",
    },
    {
      icon: Users,
      label: reviewCount ? `${reviewCount}+ tevreden klanten` : "Tevreden klanten",
      sub: "5★ beoordeeld",
    },
    {
      icon: Shield,
      label: "Erkend & verzekerd",
      sub: "professioneel team",
    },
  ];

  return (
    <section className="bg-primary">
      <div className="section-container px-6 md:px-8 py-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
          {badges.map((badge) => (
            <div
              key={badge.label}
              className="flex items-center gap-3 px-3 py-2.5"
            >
              <badge.icon className="w-6 h-6 text-primary-foreground/90 shrink-0" />
              <div>
                <p className="text-xs md:text-sm font-heading font-bold text-primary-foreground leading-tight">
                  {badge.label}
                </p>
                <p className="text-[10px] md:text-xs text-primary-foreground/70 font-body">
                  {badge.sub}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TrustBadges;
