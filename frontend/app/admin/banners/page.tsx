'use client';

import { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { api } from '@/lib/utils';
import { IBanner } from '@/types/banner';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Checkbox } from '@/components/ui/checkbox';
import Image from 'next/image'; // Added Image import

export default function AdminBannersPage() {
  const [bannerImage, setBannerImage] = useState<File | null>(null);
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [banners, setBanners] = useState<IBanner[]>([]);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState<boolean>(false);
  const [currentBanner, setCurrentBanner] = useState<IBanner | null>(null);
  const [editBannerImage, setEditBannerImage] = useState<File | null>(null);
  const [editStartDate, setEditStartDate] = useState<string>('');
  const [editEndDate, setEditEndDate] = useState<string>('');
  const [editIsActive, setEditIsActive] = useState<boolean>(true);

  // Removed const router = useRouter();

  const fetchBanners = async () => {
    try {
      const res = await api.get(`/banners/all`);
      if (res.status === 200) {
        setBanners(res.data);
      } else {
        toast.error('Failed to fetch banners.');
      }
    } catch (error: unknown) { // Changed to unknown
      toast.error(error instanceof Error ? error.message : 'Error fetching banners.'); // Handled error type
    }
  };

  useEffect(() => {
    fetchBanners();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    if (!bannerImage || !startDate || !endDate) {
      toast.error('Please fill in all fields.');
      setLoading(false);
      return;
    }

    const formData = new FormData();
    formData.append('bannerImage', bannerImage);
    formData.append('startDate', startDate);
    formData.append('endDate', endDate);

    try {
      const res = await api.post(`/banners`, formData);

      if (res.status !== 201) {
        const errorData = res.data;
        throw new Error(errorData.message || 'Failed to create banner');
      }

      toast.success('Banner created successfully!');
      setBannerImage(null);
      setStartDate('');
      setEndDate('');
      fetchBanners(); // Refresh the list
    } catch (error: unknown) { // Changed to unknown
      toast.error(error instanceof Error ? error.message : 'An unexpected error occurred.'); // Handled error type
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this banner?')) {
      return;
    }
    try {
      const res = await api.delete(`/banners/${id}`);
      if (res.status === 200) {
        toast.success('Banner deleted successfully!');
        fetchBanners(); // Refresh the list
      } else {
        toast.error('Failed to delete banner.');
      }
    } catch (error: unknown) { // Changed to unknown
      toast.error(error instanceof Error ? error.message : 'Error deleting banner.'); // Handled error type
    }
  };

  const handleEditClick = (banner: IBanner) => {
    setCurrentBanner(banner);
    setEditStartDate(banner.startDate.split('T')[0]); // Format date for input
    setEditEndDate(banner.endDate.split('T')[0]);     // Format date for input
    setEditIsActive(banner.isActive);
    setEditBannerImage(null); // Clear previous image selection
    setIsEditDialogOpen(true);
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentBanner) return;

    const formData = new FormData();
    if (editBannerImage) {
      formData.append('bannerImage', editBannerImage);
    }
    formData.append('startDate', editStartDate);
    formData.append('endDate', editEndDate);
    formData.append('isActive', String(editIsActive));

    try {
      const res = await api.put(`/banners/${currentBanner._id}`, formData);
      if (res.status === 200) {
        toast.success('Banner updated successfully!');
        setIsEditDialogOpen(false);
        fetchBanners(); // Refresh the list
      } else {
        toast.error('Failed to update banner.');
      }
    } catch (error: unknown) { // Changed to unknown
      toast.error(error instanceof Error ? error.message : 'Error updating banner.'); // Handled error type
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Manage Banners</h1>

      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-3">Create New Banner</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="bannerImage">Banner Image</Label>
            <Input
              id="bannerImage"
              type="file"
              accept="image/*"
              onChange={(e) => setBannerImage(e.target.files ? e.target.files[0] : null)}
            />
          </div>
          <div>
            <Label htmlFor="startDate">Start Date</Label>
            <Input
              id="startDate"
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="endDate">End Date</Label>
            <Input
              id="endDate"
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
            />
          </div>
          <Button type="submit" disabled={loading}>
            {loading ? 'Creating...' : 'Create Banner'}
          </Button>
        </form>
      </div>

      <div>
        <h2 className="text-xl font-semibold mb-3">Existing Banners</h2>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Image</TableHead>
              <TableHead>Start Date</TableHead>
              <TableHead>End Date</TableHead>
              <TableHead>Active</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {banners.map((banner) => (
              <TableRow key={banner._id}>
                <TableCell>
                  <Image src={banner.imageUrl} alt="Banner" width={96} height={96} className="w-24 h-auto object-cover rounded" />
                </TableCell>
                <TableCell>{new Date(banner.startDate).toLocaleDateString()}</TableCell>
                <TableCell>{new Date(banner.endDate).toLocaleDateString()}</TableCell>
                <TableCell>{banner.isActive ? 'Yes' : 'No'}</TableCell>
                <TableCell>
                  <Button variant="outline" size="sm" className="mr-2" onClick={() => handleEditClick(banner)}>
                    Edit
                  </Button>
                  <Button variant="destructive" size="sm" onClick={() => handleDelete(banner._id)}>
                    Delete
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Edit Banner Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit Banner</DialogTitle>
          </DialogHeader>
          {currentBanner && (
            <form onSubmit={handleEditSubmit} className="grid gap-4 py-4">
              <div>
                <Label htmlFor="editBannerImage">New Banner Image (optional)</Label>
                <Input
                  id="editBannerImage"
                  type="file"
                  accept="image/*"
                  onChange={(e) => setEditBannerImage(e.target.files ? e.target.files[0] : null)}
                />
                {currentBanner.imageUrl && (
                  <Image src={currentBanner.imageUrl} alt="Current Banner" width={96} height={96} className="w-24 h-auto object-cover rounded mt-2" />
                )}
              </div>
              <div>
                <Label htmlFor="editStartDate">Start Date</Label>
                <Input
                  id="editStartDate"
                  type="date"
                  value={editStartDate}
                  onChange={(e) => setEditStartDate(e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="editEndDate">End Date</Label>
                <Input
                  id="editEndDate"
                  type="date"
                  value={editEndDate}
                  onChange={(e) => setEditEndDate(e.target.value)}
                />
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="editIsActive"
                  checked={editIsActive}
                  onCheckedChange={(checked) => setEditIsActive(Boolean(checked))}
                />
                <Label htmlFor="editIsActive">Is Active</Label>
              </div>
              <DialogFooter>
                <Button type="submit">Save changes</Button>
              </DialogFooter>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}