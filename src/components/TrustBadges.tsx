import { Shield, Clock, Zap, Star } from "lucide-react";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

const TrustBadges = () => {
  const [reviewCount, setReviewCount] = useState<number | null>(null);
  const [avgRating, setAvgRating] = useState<string>("5.0");

  useEffect(() => {
    const fetchStats = async () => {
      const { data, count } = await supabase
        .from("google_reviews")
        .select("rating", { count: "exact" });
      if (count !== null) setReviewCount(count);
      if (data && data.length > 0) {
        const avg = data.reduce((sum, r) => sum + r.rating, 0) / data.length;
        setAvgRating(avg.toFixed(1));
      }
    };
    fetchStats();
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
      icon: Star,
      label: reviewCount ? `${reviewCount}+ tevreden klanten` : "Tevreden klanten",
      sub: `${avgRating}★ beoordeeld`,
    },
    {
      icon: Shield,
      label: "Erkend & verzekerd",
      sub: "professioneel team",
    },
  ];

  return (
    <section className="bg-charcoal border-t border-white/10">
      <div className="section-container px-4 md:px-8 py-3 md:py-4">
        <div className="flex flex-wrap justify-center md:justify-between gap-x-6 gap-y-2 md:gap-4">
          {badges.map((badge, i) => (
            <div
              key={badge.label}
              className="flex items-center gap-2 px-2 py-1.5 md:px-3 md:py-2"
            >
              <badge.icon className="w-4 h-4 md:w-5 md:h-5 text-primary shrink-0" />
              <div>
                <p className="text-[11px] md:text-sm font-heading font-bold text-white/90 leading-tight whitespace-nowrap">
                  {badge.label}
                </p>
                <p className="text-[9px] md:text-xs text-white/50 font-body leading-tight">
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
