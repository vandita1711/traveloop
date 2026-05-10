export const tripCoverOptions = [
  { label: "Tokyo Neon", value: "/assets/card-tokyo-1.jpg" },
  { label: "Paris Classics", value: "/assets/card-paris-1.jpg" },
  { label: "Swiss Alps Escape", value: "/assets/card-swissalps-1.jpg" },
  { label: "Santorini Coast", value: "/assets/card-santorini-1.jpg" },
  { label: "Coastal Journey", value: "/assets/hero-coastal-2.jpg" },
];

export const cityCatalog = [
  {
    cityName: "Tokyo",
    country: "Japan",
    airport: "HND / NRT",
    timezone: "GMT+9",
    averageDailyBudget: 220,
    image: "/assets/card-tokyo-1.jpg",
    blurb: "Fast-moving neighborhoods, design spots, food trails, and rail-friendly day trips.",
  },
  {
    cityName: "Paris",
    country: "France",
    airport: "CDG / ORY",
    timezone: "GMT+1",
    averageDailyBudget: 260,
    image: "/assets/card-paris-1.jpg",
    blurb: "Museums, cafes, river walks, and compact itinerary planning around iconic districts.",
  },
  {
    cityName: "Bali",
    country: "Indonesia",
    airport: "DPS",
    timezone: "GMT+8",
    averageDailyBudget: 140,
    image: "/assets/hero-coastal-1.jpg",
    blurb: "Wellness stays, beach clubs, waterfalls, and remote-work-friendly villa zones.",
  },
  {
    cityName: "Dubai",
    country: "United Arab Emirates",
    airport: "DXB",
    timezone: "GMT+4",
    averageDailyBudget: 280,
    image: "/assets/hero-terminal-1.jpg",
    blurb: "Luxury skyline energy, desert excursions, and premium dining moments.",
  },
  {
    cityName: "Interlaken",
    country: "Switzerland",
    airport: "ZRH",
    timezone: "GMT+1",
    averageDailyBudget: 310,
    image: "/assets/card-swissalps-1.jpg",
    blurb: "Alpine train rides, mountain viewpoints, and crisp lakeside downtime.",
  },
  {
    cityName: "Santorini",
    country: "Greece",
    airport: "JTR",
    timezone: "GMT+2",
    averageDailyBudget: 240,
    image: "/assets/card-santorini-1.jpg",
    blurb: "Cliffside stays, blue-water views, and sunset-heavy island pacing.",
  },
];

export const activityTypeOptions = [
  "SIGHTSEEING",
  "FOOD",
  "OUTDOOR",
  "CULTURE",
  "SHOPPING",
  "NIGHTLIFE",
  "WELLNESS",
  "TRANSPORT",
] as const;

export function findCityByName(cityName: string) {
  return cityCatalog.find(
    (city) => city.cityName.toLowerCase() === cityName.trim().toLowerCase(),
  );
}
