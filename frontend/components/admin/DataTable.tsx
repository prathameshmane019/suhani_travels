'use client';

import { useState } from 'react';
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';

interface Column<T> {
  header: string;
  accessor: keyof T | ((data: T) => React.ReactNode);
  className?: string;
  sortable?: boolean;
}

interface DataTableProps<T extends Record<string, unknown>> {
  data: T[];
  columns: Column<T>[];
  keyField: keyof T;
  onSort?: (field: keyof T, direction: 'asc' | 'desc') => void;
  pageSize?: number;
}

export function DataTable<T extends Record<string, unknown>>({
  data,
  columns,
  keyField,
  onSort,
  pageSize = 10,
}: DataTableProps<T>) {
  const [currentPage, setCurrentPage] = useState(1);
  const [sortField, setSortField] = useState<keyof T | null>(null);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

  const totalPages = Math.ceil(data.length / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const currentData = data.slice(startIndex, endIndex);

  const handleSort = (field: keyof T) => {
    const newDirection = sortField === field && sortDirection === 'asc' ? 'desc' : 'asc';
    setSortField(field);
    setSortDirection(newDirection);
    onSort?.(field, newDirection);
  };

  const renderCell = (item: T, column: Column<T>): React.ReactNode => {
    if (typeof column.accessor === 'function') {
      return column.accessor(item);
    }
    const value = item[column.accessor];
    return String(value);
  };

  return (
    <div className="overflow-hidden">
      {/* Mobile View */}
      <div className="sm:hidden">
        {currentData.map((item) => (
          <div
            key={String(item[keyField])}
            className="bg-white rounded-lg shadow-sm border border-slate-200 p-4 mb-4"
          >
            {columns.map((column, index) => (
              <div key={index} className="flex justify-between py-2 border-b last:border-b-0">
                <span className="text-sm font-medium text-slate-500">{column.header}</span>
                <span className="text-sm text-slate-900">{renderCell(item, column)}</span>
              </div>
            ))}
          </div>
        ))}
      </div>

      {/* Desktop View */}
      <div className="hidden sm:block">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50">
              <tr>
                {columns.map((column, index) => (
                  <th
                    key={index}
                    className={`px-6 py-4 text-left text-sm font-medium text-slate-500 ${
                      column.sortable ? 'cursor-pointer hover:text-slate-700' : ''
                    } ${column.className || ''}`}
                    onClick={() => column.sortable && handleSort(column.accessor as keyof T)}
                  >
                    {column.header}
                    {column.sortable && sortField === column.accessor && (
                      <span className="ml-2">
                        {sortDirection === 'asc' ? '↑' : '↓'}
                      </span>
                    )}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {currentData.map((item) => (
                <tr key={String(item[keyField])} className="hover:bg-slate-50">
                  {columns.map((column, index) => (
                    <td
                      key={index}
                      className={`px-6 py-4 text-sm text-slate-600 ${column.className || ''}`}
                    >
                      {renderCell(item, column)}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between px-4 py-3 border-t">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage(1)}
              disabled={currentPage === 1}
              className="p-1 rounded hover:bg-slate-100 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronsLeft className="w-5 h-5" />
            </button>
            <button
              onClick={() => setCurrentPage(currentPage - 1)}
              disabled={currentPage === 1}
              className="p-1 rounded hover:bg-slate-100 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <span className="text-sm text-slate-600">
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="p-1 rounded hover:bg-slate-100 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
            <button
              onClick={() => setCurrentPage(totalPages)}
              disabled={currentPage === totalPages}
              className="p-1 rounded hover:bg-slate-100 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronsRight className="w-5 h-5" />
            </button>
          </div>
          <div className="text-sm text-slate-600">
            Showing {startIndex + 1}-{Math.min(endIndex, data.length)} of {data.length} entries
          </div>
        </div>
      )}
    </div>
  );

  return (
    <div className="overflow-hidden">
      {/* Mobile View */}
      <div className="sm:hidden">
        {currentData.map((item) => (
          <div
            key={String(item[keyField])}
            className="bg-white rounded-lg shadow-sm border border-slate-200 p-4 mb-4"
          >
            {columns.map((column, index) => (
              <div key={index} className="flex justify-between py-2 border-b last:border-b-0">
                <span className="text-sm font-medium text-slate-500">{column.header}</span>
                <span className="text-sm text-slate-900">{renderCell(item, column)}</span>
              </div>
            ))}
          </div>
        ))}
      </div>

      {/* Desktop View */}
      <div className="hidden sm:block">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50">
              <tr>
                {columns.map((column, index) => (
                  <th
                    key={index}
                    className={`px-6 py-4 text-left text-sm font-medium text-slate-500 ${
                      column.sortable ? 'cursor-pointer hover:text-slate-700' : ''
                    } ${column.className || ''}`}
                    onClick={() => column.sortable && handleSort(column.accessor as keyof T)}
                  >
                    {column.header}
                    {column.sortable && sortField === column.accessor && (
                      <span className="ml-2">
                        {sortDirection === 'asc' ? '↑' : '↓'}
                      </span>
                    )}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {currentData.map((item) => (
                <tr key={String(item[keyField])} className="hover:bg-slate-50">
                  {columns.map((column, index) => (
                    <td
                      key={index}
                      className={`px-6 py-4 text-sm text-slate-600 ${column.className || ''}`}
                    >
                      {renderCell(item, column)}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between px-4 py-3 border-t">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage(1)}
              disabled={currentPage === 1}
              className="p-1 rounded hover:bg-slate-100 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronsLeft className="w-5 h-5" />
            </button>
            <button
              onClick={() => setCurrentPage(currentPage - 1)}
              disabled={currentPage === 1}
              className="p-1 rounded hover:bg-slate-100 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <span className="text-sm text-slate-600">
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="p-1 rounded hover:bg-slate-100 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
            <button
              onClick={() => setCurrentPage(totalPages)}
              disabled={currentPage === totalPages}
              className="p-1 rounded hover:bg-slate-100 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronsRight className="w-5 h-5" />
            </button>
          </div>
          <div className="text-sm text-slate-600">
            Showing {startIndex + 1}-{Math.min(endIndex, data.length)} of {data.length} entries
          </div>
        </div>
      )}
    </div>
  );
}
