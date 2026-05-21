# Allocate Product Features Overview

## Project Summary
Allocate is a multi-tenant workspace and resource allocation backend built with NestJS, Prisma, and PostgreSQL. It manages organizations, staff, resources, bookings, credits, subscriptions, notifications, payments, and community-style internal communication.

## Suggested Frontend Stack
- Next.js or React
- Tailwind CSS
- shadcn/ui
- Lucide icons
- Recharts or Tremor for analytics

## Core Product Areas

### 1. Authentication and Access Control
- Email/password registration and login
- JWT access and refresh token flow
- Forgot password and change password flows
- Email verification flow
- Role-based access control for `ADMIN`, `ORG_ADMIN`, and `STAFF`
- Throttling on auth endpoints

### 2. Organization Management
- Create and manage organizations
- Update organization profile, branding, and settings
- Support for plan types: `FREE`, `PRO`, `ENTERPRISE`
- Organization credit pool management
- Trial activation and subscription lifecycle handling

### 3. Resource Management
- Create, update, delete, and list resources
- Support for resource types such as meeting rooms, desks, and other bookable assets
- Resource metadata support for capacity and custom details
- Availability, active status, maintenance status, and occupancy state
- Hourly pricing for resource usage

### 4. Resource Rules and Scheduling Logic
- Opening and closing hours
- Minimum lead time
- Maximum booking hours
- Buffer time between bookings
- Slot duration configuration
- Weekend availability toggle
- Available days configuration

### 5. Booking System
- Create bookings for resources
- Update booking status: `PENDING`, `CONFIRMED`, `REJECTED`, `CANCELLED`, `COMPLETED`, `CHECKED_IN`
- Reschedule bookings
- Update booking details and notes
- Check availability for a specific date or date range
- View personal bookings and organization-wide bookings
- Search, filter, pagination, and sorting for booking lists

### 6. Credits and Payments
- Credit transaction tracking
- Organization credit pool and user personal credits
- Subscription model with payment status tracking
- Checkout flow support for Stripe and SSLCOMMERZ
- Webhook and IPN handling for payment providers
- Trial activation support

### 7. Notifications and Inbox
- In-app notifications
- Mark notification as read
- Mark all as read
- Delete a notification
- Clear all notifications
- Unread notification count
- Manual reminder sending
- Notification list with search, filters, and pagination

### 8. Dashboard and Analytics
- Org admin dashboard metrics
- Staff dashboard metrics
- System admin dashboard metrics
- Credit usage insights
- Booking and resource summary cards
- Revenue, subscription, and organization analytics

### 9. Community and Internal Updates
- Organization community posts
- Post visibility and status controls
- Comments and acknowledgements support
- Real-time community events

### 10. Admin and Platform Controls
- Platform-wide administration
- User and organization management
- Support for system settings and alerts
- Activity log tracking
- Subscription monitoring and expiring plan alerts

### 11. Real-time Infrastructure
- WebSocket-based realtime notifications
- Realtime inbox and community updates
- Event-driven UX improvements for booking and alerts

## Prisma Data Model Highlights
- `User`
- `Organizations`
- `Resources`
- `ResourcesRule`
- `Bookings`
- `Subscription`
- `CreditTransaction`
- `Notification`
- `ActivityLog`
- `Invitation`
- `SalesInquiry`
- `CommunityHub`
- `SystemSettings`

## UX Themes For The Frontend
- Clean enterprise SaaS design
- Strong card-based dashboards
- Clear hierarchy for metrics, charts, and tables
- Status chips for booking and subscription states
- Empty states for no bookings, no notifications, and no resources
- Sidebar navigation with nested organization and admin sections
- Mobile-friendly layouts for staff and admin flows

## Visual Direction For Tailwind + shadcn/ui
- Use `bg-background`, `text-foreground`, and muted surfaces for structure
- Prefer soft borders, layered cards, and subtle gradients
- Use shadcn components like `Card`, `Badge`, `Dialog`, `DropdownMenu`, `Tabs`, `Table`, `Sheet`, `Calendar`, `Toast`, and `Command`
- Include charts for revenue, booking trends, and credit distribution
- Use accessible spacing and strong contrast for enterprise dashboards

## Suggested Frontend Pages
- Landing page
- Features page
- Case study page
- Pricing page
- Auth pages
- Dashboard pages
- Resource management page
- Booking calendar page
- Inbox / notifications center
- Admin control center
