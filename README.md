# StudioSpace — Peer-to-Peer Creative Workspace & Production Studio Sharing Platform

**StudioSpace** is a high-performance peer-to-peer marketplace designed for creators, filmmakers, photographers, podcasters, and musicians. Studio owners and hosts can list their creative spaces—ranging from photography daylight lofts and cinema soundstages to podcast suites, music recording facilities, and rehearsal rooms. Fellow creators can discover, filter by location & space type, verify real-time availability, and reserve studio hours with instant price transparency and zero double-booking collisions.

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
