import BookingsCalendarMain from "@/components/dashboard/bookings-calendar/BookingsCalendarMain";

export const metadata = {
  title: "Bookings Calendar",
  description: "View and manage your bookings with our intuitive calendar interface, designed to help you stay organized and efficient.",
};
export default function BookingsPage() {
  return (
   <BookingsCalendarMain />
  );
}