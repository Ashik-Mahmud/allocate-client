import BookingAvailability from "@/components/dashboard/booking-availability/BookingAvailability";

export const metadata = {
  title: "Booking Availability",
  description: "Manage and view your booking availability to ensure optimal scheduling and resource allocation.",
};
export default function BookingAvailabilityPage() {
  return (
    <BookingAvailability />
  )
}