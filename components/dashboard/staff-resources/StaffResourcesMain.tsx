"use client";
import { cn } from '@/lib/utils';
import { Clock, DatabaseSearch, LayoutGrid, List, Search } from 'lucide-react';
import React, { useMemo, useState } from 'react'
import ResourceCard from './ResourceCard';
import { useGetBrowseResourcesListQuery } from '@/features/resources';
import { Resource, ResourceListFilters, ResourceType } from '@/types/resources';
import { useFetchResourceAvailableSlots } from '@/features/bookings';
import { useRouter } from 'next/navigation';
import { ROUTES } from '@/lib/constants/routes';
import DialogPopup from '@/components/shared/dialog-popup';
import { Button } from '@/components/ui/button';
import { useDebounce } from '@/hooks';
import ShowAvailableSlots from './showAvailableSlots';
import { format, toDate } from "date-fns"
import CreateBooking from './CreateBooking';

const quickCategories: { label: string; value: "" | ResourceType }[] = [
  { label: 'All', value: '' },
  { label: 'Rooms', value: 'MEETING_ROOM' },
  { label: 'Workstations', value: 'WORKSTATION' },
  { label: 'Equipment', value: 'EQUIPMENT' },
  { label: 'Parking', value: 'PARKING' },
  { label: 'Collaboration Space', value: 'COLLABORATION_SPACE' },
  { label: 'IT Infrastructure', value: 'IT_INFRASTRUCTURE' },
  { label: 'Lockers', value: 'LOCKER' },
  { label: 'Kitchen Facilities', value: 'KITCHEN_FACILITY' },
  { label: 'Virtual License', value: 'VIRTUAL_LICENSE' },
  { label: 'Vehicles', value: 'VEHICLE' },
  { label: 'Health Safety', value: 'HEALTH_SAFETY' },
  { label: 'Other', value: 'OTHER' },
];


// use date-fns to get today's date in yyyy-mm-dd format
const getTodayDate = () => {
  return format(new Date(), 'yyyy-MM-dd');;
};


const StaffResourcesMain = () => {
  const router = useRouter();
  const [view, setView] = React.useState<'grid' | 'list'>('grid');
  const [search, setSearch] = useState("");
  const [type, setType] = useState<"" | ResourceType>("");
  const [slotsDialogOpen, setSlotsDialogOpen] = useState(false);
  const [dialogResource, setDialogResource] = useState<Resource | null>(null);
  const [dialogDate, setDialogDate] = useState(
    getTodayDate()
  );
  const [selectedSlot, setSelectedSlot] = useState<{ start: string; end: string } | null>(null);
  const [isOpenBookingDialog, setIsOpenBookingDialog] = useState(false);


  const debouncedSearch = useDebounce(search, 500);

  const filters = useMemo<ResourceListFilters>(
    () => ({
      page: 1,
      limit: 24,
      search: debouncedSearch || undefined,
      type: type || undefined,
      sortBy: "createdAt",
      sortOrder: "desc",
    }),
    [debouncedSearch, type]
  );

  const resourcesQuery = useGetBrowseResourcesListQuery(filters);



  const onShowSlots = (resourceId: string) => {
    const selected = resourcesQuery.data?.data?.find((item: Resource) => item.id === resourceId) ?? null;
    setDialogResource(selected);
    setDialogDate(getTodayDate());
    setSlotsDialogOpen(true);
  };

  const onReserveResource = (resource: Resource) => {
    // const query = new URLSearchParams({ resourceId, date: getTodayDate() }).toString();
    // router.push(`${ROUTES.dashboardCommon.bookingAvailability}?${query}`);
    setSelectedSlot({
      start: new Date().toISOString(),
      end: new Date(new Date().getTime() + 30 * 60 * 1000).toISOString(), // Default to 30 mins later
    }); // Reset any previously selected slot
    setDialogResource(resource);
    setIsOpenBookingDialog(true);

  };

  // get only available categories based on the resources returned from the API
  const getOnlyAvailableCategories = (category: { label: string; value: "" | ResourceType }) => {
    if (category.value === "") {
      return true;
    }
    return resourcesQuery.data?.metadata?.categories?.some((type: string) => type === category.value);
  };

  return (
    <div className="mx-auto  space-y-8">
      {/* Header with Search & Filters */}
      <div className="flex flex-col md:flex-row gap-6 items-end justify-between">
        <div className="flex-1 space-y-4 w-full">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 size-5 text-slate-400" />
            <input
              placeholder="Search meeting rooms, equipment, or parking slots..."
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              className="w-full h-14 pl-12 pr-4 bg-white dark:bg-slate-950 border-2 border-slate-100 dark:border-slate-800 rounded-2xl focus:border-blue-500 outline-none transition-all shadow-sm"
            />
          </div>

          {/* Quick Category Toggles */}
          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
            {quickCategories.filter(getOnlyAvailableCategories).map((category) => (
              <button
                key={category.label}
                type="button"
                onClick={() => setType(category.value)}
                className={cn(
                  "px-5 py-2 rounded-full border text-sm font-bold whitespace-nowrap transition-all",
                  category.value === type
                    ? "border-blue-500 bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300"
                    : "border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-900"
                )}
              >
                {category.label}
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-3 bg-slate-100 dark:bg-slate-900 p-1.5 rounded-2xl">
          <button onClick={() => setView('grid')} className={cn("p-2 rounded-xl transition-all", view === 'grid' ? "bg-white dark:bg-slate-800 shadow-sm" : "text-slate-500")}>
            <LayoutGrid className="size-5" />
          </button>
          <button onClick={() => setView('list')} className={cn("p-2 rounded-xl transition-all", view === 'list' ? "bg-white dark:bg-slate-800 shadow-sm" : "text-slate-500")}>
            <List className="size-5" />
          </button>
        </div>
      </div>


      {/* Slots dialog is used instead of inline availability panel */}

      {/* Stats / Info Bar */}
      {/* <div className="flex items-center gap-6 p-4 rounded-2xl bg-primary/90 text-white shadow-lg shadow-blue-500/20">
        <div className="flex -space-x-3">
          {[1, 2, 3].map(i => (
            <div key={i} className="size-8 rounded-full border-2 border-primary bg-slate-200 overflow-hidden">
              <img src={`https://i.pravatar.cc/150?u=${i}`} alt="" />
            </div>
          ))}
        </div>
        <p className="text-sm font-medium">
          <span className="font-bold">12 Staff Members</span> currently have active bookings.
        </p>
        <div className="ml-auto flex items-center gap-2 text-xs font-bold bg-primary/50 px-3 py-1.5 rounded-lg">
          <Clock className="size-3" />
          Next Free Slot: 2:00 PM
        </div>
      </div> */}

      {/* The Grid */}
      <div className={cn(
        "grid gap-6",
        view === 'grid' ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3" : "grid-cols-1"
      )}>
        {/* Map your resources here */}
        {
          resourcesQuery?.isLoading ? (
            [1, 2, 3, 4, 5, 6].map(i => (
              <div key={i} className="animate-pulse rounded-3xl bg-slate-200 dark:bg-slate-800 h-48" />
            ))
          ) : resourcesQuery?.data?.data?.length ? (
            resourcesQuery?.data?.data?.map((resource: Resource) => (
              <ResourceCard
                key={resource.id}
                resource={resource as Resource}
                view={view}
                onBook={
                  (id: string) => onReserveResource(resource)
                }
                onShowSlots={onShowSlots}
              />
            ))) : (
            <div className="col-span-full text-center py-20">
              {/* empty icon */}
              <DatabaseSearch className="size-12 mx-auto mb-4 text-slate-400" />
              <p className="text-2xl font-semibold text-slate-900 dark:text-slate-100">No resources found.</p>
              <p className="text-base text-slate-500 dark:text-slate-400">No resources found. Try adjusting your search or filters.</p>
            </div>
          )
        }


      </div>
      {/* Slots Dialog */}
      <DialogPopup
        open={slotsDialogOpen}
        onOpenChange={(open) => {
          setSlotsDialogOpen(open);
          if (!open) {
            setDialogResource(null);
          }
        }}
        title={dialogResource ? `Available slots — ${dialogResource.name}` : "Available slots"}
        description={dialogResource ? `Pick a date to view available slots for ${dialogResource.name}.` : "Pick a resource and date to view slots."}
        size="md"
        className='p-0'
      >
        <ShowAvailableSlots
          onSlotConfirm={
            (date) => {
              setSlotsDialogOpen(false);
              setSelectedSlot(date);
              setIsOpenBookingDialog(true);
            }
          }
          dialogResource={dialogResource}
          dialogDate={dialogDate}
          setDialogDate={setDialogDate}
          setSlotsDialogOpen={setSlotsDialogOpen}
          slotsDialogOpen={slotsDialogOpen}
        />
      </DialogPopup>

      {/* Create booking dialog */}
      <DialogPopup
        open={isOpenBookingDialog}
        onOpenChange={setIsOpenBookingDialog}
        title="Confirm Booking"
        description="Review the details and confirm your booking."
        size="md"
        className='p-0'
      >
        {dialogResource && <CreateBooking
          onSubmit={(data) => console.log(data)}
          resource={dialogResource}
          selectedSlot={selectedSlot!}
          onBack={() => {
            setIsOpenBookingDialog(false);
            setSlotsDialogOpen(true)
          }}
        />}
      </DialogPopup>



    </div>
  );
}

export default StaffResourcesMain