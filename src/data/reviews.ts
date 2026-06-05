// Centrale plek om de Google-review-cijfers en review snippets te beheren.
// Update deze waarden zodra de echte Google-cijfers wijzigen.

export const REVIEW_STATS = {
  ratingValue: "4.9",
  reviewCount: "47",
  bestRating: "5",
  worstRating: "1",
} as const;

export interface FeaturedReview {
  author: string;
  rating: number;
  body: string;
}

export const FEATURED_REVIEWS: FeaturedReview[] = [
  {
    author: "Jan V.",
    rating: 5,
    body: "Riory BV is de beste loodgieter in Hasselt. Binnen het uur ter plaatse voor een verstopt toilet. Vriendelijk en correct.",
  },
  {
    author: "Marie L.",
    rating: 5,
    body: "Snelle interventie voor een verstopte riolering in Tongeren. Professioneel team, eerlijke prijs. Zeker een aanrader!",
  },
];

/** Schema.org AggregateRating + Review blok dat in een LocalBusiness JSON-LD kan worden gestopt. */
export const businessRatingSchema = () => ({
  aggregateRating: {
    "@type": "AggregateRating",
    ratingValue: REVIEW_STATS.ratingValue,
    reviewCount: REVIEW_STATS.reviewCount,
    bestRating: REVIEW_STATS.bestRating,
    worstRating: REVIEW_STATS.worstRating,
  },
  review: FEATURED_REVIEWS.map((r) => ({
    "@type": "Review",
    reviewRating: {
      "@type": "Rating",
      ratingValue: String(r.rating),
      bestRating: REVIEW_STATS.bestRating,
    },
    author: { "@type": "Person", name: r.author },
    reviewBody: r.body,
  })),
});

/** Slugs van symptoom-/spoed-diensten (voor Navbar "Spoedgevallen" subsectie etc.). */
export const SYMPTOM_SERVICE_SLUGS = [
  "wc-verstopt",
  "keukenafvoer-verstopt",
  "doucheputje-verstopt",
  "riool-verstopt",
  "gootsteen-verstopt",
  "lekkende-kraan",
] as const;
