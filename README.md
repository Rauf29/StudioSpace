# StudioSpace — Peer-to-Peer Creative Workspace & Production Studio Sharing Platform

[![Next.js](https://img.shields.io/badge/Next.js-15.x-black?logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue?logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/TailwindCSS-v4-38bdf8?logo=tailwind-css)](https://tailwindcss.com/)
[![Better-Auth](https://img.shields.io/badge/Auth-Better--Auth-00897b)](https://better-auth.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

**StudioSpace** is a high-performance peer-to-peer marketplace designed for creators, filmmakers, photographers, podcasters, and musicians. Studio owners and hosts can list their creative spaces—ranging from photography daylight lofts and cinema soundstages to podcast suites, music recording facilities, and rehearsal rooms. Fellow creators can discover, filter by location & space type, verify real-time availability, and reserve studio hours with instant price transparency and zero double-booking collisions.

---

## 🌐 Live Application & Repositories

- **Live Client URL**: [https://studiospace-client.vercel.app](https://studiospace-client.vercel.app) *(Deploy your link here)*
- **Live Server API**: [https://studiospace-server.onrender.com](https://studiospace-server.onrender.com) *(Deploy your backend link here)*
- **Client Repository**: [StudioSpace Client (GitHub)](https://github.com/your-username/StudioSpace)
- **Server Repository**: [StudioSpace Server (GitHub)](https://github.com/your-username/StudioSpace-Server)

---

## 🔑 Examiner Test Credentials

For quick evaluation, use the following credentials or sign in instantly with **Google Social Auth**:

| Role | Email | Password | Access Level |
| :--- | :--- | :--- | :--- |
| **Examiner / Host Account** | `host@studiospace.com` | `Pass1234` | Full Host & Creator Dashboard |
| **Test Creator Account** | `creator@studiospace.com` | `Pass1234` | Studio Reservation & Booking |
| **Google Social Login** | Any valid Google account | One-Click Google Auth | Full Access |

---

## 🌟 5 Key Features

1. **Interactive Workspace Discovery & Multi-Field Filtering**:
   Explore 30+ production studios with instant filtering by **Locations**, **Space Type** (Photo Studio, Podcast Suite, Film Stage, Music Studio, Dance Rehearsal, Creator Loft), **Capacity**, **Live Keyword Search**, and multi-criteria **Price / Rating Sorting**.

2. **Real-Time Duration & Cost Calculator with Booking Modal**:
   Creators can select date, start hour, and end hour to calculate real-time shoot duration, hourly rate subtotal, and refundable security deposit. Submitting a reservation prevents hosts from booking their own spaces.

3. **Double-Booking Collision Prevention (Challenge 2)**:
   The backend MongoDB engine mathematically evaluates `startTime < requestedEndTime && endTime > requestedStartTime` against confirmed slots on that date to block double-booking clashes with HTTP 409 conflict notifications.

4. **Two-Sided Host & Creator Management Dashboards**:
   - **Host Dashboard (`/my-listings`)**: Manage published studios with live Edit & Delete confirmation modals, plus an incoming **"Bookings Received"** tab to confirm or decline guest reservation requests.
   - **Creator Reservations (`/my-bookings`)**: Track personal bookings with real-time status badges (`Pending`, `Confirmed`, `Completed`, `Cancelled`) and 1-click pending cancellation.

5. **Universal Dark / Light Theme Customization (Challenge 3)**:
   Seamless system-wide theme switching using `next-themes` and Tailwind CSS without UI flash. Adapts all typography, cards, headers, borders, and modal dialogs smoothly.

---

## 🛠️ Tech Stack

### Frontend (Client):
- **Framework**: Next.js 15+ (App Router, React 19)
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4, Lucide React Icons
- **Typography**: DM Sans (UI/Body) & Playfair Display (Headings)
- **Authentication**: Better-Auth (Credentials + Google OAuth with Remote JWKS token verification)
- **Feedback & Notifications**: React-Toastify & Custom Accessible Modals
- **Carousel**: Embla Carousel React & Slideshow Controllers

### Backend (Server):
- **Runtime**: Node.js & Express.js
- **Database**: MongoDB Native Driver (`mongodb`) with Atlas Cluster
- **Security & Tokens**: JWT Verification (`jose` & `jsonwebtoken` remote key validation)
- **Environment**: Dotenv, CORS, Cookie-Parser, Nodemon

---

## ⚡ Challenges Implemented

### Challenge 1: Secure Mutation Token Verification
Every state-mutating route (`POST /api/studios`, `PUT /api/studios/:id`, `DELETE /api/studios/:id`, `POST /api/bookings`, `PATCH /api/bookings/:id/status`, `PATCH /api/bookings/:id/cancel`) is guarded with `verifyToken` middleware checking remote JSON Web Keys (JWKS) to guarantee authentic creator identity.

### Challenge 2: Booking Double-Booking Prevention
Server-side overlap query checks existing `"Confirmed"` reservations for the given studio and date:
```javascript
const clash = await bookingsCol.findOne({
  studioId,
  date,
  status: 'Confirmed',
  startTime: { $lt: endTime },
  endTime: { $gt: startTime }
});
```
Collisions are rejected with HTTP 409 Conflict and feedback toast.

### Challenge 3: System-Wide Theme Toggle
Integrated `next-themes` provider with `<ThemeToggle />` supporting Light, Dark, and System modes with persistent local storage.

---

## 🚀 Local Setup Instructions

### 1. Clone the Repositories
```bash
git clone https://github.com/your-username/StudioSpace.git
git clone https://github.com/your-username/StudioSpace-Server.git
```

### 2. Client Setup (`StudioSpace`)
```bash
cd StudioSpace
npm install
```

Create `.env.local` inside `StudioSpace`:
```env
NEXT_PUBLIC_SERVER_URL=http://localhost:5001
BETTER_AUTH_SECRET=your_better_auth_secret
BETTER_AUTH_URL=http://localhost:3000
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
```

Run development server:
```bash
npm run dev
```
Client will be available at [http://localhost:3000](http://localhost:3000).

### 3. Server Setup (`StudioSpace-Server`)
```bash
cd ../StudioSpace-Server
npm install
```

Create `.env` inside `StudioSpace-Server`:
```env
PORT=5001
MONGODB_URI=your_mongodb_atlas_connection_string
DB_NAME=studiospace
CLIENT_URL=http://localhost:3000
JWT_SECRET=your_jwt_secret
```

Run backend server:
```bash
npm run dev
# or: nodemon index.js
```
Backend will run at [http://localhost:5001](http://localhost:5001).

---

## 📋 Verification Checklist

- [x] Minimum 15 notable commits on Client (20 Commits planned & executed)
- [x] Minimum 8 notable commits on Server (10 Commits completed)
- [x] No Lorem Ipsum placeholder text
- [x] Modern toast feedback with React-Toastify across all CRUD actions
- [x] Custom Studio 404 page with creative illustration & navigation
- [x] Route reload safety: Private routes never kick logged-in users to login on refresh
- [x] Fully responsive across Mobile, Tablet, and Desktop screens
- [x] Rebranded modern X logo used in footer

---

**Developed with ❤️ for the StudioSpace Creative Community.**
