# 🌍 Traveloop

**Traveloop** is a sophisticated, full-stack travel planning application designed to help users organize multi-city itineraries, manage travel budgets, and coordinate packing lists with ease. Built with a modern **Next.js 15** frontend and a modular **Python/Flask** backend, Traveloop provides a seamless experience for both casual travelers and meticulous planners.

[![Watch the Demo](https://img.shields.io/badge/Demo-Video-red?style=for-the-badge&logo=google-drive)](https://drive.google.com/file/d/1Hh1EPZTUCFlhsfpROj_y3el4LBNkWz0V/view?usp=sharing)

---

## 🚀 Key Features

-   **Interactive Dashboard:** At-a-glance statistics on total trips, cities visited, and upcoming travel timelines.
-   **Multi-City Itinerary Builder:** Drag-and-drop city stops, planned arrival/departure dates, and activity logging.
-   **Dynamic Budget Management:** Real-time category breakdowns and target vs. planned spending charts powered by **Recharts**.
-   **Packing & Notes:** Integrated checklists and persistent travel notes for every trip stop.
-   **Authentication & Security:** Secure user sessions using **NextAuth.js v5** with a Prisma/SQLite adapter.
-   **Public Sharing:** Generate unique share codes to let friends or family view your itineraries.

---

## 🛠 Tech Stack

### Frontend
-   **Framework:** [Next.js 15 (App Router)](https://nextjs.org/)
-   **Language:** TypeScript
-   **Styling:** Tailwind CSS + [Shadcn UI](https://ui.shadcn.com/)
-   **State/Forms:** React Hook Form + Zod
-   **Charts:** [Recharts](https://recharts.org/)
-   **Animations:** Framer Motion
-   **Auth:** [NextAuth.js v5](https://authjs.dev/)
-   **ORM:** [Prisma](https://www.prisma.io/)

### Backend
-   **Framework:** [Flask](https://flask.palletsprojects.com/)
-   **Database:** SQLite (Managed via Prisma for the frontend, direct SQLite for Python services)
-   **Architecture:** RPC-style API for lightweight backend processing.

---

## 🏗 System Architecture

Traveloop utilizes a hybrid architecture:
1.  **Frontend-Heavy Logic:** Next.js handles the majority of the UI and CRUD operations via Prisma and Server Actions, ensuring a snappy, responsive feel.
2.  **RPC Backend Service:** A Python/Flask microservice provides specialized endpoints (e.g., city searches, dashboard calculations) through a flexible JSON-RPC interface.

### Backend RPC Endpoints (`main.py`)
| Function | Purpose |
| :--- | :--- |
| `get_dashboard_data` | Aggregates stats, upcoming trips, and recent activity. |
| `create_trip` | Initializes a new trip record with metadata. |
| `get_trip_details` | Recursively fetches stops, activities, budget, and packing items. |
| `add_stop` | Appends a new city to an existing itinerary. |
| `update_budget_item` | Upserts spending items with category-based locking. |
| `search_cities` | Interface for global city discovery. |

---

## 📂 Project Structure

```text
traveloop_src/
├── apps/
│   └── traveloop/
│       ├── backend/             # Python Flask API (RPC Service)
│       │   ├── data/db/         # Database storage
│       │   ├── main.py          # Backend entry point
│       │   ├── db.py            # Database connection logic
│       │   └── requirements.txt # Python dependencies
│       └── frontend/            # Next.js 15 Web Application
│           ├── app/             # App Router (Pages, Layouts, API)
│           ├── components/      # UI components (Shadcn, Recharts)
│           ├── prisma/          # Schema & Seed data
│           ├── public/assets/   # Static images & icons
│           ├── .env.example     # Environment template
│           └── package.json     # Frontend dependencies
├── scripts/                     # Utility and deployment scripts
├── Traveloop.pdf                # Vision & Architecture documentation
└── Traveloop_content.md         # Detailed feature requirements
```

---

## 📊 Data Model (Prisma Schema)

Traveloop's relational schema ensures data integrity across complex trip structures.

```prisma
model User {
  id            String    @id @default(cuid())
  email         String    @unique
  trips         Trip[]
  // ... auth fields
}

model Trip {
  id            String        @id @default(cuid())
  title         String
  startDate     DateTime
  endDate       DateTime
  budgetTarget  Float         @default(0)
  stops         Stop[]
  budgetItems   BudgetItem[]
  packingItems  PackingItem[]
  notes         Note[]
}

model Stop {
  id            String      @id @default(cuid())
  cityName      String
  arrivalDate   DateTime
  departureDate DateTime
  activities    Activity[]
}

model Activity {
  id            String       @id @default(cuid())
  title         String
  estimatedCost Float        @default(0)
  durationMins  Int
}
```

---

## 🚦 Getting Started

### Prerequisites
-   Node.js 18+
-   Python 3.10+

### Setup Frontend
1. Navigate to the frontend directory:
   ```bash
   cd traveloop_src/apps/traveloop/frontend/
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Initialize the database and seed demo data:
   ```bash
   npx prisma db push
   npx prisma db seed
   ```
4. Start the dev server:
   ```bash
   npm run dev
   ```

### Setup Backend
1. Navigate to the backend directory:
   ```bash
   cd traveloop_src/apps/traveloop/backend/
   ```
2. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```
3. Run the Flask service:
   ```bash
   python main.py
   ```

---

## 🧪 Demo Access
The application comes with a pre-seeded demo account for testing:
- **Email:** `demo@traveloop.app`
- **Password:** `Demo123!`

---

## 📺 Project Walkthrough
Watch the full demo here: [**Traveloop Demo Video**](https://drive.google.com/file/d/1Hh1EPZTUCFlhsfpROj_y3el4LBNkWz0V/view?usp=sharing)

---
