"use client";
import { cn } from '@/lib/utils';
import { Clock, DatabaseSearch, LayoutGrid, List, Search } from 'lucide-react';
import React, { useEffect, useMemo, useState } from 'react'
import ResourceCard from './ResourceCard';
import { useGetBrowseResourcesListQuery, useResourcesListQuery } from '@/features/resources';
import { Resource, ResourceListFilters, ResourceType } from '@/types/resources';

type Props = {}

const StaffResourcesMain = (props: Props) => {
  const [view, setView] = React.useState<'grid' | 'list'>('grid');
  const [search, setSearch] = useState("");
  const [type, setType] = useState<"" | ResourceType>("");
  const [isAvailable, setIsAvailable] = useState<"" | "true" | "false">("");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [createOpen, setCreateOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [rulesOpen, setRulesOpen] = useState(false);
  const [selectedResource, setSelectedResource] = useState<Resource | null>(null);
  const [selectedResourceId, setSelectedResourceId] = useState<string | null>(null);
  const [selectedResourceName, setSelectedResourceName] = useState<string>("");

  useEffect(() => {
    setPage(1);
  }, [search, type, isAvailable, limit]);

  const filters = useMemo<ResourceListFilters>(
    () => ({
      page,
      limit,
      search: search || undefined,
      type: type || undefined,
      is_available: isAvailable === "" ? undefined : isAvailable === "true",
      sortBy: "createdAt",
      sortOrder: "desc",
    }),
    [isAvailable, limit, page, search, type]
  );

  const resourcesQuery = useGetBrowseResourcesListQuery(filters);


  return (
    <div className="mx-auto  space-y-8">
      {/* Header with Search & Filters */}
      <div className="flex flex-col md:flex-row gap-6 items-end justify-between">
        <div className="flex-1 space-y-4 w-full">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 size-5 text-slate-400" />
            <input
              placeholder="Search meeting rooms, equipment, or parking slots..."
              className="w-full h-14 pl-12 pr-4 bg-white dark:bg-slate-950 border-2 border-slate-100 dark:border-slate-800 rounded-2xl focus:border-blue-500 outline-none transition-all shadow-sm"
            />
          </div>

          {/* Quick Category Toggles */}
          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
            {['All', 'Rooms', 'Laptops', 'Studio', 'Parking'].map(cat => (
              <button key={cat} className="px-5 py-2 rounded-full border border-slate-200 dark:border-slate-800 text-sm font-bold whitespace-nowrap hover:bg-slate-50 dark:hover:bg-slate-900">
                {cat}
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

      {/* Stats / Info Bar */}
      <div className="flex items-center gap-6 p-4 rounded-2xl bg-primary/90 text-white shadow-lg shadow-blue-500/20">
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
      </div>

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
                onBook={() => { }}
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
    </div>
  );
}

export default StaffResourcesMain