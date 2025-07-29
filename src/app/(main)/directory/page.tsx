import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Phone, MapPin } from "lucide-react"

const facilities = [
  {
    name: "Afya Bora Clinic",
    location: "123 Afya St, Nairobi",
    phone: "+254 712 345 678",
    services: "General practice, vaccinations, maternity care",
  },
  {
    name: "Uzima Wellness Center",
    location: "456 Uzima Rd, Mombasa",
    phone: "+254 723 456 789",
    services: "Nutrition counseling, physiotherapy, lab tests",
  },
  {
    name: "Jamii Hospital",
    location: "789 Jamii Ave, Kisumu",
    phone: "+254 734 567 890",
    services: "Emergency services, surgery, pediatric care",
  },
  {
    name: "Maisha Medical Clinic",
    location: "101 Maisha Ln, Nakuru",
    phone: "+254 745 678 901",
    services: "Dental care, general check-ups, pharmacy",
  },
   {
    name: "Uhuru Medical Eldoret",
    location: "22 Uhuru Drive, Eldoret",
    phone: "+254 756 789 012",
    services: "Community health, chronic disease management",
  },
   {
    name: "Pwani Health Point",
    location: "33 Pwani Road, Malindi",
    phone: "+254 767 890 123",
    services: "Tropical diseases, travel medicine, first aid",
  },
];

export default function DirectoryPage() {
  return (
    <div className="p-4 md:p-6 space-y-4">
      <header>
        <h1 className="text-3xl font-bold">Healthcare Directory</h1>
        <p className="text-muted-foreground mt-1">
          Find health facilities near you. Note: This is a sample directory.
        </p>
      </header>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {facilities.map((facility) => (
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
                 <Button variant="outline" className="w-full">
                    <Phone className="mr-2 h-4 w-4" /> Call Now
                 </Button>
                 <Button className="w-full">
                    Get Directions
                 </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
