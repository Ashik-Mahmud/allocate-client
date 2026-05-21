# Allocate Dashboard Feature Inventory

## Scope
This file lists the frontend dashboard capabilities already present in Allocate. It is based on the `components/dashboard` and related feature modules.

## 1. Executive Dashboard Surfaces
- Org admin overview with organization KPIs, recent activity, low-credit alerts, and upgrade prompts.
- Staff overview with personal metrics, recent activity, usage history, top resources, and last transaction details.
- System/top-level navigation with dashboard topbar, sidebar, sidebar content, and account metrics controls.

## 2. Booking Operations
- Booking management list with search, status filters, resource filters, date-range filters, pagination, and sorting.
- Booking detail drawer and confirmation dialogs for review, approve, cancel, reschedule, and complete flows.
- Booking reminders and follow-up actions for operational follow-through.
- Booking availability view for current and upcoming slot visibility.
- Booking calendar with month navigation, resource selection, and status badges.

## 3. Resource Operations
- Resource list, create, filter, pagination, and metadata editing.
- Resource maintenance controls and resource status display.
- Resource rules form for booking policy, slot logic, and operational constraints.
- Current booked staff and available-slot views for live scheduling context.

## 4. Billing and Credits
- Billing management screen with plan summary, payment status, renewal awareness, and subscription metrics.
- Plan comparison and upgrade flow.
- Payment form and extend/upgrade drawer flow.
- Credit management for assigning credits to staff, review of credit history, and transaction badges.
- Org credit pool and credit usage insights.

## 5. Notifications and Inbox
- Notification center with unread count, mark-as-read, delete, clear-all, and search/filter support.
- Notification popover for quick access from the dashboard header.
- Real-time notification sync across the app.
- Reminder sending and inbox actions for booking and system alerts.

## 6. Staff Management
- Staff list and staff detail panels.
- Staff creation, update, deletion, and restore flows.
- Staff credit assignment and credit revoke flows.
- Staff credit transactions table and staff management forms.

## 7. Community and Collaboration
- Community main feed with org-wide and personal post views.
- Post detail view with comments, acknowledgements, and realtime comment updates.
- Community stats, trial prompts, and public/community card states.

## 8. Profile and Organization Settings
- Profile editing and password change.
- Organization profile update and org drawer flows.
- Verification and account-state support widgets.

## 9. Analytics and Insight Modules
- Booking stats, org overview pro, and executive summary views.
- Revenue analysis and financial overview.
- Resource analytics, staff engagement, critical alerts, and recommendations.
- Most-used resources, recent activity, and low-credit monitoring.

## 10. Shared Dashboard Utilities
- Component skeletons and empty/error states.
- Allocate drawers, popovers, confirmation alerts, and reusable list cards.
- Realtime event-driven updates for bookings, notifications, and community actions.

## Frontend Messaging Angle
- Org admins get control, finance visibility, and operational oversight.
- Staff get a focused queue, clear status, and fast actions.
- Platform control lives in the same product without exposing unnecessary complexity.