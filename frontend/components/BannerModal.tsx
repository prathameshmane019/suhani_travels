'use client';

import { useEffect, useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog'; 
import Image from 'next/image';
import { IBanner } from '@/types/banner';
import { api } from '@/lib/utils';

// Cache keys
const BANNER_CACHE_KEY = 'banners_cache';
const BANNER_SHOWN_KEY = 'banner_shown_session';
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

interface CachedData {
  data: IBanner[];
  timestamp: number;
}

export default function BannerModal() {
  const [banners, setBanners] = useState<IBanner[]>([]);
  const [currentBannerIndex, setCurrentBannerIndex] = useState(0);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    // Check if banner was already shown in this session
    const hasShownThisSession = sessionStorage.getItem(BANNER_SHOWN_KEY) === 'true';
    
    if (hasShownThisSession) {
      return; // Don't show banner again in this session
    }

    const fetchBanners = async () => {
      try {
        // Check cache first
        const cachedData = localStorage.getItem(BANNER_CACHE_KEY);
        let bannersData: IBanner[] = [];

        if (cachedData) {
          const parsed: CachedData = JSON.parse(cachedData);
          const isExpired = Date.now() - parsed.timestamp > CACHE_DURATION;
          
          if (!isExpired) {
            bannersData = parsed.data;
          }
        }

        // If no cache or expired, fetch from API
        if (bannersData.length === 0) {
          const res = await api.get(`/banners`);
          if (res.status !== 200) {
            throw new Error('Failed to fetch banners');
          }
          bannersData = res.data;
          
          // Cache the response
          const cacheData: CachedData = {
            data: bannersData,
            timestamp: Date.now()
          };
          localStorage.setItem(BANNER_CACHE_KEY, JSON.stringify(cacheData));
        }

        setBanners(bannersData);
        
        if (bannersData.length > 0) {
          setIsOpen(true);
          // Mark as shown in this session
          sessionStorage.setItem(BANNER_SHOWN_KEY, 'true');
        }
      } catch (error) {
        console.error('Error fetching banners:', error);
      }
    };

    fetchBanners();
  }, []);

  if (banners.length === 0) {
    return null; // Don't render modal if no banners
  } 
  const currentBanner = banners[currentBannerIndex];

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="p-0 m-0 overflow-hidden sm:max-w-[600px] lg:max-w-[800px] max-h-[90vh]">
        <DialogHeader className="sr-only">
          <DialogTitle>Banner</DialogTitle> 
          <DialogDescription>
            Check out our latest offers and events.
          </DialogDescription>
        </DialogHeader>
        <div className="relative w-full aspect-[16/9] min-h-[300px] max-h-[600px]">
          <Image
            src={currentBanner.imageUrl}
            alt="Banner Image"
            fill
            style={{ objectFit: 'cover' }}
            className="w-full h-full"
            priority
          />
        </div> 
      </DialogContent>
    </Dialog>
  );
}