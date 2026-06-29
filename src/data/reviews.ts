// Centrale plek om de Google-review-cijfers en review snippets te beheren.
// Update deze waarden zodra de echte Google-cijfers wijzigen.

export const REVIEW_STATS = {
  ratingValue: "4.9",
  reviewCount: "109",
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
    author: "Jurgen Machiels",
    rating: 5,
    body: "Super service. Eerlijke prijs. Zeer snelle reactie op contactformulier. Top gasten. En het probleem volledig opgelost. Zeker en vast aanraders 100%",
  },
  {
    author: "Arnaud Ronda",
    rating: 5,
    body: "Heel snel geholpen, vriendelijk en uitermate vakkundig! En gezien het geleverde werk zeker eerlijk en geen prijsverrassingen. Super tevreden! Een echte aanrader.",
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
  "lekkage-opsporen",
  "dakgootreiniging",
  "rioolreparatie",
  "rioolvliegjes",
] as const;
