'use client';

import type { BusFilters } from "@/types";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"; 

interface BusFiltersProps {
  filters: BusFilters;
  onFilterChange: (filters: BusFilters) => void;
}

export function BusFilters({ filters, onFilterChange }: BusFiltersProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <div className="relative">
        <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
        <Input
          type="text"
          placeholder="Search buses..."
          className="pl-9"
          value={filters.search}
          onChange={(e) => onFilterChange({ ...filters, search: e.target.value })}
        />
      </div>
      <Select
        value={filters.type}
        onValueChange={(value) => onFilterChange({ ...filters, type: value as BusFilters['type'] })}
      >
        <SelectTrigger>
          <SelectValue placeholder="All Types" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Types</SelectItem>
          <SelectItem value="ac-sleeper">AC Sleeper</SelectItem>
          <SelectItem value="non-ac-sleeper">Non-AC Sleeper</SelectItem>
          <SelectItem value="ac-seater">AC Seater</SelectItem>
          <SelectItem value="non-ac-seater">Non-AC Seater</SelectItem>
        </SelectContent>
      </Select>
      <Select
        value={filters.status}
        onValueChange={(value) => onFilterChange({ ...filters, status: value as BusFilters['status'] })}
      >
        <SelectTrigger>
          <SelectValue placeholder="All Status" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Status</SelectItem>
          <SelectItem value="active">Active</SelectItem>
          <SelectItem value="maintenance">Maintenance</SelectItem>
          <SelectItem value="inactive">Inactive</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}
