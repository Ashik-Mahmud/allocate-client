'use client';

import React, { useState } from 'react';
import { ChevronDown, Building2 } from 'lucide-react';
import type { Organization } from '../AdminOverview/types';
import { PLAN_COLORS } from '../AdminOverview/constants';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface TopOrganizationsProps {
  data?: Organization[];
}

type SortField = 'name' | 'creditConsumption' | 'creditPool' | 'staffCount' | 'totalAssignedCredits';

const TopOrganizations: React.FC<TopOrganizationsProps> = ({ data = [] }) => {
  const [sortBy, setSortBy] = useState<SortField>('creditPool');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  const handleSort = (field: SortField) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('desc');
    }
  };

  const sortedData = [...(data ?? [])].sort((a, b) => {
    let aVal: any = a[sortBy];
    let bVal: any = b[sortBy];

    if (typeof aVal === 'string') {
      aVal = aVal?.toLowerCase() ?? '';
      bVal = (bVal as string)?.toLowerCase() ?? '';
    }

    if (sortOrder === 'asc') {
      return aVal > bVal ? 1 : -1;
    }
    return aVal < bVal ? 1 : -1;
  });

  const SortHeader = ({
    label,
    field,
    className = '',
  }: {
    label: string;
    field: SortField;
    className?: string;
  }) => (
    <button
      onClick={() => handleSort(field)}
      className={`flex items-center gap-2 font-medium text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-slate-100 transition-colors ${className}`}
    >
      {label}
      <ChevronDown
        className={`w-4 h-4 transition-transform ${sortBy === field ? (sortOrder === 'asc' ? 'rotate-180' : '') : 'opacity-40'
          }`}
      />
    </button>
  );

  return (
    <div className="rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950/40 p-6">
     
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">Top Organizations</h3>
        <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
          {sortedData?.length ?? 0} organizations managing your platform
        </p>
      </div>

      {/* Desktop Table View */}
      <div className="hidden lg:block overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate-200 dark:border-slate-800">
              <th className="text-left py-3 px-4">
                <SortHeader label="Organization" field="name" />
              </th>
              <th className="text-left py-3 px-4">
                <span className="font-medium text-slate-700 dark:text-slate-300">Plan</span>
              </th>
              <th className="text-left py-3 px-4">
                <SortHeader label="Staff" field="staffCount" />
              </th>
              <th className="text-left py-3 px-4">
                <SortHeader label="Credits Usage" field="creditConsumption" />
              </th>

              <th className="text-left py-3 px-4">
                <SortHeader label="Current Credits Pool" field="creditPool" />
              </th>
              <th className="text-left py-3 px-4">
                <SortHeader label="Total Sold Credits" field="totalAssignedCredits" />
              </th>
            </tr>
          </thead>
          <tbody>
            {sortedData?.map((org) => {
              const colors = PLAN_COLORS[org?.planType ?? 'FREE'];
              const createdDate = new Date(org?.createdAt ?? '').toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
              });

              return (
                <tr
                  key={org?.id}
                  className="border-b border-slate-100 dark:border-slate-900 hover:bg-slate-50 dark:hover:bg-slate-900/20 transition-colors"
                >
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-3">
                      <div className={`${colors.bg} rounded-lg p-2`}>
                        <Building2 className={`w-4 h-4 ${colors.text}`} />
                      </div>
                      <div>
                        <p className="font-medium text-slate-900 dark:text-slate-100">{org?.name}</p>
                        <p className="text-xs text-slate-500 dark:text-slate-400">Created {createdDate}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <span className={`${colors.badge} px-2.5 py-1 rounded-full text-xs font-semibold`}>
                      {org?.planType}
                    </span>
                  </td>
                  <td className="py-4 px-4">
                    <p className="text-slate-700 dark:text-slate-300 font-medium">{org?.staffCount ?? 0}</p>
                  </td>
                  <td className="py-4 px-4">
                    <p className="text-slate-700 dark:text-slate-300 font-medium">CR {org?.creditConsumption ?? 0}</p>
                  </td>

                  <td className="py-4 px-4">
                    <p className="text-slate-700 dark:text-slate-300 font-medium">
                      CR {(org?.creditPool ?? 0).toLocaleString()}
                    </p>
                  </td>
                  <td className="py-4 px-4">
                    <p className="text-slate-700 dark:text-slate-300 font-medium">CR {org?.totalAssignedCredits ?? 0}</p>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Mobile Card View */}
      <div className="lg:hidden grid grid-cols-1 sm:grid-cols-2 gap-4">
        {sortedData?.map((org) => {
          const colors = PLAN_COLORS[org?.planType ?? 'FREE'];
          const createdDate = new Date(org?.createdAt ?? '').toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
          });

          return (
            <div
              key={org?.id}
              className={`${colors.bg} rounded-lg border border-slate-200/50 dark:border-slate-700/50 p-4`}
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div className={`${colors.bg} rounded-lg p-2`}>
                    <Building2 className={`w-4 h-4 ${colors.text}`} />
                  </div>
                  <div>
                    <p className="font-medium text-slate-900 dark:text-slate-100 text-sm">{org?.name}</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">Created {createdDate}</p>
                  </div>
                </div>
                <span className={`${colors.badge} px-2 py-1 rounded-full text-xs font-semibold`}>
                  {org?.planType}
                </span>
              </div>

              <div className="grid grid-cols-3 gap-2 text-xs">
                <div>
                  <p className="text-slate-600 dark:text-slate-400 font-medium">Staff</p>
                  <p className="font-bold text-slate-900 dark:text-slate-100 mt-1">{org?.staffCount ?? 0}</p>
                </div>
                <div>
                  <p className="text-slate-600 dark:text-slate-400 font-medium">Used</p>
                  <p className="font-bold text-slate-900 dark:text-slate-100 mt-1">{org?.creditConsumption ?? 0}</p>
                </div>
                <div>
                  <p className="text-slate-600 dark:text-slate-400 font-medium">Available</p>
                  <p className="font-bold text-slate-900 dark:text-slate-100 mt-1">
                    {(org?.creditPool ?? 0).toLocaleString()}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {!sortedData || sortedData.length === 0 ? (
        <div className="text-center py-12">
          <Building2 className="w-12 h-12 text-slate-300 dark:text-slate-700 mx-auto mb-3" />
          <p className="text-slate-500 dark:text-slate-400">No organizations found</p>
        </div>
      ) : null}
    </div>
  );
};

export default TopOrganizations;
