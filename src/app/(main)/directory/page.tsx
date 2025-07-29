import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Phone, MapPin } from "lucide-react"

const facilities = [
  {
    name: "Aga Khan University Hospital, Nairobi",
    location: "3rd Parklands Ave, Nairobi",
    phone: "+254 20 366 2000",
    services: "Comprehensive care, specialized clinics, 24/7 emergency",
  },
  {
    name: "The Nairobi Hospital",
    location: "Argwings Kodhek Rd, Nairobi",
    phone: "+254 703 082 000",
    services: "Inpatient & outpatient care, cancer center, heart institute",
  },
  {
    name: "The Karen Hospital",
    location: "Langata - Karen Rd, Nairobi",
    phone: "+254 726 222 000",
    services: "Cardiac specialty, surgery, diagnostics, ICU",
  },
  {
    name: "Aga Khan Hospital, Mombasa",
    location: "Vanga Road, Mombasa",
    phone: "+254 41 222 7710",
    services: "General medicine, surgery, maternity, pediatrics",
  },
   {
    name: "The Mombasa Hospital",
    location: "Mama Ngina Dr, Mombasa",
    phone: "+254 722 205 650",
    services: "24-hour emergency, intensive care unit, renal unit",
  },
   {
    name: "Jaramogi Oginga Odinga Teaching & Referral Hospital",
    location: "Kisumu-Kakamega Road, Kisumu",
    phone: "+254 57 202 0991",
    services: "Public referral hospital, specialized medical training",
  },
];

export default function DirectoryPage() {
  return (
    <div className="p-4 md:p-6 space-y-4">
      <header>
        <h1 className="text-3xl font-bold">Healthcare Directory</h1>
        <p className="text-muted-foreground mt-1">
          Find top-rated health facilities across Kenya.
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
