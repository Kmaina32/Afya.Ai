
'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Phone, MapPin } from "lucide-react"
import { countyFacilities } from "@/lib/directory-data";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import Link from "next/link";

export default function DirectoryPage() {
  
  const handleDirections = (facilityName: string, location: string) => {
    const query = encodeURIComponent(`${facilityName}, ${location}`);
    const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${query}`;
    window.open(googleMapsUrl, "_blank");
  };

  return (
    <div className="p-4 md:p-6 space-y-4">
      <header>
        <h1 className="text-3xl font-bold">Healthcare Directory</h1>
        <p className="text-muted-foreground mt-1">
          Find health facilities across Kenya, organized by county.
        </p>
      </header>
      <Accordion type="single" collapsible className="w-full">
        {countyFacilities.map((county) => (
          <AccordionItem value={county.county} key={county.county}>
            <AccordionTrigger className="text-xl font-semibold hover:no-underline">
                {county.county} ({county.facilities.length})
            </AccordionTrigger>
            <AccordionContent>
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 pt-4">
                    {county.facilities.map((facility) => (
                    <Card key={facility.name} className="flex flex-col">
                        <CardHeader>
                        <CardTitle>{facility.name}</CardTitle>
                        <CardDescription>{facility.services}</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-3 flex-grow flex flex-col justify-end">
                        <div className="space-y-2">
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
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
}
