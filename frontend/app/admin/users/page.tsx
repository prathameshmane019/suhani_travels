'use client'; 
import { useState, useEffect } from 'react';
import { Plus } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { UserTable } from '@/components/admin/users/UserTable';
import { UserForm } from '@/components/admin/users/UserForm';
import { IUser } from '@/types/user';
import { api } from '@/lib/utils';

const UsersPage = () => {
  const [users, setUsers] = useState<IUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<Partial<IUser> | undefined>(undefined);
  const [formMode, setFormMode] = useState<'create' | 'edit'>('create');

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await api.get('/admin-users');
        setUsers(res.data);
      } catch (error) {
        console.log(error);
        toast.error('Failed to fetch users');
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  const handleCreateUser = async (data: Partial<IUser>) => {
    try {
      const res = await api.post('/admin-users', data);
      setUsers([...users, res.data]);
      toast.success('User created successfully');
    } catch (error) {
        console.log(error);

      toast.error('Failed to create user');
    }
  };

  const handleUpdateUser = async (data: Partial<IUser>) => {
    try {
      const res = await api.put(`/admin-users/${data._id}`, data);
      setUsers(users.map((user) => (user._id === data._id ? res.data : user)));
      toast.success('User updated successfully');
    } catch (error) {
      toast.error('Failed to update user');
        console.log(error);

    }
  };

  const handleDeleteUser = async (id: string) => {
    try {
      await api.delete(`/admin-users/${id}`);
      setUsers(users.filter((user) => user._id !== id));
      toast.success('User deleted successfully');
    } catch (error) {
      toast.error('Failed to delete user');
        console.log(error);

    }
  };

  const openCreateForm = () => {
    setSelectedUser(undefined);
    setFormMode('create');
    setIsFormOpen(true);
  };

  const openEditForm = (user: IUser) => {
    setSelectedUser(user);
    setFormMode('edit');
    setIsFormOpen(true);
  };

  if (loading) {
    return <div className="text-center py-10">Loading users...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">All Users</h1>
          <p className="text-muted-foreground mt-2">Manage all user accounts (customers, admins, and support)</p>
        </div>
        <Button className="gap-2" onClick={openCreateForm}>
          <Plus className="w-4 h-4" />
          Add New User
        </Button>
      </div>

      <div className="bg-card rounded-2xl shadow-sm border border-border overflow-hidden">
        <div className="p-6 border-b border-border">
          <h2 className="text-xl font-bold text-foreground">All Users</h2>
        </div>
        <UserTable users={users} onDelete={handleDeleteUser} onEdit={openEditForm} />
      </div>

      <UserForm
        open={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSubmit={formMode === 'create' ? handleCreateUser : handleUpdateUser}
        initialData={selectedUser}
        mode={formMode}
      />
    </div>
  );
};

export default UsersPage;