'use client';

import { useEffect, useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog'; 
import Image from 'next/image';
import { IBanner } from '@/types/banner';
import { api } from '@/lib/utils';

export default function BannerModal() {
  const [banners, setBanners] = useState<IBanner[]>([]);
  const [currentBannerIndex, setCurrentBannerIndex] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const [hasShownThisSession, setHasShownThisSession] = useState(false);

  useEffect(() => {
    const fetchBanners = async () => {
      try {
        const res = await api.get(`/banners`);
        if (res.status !== 200) {
          throw new Error('Failed to fetch banners');
        }
        const data: IBanner[] = res.data;
        setBanners(data);
        if (data.length > 0 && !hasShownThisSession) {
          setIsOpen(true);
          setHasShownThisSession(true);
        }
      } catch (error) {
        console.error('Error fetching banners:', error);
      }
    };

    fetchBanners();
  }, [hasShownThisSession]);

  

  if (banners.length === 0) {
    return null; // Don't render modal if no banners
  } 
  const currentBanner = banners[currentBannerIndex];

  return (
    <Dialog  open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent  className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle hidden >Banner</DialogTitle> 
          <DialogDescription hidden>
            Check out our latest offers and events.
          </DialogDescription>
        </DialogHeader>
        <div className="relative w-full h-60 m-0 p-0">
          <Image
            src={currentBanner.imageUrl}
            alt="Banner Image"
            layout="fill" 
            objectFit="cover"
            className="rounded-md"
          />
        </div> 
      </DialogContent>
    </Dialog>
  );
}
