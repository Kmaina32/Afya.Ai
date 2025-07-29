'use client';

import { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Phone, MapPin } from "lucide-react"
import { countyFacilities } from "@/lib/directory-data";
import Link from "next/link";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

type Facility = {
  name: string;
  location: string;
  phone: string;
  services: string;
  county: string;
};

export default function DirectoryPage() {
  const [selectedCounty, setSelectedCounty] = useState("All");

  const allFacilities: Facility[] = useMemo(() => {
    return countyFacilities.flatMap(county => 
      county.facilities.map(facility => ({
        ...facility,
        county: county.county,
      }))
    );
  }, []);

  const filteredFacilities = useMemo(() => {
    if (selectedCounty === "All") {
      return allFacilities;
    }
    return allFacilities.filter(facility => facility.county === selectedCounty);
  }, [selectedCounty, allFacilities]);
  
  const handleDirections = (facilityName: string, location: string) => {
    const query = encodeURIComponent(`${facilityName}, ${location}`);
    const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${query}`;
    window.open(googleMapsUrl, "_blank");
  };

  return (
    <div className="p-4 md:p-6 space-y-4">
      <header className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
            <h1 className="text-3xl font-bold">Healthcare Directory</h1>
            <p className="text-muted-foreground mt-1">
              Find health facilities across Kenya.
            </p>
        </div>
        <div className="w-full md:w-64">
            <Select onValueChange={setSelectedCounty} defaultValue="All">
                <SelectTrigger>
                    <SelectValue placeholder="Select a county" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="All">All Counties</SelectItem>
                    {countyFacilities.map((county) => (
                        <SelectItem key={county.county} value={county.county}>
                            {county.county}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>
        </div>
      </header>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 pt-4">
        {filteredFacilities.map((facility) => (
          <Card key={facility.name} className="flex flex-col">
            <CardHeader>
              <CardTitle>{facility.name}</CardTitle>
              <CardDescription>{facility.services}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 flex-grow flex flex-col justify-end">
              <div className="space-y-2">
                 <p className="text-sm font-medium text-primary">{facility.county} County</p>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <MapPin className="h-4 w-4 flex-shrink-0" />
                  <span>{facility.location}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Phone className="h-4 w-4 flex-shrink-0" />
                  <span>{facility.phone}</span>
                </div>
              </div>
              <div className="flex flex-col sm:flex-row gap-2 pt-4">
                <Button asChild variant="outline" className="w-full">
                  <Link href={`tel:${facility.phone}`}>
                    <Phone className="mr-2 h-4 w-4" /> Call Now
                  </Link>
                </Button>
                <Button className="w-full" onClick={() => handleDirections(facility.name, facility.location)}>
                  Get Directions
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
       {filteredFacilities.length === 0 && selectedCounty !== "All" && (
         <div className="text-center py-10">
            <p className="text-muted-foreground">No facilities found for {selectedCounty} county in our directory yet.</p>
         </div>
      )}
    </div>
  );
}
