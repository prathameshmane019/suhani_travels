
'use client';
import React from 'react';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { ChevronDown } from 'lucide-react';

type SortBy = 'seat' | 'sequence' | 'name';
type SortOrder = 'asc' | 'desc';

interface SortOptionsProps {
  sortBy: SortBy;
  setSortBy: (sortBy: SortBy) => void;
  sortOrder: SortOrder;
  setSortOrder: (sortOrder: SortOrder) => void;
}

const SortOptions: React.FC<SortOptionsProps> = ({ sortBy, setSortBy, sortOrder, setSortOrder }) => {
  return (
    <div className="flex flex-wrap gap-2">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" className="flex items-center gap-2">
            Sort By: {sortBy.charAt(0).toUpperCase() + sortBy.slice(1)} <ChevronDown className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start">
          <DropdownMenuItem onClick={() => setSortBy('seat')}>Seat</DropdownMenuItem>
          <DropdownMenuItem onClick={() => setSortBy('sequence')}>Boarding Sequence</DropdownMenuItem>
          <DropdownMenuItem onClick={() => setSortBy('name')}>Passenger Name</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" className="flex items-center gap-2">
            Order: {sortOrder === 'asc' ? 'Asc' : 'Desc'} <ChevronDown className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start">
          <DropdownMenuItem onClick={() => setSortOrder('asc')}>Ascending</DropdownMenuItem>
          <DropdownMenuItem onClick={() => setSortOrder('desc')}>Descending</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default SortOptions;
