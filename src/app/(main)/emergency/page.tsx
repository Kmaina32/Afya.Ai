
'use client';

import { emergencyServicesData } from '@/lib/emergency-services-data';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Phone, Globe } from "lucide-react";
import Link from "next/link";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

export default function EmergencyPage() {
  return (
    <div className="p-4 md:p-6 space-y-6">
      <header>
        <h1 className="text-3xl font-bold">Emergency Services</h1>
        <p className="text-muted-foreground mt-1">
          Quick access to critical emergency contacts in Kenya.
        </p>
      </header>

      <Accordion type="multiple" defaultValue={emergencyServicesData.map(e => e.category)} className="w-full space-y-4">
        {emergencyServicesData.map((category) => (
          <AccordionItem value={category.category} key={category.category} className="border-none">
             <AccordionTrigger className="text-2xl font-semibold px-4 py-3 bg-card rounded-lg hover:no-underline">
                {category.category}
              </AccordionTrigger>
             <AccordionContent className="pt-4">
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {category.services.map((service) => (
                    <Card key={service.name} className="flex flex-col">
                    <CardHeader>
                        <CardTitle>{service.name}</CardTitle>
                        <CardDescription>{service.description}</CardDescription>
                    </CardHeader>
                    <CardContent className="flex-grow flex flex-col justify-end gap-3">
                        <div className="space-y-2">
                        {service.phone.map((phone, index) => (
                             <Button asChild variant="outline" className="w-full" key={index}>
                                <Link href={`tel:${phone.replace(/\s/g, '')}`}>
                                    <Phone className="mr-2 h-4 w-4" /> Call {phone}
                                </Link>
                            </Button>
                        ))}
                        </div>
                        {service.website && (
                        <Button asChild className="w-full">
                            <Link href={service.website} target="_blank" rel="noopener noreferrer">
                                <Globe className="mr-2 h-4 w-4" /> Visit Website
                            </Link>
                        </Button>
                        )}
                    </CardContent>
                    </Card>>
                ))}
                </div>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
}
