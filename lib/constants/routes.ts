export const ROUTES = {
  home: "/",
  pricing: "/pricing",
  signIn: "/sign-in",
  signUp: "/sign-up",
  dashboard: "/dashboard",
  dashboardAdmin: {
   
    users: "/dashboard/users",
    organizations: "/dashboard/organizations",
    settings: "/dashboard/settings",
    subscriptions: "/dashboard/subscriptions",
  },
  dashboardOrgAdmin: {
    bookingManagement: "/dashboard/booking-management",
    bookingStats: "/dashboard/booking-stats",
    resourcesManagement: "/dashboard/resources-management",
    staffManagement: "/dashboard/staff-management",
    creditManagement: "/dashboard/credit-management",
    billing: "/dashboard/billing",
  },
  dashboardStaff: {
    workQueue: "/dashboard/work-queue",
    dailyPlan: "/dashboard/daily-plan",
  },
  dashboardCommon: {
     staffOverview: "/dashboard/staff-overview",
     overview: "/dashboard/overview",
    bookingAvailability: "/dashboard/booking-availability",
    bookings: "/dashboard/bookings-calendar",
    myBookings: "/dashboard/my-bookings",
    resources: "/dashboard/resources",
    profile: "/dashboard/profile",
    notifications: "/dashboard/notifications",
  },
} as const;
