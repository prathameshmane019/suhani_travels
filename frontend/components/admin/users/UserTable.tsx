'use client';

import { IUser } from '@/types/user';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { MoreHorizontal } from 'lucide-react';

interface UserTableProps {
  users: IUser[];
  onDelete: (id: string) => void;
  onEdit: (user: IUser) => void;
}

export const UserTable = ({ users, onDelete, onEdit }: UserTableProps) => {
  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead className="bg-muted/50">
          <tr>
            <th className="px-6 py-4 text-left text-sm font-medium text-muted-foreground">Name</th>
            <th className="px-6 py-4 text-left text-sm font-medium text-muted-foreground">Email</th>
            <th className="px-6 py-4 text-left text-sm font-medium text-muted-foreground">Role</th>
            <th className="px-6 py-4 text-left text-sm font-medium text-muted-foreground">Permissions</th>
            <th className="px-6 py-4 text-right text-sm font-medium text-muted-foreground">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border">
          {users.map((user) => (
            <tr key={user._id} className="hover:bg-muted/50">
              <td className="px-6 py-4 text-sm text-foreground">{user.name}</td>
              <td className="px-6 py-4 text-sm text-foreground">{user.email}</td>
              <td className="px-6 py-4 text-sm text-foreground">
                <Badge variant="secondary">{user.role}</Badge>
              </td>
            
              <td className="px-6 py-4 text-right">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0">
                      <span className="sr-only">Open menu</span>
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => onEdit(user)}>Edit</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => onDelete(user._id)}>Delete</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};