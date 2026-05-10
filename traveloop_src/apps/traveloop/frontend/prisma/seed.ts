import bcrypt from "bcryptjs";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const passwordHash = await bcrypt.hash("Demo123!", 10);

  const user = await prisma.user.upsert({
    where: { email: "demo@traveloop.app" },
    update: {},
    create: {
      name: "Ava Carter",
      email: "demo@traveloop.app",
      passwordHash,
      location: "San Francisco, USA",
      image:
        "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=300&q=80",
    },
  });

  await prisma.trip.deleteMany({
    where: { ownerId: user.id },
  });

  const trips = [
    {
      title: "Tokyo Design Sprint",
      slug: "tokyo-design-sprint",
      description:
        "A high-energy week balancing design inspiration, ramen crawls, and quick rail jumps across Tokyo neighborhoods.",
      coverImage: "/assets/card-tokyo-1.jpg",
      startDate: new Date("2026-07-12"),
      endDate: new Date("2026-07-20"),
      status: "CONFIRMED",
      travelerCount: 2,
      budgetTarget: 4200,
      currency: "USD",
      stops: [
        {
          cityName: "Tokyo",
          country: "Japan",
          coverImage: "/assets/card-tokyo-1.jpg",
          summary: "Shibuya, Asakusa, Ginza, and a day trip to Hakone.",
          arrivalDate: new Date("2026-07-12"),
          departureDate: new Date("2026-07-20"),
          orderIndex: 0,
          activities: [
            {
              title: "TeamLab Borderless",
              description: "Immersive art experience to kick off the trip.",
              type: "CULTURE",
              location: "Azabudai Hills",
              durationMins: 150,
              estimatedCost: 45,
              orderIndex: 0,
            },
            {
              title: "Late-night ramen crawl",
              description: "Three neighborhood ramen spots with tasting notes.",
              type: "FOOD",
              location: "Shinjuku",
              durationMins: 180,
              estimatedCost: 60,
              orderIndex: 1,
            },
          ],
        },
      ],
      budgetItems: [
        { label: "Flights", category: "FLIGHTS", amount: 1450 },
        { label: "Hotels", category: "HOTELS", amount: 1280 },
        { label: "Food", category: "FOOD", amount: 620 },
        { label: "Transit", category: "TRANSPORT", amount: 210 },
      ],
      packingItems: [
        { label: "Universal adapter", category: "Essentials", quantity: 1, isPacked: true },
        { label: "Rain jacket", category: "Clothing", quantity: 1, isPacked: false },
        { label: "Camera battery", category: "Tech", quantity: 2, isPacked: false },
      ],
      notes: [
        {
          title: "Arrival game plan",
          content: "Activate Suica in Apple Wallet, grab pocket Wi-Fi, and head straight to hotel check-in.",
        },
      ],
      sharedTrip: { shareCode: "tokyo-loop-demo" },
    },
    {
      title: "Paris to Swiss Alps Escape",
      slug: "paris-swiss-alps-escape",
      description:
        "A slow luxury route through Paris, Lucerne, and Interlaken with scenic rail rides and alpine lake days.",
      coverImage: "/assets/card-swissalps-1.jpg",
      startDate: new Date("2026-09-03"),
      endDate: new Date("2026-09-14"),
      status: "PLANNING",
      travelerCount: 3,
      budgetTarget: 6100,
      currency: "USD",
      stops: [
        {
          cityName: "Paris",
          country: "France",
          coverImage: "/assets/card-paris-1.jpg",
          summary: "Boutique stay near Le Marais and museum-heavy first leg.",
          arrivalDate: new Date("2026-09-03"),
          departureDate: new Date("2026-09-07"),
          orderIndex: 0,
          activities: [
            {
              title: "Sunrise Louvre session",
              description: "Early entry and a compact route for the top galleries.",
              type: "CULTURE",
              location: "Louvre Museum",
              durationMins: 180,
              estimatedCost: 35,
              orderIndex: 0,
            },
          ],
        },
        {
          cityName: "Interlaken",
          country: "Switzerland",
          coverImage: "/assets/card-swissalps-1.jpg",
          summary: "Lake views, cable cars, and one high-impact mountain day.",
          arrivalDate: new Date("2026-09-08"),
          departureDate: new Date("2026-09-14"),
          orderIndex: 1,
          activities: [
            {
              title: "Harder Kulm sunset",
              description: "Golden hour mountain lookout and dinner reservation.",
              type: "OUTDOOR",
              location: "Harder Kulm",
              durationMins: 210,
              estimatedCost: 55,
              orderIndex: 0,
            },
          ],
        },
      ],
      budgetItems: [
        { label: "Flights", category: "FLIGHTS", amount: 1800 },
        { label: "Hotels", category: "HOTELS", amount: 2200 },
        { label: "Rail Pass", category: "TRANSPORT", amount: 710 },
      ],
      packingItems: [
        { label: "Thermal layer", category: "Clothing", quantity: 2, isPacked: false },
        { label: "Portable charger", category: "Tech", quantity: 1, isPacked: true },
      ],
      notes: [
        {
          title: "Budget note",
          content: "Swiss hotel pricing is the biggest swing variable. Lock this early.",
        },
      ],
      sharedTrip: { shareCode: "alps-loop-demo" },
    },
  ];

  for (const trip of trips) {
    await prisma.trip.create({
      data: {
        title: trip.title,
        slug: trip.slug,
        description: trip.description,
        coverImage: trip.coverImage,
        startDate: trip.startDate,
        endDate: trip.endDate,
        status: trip.status,
        travelerCount: trip.travelerCount,
        budgetTarget: trip.budgetTarget,
        currency: trip.currency,
        ownerId: user.id,
        stops: {
          create: trip.stops.map((stop) => ({
            ...stop,
            activities: {
              create: stop.activities,
            },
          })),
        },
        budgetItems: {
          create: trip.budgetItems,
        },
        packingItems: {
          create: trip.packingItems,
        },
        notes: {
          create: trip.notes.map((note) => ({
            ...note,
            authorId: user.id,
          })),
        },
        sharedTrip: {
          create: trip.sharedTrip,
        },
      },
    });
  }
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
