'use client';

import React, { useState } from 'react';
import { ChevronDown, AlertCircle, CheckCircle2, Zap } from 'lucide-react';
import type { SystemHealth as SystemHealthType, CriticalError } from '../AdminOverview/types';
import { STATUS_COLORS } from '../AdminOverview/constants';
import { Role } from '@/types';

interface SystemHealthProps {
  data?: SystemHealthType;
}

const SystemHealth: React.FC<SystemHealthProps> = ({ data }) => {
  const [expandedError, setExpandedError] = useState<string | null>(null);

  const systemStatus = data?.systemStatus;
  const errors = data?.criticalErrorLogs ?? [];

  const getStatusBadge = (status?: string) => {
    if (!status) return null;
    const colors = STATUS_COLORS[status as keyof typeof STATUS_COLORS];
    const Icon = status === 'UP' ? CheckCircle2 : status === 'DOWN' ? AlertCircle : Zap;

    return (
      <div className={`flex items-center gap-2 px-3 py-1.5 rounded-lg ${colors}`}>
        <Icon className="w-4 h-4" />
        <span className="text-xs font-semibold">{status}</span>
      </div>
    );
  };

  const getErrorSeverity = (details?: string) => {
    if (!details) return 'info';
    if (details.includes('Foreign key') || details.includes('constraint')) return 'critical';
    if (details.includes('Unknown')) return 'warning';
    if (details.includes('Too many')) return 'warning';
    return 'info';
  };

  const errorCounts = {
    critical: errors?.filter((e) => getErrorSeverity(e?.details) === 'critical').length ?? 0,
    warning: errors?.filter((e) => getErrorSeverity(e?.details) === 'warning').length ?? 0,
    info: errors?.filter((e) => getErrorSeverity(e?.details) === 'info').length ?? 0,
  };

  return (
    <div className="rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950/40 p-6">
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">System Health</h3>
        <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
          Platform status and recent errors
        </p>
      </div>

      {/* System Status Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8 pb-8 border-b border-slate-200 dark:border-slate-800">
        <div className="bg-slate-50 dark:bg-slate-900/30 rounded-lg p-4">
          <p className="text-xs font-medium text-slate-600 dark:text-slate-400 uppercase mb-2">Database</p>
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-slate-900 dark:text-slate-100">
              {systemStatus?.database ?? 'Unknown'}
            </span>
            {getStatusBadge(systemStatus?.database)}
          </div>
        </div>

        <div className="bg-slate-50 dark:bg-slate-900/30 rounded-lg p-4">
          <p className="text-xs font-medium text-slate-600 dark:text-slate-400 uppercase mb-2">API</p>
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-slate-900 dark:text-slate-100">
              {systemStatus?.api ?? 'Unknown'}
            </span>
            {getStatusBadge(systemStatus?.api)}
          </div>
        </div>
      </div>

      {/* Error Summary */}
      <div className="grid grid-cols-3 gap-3 mb-6 pb-6 border-b border-slate-200 dark:border-slate-800">
        <div>
          <p className="text-xs font-medium text-slate-600 dark:text-slate-400 uppercase">Critical</p>
          <p className="text-2xl font-bold text-red-600 dark:text-red-400 mt-1">{errorCounts.critical}</p>
        </div>
        <div>
          <p className="text-xs font-medium text-slate-600 dark:text-slate-400 uppercase">Warnings</p>
          <p className="text-2xl font-bold text-yellow-600 dark:text-yellow-400 mt-1">{errorCounts.warning}</p>
        </div>
        <div>
          <p className="text-xs font-medium text-slate-600 dark:text-slate-400 uppercase">Total</p>
          <p className="text-2xl font-bold text-slate-900 dark:text-slate-100 mt-1">
            {errors?.length ?? 0}
          </p>
        </div>
      </div>

      {/* Error Logs */}
      <div>
        <h4 className="text-sm font-semibold text-slate-900 dark:text-slate-100 mb-3">Recent Errors</h4>

        {errors?.length ?? 0 > 0 ? (
          <div className="space-y-2">
            {errors?.slice(0, 5).map((error) => {
              const severity = getErrorSeverity(error?.details);
              const isExpanded = expandedError === error?.id;
              const severityColors = {
                critical: 'border-red-200 dark:border-red-900/30 bg-red-50 dark:bg-red-950/20',
                warning: 'border-yellow-200 dark:border-yellow-900/30 bg-yellow-50 dark:bg-yellow-950/20',
                info: 'border-blue-200 dark:border-blue-900/30 bg-blue-50 dark:bg-blue-950/20',
              };

              const severityIndicators = {
                critical: 'w-2 h-2 bg-red-600 dark:bg-red-400',
                warning: 'w-2 h-2 bg-yellow-600 dark:bg-yellow-400',
                info: 'w-2 h-2 bg-blue-600 dark:bg-blue-400',
              };

              return (
                <div
                  key={error?.id}
                  className={`${severityColors[severity]} rounded-lg border p-3 transition-all`}
                >
                  <button
                    onClick={() => setExpandedError(isExpanded ? null : error?.id)}
                    className="w-full flex items-start justify-between gap-3 text-left"
                  >
                    <div className="flex items-start gap-3 flex-1 min-w-0">
                      <div className={`${severityIndicators[severity]} rounded-full mt-1 shrink-0`} />
                      <div className="min-w-0 flex-1">
                        <p className="text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase">
                          {error?.action}
                        </p>
                        <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 line-clamp-1">
                          {error?.details?.substring(0, 60)}...
                        </p>
                      </div>
                    </div>
                    <ChevronDown
                      className={`w-4 h-4 text-slate-400 dark:text-slate-600 shrink-0 transition-transform ${
                        isExpanded ? 'rotate-180' : ''
                      }`}
                    />
                  </button>

                  {isExpanded && (
                    <div className="mt-3 pt-3 border-t border-slate-300/30 dark:border-slate-700/30">
                      <p className="text-xs text-slate-600 dark:text-slate-400 wrap-break-word">
                        {error?.details}
                      </p>
                      <div className="flex items-center gap-4 mt-2 text-xs text-slate-500 dark:text-slate-500">
                        <span>User: {error?.user?.name ?? 'N/A'} ({error?.user?.role === Role.ADMIN ? 'System Admin' : error?.user?.role?.replace('_', ' ') || 'N/A'})</span>
                        <span>Org: {error?.organization?.name ?? 'N/A'}</span>
                        <span>
                          {new Date(error?.createdAt ?? '').toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </span>
                        {
                          error?.metadata?.path && (
                            <span>Path: {error.metadata.path}</span>
                          )
                        }
                        {
                          error?.metadata?.ip && (
                            <span>IP: {error.metadata.ip}</span>
                          )
                        }
                        {
                          error?.metadata?.userAgent && (
                            <span title={error.metadata.userAgent}>User Agent: {error.metadata.userAgent?.slice(0, 30)}</span>
                          )
                        }

                       
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-8">
            <CheckCircle2 className="w-12 h-12 text-green-300 dark:text-green-900 mx-auto mb-2" />
            <p className="text-sm text-slate-500 dark:text-slate-400">No errors detected</p>
          </div>
        )}
      </div>

      {/* Last Checked */}
      {systemStatus?.checkedAt && (
        <div className="mt-4 text-xs text-slate-500 dark:text-slate-400">
          Last checked:{' '}
          {new Date(systemStatus.checkedAt).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
          })}
        </div>
      )}
    </div>
  );
};

export default SystemHealth;
