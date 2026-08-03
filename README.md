

# Allocate

**Allocate** is a resource and workforce management platform that helps organizations handle shared assets, credit budgets, and team bookings in real time.

It brings together administrative management, automated booking policies, realtime updates, and billing into a clean, operational dashboard.

---

## 🔗 Links

* **Live Application:** [useallocate.vercel.app](https://useallocate.vercel.app/)
* **Backend Repository:** [github.com/Ashik-Mahmud/allocate-server](https://github.com/Ashik-Mahmud/allocate-server)

---



## What Allocate Does

Allocate solves the operational friction of sharing limited organization resources—from equipment to room slots—by automating how teams book, track, and pay for usage.

```text
 Administrative Control              Smart Scheduling               Automated Lifecycle
 ┌──────────────────────┐         ┌────────────────────┐         ┌──────────────────────┐
 │ • Staff & Roles      │  ─────► │ • Calendar & Rules │  ─────► │ • Auto Check-in/out  │
 │ • Credit Budgets     │         │ • Realtime Sync    │         │ • Notifications      │
 └──────────────────────┘         └────────────────────┘         └──────────────────────┘

```

### 🗓️ Smart Resource Scheduling & Availability

* **Calendar-Based Booking:** Interactive calendars show live availability across all company assets to eliminate double-booking.
* **Rules & Policy Engine:** Admins define booking rules, lock times, peak-demand buffers, and rescheduling limits.
* **Active Timers & Countdown:** Live countdown timers keep staff aware of upcoming and active reservation windows.

### 💳 Credit Budgets & Usage Analytics

* **Credit Allowance System:** Admins assign and track credit budgets per team member or department.
* **Forecasting & Demand Insights:** Visual analytics track peak usage trends and forecast future credit consumption.
* **Automated Low-Credit Alerts:** System triggers warnings before credit depletion halts team operations.

### 🤖 AI-Assisted Operations

* **Refined Notes & Reasons:** AI helps staff quickly draft clear booking notes and auto-generates structured cancellation reasons.
* **Admin Insights:** Summarizes reservation patterns to help managers optimize resource distribution.

### ⚡ Realtime Operations & Omnichannel Alerts

* **Live Synchronization:** WebSockets keep schedules, status changes, and notifications updated instantly across all connected screens.
* **Multi-Channel Delivery:** Keeps staff and admins in sync through In-App alerts, Email, SMS, WhatsApp, and Push notifications.
* **Automated Life-Cycle Triggers:** Handles automatic check-ins, check-outs, pending approval reminders, and follow-ups in the background.

### 🧾 Invoicing & Payment Processing

* **Subscription Management:** Built to handle local and global payment gateways (SSLCommerz and Stripe) with proper IPN handling.
* **PDF Invoice Generation:** Automatically creates downloadable invoices for billing cycles.

---

## Tech Stack

* **Frontend:** React, Next.js (App Router), TypeScript, Tailwind CSS
* **Backend:** NestJS, TypeScript
* **Database:** PostgreSQL (Prisma ORM)
* **Realtime:** Socket.IO
* **Analytics:** Recharts
* **Deployment:** Vercel (Client), Render (Backend)

---

## Engineering Highlights

* **Centralized Realtime Provider:** Custom Socket.IO hooks normalize events and prevent memory leaks across screens.
* **Robust Webhooks (IPN):** Safe payment callback handling for SSLCommerz and Stripe, including local development proxy setup.
* **Clean Domain Structure:** Business logic is kept in `features/*` while keeping Next.js route components purely presentation-focused.

---

## 📸 Screenshots

#### 📊 Pro Dashboard Overview
![Pro Organization Dashboard](/public/assets/org/pro_org_dashboard.png "Pro Organization Dashboard")
> Centralized view for organization stats, real-time activity, and resource usage.

#### 📅 Booking Management
![Booking Management Interface](/public/assets/org/booking_management.png "Booking Management Interface")
> Administrative controls for active reservations, booking rules, and status updates.

#### 💳 Billing & Credit Management
| Billing Management | Credit Management |
| :---: | :---: |
| ![Billing Management](/public/assets/org/billing_management.png "Billing Management") | ![Credit Management Dashboard](/public/assets/org/credit_management.png "Credit Management Dashboard") |

#### 🗓️ Staff Availability Calendar
![Staff Availability Calendar](/public/assets/staff/availability_calendar.png "Staff Availability Calendar")
> Interactive calendar view for staff members to check asset availability and reserve slots.

## Local Development

```bash
# Clone repository
git clone https://github.com/Ashik-Mahmud/allocate-client.git
cd allocate-client

# Install dependencies
pnpm install

# Start local server
pnpm dev

```

App runs locally at `