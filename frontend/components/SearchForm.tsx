"use client";
import { Search, Calendar, ArrowLeftRight } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Alert, AlertDescription } from '@/components/ui/alert';
import CityCombobox from './passenger/CityCombobox';
import { api } from '@/lib/utils';
import { useRouter } from 'next/navigation';
import { IRoute } from '@/types/route';

const SearchForm = () => {
  const router = useRouter();
  const [searchData, setSearchData] = useState({
    from: '',
    to: '',
    date: new Date().toISOString().split('T')[0],
  });

  const [cities, setCities] = useState<string[]>([]);
  const [isLoadingCities, setIsLoadingCities] = useState<boolean>(true);

  useEffect(() => {
    let mounted = true;
    api
      .get('/routes')
      .then((res) => {
        if (!mounted) return;
        const names = new Set<string>();
        (res.data || []).forEach((route: IRoute) => {
          if (route.stops && route.stops.length > 0) {
            names.add(route.stops[0].name);
            names.add(route.stops[route.stops.length - 1].name);
          }
        });
        setCities(Array.from(names).sort());
      })
      .catch(() => setCities([]))
      .finally(() => setIsLoadingCities(false));
    return () => {
      mounted = false;
    };
  }, []);

  const canSearch = useMemo(() => {
    return (
      searchData.from.trim().length > 0 &&
      searchData.to.trim().length > 0 &&
      searchData.from.trim().toLowerCase() !== searchData.to.trim().toLowerCase() &&
      !!searchData.date
    );
  }, [searchData]);

  const isSameCitySelected = useMemo(() => {
    return searchData.from && searchData.to &&
           searchData.from.trim().toLowerCase() === searchData.to.trim().toLowerCase();
  }, [searchData.from, searchData.to]);

  const swap = () => {
    setSearchData((s) => ({ ...s, from: s.to, to: s.from }));
  };

  const handleSearch = () => {
    const params = new URLSearchParams();
    params.set('from', searchData.from);
    params.set('to', searchData.to);
    params.set('date', searchData.date);
    router.push(`/trips?${params.toString()}`);
  };

  return (
    <div className="w-full bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 max-w-6xl mx-auto">
      <Card className="bg-card/20 backdrop-blur-sm border-border/20 shadow-2xl">
        <CardHeader>
            <CardTitle className="text-2xl font-bold text-center">Find Your Bus</CardTitle>
        </CardHeader>
        <CardContent className="p-6 md:p-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            <div className="space-y-2">
              <Label className="font-semibold">From</Label>
              <CityCombobox
                value={searchData.from}
                onChange={(v) => setSearchData({ ...searchData, from: v })}
                options={cities}
                placeholder={isLoadingCities ? 'Loading cities…' : 'Select departure city'}
              />
            </div>
            
            <div className="space-y-2">
              <Label className="font-semibold">To</Label>
              <CityCombobox
                value={searchData.to}
                onChange={(v) => setSearchData({ ...searchData, to: v })}
                options={cities}
                placeholder={isLoadingCities ? 'Loading cities…' : 'Select destination city'}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="journey-date" className="font-semibold flex items-center gap-2">
                <Calendar className="w-4 h-4 text-primary" />
                Journey Date
              </Label>
              <Input
                id="journey-date"
                type="date"
                value={searchData.date}
                onChange={(e) => setSearchData({ ...searchData, date: e.target.value })}
                min={new Date().toISOString().split('T')[0]}
                className="w-full"
              />
            </div>
          </div>

          <div className="flex justify-between items-center mt-6">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={swap}
              disabled={!searchData.from && !searchData.to}
            >
              <ArrowLeftRight className="w-4 h-4 mr-2" />
              Swap Cities
            </Button>
            
            {isSameCitySelected && (
              <Alert variant="destructive" className="w-auto py-2 px-3">
                <AlertDescription className="text-xs">
                  Departure and destination cannot be the same.
                </AlertDescription>
              </Alert>
            )}
          </div>
          
          <Button
            onClick={handleSearch}
            disabled={!canSearch}
            size="lg"
            className="w-full mt-8 font-bold text-lg"
          >
            <Search className="w-5 h-5 mr-3" />
            Search Buses
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default SearchForm;